downloadR2() {
  LATEST=$(curl "https://ci.artifacts.walmart.com/artifactory/devtools-mvn-prod-local/com/walmartlabs/r2/maven-metadata.xml" | grep latest | cut -sd'>' -f 2 | cut -sd'<' -f 1)
  mkdir -p r2-binary &&
  # LATEST=3.39.1
  echo "Downloading latest R2 Jar - ${LATEST} ..." &&
  curl -f -L "https://ci.artifacts.walmart.com/artifactory/devtools-mvn-prod-local/com/walmartlabs/r2/${LATEST}/r2-${LATEST}.jar" > r2-binary/r2.jar
}

# downloadIos() {
#   appVersion=$(head us/app-versions/ios.txt) &&
#   read -p "Please enter app version [${appVersion}]: " appVersion &&
#   appVersion=${appVersion:-$(head us/app-versions/ios.txt)} &&
#   read -p "Please enter app branch ([glass-qa-nightly-sim], glass-qa-intel-nightly-sim, glass-release-candidate-sim, glass-qa-nightly-ipa, or glass-release-candidate-ipa): " appBranch &&
#   appBranch=${appBranch:-glass-qa-nightly-sim}

#   if [ "${appBranch}" = "glass-qa-nightly-sim" ] || [ "${appBranch}" = "glass-qa-intel-nightly-sim" ] || [ "${appBranch}" =  "glass-release-candidate-sim" ]; then
#     FILE_TYPE="zip"
#   else
#     FILE_TYPE="ipa"
#   fi

#   echo "Downloading iOS build from Nexus - ${appBranch}/${appVersion}"
#   #LATEST=$(curl "https://repository.walmart.com/content/repositories/public_snapshot/com/walmart/ios/glass/usa/${appBranch}/${appVersion}-debug/maven-metadata.xml" | grep latest | cut -sd'>' -f 2 | cut -sd'<' -f 1)
#   LATEST=$(curl "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn/com/walmart/ios/glass/usa/${appBranch}/${appVersion}-debug/maven-metadata.xml" | grep latest | cut -sd'>' -f 2 | cut -sd'<' -f 1)
#   LATEST_FILE=$(curl -f -L "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn/com/walmart/ios/glass/usa/${appBranch}/${appVersion}-debug/${LATEST}/maven-metadata.xml" | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)
#   echo "Downloading iOS app - ${appBranch}/${LATEST}/${LATEST_FILE} ..."
#   echo "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn/com/walmart/ios/glass/usa/${appBranch}/${appVersion}-debug/${LATEST}/${appVersion}-debug-${LATEST_FILE}.${FILE_TYPE}"
#   #curl -f -L "https://repository.walmart.com/nexus/service/local/artifact/maven/redirect?r=public_snapshot&g=com.walmart.ios.glass.usa.${appBranch}&a=${appVersion}-debug&v=LATEST&p=${FILE_TYPE}" -o us/app/glass.${FILE_TYPE} &&
#   curl -f -L "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn/com/walmart/ios/glass/usa/${appBranch}/${appVersion}-debug/${LATEST}/${appVersion}-debug-${LATEST_FILE}.${FILE_TYPE}" -o us/app/glass.${FILE_TYPE} &&
#   echo "Download complete \nBuild info: ${appBranch}/${LATEST} \nFile Loation: \\033[0;32m./us/app/glass.${FILE_TYPE}"
# }

downloadIos() {
  appVersion=$(head us/app-versions/ios.txt) &&
  read -p "Please enter app version [${appVersion}]: " appVersion &&
  appVersion=${appVersion:-$(head us/app-versions/ios.txt)} &&
  read -p "Please enter app branch (glass-qa-nightly-arm64-sim, glass-qa-intel-nightly-x86_64-sim, glass-release-candidate-arm64-sim, glass-release-candidate-x86_64-sim, glass-qa-nightly-ipa, or glass-release-candidate-ipa): " appBranch &&
  appBranch=${appBranch:--arm64-sim}

  if [ "${appBranch}" = "glass-qa-nightly-arm64-sim" ] || [ "${appBranch}" = "glass-qa-intel-nightly-x86_64-sim" ] || [ "${appBranch}" =  "glass-release-candidate-arm64-sim" ] || [ "${appBranch}" =  "glass-release-candidate-x86_64-sim" ] || [ "${appBranch}" =  "-arm64-sim" ]; then
    FILE_TYPE="zip"
  else
    FILE_TYPE="ipa"
  fi

  echo "Downloading iOS build from Nexus - ${appBranch}/${appVersion}"
  LATEST=$(curl "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn-snapshots-local/com/walmart/ios/glass/usa/${appBranch}/${appVersion}-debug/maven-metadata.xml" | grep latest | cut -sd'>' -f 2 | cut -sd'<' -f 1)
  LATEST_FILE=$(curl -f -L "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn-snapshots-local/com/walmart/ios/glass/usa/${appBranch}/${appVersion}-debug/${LATEST}/maven-metadata.xml" | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)
  echo "Downloading iOS app - ${appBranch}/${LATEST}/${LATEST_FILE} ..."
  echo "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn-snapshots-local/com/walmart/ios/glass/usa/${appBranch}/${appVersion}-debug/${LATEST}/${appVersion}-debug-${LATEST_FILE}.${FILE_TYPE}"
  curl -f -L "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn-snapshots-local/com/walmart/ios/glass/usa/${appBranch}/${appVersion}-debug/${LATEST}/${appVersion}-debug-${LATEST_FILE}.${FILE_TYPE}" -o us/app/glass.${FILE_TYPE} &&
  echo "Download complete \nBuild info: ${appBranch}/${LATEST} \nFile Loation: \\033[0;32m./us/app/glass.${FILE_TYPE}"
}

downloadAndroid() {
  appVersion=$(head us/app-versions/android.txt) &&
  read -p "Please enter app version [${appVersion}]: " appVersion &&
  appVersion=${appVersion:-$(head us/app-versions/android.txt)} &&
  read -p "Please enter app branch ([us-development] or us-RC): " appBranch &&
  appBranch=${appBranch:-us-development}

  LATEST=$(curl "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-android-mvn/com/walmart/android/glass/${appBranch}/glass-us-apk-debug/${appVersion}-debug--SNAPSHOT/maven-metadata.xml" | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)
  if [ "${appBranch}" = "us-development" ] || [ "${appBranch}" =  "us-RC" ]; then
    echo "Downloading Android app - ${appBranch}/${LATEST} ..." &&
    curl -f -L "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-android-mvn/com/walmart/android/glass/${appBranch}/glass-us-apk-debug/${appVersion}-debug--SNAPSHOT/glass-us-apk-debug-${LATEST}.apk" -o us/app/glass.apk &&
    echo "Download complete \nBuild info: ${appBranch}/${LATEST} \nFile Loation: \\033[0;32m./us/app/glass.apk"
  else
     echo "[ERROR] Invalid branch name entered: ${appBranch}\n"
  fi
}

downloadSauceConnect() {
  curl -f -L "https://saucelabs.com/downloads/sc-4.5.4-osx.zip" > dependencies/sc.zip &&
  unzip -o dependencies/sc.zip -d dependencies &&
  rm -rf dependencies/sc.zip &&
  mv dependencies/sc* dependencies/sc
}

"$@"
