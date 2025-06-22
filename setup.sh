#!/usr/bin/env bash
set -e

# Cosense Exporter setup script
# Installs Deno if it is not already installed and caches dependencies.

if ! command -v deno >/dev/null 2>&1; then
  echo "→ Installing Deno (minimal)" >&2
  # JSR manifest 404 が出ても続行できるようにエラーを握りつぶす
  curl -fsSL https://deno.land/install.sh | sh || true
  export DENO_INSTALL="$HOME/.deno"
  export PATH="$DENO_INSTALL/bin:$PATH"
  # 永続化: ~/.bashrc に追記
  echo "export DENO_INSTALL=\"$HOME/.deno\"" >> "$HOME/.bashrc"
  echo "export PATH=\"$DENO_INSTALL/bin:\$PATH\"" >> "$HOME/.bashrc"
  # インストール結果を確認
  if ! command -v deno >/dev/null 2>&1; then
    echo "!!! Deno install failed" >&2
    exit 1
  fi
fi

echo "依存モジュールを取得しています..." >&2
# これによりネットワークが必要な依存を事前に取得します

CERT_FILE="/etc/ssl/certs/ca-certificates.crt"
deno cache --cert "$CERT_FILE" server.ts

echo "セットアップ完了。サーバーを起動するには以下を実行してください:" >&2
echo "  deno task start" >&2
