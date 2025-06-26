import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { contentType } from "https://deno.land/std@0.203.0/media_types/mod.ts";
import { fetchPages } from "./cosense.ts";
import { buildFileTree, FileNode } from "./file_tree.ts";
import { buildZip } from "./zip.ts";

const handler = async (req: Request): Promise<Response> => {
  const { pathname } = new URL(req.url);

  if (req.method === "GET") {
    const outPath = pathname === "/"
      ? "./next-app/out/index.html"
      : `./next-app/out${pathname}`;
    try {
      const data = await Deno.readFile(outPath);
      return new Response(data, {
        headers: {
          "Content-Type": contentType(outPath) ?? "application/octet-stream",
        },
      });
    } catch {
      try {
        const html = await Deno.readFile("./next-app/out/index.html");
        return new Response(html, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      } catch {
        const html = await Deno.readTextFile("./index.html");
        return new Response(html, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }
    }
  }
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
