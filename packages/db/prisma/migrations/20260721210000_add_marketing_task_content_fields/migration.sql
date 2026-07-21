CREATE TYPE "MarketingTaskContentType" AS ENUM ('reply', 'post', 'video', 'image');
CREATE TYPE "MarketingTaskNetwork" AS ENUM ('x', 'reddit', 'linkedin', 'youtube');

ALTER TABLE "product_marketing_tasks"
ADD COLUMN "content_type" "MarketingTaskContentType" NOT NULL DEFAULT 'post',
ADD COLUMN "network" "MarketingTaskNetwork" NOT NULL DEFAULT 'x',
ADD COLUMN "subtasks" JSONB NOT NULL DEFAULT '[]';

ALTER TABLE "product_marketing_tasks" ALTER COLUMN "content_type" DROP DEFAULT;
ALTER TABLE "product_marketing_tasks" ALTER COLUMN "network" DROP DEFAULT;
