downloadR2() {
  LATEST=$(curl "https://ci.artifacts.walmart.com/artifactory/devtools-mvn-prod-local/com/walmartlabs/r2/maven-metadata.xml" | grep latest | cut -sd'>' -f 2 | cut -sd'<' -f 1)
  mkdir -p r2-binary &&
  # LATEST=3.39.1
  echo "Downloading latest R2 Jar - ${LATEST} ..." &&
  curl -f -L "https://ci.artifacts.walmart.com/artifactory/devtools-mvn-prod-local/com/walmartlabs/r2/${LATEST}/r2-${LATEST}.jar" > r2-binary/r2.jar
}

downloadIos() {
  appVersion=$(head us/app-versions/ios.txt) &&
  read -p "Please enter app version [${appVersion}]: " appVersion &&
  appVersion=${appVersion:-$(head us/app-versions/ios.txt)} &&
  FILE_TYPE="zip"
  appBranch="b2b-glass-qa-nightly-arm64-sim"


  echo "Downloading iOS build from Nexus - ${appBranch}/${appVersion}"
  LATEST=$(curl "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn-snapshots-local/com/walmart/ios/glass/usa-b2b/${appBranch}/${appVersion}/maven-metadata.xml" | grep latest | cut -sd'>' -f 2 | cut -sd'<' -f 1)
  LATEST_FILE=$(curl -f -L "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn-snapshots-local/com/walmart/ios/glass/usa-b2b/${appBranch}/${appVersion}/${LATEST}/maven-metadata.xml" | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)
  echo "Downloading iOS app - ${appBranch}/${LATEST}/${LATEST_FILE} ..."
  echo "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn-snapshots-local/com/walmart/ios/glass/usa-b2b/${appBranch}/${appVersion}/${LATEST}/${appVersion}-${LATEST_FILE}.${FILE_TYPE}"
  curl -f -L "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn-snapshots-local/com/walmart/ios/glass/usa-b2b/${appBranch}/${appVersion}/${LATEST}/${appVersion}-${LATEST_FILE}.${FILE_TYPE}" -o us/app/glass-development-b2b-latest.${FILE_TYPE} &&
  echo "Download complete \nBuild info: ${appBranch}/${LATEST} \nFile Loation: \\033[0;32m./us/app/glass-development-b2b-latest.${FILE_TYPE}"
}

downloadAndroid() {
  appVersion=$(head us/app-versions/android.txt) &&
  read -p "Please enter app version [${appVersion}]: " appVersion &&
  appVersion=${appVersion:-$(head us/app-versions/android.txt)} &&
  appBranch="us-b2b-development"
  LATEST=$(curl "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-android-mvn/com/walmart/android/glass/${appBranch}/glass-us-b2b-apk-debug/${appVersion}-debug--SNAPSHOT/maven-metadata.xml" | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)
  echo "Downloading Android app - ${appBranch}/${LATEST} ..."          
  curl -f -L "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-android-mvn/com/walmart/android/glass/${appBranch}/glass-us-b2b-apk-debug/${appVersion}-debug--SNAPSHOT/glass-us-b2b-apk-debug-${LATEST}.apk" -o us/app/glassB2b.apk &&
  echo "Download complete \nBuild info: ${appBranch}/${LATEST} \nFile Loation: \\033[0;32m./us/app/glassB2b.apk"
}

"$@"
