/**
 * Image generation functionality has been disabled as part of the Manus migration.
 * This function previously made calls to the Manus Forge ImageService.
 * If this functionality is required, a new implementation using a different provider
 * will need to be developed.
 */
// import { storagePut } from "server/storage"; // This import is no longer needed if the function is disabled
import { ENV } from "./env"; // Keep ENV import for potential future use or if other parts still need it.

export type GenerateImageOptions = {
  prompt: string;
  originalImages?: Array<{
    url?: string;
    b64Json?: string;
    mimeType?: string;
  }>;
};

export type GenerateImageResponse = {
  url?: string;
};

export async function generateImage(
  options: GenerateImageOptions
): Promise<GenerateImageResponse> {
  throw new Error(
    `Image generation is disabled. This functionality relied on the Manus Forge ImageService, which has been removed. Please implement a new provider if this feature is required.`
  );
}
