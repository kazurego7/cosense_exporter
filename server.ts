import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { JSZip } from "https://deno.land/x/jszip@0.11.0/mod.ts";

interface FileNode {
  path: string;
  type: "file" | "dir";
  size?: number;
}

const handler = async (req: Request): Promise<Response> => {
  const { pathname } = new URL(req.url);
  if (req.method === "POST" && pathname === "/api/preview") {
    const { project } = await req.json();
    const fileTree: FileNode[] = [
      { path: "README.md", type: "file", size: 12 },
      { path: "images/", type: "dir" },
      { path: "images/logo.png", type: "file", size: 0 },
    ];
    const sampleHtml = `<h1>${project}</h1><p>preview</p>`;
    return Response.json({ fileTree, sampleHtml });
  }
  if (req.method === "POST" && pathname === "/api/export") {
    const zip = new JSZip();
    zip.addFile("README.md", "# sample\n");
    zip.addFile("images/logo.png", "");
    const data = await zip.generateAsync({ type: "uint8array" });
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
