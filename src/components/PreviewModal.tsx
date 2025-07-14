import { FileNode } from "../lib/types";

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
    const parts = node.path.split("/").filter(Boolean);
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

export default function PreviewModal(
  { fileTree, sampleHtml, onClose }: PreviewModalProps,
) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-full w-full max-w-3xl overflow-y-auto rounded bg-white p-4">
        <div className="mb-2 flex justify-end">
          <button
            type="button"
            className="text-sm text-gray-600 hover:underline"
            onClick={onClose}
          >
            閉じる
          </button>
        </div>
        <pre className="whitespace-pre-wrap text-sm">{formatTree(fileTree)}</pre>
        <div
          className="mt-4"
          dangerouslySetInnerHTML={{ __html: sampleHtml }}
        />
      </div>
    </div>
  );
}
