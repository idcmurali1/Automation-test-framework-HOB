#!/usr/bin/env python3

import datetime
import json
import os
import re
import sys
import yaml
from lib.wm_requests import WMRequests
from lib.pii_common import PIIDataConfig
from lib.paths import Paths
from lib.envutils import EnvUtils
from lib.files import WMFile
from lib.notify_utils import NotifyUtils
from lib.slack_block_builder import SlackBlockBuilder
from lib.slack_manager import SlackManager
from lib.wm_email import WMEmail


class PIIReportCheck(WMRequests, NotifyUtils):
    """
    This class helps to find the leaked PII data
    """
    def __init__(self):
        self.pii_leaked_data_list = []
        self.data_file_path = PIIReportCheck.set_data_file_path()
        self.updated_data_file_path = Paths.get_updated_data_file_path()
        self.test_yaml_path = PIIReportCheck.set_test_yaml_path()
        self.prod_yaml_path = Paths.get_prod_yaml_path()
        self.pii_data_search_report_path = Paths.get_pii_data_search_report_path()
        self.api_token = EnvUtils.get_qm_api_token()
        self.qm_output_report_path = Paths.get_qm_output_report_path()
        self.validate_environment()
        #self.check_data_file()
        #self.check_test_data_file()
        self.pre_body_md = ""

    def validate_environment(self):
        # Bail completely if the required env vars aren't set.
        assert self.check_valid_env_var("QM_API_TOKEN"), "QM_API_TOKEN env var must be defined."
        assert self.check_valid_env_var("QUANTUM_METRIC_URL"), "QUANTUM_METRIC_URL env var must be defined."
        assert self.check_valid_env_var("SLACK_TOKEN"), "SLACK_TOKEN env var must be defined."
        assert self.check_valid_env_var("JIRA_AUTH"), "JIRA_AUTH env var must be defined."
        assert self.check_valid_env_var("JIRA_USER"), "JIRA_USER env var must be defined."
        assert self.check_valid_env_var("APP_PLATFORM"), "APP_PLATFORM env var must be defined."
        assert self.check_valid_env_var("PII_SLACK_CHANNEL"), "PII_SLACK_CHANNEL env var must be defined."
        assert self.check_valid_env_var("GLASS_ENV"), "GLASS_ENV env var must be defined."

    @staticmethod
    def check_valid_env_var(var_name):
        if var_name not in os.environ:
            print(f"add {var_name} to environment.")
            return False
        return True

    @staticmethod
    def set_data_file_path():
        data_file_path = Paths.generate_quantum_report_js()
        if os.path.exists(Paths.generate_quantum_report_js()) and os.path.getsize(
                Paths.generate_quantum_report_js()) != 0:
            return data_file_path
        else:
            print(f"Skipping QM Report Retrieving Step! {data_file_path} doesn't exist or empty !",
                  file=sys.stderr)
            sys.exit(1)

    @staticmethod
    def set_test_yaml_path():
        if EnvUtils.get_environment() == "production":
            test_yaml_path = Paths.get_prod_yaml_path()
            if os.path.exists(test_yaml_path) and os.path.getsize(test_yaml_path) != 0:
                return test_yaml_path
            else:
                print(f"Skipping QM Report Retrieving. {test_yaml_path} doesn't exist or empty !", file=sys.stderr)
                sys.exit(1)

        if EnvUtils.get_environment() == "teflon":
            test_yaml_path = Paths.get_teflon_yaml_path()
            if os.path.exists(test_yaml_path) and os.path.getsize(test_yaml_path) != 0:
                return test_yaml_path
            else:
                print(f"Skipping QM Report Retrieving. {test_yaml_path} doesn't exist or empty !", file=sys.stderr)
                sys.exit(1)

    def check_data_file(self):
        """
        This method validates the data.js or generateQuantumReport.js, if present
        :return:
        """
        if not os.path.exists(self.data_file_path) or os.path.getsize(self.data_file_path) == 0:
            print(f"Skipping QM Report Retrieving Step! {self.data_file_path} doesn't exist or empty !", file=sys.stderr)
            sys.exit(1)

    def check_test_data_file(self):
        """
        This method validates the data.js is present
        :return:
        """
        if not os.path.exists(self.test_yaml_path) or os.path.getsize(f"{self.test_yaml_path}") == 0:
            print(f"Skipping QM Report Retrieving. {self.test_yaml_path} doesn't exist or empty !", file=sys.stderr)
            sys.exit(1)

    def start(self):
        """
        This method is the initial method called in this class
        :return:
        """
        qm_session_id = self.parse_qm_session_id()
        if not qm_session_id:
            print(f"QM Session Cooke id not found in {self.data_file_path}")
            sys.exit(1)

        qm_report_data = self.generate_qm_report(qm_session_id.strip())

        if not qm_report_data:
            print(f" QM Report retrieved is Empty for Session Cooke - {qm_session_id}!! ")
            sys.exit(1)

        with open(f"{self.qm_output_report_path}", 'w', encoding="utf-8") as fd:
            json.dump(qm_report_data, fd, indent=4)

        parsed_data = self.parse_test_yaml()

        if not parsed_data:
            print(f" Parsed content of {self.test_yaml_path} is empty!! ")
            sys.exit(1)

        PII_Data_Config = PIIReportCheck.group_pii_data(parsed_data)

        if not PII_Data_Config:
            print(f" Not able to group the PII data in {self.test_yaml_path} ")
            sys.exit(1)

        self.pii_leaked_data_list = self.identify_pii_leak(PII_Data_Config)
        print(f" PII leaked data list : {self.pii_leaked_data_list}")

        if self.pii_leaked_data_list:
            WMFile.write_content_to_file(self.pii_leaked_data_list, self.pii_data_search_report_path)
            self.call_notify()
        else:
            print(" No PII data leaked ")

    def _populate_html_template(self):
        return f"""<html>
    <head>
        PII Data Leak Reporting - {datetime.datetime.now()}
    </head>
    <body>
        <p>
            Below pii data Leaked
            {self.pii_leaked_data_list}
        </p>
    </body>
</html>"""

    def _populate_text_template(self):
        return f"""QM Violation Alerts - pii data Leak Reporting - {datetime.date.today()}:
        {self.pii_leaked_data_list}"""

    def call_notify(self):
        self.notify_email()
        self.notify_jira_and_slack()

    def notify_jira_and_slack(self):
        try:
            jira_obj = NotifyUtils()
            result = jira_obj.verify_jira()

            if result['issues'] and 'CEPG-' in result['issues'][0].get('key'):
                jira_found = result['issues'][0].get('key')
                print(f" Updating existing Jira - {jira_found} - {EnvUtils.get_platform().upper()} for {EnvUtils.get_environment().upper()} Env")
                try:
                    _ = jira_obj.update_jira(jira_found, self.pii_leaked_data_list)

                    try:
                        self.notify_slack(f"{jira_found} Updated")
                    except Exception as e:
                        return f"Slack Update failed: {str(e)}"
                except Exception as e:
                    try:
                        self.notify_slack(f"Jira updation failed - {EnvUtils.get_platform().upper()}")
                    except Exception as e:
                        return f"Slack Update failed: {str(e)}"
                    return f"Jira Update failed: {str(e)}"
            else:
                print(" Creating Jira ")
                try:
                    result = jira_obj.create_jira(self.pii_leaked_data_list)
                    print(f"{result}")
                    try:
                        self.notify_slack(f"Jira created - {result.get('key')} - {EnvUtils.get_platform()} for {EnvUtils.get_environment().upper()} Env")
                    except Exception as e:
                        return f"Slack Update failed: {str(e)}"
                except Exception as e:
                    return f"Jira Create failed: {str(e)}"
        except Exception as e:
            try:
                self.notify_slack(f"Jira creation failed {result} - {EnvUtils.get_platform().upper()}")
            except Exception as e:
                return f"Slack Update failed: {str(e)}"
            return f"Jira Notification failed: {str(e)}"

    def notify_email(self):
        try:
            wme = WMEmail(email_recipient="piidataviolations@wal-mart.com", group_name="PiiDataViolations",
                          content_callback=self._populate_text_template, html_callback=self._populate_html_template)
            wme.send()
            print("Email sent successfully")
        except Exception as e:
            print(f"Email sending failed: {str(e)}")

    def notify_slack(self, pre_body_md=None):
        self.pre_body_md = pre_body_md
        title = f":alarm: {EnvUtils.get_environment().upper()} - PII Data Leak Notification - {EnvUtils.get_platform().upper()} :alarm:"
        payload = self.assemble(title)

        try:
            SlackManager().send_slack_msg(payload)
            print(f"Slack notification sent!")
        except Exception as e:
            print(f"Slack notification failed: {str(e)}")

    def assemble(self, title):
        return {'channel': EnvUtils.get_pii_slack_channel(), 'blocks': json.dumps(self.assemble_text(title)),
                'link_names': 1}

    def assemble_text(self, title):
        section_builder = SlackBlockBuilder()
        title = SlackBlockBuilder.assemble_section_block(title)
        if self.pre_body_md:
            body_md = f" :x: Please take acton on this PII data leak found in QM Report.\n \n{self.pii_leaked_data_list}\n" + f"\n{self.pre_body_md}"
        body = SlackBlockBuilder.assemble_section_block(body_md)
        section_builder.add_sections([title, body])
        return section_builder.sections

    def identify_pii_leak(self, pii_data_config):
        """
        This method helps to identify the pii test data if found in QM report
        :param pii_data_config:
        :return: pii_leaked_data list
        """
        pii_leaked_data = []

        fdr = WMFile.read_content_from_file(self.qm_output_report_path)

        for attribute in pii_data_config.__annotations__:
            print(f"{attribute}: {getattr(pii_data_config, attribute)}")

        patterns = {
            'emails': [r"\b" + re.escape(str(email).replace(r'\${timestamp}', r'\d+')) + r"\b" for email in
                       pii_data_config.emails],
            'firstNames': [fr"\b{re.escape(str(firstName))}\b" for firstName in pii_data_config.firstNames],
            'lastNames': [fr"\b{re.escape(str(lastName))}\b" for lastName in pii_data_config.lastNames],
            'addresses': [fr"\b{re.escape(str(address))}\b" for address in pii_data_config.addresses],
            'phoneNumbers': [fr"\b{re.escape(str(phone_number))}\b" for phone_number in pii_data_config.phoneNumbers],
            'credit_cards': [fr"\b{re.escape(str(credit_card))}\b" for credit_card in pii_data_config.credit_cards]
        }

        for data_type, patterns_list in patterns.items():
            print(f"Searching pii data - {data_type}")
            for pattern in patterns_list:
                match = re.search(pattern, fdr)
                if match:
                    pii_leaked_data.append(f"Leaked pii {data_type} => {match.group()}")

        return pii_leaked_data

    @staticmethod
    def group_pii_data(parsed_test_data):
        if not parsed_test_data:
            print(f" {parsed_test_data} is empty!! ")
            sys.exit(1)

        all_test_data = parsed_test_data['all']

        phone_numbers_search_pattern = ['phoneNumber.noDeliveryAvailable', 'phoneNumber.onlyDeliveryAvailable', 'phoneNumber.onlyDeliveryAvailable', 'phoneNumber.deliveryNotYetAvailable', 'phoneNumberOTP']

        emails = set([item['string'] for item in all_test_data if 'email' in item['name'] and 'email.password' not in item['name']])
        credit_cards = set([item['string'] for item in all_test_data if 'creditCard.postTxn' in item['name'] or item['name'].endswith('creditCard')])
        firstNames = set([item['string'] for item in all_test_data if item['name'].endswith('firstName')])
        lastNames = set([item['string'] for item in all_test_data if item['name'].endswith('lastName')])
        addresses = set([item['string'] for item in all_test_data if item['name'].endswith(('addressForPickup', 'streetAddress'))])
        phoneNumbers = set([item['string'] for item in all_test_data if any(item['name'].endswith(pattern) for pattern in phone_numbers_search_pattern) or item['name'].endswith('phoneNumber')])

        pii_data_config = PIIDataConfig(emails=emails,
                                credit_cards=credit_cards,
                                firstNames=firstNames,
                                lastNames=lastNames,
                                addresses=addresses,
                                phoneNumbers=phoneNumbers)

        return pii_data_config

    def parse_test_yaml(self):
        """
        This method is used to parse the test data yaml
        :return:
        """

        yaml_data = WMFile.read_content_from_file(self.test_yaml_path)

        if not yaml_data:
            print(f" Unable to parse {self.test_yaml_path}!! ")
            sys.exit(1)

        yaml_data = yaml_data.replace('\t', '')
        parsed_data = yaml.safe_load(yaml_data)
        return parsed_data

    def generate_qm_report(self, qm_session_id):
        """
        This method generates the QM Report
        :param qm_session_id
        :return: qm_report
        """
        headers = {'integration-token': f"{self.api_token}", 'Accept': 'application/json'}
        proxies = {"http": "http://sysproxy.wal-mart.com:8080",
                   "https": "http://sysproxy.wal-mart.com:8080",
                   "no-proxy": EnvUtils.get_no_proxy()}
        endpoint = f"{EnvUtils.get_quantum_url()}/data/replay/find?cookie={qm_session_id}"
        print(f"endpoint : {endpoint}")
        resp_obj = WMRequests(headers=headers)
        return resp_obj.get_wrapper(endpoint=endpoint)

    def parse_qm_session_id(self):
        """
        This method parse the QM Session id from the data.js file
        :return: qm_session_cookie
        """
        data_file_content = WMFile.read_json_content_from_file(self.data_file_path)
        match = re.search(r'qmsessioncookie=([^&]+)', data_file_content['quantumSessionURL'])
        if match:
            qmsessioncookie = match.group(1)
            print(f"qmsessioncookie : {qmsessioncookie}")
            return qmsessioncookie
        else:
            print(f" quantumMetricSessionCookie is not parsed from {self.data_file_path}!! ")
            sys.exit(1)


if __name__ == "__main__":
    qm_rpt_check = PIIReportCheck()
    qm_rpt_check.start()
