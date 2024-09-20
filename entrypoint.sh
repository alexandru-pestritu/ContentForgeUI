#!/bin/sh

if [ -z "$API_URL" ]; then
  echo "ERROR: API_URL environment variable is not set."
  exit 1
fi

echo "Replacing API_URL placeholder with: $API_URL"

find /usr/app -type f -name '*.js' -exec sed -i "s#API_URL_PLACEHOLDER#$API_URL#g" {} +

exec "$@"
