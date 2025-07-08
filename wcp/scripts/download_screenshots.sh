export https_proxy=""
export http_proxy=""
downloadScreenshots() {
JSON_FILE="r2-sessionId.json"

if [ ! -f "$JSON_FILE" ]; then
  echo "Error: JSON file not found!"
  exit 1
fi

NUMBEROFSESSIONS=$(jq -r '.sessionIds | length' r2-sessionId.json)
APP_PLATFORM=$(jq -r '.platform' r2-sessionId.json)


echo the number of sessions is $NUMBEROFSESSIONS

for ((index=1; index<=$NUMBEROFSESSIONS; index++))
do

  SESSIONID=$(jq -r ".sessionIds[$((index-1))]" r2-sessionId.json)

  echo "Getting the screenshots of session $index: $SESSIONID"

  mkdir -p SCREENSHOTS_DIR/"${APP_PLATFORM}_${SESSIONID}"

  echo "Folder for session ${APP_PLATFORM}_${SESSIONID} created"

  PATHTOFOLDER=SCREENSHOTS_DIR/${APP_PLATFORM}_${SESSIONID}

  curl -u "$SAUCE_USERNAME:$SAUCE_ACCESS_KEY" --location \
  --request GET "https://api.us-west-1.saucelabs.com/rest/v1/$SAUCE_USERNAME/jobs/${SESSIONID}/assets/screenshots.zip"  --output "${PATHTOFOLDER}/screenshots.zip"

done 

echo "Passed: All screenshots downloaded to ${SCREENSHOTS_DIR}."

}
"$@"