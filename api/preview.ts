import { fetchPages } from "../cosense.ts";
import { buildFileTree, FileNode } from "../file_tree.ts";

export const config = { runtime: "vercel-deno@3.1.1" };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  const { project, sid } = await req.json();
  const pages = await fetchPages(project, sid);
  const fileTree: FileNode[] = buildFileTree(pages);
  const readme = pages.find((p) => p.path === "README.md");
  const sampleHtml = `<pre>${readme?.content ?? ""}</pre>`;
  return Response.json({ fileTree, sampleHtml });
}
