export interface FileNode {
  path: string;
  type: "file" | "dir";
  size?: number;
  children?: FileNode[];
}
