import requests
import time

def upload_to_splunk(entries, appVer, flow):
    jsonPayload = build_payload(entries, appVer, flow)
    response = requests.post('https://analytics.mobile.walmart.com/analytics/devices', json=jsonPayload, verify=True)
    return response

def build_payload(entries, appVer, flow):
    analytics = []
    images = []
    orchestra = []
    other = []
    perimeterx = []
    quantumMetric = []
    failedCallsCount = 0
    failedCalls = []
    requestWithLargestBody = None
    responseWithLargestBody = None

    for entry in entries:
        if is_ios_user_agent(entry.request.userAgent):
            entryJson = build_entry_json(entry)
            if is_analytics_url(entry.request.url):
                analytics.append(entryJson)
            elif is_images_url(entry.request.url):
                images.append(entryJson)
            elif is_orchestra_url(entry.request.url):
                orchestra.append(entryJson)
            elif is_perimeterx_url(entry.request.url):
                perimeterx.append(entryJson)
            elif is_quantumMetric_url(entry.request.url):
                quantumMetric.append(entryJson)
            else:
                other.append(entryJson)
            if entry.response.status >= 300:
                failedCallsCount += 1
                failedCalls.append(entry.request.url)
            if requestWithLargestBody is None or entry.request.bodySize > requestWithLargestBody.request.bodySize:
                requestWithLargestBody = entry
            if responseWithLargestBody is None or entry.response.bodySize > responseWithLargestBody.response.bodySize:
                responseWithLargestBody = entry

    return {
        "mts": int(time.time() * 1000),
        "event": "networkProfilerScript",
        "sindex": "deviceOps",
        "lang": "en_US",
        "ua": "ci.walmart.com",
        "platform": 'ios',
        "events": [{
            "networkLogs": {
                "totalCount": len(analytics) + len(images) + len(orchestra) + len(other) + len(quantumMetric) + len(perimeterx),
                "analytics": {
                    "totalCount": len(analytics),
                    "logs": analytics
                },
                "images": {
                    "totalCount": len(images),
                    "logs": images
                },
                "orchestra": {
                    "totalCount": len(orchestra),
                    "logs": orchestra
                },
                "other": {
                    "totalCount": len(other),
                    "logs": other
                },
                "quantumMetric": {
                    "totalCount": len(quantumMetric),
                    "logs": quantumMetric
                },
                "perimeterx": {
                    "totalCount": len(perimeterx),
                    "logs": perimeterx
                }
            },
            "event": "networkProfilerScript",
            "aVer": appVer,
            "platform": 'ios',
            "flow": flow,
            "failedCallsCount": failedCallsCount,
            "failedCalls": failedCalls,
            "requestWithLargestBody": build_entry_json(requestWithLargestBody),
            "responseWithLargestBody": build_entry_json(responseWithLargestBody)
        }]
    }

def build_entry_json(entry):
    # https://haralyzer.readthedocs.io/en/latest/basic/harentry.html
    return {
        "respBodySize": entry.response.bodySize,
        "respStatusCode": entry.response.status,
        "requestBodySize": entry.request.bodySize,
        "timings": entry.timings,
        "url": entry.request.url,
        "userAgent": entry.request.userAgent
    }

def is_analytics_url(url):
    return "https://analytics" in url

def is_images_url(url):
    return "https://i5" in url

def is_orchestra_url(url):
    return "orchestra" in url

def is_perimeterx_url(url):
    return "perimeterx" in url

def is_quantumMetric_url(url):
    return "quantummetric" in url


def is_ios_user_agent(agent):
    return ( agent is None ) or ( "iOS" in agent ) or ( "CFNetwork" in agent )
