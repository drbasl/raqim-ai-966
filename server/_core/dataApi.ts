/**
 * Data API functionality has been disabled as part of the Manus migration.
 * This function previously made calls to the Manus Forge Data API.
 * If this functionality is required, a new implementation using a different provider
 * will need to be developed.
 */
import { ENV } from "./env"; // Keep ENV import for potential future use or if other parts still need it.

export type DataApiCallOptions = {
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
  pathParams?: Record<string, unknown>;
  formData?: Record<string, unknown>;
};

export async function callDataApi(
  apiId: string,
  options: DataApiCallOptions = {}
): Promise<unknown> {
  throw new Error(
    `Data API call to "${apiId}" is disabled. This functionality relied on the Manus Forge API, which has been removed. Please implement a new provider if this feature is required.`
  );
}
