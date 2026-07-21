ALTER TABLE "product_marketing_tasks"
ADD COLUMN "title" TEXT;

UPDATE "product_marketing_tasks"
SET "title" = LEFT(TRIM(SPLIT_PART(description, '.', 1)), 100)
WHERE "title" IS NULL;

ALTER TABLE "product_marketing_tasks"
ALTER COLUMN "title" SET NOT NULL;
