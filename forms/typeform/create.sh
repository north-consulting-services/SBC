#!/usr/bin/env bash
# Create the SBC S&BSP Typeform with church logo branding.
# Requires: TYPEFORM_TOKEN (personal access token with forms:write / images:write)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
LOGO="$ROOT/assets/sbc-logo.png"
PAYLOAD="$ROOT/forms/typeform/application.json"
OUT="$ROOT/forms/typeform/created.json"

if [[ -z "${TYPEFORM_TOKEN:-}" ]]; then
  echo "Set TYPEFORM_TOKEN to a Typeform personal access token, then re-run." >&2
  echo "Create one at: https://admin.typeform.com/account#/section/tokens" >&2
  exit 1
fi

if [[ ! -f "$LOGO" ]]; then
  echo "Missing logo at $LOGO" >&2
  exit 1
fi

# Prefer uploading from the live church site URL; fall back to local base64.
LOGO_SRC_URL="${SBC_LOGO_URL:-https://static.wixstatic.com/media/3d7751_f06dd74468f74ab79d2f0f5834957aa7~mv2.png}"

echo "Uploading SBC logo to Typeform..."
IMG_RESP="$(curl -fsS -X POST "https://api.typeform.com/images" \
  -H "Authorization: Bearer $TYPEFORM_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"file_name\":\"sbc-logo.png\",\"url\":\"$LOGO_SRC_URL\"}")" \
  || {
    echo "URL upload failed; retrying with local base64..."
    B64="$(base64 < "$LOGO" | tr -d '\n')"
    IMG_RESP="$(curl -fsS -X POST "https://api.typeform.com/images" \
      -H "Authorization: Bearer $TYPEFORM_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{\"file_name\":\"sbc-logo.png\",\"image\":\"$B64\"}")"
  }

IMG_ID="$(python3 -c 'import json,sys; print(json.load(sys.stdin)["id"])' <<<"$IMG_RESP")"
# Welcome-screen attachments require images.typeform.com URLs
IMG_URL="https://images.typeform.com/images/$IMG_ID"
echo "Logo ID:  $IMG_ID"
echo "Logo URL: $IMG_URL"
printf '%s\n' "$IMG_RESP" > "$ROOT/forms/typeform/logo-upload.json"

echo "Creating form..."
BODY="$(python3 - "$PAYLOAD" "$IMG_URL" <<'PY'
import json, sys
path, logo = sys.argv[1], sys.argv[2]
with open(path) as f:
    data = json.load(f)
raw = json.dumps(data).replace("{{LOGO_IMAGE_URL}}", logo)
print(raw)
PY
)"

FORM_RESP="$(curl -fsS -X POST "https://api.typeform.com/forms" \
  -H "Authorization: Bearer $TYPEFORM_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$BODY")"

printf '%s\n' "$FORM_RESP" > "$OUT"

python3 - "$OUT" <<'PY'
import json, sys
form = json.load(open(sys.argv[1]))
form_id = form.get("id")
print(f"Form ID: {form_id}")
print(f"Edit:    https://admin.typeform.com/form/{form_id}/create")
print(f"Public:  https://form.typeform.com/to/{form_id}")
PY
