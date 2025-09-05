downloadIos() {
  appVersion=$(head sellerCenter/app-versions/ios.txt) &&
  read -p "Please enter app version [${appVersion}]: " appVersion &&
  appVersion=${appVersion:-$(head sellerCenter/app-versions/ios.txt)} &&
  read -p "Please enter app branch ([glass-qa-intel-nightly-x86_64-sim]): " appBranch &&
  appBranch=${appBranch:-glass-qa-intel-nightly-x86_64-sim}

  if [ "${appBranch}" = "glass-qa-intel-nightly-x86_64-sim" ]; then
    FILE_TYPE="zip"
  else
    FILE_TYPE="ipa"
  fi

  echo "Downloading iOS build from Nexus - ${appBranch}/${appVersion}"
  LATEST=$(curl "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn-snapshots-local/com/walmart/ios/glass/sellercenter/${appBranch}/${appVersion}/maven-metadata.xml" | grep latest | cut -sd'>' -f 2 | cut -sd'<' -f 1)
  LATEST_FILE=$(curl -f -L "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn-snapshots-local/com/walmart/ios/glass/sellercenter/${appBranch}/${appVersion}/${LATEST}/maven-metadata.xml" | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)
  echo "Downloading iOS app - ${appBranch}/${LATEST}/${LATEST_FILE} ..."
  echo "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn-snapshots-local/com/walmart/ios/glass/sellercenter/${appBranch}/${appVersion}/${LATEST}/${appVersion}-${LATEST_FILE}.${FILE_TYPE}"
  curl -f -L "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn-snapshots-local/com/walmart/ios/glass/sellercenter/${appBranch}/${appVersion}/${LATEST}/${appVersion}-${LATEST_FILE}.${FILE_TYPE}" -o sellerCenter/app/sellerCenter.${FILE_TYPE} &&
  echo "Download complete \nBuild info: ${appBranch}/${LATEST} \nFile Loation: \\033[0;32m./sellerCenter/app/sellerCenter.${FILE_TYPE}"
}

downloadAndroid() {
  appVersion=$(head sellerCenter/app-versions/android.txt) &&
  read -p "Please enter app version [${appVersion}]: " appVersion &&
  appVersion=${appVersion:-$(head sellerCenter/app-versions/android.txt)} &&
  read -p "Please enter app branch ([seller-development]): " appBranch &&
  appBranch=${appBranch:-seller-development}

  LATEST=$(curl "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-android-mvn-snapshots-local/com/walmart/android/glass/${appBranch}/glass-seller-apk-debug/${appVersion}-debug--SNAPSHOT/maven-metadata.xml" | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)
  if [ "${appBranch}" = "seller-development" ]; then
    echo "Downloading Android app - ${appBranch}/${LATEST} ..." &&
    curl -f -L "https://mvn.ci.artifacts.walmart.com/artifactory/walmart-android-mvn-snapshots-local/com/walmart/android/glass/${appBranch}/glass-seller-apk-debug/${appVersion}-debug--SNAPSHOT/glass-seller-apk-debug-${LATEST}.apk" -o sellerCenter/app/sellerCenter.apk &&
    echo "Download complete \nBuild info: ${appBranch}/${LATEST} \nFile Loation: \\033[0;32m./sellerCenter/app/sellerCenter.apk"
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
