import json
from dataclasses import dataclass
from json import JSONDecodeError
import sys
import traceback
import requests
from requests import Request, Session
from requests.adapters import HTTPAdapter, Retry
from requests.exceptions import HTTPError, Timeout, RequestException

import xmltodict


@dataclass
class WMRequestsState:
    response_code: int = 0  # Default non-valid HTTP response code
    status_code: int = None
    debug: bool = False
    verify_ssl: bool = True
    params: str = None
    error_info: str = ""


class WMRequests:
    k_TOTAL = 'total'
    k_BACKOFF_FACTOR = 'backoff_factor'
    k_STATUS_FORCELIST = 'status_forcelist'

    def __init__(self, headers: dict, auth: tuple = None, proxies: dict = None):
        """
        Initialize the REST API calling context superclass.

        This superclass should be added to your class when wanting to make REST based API calls.
        Do not use the requests object directly.

        :param headers: A Dictionary representing the HTTP headers to send for a given request. This format is the
                        normal fashion used when constructing HTTP requests.
        :param auth: When not passing the authentication material via headers, pass a tuple of user/password.
        :param proxies: Set the custom set of Proxies to use when making the request. You must supply the proxies for:
                        http, https, no_proxy
                        This is rarely used.
        """
        self.endpoint = None
        self.payload = None
        self.headers = headers
        self.auth = auth
        self.proxies = proxies
        self.session = Session()
        self.state = WMRequestsState()

    @property
    def error_info(self):
        return self.state.error_info

    @property
    def status_code(self):
        return self.state.status_code

    @property
    def response_code(self):
        return self.state.response_code

    @response_code.setter
    def response_code(self, value):
        self.state.response_code = value

    def request_wrapper(self, method_variant):
        response = None
        self.state.error_info = None
        self.state.status_code = 0
        try:
            self.session.mount("https://", self._generate_http_adapter())
            response = method_variant()
            response.raise_for_status()
            self.state.response_code = response.status_code
            if self.state.debug:
                print(f"{self.__class__.__name__}: {response.text}", file=sys.stderr)
        except ConnectionError as conn_err:
            print(f"{self.__class__.__name__} Unhandled exception: {conn_err}", file=sys.stderr)
        except HTTPError as http_error:
            print(f"{self.__class__.__name__} Unhandled HTTP exception: {http_error}", file=sys.stderr)
        except Timeout as time_err:
            print(f"{self.__class__.__name__} Unhandled HTTP exception: {time_err}", file=sys.stderr)
        except RequestException as req_err:
            print(f"{self.__class__.__name__} Unhandled HTTP exception: {req_err}", file=sys.stderr)
        self.session.verify = True
        self.state.verify_ssl = True
        return response

    def _generate_http_adapter(self):
        opts = self.fetch_retry_info()
        opts[self.k_TOTAL] = min(opts[self.k_TOTAL], 10)
        opts[self.k_BACKOFF_FACTOR] = min(opts[self.k_BACKOFF_FACTOR], 15)
        return HTTPAdapter(max_retries=Retry(**opts))

    def fetch_retry_info(self):
        return {self.k_TOTAL: 5,
                self.k_BACKOFF_FACTOR: 0.5,
                self.k_STATUS_FORCELIST: [500, 502, 503, 504]}

    def log_connection_error(self, conn_err: ConnectionError):
        self.state.error_info = f"""{__name__} Connection error occurred: {conn_err}
        Attempting to upload {json.dumps(self.payload)}"""
        self.error("log_connection_error", self.error_info)

    def log_http_error(self, response, http_err: requests.exceptions.HTTPError):
        # 404 is a standard "not found" response from GitHub API. It shows the resource is not there, instead
        # of a system error.
        self.state.status_code = response.status_code
        if response.status_code == 422:
            errors = None
            messages = None
            try:
                errors = json.loads(response.text).get('errors', {"message": "No errors resolvable."})
            except json.decoder.JSONDecodeError:
                # Not a valid JSON structured string. We just pass along the string as is.
                messages = [response.text]
            if isinstance(errors, list):
                messages = list(map(lambda x: x.get('message', 'No message.'), errors))
            elif isinstance(errors, dict):
                messages = [errors.get("message")]
            self.state.error_info = f"Incorrect endpoint for request: {response.status_code}:{http_err} {' '.join(messages)}"

        elif response.status_code != 404:
            payload = json.dumps(self.payload).replace("{", "{{").replace("}", "}}")
            error_text = ""
            if response.text:
                error_text = response.text.replace("{", "{{").replace("}", "}}")
            self.state.error_info = f"""{__name__} HTTP error occurred: {http_err}
{error_text}
Attempting to upload {payload}"""
        else:
            self.state.error_info = f"Uncategorized http error: {http_err}"
        self.error("log_http_error", {"error": self.error_info,
                                      "code": response.status_code})

    def log_timeout_error(self, time_err: Timeout):
        self.state.error_info = f"{__name__} Timeout error occurred: {time_err} {self.endpoint}"
        self.error("log_timeout_error", self.error_info)

    def log_request_error(self, req_err: RequestException):
        self.state.error_info = f"{__name__} Request error occurred: {req_err} {self.endpoint}"
        self.error("log_request_error", self.error_info)

    def log_general_error(self, req_err: Exception):
        self.state.error_info = f"{__name__} Unhandled exception: {req_err}"
        self.error("log_general_error", self.error_info)
        _, _, exc_traceback = sys.exc_info()
        traceback.print_tb(exc_traceback)

    def post_wrapper(self, endpoint, payload, form=False):
        self.endpoint = endpoint
        self.payload = payload
        if form:
            self.state.verify_ssl = False
            response = self.request_wrapper(self.request_post_form_method)
        else:
            response = self.request_wrapper(self.request_post_method)
        # In the case of WebHook posts, there is no JSON response. Just a result code and plain text.
        if response:
            if response.text == "ok":
                return {"ok": True}
            try:
                return json.loads(response.text)
            except JSONDecodeError as jde:
                print(f"{jde}\n Failed to decode string: {response.text}", file=sys.stderr)
                return None
        return None

    def request_post_form_method(self):
        prepared_request = Request(
            'POST',
            self.endpoint,
            files=self.payload,
            headers=self.headers
        ).prepare()
        return Session().send(prepared_request, verify=self.state.verify_ssl)

    def request_post_method(self):
        return self.session.post(self.endpoint,
                                 json=self.payload,
                                 headers=self.headers,
                                 auth=self.auth,
                                 proxies=self.proxies,
                                 verify=self.state.verify_ssl)

    def put_wrapper(self, endpoint, payload):
        self.endpoint = endpoint
        self.payload = payload
        try:
            response = self.request_wrapper(self.request_put_method)
        except HTTPError as http_err:
            print(f"{__name__} HTTP error occurred: {http_err}", file=sys.stderr)
            return response if not None else None

    def request_put_method(self):
        return self.session.put(self.endpoint,
                                json=self.payload,
                                headers=self.headers,
                                auth=self.auth,
                                verify=self.state.verify_ssl)

    def get_wrapper(self, endpoint, params=None):
        self.endpoint = endpoint
        self.state.params = params
        response = self.request_wrapper(self.request_get_method)
        print(f"response : {response}")
        return json.loads(response.text) if response else None

    def request_get_method(self):
        return self.session.get(self.endpoint,
                                headers=self.headers,
                                auth=self.auth,
                                verify=self.state.verify_ssl,
                                proxies=self.proxies,
                                params=self.state.params)

    def patch_wrapper(self, endpoint, payload):
        self.endpoint = endpoint
        self.payload = payload
        response = self.request_wrapper(self.request_patch_method)
        return json.loads(response.text) if response else None

    def request_patch_method(self):
        return self.session.patch(self.endpoint,
                                  json=self.payload,
                                  headers=self.headers,
                                  verify=self.state.verify_ssl,
                                  auth=self.auth)

    @staticmethod
    def create_request(file_type):
        if file_type == 'json':
            print(f"file_type : {file_type}")
            return WMRequests(headers={})
        if file_type == 'xml':
            print(f"file_type : {file_type}")
            return WMXMLRequests(headers={})
        if file_type == 'tgz':
            print(f"file_type : {file_type}")
            return WMBINRequests(headers={})

        print(f"file_type : {file_type}")
        return WMTXTRequests(headers={})


class WMXMLRequests(WMRequests):

    def post_wrapper(self, endpoint, payload, form=False):
        self.endpoint = endpoint
        self.payload = payload
        response = self.request_wrapper(self.request_post_method)
        return xmltodict.parse(response.text) if response else None

    def put_wrapper(self, endpoint, payload):
        self.endpoint = endpoint
        self.payload = payload
        response = self.request_wrapper(self.request_put_method)
        return xmltodict.parse(response.text) if response else None

    def get_wrapper(self, endpoint, params=None):
        self.endpoint = endpoint
        response = self.request_wrapper(self.request_get_method)
        return xmltodict.parse(response.text) if response else None

    def patch_wrapper(self, endpoint, payload):
        self.endpoint = endpoint
        self.payload = payload
        response = self.request_wrapper(self.request_patch_method)
        return xmltodict.parse(response.text) if response else None

    def log_connection_error(self, conn_err: ConnectionError):
        self.state.error_info = f"""{__name__} Connection error occurred: {conn_err}
        Attempting to connect to {self.endpoint}"""
        self.error("log_connection_error", self.error_info)

    def log_http_error(self, response, http_err: requests.exceptions.HTTPError):
        if response.status_code != 404:
            self.state.error_info = f"{__name__} HTTP error occurred: {http_err} {self.endpoint}"
            self.error("log_http_error", self.error_info)


class WMTXTRequests(WMRequests):
    def get_wrapper(self, endpoint, params=None):
        self.endpoint = endpoint
        response = self.request_wrapper(self.request_get_method)
        return response.text if response else None


class WMBINRequests(WMRequests):
    def get_wrapper(self, endpoint, params=None):
        self.endpoint = endpoint
        response = self.request_wrapper(self.request_get_method)
        return response.content if response else None
