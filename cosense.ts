export interface Page {
  path: string;
  content: string;
  binary?: Uint8Array;
}

/**
 * Scrapbox APIから全ページを取得する簡易実装。
 * 画像は未対応で、ページ本文のみを返す。
 */
export async function fetchPages(
  project: string,
  sid?: string,
): Promise<Page[]> {
  const headers = new Headers();
  if (sid) {
    const cookie = sid.includes("=") ? sid : `connect.sid=${sid}`;
    headers.set("Cookie", cookie);
  }

  const listRes = await fetch(
    `https://scrapbox.io/api/pages/${project}?limit=1000`,
    { headers },
  );
  if (!listRes.ok) {
    throw new Error(`Failed to fetch page list: ${listRes.status}`);
  }
  const listData = await listRes.json();

  const pages: Page[] = [];
  for (const { title } of listData.pages as Array<{ title: string }>) {
    const enc = encodeURIComponent(title);
    const pageRes = await fetch(
      `https://scrapbox.io/api/pages/${project}/${enc}`,
      { headers },
    );
    if (!pageRes.ok) continue;
    const pageData = await pageRes.json();
    const lines = pageData.lines as Array<{ text: string }>;
    const content = lines.slice(1).map((l) => l.text).join("\n");
    const safeTitle = title.replace(/[\\/:*?"<>|]/g, "_");
    pages.push({ path: `${safeTitle}.md`, content });
  }

  return pages;
}
