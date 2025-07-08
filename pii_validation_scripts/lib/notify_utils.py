from wm_requests import WMRequests
from envutils import EnvUtils


class NotifyUtils(WMRequests):
    """
    Class to create or update jira based
    """
    def __init__(self):
        self.jiraAPI = "https://jira.walmart.com/rest/api/2"
        self.jira_auth = EnvUtils.get_jira_auth()
        self.jira_userid = EnvUtils.get_jira_userid()
        self.slackChannel = "pii_data_violation_alerts"
        super().__init__(headers={'Authorization': f"Basic {EnvUtils.get_jira_creds()}", "Accept": "application/json",
                   "Accept-Encoding": "identity"}, proxies=None)

    def verify_jira(self):
        endpoint = f"{self.jiraAPI}/search"
        jira_query = {
            "jql": "project in ('CEPG') AND issuetype = Task AND labels = 'PIIData' AND status not in ('Done') AND summary ~ '{0} - {1} - PII Data Leak Identified. Immediate action needed'".format(EnvUtils.get_environment().upper(), EnvUtils.get_platform().upper())
        }
        try:
            verifiy_jira_response = self.get_wrapper(endpoint=endpoint, params=jira_query)
            return verifiy_jira_response
        except Exception as e:
            return f"Jira Verification failed: {str(e)}"

    def create_jira(self, pii_leaked_data_list):
        """
        Creates jira if not exists for that label and summary. If exits it updates the comments
        :return:
        """
        endpoint = f"{self.jiraAPI}/issue"
        try:
            create_jira_response = self.post_wrapper(endpoint=endpoint, payload=NotifyUtils.jira_create_fields(pii_leaked_data_list))
            return create_jira_response
        except Exception as e:
            return f"Jira Creation failed: {str(e)}"

    def update_jira(self, issue_key, pii_leaked_data_list):
        endpoint = f"{self.jiraAPI}/issue/{issue_key}"
        try:
            update_jira_response = self.put_wrapper(endpoint=endpoint, payload=NotifyUtils.jira_update_fields(pii_leaked_data_list))
            return update_jira_response
        except Exception as e:
            return f"Jira Update failed: {str(e)}"

    @staticmethod
    def jira_update_fields(pii_leaked_data_list):
        return {
                "update": {
                "comment": [{
                    "add": {"body": f"Received another PII Data leak info: {pii_leaked_data_list}"}
                }]
                }
            }

    @staticmethod
    def jira_create_fields(pii_leaked_data_list):
        return {"fields": {
            "summary": f"{EnvUtils.get_environment().upper()} - {EnvUtils.get_platform().upper()} - PII Data Leak Identified. Immediate action needed",
            "project": {
                "key": "CEPG"
            },
            "issuetype": {
                "name": "Task"
            },
            "reporter": {
                "name": "SVCFlakyTestAuto"
            },
            "priority": {
                "name": "P1"
            },
            "labels": [
                "PIIData"
            ],
            "timetracking": {
                "originalEstimate": "10",
                "remainingEstimate": "0"
            },
            "description": f"{pii_leaked_data_list}",
            "components": [
                {"id": "10000"}
            ]
        }
        }
