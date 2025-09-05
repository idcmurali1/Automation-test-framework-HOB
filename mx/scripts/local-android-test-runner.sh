#!/bin/bash

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#
#   local-android-test-runner.sh
#
#   Creaetd By: Sergio Fernandez (vn0t1qt)
#   Created On: Mar/28/2023
#
#   Copyright © 2023 Walmart. All rights reserved.
#
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#
#   In order to avoid the script asking you for each parameter to perform the execution, you can export the following
#   variables before executing the script and it will use the values set on them instead of asking them...
#       INSTALL_APP, ANDROID_APP, APP_PACKAGE, GLASS_ENV, TEST_SUITE, OVERWRITE_TC_SELECTION, TC_IDS,
#       PARALLEL_EXECUTION, FULL_RESET, DEVICE_NAME_ANDROID, PLATFORM_NAME_ANDROID, PLATFORM_VERSION_ANDROID and
#       DEVICE_ORIENTATION_ANDROID.
#
#   Example:
#       export INSTALL_APP=true
#       export ANDROID_APP=Glass-Android-mx-v23.4-debug-RC-debug-B8.apk
#       export APP_PACKAGE=com.walmart.mg.debug
#       export GLASS_ENV=staging
#       export TEST_SUITE=qaa-od-e2e-regression
#       export OVERWRITE_TC_SELECTION=true
#       export TC_IDS=001,002
#       export PARALLEL_EXECUTION=false
#       export FULL_RESET=false
#       export DEVICE_NAME_ANDROID=320224745250
#       export PLATFORM_NAME_ANDROID=Android
#       export PLATFORM_VERSION_ANDROID=11.0
#       export DEVICE_ORIENTATION_ANDROID=portrait
#       export EXECUTION_FLAGS_FILE=./mx/scripts/execution-flags/execution_flags.txt
#
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

source ./mx/scripts/colorful-print.sh

# APP_PLATFORM --------------------------------------------------------------------------------------------------------

export APP_PLATFORM=android

# Verify if script was executed without any input parameter
if [[ $# -eq 0 ]]; then

    # INSTALL_APP ---------------------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $INSTALL_APP ]; then
        cprintMsg "Should install APP ?? [false] :" &&
        read -p "> " INSTALL_APP &&
        INSTALL_APP=${INSTALL_APP:-false}
        if [ $INSTALL_APP == true ] || [ $INSTALL_APP == t ] || [ $INSTALL_APP == T ] || [ $INSTALL_APP == True ] || [ $INSTALL_APP == TRUE ]; then
            export INSTALL_APP=true
        else
            export INSTALL_APP=false
        fi
    else
        cprintMsg "INSTALL_APP found :" && cprintMsg "> ${INSTALL_APP}"
    fi

    # R2_PROFILE ----------------------------------------------------------------------------------------------------------

    if [ $INSTALL_APP == true ]; then
        export R2_PROFILE=local-install
    else
        export R2_PROFILE=local-no-install
    fi

    # ANDROID_APP ---------------------------------------------------------------------------------------------------------

    if [ $INSTALL_APP == true ]; then
        cprintMsg ""
        if [ -z $ANDROID_APP ] ; then
            cprintMsg "Path to Android APP to be used ?? [./mx/app/android/glass-mx.apk] :" &&
            read -p "> " ANDROID_APP &&
            export ANDROID_APP=${ANDROID_APP:-'./mx/app/android/glass-mx.apk'}
        else
            cprintMsg "ANDROID_APP found :" && cprintMsg "> ${ANDROID_APP}"
        fi
    fi

    # APP_PACKAGE ---------------------------------------------------------------------------------------------------------

    if [ $INSTALL_APP == true ]; then
        cprintMsg ""
        if [ -z $APP_PACKAGE ] ; then
            cprintMsg "App Package to be used ?? [com.walmart.mg.debug] :" &&
            read -p "> " APP_PACKAGE &&
            export APP_PACKAGE=${APP_PACKAGE:-com.walmart.mg.debug}
        else
            cprintMsg "APP_PACKAGE found :" && cprintMsg "> ${APP_PACKAGE}"
        fi
    fi

    # GLASS_ENV -----------------------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $GLASS_ENV ]; then
        cprintMsg "What Glass Environment should be used ?? [staging] :" &&
        read -p "> " GLASS_ENV &&
        export GLASS_ENV=${GLASS_ENV:-staging}
    else
        cprintMsg "GLASS_ENV found :" && cprintMsg "> ${GLASS_ENV}"
    fi

    # LAUNCH_ENV ----------------------------------------------------------------------------------------------------------

    if [ $GLASS_ENV == staging ]; then
        export LAUNCH_ENV=STAGING
    elif [ $GLASS_ENV == production ]; then
        export LAUNCH_ENV=PRODUCTION
    else
        export LAUNCH_ENV=STAGING
    fi

    # MAPPING_LABELS ------------------------------------------------------------------------------------------------------

    export MAPPING_LABELS=$GLASS_ENV

    # TEST_SUITE ----------------------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $TEST_SUITE ]; then
        cprintMsg "What Test Suite should be executed ?? [qaa-od-e2e-regression] :" &&
        read -p "> " TEST_SUITE &&
        export TEST_SUITE=${TEST_SUITE:-qaa-od-e2e-regression}
    else
        cprintMsg "TEST_SUITE found :" && cprintMsg "> ${TEST_SUITE}"
    fi

    # OVERWRITE_TC_SELECTION ----------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $OVERWRITE_TC_SELECTION ]; then
        cprintMsg "Should execute all Test Cases from Test Suite ?? [true] :" &&
        read -p "> " _exec_all &&
        _exec_all=${_exec_all:-true} &&
        if [ _exec_all == true ] || [ _exec_all == t ] || [ _exec_all == T ] || [ _exec_all == True ] || [ _exec_all == TRUE ]; then
            export OVERWRITE_TC_SELECTION=false
        else
            export OVERWRITE_TC_SELECTION=true
        fi
    else
        cprintMsg "OVERWRITE_TC_SELECTION found :" && cprintMsg "> ${OVERWRITE_TC_SELECTION}"
    fi

    # TC_IDS - EXECUTION_TAGS - TEST_TAGS  --------------------------------------------------------------------------------

    if [ $OVERWRITE_TC_SELECTION == true ]; then
        cprintMsg ""
        if [ -z $TC_IDS ]; then
            cprintMsg "What Test Cases should be executed ?? [provide a list, i.e. '001, 002, 008'] :" &&
            read -p "> " TC_IDS &&
            export TC_IDS=${TC_IDS:-null}
        else
            cprintMsg "TC_IDS found :" && cprintMsg "> ${TC_IDS}"
        fi
        EXECUTION_TAGS=""
        IFS=',' read -ra TAGS <<< "${TC_IDS}"
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
        export EXECUTION_TAGS
        export TEST_TAGS=${TEST_SUITE}-${GLASS_ENV}-${APP_PLATFORM}-multiple-tc
    else
        export TC_IDS=""
        export EXECUTION_TAGS=${TEST_SUITE}-${GLASS_ENV}-${APP_PLATFORM}
        export TEST_TAGS=${TEST_SUITE}-${GLASS_ENV}-${APP_PLATFORM}
    fi

    # PARALLEL_EXECUTION --------------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $PARALLEL_EXECUTION ]; then
        cprintMsg "Should the Test Cases execute in parallel ?? [false] :" &&
        read -p "> " _parallel &&
        _parallel=${_parallel:-false}
        if [ _parallel == true ] || [ _parallel == t ] || [ _parallel == T ] || [ _parallel == True ] || [ _parallel == TRUE ]; then
            export PARALLEL_EXECUTION=true
        else
            export PARALLEL_EXECUTION=false
        fi
    else
        cprintMsg "PARALLEL_EXECUTION found :" && cprintMsg "> ${PARALLEL_EXECUTION}"
    fi

    # # COMBINE_SCENARIOS ---------------------------------------------------------------------------------------------------

    # cprintMsg ""
    # if [ -z $COMBINE_SCENARIOS ]; then
    #     cprintMsg "Should the execution combine scenarios ?? [true] :" &&
    #     read -p "> " _combine &&
    #     _combine=${_combine:-true}
    #     if [ _combine == true ] || [ _combine == t ] || [ _combine == T ] || [ _combine == True ] || [ _combine == TRUE ]; then
    #         export COMBINE_SCENARIOS=true
    #     else
    #         export COMBINE_SCENARIOS=false
    #     fi
    # else
    #     cprintMsg "COMBINE_SCENARIOS found :" && cprintMsg "> ${COMBINE_SCENARIOS}" && sleep 1
    # fi

    # FULL_RESET ----------------------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $FULL_RESET ]; then
        cprintMsg "Should the execution perform full reset before session start ?? [false] :" &&
        read -p "> " _reset &&
        _reset=${_reset:-false}
        if [ _reset == true ] || [ _reset == t ] || [ _reset == T ] || [ _reset == True ] || [ _reset == TRUE ]; then
            export FULL_RESET=true
        else
            export FULL_RESET=false
        fi
    else
        cprintMsg "FULL_RESET found :" && cprintMsg "> ${FULL_RESET}"
    fi

    # DEVICE_NAME_ANDROID -------------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $DEVICE_NAME_ANDROID ]; then
        cprintMsg "Android Device Name to use ?? (recommended - Device ID from ADB) :" &&
        read -p "> " DEVICE_NAME_ANDROID &&
        export DEVICE_NAME_ANDROID=${DEVICE_NAME_ANDROID:-null}
    else
        cprintMsg "DEVICE_NAME_ANDROID found :" && cprintMsg "> ${DEVICE_NAME_ANDROID}"
    fi

    # PLATFORM_NAME_ANDROID -----------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $PLATFORM_NAME_ANDROID ]; then
        cprintMsg "Android Platform Name to use ?? [Android] :" &&
        read -p "> " PLATFORM_NAME_ANDROID &&
        export PLATFORM_NAME_ANDROID=${PLATFORM_NAME_ANDROID:-Android}
    else
        cprintMsg "PLATFORM_NAME_ANDROID found :" && cprintMsg "> ${PLATFORM_NAME_ANDROID}"
    fi

    # PLATFORM_VERSION_ANDROID --------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $PLATFORM_VERSION_ANDROID ]; then
        cprintMsg "Android Platform Version to use ?? [11.0] :" &&
        read -p "> " PLATFORM_VERSION_ANDROID &&
        export PLATFORM_VERSION_ANDROID=${PLATFORM_VERSION_ANDROID:-11.0}
    else
        cprintMsg "PLATFORM_VERSION_ANDROID found :" && cprintMsg "> ${PLATFORM_VERSION_ANDROID}"
    fi

    # DEVICE_ORIENTATION_ANDROID ------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $DEVICE_ORIENTATION_ANDROID ]; then
        cprintMsg "Android Device Orientation to use ?? [portrait] :" &&
        read -p "> " DEVICE_ORIENTATION_ANDROID &&
        export DEVICE_ORIENTATION_ANDROID=${DEVICE_ORIENTATION_ANDROID:-portrait}
    else
        cprintMsg "DEVICE_ORIENTATION_ANDROID found :" && cprintMsg "> ${DEVICE_ORIENTATION_ANDROID}"
    fi

    # TEST_SESSION_ID -----------------------------------------------------------------------------------------------------

    export TEST_SESSION_ID=$(date +%Y%m%d%H%M%S)

    # BUILD_ID ------------------------------------------------------------------------------------------------------------

    export BUILD_ID="r2-glass-mx-${APP_PLATFORM}-${TEST_TAGS}-${TEST_SESSION_ID}"

    # EXECUTION PARAMETERS ------------------------------------------------------------------------------------------------

    cprintMsg ""
    cprintMsg "EXECUTION PARAMETERS:"
    cprintMsg ""
    cprintMsg "${G}[√] ${RESET}INSTALL_APP                = ${INSTALL_APP}"
    cprintMsg "${G}[√] ${RESET}R2_PROFILE                 = ${R2_PROFILE}"
    cprintMsg "${G}[√] ${RESET}ANDROID_APP                = ${ANDROID_APP}"
    cprintMsg "${G}[√] ${RESET}APP_PACKAGE                = ${APP_PACKAGE}"
    cprintMsg "${G}[√] ${RESET}APP_PLATFORM               = ${APP_PLATFORM}"
    cprintMsg "${G}[√] ${RESET}GLASS_ENV                  = ${GLASS_ENV}"
    cprintMsg "${G}[√] ${RESET}LAUNCH_ENV                 = ${LAUNCH_ENV}"
    cprintMsg "${G}[√] ${RESET}MAPPING_LABELS             = ${MAPPING_LABELS}"
    cprintMsg "${G}[√] ${RESET}TEST_SUITE                 = ${TEST_SUITE}"
    cprintMsg "${G}[√] ${RESET}OVERWRITE_TC_SELECTION     = ${OVERWRITE_TC_SELECTION}"
    cprintMsg "${G}[√] ${RESET}TC_IDS                     = ${TC_IDS}"
    cprintMsg "${G}[√] ${RESET}EXECUTION_TAGS             = ${EXECUTION_TAGS}"
    cprintMsg "${G}[√] ${RESET}TEST_TAGS                  = ${TEST_TAGS}"
    cprintMsg "${G}[√] ${RESET}PARALLEL_EXECUTION         = ${PARALLEL_EXECUTION}"
    # cprintMsg "${G}[√] ${RESET}COMBINE_SCENARIOS          = ${COMBINE_SCENARIOS}"
    cprintMsg "${G}[√] ${RESET}FULL_RESET                 = ${FULL_RESET}"
    cprintMsg "${G}[√] ${RESET}DEVICE_NAME_ANDROID        = ${DEVICE_NAME_ANDROID}"
    cprintMsg "${G}[√] ${RESET}PLATFORM_NAME_ANDROID      = ${PLATFORM_NAME_ANDROID}"
    cprintMsg "${G}[√] ${RESET}PLATFORM_VERSION_ANDROID   = ${PLATFORM_VERSION_ANDROID}"
    cprintMsg "${G}[√] ${RESET}DEVICE_ORIENTATION_ANDROID = ${DEVICE_ORIENTATION_ANDROID}"
    cprintMsg "${G}[√] ${RESET}TEST_SESSION_ID            = ${TEST_SESSION_ID}"
    cprintMsg "${G}[√] ${RESET}BUILD_ID                   = ${BUILD_ID}"
    cprintMsg "${G}[√] ${RESET}EXECUTION_FLAGS_FILE       = ${EXECUTION_FLAGS_FILE}"
    cprintMsg "" $$ sleep 3

    # LOAD EXECUTION FLAGS ------------------------------------------------------------------------------------------------

    . ./mx/scripts/load-execution-flags.sh
    cprintMsg "" $$ sleep 1

    # R2 EXECUTION --------------------------------------------------------------------------------------------------------

    cprintMsg "EXECUTION COMMAND:"
    cprintMsg "> java -jar r2-binary/r2.jar -a mx -d test/dependencies/$APP_PLATFORM/$GLASS_ENV-aut-dev.yaml -t \"${EXECUTION_TAGS}\" -p ${R2_PROFILE}\n"
    sleep 1

    cprintMsg "Starting R2 Execution..."
    cprintMsg "--------------------------------------------------"

    java -jar r2-binary/r2.jar -a mx -d test/dependencies/$APP_PLATFORM/$GLASS_ENV-aut-dev.yaml -t "${EXECUTION_TAGS}" -p ${R2_PROFILE}

    cprintMsg "--------------------------------------------------"
    cprintMsg "R2 Execution Finished"
    cprintMsg ""

    cprintSuccess "Test Runner Finished"
else
    # INPUT FLAGS FOR SCRIPT ----------------------------------------------------------------------------------------------
    while [[ "$#" -gt 0 ]]; do
        case $1 in
            --install)
                export INSTALL_APP=true
                export R2_PROFILE=local-mx-prod
                export fullReset=true
                if [ -z $DOWNLOAD_LATEST_BUILD ]; then
                    cprintMsg "Do you want to download latest build ?? [y | n] :" &&
                    read -p "> " DOWNLOAD_LATEST_BUILD &&
                    export DOWNLOAD_LATEST_BUILD=${DOWNLOAD_LATEST_BUILD:-n}
                else
                    cprintMsg "DOWNLOAD_LATEST_BUILD found :" && cprintMsg "> ${DOWNLOAD_LATEST_BUILD}"
                fi
                ;;
            --noinstall)
                export INSTALL_APP=false
                export R2_PROFILE=local-mx-no-install
                export DOWNLOAD_LATEST_BUILD=n
                ;;
            --walmart)
                export APP_NAME=walmart
                export APP_PACKAGE=com.walmart.mg.debug
                export PREFIX_MAPPING_LABELS=mx_ea_android
                ;;
            --bodega)
                export APP_NAME=bodega
                export APP_PACKAGE=com.mx.walmart.bodega.debug
                export PREFIX_MAPPING_LABELS=bo_ea_android
                ;;
            --production)
                export GLASS_ENV=production
                export LAUNCH_ENV=PRODUCTION
                ;;
            --customEnv)
                echo ">>>> Set manually [ GLASS_ENV ] : <<<<"
                
                cprintMsg ""
                cprintMsg "What Glass Environment should be used ?? [production | staging | teflon] :" &&
                read -p "> " GLASS_ENV &&
                export GLASS_ENV=${GLASS_ENV}
                cprintMsg "GLASS_ENV :" && cprintMsg "> ${GLASS_ENV}"
                ;;
            --customMappingLabels)
                echo ">>>> Set manually [ MAPPING_LABELS ] : <<<<"
                
                cprintMsg ""
                cprintMsg "Mapping labels to be used ?? [mx_ea_android_production | bo_ea_android_production | bo_ea_android_teflon ... ] :" &&
                read -p "> " MAPPING_LABELS &&
                export MAPPING_LABELS=${MAPPING_LABELS}
                cprintMsg "MAPPING_LABELS :" && cprintMsg "> ${MAPPING_LABELS}"
                cprintMsg ""
                ;;
            --customAppVariables)
                echo ">>>> Set manually [ APP_NAME & APP_PACKAGE & WALMART_APP_FILENAME_ANDROID ] : <<<<"
                
                cprintMsg ""
                cprintMsg "App Name to be used ?? [walmart | bodega | ...] :" &&
                read -p "> " APP_NAME &&
                export APP_NAME=${APP_NAME}
                cprintMsg "APP_NAME :" && cprintMsg "> ${APP_NAME}"

                cprintMsg ""
                cprintMsg "App Package to be used ?? [com.walmart.mg.debug | com.mx.walmart.bodega.debug | ...] :" &&
                read -p "> " APP_PACKAGE &&
                export APP_PACKAGE=${APP_PACKAGE}
                cprintMsg "APP_PACKAGE :" && cprintMsg "> ${APP_PACKAGE}"
                
                cprintMsg ""
                cprintMsg "Path to Android APP to be used ?? [./wcp/app/glass-mx.apk | ./wcp/app/glass-mx-bodega.apk | ...] :" &&
                read -p "> " WALMART_APP_FILENAME_ANDROID &&
                export WALMART_APP_FILENAME_ANDROID=${WALMART_APP_FILENAME_ANDROID}
                cprintMsg "WALMART_APP_FILENAME_ANDROID :" && cprintMsg "> ${WALMART_APP_FILENAME_ANDROID}"
                ;;
            --clearTestTags)
                unset TEST_SUITE
                unset TC_IDS
                ;;
            --clearDeviceSetting)
                unset DEVICE_NAME_ANDROID
                unset PLATFORM_NAME_ANDROID
                unset PLATFORM_VERSION_ANDROID
                unset DEVICE_ORIENTATION_ANDROID
                ;;
            --loadExecutionFlags)
                . ./mx/scripts/load-execution-flags.sh
                cprintMsg "" $$ sleep 1
                ;;
        esac
        shift
    done

    # GLASS_ENV -----------------------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $GLASS_ENV ]; then
        cprintMsg "GLASS_ENV not defined. Set default value [production]:" &&
        export GLASS_ENV=production
    fi

    # LAUNCH_ENV ----------------------------------------------------------------------------------------------------------
    if [ -z $LAUNCH_ENV ]; then
        cprintMsg "LAUNCH_ENV not defined. Set default value [PRODUCTION]:" &&
        export export LAUNCH_ENV=PRODUCTION
    fi

    # MAPPING_LABELS ------------------------------------------------------------------------------------------------------

    if [ $APP_NAME == walmart ]; then 
        export WALMART_APP_FILENAME_ANDROID='wcp/app/glass-mx.apk'
    elif [ $APP_NAME == bodega ]; then
        export WALMART_APP_FILENAME_ANDROID='wcp/app/glass-mx-bodega.apk'
    fi

    # MAPPING_LABELS ------------------------------------------------------------------------------------------------------

    if [ $PREFIX_MAPPING_LABELS ] && [ $GLASS_ENV ]; then 
        export MAPPING_LABELS=${PREFIX_MAPPING_LABELS}_${GLASS_ENV}
    fi

    # TEST_SUITE ----------------------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $TEST_SUITE ]; then
        cprintMsg "What Test Suite should be executed ?? [qaa-od-e2e-regression] :" &&
        read -p "> " TEST_SUITE &&
        export TEST_SUITE=${TEST_SUITE:-qaa-od-e2e-regression}
    else
        cprintMsg "TEST_SUITE found :" && cprintMsg "> ${TEST_SUITE}"
    fi

    # OVERWRITE_TC_SELECTION ----------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $OVERWRITE_TC_SELECTION ]; then
        cprintMsg "Should execute all Test Cases from Test Suite ?? [true] :" &&
        read -p "> " _exec_all &&
        _exec_all=${_exec_all:-true} &&
        if [ _exec_all == true ] || [ _exec_all == t ] || [ _exec_all == T ] || [ _exec_all == True ] || [ _exec_all == TRUE ]; then
            export OVERWRITE_TC_SELECTION=false
        else
            export OVERWRITE_TC_SELECTION=true
        fi
    else
        cprintMsg "OVERWRITE_TC_SELECTION found :" && cprintMsg "> ${OVERWRITE_TC_SELECTION}"
    fi

    # TC_IDS - EXECUTION_TAGS - TEST_TAGS  --------------------------------------------------------------------------------

    if [ $OVERWRITE_TC_SELECTION == true ]; then
        cprintMsg ""
        if [ -z $TC_IDS ]; then
            cprintMsg "What Test Cases should be executed ?? [provide a list, i.e. '001, 002, 008'] :" &&
            read -p "> " TC_IDS &&
            export TC_IDS=${TC_IDS:-null}
        else
            cprintMsg "TC_IDS found :" && cprintMsg "> ${TC_IDS}"
        fi
        EXECUTION_TAGS=""
        IFS=',' read -ra TAGS <<< "${TC_IDS}"
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
        export EXECUTION_TAGS
        export TEST_TAGS=${TEST_SUITE}-${GLASS_ENV}-${APP_PLATFORM}-multiple-tc
    else
        export TC_IDS=""
        export EXECUTION_TAGS=${TEST_SUITE}-${GLASS_ENV}-${APP_PLATFORM}
        export TEST_TAGS=${TEST_SUITE}-${GLASS_ENV}-${APP_PLATFORM}
    fi

    # PARALLEL_EXECUTION --------------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $PARALLEL_EXECUTION ]; then
        cprintMsg "Should the Test Cases execute in parallel ?? [false] :" &&
        read -p "> " _parallel &&
        _parallel=${_parallel:-false}
        if [ _parallel == true ] || [ _parallel == t ] || [ _parallel == T ] || [ _parallel == True ] || [ _parallel == TRUE ]; then
            export PARALLEL_EXECUTION=true
        else
            export PARALLEL_EXECUTION=false
        fi
    else
        cprintMsg "PARALLEL_EXECUTION found :" && cprintMsg "> ${PARALLEL_EXECUTION}"
    fi

    # DEVICE_NAME_ANDROID -------------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $DEVICE_NAME_ANDROID ]; then
        cprintMsg "Android Device Name to use ?? (recommended - Device ID from ADB) :" &&
        read -p "> " DEVICE_NAME_ANDROID &&
        export DEVICE_NAME_ANDROID=${DEVICE_NAME_ANDROID:-null}
    else
        cprintMsg "DEVICE_NAME_ANDROID found :" && cprintMsg "> ${DEVICE_NAME_ANDROID}"
    fi

    # PLATFORM_VERSION_ANDROID --------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $PLATFORM_VERSION_ANDROID ]; then
        cprintMsg "Android Platform Version to use ?? [11.0] :" &&
        read -p "> " PLATFORM_VERSION_ANDROID &&
        export PLATFORM_VERSION_ANDROID=${PLATFORM_VERSION_ANDROID:-11.0}
    else
        cprintMsg "PLATFORM_VERSION_ANDROID found :" && cprintMsg "> ${PLATFORM_VERSION_ANDROID}"
    fi

    # DEVICE_ORIENTATION_ANDROID --------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $DEVICE_ORIENTATION_ANDROID ]; then
        cprintMsg "Android Device Orientation to use ?? [portrait] :" &&
        read -p "> " DEVICE_ORIENTATION_ANDROID &&
        export DEVICE_ORIENTATION_ANDROID=${DEVICE_ORIENTATION_ANDROID:-portrait}
    else
        cprintMsg "DEVICE_ORIENTATION_ANDROID found :" && cprintMsg "> ${DEVICE_ORIENTATION_ANDROID}"
    fi

    # TEST_SESSION_ID -----------------------------------------------------------------------------------------------------

    export TEST_SESSION_ID=$(date +%Y%m%d%H%M%S)

    # BUILD_ID ------------------------------------------------------------------------------------------------------------

    export BUILD_ID="r2-glass-mx-${APP_PLATFORM}-${TEST_TAGS}-${TEST_SESSION_ID}"

    # EXECUTION PARAMETERS ------------------------------------------------------------------------------------------------

    cprintMsg ""
    cprintMsg "EXECUTION PARAMETERS:"
    cprintMsg ""
    cprintMsg "${G}[√] ${RESET}INSTALL_APP                    = ${INSTALL_APP}"
    cprintMsg "${G}[√] ${RESET}R2_PROFILE                     = ${R2_PROFILE}"
    cprintMsg "${G}[√] ${RESET}APP_PACKAGE                    = ${APP_PACKAGE}"
    cprintMsg "${G}[√] ${RESET}APP_PLATFORM                   = ${APP_PLATFORM}"
    cprintMsg "${G}[√] ${RESET}APP_NAME                       = ${APP_NAME}"
    cprintMsg "${G}[√] ${RESET}DOWNLOAD_LATEST_BUILD          = ${DOWNLOAD_LATEST_BUILD}"
    cprintMsg "${G}[√] ${RESET}WALMART_APP_FILENAME_ANDROID   = ${WALMART_APP_FILENAME_ANDROID}"
    cprintMsg "${G}[√] ${RESET}GLASS_ENV                      = ${GLASS_ENV}"
    cprintMsg "${G}[√] ${RESET}LAUNCH_ENV                     = ${LAUNCH_ENV}"
    cprintMsg "${G}[√] ${RESET}MAPPING_LABELS                 = ${MAPPING_LABELS}"
    cprintMsg "${G}[√] ${RESET}TEST_SUITE                     = ${TEST_SUITE}"
    cprintMsg "${G}[√] ${RESET}OVERWRITE_TC_SELECTION         = ${OVERWRITE_TC_SELECTION}"
    cprintMsg "${G}[√] ${RESET}TC_IDS                         = ${TC_IDS}"
    cprintMsg "${G}[√] ${RESET}EXECUTION_TAGS                 = ${EXECUTION_TAGS}"
    cprintMsg "${G}[√] ${RESET}TEST_TAGS                      = ${TEST_TAGS}"
    cprintMsg "${G}[√] ${RESET}PARALLEL_EXECUTION             = ${PARALLEL_EXECUTION}"
    cprintMsg "${G}[√] ${RESET}DEVICE_NAME_ANDROID            = ${DEVICE_NAME_ANDROID}"
    cprintMsg "${G}[√] ${RESET}PLATFORM_NAME_ANDROID          = ${PLATFORM_NAME_ANDROID}"
    cprintMsg "${G}[√] ${RESET}PLATFORM_VERSION_ANDROID       = ${PLATFORM_VERSION_ANDROID}"
    cprintMsg "${G}[√] ${RESET}DEVICE_ORIENTATION_ANDROID     = ${DEVICE_ORIENTATION_ANDROID}"
    cprintMsg "${G}[√] ${RESET}TEST_SESSION_ID                = ${TEST_SESSION_ID}"
    cprintMsg "${G}[√] ${RESET}BUILD_ID                       = ${BUILD_ID}"
    cprintMsg "${G}[√] ${RESET}EXECUTION_FLAGS_FILE           = ${EXECUTION_FLAGS_FILE}"
    cprintMsg "" $$ sleep 1

    # DOWNLOAD LATEST BUILD ------------------------------------------------------------------------------------------------
    if [ $DOWNLOAD_LATEST_BUILD == y ] || [ $DOWNLOAD_LATEST_BUILD == yes ]; then
        ./wcp/scripts/download_build_local.sh downloadAndroid
    fi

    # R2 EXECUTION --------------------------------------------------------------------------------------------------------

    cprintMsg "EXECUTION COMMAND:"
    cprintMsg "> java -jar r2-binary/r2.jar -a . -d mx/test/dependencies/$APP_PLATFORM/$APP_PLATFORM-default.yaml -t \"${EXECUTION_TAGS}\" -p ${R2_PROFILE}\n"
    sleep 1

    cprintMsg "Starting R2 Execution..."
    cprintMsg "--------------------------------------------------"

    java -jar r2-binary/r2.jar -a . -d mx/test/dependencies/$APP_PLATFORM/$APP_PLATFORM-default.yaml -t "${EXECUTION_TAGS}" -p ${R2_PROFILE}

    cprintMsg "--------------------------------------------------"
    cprintMsg "R2 Execution Finished"
    cprintMsg ""

    cprintSuccess "Test Runner Finished"

fi