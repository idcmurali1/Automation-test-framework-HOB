downloadR2() {
  LATEST=$(curl "https://repository.walmart.com/content/repositories/pangaea_releases/com/walmartlabs/r2/maven-metadata.xml" | grep latest | cut -sd'>' -f 2 | cut -sd'<' -f 1)
  echo "Downloading latest R2 Jar - ${LATEST} ..." &&
  curl -f -L "https://repository.walmart.com/nexus/service/local/artifact/maven/redirect?r=pangaea_releases&g=com.walmartlabs&a=r2&v=LATEST&p=jar" > r2-binary/r2.jar
}

downloadIos() {
  appVersion=$(head ca/app-versions/ios.txt) &&
  read -p "Please enter app version [${appVersion}]: " appVersion &&
  appVersion=${appVersion:-$(head ca/app-versions/ios.txt)} &&
  read -p "Please enter app branch ([canada-glass-qa-nightly-sim], glass-release-candidate-sim, canada-glass-qa-nightly, or glass-release-candidate): " appBranch &&
  appBranch=${appBranch:-canada-glass-qa-nightly-sim}

  if [ "${appBranch}" = "canada-glass-qa-nightly-sim" ] || [ "${appBranch}" =  "glass-release-candidate-sim" ]; then
    FILE_TYPE="zip"
  else
    FILE_TYPE="ipa"
  fi

  echo "Downloading iOS build from Nexus - ${appBranch}/${appVersion}"
  LATEST=$(curl "https://repository.walmart.com/content/repositories/pangaea_snapshots/com/walmart/ios/glass/${appBranch}/${appVersion}/maven-metadata.xml" | grep latest | cut -sd'>' -f 2 | cut -sd'<' -f 1)
  echo "Downloading iOS app - ${appBranch}/${LATEST} ..."
  curl -f -L "https://repository.walmart.com/nexus/service/local/artifact/maven/redirect?r=pangaea_snapshots&g=com.walmart.ios.glass.canada.${appBranch}&a=${appVersion}&v=LATEST&p=${FILE_TYPE}" -o ca/app/glass.${FILE_TYPE} &&
  echo "Download complete \nBuild info: ${appBranch}/${LATEST} \nFile Loation: \\033[0;32m./ca/app/glass.${FILE_TYPE}"
}

downloadAndroid() {
  appVersion=$(head ca/app-versions/android.txt) &&
  read -p "Please enter app version [${appVersion}]: " appVersion &&
  appVersion=${appVersion:-$(head ca/app-versions/android.txt)} &&
  read -p "Please enter app branch ([ca-development] or ca-RC): " appBranch &&
  appBranch=${appBranch:-ca-development}

  LATEST=$(curl "https://repository.walmart.com/content/repositories/public_snapshot/com/walmart/android/glass/${appBranch}/glass-ca-apk-debug/${appVersion}-debug--SNAPSHOT/maven-metadata.xml" | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)
  if [ "${appBranch}" = "ca-development" ] || [ "${appBranch}" =  "ca-RC" ]; then
    echo "Downloading Android app - ${appBranch}/${LATEST} ..." &&
    curl -f -L "https://repository.walmart.com/nexus/service/local/artifact/maven/redirect?r=public_snapshot&g=com.walmart.android.glass.${appBranch}&a=glass-ca-apk-debug&v=${appVersion}-debug--SNAPSHOT&p=apk" > ca/app/glass.apk &&
    echo "Download complete \nBuild info: ${appBranch}/${LATEST} \nFile Loation: \\033[0;32m./ca/app/glass.apk"
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
