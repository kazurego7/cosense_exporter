export interface Page {
  path: string;
  content: string;
  binary?: Uint8Array;
}

const API_BASE = Deno.env.get("COSENSE_API_BASE");

/**
 * Cosense API からページおよび画像を取得するアダプター。
 * `COSENSE_API_BASE` が未設定の場合はスタブデータを返す。
 */
export async function fetchPages(
  project: string,
  sid?: string,
): Promise<Page[]> {
  if (!API_BASE) {
    const text = `# ${project}\nサンプルページ`;
    return [
      { path: "README.md", content: text },
      { path: "docs/spec.md", content: "# 仕様\n" },
      { path: "images/logo.png", content: "", binary: new Uint8Array() },
    ];
  }

  const headers = new Headers();
  if (sid) headers.set("Cookie", `sid=${sid}`);

  const res = await fetch(
    `${API_BASE}/projects/${encodeURIComponent(project)}/export`,
    { headers },
  );

  if (!res.ok) {
    throw new Error(`Cosense API error: ${res.status}`);
  }

  const data: { pages: { path: string; content: string; binary?: string }[] } =
    await res.json();

  return data.pages.map((p) => ({
    path: p.path,
    content: p.content,
    binary: p.binary
      ? Uint8Array.from(atob(p.binary), (c) => c.charCodeAt(0))
      : undefined,
  }));
}
