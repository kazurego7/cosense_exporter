import { NextRequest, NextResponse } from 'next/server';
import { fetchPages } from '../../../../../cosense';
import JSZip from 'jszip';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { project, sid } = await req.json();
  const pages = await fetchPages(project, sid);
  const zip = new JSZip();
  for (const page of pages) {
    if (page.binary) {
      zip.file(page.path, page.binary);
    } else {
      zip.file(page.path, page.content);
    }
  }
  const data = await zip.generateAsync({ type: 'uint8array' });
  return new NextResponse(data, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename=export.zip',
    },
  });
}
