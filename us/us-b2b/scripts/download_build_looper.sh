#Downloading Build for Sauce

#unsetting proxies
export https_proxy=""
export http_proxy=""

if [ "${APP_BUILD_URL}" ]; then

  if [ "${FILE_TYPE}" ]; then
    echo "Downloading app build from Nexus - ${APP_BUILD_URL}"
    curl -f -L "${APP_BUILD_URL}" -o "us/app/glass.${FILE_TYPE}" &&
    echo "Download complete. File Location:./us/app/glass.${FILE_TYPE}"
  else
    echo "ERROR: FILE_TYPE is not set"
    exit 1
  fi
else

  if [ "${APP_PLATFORM}" = "android" ]; then
    echo "Downloading Android build from Nexus - ${APP_BRANCH}/${APP_VERSION}"
    LATEST=$(curl "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-android-mvn/com/walmart/android/glass/${APP_BRANCH}/glass-us-b2b-apk-debug/${APP_VERSION}-debug--SNAPSHOT/maven-metadata.xml" | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)

    if [ -n "${LATEST}" ]; then
      echo "Downloading Android app - ${APP_BRANCH}/${LATEST} ..."
      curl -f -L "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-android-mvn/com/walmart/android/glass/${APP_BRANCH}/glass-us-b2b-apk-debug/${APP_VERSION}-debug--SNAPSHOT/glass-us-b2b-apk-debug-${LATEST}.apk" -o us/app/glass.apk && \
      echo "Download complete. Build info: ${APP_BRANCH}/${LATEST}. File Location: ./us/app/glass.apk"
    else
      echo "Curling LATEST VERSION Failed"
      exit 1
    fi
  else
    if [ "${APP_BRANCH}" = "b2b-glass-qa-nightly-arm64-sim" ] || [ "${APP_BRANCH}" = "glass-qa-intel-nightly-sim" ] || [ "${APP_BRANCH}" =  "glass-release-candidate-sim" ]; then
      FILE_TYPE="zip"
    else
      FILE_TYPE="ipa"
    fi

    echo "FILE_TYPE : ${FILE_TYPE}"
    echo "APP_BRANCH : ${APP_BRANCH}"
    echo "Downloading iOS build from Nexus - ${APP_BRANCH}/${APP_VERSION}"
    echo "LATEST_COMMAND :- curl https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn-snapshots-local/com/walmart/ios/glass/usa-b2b/${APP_BRANCH}/${APP_VERSION}/maven-metadata.xml | grep latest | cut -sd'>' -f 2 | cut -sd'<' -f 1)"
    LATEST=$(curl "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn-snapshots-local/com/walmart/ios/glass/usa-b2b/${APP_BRANCH}/${APP_VERSION}/maven-metadata.xml" | grep latest | cut -sd'>' -f 2 | cut -sd'<' -f 1)

    if [ -n "${LATEST}" ]; then
      echo "LATEST VERSION : ${LATEST}"
      echo "Downloading iOS app - ${APP_BRANCH}/${LATEST} ..."
      echo "LATEST_FILE_COMMAND :- curl -f -L https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn-snapshots-local/com/walmart/ios/glass/usa-b2b/${APP_BRANCH}/${APP_VERSION}/${LATEST}/maven-metadata.xml | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)"
      LATEST_FILE=$(curl -f -L "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn-snapshots-local/com/walmart/ios/glass/usa-b2b/${APP_BRANCH}/${APP_VERSION}/${LATEST}/maven-metadata.xml" | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)
    else
      echo "Curling LATEST VERSION Failed"
      exit 1
    fi

    if [ -n "$LATEST_FILE" ]; then
      echo "LATEST_FILE: ${LATEST_FILE}"
      echo "FINAL_CURL_COMMAND :- curl -f -L https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn-snapshots-local/com/walmart/ios/glass/usa-b2b/${APP_BRANCH}/${APP_VERSION}/${LATEST}/${APP_VERSION}-${LATEST_FILE}.${FILE_TYPE} -o us/app/glass.${FILE_TYPE}"
      curl -f -L "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn-snapshots-local/com/walmart/ios/glass/usa-b2b/${APP_BRANCH}/${APP_VERSION}/${LATEST}/${APP_VERSION}-${LATEST_FILE}.${FILE_TYPE}" -o us/app/glass.${FILE_TYPE} && \
      echo "Download complete. Build info: ${APP_BRANCH}/${LATEST}. File Location: ./us/app/glass.${FILE_TYPE}"
    else
      echo "Curling LATEST FILE Failed"
      exit 1
    fi

  fi
fi