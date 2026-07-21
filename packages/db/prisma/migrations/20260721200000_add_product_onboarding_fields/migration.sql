-- AlterTable
ALTER TABLE "products" ADD COLUMN "website_url" TEXT NOT NULL DEFAULT '';
ALTER TABLE "products" ADD COLUMN "onboarding_config" JSONB NOT NULL DEFAULT '{}';
