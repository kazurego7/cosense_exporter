#!/usr/bin/env bash
set -e

# Cosense Exporter setup script
# Installs Deno if it is not already installed and caches dependencies.

REQUIRED_VERSION="1.44.4"
NEED_INSTALL=false

if command -v deno >/dev/null 2>&1; then
  current="$(deno --version | head -n1 | awk '{print $2}')"
  case "$current" in
    1.44.*) ;;
    *)
      echo "→ Installing Deno $REQUIRED_VERSION" >&2
      NEED_INSTALL=true
      ;;
  esac
else
  echo "→ Installing Deno $REQUIRED_VERSION" >&2
  NEED_INSTALL=true
fi

if $NEED_INSTALL; then
  # JSR manifest 404 が出ても続行できるようにエラーを握りつぶす
  curl -fsSL https://deno.land/install.sh | sh -s "v$REQUIRED_VERSION" || true
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
