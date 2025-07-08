
#Only for download sim builds
downloadIos() {
  DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
  read -p "Please enter app tenant([us], [mx], [mx-bodega], [ca]):" tenantabbr &&
  tenantabbr=${tenantabbr:-us}
  appVersion=$(head ${DIR%/*}/../us/app-versions/ios.txt) && 
  read -p "Please enter app version [${appVersion}]: " appVersion &&
  appVersion=${appVersion:-$(head ${DIR%/*}/../us/app-versions/ios.txt)} &&
  read -p "Please enter app branch ( [glass-qa-intel-nightly-x86_64-sim], [glass-qa-nightly-arm64-sim], [glass-release-candidate-x86_64-sim], [glass-release-candidate-arm64-sim] ): " appBranch &&
  appBranch=${appBranch:-glass-qa-intel-nightly-x86_64-sim}

  if [ "${tenantabbr}" = "us" ]; then
    tenant="usa"
  elif [ "${tenantabbr}" = "mx" ]; then
    tenant="mexico"
  elif [ "${tenantabbr}" = "mx-bodega" ]; then
    tenant="mexico-bodega"
  else
    tenant="canada"
  fi

  if [ "$appBranch" = "glass-qa-nightly-arm64-sim" ] && [ "$tenant" != "usa" ]; then
    appBranch="${tenant}-${appBranch}"
  fi

  if [ "${tenant}" = "usa" ] || [ "${tenant}" = "canada" ] || [ "${tenant}" = "mexico" ] || [ "${tenant}" = "mexico-bodega" ]; then
    BASE_URL="https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn/com/walmart/ios/glass/${tenant}/${appBranch}/${appVersion}-debug"
  fi
  
  echo "Checking if the build is available - ${tenantabbr}/${appBranch}/${appVersion}-debug"
  response=$(curl -s -I "${BASE_URL}/maven-metadata.xml" | grep HTTP | cut -d ' ' -f 2)

  if [ "${response}" = 200 ]; then

    LATEST=$(curl "${BASE_URL}/maven-metadata.xml" | grep latest | cut -sd'>' -f 2 | cut -sd'<' -f 1)
    LATEST_FILE=$(curl -f -L "${BASE_URL}/${LATEST}/maven-metadata.xml" | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)

    echo "Downloading iOS app - ${tenant}/${appBranch}/${LATEST}/${LATEST_FILE} ..."
    if [ "${tenant}" = "usa" ] || [ "${tenant}" = "canada" ] || [ "${tenant}" = "mexico" ] || [ "${tenant}" = "mexico-bodega" ]; then
      echo "${BASE_URL}/${LATEST}/${appVersion}-debug-${LATEST_FILE}.zip"
      curl -f -L "${BASE_URL}/${LATEST}/${appVersion}-debug-${LATEST_FILE}.zip" -o wcp/app/glass-${tenantabbr}.zip &&
      echo "Download complete \nBuild info: ${tenant}/${appBranch}/${LATEST} \nFile Loation: ./wcp/app/glass-${tenantabbr}.zip"
    fi
  else
    echo "${appVersion} of the iOS app is not available in the repository. Please update to a lower app version."
    echo "Please find the latest version in the repo: https://mvn.ci.artifacts.walmart.com/artifactory/walmart-ios-mvn/com/walmart/ios/glass/${tenant}/${appBranch}"
  fi
}


# Download Android builds
downloadAndroid() {
  DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
  read -p "Please enter app tenant([us], [mx], [mx-bodega], [ca]):" tenant &&
  tenant=${tenant:-us}
  appVersion=$(head ${DIR%/*}/../us/app-versions/android.txt) &&
  read -p "Please enter app version [${appVersion}]: " appVersion &&
  appVersion=${appVersion:-$(head ${DIR%/*}/../us/app-versions/android.txt)} &&
  read -p "Please enter app branch ([${tenant}-development] or [${tenant}-RC]): " appBranch &&
  appBranch=${appBranch:-${tenant}-development}

  BASE_URL="https://mvn.ci.artifacts.walmart.com/artifactory/walmart-android-mvn/com/walmart/android/glass"

  # if [ "${tenant}" = "ca" ]; then
  #   BASE_URL="https://mvn.ci.artifacts.walmart.com/artifactory/walmart-android-mvn/ca/walmart/ecommerceapp/glass"
  # else [ "${tenant}" = "us" ]; then
  #   BASE_URL="https://mvn.ci.artifacts.walmart.com/artifactory/walmart-android-mvn/com/walmart/android/glass"
  # fi


  echo "Checking if the build is available - ${tenant}/${appBranch}/${appVersion}"
  response=$(curl -s -I "${BASE_URL}/${appBranch}/glass-${tenant}-apk-debug/${appVersion}-debug--SNAPSHOT/maven-metadata.xml" | grep HTTP | cut -d ' ' -f 2)
  
  if [ "${response}" = 200 ]; then
  
    LATEST=$(curl "${BASE_URL}/${appBranch}/glass-${tenant}-apk-debug/${appVersion}-debug--SNAPSHOT/maven-metadata.xml" | grep -m 1 value | cut -sd'>' -f 2 | cut -sd'<' -f 1)

    if [ "${appBranch}" = "${tenant}-development" ] || [ "${appBranch}" =  "${tenant}-RC" ]; then
      echo "Downloading Android app - ${appBranch}/${LATEST} ..." &&
      echo "${BASE_URL}/${appBranch}/glass-${tenant}-apk-debug/${appVersion}-debug--SNAPSHOT/glass-${tenant}-apk-debug-${LATEST}.apk"
      curl -f -L "${BASE_URL}/${appBranch}/glass-${tenant}-apk-debug/${appVersion}-debug--SNAPSHOT/glass-${tenant}-apk-debug-${LATEST}.apk" -o wcp/app/glass-${tenant}.apk &&
      echo "Download complete \nBuild info: ${tenant}/${appBranch}/${LATEST} \nFile Loation: wcp/app/glass-${tenant}.apk"
    else
      echo "[ERROR] Invalid branch name entered: ${appBranch}\n"
    fi
  else
    echo "${appVersion} of the Android app is not available in the repository. Please update to a lower app version."
    echo "Please find the latest version in the repo: ${BASE_URL}/${appBranch}"

  fi
}


"$@"
