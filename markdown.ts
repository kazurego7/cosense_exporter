/**
 * 非依存の簡易 Markdown → HTML 変換。
 * 見出しと強調、一部インライン記法のみ対応する。
 */
export function toHtml(md: string): string {
  return md
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br>");
}

/**
 * 画像URLをローカルの images/ ディレクトリ参照に書き換える。
 *   ![alt](https://example.com/foo.png) -> ![alt](images/foo.png)
 */
export function rewriteLinks(md: string): string {
  return md.replace(
    /!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)/g,
    (_, alt: string, url: string) => {
      const filename = url.substring(url.lastIndexOf("/") + 1);
      return `![${alt}](images/${filename})`;
    },
  );
}
