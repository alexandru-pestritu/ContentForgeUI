#!/bin/bash

if [ -z "$API_URL" ]; then
  echo "API_URL environment variable is not set. Using default value."
  export API_URL="http://localhost:8000"
else
  echo "Using API_URL from environment variable: $API_URL"
fi

envsubst < /usr/app/assets/env.js > /usr/app/assets/env.tmp.js && \
mv /usr/app/assets/env.tmp.js /usr/app/assets/env.js

exec node server/server.mjs
