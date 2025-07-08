# This is a shell script that retrieves the appropriate build from specified repositories based on given conditions.
# Specifically, it distinguishes between Android and iOS platforms, with separate repositories assigned for development
# and release versions. To ensure proper execution, required variables should be obtained from the
# ".looper-upload-app-sauce-labs.yml" configuration file. The relevant repository links for each scenario are:
    # Android development: "ca-development"
    # Android release: "ca-RC"
    # iOS development: "canada-glass-qa-nightly-sim"
    # iOS release: "glass-release-candidate-sim"
# The script employs the curl tool to fetch the most recent release package from the designated repository.
# Users need to provide the correct values for platform and build type when executing the script.

#unsetting proxies
export https_proxy=""
export http_proxy=""

if [[ "${APP_PLATFORM}" != "android" && "${APP_PLATFORM}" != "ios" ]]; then
    echo "Invalid platform. Supported platforms are 'android' or 'ios'."
    exit 1
fi

if [[ "${BUILD_TYPE}" != "development" && "${BUILD_TYPE}" != "release" ]]; then
    echo "Invalid build type. Supported types are 'development' or 'release'."
    exit 1
fi

if [ "${APP_PLATFORM}" = "android" ]; then

  if [ "${BUILD_TYPE}" = "development" ]; then
    REPO="ca-development"
  else
    REPO="ca-RC"
  fi
  echo "Downloading Android build from mvn from - ${REPO} and version - ${APP_VERSION}"
  Snapshots=$(curl "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-android-mvn/ca/walmart/ecommerceapp/glass/${REPO}/glass-ca-apk-debug/${APP_VERSION}-debug--SNAPSHOT/maven-metadata.xml" | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)
  echo "Snapshots - ${Snapshots}"
  echo "Downloading Android app - ${REPO}/${APP_VERSION} ..."
  echo "https://mvn.ci.artifacts.walmart.com/ui/native/walmart-android-mvn/ca/walmart/ecommerceapp/glass/${REPO}/glass-ca-apk-debug/${APP_VERSION}-debug--SNAPSHOT/glass-ca-apk-debug-${Snapshots}.${FILE_TYPE}"
  curl -f -L "https://mvn.ci.artifacts.walmart.com/ui/api/v1/download?repoKey=walmart-android-mvn&path=ca/walmart/ecommerceapp/glass/${REPO}/glass-ca-apk-debug/${APP_VERSION}-debug--SNAPSHOT/glass-ca-apk-debug-${Snapshots}.${FILE_TYPE}" -o ca/app/glass.apk &&
  echo "Download complete \nBuild info: ${BUILD_TYPE}/${APP_VERSION} \nFile Loation: \\033[0;32m./ca/app/glass.apk"

else

  if [ "${BUILD_TYPE}" = "development" ]; then
    REPO="glass-qa-intel-nightly-sim"
  else
    REPO="glass-release-candidate-sim"
  fi
  echo "Downloading iOS build from mvn from - ${REPO} and version - ${APP_VERSION}"
  Snapshots=$(curl "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn/com/walmart/ios/glass/canada/${REPO}/${APP_VERSION}/maven-metadata.xml" | grep latest | cut -sd'>' -f 2 | cut -sd'<' -f 1)
  echo "Snapshot - ${Snapshots}"
  Latest_Version=$(curl "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn/com/walmart/ios/glass/canada/${REPO}/${APP_VERSION}/${Snapshots}/maven-metadata.xml" | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)
  echo "Downloading iOS app with - ${Snapshots}/${Latest_Version} ..."
  curl -f -L "https://mvn.ci.artifacts.walmart.com/ui/api/v1/download?repoKey=walmart-ios-mvn&path=com/walmart/ios/glass/canada/${REPO}/${APP_VERSION}/${Snapshots}/${APP_VERSION}-${Latest_Version}.${FILE_TYPE}" -o ca/app/glass.zip &&
  echo "Download complete \nBuild info: ${BUILD_TYPE}/${APP_VERSION} \nFile Loation: \\033[0;32m./ca/app/glass.zip"
fi