# Function Names

functions:

#--------------------------------------------------------------------------------------------------------------------

  ### Description: Validate Onboarding page.
  ### No Params
  - name: functions.onboarding.validateOboardingPage
    platform: ios
    flow:
      - if:
          condition: ${market} == 'US'
          then:
            - verifyIdentifier:
                label:
                  - identifier: onboarding.welcomeToWalmartPg.welcomeSubtitle
                    equals: us.data.onboarding.welcomeToWalmartPg.welcomeSubtitle
          else:
            - verifyIdentifier:
                label:
                  - identifier: onboarding.welcomeToWalmartPg.welcomeSubtitle
                    equals: data.onboarding.welcomeToWalmartPg.welcomeSubtitle
                  - identifier: onboarding.welcomeToWalmartPg.welcomeDisclaimer
                    equals: data.onboarding.welcomeToWalmartPg.welcomeDisclaimer
      - log:
          message: "End function: onboarding.validateOboardingPage"
          color: BLUE

 #--------------------------------------------------------------------------------------------------------------------

  # Description: This function validate notification page
  # No Params
  - name: functions.onboarding.validateNotificationPage
    platform: ios
    flow:
      - verifyIdentifier:
          present:
            - identifier: onboarding.getNotification.title
            - identifier: onboarding.getNotification.allowButton
            - identifier: onboarding.getNotification.maybeLaterBtn
          label:
            - identifier: onboarding.getNotification.notificationSubtitle
              equals: data.onboarding.getNotification.notificationSubtitle
      - log:
          message: "End function: onboarding.validateNotificationPage"
          color: BLUE

  #--------------------------------------------------------------------------------------------------------------------

  # Description: Validate onboarding share location page & learn more link pop up
  # No Params
  - name: functions.onboarding.validateShareLocation$LearnMoreLink
    platform: ios
    flow:
      - verifyIdentifier:
          present:
            - identifier: onboarding.locationScreenText
            - identifier: onboarding.sharePreciseLocation
            - identifier: onboarding.enterZip$PostalCodeButton
      - getString:
          identifier: oboarding.shareLocation.subTitle
          attribute: label
          storeIn: subTitle
      - executeNode:
          file: wcp/test/helpers/compareTwoString.js
          args:
            - value: ${subTitle}
            - value: data.oboarding.shareLocation.subTitle
          getResponse:
            storeIn: result
      - if:
          condition: "!${result}"
          then:
            - failTest:
                message: "Share your location subtitle mismatch"
      - click:
          identifier: oboarding.shareLocation.subTitle
          coordinates: 70%,95%
      - verifyIdentifier:
          present:
            - identifier: onboarding.shareLocation.learnNowLink.title
            - identifier: onboarding.shareLocation.learnNowLink.description
      - click:
          identifier: global.closeIcon
      - log:
          message: "End function: onboarding.alidateShareLocation$LearnMoreLink"
          color: BLUE

#--------------------------------------------------------------------------------------------------------------------
 
  # Description: This function validate share your postal code page
  # No Params
  - name: functions.onboarding.validateShareYourPostalCodePage
    platform: ios
    flow:
      - verifyIdentifier:
          present:
            - identifier: onboarding.shareLocation.locationIcon
            - identifier: onboarding.sharePostalCode.title
            - identifier: onboarding.sharePostalCode.searchButton
            - identifier: onboarding.sharePostalCode.useCurrentLocationLink
          label:
            - identifier: onboarding.sharePostalCode.title
              equals: data.onboarding.shareLocation.title
            - identifier: onboarding.sharePostalCode.enterZip$PostalCodeText
              equals: data.onboarding.sharePostalCode.enterZip$PostalCodeText
            - identifier: onboarding.sharePostalCode.searchButton
              equals: data.onboarding.sharePostalCode.searchButton
            - identifier: onboarding.sharePostalCode.useCurrentLocationLink
              equals: data.onboarding.sharePostalCode.useCurrentLocationLink
      - log:
          message: "End functions: onboarding.validateShareYourPostalCodePage"
          color: BLUE

#--------------------------------------------------------------------------------------------------------------------

  # Description: This function validate personalised experience page
  # No Params
  - name: functions.onboarding.validatePersonalisedExperienceScreen
    platform: ios 
    flow:
      - if:
          condition: ${market} == 'CA' || ${market} == 'MX'
          then:
            - verifyIdentifier:
                timeout: 30000
                present:
                  - identifier: onboarding.personalizedExperience
                label:
                  - identifier: onboarding.personalisedExperience.subTitle
                    equals: ios.data.mappings.onboarding.personalisedExperience.subTitle
      - log:
          message: "End functions: onboarding.validatePersonalisedExperienceScreen"
          color: BLUE     

  #--------------------------------------------------------------------------------------------------------------------

  # Description: This function handles personalised experience by allowing it.
  # No Params
  - name: functions.onboarding.personalisedExperience.tapAllow
    platform: ios
    flow:
      - verifyIdentifier:
          timeout: 15000
          present:
            - identifier: onboarding.personalizedExperience
      - click:
          identifier: onboarding.personalizedExperienceContinueButton
      - click:
          identifier: onboarding.personalizedExperienceAllowButton
      - log:
          message: "End functions: onboarding.personalisedExperience.tapAllow"
          color: BLUE    
