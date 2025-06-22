import type { Page } from "./cosense.ts";

export interface FileNode {
  path: string;
  type: "file" | "dir";
  size?: number;
}

/**
 * ページ配列からファイルツリー情報を生成する単純な実装。
 */
export function buildFileTree(pages: Page[]): FileNode[] {
  const dirs = new Set<string>();
  const nodes: FileNode[] = [];

  for (const page of pages) {
    const size = page.binary
      ? page.binary.length
      : new TextEncoder().encode(page.content).length;
    nodes.push({ path: page.path, type: "file", size });

    const parts = page.path.split("/");
    parts.pop();
    let prefix = "";
    for (const part of parts) {
      prefix += part + "/";
      if (!dirs.has(prefix)) {
        dirs.add(prefix);
        nodes.push({ path: prefix, type: "dir" });
      }
    }
  }

  nodes.sort((a, b) => a.path.localeCompare(b.path));
  return nodes;
}
