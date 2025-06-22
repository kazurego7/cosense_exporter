export interface Page {
  path: string;
  content: string;
  binary?: Uint8Array;
}

/**
 * Cosense APIからページと画像を取得するスタブ実装。
 * 実際のAPI連携は未実装で、固定データを返す。
 */
export function fetchPages(
  project: string,
  _sid?: string,
): Promise<Page[]> {
  const text = `# ${project}\nサンプルページ`;
  return Promise.resolve([
    { path: "README.md", content: text },
    { path: "docs/spec.md", content: "# 仕様\n" },
    { path: "images/logo.png", content: "", binary: new Uint8Array() },
  ]);
}
