-- CreateEnum
CREATE TYPE "MarketingTaskType" AS ENUM ('short', 'long');

-- CreateTable
CREATE TABLE "products" (
    "id" UUID NOT NULL,
    "general_description" TEXT NOT NULL,
    "plus_sides" TEXT NOT NULL,
    "minus_sides" TEXT NOT NULL,
    "main_competitors" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_marketing_tasks" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "description" TEXT NOT NULL,
    "task_type" "MarketingTaskType" NOT NULL,
    "priority" INTEGER NOT NULL,
    "target_date" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "product_marketing_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_marketing_tasks_product_id_idx" ON "product_marketing_tasks"("product_id");

-- CreateIndex
CREATE INDEX "product_marketing_tasks_target_date_idx" ON "product_marketing_tasks"("target_date");

-- CreateIndex
CREATE INDEX "product_marketing_tasks_priority_idx" ON "product_marketing_tasks"("priority");

-- AddForeignKey
ALTER TABLE "product_marketing_tasks" ADD CONSTRAINT "product_marketing_tasks_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
