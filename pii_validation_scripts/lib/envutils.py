import os
import base64


class EnvUtils:
    """
    Contains all the getters for environment variables set by looper.  Keeping them in a central location and
    exposing them by accessors will help with maintenance down the road.
    """

    @staticmethod
    def get_workspace():
        """Tries to find the current workspace directory, if not set a relative '.' will be returned."""
        return os.getenv("WORKSPACE", ".")

    @staticmethod
    def get_workdir():
        """Tries to find the current Working directory, if not set a relative '.' will be returned.
        This is the more "fixed" directory location of the CI build environment. 'Workspace' may mutate
        when sub flows are executed on different nodes."""
        return os.getenv("WORKDIR", ".")

    @staticmethod
    def get_qm_api_token():
        """Tries to find qm_api_token, if none can be found None is returned"""
        return os.getenv("QM_API_TOKEN")

    @staticmethod
    def get_no_proxy():
        return os.getenv('no_proxy')

    @staticmethod
    def get_slack_token():
        """Fetches the slack token from environment variables"""
        return os.getenv("SLACK_TOKEN")

    @staticmethod
    def get_pii_slack_channel():
        """Fetches the slack channel from environment variables"""
        return os.getenv("PII_SLACK_CHANNEL")

    @staticmethod
    def get_jira_userid():
        """Fetches jira api userid """
        return os.getenv("JIRA_USER")

    @staticmethod
    def get_jira_auth():
        """Fetches jira api auth """
        return os.getenv("JIRA_AUTH")

    @staticmethod
    def get_jira_creds():
        """Tries to fetch the creds for jira. None if not found"""
        jira_user = EnvUtils.get_jira_userid()
        jira_pass = EnvUtils.get_jira_auth()
        if jira_user is None or jira_pass is None:
            return None
        return base64.b64encode(f"{jira_user}:{jira_pass}".encode("ascii")).decode('ascii')

    @staticmethod
    def get_quantum_url():
        """Tries to find the build url, if none can be found None is returned."""
        return os.getenv("QUANTUM_METRIC_URL")

    @staticmethod
    def get_platform():
        """Tries to find the build url, if none can be found None is returned."""
        return os.getenv("APP_PLATFORM")

    @staticmethod
    def get_environment():
        """Tries to find the build url, if none can be found None is returned."""
        return os.getenv("GLASS_ENV")


