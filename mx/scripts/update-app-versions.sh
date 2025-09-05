# Load variable SAUCE_FILE_NAME
source ${LOOPER_TMP_ENV_VARS}

echo "[INFO-QAA] Looper Temp Env Vars file loaded"
echo "[INFO-QAA] SAUCE_FILE_NAME=${SAUCE_FILE_NAME} | SAUCE_APP_IDENTIFIER=${SAUCE_APP_IDENTIFIER} | SAUCE_BUILD_ID=${SAUCE_BUILD_ID}"
echo "[INFO-QAA] Branch in which will be updated build app details: ${BRANCH_TO_UPGRADE_APP_VERSION}"

git config --add remote.origin.fetch +refs/heads/$BRANCH_TO_UPGRADE_APP_VERSION:refs/remotes/origin/$BRANCH_TO_UPGRADE_APP_VERSION
git fetch
git checkout ${BRANCH_TO_UPGRADE_APP_VERSION}
git pull

APP_PROPERTIES_FILE=${BASE_PATH_TO_APP_VERSIONS}\/${PLATFORM}\/${BANNER}.properties
source $APP_PROPERTIES_FILE
echo "[DEBUG-QAA] App properties file loaded: ${APP_PROPERTIES_FILE}"

current_version=$(echo $appVersion)
echo "[DEBUG-QAA] Current version in properties file loaded: $current_version"

next_version=$(echo $RC_VERSION)

echo "[DEBUG-QAA] Setting build details in current-branch '$BRANCH_TO_UPGRADE_APP_VERSION' for new app version $next_version"
sed -i.bak -e "s|^appVersion=.*|appVersion=$next_version|" "$APP_PROPERTIES_FILE"
sed -i.bak -e "s|^buildNumber=.*|buildNumber=$SAUCE_BUILD_ID|" "$APP_PROPERTIES_FILE"
sed -i.bak -e "s|^sauceFilename=.*|sauceFilename=$SAUCE_FILE_NAME|" "$APP_PROPERTIES_FILE"

if [ "$PLATFORM" == "ios" ]; then
  sed -i.bak -e "s|^typeBuild=.*|typeBuild=$IOS_TYPE_BUILD|" "$APP_PROPERTIES_FILE"
  
  # If simulator build verify cpu architecture
  if [ "$IOS_TYPE_BUILD" == "Simulator" ]; then
    if [ "$IOS_CPU_ARCHITECTURE" == "arm64" ]; then
      sed -i.bak -e "s|^isArmArchitecture=.*|isArmArchitecture=true|" "$APP_PROPERTIES_FILE"
    else
      sed -i.bak -e "s|^isArmArchitecture=.*|isArmArchitecture=false|" "$APP_PROPERTIES_FILE"
    fi
  else # case real device build - real device always has arm64 architecture
    sed -i.bak -e "s|^isArmArchitecture=.*|isArmArchitecture=true|" "$APP_PROPERTIES_FILE"
  fi
fi

source $APP_PROPERTIES_FILE
echo "[DEBUG-QAA] Verifying update details build info: ${APP_PROPERTIES_FILE}"
echo "[DEBUG-QAA] appVersion=$appVersion"
echo "[DEBUG-QAA] buildNumber=$buildNumber"
echo "[DEBUG-QAA] sauceFilename=$sauceFilename"

if [ "$PLATFORM" == "ios" ]; then
  echo "[DEBUG-QAA] typeBuild=$typeBuild"
  echo "[DEBUG-QAA] isArmArchitecture=$isArmArchitecture"
fi

git add ${APP_PROPERTIES_FILE}
git commit -m "[Looper] Bumped app details MX RC $next_version - $BANNER - $PLATFORM"
git push origin ${BRANCH_TO_UPGRADE_APP_VERSION}