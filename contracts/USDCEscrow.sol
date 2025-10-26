// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title USDCEscrow
 * @dev Milestone-based escrow contract for USDC payments on Base blockchain
 * @notice Supports milestone releases, dispute resolution, and automated refunds
 */
contract USDCEscrow is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdc;
    uint256 public platformFeePercent = 250; // 2.5% in basis points (250/10000)
    address public platformWallet;
    uint256 public constant DISPUTE_WINDOW = 7 days;
    uint256 public constant ARBITER_RESPONSE_TIME = 14 days;

    enum OrderStatus { ACTIVE, COMPLETED, CANCELLED, DISPUTED }
    enum DisputeOutcome { NONE, CLIENT_WINS, BUILDER_WINS, PARTIAL }
    enum MilestoneStatus { PENDING, SUBMITTED, APPROVED, PAID, DISPUTED }

    struct Milestone {
        uint256 amount;
        string description;
        MilestoneStatus status;
        uint256 submittedAt;
        uint256 approvalDeadline;
    }

    struct Order {
        string orderId;
        address client;
        address builder;
        uint256 totalAmount;
        uint256 platformFee;
        uint256 releasedAmount;
        OrderStatus status;
        bool inDispute;
        uint256 disputeRaisedAt;
        Milestone[] milestones;
    }

    mapping(string => Order) public orders;
    mapping(string => bool) public orderExists;

    event EscrowCreated(
        string indexed orderId,
        address indexed client,
        address indexed builder,
        uint256 totalAmount,
        uint256 platformFee
    );

    event MilestoneSubmitted(
        string indexed orderId,
        uint256 milestoneIndex,
        uint256 timestamp
    );

    event MilestoneApproved(
        string indexed orderId,
        uint256 milestoneIndex,
        uint256 amount
    );

    event MilestonePaid(
        string indexed orderId,
        uint256 milestoneIndex,
        uint256 amount,
        address indexed builder
    );

    event DisputeRaised(
        string indexed orderId,
        address indexed initiator,
        uint256 timestamp
    );

    event DisputeResolved(
        string indexed orderId,
        DisputeOutcome outcome,
        uint256 clientAmount,
        uint256 builderAmount
    );

    event OrderRefunded(
        string indexed orderId,
        address indexed client,
        uint256 amount
    );

    event PlatformFeeUpdated(uint256 newFeePercent);

    constructor(address _usdcAddress, address _platformWallet) Ownable(msg.sender) {
        require(_usdcAddress != address(0), "Invalid USDC address");
        require(_platformWallet != address(0), "Invalid platform wallet");
        usdc = IERC20(_usdcAddress);
        platformWallet = _platformWallet;
    }

    /**
     * @dev Create new escrow order with milestones
     * @param _orderId Unique order identifier
     * @param _builder Builder's wallet address
     * @param _totalAmount Total USDC amount (in 6 decimals)
     * @param _milestoneAmounts Array of milestone amounts
     * @param _milestoneDescriptions Array of milestone descriptions
     * @param _milestoneDeadlines Array of approval deadlines for each milestone
     */
    function createEscrow(
        string memory _orderId,
        address _builder,
        uint256 _totalAmount,
        uint256[] memory _milestoneAmounts,
        string[] memory _milestoneDescriptions,
        uint256[] memory _milestoneDeadlines
    ) external nonReentrant {
        require(!orderExists[_orderId], "Order already exists");
        require(_builder != address(0), "Invalid builder address");
        require(_builder != msg.sender, "Builder cannot be client");
        require(_totalAmount > 0, "Amount must be positive");
        require(
            _milestoneAmounts.length == _milestoneDescriptions.length &&
            _milestoneAmounts.length == _milestoneDeadlines.length,
            "Milestone arrays length mismatch"
        );

        uint256 totalMilestones = 0;
        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            require(_milestoneAmounts[i] > 0, "Invalid milestone amount");
            totalMilestones += _milestoneAmounts[i];
        }
        require(totalMilestones == _totalAmount, "Milestone sum must equal total");

        uint256 platformFee = (_totalAmount * platformFeePercent) / 10000;
        uint256 totalWithFee = _totalAmount + platformFee;

        usdc.safeTransferFrom(msg.sender, address(this), totalWithFee);

        Order storage order = orders[_orderId];
        order.orderId = _orderId;
        order.client = msg.sender;
        order.builder = _builder;
        order.totalAmount = _totalAmount;
        order.platformFee = platformFee;
        order.releasedAmount = 0;
        order.status = OrderStatus.ACTIVE;
        order.inDispute = false;

        for (uint256 i = 0; i < _milestoneAmounts.length; i++) {
            order.milestones.push(Milestone({
                amount: _milestoneAmounts[i],
                description: _milestoneDescriptions[i],
                status: MilestoneStatus.PENDING,
                submittedAt: 0,
                approvalDeadline: _milestoneDeadlines[i]
            }));
        }

        orderExists[_orderId] = true;

        emit EscrowCreated(_orderId, msg.sender, _builder, _totalAmount, platformFee);
    }

    /**
     * @dev Builder submits milestone for approval
     * @param _orderId Order identifier
     * @param _milestoneIndex Index of milestone to submit
     */
    function submitMilestone(
        string memory _orderId,
        uint256 _milestoneIndex
    ) external {
        Order storage order = orders[_orderId];
        require(orderExists[_orderId], "Order does not exist");
        require(msg.sender == order.builder, "Only builder can submit");
        require(order.status == OrderStatus.ACTIVE, "Order not active");
        require(!order.inDispute, "Order disputed");
        require(_milestoneIndex < order.milestones.length, "Invalid milestone index");

        Milestone storage milestone = order.milestones[_milestoneIndex];
        require(milestone.status == MilestoneStatus.PENDING, "Milestone not pending");

        milestone.status = MilestoneStatus.SUBMITTED;
        milestone.submittedAt = block.timestamp;

        emit MilestoneSubmitted(_orderId, _milestoneIndex, block.timestamp);
    }

    /**
     * @dev Client approves milestone
     * @param _orderId Order identifier
     * @param _milestoneIndex Index of milestone to approve
     */
    function approveMilestone(
        string memory _orderId,
        uint256 _milestoneIndex
    ) external nonReentrant {
        Order storage order = orders[_orderId];
        require(orderExists[_orderId], "Order does not exist");
        require(msg.sender == order.client, "Only client can approve");
        require(order.status == OrderStatus.ACTIVE, "Order not active");
        require(!order.inDispute, "Order disputed");
        require(_milestoneIndex < order.milestones.length, "Invalid milestone index");

        Milestone storage milestone = order.milestones[_milestoneIndex];
        require(
            milestone.status == MilestoneStatus.SUBMITTED,
            "Milestone not submitted"
        );

        milestone.status = MilestoneStatus.APPROVED;

        emit MilestoneApproved(_orderId, _milestoneIndex, milestone.amount);

        // Auto-release payment
        _releaseMilestonePayment(_orderId, _milestoneIndex);
    }

    /**
     * @dev Auto-approve milestone after deadline passes
     * @param _orderId Order identifier
     * @param _milestoneIndex Index of milestone to auto-approve
     */
    function autoApproveMilestone(
        string memory _orderId,
        uint256 _milestoneIndex
    ) external nonReentrant {
        Order storage order = orders[_orderId];
        require(orderExists[_orderId], "Order does not exist");
        require(order.status == OrderStatus.ACTIVE, "Order not active");
        require(!order.inDispute, "Order disputed");
        require(_milestoneIndex < order.milestones.length, "Invalid milestone index");

        Milestone storage milestone = order.milestones[_milestoneIndex];
        require(
            milestone.status == MilestoneStatus.SUBMITTED,
            "Milestone not submitted"
        );
        require(
            block.timestamp >= milestone.submittedAt + milestone.approvalDeadline,
            "Approval deadline not reached"
        );

        milestone.status = MilestoneStatus.APPROVED;

        emit MilestoneApproved(_orderId, _milestoneIndex, milestone.amount);

        // Auto-release payment
        _releaseMilestonePayment(_orderId, _milestoneIndex);
    }

    /**
     * @dev Internal function to release milestone payment to builder
     */
    function _releaseMilestonePayment(
        string memory _orderId,
        uint256 _milestoneIndex
    ) internal {
        Order storage order = orders[_orderId];
        Milestone storage milestone = order.milestones[_milestoneIndex];

        require(milestone.status == MilestoneStatus.APPROVED, "Not approved");
        require(milestone.status != MilestoneStatus.PAID, "Already paid");

        milestone.status = MilestoneStatus.PAID;
        order.releasedAmount += milestone.amount;

        usdc.safeTransfer(order.builder, milestone.amount);

        emit MilestonePaid(_orderId, _milestoneIndex, milestone.amount, order.builder);

        // Check if all milestones are paid
        bool allPaid = true;
        for (uint256 i = 0; i < order.milestones.length; i++) {
            if (order.milestones[i].status != MilestoneStatus.PAID) {
                allPaid = false;
                break;
            }
        }

        if (allPaid) {
            order.status = OrderStatus.COMPLETED;
            // Transfer platform fee
            usdc.safeTransfer(platformWallet, order.platformFee);
        }
    }

    /**
     * @dev Raise a dispute on an order
     * @param _orderId Order identifier
     */
    function raiseDispute(string memory _orderId) external {
        Order storage order = orders[_orderId];
        require(orderExists[_orderId], "Order does not exist");
        require(
            msg.sender == order.client || msg.sender == order.builder,
            "Not authorized"
        );
        require(order.status == OrderStatus.ACTIVE, "Order not active");
        require(!order.inDispute, "Dispute already raised");

        order.inDispute = true;
        order.disputeRaisedAt = block.timestamp;
        order.status = OrderStatus.DISPUTED;

        emit DisputeRaised(_orderId, msg.sender, block.timestamp);
    }

    /**
     * @dev Resolve dispute (admin/arbitrator only)
     * @param _orderId Order identifier
     * @param _outcome Dispute outcome
     * @param _clientPercentage Percentage for client (0-10000 basis points)
     */
    function resolveDispute(
        string memory _orderId,
        DisputeOutcome _outcome,
        uint256 _clientPercentage
    ) external onlyOwner nonReentrant {
        Order storage order = orders[_orderId];
        require(orderExists[_orderId], "Order does not exist");
        require(order.inDispute, "No active dispute");
        require(
            block.timestamp <= order.disputeRaisedAt + ARBITER_RESPONSE_TIME,
            "Dispute resolution expired"
        );
        require(_clientPercentage <= 10000, "Invalid percentage");

        uint256 remainingAmount = order.totalAmount - order.releasedAmount;
        uint256 clientAmount = 0;
        uint256 builderAmount = 0;

        if (_outcome == DisputeOutcome.CLIENT_WINS) {
            clientAmount = remainingAmount;
        } else if (_outcome == DisputeOutcome.BUILDER_WINS) {
            builderAmount = remainingAmount;
        } else if (_outcome == DisputeOutcome.PARTIAL) {
            clientAmount = (remainingAmount * _clientPercentage) / 10000;
            builderAmount = remainingAmount - clientAmount;
        }

        if (clientAmount > 0) {
            usdc.safeTransfer(order.client, clientAmount);
        }
        if (builderAmount > 0) {
            usdc.safeTransfer(order.builder, builderAmount);
        }

        // Transfer platform fee
        usdc.safeTransfer(platformWallet, order.platformFee);

        order.status = OrderStatus.CANCELLED;
        order.inDispute = false;

        emit DisputeResolved(_orderId, _outcome, clientAmount, builderAmount);
    }

    /**
     * @dev Refund order to client (before any milestones paid)
     * @param _orderId Order identifier
     */
    function refundOrder(string memory _orderId) external nonReentrant {
        Order storage order = orders[_orderId];
        require(orderExists[_orderId], "Order does not exist");
        require(
            msg.sender == order.client || msg.sender == owner(),
            "Not authorized"
        );
        require(order.status == OrderStatus.ACTIVE, "Order not active");
        require(order.releasedAmount == 0, "Funds already released");
        require(!order.inDispute, "Order disputed");

        uint256 refundAmount = order.totalAmount + order.platformFee;
        
        usdc.safeTransfer(order.client, refundAmount);

        order.status = OrderStatus.CANCELLED;

        emit OrderRefunded(_orderId, order.client, refundAmount);
    }

    /**
     * @dev Update platform fee percentage (owner only)
     * @param _newFeePercent New fee percentage in basis points
     */
    function updatePlatformFee(uint256 _newFeePercent) external onlyOwner {
        require(_newFeePercent <= 1000, "Fee too high"); // Max 10%
        platformFeePercent = _newFeePercent;
        emit PlatformFeeUpdated(_newFeePercent);
    }

    /**
     * @dev Update platform wallet address (owner only)
     * @param _newPlatformWallet New platform wallet address
     */
    function updatePlatformWallet(address _newPlatformWallet) external onlyOwner {
        require(_newPlatformWallet != address(0), "Invalid address");
        platformWallet = _newPlatformWallet;
    }

    /**
     * @dev Get order details
     */
    function getOrder(string memory _orderId) external view returns (
        address client,
        address builder,
        uint256 totalAmount,
        uint256 platformFee,
        uint256 releasedAmount,
        OrderStatus status,
        bool inDispute,
        uint256 milestoneCount
    ) {
        Order storage order = orders[_orderId];
        return (
            order.client,
            order.builder,
            order.totalAmount,
            order.platformFee,
            order.releasedAmount,
            order.status,
            order.inDispute,
            order.milestones.length
        );
    }

    /**
     * @dev Get milestone details
     */
    function getMilestone(string memory _orderId, uint256 _milestoneIndex) external view returns (
        uint256 amount,
        string memory description,
        MilestoneStatus status,
        uint256 submittedAt,
        uint256 approvalDeadline
    ) {
        require(orderExists[_orderId], "Order does not exist");
        Order storage order = orders[_orderId];
        require(_milestoneIndex < order.milestones.length, "Invalid milestone index");

        Milestone storage milestone = order.milestones[_milestoneIndex];
        return (
            milestone.amount,
            milestone.description,
            milestone.status,
            milestone.submittedAt,
            milestone.approvalDeadline
        );
    }
}
