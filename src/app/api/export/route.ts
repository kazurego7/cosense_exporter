import { NextRequest } from 'next/server';
import { fetchPages } from '../../../../cosense';
import { buildZip } from '../../../../zip';

export async function POST(req: NextRequest) {
  const { project, sid } = await req.json();
  const pages = await fetchPages(project, sid);
  const data = await buildZip(pages);
  return new Response(Buffer.from(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename=export.zip',
    },
  });
}
