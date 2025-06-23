import { fetchPages } from "../cosense.ts";
import { buildZip } from "../zip.ts";

export const config = { runtime: "vercel-deno@3.1.1" };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
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
