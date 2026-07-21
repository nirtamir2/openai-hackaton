ALTER TABLE "product_marketing_tasks"
ADD COLUMN "scheduled_start" TIMESTAMPTZ,
ADD COLUMN "scheduled_end" TIMESTAMPTZ;

UPDATE "product_marketing_tasks"
SET
  "scheduled_start" = "target_date",
  "scheduled_end" = "target_date" + INTERVAL '1 hour'
WHERE "scheduled_start" IS NULL OR "scheduled_end" IS NULL;

ALTER TABLE "product_marketing_tasks"
ALTER COLUMN "scheduled_start" SET NOT NULL,
ALTER COLUMN "scheduled_end" SET NOT NULL;

CREATE INDEX "product_marketing_tasks_product_id_scheduled_start_scheduled_end_idx"
ON "product_marketing_tasks"("product_id", "scheduled_start", "scheduled_end");
