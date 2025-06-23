// deno-lint-ignore-file no-unused-vars
import { h } from "https://esm.sh/preact@10.15.1";

interface FileNode {
  path: string;
  type: string;
}

export interface PreviewModalProps {
  fileTree: FileNode[];
  sampleHtml: string;
  onClose: () => void;
}

function formatTree(nodes: FileNode[]): string {
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

export default function PreviewModal({
  fileTree,
  sampleHtml,
  onClose,
}: PreviewModalProps) {
  return (
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white p-4 rounded w-full max-w-3xl max-h-full overflow-y-auto">
        <div class="flex justify-end mb-2">
          <button
            type="button"
            class="text-sm text-gray-600 hover:underline"
            onClick={onClose}
          >
            閉じる
          </button>
        </div>
        <pre class="whitespace-pre-wrap">{formatTree(fileTree)}</pre>
        <div class="mt-4" dangerouslySetInnerHTML={{ __html: sampleHtml }} />
      </div>
    </div>
  );
}
