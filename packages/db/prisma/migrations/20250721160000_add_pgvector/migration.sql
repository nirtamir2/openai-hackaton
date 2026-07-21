-- Enable pgvector for semantic search on posts.
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "posts"
ADD COLUMN IF NOT EXISTS "embedding" vector(1536),
ADD COLUMN IF NOT EXISTS "embedding_model" TEXT,
ADD COLUMN IF NOT EXISTS "embedded_at" TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS "posts_embedded_at_idx" ON "posts"("embedded_at");

CREATE INDEX IF NOT EXISTS "posts_embedding_hnsw_idx"
ON "posts"
USING hnsw ("embedding" vector_cosine_ops)
WHERE "embedding" IS NOT NULL;
