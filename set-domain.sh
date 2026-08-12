#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Point the site at your domain. Run once, after you buy it.
#
#   ./set-domain.sh bradleyschalk.com
#
# Does two things:
#   1. Replaces YOUR_SITE_URL in every page (canonical + Open Graph tags).
#      These only affect search results and link previews — nothing breaks
#      if you never run this.
#   2. Writes a CNAME file, which is what GitHub Pages reads to serve the
#      site from your domain instead of username.github.io
#
# Re-runnable: if a domain was already set, the old one is read from CNAME
# and swapped for the new one.
# ---------------------------------------------------------------------------
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "usage: ./set-domain.sh <domain>     e.g. ./set-domain.sh bradleyschalk.com" >&2
  exit 1
fi

# accept bradleyschalk.com, https://bradleyschalk.com, or a trailing slash
DOMAIN="${1#http://}"; DOMAIN="${DOMAIN#https://}"; DOMAIN="${DOMAIN%/}"
DOMAIN="$(printf '%s' "$DOMAIN" | tr '[:upper:]' '[:lower:]')"   # domains are case-insensitive
NEW_URL="https://${DOMAIN}"

# what are we replacing? the placeholder, or a domain set on a previous run
OLD="YOUR_SITE_URL"
if [ -f CNAME ]; then
  PREV="$(tr -d '[:space:]' < CNAME)"
  [ -n "$PREV" ] && OLD="https://${PREV}"
fi

# macOS sed needs an argument to -i; GNU sed does not
if sed --version >/dev/null 2>&1; then SEDI=(-i); else SEDI=(-i ''); fi

COUNT=0
while IFS= read -r f; do
  if grep -q "$OLD" "$f"; then
    sed "${SEDI[@]}" "s|${OLD}|${NEW_URL}|g" "$f"
    COUNT=$((COUNT+1))
  fi
done < <(find . -name "*.html")

echo "$DOMAIN" > CNAME

echo "Updated ${COUNT} page(s): ${OLD} -> ${NEW_URL}"
echo "Wrote CNAME containing: ${DOMAIN}"
echo
echo "Next steps:"
echo "  1. Commit and push."
echo "  2. Repo -> Settings -> Pages -> Custom domain: ${DOMAIN}"
echo "  3. Tick 'Enforce HTTPS' once the certificate is issued (can take an hour)."
