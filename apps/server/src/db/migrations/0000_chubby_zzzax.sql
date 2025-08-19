-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"census_record_1900" varchar(100),
	"indian_name" varchar(500),
	"family_name" varchar(200),
	"english_given_name" varchar(200),
	"alias" varchar(200),
	"sex" char(1),
	"year_of_birth" integer,
	"year_of_birth_uncertain" boolean DEFAULT false,
	"year_of_birth_uncertainty_type" varchar(50),
	"year_of_birth_original_text" text,
	"arrival_at_lincoln" date,
	"arrival_at_lincoln_uncertain" boolean DEFAULT false,
	"arrival_at_lincoln_uncertainty_type" varchar(50),
	"arrival_at_lincoln_original_text" text,
	"departure_from_lincoln" date,
	"departure_from_lincoln_uncertain" boolean DEFAULT false,
	"departure_from_lincoln_uncertainty_type" varchar(50),
	"departure_from_lincoln_original_text" text,
	"nation" varchar(200),
	"band" varchar(200),
	"agency" varchar(200),
	"trade" varchar(200),
	"source" text,
	"comments" text,
	"cause_of_death" text,
	"cemetery_burial" varchar(500),
	"relevant_links" text,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE INDEX "idx_arrival_date" ON "students" USING btree ("arrival_at_lincoln" date_ops);--> statement-breakpoint
CREATE INDEX "idx_departure_date" ON "students" USING btree ("departure_from_lincoln" date_ops);--> statement-breakpoint
CREATE INDEX "idx_family_name" ON "students" USING btree ("family_name" text_ops);--> statement-breakpoint
CREATE INDEX "idx_nation" ON "students" USING btree ("nation" text_ops);--> statement-breakpoint
CREATE INDEX "idx_year_of_birth" ON "students" USING btree ("year_of_birth" int4_ops);
*/