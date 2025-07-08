# !/bin/bash

#Downloading Build for Sauce
#unsetting proxies
export https_proxy=""
export http_proxy=""

if [[ "${MARKET}" != "us" && "${MARKET}" != "mx" && "${MARKET}" != "mx-bodega" && "${MARKET}" != "ca" ]]; then
    echo "Invalid market. Supported markets are 'us', 'mx', 'mx-bodega', 'ca'."
    exit 1
fi

if [[ "${APP_PLATFORM}" != "android" && "${APP_PLATFORM}" != "ios" ]]; then
    echo "Invalid platform. Supported platforms are 'android' or 'ios'."
    exit 1
fi

# Andorid
if [ "${APP_PLATFORM}" = "android" ]; then
  BASE_URL="https://mvn.ci.artifacts.walmart.com/artifactory/walmart-android-mvn/com/walmart/android/glass"

  echo "Downloading Android build from - ${APP_BRANCH} and version - ${APP_VERSION}"
  LATEST=$(curl "${BASE_URL}/${APP_BRANCH}/glass-${MARKET}-apk-debug/${APP_VERSION}-debug--SNAPSHOT/maven-metadata.xml" | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)
  curl -f -L "${BASE_URL}/${APP_BRANCH}/glass-${MARKET}-apk-debug/${APP_VERSION}-debug--SNAPSHOT/glass-${MARKET}-apk-debug-${LATEST}.apk" -o wcp/app/${SAUCE_FILE_NAME} &&
  echo "Download complete \nBuild info: ${MARKET}/${APP_BRANCH}/${LATEST} \nFile Loation: wcp/app/${SAUCE_FILE_NAME}"  
    
  echo "If get 404, Please find the latest version in the repo: ${BASE_URL}/${APP_BRANCH}"
  
else
  # iOS
  if [ "${MARKET}" = "us" ]; then
    tenant="usa"
  elif [ "${MARKET}" = "mx" ]; then
    tenant="mexico"
  elif [ "${MARKET}" = "mx-bodega" ]; then
    tenant="mexico-bodega"
  else
    tenant="canada"
  fi

  if [ "${tenant}" = "usa" ] || [ "${tenant}" = "canada" ] || [ "${tenant}" = "mexico" ] || [ "${tenant}" = "mexico-bodega" ]  ; then
    BASE_URL="https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn/com/walmart/ios/glass/${tenant}/${APP_BRANCH}/${APP_VERSION}-debug"
  fi

  LATEST=$(curl "${BASE_URL}/maven-metadata.xml" | grep latest | cut -sd'>' -f 2 | cut -sd'<' -f 1)
  LATEST_FILE=$(curl -f -L "${BASE_URL}/${LATEST}/maven-metadata.xml" | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)
  echo "Downloading iOS app - ${tenant}/${APP_BRANCH}/${LATEST}/${LATEST_FILE} ..."

  if [ "${tenant}" = "usa" ] || [ "${tenant}" = "canada" ] || [ "${tenant}" = "mexico" ] || [ "${tenant}" = "mexico-bodega" ]; then
    echo "${BASE_URL}/${LATEST}/${APP_VERSION}-debug-${LATEST_FILE}.zip"
    curl -f -L "${BASE_URL}/${LATEST}/${APP_VERSION}-debug-${LATEST_FILE}.zip" -o wcp/app/${SAUCE_FILE_NAME} &&
    echo "Download complete \nBuild info: ${tenant}/${APP_BRANCH}/${LATEST} \nFile Loation: ./wcp/app/${SAUCE_FILE_NAME}"
  fi

  echo "If get 404, Please find the latest version in the repo: https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn/com/walmart/ios/glass/${tenant}/${APP_BRANCH}"
  
fi
