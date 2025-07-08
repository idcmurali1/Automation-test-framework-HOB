import smtplib
import sys
import datetime

from envutils import EnvUtils
from email.message import EmailMessage
from email.headerregistry import Address


class WMEmail:
    def __init__(self, email_recipient, group_name, content_callback, html_callback):
        self.message = EmailMessage()
        self.email_recipient = email_recipient
        self.group_name = group_name
        self.content_callback = content_callback
        self.html_callback = html_callback

    def _assemble(self):
        # Create the base text message.
        self.message['Subject'] = f" {EnvUtils.get_environment().upper()} - PII Data Leak Report - {EnvUtils.get_platform().upper()} - {datetime.datetime.now()} "
        self.message['From'] = Address("QM Violation Alerts", addr_spec="stirumala@walmart.com")
        self.message['To'] = Address(self.group_name, addr_spec=self.email_recipient)
        self.message.set_content(self.content_callback())
        self.message.add_alternative(self.html_callback(), subtype='html')

    def send(self):
        self._assemble()
        # Send the message via local SMTP server.
        with smtplib.SMTP('smtp-gw-cdc.homeoffice.wal-mart.com') as s:
            try:
                s.send_message(self.message)
            except smtplib.SMTPRecipientsRefused as rr:
                print(f"SMTP server refused recipient {self.email_recipient}: {rr}", file=sys.stderr)
            except smtplib.SMTPHeloError as he:
                print(f"SMTP server negotiation error: {he}", file=sys.stderr)
            except smtplib.SMTPSenderRefused as sr:
                print(f"SMTP server refused sender (piidataviolations@wal-mart.com) {sr}", file=sys.stderr)
            except smtplib.SMTPDataError as de:
                print(f"SMTP server data error: {de}", file=sys.stderr)
            except smtplib.SMTPNotSupportedError as nse:
                print(f"SMTP server header config not supported: {nse}", file=sys.stderr)
            s.quit()
