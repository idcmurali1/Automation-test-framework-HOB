"""
Contains functions that support slack API operations
"""
from envutils import EnvUtils
from wm_requests import WMRequests


class SlackManager(WMRequests):
    """
    WMRequests already inherits from MonitoringImpl, so no need to subclass here.
    """

    def __init__(self):
        super().__init__(
            headers={'Content-Type': 'application/json', 'Authorization': f"Bearer {EnvUtils.get_slack_token()}"},
            proxies={"http": "http://sysproxy.wal-mart.com:8080",
                     "https": "http://sysproxy.wal-mart.com:8080",
                     "no-proxy": EnvUtils.get_no_proxy()})
        self.verify_ssl = False
        self.debug = False
        self.url = 'https://walmart.slack.com/api/chat.postMessage'

    @staticmethod
    def message_slack(message, proxies=None):
        """A static method to provide a convenience to calling contexts who just want to send off a message."""
        sm = SlackManager()
        if proxies:
            sm.proxies = proxies
        return sm.send_slack_msg(message)

    def send_slack_msg(self, message):
        """Posts a message to slack"""
        response = self.post_wrapper(self.url, message)
        if not response:
            print("post", f"Failed to post {message} to Slack. See logs...")
        else:
            if response['ok'] is True:
                return response
            print("bad_response", f"Error in sending {message} to slack:{response}")
        return None

    def post_webhook(self, webhook, message):
        self.url = webhook
        return self.send_slack_msg(message)
