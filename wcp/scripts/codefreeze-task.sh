#!/usr/bin/env bash

set -exo pipefail


###Push development to mx/release-latest###

if [ "${flow_type}" == "branching" ]; then

  git config --add remote.origin.fetch +refs/heads/development:refs/remotes/origin/development
  git fetch
  git checkout development
  git pull

  current_release_app_version=$(cat wcp/looper/mx-release/app-version/mx-release-version.txt)
  echo "$current_release_app_version"
  echo "Updating mx/release-latest version to $current_release_app_version"
  git push origin +development:mx/release-latest
  # git push origin +development:mx/release-${current_release_app_version}

fi

###Incrementing Version Number for MX release###

if [ "${flow_type}" == "versioning" ]; then

  git config --add remote.origin.fetch +refs/heads/development:refs/remotes/origin/development
  git fetch
  git checkout development
  git pull

  APP_VERSION=$(head wcp/looper/mx-release/app-version/mx-release-version.txt)
  current_version=$(echo $APP_VERSION)
  next_version=$(echo $APP_VERSION | awk -F. '{ print $1"."$2+1}')

  echo "Setting next appversion for current-branch to $next_version"
  echo "$next_version" > wcp/looper/mx-release/app-version/mx-release-version.txt
  git add wcp/looper/mx-release/app-version/mx-release-version.txt
  git commit -m "GPMNETE-185786 [Looper] Codefreeze task: Bumped mx/bo release appversion to $next_version"
  git push origin development

fi