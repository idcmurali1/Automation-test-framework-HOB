#!/bin/bash

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#
#   looper-ios-test-runner.sh
#
#   Creaetd By: Sergio Fernandez (vn0t1qt)
#   Created On: Apr/17/2023
#
#   Copyright © 2023 Walmart. All rights reserved.
#
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#
# The following variebles are used as input parameters, this script needs them to execute...
#
#   $STOP_JIRA_REPORTING        Whether or not the Execution Results should be reported in JIRA as a Test Execution.
#                               Values: [ true | false ]
#                               If the variable does not exist, the value will be taken as false.
#
#   $SAUCELABS_IOS_FILENAME     Name of the APK file that was uploaded into SauceLabs.
#                               i.e. walmart-23.5-30-20230213.230543-1.zip
#
#   $BUNDLE_ID                  SauceLabs' App Bundle ID or App Identifier (review SauceLabs after uploading the app).
#                               i.e. com.walmartmexico.WalmartMG
#
#   $GLASS_ENV                  Environment to use to execute on.
#                               Values: [ development | staging | production ]
#
#   $TEST_SUITE                 Test Suite to be executed.
#                               i.e. qaa-od-e2e-regression
#
#   $PARALLEL_EXECUTION         Flag to control whether to execute the Test Cases parallely or not.
#
#   $OVERWRITE_TC_SELECTION     Flag to control whether to execute all the Test Cases the given Test Suite includes or
#                               specific Test Cases selected from the Test Suite.
#                               Values:
#                                   false  :  executes all the Test Cases the given Test Suite includes.
#                                   true   :  allows to select which Test Cases to execute from the given Test Suite.
#
#   $TC_IDS                     List of Test Cases to be executed from the given Test Suite.
#                               This parameter is only read when OVERWRITE_TC_SELECTION is set to 'true'.
#                               Provide a list of Test Case IDs separated by comma ( , ).
#                               i.e. 001, 002, 007, 021
#
#   $SAUCE_USERNAME             SauceLabs User Name to perform the execution.
#
#   $SAUCE_ACCESS_KEY           SauceLabs Access Key from the provided user.
#
#   $EXECUTION_FLAGS_FILE       File that contains the execution flags to feed the test execution with.
#
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

source ./mx/scripts/colorful-print.sh

cprintMsg ""
cprintMsg "EXECUTION PARAMETERS:"

# APP_PLATFORM --------------------------------------------------------------------------------------------------------

export APP_PLATFORM=ios
cprintMsg "${G}[√] ${RESET}APP_PLATFORM=${APP_PLATFORM}"

# STOP_JIRA_REPORTING -------------------------------------------------------------------------------------------------

if [ -z "$STOP_JIRA_REPORTING" ]; then
    export STOP_JIRA_REPORTING=false
fi
cprintMsg "${G}[√] ${RESET}STOP_JIRA_REPORTING=${STOP_JIRA_REPORTING}"

# SAUCELABS_IOS_FILENAME ----------------------------------------------------------------------------------------------

if [ -z "${SAUCELABS_IOS_FILENAME}" ]; then
    cprintError "[X] ERROR: Variable SAUCELABS_IOS_FILENAME does not exist or is empty"
    exit 1
fi
cprintMsg "${G}[√] ${RESET}SAUCELABS_IOS_FILENAME=${SAUCELABS_IOS_FILENAME}"

# BUNDLE_ID -----------------------------------------------------------------------------------------------------------

if [ -z "${BUNDLE_ID}" ]; then
    cprintError "[X] ERROR: Variable BUNDLE_ID does not exist or is empty"
    exit 1
fi
cprintMsg "${G}[√] ${RESET}BUNDLE_ID=${BUNDLE_ID}"

# GLASS_ENV -----------------------------------------------------------------------------------------------------------

if [ -z "${GLASS_ENV}" ]; then
    cprintError "[X] ERROR: Variable GLASS_ENV does not exist or is empty"
    exit 1
fi
cprintMsg "${G}[√] ${RESET}GLASS_ENV=${GLASS_ENV}"

# TEST_SUITE ----------------------------------------------------------------------------------------------------------

if [ -z "${TEST_SUITE}" ]; then
    cprintError "[X] ERROR: Variable TEST_SUITE does not exist or is empty"
    exit 1
fi
cprintMsg "${G}[√] ${RESET}TEST_SUITE=${TEST_SUITE}"

# PARALLEL_EXECUTION --------------------------------------------------------------------------------------------------

if [ -z "$PARALLEL_EXECUTION" ]; then
    cprintError "[X] ERROR: Variable PARALLEL_EXECUTION does not exist or is empty"
    exit 1
fi
cprintMsg "${G}[√] ${RESET}PARALLEL_EXECUTION=${PARALLEL_EXECUTION}"

# OVERWRITE_TC_SELECTION ----------------------------------------------------------------------------------------------

if [ -z "$OVERWRITE_TC_SELECTION" ]; then
    cprintError "[X] ERROR: Variable OVERWRITE_TC_SELECTION does not exist or is empty"
    exit 1
fi
cprintMsg "${G}[√] ${RESET}OVERWRITE_TC_SELECTION=${OVERWRITE_TC_SELECTION}"

# TC_IDS --------------------------------------------------------------------------------------------------------------

if [ $OVERWRITE_TC_SELECTION == true ] && [ -z "${TC_IDS}" ]; then
    cprintError "[X] ERROR: Variable TC_IDS does not exist or is empty"
    exit 1
fi
cprintMsg "${G}[√] ${RESET}TC_IDS=${TC_IDS}"

# EXECUTION_TAGS & TEST_TAGS ------------------------------------------------------------------------------------------

if [ $OVERWRITE_TC_SELECTION == true ]; then
    EXECUTION_TAGS=""

    # Split $TC_IDS by ','...
    IFS=',' read -ra TAGS <<< "${TC_IDS}"
    
    # Construct $EXECUTION_TAGS appending each TC ID to the Test Suite...
    x=1
    for value in "${TAGS[@]}"; do 
        trimmed_value=$(echo "${value}" | tr -d '[:space:]')
        if [ $x == 1 ]; then
            EXECUTION_TAGS="${TEST_SUITE}-${GLASS_ENV}-${APP_PLATFORM}-${trimmed_value}"
        else
            EXECUTION_TAGS="${EXECUTION_TAGS}, ${TEST_SUITE}-${GLASS_ENV}-${APP_PLATFORM}-${trimmed_value}"
        fi
        x=$((x + 1))
    done
    export TEST_TAGS=${TEST_SUITE}-${GLASS_ENV}-${APP_PLATFORM}-multiple-tc
else
    EXECUTION_TAGS=${TEST_SUITE}-${GLASS_ENV}-${APP_PLATFORM}
    export TEST_TAGS=${TEST_SUITE}-${GLASS_ENV}-${APP_PLATFORM}
fi
cprintMsg "${G}[√] ${RESET}EXECUTION_TAGS=${EXECUTION_TAGS}"
cprintMsg "${G}[√] ${RESET}TEST_TAGS=${TEST_TAGS}"

# TEST_SESSION_ID -----------------------------------------------------------------------------------------------------

export TEST_SESSION_ID=$(date +%Y%m%d%H%M%S)
cprintMsg "${G}[√] ${RESET}TEST_SESSION_ID=${TEST_SESSION_ID}"

# EXECUTION_BUILD_ID --------------------------------------------------------------------------------------------------

export EXECUTION_BUILD_ID="r2-glass-mx-${TEST_TAGS}-${TEST_SESSION_ID}"
cprintMsg "${G}[√] ${RESET}EXECUTION_BUILD_ID=${EXECUTION_BUILD_ID}"
echo $EXECUTION_BUILD_ID > EXECUTION_BUILD_ID.VAR

# SAUCE_USERNAME ------------------------------------------------------------------------------------------------------

if [ -z "${SAUCE_USERNAME}" ]; then
    cprintError "[X] ERROR: Variable SAUCE_USERNAME does not exist or is empty"
    exit 1
fi
cprintMsg "${G}[√] ${RESET}SAUCE_USERNAME=${SAUCE_USERNAME}"

# SAUCE_ACCESS_KEY ----------------------------------------------------------------------------------------------------

if [ -z "${SAUCE_ACCESS_KEY}" ]; then
    cprintError "[X] ERROR: Variable SAUCE_ACCESS_KEY does not exist or is empty"
    exit 1
fi
cprintMsg "${G}[√] ${RESET}SAUCE_ACCESS_KEY=${SAUCE_ACCESS_KEY}"

# Verify if script was executed without any input parameter
if [[ $# -eq 0 ]]; then
    # DEVICE INFORMATION --------------------------------------------------------------------------------------------------

    cprintMsg "${G}[√] ${RESET}REMOTE_DEVICE_NAME_IOS=${REMOTE_DEVICE_NAME_IOS}"
    if [ -z "${REMOTE_DEVICE_NAME_IOS}" ]; then
        if [ -z "${DEVICE_NAME_IOS}" ]; then
            cprintMsg "${Y}    * ${RESET}R2 Dependencies file might define a fallback/default value for REMOTE_DEVICE_NAME_IOS."
        else
            cprintMsg "${Y}    * ${RESET}DEVICE_NAME_IOS=${DEVICE_NAME_IOS}. Using same value to define REMOTE_DEVICE_NAME_IOS."
            export REMOTE_DEVICE_NAME_IOS=${DEVICE_NAME_IOS}
        fi
    fi

    cprintMsg "${G}[√] ${RESET}REMOTE_PLATFORM_NAME_IOS=${REMOTE_PLATFORM_NAME_IOS}"
    if [ -z "${REMOTE_PLATFORM_NAME_IOS}" ]; then
        if [ -z "${PLATFORM_NAME_IOS}" ]; then
            cprintMsg "${Y}    * ${RESET}R2 Dependencies file might define a fallback/default value for REMOTE_PLATFORM_NAME_IOS."
        else
            cprintMsg "${Y}    * ${RESET}PLATFORM_NAME_IOS=${PLATFORM_NAME_IOS}. Using same value to define REMOTE_PLATFORM_NAME_IOS."
            export REMOTE_PLATFORM_NAME_IOS=${PLATFORM_NAME_IOS}
        fi
    fi

    cprintMsg "${G}[√] ${RESET}REMOTE_PLATFORM_VERSION_IOS=${REMOTE_PLATFORM_VERSION_IOS}"
    if [ -z "${REMOTE_PLATFORM_VERSION_IOS}" ]; then
        if [ -z "${PLATFORM_VERSION_IOS}" ]; then
            cprintMsg "${Y}    * ${RESET}R2 Dependencies file might define a fallback/default value for REMOTE_PLATFORM_VERSION_IOS."
        else
            cprintMsg "${Y}    * ${RESET}PLATFORM_VERSION_IOS=${PLATFORM_VERSION_IOS}. Using same value to define REMOTE_PLATFORM_VERSION_IOS."
            export REMOTE_PLATFORM_VERSION_IOS=${PLATFORM_VERSION_IOS}
        fi
    fi

    cprintMsg "${G}[√] ${RESET}REMOTE_DEVICE_ORIENTATION_IOS=${REMOTE_DEVICE_ORIENTATION_IOS}"
    if [ -z "${REMOTE_DEVICE_ORIENTATION_IOS}" ]; then
        cprintMsg "${Y}    * ${RESET}R2 Dependencies file might define a fallback/default value for REMOTE_DEVICE_ORIENTATION_IOS."
    fi

    # R2_PROFILE ----------------------------------------------------------------------------------------------------------

    if [ $PARALLEL_EXECUTION == true ]; then
        if [ $STOP_JIRA_REPORTING == true ]; then
            export R2_PROFILE=saucelabs-parallel
        else
            export R2_PROFILE=saucelabs-parallel-jira
        fi
    else
        if [ $STOP_JIRA_REPORTING == true ]; then
            export R2_PROFILE=saucelabs
        else
            export R2_PROFILE=saucelabs-jira
        fi
    fi
    cprintMsg "${G}[√] ${RESET}R2_PROFILE=${R2_PROFILE}"

    # LOAD EXECUTION FLAGS ------------------------------------------------------------------------------------------------

    . ./mx/scripts/load-execution-flags.sh
    cprintMsg ""

    # R2 EXECUTION --------------------------------------------------------------------------------------------------------

    cprintMsg "EXECUTION COMMAND:"
    cprintMsg "> java -jar r2-binary/r2.jar -a mx -d test/dependencies/$APP_PLATFORM/$GLASS_ENV.yaml -t \"${EXECUTION_TAGS}\" -p ${R2_PROFILE}\n"

    cprintMsg "Starting R2 Execution..."
    cprintMsg "--------------------------------------------------"

    java -jar r2-binary/r2.jar -a mx -d test/dependencies/$APP_PLATFORM/$GLASS_ENV.yaml -t "${EXECUTION_TAGS}" -p ${R2_PROFILE}

    cprintMsg "--------------------------------------------------"
    cprintMsg "R2 Execution Finished"
    cprintMsg ""
fi

# Verify parameter received, set some variables for usage of WCP code
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --wcp)
            # DEVICE INFORMATION --------------------------------------------------------------------------------------------------
            cprintMsg "${G}[√] ${RESET}DEVICE_NAME_IOS=${DEVICE_NAME_IOS}"
            if [ -z "${DEVICE_NAME_IOS}" ]; then
                cprintMsg "${Y}    * ${RESET}R2 Dependencies file might define a fallback/default value for DEVICE_NAME_IOS."
            fi

            cprintMsg "${G}[√] ${RESET}DEVICE_PLATFORM_NAME_IOS=${DEVICE_PLATFORM_NAME_IOS}"
            if [ -z "${DEVICE_PLATFORM_NAME_IOS}" ]; then
                cprintMsg "${Y}    * ${RESET}R2 Dependencies file might define a fallback/default value for DEVICE_PLATFORM_NAME_IOS."
            fi

            cprintMsg "${G}[√] ${RESET}DEVICE_PLATFORM_VERSION_IOS=${DEVICE_PLATFORM_VERSION_IOS}"
            if [ -z "${DEVICE_PLATFORM_VERSION_IOS}" ]; then
                cprintMsg "${Y}    * ${RESET}R2 Dependencies file might define a fallback/default value for DEVICE_PLATFORM_VERSION_IOS."
            fi

            cprintMsg "${G}[√] ${RESET}DEVICE_ORIENTATION_IOS=${DEVICE_ORIENTATION_IOS}"
            if [ -z "${DEVICE_ORIENTATION_IOS}" ]; then
                cprintMsg "${Y}    * ${RESET}R2 Dependencies file might define a fallback/default value for DEVICE_ORIENTATION_IOS."
            fi
            # MAPPINGS_LABELS ---------------------------------------------------------------------------------------------
            if [ -z ${PREFIX_MAPPING_LABELS} ]; then
                cprintError "[X] ERROR: Variable PREFIX_MAPPING_LABELS does not exist or is empty"
                cprintError "[X] ERROR: Variable MAPPING_LABELS can not set if PREFIX_MAPPING_LABELS does not exist or is empty"
                exit 1
            else
                export MAPPING_LABELS=${PREFIX_MAPPING_LABELS}_${GLASS_ENV}
                cprintMsg "${G}[√] ${RESET}MAPPING_LABELS=${MAPPING_LABELS}"
            fi

            # LAUNCH_ENV ---------------------------------------------------------------------------------------------------
            if [ $GLASS_ENV == staging ]; then
                export LAUNCH_ENV=STAGING
                cprintMsg "${G}[√] ${RESET}LAUNCH_ENV=${LAUNCH_ENV}"
            elif [ $GLASS_ENV == production ]; then
                export LAUNCH_ENV=PRODUCTION
                cprintMsg "${G}[√] ${RESET}LAUNCH_ENV=${LAUNCH_ENV}"
            elif [ $GLASS_ENV == teflon ]; then
                export LAUNCH_ENV=TEFLON
                cprintMsg "${G}[√] ${RESET}LAUNCH_ENV=${LAUNCH_ENV}"
            else
                cprintError "[X] ERROR: Variable GLASS_ENV does not exist or is empty"
                exit 1
            fi

            # SAUCELABS_ARM_REQUIRED ---------------------------------------------------------------------------------------------
            if [ -z ${SAUCELABS_ARM_REQUIRED} ]; then
                cprintError "[*] WARNING: Variable SAUCELABS_ARM_REQUIRED does not exist or is empty. Fallback value of R2 dependency profile will be set."
                cprintMsg "${G}[*] ${RESET}SAUCELABS_ARM_REQUIRED=false"
            fi

            # APPIUM_VERSION ---------------------------------------------------------------------------------------------
            if [ -z ${APPIUM_VERSION} ]; then
                cprintError "[*] WARNING: Variable APPIUM_VERSION does not exist or is empty. Fallback value of R2 dependency profile will be set."
                cprintMsg "${G}[*] ${RESET}APPIUM_VERSION=2.0.0"
            fi
            
            # R2_PROFILE ----------------------------------------------------------------------------------------------------
            export R2_PROFILE=saucelabs-mx-general
            cprintMsg "${G}[√] ${RESET}R2_PROFILE=${R2_PROFILE}"

            # R2 EXECUTION --------------------------------------------------------------------------------------------------
            cprintMsg ""
            cprintMsg "EXECUTION COMMAND:"
            cprintMsg "> java -jar r2-binary/r2.jar -a . -d mx/test/dependencies/$APP_PLATFORM/$APP_PLATFORM-default.yaml -t \"${EXECUTION_TAGS}\" -p ${R2_PROFILE}\n"

            cprintMsg "Starting R2 Execution..."
            cprintMsg "--------------------------------------------------"

            java -jar r2-binary/r2.jar -a . -d mx/test/dependencies/$APP_PLATFORM/$APP_PLATFORM-default.yaml -t "${EXECUTION_TAGS}" -p ${R2_PROFILE}

            cprintMsg "--------------------------------------------------"
            cprintMsg "R2 Execution Finished"
            cprintMsg ""
            ;;

    --loadExecutionFlags)
        . ./mx/scripts/load-execution-flags.sh
        cprintMsg ""
        ;;
    esac
    shift 
done


# TEST RESULTS CHECKER ------------------------------------------------------------------------------------------------

. ./mx/scripts/test-results-checker.sh
echo $FAILURES_FOUND > FAILURES_FOUND.VAR
cprintMsg ""

cprintMsg "Test Runner Finished"
cprintMsg ""

if [ -z $FAILURES_FOUND ] || [ $FAILURES_FOUND == true ]; then
    cprintError "[X] FAILED TEST EXECUTION: Test Execution has failures - Please check R2 Test Report $RESET"
    exit 1
else
    cprintMsg "${DG}[√] SUCCESSFUL TEST EXECUTION: Test Execution is clean $RESET"
    exit 0
fi