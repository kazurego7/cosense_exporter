import { JSZip } from "https://deno.land/x/jszip@0.11.0/mod.ts";
import type { Page } from "./cosense.ts";

/**
 * ページ配列から ZIP バイト列を生成するヘルパー。
 */
export async function buildZip(pages: Page[]): Promise<Uint8Array> {
  const zip = new JSZip();
  for (const page of pages) {
    if (page.binary) {
      zip.addFile(page.path, page.binary);
    } else {
      zip.addFile(page.path, page.content);
    }
  }
  return await zip.generateAsync({ type: "uint8array" });
}

/**
 * ページ配列から ZIP をストリーム生成するヘルパー。
 */
export function streamZip(pages: Page[]): ReadableStream<Uint8Array> {
  const zip = new JSZip();
  for (const page of pages) {
    if (page.binary) {
      zip.addFile(page.path, page.binary);
    } else {
      zip.addFile(page.path, page.content);
    }
  }
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const data = await zip.generateAsync({ type: "uint8array" });
      controller.enqueue(data);
      controller.close();
    },
  });
}
