#!/bin/bash

###########################################################################################################################
#
#   construct_slack_test_results_msg.sh
#
#   Created By: Sergio Fernandez (vn0t1qt)
#   Created On: Mar/21/2023
#
#   Copyright © 2023 Walmart. All rights reserved.
#
###########################################################################################################################

# ICONS...

_android_icon=":android:"
_ios_icon=":apple_mac:"

_walmart_icon=":wal-mart:"
_bodega_icon=":bodega-icon:"
_sams_icon=":sams_diamond:"

_question_icon=":grey_question:"

_status_failed_icon=":err:"
_status_passed_icon=":greencheckbox:"

_title_icon=":infotip:"

_looper_icon=":looper-icon:"

_bullet_icon=":white_small_square:"

_no_jira_test_exec_icon=":ded:"

_success_rate_green_icon=":green-ball:"
_success_rate_warning_icon=":status-warning-1:"

# PLATFORM ICON, SAUCELABS FILENAME & APP ID...
# [ $platform_icon, $saucelabs_filename, $app_id ]

if [ $APP_PLATFORM == 'android' ]; then
    platform_icon=$_android_icon
    saucelabs_filename="${SAUCELABS_APK_FILENAME}"
    app_id="${APP_PACKAGE}"
elif [ $APP_PLATFORM == 'ios' ]; then
    platform_icon=$_ios_icon
    saucelabs_filename="${SAUCELABS_IOS_FILENAME}"
    app_id="${BUNDLE_ID}"
fi

# APPLICATION ICON...
# [ $app_icon ]

case "${app_id}" in
    "com.walmart.mg"|"com.walmart.mg.debug"|"com.walmartmexico.WalmartMG"|"com.walmartmexico.WalmartMG.qa") app_icon=$_walmart_icon ;;
    "com.walmart.bodegaGM"|"com.mx.walmart.bodega"|"com.mx.walmart.bodega.debug"|"com.walmart.bodegaGM.qa") app_icon=$_bodega_icon ;;
    *)
        case "$TEST_SUITE" in
            *-bodega-*) app_icon=$_bodega_icon ;;
            *-sams-*) app_icon=$_sams_icon ;;
            *) app_icon=$_question_icon ;;
        esac
        ;;
esac

# STATUS ICON...
# [ $status_icon ]

if [ $FAILURES_FOUND == true ]; then
    status_icon=$_status_failed_icon;
else
    status_icon=$_status_passed_icon;
fi

# EXECUTION NAME...
# [ $EXECUTION_NAME ]

if [ -z "${EXECUTION_NAME}" ]; then
    EXECUTION_NAME="-----";
fi

# TEST CASES STRING...
# [ $test_cases_string ]

if [ $OVERWRITE_TC_SELECTION == true ]; then
    test_cases_string="${TC_IDS}"
else
    test_cases_string="all"
fi

# SAUCELABS SSO LOGIN LINK...
# [ $saucelabs_sso_login_link ]

saucelabs_sso_login_link="https://pfedprod.wal-mart.com/idp/startSSO.ping?PartnerSpId=https://saucelabs.com/sso/acs"

# SAUCELABS BUILD ID...
# [ $saucelabs_build_id ]

saucelabs_build_id="${EXECUTION_BUILD_ID}"

# SAUCELABS BUILD ID LINK...
# [ $saucelabs_build_id_link ]

saucelabs_build_id_link="https://app.saucelabs.com/dashboard/tests?build=${EXECUTION_BUILD_ID}&start=alltime"

# ONLINE RESULTS URL...
# [ $online_results_url ]

online_results_url="${LOCAL_REPORT_URL}"

# R2 LOG FILENAME...
# [ $r2_log_filename ]

r2_log_filename=TestExecutionReport-${EXECUTION_BUILD_ID}.zip

# DOWNLOAD RESULTS URL...
# [ $download_results_url ]

download_results_url="${REPOSOLNS_GENERIC_REPO}/${R2_REPORT_FILE_PATH}/${r2_log_filename}"

# JIRA TEST EXECUTION PART...
# [ $jira_test_execution_part ]

if [ -z "$STOP_JIRA_REPORTING" ]; then
    export STOP_JIRA_REPORTING=false
fi
if [ $STOP_JIRA_REPORTING == true ]; then
    jira_test_execution_part=""
else
    if [ $JIRA_TEST_EXECUTION_URL == "ERROR" ]; then
        jira_test_execution_part=" / No JIRA Test Execution Link Found $_no_jira_test_exec_icon"
    else
        jira_test_execution_part=" / <${JIRA_TEST_EXECUTION_URL}|JIRA Test Execution Results>"
    fi
fi

# SUCCESS RATE PART...
# [ $success_rate_part ]

if [ $STOP_JIRA_REPORTING == true ]; then
    # Obtained from R2 Report...
    echo "[INFO] JIRA Reporting turned off. Obtaining Success Rate from R2 Report..."
    success_rate_value=$(node ./mx/scripts/get-success-rate-from-r2-report.js)
    exit_code=$?
    case $exit_code in
        0) success_rate_icon=" $_success_rate_green_icon" ;;
        1) success_rate_icon=" $_success_rate_warning_icon" ;;
        *) success_rate_icon="" ;;
    esac
else
    # Obtained from Jira...
    echo "[INFO] Obtaining Success Rate from JIRA Test Execution..."
    test_exec_id=${JIRA_TEST_EXECUTION_URL##*/}
    echo "[INFO] Test Execution: $test_exec_id"
    sh ./mx/scripts/get-jira-certificates.sh
    exit_code=$?
    case $exit_code in
        0)
            echo "> curl -X GET -H \"Accept: application/json\" -u \"$JIRA_USERNAME:**********\" --cacert walmart_jira_certs.pem \"https://jira.walmart.com/rest/raven/latest/api/testexec/${test_exec_id}/test\""
            response=$(curl -X GET \
                -H "Accept: application/json" \
                -u "$JIRA_USERNAME:$JIRA_PASSWORD" \
                --cacert walmart_jira_certs.pem \
                "https://jira.walmart.com/rest/raven/latest/api/testexec/${test_exec_id}/test")
            echo "[INFO] Response: $response"
            total_tests=$(echo "$response" | grep -o '"id":' | wc -l)
            total_passed_tests=$(echo "$response" | grep -o '"status":"PASS"' | wc -l)
            if [ "$total_tests" -gt 0 ]; then
                calculated_success_rate=$(echo "scale=2; ($total_passed_tests / $total_tests) * 100" | bc)
            else
                calculated_success_rate=0
            fi
            echo "[INFO] Total Tests: $total_tests, Passed Tests: $total_passed_tests, Success Rate: $calculated_success_rate"
            if (( $(echo "$calculated_success_rate >= 85" | bc -l) )); then
                success_rate_icon=" $_success_rate_green_icon"
            else
                success_rate_icon=" $_success_rate_warning_icon"
            fi
            success_rate_value="$calculated_success_rate% ($total_passed_tests/$total_tests)"
            ;;
        *)
            success_rate_value="<error>"
            success_rate_icon=""
            ;;
    esac
fi
success_rate_part="    $_bullet_icon *Success Rate* ${success_rate_value}${success_rate_icon}"

# FORMATTING...

title=">_*${_title_icon}   ${_looper_icon}   LOOPER TEST EXECUTION RESULTS   ${_looper_icon}   ${_title_icon}   |   ${_bullet_icon} Application:   ${app_icon}   |   ${_bullet_icon} Platform:   ${platform_icon}*_\n"

empty_line=">\n"

exec_info_1=">_${_bullet_icon} *Execution Name:* ${EXECUTION_NAME}    ${_bullet_icon} *Execution Owner:* <@${LOOPER_BUILD_USER_ID}>_\n"

exec_info_2=">_${_bullet_icon} *Branch:* ${GITHUB_BRANCH_NAME}    ${_bullet_icon} *Environment:* ${GLASS_ENV}_\n"

exec_info_3=">_${_bullet_icon} *Test Suite:* ${TEST_SUITE}    ${_bullet_icon} *Test Cases:* ${test_cases_string}_\n"

saucelabs_info=">_${_bullet_icon} *SauceLabs File Name:* ${saucelabs_filename}  ( ${app_id} )  ( ${SAUCE_USERNAME} )_\n"

status_info=">_${_bullet_icon} *Status:*   ${status_icon}${success_rate_part}_\n"

saucelabs_links=">_${_bullet_icon}<${saucelabs_sso_login_link}|SauceLabs SSO Login> / <${saucelabs_build_id_link}|SauceLabs Build ID: ${saucelabs_build_id}>_\n"

results_links=">_${_bullet_icon}<${online_results_url}|Online R2 Results> / <${download_results_url}|Download R2 Results>${jira_test_execution_part}_"

# DISPLAY THE USED VALUES INDIVIDUALLY...

echo "TITLE:" && echo "${title}"
echo "    | _title_icon: $_title_icon"
echo "    | _looper_icon: $_looper_icon"
echo "    | _bullet_icon: $_bullet_icon"
echo "    | app_icon: $app_icon"
echo "    | platform_icon: $platform_icon \n"

echo "EXECUTION INFORMATION (1):" && echo "${exec_info_1}"
echo "    | _bullet_icon: $_bullet_icon"
echo "    | EXECUTION_NAME: ${EXECUTION_NAME}"
echo "    | LOOPER_BUILD_USER_ID: ${LOOPER_BUILD_USER_ID} \n"

echo "EXECUTION INFORMATION (2):" && echo "${exec_info_2}"
echo "    | _bullet_icon: $_bullet_icon"
echo "    | GITHUB_BRANCH_NAME: ${GITHUB_BRANCH_NAME}"
echo "    | GLASS_ENV: ${GLASS_ENV} \n"

echo "EXECUTION INFORMATION (3):" && echo "${exec_info_3}"
echo "    | _bullet_icon: $_bullet_icon"
echo "    | TEST_SUITE: ${TEST_SUITE}"
echo "    | test_cases_string: ${test_cases_string} \n"

echo "SAUCELABS INFORMATION:" && echo "${saucelabs_info}"
echo "    | _bullet_icon: $_bullet_icon"
echo "    | saucelabs_filename: ${saucelabs_filename}"
echo "    | app_id: ${app_id}"
echo "    | SAUCE_USERNAME: ${SAUCE_USERNAME} \n"

echo "STATUS INFORMATION:" && echo "${status_info}"
echo "    | _bullet_icon: $_bullet_icon"
echo "    | status_icon: ${status_icon}"
echo "    | success_rate_value: ${success_rate_value}"
echo "    | success_rate_icon: ${success_rate_icon} \n"

echo "SAUCELABS LINKS:" && echo "${saucelabs_links}"
echo "    | _bullet_icon: $_bullet_icon"
echo "    | saucelabs_sso_login_link: ${saucelabs_sso_login_link}"
echo "    | saucelabs_build_id_link: ${saucelabs_build_id_link}"
echo "    | saucelabs_build_id: ${saucelabs_build_id} \n"

echo "RESULTS LINKS:" && echo "${results_links}"
echo "    | _bullet_icon: $_bullet_icon"
echo "    | online_results_url: ${online_results_url}"
echo "    | download_results_url: ${download_results_url}"
echo "    | _no_jira_test_exec_icon: ${_no_jira_test_exec_icon}"
echo "    | JIRA_TEST_EXECUTION_URL: ${JIRA_TEST_EXECUTION_URL} \n"

# DISPLAY AND EXPORT THE WHOLE SLACK MESSAGE...

slack_message_to_post="${title}${empty_line}${exec_info_1}${exec_info_2}${exec_info_3}${empty_line}${saucelabs_info}${empty_line}${status_info}${empty_line}${saucelabs_links}${results_links}"

echo "slackMessageToPost=${slack_message_to_post}" > slackMessage.properties
