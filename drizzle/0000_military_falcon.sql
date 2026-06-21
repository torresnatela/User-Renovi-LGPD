CREATE TYPE "public"."deletion_scope" AS ENUM('full_account', 'specific_data');--> statement-breakpoint
CREATE TYPE "public"."request_source" AS ENUM('web', 'app_webview');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('received', 'in_review', 'completed', 'rejected', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."request_type" AS ENUM('account_deletion');--> statement-breakpoint
CREATE TABLE "dsr_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"protocol" varchar(20) NOT NULL,
	"request_type" "request_type" DEFAULT 'account_deletion' NOT NULL,
	"full_name" varchar(200) NOT NULL,
	"email" varchar(320) NOT NULL,
	"cpf" varchar(11) NOT NULL,
	"phone" varchar(20),
	"deletion_scope" "deletion_scope" DEFAULT 'full_account' NOT NULL,
	"specific_data_details" text,
	"reason" text,
	"status" "request_status" DEFAULT 'received' NOT NULL,
	"internal_notes" text,
	"source" "request_source" DEFAULT 'web' NOT NULL,
	"consent_confirmed" boolean NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	CONSTRAINT "dsr_requests_protocol_unique" UNIQUE("protocol")
);
--> statement-breakpoint
CREATE TABLE "dsr_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"from_status" "request_status",
	"to_status" "request_status" NOT NULL,
	"changed_by" varchar(200),
	"note" text,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" varchar(500) NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dsr_status_history" ADD CONSTRAINT "dsr_status_history_request_id_dsr_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."dsr_requests"("id") ON DELETE no action ON UPDATE no action;