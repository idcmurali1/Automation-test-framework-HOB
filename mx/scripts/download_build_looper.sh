#Downloading Build Passing the URL for the maven artifact repository which automatically downloads a App Build

echo "[INFO-QAA] Downloading {${BANNER} | ${RC_VERSION} | ${PLATFORM}}"
echo "[INFO-QAA] URL: ${URL_DOWNLOAD_BUILD}"
echo "[INFO-QAA] Base Path to file: $BASE_PATH_TO_FILE"
echo "[INFO-QAA] Looper Temp Env Vars file: $LOOPER_TMP_ENV_VARS"

# Donwload app file using curl command and saved in BASE_PATH_TO_FILE with a temp name PREFIX_SAUCE_FILE_NAME with no extension [.apk, .zip or .ipa]
curl -o ${BASE_PATH_TO_FILE}${PREFIX_SAUCE_FILE_NAME} ${URL_DOWNLOAD_BUILD}

# setting temp variable to validate binary downloaded
export FILE_NAME_TO_VERIFY=${BASE_PATH_TO_FILE}${PREFIX_SAUCE_FILE_NAME} 

if [ $PLATFORM = "ios" ]; then
  # if platform is iOS it can be an .ipa for real devices or .zip for simulators. Validate which kind of build is to set file extension
  if [ "$(unzip -c ${FILE_NAME_TO_VERIFY} | grep -o 'Payload' | wc -l)" -gt 0 ]; then
    echo "[DEBUG-QAA] Downloaded an IPA file"
    export FILE_EXT=".ipa"
    # Export in temp looper file iOS type of build .ipa = real device
    echo "IOS_TYPE_BUILD=RealDevice" > ${LOOPER_TMP_ENV_VARS}
  else
    echo "[DEBUG-QAA] Downloaded a ZIP file"
    export FILE_EXT=".zip"
    # Export in temp looper file iOS type of build .zip = simulator
    echo "IOS_TYPE_BUILD=Simulator" > ${LOOPER_TMP_ENV_VARS}
  fi
else
  # in case for any other platform (android) default will be .APK
  echo "[DEBUG-QAA] Downloaded an APK file"
  export FILE_EXT=".apk" 
fi

# setting file name to upload to saucelabs with properly file extension
export SAUCE_FILE_NAME=${PREFIX_SAUCE_FILE_NAME}${FILE_EXT} 
# rename build downloaded with an extension previously defined
mv -f $FILE_NAME_TO_VERIFY ${BASE_PATH_TO_FILE}${SAUCE_FILE_NAME}
echo "[DEBUG-QAA] Renamed file ${PREFIX_SAUCE_FILE_NAME} to ${SAUCE_FILE_NAME} in path ${BASE_PATH_TO_FILE}"
# export SAUCE_FILE_NAME variable in a temp env_vars file to make available for other steps/scripts to use it for upload build
echo "SAUCE_FILE_NAME=${SAUCE_FILE_NAME}" >> ${LOOPER_TMP_ENV_VARS}
