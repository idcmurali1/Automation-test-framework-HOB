# Load variable SAUCE_FILE_NAME
source ${LOOPER_TMP_ENV_VARS}

echo "[INFO-QAA] Uploading {${BANNER} | ${RC_VERSION} | ${PLATFORM}} build to Sauce Labs with filename: ${SAUCE_FILE_NAME}"
echo "[INFO-QAA] Base Path to file: $BASE_PATH_TO_FILE"

count=0
maxCount=3
while [[ "$count" -lt "$maxCount" ]] || false; do
  RESPONSE=$(curl -f -m 600 \
    -F "payload=@${BASE_PATH_TO_FILE}${SAUCE_FILE_NAME}" \
    -F name=${SAUCE_FILE_NAME} \
    -u "${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}" \
    https://api.us-west-1.saucelabs.com/v1/storage/upload | grep .)
  break
  sleep 30
  if [ -z "$RESPONSE" ]; then
    count=`expr $count + 1`
    echo "[ERROR-QAA] Somethng went wrong uploading build to SauceLabs"
    echo "[DEBUG-QAA] Retry uploading build to SauceLabs..."
  fi
done

if [ "$count" -ge 3 ]; then
  exit 1
else
  echo "[DEBUG-QAA] ${RESPONSE}"
  # Parse the JSON response using grep, sed, and awk
  IDENTIFIER=$(echo "$RESPONSE" | grep -o '"identifier": *"[^"]*"' | sed 's/"identifier": *"\([^"]*\)"/\1/')

  if [ "$PLATFORM" == "android" ]; then
    VERSION=$(echo "$RESPONSE" | grep -o '"version_code": [0-9]*' | sed 's/"version_code": \([0-9]*\)/\1/')
  else
    VERSION=$(echo "$RESPONSE" | grep -o '"version": *"[^"]*"' | sed 's/"version": *"\([^"]*\)"/\1/')
    ARCHITECTURE=$(echo "$RESPONSE" | grep -o 'cpu_architecture: *\[[^]]*\]' | sed 's/cpu_architecture: *\[\([^]]*\)\]/\1/')
  fi

  echo "[INFO-QAA] Sauce App Identifier => $IDENTIFIER"
  echo "[INFO-QAA] Sauce Build ID => $VERSION"
  echo "[INFO-QAA] Build Architecture => $ARCHITECTURE"

  # Make available env variables for future steps outside of this script
  echo "SAUCE_APP_IDENTIFIER=${IDENTIFIER}" >> ${LOOPER_TMP_ENV_VARS}
  echo "SAUCE_BUILD_ID=${VERSION}" >> ${LOOPER_TMP_ENV_VARS}
  echo "IOS_CPU_ARCHITECTURE=${ARCHITECTURE}" >> ${LOOPER_TMP_ENV_VARS}
fi