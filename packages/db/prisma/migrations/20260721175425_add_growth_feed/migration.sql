-- CreateEnum
CREATE TYPE "GrowthFeedEntryKind" AS ENUM ('feed_item', 'idea', 'project');

-- CreateEnum
CREATE TYPE "GrowthIdeaStatus" AS ENUM ('pending', 'approved', 'postponed', 'cancelled');

-- CreateTable
CREATE TABLE "product_growth_feed_entries" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "external_id" TEXT NOT NULL,
    "kind" "GrowthFeedEntryKind" NOT NULL,
    "day_key" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "idea_status" "GrowthIdeaStatus",
    "todo_done" JSONB NOT NULL DEFAULT '{}',
    "payload" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "product_growth_feed_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_growth_feed_entries_product_id_kind_idx" ON "product_growth_feed_entries"("product_id", "kind");

-- CreateIndex
CREATE INDEX "product_growth_feed_entries_product_id_day_key_idx" ON "product_growth_feed_entries"("product_id", "day_key");

-- CreateIndex
CREATE UNIQUE INDEX "product_growth_feed_entries_product_id_external_id_key" ON "product_growth_feed_entries"("product_id", "external_id");

-- AddForeignKey
ALTER TABLE "product_growth_feed_entries" ADD CONSTRAINT "product_growth_feed_entries_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "product_marketing_tasks_product_id_scheduled_start_scheduled_en" RENAME TO "product_marketing_tasks_product_id_scheduled_start_schedule_idx";
