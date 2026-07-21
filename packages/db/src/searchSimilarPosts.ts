import index from "./index";
import { formatEmbeddingForPg } from "./formatEmbeddingForPg";

interface SearchSimilarPostsParams {
  embedding: Array<number>;
  limit?: number;
  providerId?: string;
}

interface SimilarPost {
  id: string;
  providerId: string;
  externalId: string;
  title: string | null;
  content: string | null;
  url: string | null;
  similarity: number;
}

export async function searchSimilarPosts({
  embedding,
  limit = 10,
  providerId,
}: SearchSimilarPostsParams) {
  const embeddingLiteral = formatEmbeddingForPg({ embedding });

  if (providerId != null) {
    return await index.$queryRawUnsafe<Array<SimilarPost>>(
      `
        SELECT
          id,
          provider_id AS "providerId",
          external_id AS "externalId",
          title,
          content,
          url,
          1 - (embedding <=> $1::vector) AS similarity
        FROM posts
        WHERE embedding IS NOT NULL
          AND provider_id = $2::uuid
        ORDER BY embedding <=> $1::vector
        LIMIT $3
      `,
      embeddingLiteral,
      providerId,
      limit,
    );
  }

  return await index.$queryRawUnsafe<Array<SimilarPost>>(
    `
      SELECT
        id,
        provider_id AS "providerId",
        external_id AS "externalId",
        title,
        content,
        url,
        1 - (embedding <=> $1::vector) AS similarity
      FROM posts
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> $1::vector
      LIMIT $2
    `,
    embeddingLiteral,
    limit,
  );
}
