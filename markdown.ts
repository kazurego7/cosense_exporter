import TurndownService from "npm:turndown@7.1.2";
import type { Page } from "./cosense.ts";

/**
 * HTML を Markdown へ変換する。
 */
export function toMarkdown(page: Page): string {
  const service = new TurndownService();
  return service.turndown(page.content);
}

/**
 * Markdown 内の画像 URL を相対パスに書き換える。
 * 例: https://example.com/path/img.png -> ./images/img.png
 */
export function rewriteLinks(md: string): string {
  const regexPart = "!\\[[^\\]]*\\]\\((https?:\\/\\/[^\\s)]+\\/";
  const regex = new RegExp(
    `${regexPart}(\\S+\\.(?:png|jpg|jpeg|gif|svg)))\\)`,
    "gi",
  );
  return md.replace(regex, (_m, _url, file) => `![${file}](./images/${file})`);
}
