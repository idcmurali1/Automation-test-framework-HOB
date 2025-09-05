#Downloading Build for Sauce

#unsetting proxies
export https_proxy=""
export http_proxy=""

if [ "${APP_BUILD_URL}" ]; then

  if [ "${FILE_TYPE}" ]; then
    echo "Downloading app build from artifactory - ${APP_BUILD_URL}"
    curl -f -L "${APP_BUILD_URL}" -o "sellerCenter/app/sellerCenter.${FILE_TYPE}" &&
    echo "Download complete. File Location:./sellerCenter/app/sellerCenter.${FILE_TYPE}"
  else
    echo "ERROR: FILE_TYPE is not set"
    exit 1
  fi

else

  if [ "${APP_PLATFORM}" = "android" ]; then
    echo "Downloading Android build from Nexus - ${APP_BRANCH}/${APP_VERSION}"
    LATEST=$(curl "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-android-mvn-snapshots-local/com/walmart/android/glass/${APP_BRANCH}/glass-seller-apk-debug/${APP_VERSION}-debug--SNAPSHOT/maven-metadata.xml" | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)

    if [ -n "${LATEST}" ]; then
      echo "Downloading Android app - ${APP_BRANCH}/${LATEST} ..." &&
      curl -f -L "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-android-mvn-snapshots-local/com/walmart/android/glass/${APP_BRANCH}/glass-seller-apk-debug/${APP_VERSION}-debug--SNAPSHOT/glass-seller-apk-debug-${LATEST}.apk" -o sellerCenter/app/sellerCenter.apk &&
      echo "Download complete \nBuild info: ${APP_BRANCH}/${LATEST} \nFile Loation: \\033[0;32m./sellerCenter/app/sellerCenter.apk"
    else
      echo "Curling LATEST VERSION Failed"
      exit 1
    fi
  else
    if [ "${APP_BRANCH}" = "glass-qa-intel-nightly-x86_64-sim" ]; then
      FILE_TYPE="zip"
    else
      FILE_TYPE="ipa"
    fi

    echo "FILE_TYPE : ${FILE_TYPE}"
    echo "APP_BRANCH : ${APP_BRANCH}"
    echo "Downloading iOS build from Nexus - ${APP_BRANCH}/${APP_VERSION}"
    LATEST=$(curl "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn-snapshots-local/com/walmart/ios/glass/sellercenter/${APP_BRANCH}/${APP_VERSION}/maven-metadata.xml" | grep latest | cut -sd'>' -f 2 | cut -sd'<' -f 1)

    if [ -n "${LATEST}" ]; then
      echo "LATEST VERSION : ${LATEST}"
      echo "Downloading iOS app - ${APP_BRANCH}/${LATEST} ..."
      LATEST_FILE=$(curl -f -L "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn-snapshots-local/com/walmart/ios/glass/sellercenter/${APP_BRANCH}/${APP_VERSION}/${LATEST}/maven-metadata.xml" | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)
    else
      echo "Curling LATEST VERSION Failed"
      exit 1
    fi

    if [ -n "$LATEST_FILE" ]; then
      echo "LATEST_FILE: ${LATEST_FILE}"
      curl -f -L "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn-snapshots-local/com/walmart/ios/glass/sellercenter/${APP_BRANCH}/${APP_VERSION}/${LATEST}/${APP_VERSION}-${LATEST_FILE}.${FILE_TYPE}" -o sellerCenter/app/sellerCenter.${FILE_TYPE} && \
      echo "Download complete. Build info: ${APP_BRANCH}/${LATEST}. File Location: ./sellerCenter/app/sellerCenter.${FILE_TYPE}"
    else
      echo "Curling LATEST FILE Failed"
      exit 1
    fi

  fi
fi
