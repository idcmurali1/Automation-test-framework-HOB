#!/bin/bash

#==========================================================================================================================
#    AUTHOR: Sergio Fernandez (vn0t1qt)
#   CREATED: Jan/04/2022
#  REVISION:
#
#  Copyright © 2021 Walmart. All rights reserved.
#==========================================================================================================================

source ./mx/scripts/colorful-print.sh

#=================================================================================================== GLOBAL VARIABLES =====

_SCRIPT_STARTED=false

_CONTINUE_EXECUTION=true

_SHOW_HELP=false

_PLATFORM=""
_PLATFORM_SET=false

_PROFILE=""
_PROFILE_SET=false

_DOWNLOAD_SET=false

_UPLOAD_BUILD=""
_UPLOAD_SET=false

_APP_NAME=""
_APP_NAME_SET=false

_R2_STRUCTURE_FOLDER=""
_R2_STRUCTURE_FOLDER_SET=false

_R2_DEPENDENCIES_FILE=""
_R2_DEPENDENCIES_FILE_SET=false

_R2_EXECUTION_TAGS=""
_R2_EXECUTION_TAGS_SET=false

#======================================================================================================== SUBROUTINES =====

#   Displays the Help Information...
#
function displayHelp() {
    cprintMsg ""
    cprintMsg "HELP:"
    cprintMsg ""
    cprintMsg "   SCRIPT:"
    cprintMsg ""
    cprintMsg "      run-mx-tests"
    cprintMsg ""
    cprintMsg "   DESCRIPTION:"
    cprintMsg ""
    cprintMsg "      Runs the given Automation Test Scenarios against Glass MX App from Mexico Market using Walmart's R2 Framework."
    cprintMsg ""
    cprintMsg "   OPTIONS:"
    cprintMsg ""
    cprintMsg "      -h   (optional)      Show help."
    cprintMsg ""
    cprintMsg "      -p   (mandatory)     Defines the Execution Platform [ android | ios ]."
    cprintMsg ""
    cprintMsg "      -P   (mandatory)     Defines the Execution Profile [ local | saucelabs ]."
    cprintMsg ""
    cprintMsg "                              If the Execution Profile is set as 'saucelabs', the user must use either one of the options -D, -U"
    cprintMsg "                              or -A."
    cprintMsg ""
    cprintMsg "      -D   (optional)      [ When the -P option is set as 'local' ]"
    cprintMsg ""
    cprintMsg "                              If provided, the latest MX Glass App Build will be downloaded and used in the Local Test Execution."
    cprintMsg ""
    cprintMsg "                              If not provided, the script will use existing build."
    cprintMsg "                              (for Android: mx/app/android/glass-mx.apk)"
    cprintMsg "                              (for iOS: mx/app/ios/glass-mx.zip)"
    cprintMsg ""
    cprintMsg "                           [ When the -P option is set as 'saucelabs' ]"
    cprintMsg ""
    cprintMsg "                              If provided, the latest MX Glass App Build will be downloaded and automatically uploaded into"
    cprintMsg "                              Saucelabs to be used in the Remote Test Execution, hence, the -U option to upload an specific build"
    cprintMsg "                              will not be needed."
    cprintMsg ""
    cprintMsg "                              If not provided, the user may use the -U option to upload an specific build into Saucelabs, or the"
    cprintMsg "                              -A option to provide the name of an existing build already/previously uploaded."
    cprintMsg ""
    cprintMsg "      -U   (optional)      [ Used only when the -P option is set as 'saucelabs' ]"
    cprintMsg ""
    cprintMsg "                              If provided, defines the path and name of the MX Glass App Build to upload into SauceLabs to run the"
    cprintMsg "                              Remote Test Execution. This option is used only when the -D option has not been provided, meaning the"
    cprintMsg "                              user wants to define the specific build to be uploaded and used."
    cprintMsg "                              (use '*.apk' files for Android, and '*.zip' files for iOS)"
    cprintMsg ""
    cprintMsg "                              If not provided, the user may use the -D option to download and automatically upload the latest build "
    cprintMsg "                              into Saucelabs or the -A option to provide the name of an existing build already/previously uploaded."
    cprintMsg ""
    cprintMsg "      -A   (conditional)   [ Used only when the -P option is set as 'saucelabs' ]"
    cprintMsg ""
    cprintMsg "                              (optional)"
    cprintMsg ""
    cprintMsg "                                 If provided, defines the name of the existing MX Glass App Build already/previously uploaded into"
    cprintMsg "                                 SauceLabs to run the Remote Test Execution. "
    cprintMsg "                                 (use Package Name for Android or Bundle ID for iOS; i.e. 'mx.walmart.android' or 'mx.walmart.glass')"
    cprintMsg ""
    cprintMsg "                                 If not provided, the user may use the -D option to download and automatically upload the latest build "
    cprintMsg "                                 into Saucelabs or the -U option to upload and use an specific build."
    cprintMsg ""
    cprintMsg "                              (mandatory)"
    cprintMsg ""
    cprintMsg "                                 This option is mandatory is none of the -D nor -U option is provided."
    cprintMsg ""
    cprintMsg "      -a   (mandatory)     Defines the folder containing all Mappings, Functions and Scenarios files for the execution."
    cprintMsg ""
    cprintMsg "      -d   (mandatory)     Defines the Dependencies file to used in the execution."
    cprintMsg ""
    cprintMsg "      -t   (mandatory)     Defines the Tests Scenarios or Test Scenario Tags to be included in the execution."
    cprintMsg ""
}

#--------------------------------------------------------------------------------------------------------------------------

#   Checks the Script Options are received correctly (mandatory options, optional options, and proper combination of
#   options)...
#
function checkScriptOptionsCorrectness() {
    if [ $_CONTINUE_EXECUTION == true ] && [ $_PLATFORM_SET == false ]; then
        cprintError "\nOption -p is mandatory"
        _CONTINUE_EXECUTION=false
    fi

    if [ $_CONTINUE_EXECUTION == true ] && [ $_PROFILE_SET == false ]; then
        cprintError "\nOption -P is mandatory"
        _CONTINUE_EXECUTION=false
    fi

    if [ $_CONTINUE_EXECUTION == true ] && [ $_R2_STRUCTURE_FOLDER_SET == false ]; then
        cprintError "\nOption -a is mandatory"
        _CONTINUE_EXECUTION=false
    fi

    if [ $_CONTINUE_EXECUTION == true ] && [ $_R2_DEPENDENCIES_FILE_SET == false ]; then
        cprintError "\nOption -d is mandatory"
        _CONTINUE_EXECUTION=false
    fi

    if [ $_CONTINUE_EXECUTION == true ] && [ $_R2_EXECUTION_TAGS_SET == false ]; then
        cprintError "\nOption -t is mandatory"
        _CONTINUE_EXECUTION=false
    fi

    if [ $_CONTINUE_EXECUTION == true ] && [ "$_PROFILE" == "saucelabs" ]; then
        if [ $_DOWNLOAD_SET == false ] && [ $_UPLOAD_SET == false ] && [ $_APP_NAME_SET == false ]; then
            cprintError "\nOption -A is mandatory when none of the -D nor -U option is provided and -P is set as 'saucelabs'"
            cprintMsg ": -P option has been set as: ${_PROFILE}"
            cprintMsg ": -D option not provided"
            cprintMsg ": -U option not provided"
            _CONTINUE_EXECUTION=false
        fi
    fi
}

#--------------------------------------------------------------------------------------------------------------------------

#   Downloads the latest MX Glass App Build...
#
function downloadLatestBuild() {
    if [ "$_PLATFORM" == "android" ]; then
        sh mx/scripts/download-build-local.sh downloadAndroid
    elif [ "$_PLATFORM" == "ios" ]; then
        sh mx/scripts/download-build-local.sh downloadIos
    fi
    if [ $? != 0 ]; then
        _CONTINUE_EXECUTION=false
    else
        _CONTINUE_EXECUTION=true
    fi
}

#--------------------------------------------------------------------------------------------------------------------------

#   Uploads the App Build into Saucelabs...
#
function uploadBuildIntoSaucelabs() {
    cprintTitle b "MX GLASS APP BUILD UPLOAD INTO SAUCELABS"

    local uploadAppPath="$_UPLOAD_BUILD"
    local pathArray=(${uploadAppPath//\// })
    local pathArraySize=${#pathArray[@]}
    local fileName=${pathArray[pathArraySize-1]}

    cprintMsg "${W}Upload Summary...\n"
    cprintMsg "${W}    - File to Upload    : ${G}${uploadAppPath}"
    cprintMsg "${W}    - SauceLabs Account : ${G}${SAUCE_USERNAME}"
    
    cprintMsg "\nUploading app into SauceLabs..."
    curl -o /tmp/saucelabs_upload.txt --progress-bar \
        -F "payload=@${uploadAppPath}" \
        -F name=$fileName \
        -u ${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY} \
        https://api.us-west-1.saucelabs.com/v1/storage/upload &&
    head /tmp/saucelabs_upload.txt
    if [ $? != 0 ]; then
        cprintError "\nUpload failed"
        _CONTINUE_EXECUTION=false
    else
        cprintMsg ""
        cprintSuccessMark "Upload Succeeded\n"
        cprintMsg "${W}SauceLabs File Location : ${G}storage:filename=${fileName}"
        _CONTINUE_EXECUTION=true
    fi
}

#--------------------------------------------------------------------------------------------------------------------------

# Executes Download and/or Upload process if required...
#
function downloadAndUploadIfRequired() {
    if [ $_PROFILE == 'local' ]; then
        if [ $_DOWNLOAD_SET == true ]; then
            downloadLatestBuild
            # Don't need else condition as android and ios dependencies files already had the default app path to use.
        fi
    elif [ $_PROFILE == 'saucelabs' ]; then
        if [ $_DOWNLOAD_SET == true ]; then
            # User wanted to download a build.
            downloadLatestBuild
            if [ $_CONTINUE_EXECUTION == true ]; then
                if [ "$_PLATFORM" == "android" ]; then
                    _UPLOAD_BUILD="mx/app/android/glass-mx.apk"
                elif  [ "$_PLATFORM" == "ios" ]; then
                    _UPLOAD_BUILD="mx/app/ios/glass-mx.zip"
                fi
                uploadBuildIntoSaucelabs
            fi
        elif [ $_UPLOAD_SET == true ]; then
            # User didn't want to download a build, but wanted to upload its own.
            uploadBuildIntoSaucelabs
        fi
    fi
}

#--------------------------------------------------------------------------------------------------------------------------

#   Executes the Test Scenarios...
#
function execution() {
    if [ "$_PROFILE" == "local" ]; then
        cprintTitle b "LOCAL TEST EXECUTION"

    elif [ "$_PROFILE" == "saucelabs" ]; then
        cprintTitle b "SAUCELABS TEST EXECUTION"
        
        if [ "$_PLATFORM" == "android" ]; then
            export APP_PACKAGE=${_APP_NAME:-com.walmart.mg.debug}
        elif [ "$_PLATFORM" == "ios" ]; then
            export BUNDLE_ID=${_APP_NAME:-mx.walmart.glass}
        fi
    fi
    
    cprintMsg "> java -jar r2-binary/r2.jar -a ${_R2_STRUCTURE_FOLDER} -d ${_R2_DEPENDENCIES_FILE} -t ${_R2_EXECUTION_TAGS} -p ${_PROFILE}\n"

    cprintMsg "Starting R2 Execution..."
    cprintMsg "--------------------------------------------------"
    
    java -jar r2-binary/r2.jar -a $_R2_STRUCTURE_FOLDER -d $_R2_DEPENDENCIES_FILE -t $_R2_EXECUTION_TAGS -p $_PROFILE

    cprintMsg "--------------------------------------------------"
    cprintMsg "R2 Execution Finished"
}

#======================================================================================================= MAIN PROCESS =====

## Parse Script Options...

while getopts hp:P:DU:A:a:d:t: flag; do
    case "$flag" in

        h)  _SHOW_HELP=true ;;

        p)  if [ "$OPTARG" == "ios" ] || [ "$OPTARG" == "android" ]; then
                _PLATFORM_SET=true
                _PLATFORM="$OPTARG"
                export APP_PLATFORM=$_PLATFORM
            else
                cprintError "\nWrong argument for -p option: '${OPTARG}'"
                cprintMsg ": Use [ android | ios ]"
                _CONTINUE_EXECUTION=false
            fi ;;

        P)  if [ "$OPTARG" == "local" ] || [ "$OPTARG" == "saucelabs" ]; then
                _PROFILE_SET=true
                _PROFILE="$OPTARG"
            else
                cprintError "\nWrong argument for -P option: '${OPTARG}'"
                cprintMsg ": Use [ local | saucelabs ]"
                _CONTINUE_EXECUTION=false
            fi ;;
        
        D)  _DOWNLOAD_SET=true ;;

        U)  _UPLOAD_SET=true
            _UPLOAD_BUILD="$OPTARG" ;;

        A)  _APP_NAME_SET=true
            _APP_NAME="$OPTARG" ;;

        a)  _R2_STRUCTURE_FOLDER_SET=true
            _R2_STRUCTURE_FOLDER="$OPTARG" ;;

        d)  _R2_DEPENDENCIES_FILE_SET=true
            _R2_DEPENDENCIES_FILE="$OPTARG" ;;

        t)  _R2_EXECUTION_TAGS_SET=true
            _R2_EXECUTION_TAGS="$OPTARG"
            export TEST_TAGS=$_R2_EXECUTION_TAGS ;;

        *)  cprintError "\nOption '${flag}' not recognized"
            _CONTINUE_EXECUTION=false ;;
    esac
done

## Check if Help Information needs to be displayed...

if [ $_SHOW_HELP == true ]; then
    displayHelp
    _CONTINUE_EXECUTION=false
fi

## Check that all the script options are correct (mandatory ones, optional ones, and proper combination of options)...

if [ $_CONTINUE_EXECUTION == true ]; then
    _SCRIPT_STARTED=true
    checkScriptOptionsCorrectness
fi

## Execute Download and/or Upload if required...

if [ $_CONTINUE_EXECUTION == true ]; then
    downloadAndUploadIfRequired
fi

## Execute the Test Scenarios locally or remotely as required...

if [ $_CONTINUE_EXECUTION == true ]; then
    execution
fi

if [ $_SCRIPT_STARTED == true ]; then
    cprintMsg "\nScript Finished"
fi
