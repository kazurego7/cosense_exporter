# Cosense Export 実装 TODO

## Phase 0 – インターフェース確定
- [ ] `/api/preview` のレスポンス仕様を README にドキュメント化（fileTree, sampleHtml の型）
- [ ] KV 履歴レコードスキーマを確定し README に追記

## Phase 1 – Fresh + React 置き換え
- [ ] Fresh 1.8 プロジェクトへ移行（`routes/api/preview.ts`, `routes/api/export.ts`）
- [ ] Deno KV 初期化コードをバックエンドに追加
- [ ] React + Vite + Tailwind によるフロントスキャフォールド
- [ ] `ExportForm.tsx` コンポーネントへ既存 HTML UI を移植
- [ ] GitHub Actions にフロントビルド＆`static/` 配置タスクを追加

## Phase 2 – データ取得＆プレビュ―展開
- [ ] `cosense.ts`：Cosense API adapter 実装（公開／非公開対応）
- [ ] `markdown.ts`：Scrapbox→Markdown 変換＋リンク書き換えロジック実装
- [ ] `zip.ts`：実データ取得＋JSZip ストリーム生成の本実装
- [ ] `<PreviewModal>`：ツリービュー & Markdown プレビュー実装
- [ ] `<ErrorToast>` コンポーネント実装（エラーコード別トースト表示）

## Phase 3 – 履歴管理 & 設定 UI
- [ ] `history.ts`：エクスポート履歴の KV 保存・取得・削除ロジック
- [ ] `<HistoryPage>`：履歴一覧テーブル + プレビュー／再試行ボタン実装
- [ ] `<SettingsModal>`：設定モーダル（ファイル命名・画像フォルダ等）の UI 実装

## Phase 4 – テスト＆仕上げ
- [ ] Playwright で E2E テスト（トップ → プレビュー → ダウンロード）
- [ ] アクセシビリティ対応（aria-label, keyboard trap）
- [ ] ログ出力整理（`std/log` 統一）
- [ ] CI に `deno task check`／ESLint／Playwright を組み込み
- [ ] README を最新仕様に更新
