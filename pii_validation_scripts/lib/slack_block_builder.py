import json
import os
import sys

from envutils import EnvUtils


class SlackBlockBuilder:
    """
    A lightweight builder that leverages the more modern Block syntax used to build messages
    for display in Slack.

    This instance can also deal with the upload of the block message.

    REQUIREMENTS:
       * SLACK_TOKEN env var must be defined.

    USAGE::

       section_builder = SlackBlockBuilder()
       title = SlackBlockBuilder.assemble_section_block("Your message title.")
       body = SlackBlockBuilder.assemble_section_block("Your *markdown* body.")
       body_2 = SlackBlockBuilder.assemble_section_block("Your plaintext body.", False)
       fields = SlackBlockBuilder.assemble_section_fields([SlackBlockBuilder.assemble_markdown_block("*Download*"),
                                                           SlackBlockBuilder.assemble_markdown_block("*Password*"),
                                                           SlackBlockBuilder.assemble_markdown_block(markdown_content),
                                                           SlackBlockBuilder.assemble_text_block(plaintext_content)])
       attachment = section_builder.add_attachment_section("Text to be shown as an 'attachment'")
       section_builder.add_sections([title, body, body2, fields, attachment])
       section_builder.upload()
    """

    def __init__(self, debug: bool = False, slack_channel: str = 'builds-glass-ios'):
        """
        Initialize a new instance of the Slack block builder object.

        :param debug: If set to True, the object will dump the payload and response when uploaded.
        :param slack_channel: The Slack channel to send the notification to.
        """
        self.sections = []
        self.debug = debug
        self.slack_channel = slack_channel
        assert os.environ.get('SLACK_TOKEN'), "SLACK_TOKEN env var must be defined."

    def __repr__(self):
        return json.dumps(self.sections)

    def add_section(self, section_dict):
        if section_dict:
            self.sections.append(section_dict)

    def add_sections(self, section_dicts):
        if section_dicts:
            self.sections.extend(section_dicts)

    def add_attachment_section(self, attachment_text):
        self.sections.append(SlackBlockBuilder.assemble_attachment(attachment_text))

    @staticmethod
    def assemble_markdown_block(text):
        return {"type": "mrkdwn", "text": text[:3000]}

    @staticmethod
    def assemble_text_block(text):
        return {"type": "plain_text", "text": text[:3000]}

    @staticmethod
    def assemble_section(text_dict):
        return {"type": "section", "text": text_dict}

    @staticmethod
    def assemble_section_block(text, markdown: bool = True):
        """
        Add text to a new section.

        This text can be pre-markdown, or plain text.

        :param text: The text to display in a new Block section.
        :param markdown: Whether the text should be rendered in markdown or shown as
        plain text. Defaults to True (render as markdown). Text w/o markdown can still
        be rendered as markdown.
        :return: A new section block.
        """
        if markdown:
            return {"type": "section", "text": SlackBlockBuilder.assemble_markdown_block(text)}
        return {"type": "section", "text": SlackBlockBuilder.assemble_text_block(text)}

    @staticmethod
    def assemble_section_fields(fields_arr):
        return {"type": "section", "fields": fields_arr}

    @staticmethod
    def assemble_attachment(text):
        return {"type": "context", "elements": [{"type": "mrkdwn", "text": text}]}

    def reset(self):
        self.sections.clear()

    def upload(self):
        import lib.slack_manager as lsm
        payload = {"token": EnvUtils.get_slack_token(),
                   "channel": self.slack_channel,
                   "blocks": json.dumps(self.sections),
                   "link_names": 1}
        if self.debug:
            print(payload)

        sm = lsm.SlackManager()
        response = sm.send_slack_msg(payload)
        if self.debug or (response and "ok" in response and response["ok"] is False):
            print(f"{__name__}: {response}", file=sys.stderr)
        return response
