import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { fetchPages } from "./cosense.ts";
import { buildFileTree, FileNode } from "./file_tree.ts";
import { buildZip } from "./zip.ts";

const handler = async (req: Request): Promise<Response> => {
  const { pathname } = new URL(req.url);
  if (req.method === "POST" && pathname === "/api/preview") {
    const { project, sid } = await req.json();
    const pages = await fetchPages(project, sid);
    const fileTree: FileNode[] = buildFileTree(pages);
    const readme = pages.find((p) => p.path === "README.md");
    const sampleHtml = `<pre>${readme?.content ?? ""}</pre>`;
    return Response.json({ fileTree, sampleHtml });
  }
  if (req.method === "POST" && pathname === "/api/export") {
    const { project, sid } = await req.json();
    const pages = await fetchPages(project, sid);
    const data = await buildZip(pages);
    return new Response(data, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=export.zip",
      },
    });
  }
  return new Response("Not Found", { status: 404 });
};

serve(handler);
