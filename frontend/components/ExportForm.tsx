// deno-lint-ignore-file no-unused-vars
import { h } from "https://esm.sh/preact@10.15.1";
import { useState } from "https://esm.sh/preact@10.15.1/hooks";

export default function ExportForm() {
  const [project, setProject] = useState("");
  const [sid, setSid] = useState("");
  const [tree, setTree] = useState("");
  const [sampleHtml, setSampleHtml] = useState("");

  async function doPreview() {
    const res = await fetch("/api/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project, sid: sid || undefined }),
    });
    const data = await res.json();
    setTree(formatTree(data.fileTree));
    setSampleHtml(data.sampleHtml);
  }

  async function doExport() {
    const res = await fetch("/api/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project, sid: sid || undefined }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "export.zip";
    a.click();
    URL.revokeObjectURL(url);
  }

  function formatTree(nodes: { path: string; type: string }[]) {
    nodes.sort((a, b) => a.path.localeCompare(b.path));
    const lines: string[] = [];
    const seen = new Set<string>();
    for (const node of nodes) {
      const parts = node.path.split("/").filter((p) => p);
      let partial = "";
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isDir = i < parts.length - 1 || node.type === "dir";
        if (isDir) {
          partial += part + "/";
          if (!seen.has(partial)) {
            lines.push("  ".repeat(i) + part + "/");
            seen.add(partial);
          }
        } else {
          lines.push("  ".repeat(i) + part);
        }
      }
    }
    return lines.join("\n");
  }

  return (
    <div>
      <label class="block">
        プロジェクトID / URL
        <input
          class="w-full border p-2 rounded mt-1"
          value={project}
          onInput={(e) => setProject((e.target as HTMLInputElement).value)}
        />
      </label>
      <label class="block mt-4">
        sid Cookie (任意)
        <input
          class="w-full border p-2 rounded mt-1"
          value={sid}
          onInput={(e) => setSid((e.target as HTMLInputElement).value)}
        />
      </label>
      <div class="mt-6 flex justify-between">
        <button
          type="button"
          class="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={doPreview}
        >
          プレビュー
        </button>
        <button
          type="button"
          class="px-4 py-2 bg-emerald-500 text-white rounded"
          onClick={doExport}
        >
          エクスポート
        </button>
      </div>
      <div class="mt-6">
        <pre class="whitespace-pre-wrap">{tree}</pre>
        <div class="mt-4" dangerouslySetInnerHTML={{ __html: sampleHtml }} />
      </div>
    </div>
  );
}
