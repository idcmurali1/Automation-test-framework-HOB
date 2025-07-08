#!/bin/bash

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#
#   local-ios-test-runner.sh
#
#   Creaetd By: Octavio Cabrales (vn53g23)
#   Created On: May/03/2023
#
#   Copyright © 2023 Walmart. All rights reserved.
#
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#
#   In order to avoid the script asking you for each parameter to perform the execution, you can export the following
#   variables before executing the script and it will use the values set on them instead of asking them...
#       INSTALL_APP, IOS_APP, BUNDLE_ID, GLASS_ENV, TEST_SUITE, OVERWRITE_TC_SELECTION, TC_IDS,
#       PARALLEL_EXECUTION, FULL_RESET, DEVICE_NAME_IOS, PLATFORM_NAME_IOS, PLATFORM_VERSION_IOS and
#       DEVICE_ORIENTATION_IOS.
#
#   Example:
#       export INSTALL_APP=false
#       export IOS_APP=walmart-23.14-64-20230414.212100-1.zip
#       export BUNDLE_ID=com.walmartmexico.WalmartMG
#       export GLASS_ENV=staging
#       export TEST_SUITE=qaa-od-e2e-regression
#       export OVERWRITE_TC_SELECTION=true
#       export TC_IDS=001,002
#       export PARALLEL_EXECUTION=false
#       export FULL_RESET=false
#       export DEVICE_NAME_IOS=iPhone 13
#       export PLATFORM_NAME_IOS=iOS
#       export PLATFORM_VERSION_IOS=15.5
#       export DEVICE_ORIENTATION_IOS=portrait
#       export EXECUTION_FLAGS_FILE=./mx/scripts/execution-flags/execution_flags.txt
#
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

source ./mx/scripts/colorful-print.sh

# APP_PLATFORM --------------------------------------------------------------------------------------------------------

export APP_PLATFORM=ios

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

    # IOS_APP ---------------------------------------------------------------------------------------------------------

    if [ $INSTALL_APP == true ]; then
        cprintMsg ""
        if [ -z $IOS_APP ] ; then
            cprintMsg "Path to iOS APP to be used ?? [./mx/app/ios/glass-mx.zip] :" &&
            read -p "> " IOS_APP &&
            export IOS_APP=${IOS_APP:-'./mx/app/ios/glass-mx.zip'}
        else
            cprintMsg "IOS_APP found :" && cprintMsg "> ${IOS_APP}"
        fi
    fi

    # BUNDLE_ID ---------------------------------------------------------------------------------------------------------

    if [ $INSTALL_APP == true ]; then
        cprintMsg ""
        if [ -z $BUNDLE_ID ] ; then
            cprintMsg "App Package to be used ?? [com.walmartmexico.WalmartMG] :" &&
            read -p "> " BUNDLE_ID &&
            export BUNDLE_ID=${BUNDLE_ID:-com.walmartmexico.WalmartMG}
        else
            cprintMsg "BUNDLE_ID found :" && cprintMsg "> ${BUNDLE_ID}"
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
    #     cprintMsg "COMBINE_SCENARIOS found :" && cprintMsg "> ${COMBINE_SCENARIOS}"
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

    # DEVICE_NAME_IOS -------------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z "$DEVICE_NAME_IOS" ]; then
        cprintMsg "iOS Device Name to use ?? (recommended - Device ID from ADB) :" &&
        read -p "> " DEVICE_NAME_IOS &&
        export DEVICE_NAME_IOS="${DEVICE_NAME_IOS:-null}"
    else
        cprintMsg "DEVICE_NAME_IOS found :" && cprintMsg "> ${DEVICE_NAME_IOS}"
    fi

    # PLATFORM_NAME_IOS -----------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $PLATFORM_NAME_IOS ]; then
        cprintMsg "iOS Platform Name to use ?? [iOS] :" &&
        read -p "> " PLATFORM_NAME_IOS &&
        export PLATFORM_NAME_IOS=${PLATFORM_NAME_IOS:-iOS}
    else
        cprintMsg "PLATFORM_NAME_IOS found :" && cprintMsg "> ${PLATFORM_NAME_IOS}"
    fi

    # PLATFORM_VERSION_IOS --------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $PLATFORM_VERSION_IOS ]; then
        cprintMsg "iOS Platform Version to use ?? [15.5] :" &&
        read -p "> " PLATFORM_VERSION_IOS &&
        export PLATFORM_VERSION_IOS=${PLATFORM_VERSION_IOS:-15.5}
    else
        cprintMsg "PLATFORM_VERSION_IOS found :" && cprintMsg "> ${PLATFORM_VERSION_IOS}"
    fi

    # DEVICE_ORIENTATION_IOS ------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $DEVICE_ORIENTATION_IOS ]; then
        cprintMsg "iOS Device Orientation to use ?? [portrait] :" &&
        read -p "> " DEVICE_ORIENTATION_IOS &&
        export DEVICE_ORIENTATION_IOS=${DEVICE_ORIENTATION_IOS:-portrait}
    else
        cprintMsg "DEVICE_ORIENTATION_IOS found :" && cprintMsg "> ${DEVICE_ORIENTATION_IOS}"
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
    cprintMsg "${G}[√] ${RESET}IOS_APP                    = ${IOS_APP}"
    cprintMsg "${G}[√] ${RESET}BUNDLE_ID                  = ${BUNDLE_ID}"
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
    cprintMsg "${G}[√] ${RESET}DEVICE_NAME_IOS            = ${DEVICE_NAME_IOS}"
    cprintMsg "${G}[√] ${RESET}PLATFORM_NAME_IOS          = ${PLATFORM_NAME_IOS}"
    cprintMsg "${G}[√] ${RESET}PLATFORM_VERSION_IOS       = ${PLATFORM_VERSION_IOS}"
    cprintMsg "${G}[√] ${RESET}DEVICE_ORIENTATION_IOS     = ${DEVICE_ORIENTATION_IOS}"
    cprintMsg "${G}[√] ${RESET}TEST_SESSION_ID            = ${TEST_SESSION_ID}"
    cprintMsg "${G}[√] ${RESET}BUILD_ID                   = ${BUILD_ID}"
    cprintMsg "${G}[√] ${RESET}EXECUTION_FLAGS_FILE       = ${EXECUTION_FLAGS_FILE}"
    cprintMsg "" $$ sleep 1

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
                export BUNDLE_ID=com.walmartmexico.WalmartMG.qa
                export PREFIX_MAPPING_LABELS=mx_ea_ios
                ;;
            --bodega)
                export APP_NAME=bodega
                export BUNDLE_ID=com.walmart.bodegaGM.qa
                export PREFIX_MAPPING_LABELS=bo_ea_ios
                ;;
            --production)
                export GLASS_ENV=production
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
                cprintMsg "Mapping labels to be used ?? [mx_ea_ios_production | bo_ea_ios_production | bo_ea_ios_teflon ... ] :" &&
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
                cprintMsg "Bundle ID to be used ?? [com.walmartmexico.WalmartMG | com.walmart.bodegaGM.qa] :" &&
                read -p "> " BUNDLE_ID &&
                export BUNDLE_ID=${BUNDLE_ID}
                cprintMsg "BUNDLE_ID :" && cprintMsg "> ${BUNDLE_ID}"
                
                cprintMsg ""
                cprintMsg "Path to Android APP to be used ?? [wcp/app/glass-mx.zip | wcp/app/glass-mx-bodega.zip | ...] :" &&
                read -p "> " WALMART_APP_FILENAME_IOS &&
                export WALMART_APP_FILENAME_IOS=${WALMART_APP_FILENAME_IOS}
                cprintMsg "WALMART_APP_FILENAME_IOS :" && cprintMsg "> ${WALMART_APP_FILENAME_IOS}"
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

    # MAPPING_LABELS ------------------------------------------------------------------------------------------------------

    if [ $APP_NAME == walmart ]; then 
        export WALMART_APP_FILENAME_IOS='wcp/app/glass-mx.zip'
    elif [ $APP_NAME == bodega ]; then
        export WALMART_APP_FILENAME_IOS='wcp/app/glass-mx-bodega.zip'
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

    # DEVICE_NAME_IOS -------------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z "$DEVICE_NAME_IOS" ]; then
        cprintMsg "iOS Device Name to use ?? (recommended - Device ID from ADB) :" &&
        read -p "> " DEVICE_NAME_IOS &&
        export DEVICE_NAME_IOS="${DEVICE_NAME_IOS:-null}"
    else
        cprintMsg "DEVICE_NAME_IOS found :" && cprintMsg "> ${DEVICE_NAME_IOS}"
    fi

    # PLATFORM_NAME_IOS -----------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $PLATFORM_NAME_IOS ]; then
        export PLATFORM_NAME_IOS=iOS
    else
        cprintMsg "PLATFORM_NAME_IOS found :" && cprintMsg "> ${PLATFORM_NAME_IOS}"
    fi

    # PLATFORM_VERSION_IOS --------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $PLATFORM_VERSION_IOS ]; then
        cprintMsg "iOS Platform Version to use ?? [16.1 | 16.4] :" &&
        read -p "> " PLATFORM_VERSION_IOS &&
        export PLATFORM_VERSION_IOS=${PLATFORM_VERSION_IOS:-16.1}
    else
        cprintMsg "PLATFORM_VERSION_IOS found :" && cprintMsg "> ${PLATFORM_VERSION_IOS}"
    fi

    # DEVICE_ORIENTATION_IOS ------------------------------------------------------------------------------------------

    cprintMsg ""
    if [ -z $DEVICE_ORIENTATION_IOS ]; then
        cprintMsg "iOS Device Orientation to use ?? [portrait] :" &&
        read -p "> " DEVICE_ORIENTATION_IOS &&
        export DEVICE_ORIENTATION_IOS=${DEVICE_ORIENTATION_IOS:-portrait}
    else
        cprintMsg "DEVICE_ORIENTATION_IOS found :" && cprintMsg "> ${DEVICE_ORIENTATION_IOS}"
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
    cprintMsg "${G}[√] ${RESET}BUNDLE_ID                  = ${BUNDLE_ID}"
    cprintMsg "${G}[√] ${RESET}APP_PLATFORM               = ${APP_PLATFORM}"
    cprintMsg "${G}[√] ${RESET}APP_NAME                   = ${APP_NAME}"
    cprintMsg "${G}[√] ${RESET}DOWNLOAD_LATEST_BUILD      = ${DOWNLOAD_LATEST_BUILD}"
    cprintMsg "${G}[√] ${RESET}WALMART_APP_FILENAME_IOS   = ${WALMART_APP_FILENAME_IOS}"
    cprintMsg "${G}[√] ${RESET}GLASS_ENV                  = ${GLASS_ENV}"
    cprintMsg "${G}[√] ${RESET}MAPPING_LABELS             = ${MAPPING_LABELS}"
    cprintMsg "${G}[√] ${RESET}TEST_SUITE                 = ${TEST_SUITE}"
    cprintMsg "${G}[√] ${RESET}OVERWRITE_TC_SELECTION     = ${OVERWRITE_TC_SELECTION}"
    cprintMsg "${G}[√] ${RESET}TC_IDS                     = ${TC_IDS}"
    cprintMsg "${G}[√] ${RESET}EXECUTION_TAGS             = ${EXECUTION_TAGS}"
    cprintMsg "${G}[√] ${RESET}TEST_TAGS                  = ${TEST_TAGS}"
    cprintMsg "${G}[√] ${RESET}PARALLEL_EXECUTION         = ${PARALLEL_EXECUTION}"
    cprintMsg "${G}[√] ${RESET}DEVICE_NAME_IOS            = ${DEVICE_NAME_IOS}"
    cprintMsg "${G}[√] ${RESET}PLATFORM_NAME_IOS          = ${PLATFORM_NAME_IOS}"
    cprintMsg "${G}[√] ${RESET}PLATFORM_VERSION_IOS       = ${PLATFORM_VERSION_IOS}"
    cprintMsg "${G}[√] ${RESET}DEVICE_ORIENTATION_IOS     = ${DEVICE_ORIENTATION_IOS}"
    cprintMsg "${G}[√] ${RESET}TEST_SESSION_ID            = ${TEST_SESSION_ID}"
    cprintMsg "${G}[√] ${RESET}BUILD_ID                   = ${BUILD_ID}"
    cprintMsg "${G}[√] ${RESET}EXECUTION_FLAGS_FILE       = ${EXECUTION_FLAGS_FILE}"
    cprintMsg "" $$ sleep 1

    if [ $INSTALL_APP == false ]; then
        cprintMsg "${Y}[IOS-WARNING]: WCP Variable 'language' wont be set using '${R2_PROFILE}'"
        cprintMsg "${Y}[IOS-WARNING]: This variable 'language' is set in 'functions.utils.setMarketInfo' through 'dependencies.general.language'."
        cprintMsg "${Y}[IOS-WARNING]: Consider set the variable 'language' in your test script flow during local development process in case you needed to avoid possible errors."
    fi

    # DOWNLOAD LATEST BUILD ------------------------------------------------------------------------------------------------
    if [ $DOWNLOAD_LATEST_BUILD == y ] || [ $DOWNLOAD_LATEST_BUILD == yes ]; then
        ./wcp/scripts/download_build_local.sh downloadIos
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