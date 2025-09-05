# Primary Functions #

## Onboarding ##
```
Name: us.functions.global.onboarding.navigateOnboardingToHome
Params: n/a
Platform: ios, android
Details: Navigate from app launch to home screen
```

## Authentication ##
```
Name: us.functions.global.authentication.signInAccount
Params: email, password
Platform: ios, android
Details: Basic sign in flow
```

## Home ##
Name: us.functions.home.setStore
Params: Store Id, Store Name
Platform: android, ios
Details: On home page use this function to set the store. Currently it checks for San Jose Store on home page and if not set it  sets it otherwise it ignores it. 

Name : Function to handle Wplus Paramount Subscription Screen in Home Page
Platform: android, ios
Details : Function to handle Wplus Paramount Subscription Screen in Home Page

## Search ##
```
Name: us.functions.search.applyPickupOrShippingOrDeliveryFilter
Params: Shipping, Delivery, Pickup
Platform: ios, android
Details: On search page when filtering based on fulfillment type this function should be used


    
Name: us.functions.search.applyGiftFilter
Params: N / A
Platform: ios, android
Details: On search page when filtering for Gift items this function should be used

Name: us.functions.search.applyRetailerFilter
Params: Walmart, Pro-Sellers, Marketplace-Sellers-fulfilled-by-Walmart
Platform: android
Details: On search page when filtering based on retailer type this function should be used

```
## Item ##

```
```
## Cart ##
```
Name: us.functions.cart.scrollToSection
Params: fulfillmentText [Values : Shipping / Pickup / Delivery from store / Digital delivery]
Platform: ios, android
Details: On cart page scrolls to and displays the appropriate section irrespective of which order the section are displayed in the page, useful before performing any action on the specific fulfillment section

Name: us.functions.cart.verifyCardDetails
Params:
1. [Mandatory]  fulfillmentText    - [Values: Shipping/Pickup/Delivery from store/Pickup or delivery/Digital delivery/Pickup from Auto Care]
2. [Optional]   partialCheckout    - [Values: true/false][Set to true if Patial checkout section also to be validated]
Platform: ios, android
Details: On cart page it validates the display of elements related to the section sent in fulfillmentText variable

Name: us.functions.cart.switchBetweenPickUpAndShipping
Params:
1. [Mandatory]  fulfillmentType    - [Values: pickup/shipping]
Platform: ios, android
Details: Function will switch the fulfillment type if it is not matching with the sent parameter

Name: us.functions.selectBookingSlot
Params:
1. [mandatory] ${tab}             - pickup/delivery [Tab where the time slot selection is to be done]
2. [optional] ${page}             - home/cart [If booking slot needs to be loaded explicitly. If page is loaded during checkout, no value required]
3. [optional] ${addAddress}       - true/false [default 'false']
  #         If ${addAddress}      - true then: 
  #         [conditional mandatory] ${firstName}, ${lastName}, ${streetAddress}, ${city}, ${state}, ${zipCode}
4. [optional] ${signInRequired}   - true/false [default 'false']
  #         If ${signInRequired}  - true then: 
  #         [conditional mandatory] ${email}, ${password}
5  [optional] ${timeSlot}         - generic/unscheduled/expressSlot/wplusPreferred [default 'generic'] [What kind of time slot to be selected]
6. [optional] ${slotDay}          - today/tomorrow/dayAfter.. [default 'today']
7. [optional] ${slotIndex}        - 1/2/3 [3 default] [Time slot which needs to be selected]
8. [optional] ${wplusUser}        - optIn / validate [optIn: if an user needs to optIn to wplus membership / validate: validates details of an wplus member details in reserve slot page]
Platform: ios, android
Details: Function to book slot[General/unscheduled/express slots] for any day based on slot availability on pickup/delivery tab while adding address/signing in if required from home/cart page or during checkout

Name: us.functions.wplus.cart.chargeWaiveOffValidation
Params:
1.  [Mandatory]   cartType        -   fcOnly/scOnly/both    [Indicates what type of items are available in cart to make appropriate validations]
2.  [Optional]    storeOrderType  -   pickup/delivery/none  [Default 'none'] [If store item is available in cart, is it store pickup or store delivery]
Platform: ios, android
Details: 
1. Utility to validate display/non display of waive Off details related to Wplus/other fees in cart page based on cart total and type of fulfilment items in cart.
2. Order total amount is automatically calculated based on cart subtotal.
```

Name : us.functions.wplus.cart.chargeWaiveOff-No-35$-minfee 
## Function to Check 35$ min charge waved off in Cart Page for Wplus User
Params :
Platform: ios - For Android TBD

Name : us.functions.wplus.cart.chargeWaiveOff-deliveryFromStoreCharges
## Function to Check Delivery charge waved off in Cart Page for Wplus User
Params :
Platform: ios - For Android TBD

Name : us.functions.wplus.cart.charges-NonWplus-BelowOrderMinimum
## Function to Check minimum charges applied for non-wplus user if the cart is <35$ 
Params :
Platform: ios - For Android TBD

Name : us.functions.wplus.reviewOrder.chargeWaiveOff-No-35$-minfee 
## Function to Check 35$ min charge waved off in Review Order Page for Wplus User
Params :
Platform: ios - For Android TBD

Name : us.functions.wplus.reviewOrder.chargeWaiveOff-deliveryFromStoreCharges
## Function to Check Delivery charge waved off in Review Order Page for Wplus User
Params :
Platform: ios - For Android TBD

Name : us.functions.wplus.reviewOrder.charges-NonWplus-BelowOrderMinimum
## Function to Check minimum charges applied for non-wplus user if the  Order is <35$ 
Params :
Platform: ios - For Android TBD




## Checkout ##
```
Name: us.functions.checkout.handleCheckoutAlert
Params: N/A
Platform: ios, android
Details: on Review order screen when user select back to dismiss checkout and go back to cart then we can use this function 

Name: us.functions.checkout.reviewOrder.scrollToSection
Params: fulfillmentText [Values : Shipping / Curbside pickup / Delivery from store / Digital delivery]
Platform: ios, android
Details: On checkout page scrolls to and displays the appropriate section irrespective of which order the section are displayed in the page, useful before performing any action on the specific fulfillment section

Name: us.functions.checkout.reviewOrder.verifyCardDetails
Params: fulfillmentText [values: Shipping/Delivery from store/Curbside Pickup/Digital delivery/Auto Care]
Platform: ios, android
Details: On checkout page it validates the display of elements related to the section sent in fulfillmentText variable

Name: us.functions.wplus.reviewOrder.chargeWaiveOffValidation
Params:
1.  [Mandatory]   basketType        -   fcOnly/scOnly/both    [Indicates what type of items are available during checkout to make appropriate validations]
2.  [Optional]    storeOrderType    -   pickup/delivery/none  [Default 'none'] [If store item is available in checkout basket, is it store pickup or store delivery]
Platform: ios, android
Details: 
1. Utility to validate display/non display of waive Off details related to Wplus/other fees in review order page based on checkout total and type of fulfilment items in review order page.
2. Order total amount is automatically calculated based on review order total displayed.

```

## Order Confirmation ##
```
Name: us.functions.orderConfirmation.scrollToSection
Params: fulfillmentText [Values : Shipping / Curbside pickup / Delivery from store / Digital delivery]
Platform: ios, android
Details: On thankyou page scrolls to and displays the appropriate section irrespective of which order the section are displayed in the page, useful before performing any action on the specific fulfillment section

Name: us.functions.orderConfirmation.verifyCardDetails
Params: fulfillmentText [Value: Shipping/Delivery from store/Curbside pickup/Digital delivery/Auto Care]
Platform: ios, android
Details: On order confirmation page it validates the display of elements related to the section sent in fulfillmentText variable

Name: us.functions.wplus.orderConfirmation.chargeWaiveOffValidation
Params:
1.  [Mandatory]   basketType        -   fcOnly/scOnly/both    [Indicates what type of items are available during checkout to make appropriate validations]
2.  [Optional]    storeOrderType    -   pickup/delivery/none  [Default 'none'] [If store item is available in checkout basket, is it store pickup or store delivery]
Platform: ios, android
Details: 
1. Utility to validate display/non display of waive Off details related to Wplus/other fees in order confirmation page based on checkout total and type of fulfilment items in the order.
2. Order total amount is picked up from checkout page before order placement.
```

## Order Details ##
```
Name: us.functions.orderDetails.scrollToSection
Params: [mandatory] ${fulfillmentType} - pickup/shipping ..
Platform: ios, android
Details: Function to scroll for displaying required fulfillment section on screen
```

## Scanner ##
```
Name: us.functions.home.goToScannerFromHome
Params: N/A
Platform: ios
Details: to access Scanner from search bar

```
## Amends ##
```
Name: us.functions.cart.addToExistingOrder
Params: N/A
Platform: ios, android
Details: Add items to existing order we can use this function

Name: us.functions.amend.verify.itemAddedToOrder
Params: N/A
Platform: ios, android
Details: we can use this function to validate ODP after amending order

```

## Cancellation ##
```
Name: us.functions.cancel.orderItems
Params: N/A
1. [mandatory] ${itemTypes} - comma separated items [e.g. sc,fc or sc,fc,mp]
2. [optional]  ${reasonIndex} - 1/2/3/4/5... [default '1'][Cancellation reason selection index]
3. [optional]  ${cancelOrder} - true/false [default 'false'] [flag to indicate if entire order cancelled or item wise cancellation done]
Platform: ios, android
Details: Function to cancel order/items in the order
```

## Returns ##
```
Name: us.functions.returns.itemReturn
Params:
1. [Mandatory]  itemIndex       - Index of item for selection [1 / 2 / 3 ...]
2. [Mandatory]  returnReason    - Damaged / Item damaged / Poor qualty ...
3. [Mandatory]  returnMethod    - Schedule for pickup / Drop off at FedEx / Return by mail / Return at Walmart store
4. [Mandatory]  itemType        - fc/sc/mp
5. [Optional]   returnType      - Refund/Replacement [default 'Refund']
6. [Optional]   replacementType - fast/slow [default 'slow' (To be given only if ${returnType} is 'Replacement')]
7. [Optional]   keepItItem      - keepit/nonKeepit [default 'nonKeepit']
8. [Optional]   cardType        - visa / Electronic Benefit Transfer / solutran (For DS card) / Gift Card
9. [Optional]   tierMsgType     - fast/slow
Platform: ios, android
Details: Return an item from ODP
```

```
Name: us.functions.returns.returnODPValidation
Params:
1. [Mandatory]  returnReviewText - Return by mail / Return to Walmart store / Return scheduled for pickup / Return by drop-off at FedEx
2. [Mandatory]  buttonText       - View label / Show barcode / View instructions / Show QR code
3. [Optional]   cardType         - visa / Electronic Benefit Trasnfer / solutran / Gift Card
Platform: ios, android
Details: Verify successful return initiation for an item
(NOTE): If function 'us.functions.returns.itemReturn' is executed before, all required params will be automatically set
```

## Utilities ##
```
Name: us.functions.utils.getSearchableItem
Params:
1. [Mandatory]  itemType           - [API tags] [Values: FC_DELIVERY / STORE_SCHEDULED_DELIVERY ...]
2. [Optional]   storeId            - (e.g 32144/32135 ...)
3. [Optional]   backupItem         - (Backup item to be used for ATC in case API fetch failed)
4. [Optional]   skipForNext        - [true/false] (Set to true if fetched item needs to be added to the skipped list for the next fetch process)
5. [Optional]   excludeFetchedItem - [true/false] (Set to true if earlier skipped item to be excluded in the current fetch process)
Platform: ios, android
Details: API to fetch inventory available items for ATC

Name: us.functions.utils.astro.setOrderStatus
Params:
1. [Mandatory]  orderNo     -   Order number that has to be moved
2. [Mandatory]  orderType   -   Fulfillment type in the order to be moved
3. [Mandatory]  status      -   To which status the order needs to be moved
Platform: ios, android
Details: Astro API utility to move one fulfillment type at a time in an order to required status. Next Gen (V3) version API is used in this utility.
Refer utility for valid combination of values for orderType & status.

Name: us.functions.utils.astro.setMultilineOrderStatus
Params:
1. [Mandatory]  orderNo       -   Order number that has to be moved
2. [Mandatory]  orderType1    -   Fulfillment type in the order to be moved (1st item)
3. [Mandatory]  status1       -   To which status the order needs to be moved (1st item)
2. [Optional]   orderType2    -   Fulfillment type in the order to be moved (2nd item)
3. [Optional]   status2       -   To which status the order needs to be moved (2nd item)
2. [Optional]   orderType3    -   Fulfillment type in the order to be moved (3rd item)
3. [Optional]   status3       -   To which status the order needs to be moved (3rd item)
Platform: ios,  android
Details: Astro API utility to move multi-fulfillment types parallely in an order to required status. Next Gen (V3) version API is used in this utility.
Refer utility for valid combination of values for orderType1/2/3 & status1/2/3

Name : us.functions.utils.fetchFromDataList
Params:
1. [Mandatory]  itemType  -   tag to identify kind of items to check [e.g. MP_PRO_SELLER / STORE_SCHEDULED_PICKUP/ STORE_SCHEDULED_DELIVERY /STORE_UNSCHEDULED_PICKUP /FC_DELIVERY]
2. [Mandatory] itemList   -   Valid list of items.
3. [Mandatory] emailID    -   email id
4. [Optional] storeId     -   Specific store
Platform: ios,  android
Details : Function to fetch working items from the list of items using checkItemTransactabality API
```
## Walmart + ##
```
Name: us.functions.wplus.changeMembership
Params: annual, monthly
Platform: ios, android
Pre-reqs: User is logged in and on accounts page
Details: Changes membership from annual to monthly and vice-versa. Ignores if the membership to change is already set.
```

```
Name: us.functions.wplus.verifyMembershipDetails
Params: Expiry year, Membership amount
Platform: ios, android
Pre-reqs: User is on the Manage Membership page
Details: Validates the manage membership page
```

```
Name: us.functions.wplus.navigateToManageMembershipFromBenefitsPage 
Params: N/A 
Platform: ios, android
Pre-reqs: User is on the Wplus Benefits page
Details: Clicks on the gear icon to land on Manage Membership page
```

```
Name: us.functions.wplus.cancelFreeTrialOrMembership 
Params: N/A 
Platform: ios, android
Pre-reqs: User is on the Wplus Membership page
Details: Clicks on the cancel free trail or cancel membership link and completes the cancellation lifecycle
```

```
Name: us.functions.wplus.navigateToCancelFreeTrialOrCancelWalmartPlusPageFromMemberShipPage 
Params: N/A 
Platform: ios, android
Pre-reqs: User is on the Wplus Membership page
Details: Clicks on the cancel free trail or cancel membership link and navigates to confirm cancellation page
```

```
Name: us.functions.wplus.cancelConfirmation.verifyCancelFreeTrialOrCancelWalmartPlusDetails
Params: N/A 
Platform: ios, android
Pre-reqs: User is on the Wplus Membership Cancel Confirmation page
Details: Clicks on the cancel free trail or cancel membership link -> navigates to confirm cancellation page -> Verifies the benefits shown on confirm cancellation page
```

```
Name: us.functions.wplus.navigateToCancelFeedbackFreeTrialOrCancelFeedbackWalmartPlusPageFromCancelConfirmationPage
Params: N/A 
Platform: ios, android
Pre-reqs: User is on the Confirm Cancel Confirmation page
Details: Clicks on the cancel free trail or cancel membership link on confirm cancellation page -> navigates to cancellation feedback page
```

```
Name: us.functions.wplus.completeCancelFreeTrialOrCancelWplus
Params: N/A 
Platform: ios, android
Pre-reqs: User is on the Cancellation Feedback page
Details: Clicks on the cancel free trail or cancel membership link on cancellation feedback page -> navigates to benefits page and membership cancelled
```

## GIC

```
Name:  us.functions.gic.changeFulfillment
Params: Shipping, Delivery, Pickup (intent)
Platform: ios
Details: On search page when filtering based on fulfillment type this function should be used
```

## Badging - Save with walmart plus pill
```
Name:  us.functions.wplus.verifySavewithWalmartPluspill
Params: NA
Platform: Android
Details: On search page, verify save with walmart pluss pill for an item
```

```
Name: us.functions.wplus.verifyMyMembershipDetails
Params: tenure and membershipType
Platform: ios
Pre-reqs: User is on the Manage Membership screen
Details: Validates the my membership details on manage membership screen
```

```
Name: us.functions.orderDetails.verifyItemsODP
Params: NA
Platform: ios
Pre-reqs: User is on the ODP
Details: Validates item details present on the ODP
```

```
Name: us.functions.orderHistory.verifyStoreNameandAddress
Params: NA
Platform: ios
Pre-reqs: User is on the ODP
Details: Validates StoreName and StoreAddress details present on the ODP
```

```
Name: us.functions.orderDetails.verifyPickInstructionsOnODP
Params: NA
Platform: ios
Pre-reqs: User is on the ODP
Details: Validates pickup Instructions details present on the ODP

##  Cash Back - Reward Center
```
Name:  us.functions.wplus.cashBack.validateBenefitsDetailPage
Params: NA
Platform: Android
Pre-reqs: User is on the cash back MLP BDP screen
Details: Validaing cash back MLP BDP screen
```

```
Name:  us.functions.wplus.cashBack.validateRewardsCenterScreen
Params: NA
Platform: Android
Pre-reqs: User is on the Rewards Center screen
Details: Validates the rewards center screen details

```

```
Name:  us.functions.wplus.verifyibottaandatc.fromhome
Params: NA
Platform: iOS
Pre-reqs: User is on the Rewards Center screen
Details: This function adds the ibotta eligible items to the cart

```

```
Name:  us.functions.wplus.verifyibottarewardslabels.oncartdetailspage
Params: NA
Platform: iOS
Pre-reqs: User is on the cart page
Details: Validates the item rewards label on the cart detail page

```

```
Name:  us.functions.wplus.verifyibotta.savedrewardspage
Params: NA
Platform: iOS
Pre-reqs: User is on the View all saved rewards page
Details: Validates the saved rewards for the account 

```

```
Name:  us.functions.wplus.verifyibottaandatc.fromhome
Params: NA
Platform: android
Pre-reqs: User is on the Rewards Center screen
Details: This function adds the ibotta eligible items to the cart

```

```
Name:  us.functions.wplus.verifyibottarewardslabels.oncartdetailspage
Params: NA
Platform: android
Pre-reqs: User is on the cart page
Details: Validates the item rewards label on the cart detail page

```

```
Name:  us.functions.wplus.verifyibotta.savedrewardspage
Params: NA
Platform: android
Pre-reqs: User is on the View all saved rewards page
Details: Validates the saved rewards for the account

```

## Relaunch the application(Function name is same for Both ios and Android)
Name: us.test.functions.utils.relaunchApp
Platform: ios

## Terminate and Relaunch the app with the existing activity(Function name is same for Both ios and Android)
Name: us.test.functions.utils.relaunchApp
Platform: ios & android


```
Name: us.functions.tippingAndFeedback.driverTipAmountVerification.on.orderReviewPage
Params:
1. [Mandatory]  lessThan35Dollars       - Verifies the Driver tip amount Verification for order < 35$
2. [Mandatory]  greaterThan35Dollars    - Verifies the Driver tip percentage Verification for order > 35$
   Platform: ios, android
   Details: Verifies the Driver tip amount for order < 35$ and Driver tip percentage Verification for order > 35$ on Order Detail page.
```

```
Name: us.functions.tippingAndFeedback.purchase.verification.for.driverTip
Params: None
   Platform: ios, android
   Details: Verifies the Driver tip amount/percentage selection for order < 35$ and for order > 35$ on Purchase history -> View order details page.
```

```
Name: us.functions.cashback.bottomscreen.freetrial.signup.and.verification
Params: 
1. [Mandatory]  Annual       - Selects the Annual trail Option for membership enrollment.
2. [Mandatory]  Monthly    - Selects the Monthly trail Option for membership enrollment.
Platform: android
Details: Verifies the CashBack BottomSheet/SplashScreen and enrolls the non-member into either Annual/Monthly plan.
```

# Authentication
```
Name: us.functions.global.authentication.signInAccount.via.emailOTP
Params:
1. [Mandatory]  email       - Customer email to which the email will be sent with OTP details.
   Platform: android
   Details: Which takes the customer email, generates the OTP and uses that to login which makes the internal API call "us.functions.utils.astro.fetchPasscode.emailOTP".
```

# Authentication
```
Name: us.functions.global.authentication.signInAccount.via.phoneOTP
Params:
1. [Mandatory]  email       - Customer email from which it takes the phone number and OTP will be sent.
   Platform: android, ios
   Details: Which takes the customer phone number, generates the OTP and uses that to login which makes the internal API call "us.functions.utils.astro.fetchPasscode.phoneOTP".
```