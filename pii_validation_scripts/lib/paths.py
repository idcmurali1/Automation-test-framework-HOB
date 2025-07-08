from envutils import EnvUtils


class Paths:
    @staticmethod
    def get_data_file_path():
        """Gets the file path of the report/data/data.js file"""
        return f"{EnvUtils.get_workspace()}/report/data/data.js"

    @staticmethod
    def get_updated_data_file_path():
        """Gets the path of the updated_data.js file"""
        return f"{EnvUtils.get_workspace()}/updated_data.js"

    @staticmethod
    def get_teflon_yaml_path():
        """Gets the path of the teflon.yaml file"""
        return f"{EnvUtils.get_workspace()}/us/e2e-tests/data/teflon.yaml"

    @staticmethod
    def get_prod_yaml_path():
        """Gets the path of the teflon.yaml file"""
        return f"{EnvUtils.get_workspace()}/us/e2e-tests/data/production.yaml"

    @staticmethod
    def get_qm_output_report_path():
        """Gets the path of the qm_output_report file"""
        return f"{EnvUtils.get_workspace()}/qm_report.json"

    @staticmethod
    def get_pii_data_search_report_path():
        """Gets the path of the pii_data_search_report file"""
        return f"{EnvUtils.get_workspace()}/pii_data_search_report"

    @staticmethod
    def generate_quantum_report_js():
        """Gets the path of the generateQuantumReport.js"""
        return f"{EnvUtils.get_workspace()}/Quantum-results-{EnvUtils.get_environment()}-{EnvUtils.get_platform()}.json"
