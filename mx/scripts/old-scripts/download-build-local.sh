#!/bin/bash

#==========================================================================================================================
#    AUTHOR: Sergio Fernandez (vn0t1qt)
#   CREATED: Jan/04/2022
#   UPDATED: Feb/03/2022
#
#  Copyright © 2021 Walmart. All rights reserved.
#==========================================================================================================================

source ./mx/scripts/colorful-print.sh

#--------------------------------------------------------------------------------------------------------------------------

function downloadAndroid() {
    local baseURL="https://repository.walmart.com/nexus/content/repositories/pangaea_snapshots/mx/walmart/android/glass/mx-development"
    local baseAppPath="mx/app/android"

    # Creation of 'baseAppPath' in case it doesn't exist...

    if [ ! -d "$baseAppPath" ]; then mkdir "$baseAppPath"; fi

    cprintTitle b "ANDROID MX GLASS APP BUILD DOWNLOAD"

    cprintMsg "${W}Project's Base URL = ${G}${baseURL}\n"

    # Request for 'appBranch' if $DOWNLOAD_ANDROID_APP_BRANCH variable does not exist...

    local appBranch=""

    if [ -z "$DOWNLOAD_ANDROID_APP_BRANCH" ]; then
        cprintWarningMark "DOWNLOAD_ANDROID_APP_BRANCH not found\n"

        local defaultAppBranch="glass-mx-apk-debug"

        cprintMsg "Please select App Branch...\n"
        while IFS= read -r line; do
            if [[ $line == DEFAULT:* ]]; then
                defaultAppBranch=${line/"DEFAULT:"/""}
                cprintMsg "    - $defaultAppBranch (default)"
            else
                cprintMsg "    - $line"
            fi
        done < mx/app-versions/android-branches.txt
        
        cprintMsg ""
        read -p "    Enter selected App Branch : " appBranch
        appBranch=${appBranch:-${defaultAppBranch}}
        cprintMsg ""
    else
        appBranch=$DOWNLOAD_ANDROID_APP_BRANCH
        cprintSuccessMark "DOWNLOAD_ANDROID_APP_BRANCH found\n"
    fi
    cprintMsg "${W}Selected App Branch : ${G}${appBranch}\n"

    local branchMetadataFile="${baseAppPath}/branch-maven-metadata.xml"

    cprintMsg "Fetching Branch's maven-metadata.xml - /${appBranch}/maven-metadata.xml ..."
    curl -o $branchMetadataFile "${baseURL}/${appBranch}/maven-metadata.xml" -#
    if [ $? != 0 ]; then cprintError "Fetch failed"; exit 1; fi

    # Check if file exist or not exist...

    local foundCheck=$(grep "404 - Metadata not found" $branchMetadataFile)
    if [ -z "$foundCheck" ]; then

        # Check if <latest> is not present...

        local latest=$(grep "<latest>" $branchMetadataFile | cut -sd'>' -f 2 | cut -sd'<' -f 1)
        if [ -z "$latest" ]; then
            cprintWarningMark "Branch's maven-metadata.xml does not describe <latest>\n"

            # Request for the desired snapshot if DOWNLOAD_ANDROID_APP_SNAPSHOT variable does not exist...

            if [ -z "$DOWNLOAD_ANDROID_APP_SNAPSHOT" ]; then
                cprintMsg "Select the desired Snapshot instead...\n"
                local snapshots=$(grep "<version>" $branchMetadataFile | cut -sd'>' -f 2 | cut -sd'<' -f 1)
                local snapshotsArr=()
                while read snapshot; do
                    snapshotsArr+=("$snapshot")
                    cprintMsg "    - $snapshot"
                done <<< "$snapshots"
                
                cprintMsg ""
                read -p "    Enter selected Snapshot : " latest
            else
                latest=$DOWNLOAD_ANDROID_APP_SNAPSHOT
                cprintSuccessMark "DOWNLOAD_ANDROID_APP_SNAPSHOT found"
            fi
            
            # Check given latest exist in the file...

            local latestCheck=$(grep -w "$latest" $branchMetadataFile | cut -sd'>' -f 2 | cut -sd'<' -f 1)
            if [ "$latestCheck" == "" ] || [ "$latestCheck" != "$latest" ]; then
                cprintError "\nProvided snapshot '$latest' not found in Branch's maven-metadata.xml"
                rm -rf ${branchMetadataFile}
                exit 1
            fi
        fi
        
        rm -rf ${branchMetadataFile}
        cprintMsg "\n${W}Selected/Latest Snapshot : ${G}${latest}\n"
    else
        cprintError "File does not exist"
        rm -rf $branchMetadataFile
        exit 1
    fi
    
    # Fetch Snapshot's Maven Metadata File to get .ipa or .zip file...

    local snapshotMetadataFile="${baseAppPath}/snapshot-maven-metadata.xml"

    cprintMsg "Fetching Snapshot's maven-metadata.xml - /${appBranch}/${latest}/maven-metadata.xml ..."
    curl -o $snapshotMetadataFile "${baseURL}/${appBranch}/${latest}/maven-metadata.xml" -#
    if [ $? != 0 ]; then cprintError "Fetch failed"; exit 1; fi

    # Check if file exist or not exist...

    local foundCheck=$(grep "404 - Metadata not found" $snapshotMetadataFile)
    if [ -z "$foundCheck" ]; then
        local fileName=$(grep "<extension>apk</extension>" $snapshotMetadataFile -A1 | grep "<value>" | cut -sd'>' -f 2 | cut -sd'<' -f 1)
        rm -rf $snapshotMetadataFile

        if [ -z "$fileName" ]; then
            cprintError "Not able to extract file name for *.apk file"
            exit 1
        else
            cprintMsg "\n${W}APK File Name : ${G}${fileName}.apk\n"
        fi
    else
        cprintError "File does not exist"
        rm -rf $snapshotMetadataFile
        exit 1
    fi

    # Show summary for all selections...

    cprintMsg "${W}Download Summary...\n"
    cprintMsg "    - ${W}Project's Repo : ${G}${baseURL}"
    cprintMsg "    - ${W}App Branch     : ${G}${appBranch}"
    cprintMsg "    - ${W}App Snapshot   : ${G}${latest}"
    cprintMsg "    - ${W}File Name      : ${G}${appBranch}-${fileName}.apk\n"

    # Download file...

    cprintMsg "Downloading Build - /${appBranch}-${fileName}.apk ..."
    curl -f -L "${baseURL}/${appBranch}/${latest}/${appBranch}-${fileName}.apk" -o "${baseAppPath}/glass-mx.apk" -#
    if [ $? != 0 ]; then
        cprintError "Download failed"
        exit 1
    else
        cprintMsg "\n${W}Download Location : ${G}${baseAppPath}/glass-mx.apk\n"
    fi

    cprintSuccess "Download process finished"
    exit 0
}

#--------------------------------------------------------------------------------------------------------------------------

function downloadIos() {
    local baseURL="https://repository.walmart.com/nexus/content/repositories/pangaea_snapshots/com/walmart/ios/glass/mexico"
    local baseAppPath="mx/app/ios"

    # Creation of 'baseAppPath' in case it doesn't exist...

    if [ ! -d "$baseAppPath" ]; then mkdir "$baseAppPath"; fi

    cprintTitle b "IOS MX GLASS APP BUILD DOWNLOAD"

    cprintMsg "${W}Project's Base URL = ${G}${baseURL}\n"

    # Request for 'appBranch' if $DOWNLOAD_IOS_APP_BRANCH variable does not exist...

    local appBranch=""

    if [ -z "$DOWNLOAD_IOS_APP_BRANCH" ]; then
        cprintWarningMark "DOWNLOAD_IOS_APP_BRANCH not found\n"

        local defaultAppBranch="mexico-glass-qa-nightly-sim"

        cprintMsg "Please select App Branch...\n"
        while IFS= read -r line; do
            if [[ $line == DEFAULT:* ]]; then
                defaultAppBranch=${line/"DEFAULT:"/""}
                cprintMsg "    - $defaultAppBranch (default)"
            else
                cprintMsg "    - $line"
            fi
        done < mx/app-versions/ios-branches.txt
        
        cprintMsg ""
        read -p "    Enter selected App Branch : " appBranch
        appBranch=${appBranch:-${defaultAppBranch}}
        cprintMsg ""
    else
        appBranch=$DOWNLOAD_IOS_APP_BRANCH
        cprintSuccessMark "DOWNLOAD_IOS_APP_BRANCH found\n"
    fi
    cprintMsg "${W}Selected App Branch : ${G}${appBranch}\n"

    # Request for 'appVersion' if $DOWNLOAD_IOS_APP_VERSION variable does not exist...

    local appVersion=""

    if [ -z "$DOWNLOAD_IOS_APP_VERSION" ]; then
        cprintWarningMark "DOWNLOAD_IOS_APP_VERSION not found\n"

        local defaultAppVersion="1.0.0"

        cprintMsg "Please select App Version...\n"
        while IFS= read -r line; do
            if [[ $line == DEFAULT:* ]]; then
                defaultAppBranch=${line/"DEFAULT:"/""}
                cprintMsg "    - $defaultAppVersion (default)"
            else
                cprintMsg "    - $line"
            fi
        done < mx/app-versions/ios-versions.txt

        cprintMsg ""
        read -p "    Enter selected App Version : " appVersion
        appVersion=${appVersion:-${defaultAppVersion}}
        cprintMsg ""
    else
        appVersion=$DOWNLOAD_IOS_APP_VERSION
        cprintSuccessMark "DOWNLOAD_IOS_APP_VERSION found\n"
    fi
    cprintMsg "${W}Selected App Version : ${G}${appVersion}\n"

    # Fetch Version's Maven Metadata File for 'latest'...

    local versionMetadataFile="${baseAppPath}/version-maven-metadata.xml"

    cprintMsg "Fetching Version's maven-metadata.xml - /${appBranch}/${appVersion}/maven-metadata.xml ..."
    curl -o $versionMetadataFile "${baseURL}/${appBranch}/${appVersion}/maven-metadata.xml" -#
    if [ $? != 0 ]; then cprintError "Fetch failed"; exit 1; fi

    # Check if file exist or not exist...

    local foundCheck=$(grep "404 - Metadata not found" $versionMetadataFile)
    if [ -z "$foundCheck" ]; then

        # Check if <latest> is not present...

        local latest=$(grep "<latest>" ${versionMetadataFile} | cut -sd'>' -f 2 | cut -sd'<' -f 1)
        if [ -z "$latest" ]; then
            cprintWarningMark "Version's maven-metadata.xml does not describe <latest>\n"

            # Request for the desired snapshot if DOWNLOAD_IOS_APP_SNAPSHOT variable does not exist...

            if [ -z "$DOWNLOAD_IOS_APP_SNAPSHOT" ]; then
                cprintMsg "Select the desired Snapshot instead...\n"
                local snapshots=$(grep "<version>" ${versionMetadataFile} | cut -sd'>' -f 2 | cut -sd'<' -f 1)
                local snapshotsArr=()
                while read snapshot; do
                    snapshotsArr+=("$snapshot")
                    cprintMsg "    - $snapshot"
                done <<< "$snapshots"
                
                cprintMsg ""
                read -p "    Enter selected Snapshot : " latest
            else
                latest=$DOWNLOAD_IOS_APP_SNAPSHOT
                cprintSuccessMark "DOWNLOAD_IOS_APP_SNAPSHOT found"
            fi
            
            # Check given latest exist in the file...

            local latestCheck=$(grep -w "$latest" $versionMetadataFile | cut -sd'>' -f 2 | cut -sd'<' -f 1)
            if [ "$latestCheck" == "" ] || [ "$latestCheck" != "$latest" ]; then
                cprintError "\nProvided snapshot '$latest' not found in Version's maven-metadata.xml"
                rm -rf ${versionMetadataFile}
                exit 1
            fi
        fi
        
        rm -rf ${versionMetadataFile}
        cprintMsg "\n${W}Selected/Latest Snapshot : ${G}${latest}\n"
    else
        cprintError "File does not exist"
        rm -rf $versionMetadataFile
        exit 1
    fi
    
    # Fetch Snapshot's Maven Metadata File to get .ipa or .zip file...

    local snapshotMetadataFile="${baseAppPath}/snapshot-maven-metadata.xml"

    cprintMsg "Fetching Snapshot's maven-metadata.xml - /${appBranch}/${appVersion}/${latest}/maven-metadata.xml ..."
    curl -o $snapshotMetadataFile "${baseURL}/${appBranch}/${appVersion}/${latest}/maven-metadata.xml" -#
    if [ $? != 0 ]; then cprintError "Fetch failed"; exit 1; fi

    # Check if file exist or not exist...

    local foundCheck=$(grep "404 - Metadata not found" $snapshotMetadataFile)
    if [ -z "$foundCheck" ]; then
        local extension=""
        if [[ $appBranch == *-sim ]]; then
            extension="zip"
        else
            extension="ipa"
        fi
        local fileName=$(grep "<extension>${extension}</extension>" $snapshotMetadataFile -A1 | grep "<value>" | cut -sd'>' -f 2 | cut -sd'<' -f 1)
        rm -rf $snapshotMetadataFile

        if [ -z "$fileName" ]; then
            cprintError "Not able to extract file name for *.${extension} file"
            exit 1
        else
            local uExtension=$(echo $extension | tr '[:lower:]' '[:upper:]')
            cprintMsg "\n${W}${uExtension} File Name : ${G}${fileName}.${extension}\n"
        fi
    else
        cprintError "File does not exist"
        rm -rf $snapshotMetadataFile
        exit 1
    fi

    # Show summary for all selections...

    cprintMsg "${W}Download Summary...\n"
    cprintMsg "    - ${W}Project's Repo : ${G}${baseURL}"
    cprintMsg "    - ${W}App Branch     : ${G}${appBranch}"
    cprintMsg "    - ${W}App Version    : ${G}${appVersion}"
    cprintMsg "    - ${W}App Snapshot   : ${G}${latest}"
    cprintMsg "    - ${W}File Name      : ${G}${appVersion}-${fileName}.${extension}\n"

    # Download file...

    cprintMsg "Downloading Build - /${appVersion}-${fileName}.${extension} ..."
    curl -f -L "${baseURL}/${appBranch}/${appVersion}/${latest}/${appVersion}-${fileName}.${extension}" -o "${baseAppPath}/glass-mx.${extension}" -#
    if [ $? != 0 ]; then
        cprintError "Download failed"
        exit 1
    else
        cprintMsg "\n${W}Download Location : ${G}${baseAppPath}/glass-mx.${extension}\n"
    fi

    # Create complement file; if ZIP was downloaded, create IPA; if IPA was downloaded, create ZIP...

    case "$extension" in
        ipa)
            cprintMsg "Creating additional .zip file in case build is planned to be uploaded into SauceLabs..."
            cp ${baseAppPath}/glass-mx.ipa ${baseAppPath}/glass-mx.zip
            cprintSuccessMark "Additional .zip file created\n"
            cprintMsg "${W}Additional .zip Location : ${G}${baseAppPath}/glass-mx.zip\n"
            ;;

        zip)
            cprintMsg "Creating additional .ipa file in case build is planned to be used locally..."
            unzip -qq -d ${baseAppPath}/ ${baseAppPath}/glass-mx.zip
            mkdir ${baseAppPath}/Payload
            cp -r ${baseAppPath}/Walmart.mx.app ${baseAppPath}/Payload
            rm -rf ${baseAppPath}/Walmart.mx.app
            zip -rqq ${baseAppPath}/temp.zip ${baseAppPath}/Payload
            mv ${baseAppPath}/temp.zip ${baseAppPath}/glass-mx.ipa
            rm -rf ${baseAppPath}/Payload/
            cprintSuccessMark "Additional .ipa file created\n"
            cprintMsg "${W}Additional .ipa Location : ${G}${baseAppPath}/glass-mx.ipa\n"
            ;;
    esac

    cprintSuccess "Download process finished"
    exit 0
}

#--------------------------------------------------------------------------------------------------------------------------

"$@"
