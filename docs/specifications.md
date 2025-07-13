# Cosense Export Webアプリ — 仕様書 v0.2 (Vercel 版)

## 1. システム構成

```
[Browser]
   │   (HTTP)
   ▼
[Vercel Edge Function]
   • /api/preview  (JSON)
   • /api/export   (ZIP stream)
        │ fetch                                   
        ▼
[Cosense API] ──► 画像取得 (Gyazo 等)
```

* **フロント**: **Next.js (App Router) + TailwindCSS + Framer Motion**
* **バックエンド**: **Vercel Edge Functions**（Node.js runtime）
* **データストア**: なし（履歴機能を削除）

---

## 2. 画面仕様

| 画面        | コンポーネント           | props / state の主な項目                    |
| --------- | ----------------- | -------------------------------------- |
| **トップ**   | `<ExportForm>`    | `project`, `sid`, `isLoading`          |
| **プレビュー** | `<PreviewModal>`  | `fileTree`, `activeFile`, `onDownload` |
| **設定**    | `<SettingsModal>` | `prefs`, `savePrefs`                   |

### 2.1 `<ExportForm>`

```ts
interface ExportFormProps {
  onPreview: (project: string, sid?: string) => void;
  onExport:  (project: string, sid?: string) => void;
}
```

### 2.2 `<PreviewModal>` のツリービュー構造

```ts
interface FileNode {
  path: string;          // "docs/spec.md"
  type: 'file' | 'dir';
  size?: number;         // bytes
  children?: FileNode[]; // dir の場合
}
```

---

## 3. API 設計

| メソッド | エンドポイント        | Body                | 応答                                                                           | 説明               |
| ---- | -------------- | ------------------- | ---------------------------------------------------------------------------- | ---------------- |
| POST | `/api/preview` | `{ project, sid? }` | 200 OK, `application/json`<br>`{ fileTree: FileNode[], sampleHtml: string }` | ZIP を生成せず、構造のみ返却 |
| POST | `/api/export`  | `{ project, sid? }` | 200 OK, `application/zip` (stream)                                           | ZIP を即時返却        |

### 3.1 エラーレスポンスフォーマット

```json
{
  "error": {
    "code": "COSENSE_NOT_FOUND",
    "message": "Project not found or private without sid"
  }
}
```

HTTP ステータスは常に 200。`error.code` で判定し、UI 側でトースト表示。

---

## 4. 主要モジュール (Edge Functions 内)

| モジュール         | 概要                                                  |
| ------------- | --------------------------------------------------- |
| `cosense.ts`  | `fetchPages(project, sid?) → Page[]` （HTML/JSON 取得） |
| `markdown.ts` | `toMarkdown(page)`, `rewriteLinks(md)`              |
| `zip.ts`      | `streamZip(files) → ReadableStream<Uint8Array>`     |

---

## 5. フロー概要

### 5.1 `/api/preview`

1. `fetchPages` で全ページ取得。
2. ページ階層から `fileTree` を生成。
3. 先頭ページ (README.md 相当) を Markdown → HTML 変換し `sampleHtml` として添付。
4. JSON を返却。

### 5.2 `/api/export`

1. `fetchPages` → Markdown 変換 → 画像 URL 解析。
2. 画像をフェッチし `images/` へ格納。Markdown 内 URL を相対パスに書換え。
3. `streamZip` で ZIP をストリーム生成。
4. `Content-Disposition: attachment; filename="<project>_YYYYMMDD.zip"` で応答。

---

## 6. エラーコード一覧

| コード                 | シナリオ     | UI 対応         |
| ------------------- | -------- | ------------- |
| `COSENSE_NOT_FOUND` | プロジェクト無し | トースト赤、再入力促し   |
| `AUTH_FAILED`       | sid 無効   | トースト赤、sid 再入力 |
| `IMG_FETCH_ERR`     | 画像取得失敗   | トースト黄、処理継続可   |
| `ZIP_FAIL`          | ZIP 生成失敗 | トースト赤         |

---

## 7. ロギング

* **成功**: `project`, `size`, `duration`, `userAgent`
* **失敗**: `error.code`, `stacktrace`（stderr）

※ Edge Function の 100 k 呼び出し／100 GB 帯域以内で運用。ログは Vercel の Function Logs を利用。永続ストレージは使わない。

---

## 8. デプロイ & CI/CD

1. GitHub push → Vercel 自動デプロイ（Preview URL 付き）。
2. `next build`、`eslint`, `prettier` を GitHub Actions でチェック。
3. Playwright E2E (`e2e.yml`):

   * `/` でフォーム表示 → プロジェクト入力 → **Preview** ボタン → モーダル表示確認。
   * `/api/export` 呼び出しで `Content-Type: application/zip` を検証。

---

作成日: 2025‑06‑23
