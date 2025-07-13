import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchPages } from "../cosense";
import { buildZip } from "../zip";

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
  const data = await buildZip(pages);
  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=export.zip",
  );
  res.status(200).send(Buffer.from(data));
}
