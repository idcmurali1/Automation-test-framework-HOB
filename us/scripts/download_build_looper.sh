#Downloading Build for Sauce

#unsetting proxies
export https_proxy=""
export http_proxy=""

if [ "${APP_BUILD_URL}" != "null" ]; then

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
    LATEST=$(curl "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-android-mvn/com/walmart/android/glass/${APP_BRANCH}/glass-us-apk-debug/${APP_VERSION}-debug--SNAPSHOT/maven-metadata.xml" | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)

    if [ -n "${LATEST}" ]; then
      echo "Downloading Android app - ${APP_BRANCH}/${LATEST} ..."
      curl -f -L "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-android-mvn/com/walmart/android/glass/${APP_BRANCH}/glass-us-apk-debug/${APP_VERSION}-debug--SNAPSHOT/glass-us-apk-debug-${LATEST}.apk" -o us/app/glass.apk && \
      echo "Download complete. Build info: ${APP_BRANCH}/${LATEST}. File Location: ./us/app/glass.apk"
    else
      echo "Curling LATEST VERSION Failed"
      exit 1
    fi
  else
    MVN_LOCATION="walmart-ios-mvn-snapshots-local"

    if [ "${APP_BRANCH}" = "-arm64-sim" ] || [ "${APP_BRANCH}" = "glass-qa-nightly-arm64-sim" ] || [ "${APP_BRANCH}" = "glass-qa-intel-nightly-x86_64-sim" ] || [ "${APP_BRANCH}" =  "glass-release-candidate-arm64-sim" ] || [ "${APP_BRANCH}" =  "glass-release-candidate-x86_64-sim" ]; then
      FILE_TYPE="zip"
    else
      FILE_TYPE="ipa"
    fi

    echo "FILE_TYPE : ${FILE_TYPE}"
    echo "APP_BRANCH : ${APP_BRANCH}"
    echo "Downloading iOS build from Nexus - ${APP_BRANCH}/${APP_VERSION}"
    echo "LATEST_COMMAND :- curl https://mvn.ci.artifacts.walmart.com/artifactory/${MVN_LOCATION}/com/walmart/ios/glass/usa/${APP_BRANCH}/${APP_VERSION}-debug/maven-metadata.xml | grep latest | cut -sd'>' -f 2 | cut -sd'<' -f 1)"
    LATEST=$(curl "https://mvn.ci.artifacts.walmart.com/artifactory/${MVN_LOCATION}/com/walmart/ios/glass/usa/${APP_BRANCH}/${APP_VERSION}-debug/maven-metadata.xml" | grep latest | cut -sd'>' -f 2 | cut -sd'<' -f 1)

    if [ -n "${LATEST}" ]; then
      echo "LATEST VERSION : ${LATEST}"
      echo "Downloading iOS app - ${APP_BRANCH}/${LATEST} ..."
      echo "LATEST_FILE_COMMAND :- curl -f -L https://mvn.ci.artifacts.walmart.com/artifactory/${MVN_LOCATION}/com/walmart/ios/glass/usa/${APP_BRANCH}/${APP_VERSION}-debug/${LATEST}/maven-metadata.xml | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)"
      LATEST_FILE=$(curl -f -L "https://mvn.ci.artifacts.walmart.com/artifactory/${MVN_LOCATION}/com/walmart/ios/glass/usa/${APP_BRANCH}/${APP_VERSION}-debug/${LATEST}/maven-metadata.xml" | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)
    else
      echo "Curling LATEST VERSION Failed"
      exit 1
    fi

    if [ -n "$LATEST_FILE" ]; then
      echo "LATEST_FILE: ${LATEST_FILE}"
      echo "FINAL_CURL_COMMAND :- curl -f -L https://mvn.ci.artifacts.walmart.com/artifactory/${MVN_LOCATION}/com/walmart/ios/glass/usa/${APP_BRANCH}/${APP_VERSION}-debug/${LATEST}/${APP_VERSION}-debug-${LATEST_FILE}.${FILE_TYPE} -o us/app/glass.${FILE_TYPE}"
      curl -f -L "https://mvn.ci.artifacts.walmart.com/artifactory/${MVN_LOCATION}/com/walmart/ios/glass/usa/${APP_BRANCH}/${APP_VERSION}-debug/${LATEST}/${APP_VERSION}-debug-${LATEST_FILE}.${FILE_TYPE}" -o us/app/glass.${FILE_TYPE} && \
      echo "Download complete. Build info: ${APP_BRANCH}/${LATEST}. File Location: ./us/app/glass.${FILE_TYPE}"
    else
      echo "Curling LATEST FILE Failed"
      exit 1
    fi

  fi
fi
