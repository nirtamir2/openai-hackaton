-- CreateEnum
CREATE TYPE "SentimentLabel" AS ENUM ('positive', 'negative', 'neutral', 'mixed');

-- CreateEnum
CREATE TYPE "SentimentSource" AS ENUM ('review', 'survey', 'support', 'social', 'in_app', 'other');

-- CreateTable
CREATE TABLE "product_sentiments" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "sentiment_label" "SentimentLabel" NOT NULL,
    "sentiment_score" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "source" "SentimentSource" NOT NULL,
    "source_url" TEXT,
    "customer_name" TEXT,
    "analyzed_at" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "product_sentiments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_sentiments_product_id_idx" ON "product_sentiments"("product_id");

-- CreateIndex
CREATE INDEX "product_sentiments_sentiment_label_idx" ON "product_sentiments"("sentiment_label");

-- CreateIndex
CREATE INDEX "product_sentiments_created_at_idx" ON "product_sentiments"("created_at");

-- CreateIndex
CREATE INDEX "product_sentiments_product_id_sentiment_label_idx" ON "product_sentiments"("product_id", "sentiment_label");

-- AddForeignKey
ALTER TABLE "product_sentiments" ADD CONSTRAINT "product_sentiments_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
