import { Handler } from "$fresh/server.ts";
import { fetchPages } from "../../cosense.ts";
import { buildFileTree } from "../../file_tree.ts";

export const handler: Handler = async (req) => {
  const { project, sid } = await req.json();
  const pages = await fetchPages(project, sid);
  const fileTree = buildFileTree(pages);
  const readme = pages.find((p) => p.path === "README.md");
  const sampleHtml = `<pre>${readme?.content ?? ""}</pre>`;
  return Response.json({ fileTree, sampleHtml });
};
