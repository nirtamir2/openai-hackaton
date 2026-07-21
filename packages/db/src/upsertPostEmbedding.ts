import index from "./index";
import { DEFAULT_EMBEDDING_MODEL } from "./embeddingDimensions";
import { formatEmbeddingForPg } from "./formatEmbeddingForPg";

interface UpsertPostEmbeddingParams {
  postId: string;
  embedding: Array<number>;
  embeddingModel?: string;
}

export async function upsertPostEmbedding({
  postId,
  embedding,
  embeddingModel = DEFAULT_EMBEDDING_MODEL,
}: UpsertPostEmbeddingParams) {
  const embeddingLiteral = formatEmbeddingForPg({ embedding });

  await index.$executeRawUnsafe(
    `
      UPDATE posts
      SET
        embedding = $1::vector,
        embedding_model = $2,
        embedded_at = NOW(),
        updated_at = NOW()
      WHERE id = $3::uuid
    `,
    embeddingLiteral,
    embeddingModel,
    postId,
  );
}
