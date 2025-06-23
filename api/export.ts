import { fetchPages } from "../cosense.ts";
import { streamZip } from "../zip.ts";

export const config = { runtime: "vercel-deno@3.1.1" };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }
  const { project, sid } = await req.json();
  const pages = await fetchPages(project, sid);
  const stream = streamZip(pages);
  return new Response(stream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=export.zip",
    },
  });
}
