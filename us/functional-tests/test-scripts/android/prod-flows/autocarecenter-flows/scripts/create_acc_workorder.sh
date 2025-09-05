#!/usr/bin/env bash

# This script create a work order for autocarecenter. The work order is
# default link with accaddonsandroid1@mail.com
# You can run this script as follows:
#
#   ./create_acc_workorder.sh [key=value] [key2=value2] ...
#
# Parameters:
#   - All parameters are optional and specified in key=value format.
#   - They will be dynamically change the request body value.
#
# Examples:
#   ./create_acc_workorder.sh                              # Runs with default keyTag="12345" and storeNumber="2038".
#   ./create_acc_workorder.sh keyTag=54321                 # Runs with keyTag set to 54321.
#   ./create_acc_workorder.sh keyTag=54321 storeNumber=32144 otherKey=example  # Set all parameters to the JSON body.

# Check if the script is executed with Bash
if [ -z "$BASH_VERSION" ]; then
  echo "Error: This script must be run with Bash." >&2
  exit 1
fi

# Minimum required Bash version
required_major=4
required_minor=0

# Extract the current Bash version numbers
current_major=${BASH_VERSINFO[0]}
current_minor=${BASH_VERSINFO[1]}

# Compare the current Bash version with the required version
if (( current_major < required_major )) || { (( current_major == required_major )) && (( current_minor < required_minor )); }; then
  echo "Error: This script requires Bash version $required_major.$required_minor or higher." >&2
  exit 1
fi

# Check if jq is installed
if ! command -v jq &>/dev/null; then
  echo "Error: jq is not installed. Please install jq before running this script." >&2
  echo "For installation, follow these instructions:"
  echo "  - macOS: brew install jq"
  echo "  - Debian/Ubuntu: sudo apt-get install -y jq"
  echo "  - CentOS/Fedora: sudo yum install -y jq"
  echo "  - Windows (WSL): sudo apt-get install -y jq"
  echo "  - Windows (Git Bash/Cygwin): Download jq from https://stedolan.github.io/jq/"
  exit 1
fi

declare -A passed_vars
# Set default values for mandatory parameters
keyTag="12346"
storeNumber="2038"

# Function to parse command-line arguments
parse_args() {
  while [ $# -gt 0 ]; do
    case $1 in
      *=*)
        key="${1%%=*}"  # Extract the parameter name (before the = sign)
        value="${1#*=}" # Extract the parameter value (after the = sign)
        if [[ -z "$value" ]]; then 
          value=""
        fi
        passed_vars["$key"]="$value"
        ;;
      *)
        # Handle unknown parameters
        echo "Unknown parameter: $1"
        exit 1
        ;;
    esac
    shift # Move to the next argument
  done

  # Ensure mandatory parameters have valid values or use defaults
  keyTag="${keyTag:-12345}"         # Use the default value if keyTag is not set
  storeNumber="${storeNumber:-2038}" # Use the default value if storeNumber is not set

  # Print all dynamically created variables and their values
  echo "All parameters:"
  for key in "${!passed_vars[@]}"; do
    echo "$key=${passed_vars[$key]}" # Print variable name and its value
  done
}

# Call the argument parsing function
parse_args "$@"


BODY=$(cat <<EOF
{
    "status": "CREATED",
    "vehicle": {
        "vehicleId": "230b0864-c639-469c-ab2b-4c8268e61b2b",
        "fitment": {
            "baseVehicleId": "128041",
            "baseEngineId": "2047",
            "baseBodyType": "4 Dr Sedan",
            "tireSizeOptions": [
                {
                    "tireSize": "245/45R18",
                    "width": "245",
                    "ratio": "45",
                    "diameter": "18",
                    "loadIndex": "96",
                    "speedRating": "V",
                    "positions": "Both",
                    "isSelected": false
                },
                {
                    "tireSize": "245/40R19",
                    "width": "245",
                    "ratio": "40",
                    "diameter": "19",
                    "loadIndex": "94",
                    "speedRating": "W",
                    "positions": "Both",
                    "isSelected": true
                },
                {
                    "tireSize": "245/40R19",
                    "width": "245",
                    "ratio": "40",
                    "diameter": "19",
                    "loadIndex": "94",
                    "speedRating": "V",
                    "positions": "Both",
                    "isSelected": false
                }
            ],
            "engineOptions": [
                {
                    "id": "2047",
                    "label": " 3.5L V6    F DOHC 24V",
                    "isSelected": true
                }
            ]
        },
        "vin": "1n4aa5ap7ec446958",
        "year": "2014",
        "make": "NISSAN",
        "model": "MAXIMA",
        "bodyType": "",
        "subModel": {
        	"subModelName":"S",
        	"subModelId": "1"
        },
        "subModelOptions": null,
        "color": "Orange",
        "vehicleType": "Sedan",
        "licensePlate": "fo",
        "licensePlateState": "Georgia",
        "licensePlateCountry": "United States",
        "owners": [
            "1c78a57e-9ac6-41c7-934d-79e0191f9e47"
        ],
        "createdBy": "",
        "dateCreated": "",
        "updatedBy": "",
        "dateUpdated": "",
        "isDually": false,
        "customers": [
            {
                "customerId": "93a4743b-13c8-43a5-a718-dbd05794eeea",
                "accProfileId": "",
                "wmtProfileId": "3002439d-5007-42b7-8542-5e8095b44f65",
                "address": {
                	"address1": "addressLine1",
                	"city": "city",
                	"state": "MD",
                	"country": "USA",
                	"zip": "12345"
                	
                },
                "communicationConsent": false,
                "firstName": "accaddons",
                "lastName": "androidone",
                "email": "",
                "phoneNumber": "7038886200",
                "phone": "",
                "vehicles": null
            }
        ],
        "source": "CARFAX"
    },
    "customer": {
        "customerId": "93a4743b-13c8-43a5-a718-dbd05794eeea",
        "accProfileId": "",
        "wmtProfileId": "3002439d-5007-42b7-8542-5e8095b44f65",
        "address": {
                	"address1": "2476 Barlow Ave",
                	"city": "San Jose",
                	"state": "CA",
                	"country": "USA",
                	"zip": "95122"
                	
        },
        "communicationConsent": false,
        "firstName": "accaddons",
        "lastName": "androidone",
        "email": "accaddonsandroid1@mail.com",
        "phoneNumber": "7038886200",
        "phone": "",
        "vehicles": null
    },
    "odometer": null,
    "keyTag": "12345",
    "serviceCart": {
            "serviceItems": [
                {
                    "id": "39f1b8db-f80f-4e11-8b38-c5465531e56a",
                    "itemId": "3701429",
                    "name": "Synthetic featured",
                    "upc": "00605388860194",
                    "quantity": 0.0,
                    "serviceType": "OIL_AND_LUBE",
                    "components": [
                        {
                            "componentType": "OIL",
                            "product": {
                                "itemId": "55325727",
                                "upc": "00079191100509",
                                "name": "Castrol Syntec 5W-30 -",
                                "shortDescription": "CAS SYN EB  5W30 SN",
                                "quantity": 6.1,
                                "retailPrice": 5.38,
                                "customerCredit": 0.0,
                                "includedQuantity": 5.0,
                                "imageUrl": "https://i5.walmartimages.com/asr/ab39555d-1c0a-4162-83db-9d9c139adad0.440635b3ac6c32250812ccf3e578a4e8.jpeg",
                                "attributes": [
                                    {
                                        "key": "brand",
                                        "value": "Generic"
                                    }
                                ],
                                "pcsType": [
                                    "Full Synthetic",
                                    "Bulk"
                                ],
                                "pcsVolumeCapacity": [
                                    "1 qt"
                                ],
                                "onlinePrepaidQuantity": 0.0
                            },
                            "configurations": []
                        },
                        {
                            "componentType": "OIL_FILTER",
                            "product": {
                                "name": "See Manual",
                                "quantity": 1.0,
                                "retailPrice": 0.0,
                                "customerCredit": 1.77,
                                "includedQuantity": 1.0,
                                "onlinePrepaidQuantity": 0.0
                            },
                            "configurations": []
                        }
                    ],
                    "retailPrice": 54.88,
                    "laborCost": 0.0,
                    "ifNeeded": false,
                    "serviceIfNecessary": false,
                    "entityType": "SYNTHETIC_FEATURED",
                    "onlinePrepaidQuantity": 0.0,
                    "prepaid": false
                },
                {
                    "id": "65a0f6a3-f319-47a2-933e-49d07cd6e7c0",
                    "itemId": "3700093",
                    "name": "Lifetime balance",
                    "upc": "00078742243436",
                    "quantity": 0.0,
                    "serviceType": "TIRE",
                    "components": [],
                    "retailPrice": 15.0,
                    "laborCost": 0.0,
                    "ifNeeded": false,
                    "serviceIfNecessary": false,
                    "configurations": [
                        {
                            "type": "positions",
                            "values": [
                                "TIRE_DRIVER_FRONT",
                                "TIRE_DRIVER_REAR",
                                "TIRE_PASSENGER_FRONT",
                                "TIRE_PASSENGER_REAR"
                            ]
                        },
                        {
                            "type": "vehicleHasTpms",
                            "values": [
                                "FALSE"
                            ]
                        }
                    ],
                    "entityType": "LIFETIME_BALANCE",
                    "onlinePrepaidQuantity": 0.0,
                    "prepaid": false
                }
            ],
            "total": 120.8
        },
    "storeNumber": "2038",
    "creationDate": "",
    "createdBy": "e0k0049",
    "startTime": "2024-10-09T10:31:02.690Z",
    "endTime": "2024-10-09T10:32:12.909Z",
    "appointment": null,
    "events": null,
    "vehicleDamages": null,
    "digitalForms": [
        {
            "type": "PRSA",
            "url": "https://d9102b0b2spstg.blob.core.windows.net/pre-fulfilment-agreement/2020/3/17/2038/PRSA-muller_harlan-eaa7375b-cb44-4c60-b516-af8b39ee4281.pdf"
        }
    ],
    "customerAgreement": null,
    "documentType": "",
    "customerComments": null
}
EOF
)

# Use jq to dynamically replace values in the JSON body for explicitly passed variables
for key in "${!passed_vars[@]}"; do
  value="${passed_vars[$key]}" # Get the value of the variable
  if [[ -n "$value" ]]; then
    # Debugging: Print the key and value being replaced
    echo "Replacing \"$key\" with \"$value\""

    # Replace only if the key matches exactly in the JSON
    BODY=$(echo "$BODY" | jq --arg key "$key" --arg value "$value" \
      'if .[$key] != null then .[$key] = $value else . end')
  fi
done

# Print final JSON body for debugging
echo "Final JSON body after replacements:"
echo "$BODY"

url = "https://stg.workorder.acc.walmart.com/api/v1/locations/$storeNumber/workorders"
response=$(curl -s -X post
curl --location "$url" \
--header 'WM_CONSUMER.ID: bcca7724-cbab-4e71-bc65-ce1ee1f3b871' \
--header 'WM_SVC.NAME: ACC-WORKORDER-SERVICE' \
--header 'WM_SVC.ENV: stg' \
--header 'x-order-id;' \
--header 'x-store-number;' \
--header 'x-app-version;' \
--header 'x-user: vn56uyr' \
--header 'Content-Type: application/json' \
--header 'Cookie: _abck=C8305DC3BE6494B898534BF9B8A0E3C9~-1~YAAQLjovFzlujOGRAQAANgiFBgw68C9aazWWM7IPdwubSUz2knG7NDlot12xfuO5i8OLlC895T9jaZRfcSKxcMENR37ufCjxKFiie8/7u57ciGkPnB4/Qa937j29bQheiFYL3HPuvqGf/ooZedhHlGzAfrqzwglwC9umsaO4Us9257RU6wla5hpd3TjqwyHeRyf6UNU1n6kM7FAB+jgVANlD1a4F/aXUGx8yq+TuX9YIkegwOLETxeFS8bvY1SqGVaOhdA6Up/09o9PotqMOJuhlpHLY1JZgxu3vFODE30YgoCtGzhtoJv9/JMXa/6sgLLuJDzAbZkCve9xxbRdpSNnWOWFf0HcZyfl54hTp~-1~-1~-1; _lat=30b5e5652005e16f0c4d550289838e87cprof; _msit=e39b52f8eb470762288185453855db61wmjet; vtc=W1jGPoC0vwAjdfnWht8IMc' \
--data-raw "$BODY"
)

echo "Responser from server:"
echo "$response"