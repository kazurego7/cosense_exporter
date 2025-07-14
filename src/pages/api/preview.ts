import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchPages } from "../../../cosense";
import { buildFileTree, FileNode } from "../../../file_tree";
import { toHtml } from "../../../markdown";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }
  const { project, sid } =
    typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const pages = await fetchPages(project, sid);
  const fileTree: FileNode[] = buildFileTree(pages);
  const readme = pages.find((p) => p.path === "README.md");
  const sampleHtml = readme ? toHtml(readme.content) : "";
  res.status(200).json({ fileTree, sampleHtml });
}
