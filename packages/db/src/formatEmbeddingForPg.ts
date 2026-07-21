import { EMBEDDING_DIMENSIONS } from "./embeddingDimensions";

export function formatEmbeddingForPg({ embedding }: { embedding: Array<number> }) {
  if (embedding.length !== EMBEDDING_DIMENSIONS) {
    throw new Error(
      `Expected embedding length ${String(EMBEDDING_DIMENSIONS)}, received ${String(embedding.length)}`,
    );
  }

  return `[${embedding.join(",")}]`;
}
