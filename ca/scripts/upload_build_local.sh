uploadIos() {
  read -p "Please enter path of file to upload to Sauce Labs [${WALMART_APP_FILENAME_IOS:-./ca/app/glass.zip}]: " UPLOAD_APP_PATH &&
  UPLOAD_APP_PATH=${UPLOAD_APP_PATH:-${WALMART_APP_FILENAME_IOS:-'./ca/app/glass.zip'}} &&
  read -p "Please enter file name to be used in Sauce Labs storage location ([glass.zip] | glass-release-latest.zip): " FILE_NAME &&
  FILE_NAME=${FILE_NAME:-glass.zip} &&
  echo "Sauce Labs Account: \\033[0;32m${SAUCE_USERNAME}\\033[0m \nUploading app to Sauce Labs ... " &&
  curl -o /tmp/saucelabs_upload.txt --progress-bar \
    -F "payload=@${UPLOAD_APP_PATH}" \
    -F name=${FILE_NAME} \
    -u ${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY} \
    https://api.us-west-1.saucelabs.com/v1/storage/upload &&
  head /tmp/saucelabs_upload.txt &&
  echo "\nSauce Labs File Location: \\033[0;32mstorage:filename=${FILE_NAME}"
}

uploadAndroid() {
  read -p "Please enter path of file to upload to Sauce Labs [${WALMART_APP_FILENAME_ANDROID:-./ca/app/glass.apk}]: " UPLOAD_APP_PATH &&
  UPLOAD_APP_PATH=${UPLOAD_APP_PATH:-${WALMART_APP_FILENAME_ANDROID:-'./ca/app/glass.apk'}} &&
  read -p "Please enter file name to be used in Sauce Labs storage location ([glass.apk] | glass-release-latest.apk): " FILE_NAME &&
  FILE_NAME=${FILE_NAME:-glass.apk} &&
  echo "Sauce Labs Account: \\033[0;32m${SAUCE_USERNAME}\\033[0m \nUploading app to Sauce Labs ... " &&
  curl -o /tmp/saucelabs_upload.txt --progress-bar \
    -F "payload=@${UPLOAD_APP_PATH}" \
    -F name=${FILE_NAME} \
    -u ${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY} \
    https://api.us-west-1.saucelabs.com/v1/storage/upload &&
  head /tmp/saucelabs_upload.txt &&
  echo "\nSauce Labs File Location: \\033[0;32mstorage:filename=${FILE_NAME}"
}

uploadCommon() {
  read -p "Please enter path of file to upload to Sauce Labs common account (ce-r2) [Example: ./ca/app/glass.zip]: " UPLOAD_APP_PATH &&
  read -p "Please enter file name to be used in Sauce Labs common account (ce-r2) storage location [Example: walmart-feature-1234.zip]: " FILE_NAME &&
  echo "Sauce Labs Account: \\033[0;32mce-r2\\033[0m \nUploading app to Sauce Labs ... " &&
  curl -o /tmp/saucelabs_upload.txt --progress-bar \
    -F "payload=@${UPLOAD_APP_PATH}" \
    -F name=${FILE_NAME} \
    -u ce-r2:28b978f8-ee36-434a-bd31-b6f8eda2ba30 \
    https://api.us-west-1.saucelabs.com/v1/storage/upload &&
  head /tmp/saucelabs_upload.txt &&
  echo "\nSauce Labs File Location: \\033[0;32mstorage:filename=${FILE_NAME}"
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
