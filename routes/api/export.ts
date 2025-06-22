import { Handler } from "$fresh/server.ts";
import { fetchPages } from "../../cosense.ts";
import { buildZip } from "../../zip.ts";

export const handler: Handler = async (req) => {
  const { project, sid } = await req.json();
  const pages = await fetchPages(project, sid);
  const data = await buildZip(pages);
  return new Response(data, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=export.zip",
    },
  });
};
