CREATE TABLE "admins" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"role" text DEFAULT 'admin' NOT NULL,
	"last_login" text,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "admins_username_unique" UNIQUE("username"),
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "builder_activity_feed" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"builder_id" varchar NOT NULL,
	"activity_type" text NOT NULL,
	"activity_data" text,
	"metadata" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "builder_application_revisions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" varchar NOT NULL,
	"revision_number" integer NOT NULL,
	"changes_requested" text NOT NULL,
	"revision_notes" text,
	"submitted_data" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"requested_by" varchar NOT NULL,
	"requested_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"resubmitted_at" text,
	"reviewed_at" text
);
--> statement-breakpoint
CREATE TABLE "builder_applications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_address" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"bio" text NOT NULL,
	"category" text NOT NULL,
	"portfolio_links" text[],
	"years_experience" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"submitted_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"reviewer_notes" text,
	"twitter_handle" text,
	"twitter_followers" integer,
	"instagram_handle" text,
	"instagram_followers" integer,
	"youtube_channel" text,
	"youtube_subscribers" integer,
	"engagement_rate" numeric(5, 2),
	"content_niches" text[],
	"software_3d" text[],
	"render_engines" text[],
	"style_specialties" text[],
	"marketing_platforms" text[],
	"growth_strategies" text[],
	"case_study_links" text[],
	"programming_languages" text[],
	"blockchain_frameworks" text[],
	"github_profile" text,
	"trading_experience" integer,
	"volume_capabilities" text,
	"compliance_knowledge" boolean
);
--> statement-breakpoint
CREATE TABLE "builder_badges" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"builder_id" varchar NOT NULL,
	"badge_type" text NOT NULL,
	"badge_label" text NOT NULL,
	"badge_icon" text,
	"badge_color" text,
	"earned_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"expires_at" text,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "builder_follows" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" varchar NOT NULL,
	"builder_id" varchar NOT NULL,
	"followed_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "builder_onboarding" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"builder_id" varchar NOT NULL,
	"application_id" varchar NOT NULL,
	"step_profile_complete" boolean DEFAULT false NOT NULL,
	"step_services_added" boolean DEFAULT false NOT NULL,
	"step_portfolio_added" boolean DEFAULT false NOT NULL,
	"step_payment_setup" boolean DEFAULT false NOT NULL,
	"step_verification_complete" boolean DEFAULT false NOT NULL,
	"completion_percentage" integer DEFAULT 0 NOT NULL,
	"is_complete" boolean DEFAULT false NOT NULL,
	"completed_at" text,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "builder_projects" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"builder_id" varchar NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"client_name" text,
	"project_date" text NOT NULL,
	"media_urls" text[],
	"video_url" text,
	"live_url" text,
	"results" text[],
	"metrics_achieved" text,
	"twitter_reach" integer,
	"engagement_generated" integer,
	"followers_gained" integer,
	"impressions" integer,
	"roi_percentage" numeric(5, 2),
	"revenue_generated" numeric(12, 2),
	"conversion_rate" numeric(5, 2),
	"contract_address" text,
	"audit_score" integer,
	"volume_delivered" numeric(15, 2),
	"testimonial" text,
	"testimonial_author" text,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "builder_testimonials" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"builder_id" varchar NOT NULL,
	"client_id" varchar NOT NULL,
	"order_id" varchar,
	"content" text NOT NULL,
	"author_name" text NOT NULL,
	"author_title" text,
	"author_image" text,
	"rating" numeric(3, 2),
	"is_featured" boolean DEFAULT false NOT NULL,
	"is_approved" boolean DEFAULT false NOT NULL,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "builder_views" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"builder_id" varchar NOT NULL,
	"viewer_id" varchar,
	"viewer_type" text,
	"ip_address" text,
	"user_agent" text,
	"referrer" text,
	"viewed_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "builders" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_address" text NOT NULL,
	"name" text NOT NULL,
	"headline" text NOT NULL,
	"bio" text NOT NULL,
	"profile_image" text,
	"verified" boolean DEFAULT false NOT NULL,
	"category" text NOT NULL,
	"rating" numeric(3, 2) DEFAULT '0',
	"review_count" integer DEFAULT 0 NOT NULL,
	"completed_projects" integer DEFAULT 0 NOT NULL,
	"response_time" text DEFAULT '24 hours',
	"twitter_handle" text,
	"twitter_followers" integer,
	"portfolio_links" text[],
	"skills" text[],
	"psx_tier" text DEFAULT 'bronze' NOT NULL,
	"portfolio_media" text[],
	"video_showreel" text,
	"instagram_handle" text,
	"instagram_followers" integer,
	"youtube_channel" text,
	"youtube_subscribers" integer,
	"telegram_handle" text,
	"telegram_members" integer,
	"engagement_rate" numeric(5, 2),
	"audience_demographics" text,
	"content_niches" text[],
	"brand_partnerships" text[],
	"software_3d" text[],
	"render_engines" text[],
	"style_specialties" text[],
	"animation_expertise" boolean,
	"marketing_platforms" text[],
	"growth_strategies" text[],
	"case_studies" text[],
	"avg_roi" numeric(5, 2),
	"client_industries" text[],
	"programming_languages" text[],
	"blockchain_frameworks" text[],
	"github_profile" text,
	"deployed_contracts" text[],
	"audit_reports" text[],
	"certifications" text[],
	"trading_experience" integer,
	"volume_capabilities" text,
	"dex_expertise" text[],
	"cex_expertise" text[],
	"compliance_knowledge" boolean,
	"volume_proof" text[],
	"accepting_orders" boolean DEFAULT true NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"avg_response_time_hours" integer DEFAULT 24,
	"total_earnings" numeric(10, 2) DEFAULT '0',
	"available_balance" numeric(10, 2) DEFAULT '0',
	"pending_payouts" numeric(10, 2) DEFAULT '0',
	"success_rate" numeric(5, 2) DEFAULT '100',
	"on_time_delivery_rate" numeric(5, 2) DEFAULT '100',
	"active_orders" integer DEFAULT 0 NOT NULL,
	"last_active_at" text,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "builders_wallet_address_unique" UNIQUE("wallet_address")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text NOT NULL,
	"icon" text NOT NULL,
	"builder_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "categories_name_unique" UNIQUE("name"),
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "chat_threads" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" varchar NOT NULL,
	"builder_id" varchar NOT NULL,
	"order_id" varchar,
	"title" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"last_message_at" text,
	"last_message_preview" text,
	"client_unread_count" integer DEFAULT 0 NOT NULL,
	"builder_unread_count" integer DEFAULT 0 NOT NULL,
	"archived_by_client" boolean DEFAULT false NOT NULL,
	"archived_by_builder" boolean DEFAULT false NOT NULL,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_address" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company_name" text,
	"bio" text,
	"profile_image" text,
	"verified" boolean DEFAULT false NOT NULL,
	"psx_tier" text DEFAULT 'bronze' NOT NULL,
	"project_type" text,
	"budget_range" text,
	"interested_categories" text[],
	"project_timeline" text,
	"project_description" text,
	"experience_level" text,
	"referral_source" text,
	"website_url" text,
	"twitter_handle" text,
	"telegram_handle" text,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "clients_wallet_address_unique" UNIQUE("wallet_address")
);
--> statement-breakpoint
CREATE TABLE "disputes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_id" varchar NOT NULL,
	"order_id" varchar NOT NULL,
	"raised_by" varchar NOT NULL,
	"raised_by_type" text NOT NULL,
	"reason" text NOT NULL,
	"description" text NOT NULL,
	"evidence" text[],
	"status" text DEFAULT 'open' NOT NULL,
	"resolution" text,
	"resolved_by" varchar,
	"resolved_at" text,
	"refund_amount" numeric(10, 2),
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_number" text NOT NULL,
	"payment_id" varchar NOT NULL,
	"order_id" varchar NOT NULL,
	"client_id" varchar NOT NULL,
	"builder_id" varchar NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"platform_fee" numeric(10, 2) NOT NULL,
	"builder_amount" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"due_date" text,
	"paid_at" text,
	"billing_email" text,
	"billing_address" text,
	"notes" text,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "message_attachments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_id" varchar NOT NULL,
	"file_name" text NOT NULL,
	"file_url" text NOT NULL,
	"file_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"thumbnail_url" text,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message_read_receipts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"message_id" varchar NOT NULL,
	"thread_id" varchar NOT NULL,
	"reader_id" varchar NOT NULL,
	"reader_type" text NOT NULL,
	"read_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" varchar NOT NULL,
	"sender_id" varchar NOT NULL,
	"sender_type" text NOT NULL,
	"content" text NOT NULL,
	"message_type" text DEFAULT 'text' NOT NULL,
	"edited" boolean DEFAULT false NOT NULL,
	"edited_at" text,
	"deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" text,
	"reply_to_id" varchar,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "milestone_payments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_id" varchar NOT NULL,
	"milestone_id" varchar NOT NULL,
	"order_id" varchar NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"percentage" numeric(5, 2) NOT NULL,
	"status" text DEFAULT 'locked' NOT NULL,
	"transaction_hash" text,
	"released_at" text,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "milestones" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" varchar NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"due_date" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"completed_at" text,
	"transaction_hash" text,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_preferences" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"user_type" text NOT NULL,
	"email_order_updates" boolean DEFAULT true NOT NULL,
	"email_messages" boolean DEFAULT true NOT NULL,
	"email_reviews" boolean DEFAULT true NOT NULL,
	"email_payments" boolean DEFAULT true NOT NULL,
	"email_marketing" boolean DEFAULT false NOT NULL,
	"push_order_updates" boolean DEFAULT true NOT NULL,
	"push_messages" boolean DEFAULT true NOT NULL,
	"push_reviews" boolean DEFAULT true NOT NULL,
	"push_payments" boolean DEFAULT true NOT NULL,
	"in_app_order_updates" boolean DEFAULT true NOT NULL,
	"in_app_messages" boolean DEFAULT true NOT NULL,
	"in_app_reviews" boolean DEFAULT true NOT NULL,
	"in_app_payments" boolean DEFAULT true NOT NULL,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "notification_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipient_id" varchar NOT NULL,
	"recipient_type" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"action_url" text,
	"related_entity_id" varchar,
	"related_entity_type" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" text,
	"email_sent" boolean DEFAULT false NOT NULL,
	"push_sent" boolean DEFAULT false NOT NULL,
	"metadata" text,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_activities" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" varchar NOT NULL,
	"actor_id" varchar NOT NULL,
	"actor_type" text NOT NULL,
	"activity_type" text NOT NULL,
	"description" text NOT NULL,
	"metadata" text,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_revisions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" varchar NOT NULL,
	"requested_by" varchar NOT NULL,
	"revision_number" integer NOT NULL,
	"request_details" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"delivery_url" text,
	"delivery_notes" text,
	"delivered_at" text,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" varchar NOT NULL,
	"builder_id" varchar NOT NULL,
	"service_id" varchar NOT NULL,
	"package_type" text NOT NULL,
	"title" text NOT NULL,
	"requirements" text NOT NULL,
	"budget" numeric(10, 2) NOT NULL,
	"delivery_days" integer NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"accepted_at" text,
	"started_at" text,
	"delivered_at" text,
	"completed_at" text,
	"cancelled_at" text,
	"cancellation_reason" text,
	"refund_amount" numeric(10, 2),
	"refund_status" text,
	"revision_count" integer DEFAULT 0 NOT NULL,
	"max_revisions" integer DEFAULT 2 NOT NULL,
	"delivery_url" text,
	"delivery_notes" text,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" varchar NOT NULL,
	"client_id" varchar NOT NULL,
	"builder_id" varchar NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'USDC' NOT NULL,
	"payment_method" text DEFAULT 'base_pay' NOT NULL,
	"transaction_hash" text,
	"block_number" integer,
	"escrow_contract_address" text,
	"platform_fee" numeric(10, 2) NOT NULL,
	"platform_fee_percentage" numeric(5, 2) DEFAULT '2.5' NOT NULL,
	"builder_amount" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"paid_at" text,
	"released_at" text,
	"refunded_at" text,
	"payer_wallet" text,
	"payer_email" text,
	"invoice_id" varchar,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payouts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"builder_id" varchar NOT NULL,
	"builder_wallet" text NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" text DEFAULT 'USDC' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"transaction_hash" text,
	"processed_at" text,
	"payment_ids" text[],
	"failure_reason" text,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_statistics" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"metric_name" text NOT NULL,
	"metric_value" text NOT NULL,
	"metric_type" text NOT NULL,
	"category" text,
	"period" text,
	"period_start" text,
	"period_end" text,
	"calculated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "progress_updates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" varchar NOT NULL,
	"builder_id" varchar NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"progress_percentage" integer DEFAULT 0 NOT NULL,
	"milestone" text,
	"next_steps" text,
	"blockers" text,
	"attachment_urls" text[],
	"attachment_names" text[],
	"is_visible" boolean DEFAULT true NOT NULL,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_deliverables" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" varchar NOT NULL,
	"milestone_id" varchar,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"delivery_type" text NOT NULL,
	"file_urls" text[],
	"preview_urls" text[],
	"file_names" text[],
	"file_sizes" text[],
	"status" text DEFAULT 'pending' NOT NULL,
	"submitted_by" varchar NOT NULL,
	"submitted_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"reviewed_by" varchar,
	"reviewed_at" text,
	"review_notes" text,
	"revision_requested" boolean DEFAULT false NOT NULL,
	"accepted_at" text,
	"rejected_at" text,
	"rejection_reason" text,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_documents" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" varchar NOT NULL,
	"document_name" text NOT NULL,
	"document_type" text NOT NULL,
	"document_url" text NOT NULL,
	"file_size" text NOT NULL,
	"mime_type" text NOT NULL,
	"uploaded_by" varchar NOT NULL,
	"uploader_type" text NOT NULL,
	"description" text,
	"category" text,
	"tags" text[],
	"is_shared" boolean DEFAULT true NOT NULL,
	"access_level" text DEFAULT 'both' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"previous_version_id" varchar,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "push_subscriptions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"user_type" text NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"user_agent" text,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "push_subscriptions_endpoint_unique" UNIQUE("endpoint")
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referrer_wallet" text NOT NULL,
	"referred_wallet" text NOT NULL,
	"referrer_type" text NOT NULL,
	"referred_type" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"reward" numeric(10, 2),
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"completed_at" text
);
--> statement-breakpoint
CREATE TABLE "refunds" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_id" varchar NOT NULL,
	"order_id" varchar NOT NULL,
	"dispute_id" varchar,
	"amount" numeric(10, 2) NOT NULL,
	"reason" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"transaction_hash" text,
	"processed_at" text,
	"failure_reason" text,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_disputes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"review_id" varchar NOT NULL,
	"disputed_by" varchar NOT NULL,
	"disputed_by_type" text NOT NULL,
	"reason" text NOT NULL,
	"details" text NOT NULL,
	"evidence" text[],
	"status" text DEFAULT 'pending' NOT NULL,
	"resolution" text,
	"resolved_by" varchar,
	"resolved_at" text,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_votes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"review_id" varchar NOT NULL,
	"voter_id" varchar NOT NULL,
	"voter_type" text NOT NULL,
	"vote_type" text NOT NULL,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"builder_id" varchar NOT NULL,
	"service_id" varchar,
	"order_id" varchar,
	"client_id" varchar NOT NULL,
	"client_name" text NOT NULL,
	"client_wallet" text NOT NULL,
	"rating" integer NOT NULL,
	"comment" text NOT NULL,
	"project_title" text,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"builder_response" text,
	"builder_response_at" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"moderated_by" varchar,
	"moderated_at" text,
	"moderator_notes" text,
	"onchain_tx_hash" text,
	"onchain_verified" boolean DEFAULT false NOT NULL,
	"onchain_verified_at" text,
	"is_disputed" boolean DEFAULT false NOT NULL,
	"dispute_status" text,
	"helpful_count" integer DEFAULT 0 NOT NULL,
	"not_helpful_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"builder_id" varchar NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"delivery_time" text NOT NULL,
	"basic_price" numeric(10, 2) NOT NULL,
	"standard_price" numeric(10, 2),
	"premium_price" numeric(10, 2),
	"basic_description" text NOT NULL,
	"standard_description" text,
	"premium_description" text,
	"basic_deliverables" text[],
	"standard_deliverables" text[],
	"premium_deliverables" text[],
	"tags" text[],
	"psx_required" numeric(10, 2) NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"portfolio_media" text[],
	"video_urls" text[]
);
