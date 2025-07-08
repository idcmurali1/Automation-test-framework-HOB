# glass-automation
Glass E2E Automation using R2
<a name="introduction"></a>

# Introduction #
#### Glass App Automation. This test framework is built utilizing R2 and Appium to execute functional and E2E automated tests. ####

# Table of Contents
**Getting Started**
* [Prerequisites](#prerequisites)
* [iOS Component Setup](#iossetup)
* [Android Component Setup](#androidsetup)
* [Download Apps](#download)
* [Execute Tests on Local](#executelocal)
* [Appium Desktop](#appiumdesktop)
* [R2 Knowledge base](#r2-docs)
* [Download R2](#download-r2-jar)
* [Repo Structure Guidelines](#structure)
* [Branch Strategy](#branch)
* [Pull Requests and Looper Jobs](#pullrequests)
* [R2 and Onboarding Help](#introduction)

**Advanced**
* [Sauce Labs Setup](#sauce)
* [Execute Tests on Sauce Labs](#executesaucelabs)
* [Setting App with Debug Settings and Environment Profiles](#debugsettings)
* [Mock Server](#mock)
* [Execute Tests on Local with Mocks](#executelocalmock)
* [Execute Tests on Sauce Labs with Mocks](#executesaucelabsmock)

**Functional Team Onboarding Process**
* [Slack Channel](#slackchannel)
* [New Contributor- Git Access](#NewContributors)
* [Automation Setup](#setup)
* [New Object identifiers, functions and testscripts](#testscripts)
* [Resusability](#resusinge2eutilities)
* [PR Review Process](#Pull-Requests-Review-Process)
* [Functional-Tests Looper Job](#Functional-Tests-Looper-Jobs)


# Getting Started #
<a name="prerequisites"></a>

# Prerequisites #
* Note:
  * It is recommended that VPN is used for setup and execution of tests
  * If you encounter app install permissions issues with Gatekeeper, then follow these instructions - https://apple.stackexchange.com/a/294016
* Install [Version 16.20.0 Node.js and npm](https://nodejs.org/download/release/v16.20.0/node-v16.20.0.pkg)
  * Or install through [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)
* Install [JDK 11](https://www.azul.com/core-post-download/?endpoint=zulu&uuid=37615bf7-8864-4086-b0db-4f02988b823f)
* Set `JAVA_HOME` environment variable in `.zshrc`:
```bash
export JAVA_HOME=$(/usr/libexec/java_home)
```
* Clone this repo onto your local (avoid cloning onto your /Downloads folder)
```bash
$ git clone git@gecgithub01.walmart.com:MobileQE/glass-automation.git
```
* Install all node package dependencies inside the **/glass-automation.git** folder
```bash
$ npm install
```
* Install Appium 2.0, xcuitest, and uiautomator2
  * If you encounter permissions issues, run this command: `sudo chown -R $USER /usr/local/lib/node_modules`
  * If this doesn't work, run this command: `sudo npm install -g appium`
```bash
$ npm install -g appium
$ appium driver install xcuitest@5.16.1
$ appium driver install uiautomator2@2.29.4
```
  * If either steps doesn't work, you can can configure npm to use a different directory for global installations
```bash
$ mkdir "${HOME}/.npm-global"
$ npm config set prefix "${HOME}/.npm-global"
```
  * Add this line `export PATH="${HOME}/.npm-global/bin:${PATH}"` to your shell configuration file (e.g., `.bashrc`, `.zshrc`, or `.profile`), reload and try again.
```bash
$ source ~/.bashrc  # or source ~/.zshrc, source ~/.profile, etc.
$ npm install -g appium

```
* Install YAML Lint
  * This is a YAML linter that will do a simple lint check. It will not catch invalid R2 commands or usage.
```bash
$ npm install -g yaml-lint
```
* Setup environment variables file (The `.env` file will be ignored by Git so you can put private information in it.)
```bash
$ cp .env.example .env
$ source .env
```

# Download R2 Jar #
Please periodically download the latest R2 Jar file for the latest fixes, enhancement, and compatibility. You can download the latest R2 binary by running the following command:

```bash
$ npm run download-r2
```


<a name="iossetup"></a>

# iOS Component Setup #
* Install [Xcode 14.1](https://developer.apple.com/download/more/?=xcode%2014.1)
* For Sonoma MacOS download install latest Xcode 15.3 
  * For this version of Xcode, Sauce Labs currently only supports up to iOS 16.1. To match this iOS version on your local, please use iOS 16.1 simulator. If this simulator version is not available, you may download by launching Xcode and go to: `Xcode > Preferences > Components`
  * If you have more than one Xcode version, use `Command Line Tools` or `xcode-select` to change versions.
* Install Latest Carthage
```bash
$ brew install carthage
```

Verify all required items are setup by running appium-doctor:

```bash
# install appium-doctor (may require sudo)
$ npm install appium-doctor -g
# check that all required iOS dependencies are set up correctly
$ appium-doctor --ios
```

* Troubleshoot:
If any user see below error, please follow the below steps:
```Caused by: org.openqa.selenium.WebDriverException: An unknown server-side error occurred while processing the command. Original error: Unable to launch WebDriverAgent because of xcodebuild failure: xcodebuild failed with code 65 xcodebuild error message```

1. Make sure Xcode 14.1 is installed, not the latest one.
2. Make sure appium server latest version is installed.
3. run the below cmd to clear webdriver agent: (run it from your local dir)
```
rm -rf ~/Library/Developer/Xcode/DerivedData/WebDriverAgent*
```

<a name="androidsetup"></a>

# Android Component Setup #
* Install [Latest Android Studio](https://developer.android.com/studio/index.html#downloads)
  * Update the following through Tools > Android > SDK Manager:
  * SDK Platforms: Download Android 14.0 (API 34) SDK
    * Expand package details and include Google APIs Intel x86 Atom System Image
  * SDK Tools: Update Android SDK Build-Tools, Android Emulator, Android SDK Platform-Tools, Android SDK Tools, Intel x86 Emulator Accelerator, Intel x86_64 Emulator Accelerator
* Create an Android Virtual Device (AVD) with Android 14.0 SDK
  * OPTIONAL: Follow these steps to create suggested AVD
    * Go to **AVD Manager** in Android Studio
    * Click on **Create Virtual Device**
    * Click on **Pixel 8 Pro**
    * Select image with API 34 (download may be required), and click Next
    * Verify AVD Name is **Pixel 8 Pro API 34**, and click Finish
* Set `ANDROID_HOME` environment variable according to [this page](https://stackoverflow.com/questions/19986214/setting-android-home-enviromental-variable-on-mac-os-x)
* Ensure that `$JAVA_HOME/bin` is included in your `PATH`

Verify all required items are setup by running appium-doctor:

```bash
# install appium-doctor (may require sudo)
$ npm install appium-doctor -g
# check that all Android dependencies are set up correctly
$ appium-doctor --android
```

<a name="download"></a>

# Download Apps #
## Download iOS App from Nexus Build Repository ##
* This is an optional step to download the latest development/release branch builds onto your local
* Note: Connection to VPN may be required to download app
```bash
# follow prompts to download specific app version and branch
$ npm run us-download-ios-app
```
## Download Android App from Nexus Build Repository ##
* This is an optional step to download the latest development/release branch builds onto your local
* Note: Connection to VPN may be required to download app
```bash
# follow prompts to download specific app version and branch
$ npm run us-download-android-app
```

<a name="executelocal"></a>

# Execute Tests on Local #
## Execute iOS App Test on Local ##
* Note: Connection to VPN may be required to execute test
* The first test execution includes a process to build and install the WebDriverAgent which could take a few minutes.
* Run command to launch R2:
```bash
$ npm run start-appium
$ java -jar r2-binary/r2.jar \
  -a us/ \
  -d us/e2e-tests/dependencies/ios/ios-default.yaml \
  -t example-test \
  -p local
```

## Execute Android App Test on Local ##
* Note: Connection to VPN may be required to execute test
* The first test execution includes a process to build and install the WebDriverAgent which could take a few minutes.
* Launch `Pixel 8 Pro API 34` Android emulator
* Run command to launch R2:
```bash
$ npm run start-appium
$ java -jar r2-binary/r2.jar \
  -a us/ \
  -d us/e2e-tests/dependencies/android/android-default.yaml \
  -t example-test \
  -p local
```

## R2 Jar Command ##
To execute the R2 Jar manually, you can use the following command:
```bash
$ java -jar <location of R2 jar file> \
  -a <path to root folder containing all tests/functions/mappings> \
  -d <name or location of dependencies file> \
  -t <test tags of tests to be executed> \
  -p <dependency profile>
```

<a name="appiumdesktop"></a>

# Appium Inspector #
Appium Inspector is a GUI that will allow you to view the elements and pages for a specific app. This will allow you to locate specific elements on the app screen to use as identifiers in automated tests.

For an introduction and video guide to Appium Desktop - https://saucelabs.com/resources/webinars/an-introduction-to-appium-desktop

For additional information on Appium Capabilities - http://appium.io/docs/en/writing-running-appium/caps/

* Download and install [Appium Inspector](https://github.com/appium/appium-inspector/releases)
* In terminal, within `glass-automation` project, run `npm run start-appium`
* Launch `Appium Inspector.app`
* Click on `Edit Raw JSON` (located on right of the screen inside of JSON box)
* Paste the following:

**For iOS:**
```
{
  "platformName": "iOS",
  "platformVersion": "16.1",
  "deviceName": "iPhone 14",
  "app": "<path to glass.zip>",
  "waitForQuiescence": false,
  "automationName": "XCUITest",
  "bundleId": "com.walmart.beta.electronics"
}
```

**For Android:**
```
{
  "platformName": "Android",
  "platformVersion": "14.0",
  "deviceName": "Pixel_8_Pro_API_34",
  "app": <enter location of glass.apk>,
  "fullReset": true,
  "noReset": false,
  "appPackage": "com.walmart.android.debug",
  "appActivity": "com.walmart.glass.integration.AutomationActivity",
  "appWaitActivity": "com.walmart.glass.onboarding.view.OnboardingActivity",
  "adbExecTimeout": "50000"
}
```

* Click on `Disk Icon` (located on right of the screen inside of JSON box)
* Click `Save As...` to keep the profile for future use
* Click `Start Session`

<a name="r2-docs"></a>

# R2 Knowledge base #
* R2 Overview : http://testing.walmart.com/testsolutions/r2/overview.html
* R2 Configuration Guide : http://testing.walmart.com/testsolutions/r2/configuration-guide.html

<a name="structure"></a>

# Repo Structure Guidelines #

## Folder Structure ##
```bash
TBD
```

## Functions ##
Each feature should have one or many function files which contains reusable flows and assertions.

NOTE: Functions created separately for iOS and Android should be closely in sync as possible. This will allow teams that use combined platform structure to use the function correctly. Functions for iOS and Android should be created with the following:
* Share the same function name
* Start on the same page
* End on the same page

Function naming should follow this convention:<br>
$market.functions.$feature.$sublevel(optional).$functionName

Examples:<br>
**us.functions.global.authentication.signInFlow**<br>
**us.functions.search.filters.filterByBrand**

## Mappings ##
Each feature should have one or many mappings files which contains reusable identifier mappings.

Mappings naming should follow this convention:<br>
$market.mappings.$feature.$sublevel(optional).$functionName

Examples:<br>
**us.mappings.global.authentication.emailAddressField**<br>
**us.mappings.search.filters.filterButton**

## Test Case Scripts ##
Each golden flow will be have its own folder. Within each folder will contain one or many test case script files that will be used for pre-transaction, transaction, and post-transaction flows.

Test files names should follow this convention:<br>
$testrailid-$market-$flowType-$number.yaml

Examples:<br>
**C000001-us-pre-transaction-1.yaml**<br>
**C000002-us-pre-transaction-2.yaml**<br>
**C000003-us-transaction-1.yaml**<br>
**C000004-us-post-transaction-1.yaml**

## Helpers ##
Helpers are files that can be inherited by test configs. These files can include a set of scenarios that are commonly used with many test cases, such as onboarding flow.

## Dependencies ##
Dependencies are files that include the configuration for test setup and appium capabilities. A dependency file will be setup for each environment.

<a name="branch"></a>

# Branch Strategy #
This repository will match the branches created from the iOS and Android app repository. By default, we will use `development` branch. Whenever the app repos cut a new release branch, we will also cut a `release` branch and increment the app version on `development`.

<a name="pullrequests"></a>

# Pull Requests and Looper Jobs #

## Pull Requests ##
Pull requests require one approval and should typically have all PR tests passing before merging. We are following this git process for naming standards - https://confluence.walmart.com/display/GPWUSMENG/Git+Process

## Looper Jobs ##
We are using a **multibranch looper project** to allow us to execute on multiple branches such as development and each release branch. Please ask for **multibranch looper project** access in #sde-looper slack channel.

Looper jobs:

https://ci.electrode.walmart.com/job/glass-automation

<a name="sauce"></a>

# Advanced #
It is important to complete your local configuration and have a full understanding of the previous setup before proceeding.

# Sauce Labs Setup #

* Sign in to Sauce Labs using your SSO [Instructions](https://confluence.walmart.com/pages/viewpage.action?spaceKey=CEDXTKB&title=How+to+Sauce+Labs+SSO+Login).
* Find your username and access key on the [Sauce Labs User Settings](https://app.saucelabs.com/user-settings) page.
* Update the `.env` file with your `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` values, like:
  ```sh
  …
  export SAUCE_USERNAME=jdoe_walmartlabs
  export SAUCE_ACCESS_KEY=11111111-2222-3333-4444-55555555
  …
  ```
* Load the variables from your `.env` file by running `source .env`.
* Optional: You can set these environment variables in your .zshrc or .bash_profile

<a name="executesaucelabs"></a>

# Execute Tests on Saucelabs #

## Upload and execute iOS app to Saucelabs ##
* Note: Connection to VPN may be required to execute test
* To upload app to Sauce Labs, please specify the app path in `--data-binary`. iOS app file needs to be in zip format to be accepted by Sauce Labs. The file name in the sauce-storage can be updated by changing the POST url file name.
```bash
$ npm run us-upload-saucelabs-ios-app
```
```bash
$ java -jar r2-binary/r2.jar \
  -a . \
  -d us/e2e-tests/dependencies/ios/ios-default.yaml \
  -t example-test \
  -p saucelabs
```

## Upload and execute Android app to Saucelabs ##
* Note: Connection to VPN may be required to execute test
* To upload app to Sauce Labs, please specify the app path in `--data-binary`. Android app file can in apk format to be accepted by Sauce Labs. The file name in the sauce-storage can be updated by changing the POST url file name.
```bash
$ npm run us-upload-saucelabs-android-app
```
```bash
$ java -jar r2-binary/r2.jar \
  -a . \
  -d us/e2e-tests/dependencies/android/android-default.yaml \
  -t example-test \
  -p saucelabs
```

<a name="Functional Team Onboarding Process"></a>

# Functional Team Onboarding Process #

# Slackchannel
*  Use #functional-pr-reviews-by-e2e to connect with E2E team 

# NewContributors
* To get added to glass-automation, Share team name or userids tagging @e2e-native-apps-leads slack handle for providing access

# Setup
* Go through below required setup links for setting up the framework
* [Prerequisites](#prerequisites)
* [iOS Component Setup](#iossetup)
* [Android Component Setup](#androidsetup)
* [Download Apps](#download)
* [Execute Tests on Local](#executelocal)
* [Appium Desktop](#appiumdesktop)
* [R2 Knowledge base](#r2-docs)
* [Branch Strategy](#branch)

# ResusingE2EUtilities
* Go through FUNCTIONS_README.yaml under us/e2e-tests/modules to get overview of existing functions
* Teams can make use of utilities or any existing functions/object identifiers added by E2E Team under us/e2e-tests

# Testscripts
* Each Team can create a folder with #teamname[example:cart-and-checkout-flows] under us/functional-tests create data,object identifiers(mappings), functions as required for the flow 
* Any New assertions for a functional flow thats requires a new function, data, object identifier should be handled and owned by functional teams under us/functional-tests

# Execute in Saucelabs or Local

* iOS :

```bash
  java -jar r2-binary/r2.jar \
  -a . \
  -d us/functional-tests/dependencies/ios/ios-default.yaml \
  -t example-test \
  -p saucelabs
```
*Android:

```bash
  java -jar r2-binary/r2.jar \
  -a . \
  -d us/functional-tests/dependencies/android/android-default.yaml \
  -t example-test \
  -p saucelabs
```

# Pull-Requests-Review-Process #

* All PRs should be passing CI checks before merging. We are following this git process for naming standards - https://confluence.walmart.com/display/GPWUSMENG/Git+Process
* Any changes to existing E2E utilities or functions should be reviewed and approved first by one of functional team code owner and then E2E code owners 
* Post the PRs for review in #functional-pr-reviews-by-e2e Slack channel 
* Tag @glass-apps-e2e  slack handle for reviewing PRS which also involves E2E file changes
* Changes specific to functional-tests related files can be approved by one of the functional team member

# Functional-Tests-Looper-Jobs #

* We are using a **multibranch looper project** to allow us to execute on multiple branches such as development and each release branch. Please ask for **multibranch looper project** access in #sde-looper slack channel.

* Looper jobs: Sample CI pipeline is created , teams can create scheduled cron jobs as required in dev and release specs   

https://ci.electrode.walmart.com/job/glass-mobile-app-automation/job/us/job/functional-tests/
