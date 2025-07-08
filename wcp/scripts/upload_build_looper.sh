echo "Uploading ${APP_PLATFORM} ${APP_BRANCH} ${APP_VERSION} build to Sauce Labs with filename: ${SAUCE_FILE_NAME}"

count=0
maxCount=3
while [[ "$count" -lt "$maxCount" ]] || false; do
  curl -f -m 600 \
    -F "payload=@./wcp/app/${SAUCE_FILE_NAME}" \
    -F name=${SAUCE_FILE_NAME} \
    -u "${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}" \
    https://api.us-west-1.saucelabs.com/v1/storage/upload | grep . && \
  break
  sleep 30
  count=`expr $count + 1`
done

if [ "$count" -ge 3 ]; then
  exit 1
fi
