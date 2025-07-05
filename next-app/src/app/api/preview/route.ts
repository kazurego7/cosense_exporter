import { NextRequest, NextResponse } from 'next/server';
import { fetchPages } from '../../../../../cosense';
import { buildFileTree, FileNode } from '../../../../../file_tree';
import { toHtml } from '../../../../../markdown';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { project, sid } = await req.json();
  const pages = await fetchPages(project, sid);
  const fileTree: FileNode[] = buildFileTree(pages);
  const readme = pages.find((p) => p.path === 'README.md');
  const sampleHtml = readme ? toHtml(readme.content) : '';
  return NextResponse.json({ fileTree, sampleHtml });
}
