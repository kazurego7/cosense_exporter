export interface Page {
  path: string;
  content: string;
  binary?: Uint8Array;
}

/**
 * Cosense API からページと画像を取得するアダプター。
 *
 * 実際の API 仕様が公開されていないため、以下の仮定に基づいた簡易実装と
 * なっている。`https://api.cosense.app/v1/projects/<id>/export` が JSON を返
 * し、ページごとに画像 URL の配列 `images` を含む形式を想定している。
 */
export async function fetchPages(
  project: string,
  sid?: string,
): Promise<Page[]> {
  const headers = new Headers({ Accept: "application/json" });
  if (sid) headers.append("Cookie", `sid=${sid}`);
  const url = `https://api.cosense.app/v1/projects/${
    encodeURIComponent(project)
  }/export`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`Cosense API error: ${res.status}`);
  }
  const data = await res.json() as {
    pages: { path: string; content: string; images?: string[] }[];
  };
  const out: Page[] = [];
  for (const { path, content, images } of data.pages) {
    out.push({ path, content });
    if (images) {
      for (const imgUrl of images) {
        const imgRes = await fetch(imgUrl, { headers });
        if (!imgRes.ok) continue;
        const binary = new Uint8Array(await imgRes.arrayBuffer());
        const filename = imgUrl.substring(imgUrl.lastIndexOf("/") + 1);
        out.push({ path: `images/${filename}`, content: "", binary });
      }
    }
  }
  return out;
}
