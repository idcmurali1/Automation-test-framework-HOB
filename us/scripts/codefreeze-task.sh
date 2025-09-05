#!/usr/bin/env bash

set -exo pipefail


###Push development to us/release-latest###

if [ "${flow_type}" == "branching" ]; then

  git config --add remote.origin.fetch +refs/heads/development:refs/remotes/origin/development
  git fetch
  git checkout development
  git pull

  current_app_version=$(cat us/app-versions/ios.txt)

  echo "Updating us/release-latest version to $current_app_version"
  git push origin +development:us/release-latest
  git push origin +development:us/release-${current_app_version}

fi

###Incrementing Version Number in Development###

if [ "${flow_type}" == "versioning" ]; then

  git config --add remote.origin.fetch +refs/heads/development:refs/remotes/origin/development
  git fetch
  git checkout development
  git pull

  if [ "${platform}" == "all" ]; then

    APP_VERSION=$(head us/app-versions/ios.txt)
    current_version=$(echo $APP_VERSION)
    next_version=$(echo $APP_VERSION | awk -F. '{ print $1"."$2+1}')

    echo "Setting next appversion for current-branch to $next_version"

    echo "$next_version" > us/app-versions/ios.txt
    git add us/app-versions/ios.txt
    echo "$next_version" > us/app-versions/android.txt
    git add us/app-versions/android.txt

    # LooperPro
    APP_VERSION=$(head us/app-versions/development-latest/ios.txt)
    current_version=$(echo $APP_VERSION)
    next_version=$(echo $APP_VERSION | awk -F. '{ print $1"."$2+1}')

    echo "Setting next appversion for release-latest to $current_version"
    echo "Setting next appversion for development-latest to $next_version"

    echo "$current_version" > us/app-versions/release-latest/ios.txt
    git add us/app-versions/release-latest/ios.txt
    echo "$current_version" > us/app-versions/release-latest/android.txt
    git add us/app-versions/release-latest/android.txt

    echo "$next_version" > us/app-versions/development-latest/ios.txt
    git add us/app-versions/development-latest/ios.txt
    echo "$next_version" > us/app-versions/development-latest/android.txt
    git add us/app-versions/development-latest/android.txt

  else

    APP_VERSION=$(head us/app-versions/${platform}.txt)
    current_version=$(echo $APP_VERSION)
    next_version=$(echo $APP_VERSION | awk -F. '{ print $1"."$2+1}')

    echo "Setting next appversion to $next_version"

    echo "$next_version" > us/app-versions/${platform}.txt
    git add us/app-versions/${platform}.txt

  fi

  git commit -m "GPMNETE-185786 [Looper] Codefreeze task: Bumped ${platform} appversion to $next_version"
  git push origin development
fi
