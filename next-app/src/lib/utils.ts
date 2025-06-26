export function normalizeProject(input: string): string {
  try {
    const url = new URL(input);
    const [project] = url.pathname.split("/").filter(Boolean);
    return project || input;
  } catch {
    return input;
  }
}
