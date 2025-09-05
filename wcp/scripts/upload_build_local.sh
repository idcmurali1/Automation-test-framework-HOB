uploadIos() {
  read -p "Please enter app tenant([us], [mx], [mx-bodega], [ca]):" tenant &&
  tenant=${tenant:-us}
  read -p "Please enter path of file to upload to Sauce Labs [${WALMART_APP_FILENAME_IOS:-./wcp/app/glass-${tenant}.zip}]: " UPLOAD_APP_PATH &&
  UPLOAD_APP_PATH=${UPLOAD_APP_PATH:-./wcp/app/glass-${tenant}.zip} &&
  echo ${UPLOAD_APP_PATH}
  read -p "Please enter file name to be used in Sauce Labs storage location ( glass-${tenant}.zip | glass-${tenant}-release-latest.zip): " FILE_NAME &&
  FILE_NAME=${FILE_NAME:-glass-${tenant}.zip} &&
  echo "Sauce Labs Account: \\${SAUCE_USERNAME} \nUploading app to Sauce Labs ... " &&
  curl -o /tmp/saucelabs_upload.txt --progress-bar \
    -F "payload=@${UPLOAD_APP_PATH}" \
    -F name=${FILE_NAME} \
    -u ${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY} \
    https://api.us-west-1.saucelabs.com/v1/storage/upload &&
  head /tmp/saucelabs_upload.txt &&
  echo "\nSauce Labs File Location: storage:filename=${FILE_NAME}"
}


uploadAndroid() {
  read -p "Please enter app tenant([us], [mx], [mx-bodega], [ca]):" tenant &&
  tenant=${tenant:-us}
  read -p "Please enter path of file to upload to Sauce Labs [${WALMART_APP_FILENAME_ANDROID:-./wcp/app/glass-${tenant}.apk}]: " UPLOAD_APP_PATH &&
  UPLOAD_APP_PATH=${UPLOAD_APP_PATH:-./wcp/app/glass-${tenant}.apk} &&
  echo ${UPLOAD_APP_PATH}
  read -p "Please enter file name to be used in Sauce Labs storage location ( glass-${tenant}.apk | glass-${tenant}-release-latest.apk): " FILE_NAME &&
  FILE_NAME=${FILE_NAME:-glass-${tenant}.apk} &&
  echo "Sauce Labs Account: \\${SAUCE_USERNAME} \nUploading app to Sauce Labs ... " &&
  curl -o /tmp/saucelabs_upload.txt --progress-bar \
    -F "payload=@${UPLOAD_APP_PATH}" \
    -F name=${FILE_NAME} \
    -u ${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY} \
    https://api.us-west-1.saucelabs.com/v1/storage/upload &&
  head /tmp/saucelabs_upload.txt &&
  echo "\nSauce Labs File Location: storage:filename=${FILE_NAME}"
}

if ! [ "${SAUCE_USERNAME}" ]; then
  echo "ERROR: SAUCE_USERNAME is not set"
  exit 1
fi

if ! [ "${SAUCE_ACCESS_KEY}" ]; then
  echo "ERROR: SAUCE_ACCESS_KEY is not set"
  exit 1
fi

"$@"
