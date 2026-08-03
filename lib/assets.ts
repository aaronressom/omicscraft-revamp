import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Server-only check for whether a file exists under `public/`.
 *
 * The product logos are supplied by the client and are not in the repo yet.
 * Resolving availability at render time (rather than letting `next/image`
 * request a missing file and fail in the browser) means a missing asset
 * degrades to a typographic wordmark with no console noise and no broken-image
 * flash - and flips to the real logo automatically once the file is dropped in.
 */
export function publicAssetExists(publicPath: string): boolean {
  const rel = publicPath.replace(/^\//, "");
  return existsSync(path.join(process.cwd(), "public", rel));
}
