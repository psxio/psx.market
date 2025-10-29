-- Add portfolio media and token tickers to 3D builders
UPDATE builders SET 
  portfolio_media = ARRAY['https://picsum.photos/seed/alex3d1/600/400', 'https://picsum.photos/seed/alex3d2/600/400', 'https://picsum.photos/seed/alex3d3/600/400', 'https://picsum.photos/seed/alex3d4/600/400'],
  token_gate_projects = ARRAY['$PRIME', '$GALA', '$BEAM', '$RONIN']
WHERE id = 'b3d001';

UPDATE builders SET 
  portfolio_media = ARRAY['https://picsum.photos/seed/maya3d1/600/400', 'https://picsum.photos/seed/maya3d2/600/400', 'https://picsum.photos/seed/maya3d3/600/400'],
  token_gate_projects = ARRAY['$APE', '$DEGEN', '$BONK', '$WIF']
WHERE id = 'b3d002';

UPDATE builders SET 
  portfolio_media = ARRAY['https://picsum.photos/seed/jordan3d1/600/400', 'https://picsum.photos/seed/jordan3d2/600/400'],
  token_gate_projects = ARRAY['$PEPE', '$WIF', '$POPCAT', '$BRETT']
WHERE id = 'b3d003';

UPDATE builders SET 
  portfolio_media = ARRAY['https://picsum.photos/seed/sophia3d1/600/400', 'https://picsum.photos/seed/sophia3d2/600/400', 'https://picsum.photos/seed/sophia3d3/600/400', 'https://picsum.photos/seed/sophia3d4/600/400'],
  token_gate_projects = ARRAY['$BLUR', '$LOOKS', '$X2Y2', '$OPENSEA']
WHERE id = 'b3d004';

-- Add to KOL builders
UPDATE builders SET 
  portfolio_media = ARRAY['partner:Blur', 'partner:Magic Eden', 'partner:Uniswap', 'partner:1inch', 'partner:PumpFun', 'partner:DexScreener', 'partner:CoinGecko', 'partner:DexTools'],
  token_gate_projects = ARRAY['$WIF', '$POPCAT', '$BONK', '$MEW', '$BRETT']
WHERE id = 'bkol001';

UPDATE builders SET 
  portfolio_media = ARRAY['partner:Tensor', 'partner:Raydium', 'partner:Jupiter', 'partner:PumpFun', 'partner:DexScreener', 'partner:Birdeye'],
  token_gate_projects = ARRAY['$DEGEN', '$BRETT', '$MOG', '$TOSHI']
WHERE id = 'bkol002';

UPDATE builders SET 
  portfolio_media = ARRAY['partner:Aerodrome', 'partner:Synthetix', 'partner:Velodrome', 'partner:Base'],
  token_gate_projects = ARRAY['$BASE', '$AERO', '$VIRTUAL', '$DEGEN']
WHERE id = 'bkol003';

UPDATE builders SET 
  portfolio_media = ARRAY['partner:PumpFun', 'partner:DexTools', 'partner:CoinMarketCap', 'partner:CoinGecko', 'partner:Birdeye', 'partner:DEXScreener'],
  token_gate_projects = ARRAY['$PEPE', '$SHIB', '$FLOKI', '$WOJAK', '$DOGE']
WHERE id = 'bkol004';

-- Add to Dev builders
UPDATE builders SET 
  token_gate_projects = ARRAY['$UNI', '$AAVE', '$COMP', '$CRV', '$MKR']
WHERE id = 'bdev001';

UPDATE builders SET 
  token_gate_projects = ARRAY['$OP', '$ARB', '$BASE', '$BLUR', '$LOOKS']
WHERE id = 'bdev002';

UPDATE builders SET 
  token_gate_projects = ARRAY['$SAFEMOON', '$SHIB', '$FLOKI', '$PEPE']
WHERE id = 'bdev003';

UPDATE builders SET 
  token_gate_projects = ARRAY['$JUP', '$JTO', '$BONK', '$WIF', '$PYTH']
WHERE id = 'bdev004';

-- Add to Marketing builders
UPDATE builders SET 
  token_gate_projects = ARRAY['$DEGEN', '$BRETT', '$TOSHI', '$BASE']
WHERE id = 'bmkt001';

UPDATE builders SET 
  token_gate_projects = ARRAY['$PEPE', '$WIF', '$POPCAT', '$MEW']
WHERE id = 'bmkt002';

UPDATE builders SET 
  token_gate_projects = ARRAY['$BASE', '$AERO', '$OP', '$ARB']
WHERE id = 'bmkt003';

-- Add to Graphic Design builders
UPDATE builders SET 
  portfolio_media = ARRAY['https://picsum.photos/seed/diana1/600/400', 'https://picsum.photos/seed/diana2/600/400', 'https://picsum.photos/seed/diana3/600/400'],
  token_gate_projects = ARRAY['$BLUR', '$LOOKS', '$OPENSEA', '$X2Y2']
WHERE id = 'bgfx001';

UPDATE builders SET 
  portfolio_media = ARRAY['https://picsum.photos/seed/pete1/600/400', 'https://picsum.photos/seed/pete2/600/400'],
  token_gate_projects = ARRAY['$UNI', '$AAVE', '$COMP']
WHERE id = 'bgfx002';

UPDATE builders SET 
  portfolio_media = ARRAY['https://picsum.photos/seed/max1/600/400', 'https://picsum.photos/seed/max2/600/400'],
  token_gate_projects = ARRAY['$DEGEN', '$BRETT', '$TOSHI']
WHERE id = 'bgfx003';

-- Add to Video Editing builders
UPDATE builders SET 
  portfolio_media = ARRAY['https://picsum.photos/seed/eddie1/600/400', 'https://picsum.photos/seed/eddie2/600/400', 'https://picsum.photos/seed/eddie3/600/400'],
  token_gate_projects = ARRAY['$PRIME', '$GALA', '$BEAM']
WHERE id = 'bvid001';

UPDATE builders SET 
  portfolio_media = ARRAY['https://picsum.photos/seed/clara1/600/400', 'https://picsum.photos/seed/clara2/600/400'],
  token_gate_projects = ARRAY['$APE', '$AZUKI', '$PUDGY']
WHERE id = 'bvid002';

UPDATE builders SET 
  portfolio_media = ARRAY['https://picsum.photos/seed/tommy1/600/400', 'https://picsum.photos/seed/tommy2/600/400'],
  token_gate_projects = ARRAY['$PEPE', '$WIF', '$DOGE', '$SHIB']
WHERE id = 'bvid003';

-- Add to Social Media builders
UPDATE builders SET 
  token_gate_projects = ARRAY['$BASE', '$DEGEN', '$BRETT']
WHERE id = 'bsoc001';

UPDATE builders SET 
  token_gate_projects = ARRAY['$BRETT', '$TOSHI', '$MOG']
WHERE id = 'bsoc002';

-- Add to Mods & Raiders
UPDATE builders SET 
  token_gate_projects = ARRAY['$DEGEN', '$BRETT', '$TOSHI']
WHERE id = 'bmod001';

UPDATE builders SET 
  token_gate_projects = ARRAY['$PEPE', '$WIF', '$POPCAT']
WHERE id = 'bmod002';

-- Add to Volume Services
UPDATE builders SET 
  token_gate_projects = ARRAY['$UNI', '$SUSHI', '$CAKE']
WHERE id = 'bvol001';

UPDATE builders SET 
  token_gate_projects = ARRAY['$AERO', '$VELODROME', '$BASE']
WHERE id = 'bvol002';

-- Add to Strategy
UPDATE builders SET 
  token_gate_projects = ARRAY['$UNI', '$AAVE', '$COMP', '$MKR']
WHERE id = 'bstr001';

UPDATE builders SET 
  token_gate_projects = ARRAY['$CURVE', '$CVX', '$CRV']
WHERE id = 'bstr002';

-- Add to Documentation
UPDATE builders SET 
  token_gate_projects = ARRAY['$ETH', '$BTC', '$LINK']
WHERE id = 'bdoc001';

UPDATE builders SET 
  token_gate_projects = ARRAY['$USDC', '$USDT', '$DAI']
WHERE id = 'bdoc002';

-- Add to Grants
UPDATE builders SET 
  token_gate_projects = ARRAY['$OP', '$ARB', '$BASE', '$MATIC']
WHERE id = 'bgrn001';

UPDATE builders SET 
  token_gate_projects = ARRAY['$MATIC', '$AVAX', '$SOL']
WHERE id = 'bgrn002';
