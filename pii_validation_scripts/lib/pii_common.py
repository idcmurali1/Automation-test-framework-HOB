from dataclasses import dataclass


@dataclass
class PIIDataConfig:
    emails: set
    credit_cards: set
    firstNames: set
    lastNames: set
    addresses: set
    phoneNumbers: set
