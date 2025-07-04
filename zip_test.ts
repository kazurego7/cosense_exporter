import { buildZip, streamZip } from "./zip.ts";
import type { Page } from "./cosense.ts";
import JSZip from "npm:jszip@3.7.1";
import { assertEquals } from "https://deno.land/std@0.203.0/assert/mod.ts";

Deno.test("buildZip で生成した ZIP が正しい", async () => {
  const pages: Page[] = [{ path: "a.txt", content: "hello" }];
  const data = await buildZip(pages);
  const zip = await JSZip.loadAsync(data);
  const text = await zip.file("a.txt")!.async("string");
  assertEquals(text, "hello");
});

Deno.test("streamZip で生成した ZIP が正しい", async () => {
  const pages: Page[] = [{ path: "b.txt", content: "world" }];
  const stream = streamZip(pages);
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const total = chunks.reduce((sum, c) => sum + c.length, 0);
  const all = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    all.set(c, offset);
    offset += c.length;
  }
  const zip = await JSZip.loadAsync(all);
  const text = await zip.file("b.txt")!.async("string");
  assertEquals(text, "world");
});
