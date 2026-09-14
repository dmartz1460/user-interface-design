# Smart Bank UI Design

## Table of Contents

- [Overview](#overview)
- [Pre-Design Requirements Gathering](#pre-design-needs-gathering)
  - [Affordances and Physical Properties](#affordances-and-physical-properties)
  - [Assumptions](#assumptions)
  - [User Needs](#user-needs)
  - [Design Requirements](#design-requirements)
- [Interface Sketching](#interface-sketching)
- [User Feedback Evaluation](#user-feedback-evaluation)

## Overview

This document outlines the full design process for the `Smart Bank UI`. This process covers the following:
- Affordances and physical properties
- User needs
- Assumptions
- Design requirements
- Interface sketching
- Evaluation through user feedback

## Pre-Design Requirements Gathering

This section covers the initial gathering of design needs and requirements of the user. Based on the affordances and physical properties of the Smart Bank, users were interviewed to gather needs and requirements that the UI will address. Assumptions are also made based on the physical and mechanical capabilities of the Smart Bank to provide background for the primary use of the UI. As a result, final design requirements were made to cover all pre-design needs.

### Affordances and Physical Properties

| **Physical Properties**  | **Affordances** | **Signifiers** | **Constraints** |
| ------------------------ | --------------- | -------------- | --------------- | 
| Stands on a table | numpad to enter pin | Arrows to signal direction of a button or swipe action | Greyed out buttons to indicate unavailble selections | 
| Small object | Graphics to indicate capacity and contents | Text on buttons its action | 
| Coin Sensor | Menu icon to present available screens | Insertion slot signals where coin shall be inserted | 
| Coin Dispensor | At-a-Glance/Lock screen for quick info | Dispensor tray to signal where coins will be dispensed |
| 10 Custom Currency Partitions | Prompt to signal swipe up action to unlock screen |
| Two Displays (front and side) | Arrows to select number and letter characters |
| Storage paritions for each coin type | Touch display to interact with UI |
| Coin insertion slot | Back arrows to navigate to previous screen |
| | Enter and Cancel keys to finalize or cancel choices | 

### Assumptions

The following assumptions were made about Mechanical and Electrical properties of the Smart Bank

- includes a `sensor` to detect which coin was inserted
- is capable of `mechanically dispensing` coins
- is capable of sensing the current `capacity` of the bank
- powered with wall outlet
- `no connecticity` capabillities
- capable of storing currency types such as `cash` and `gift cards`
- incapable of sensing or dispensing `cash` and `gift cards`

### User Needs

Three separate individuals were asked a series of questions to gather user needs and requirements of the UI. They were presented with the [assumptions](#assumptions) about the properties of the Smart Bank to provide context. The responses to these questions were used to finalize the design requirements based on their needs.

```
1. How do you currently manage loose change, cash, or gift cards that you accumulate at home?
- Where do you typically store them?
- How often do you interact with or spend them?
- Do you have any frustrations with how you currently handle this?
    * Person 1: change in a drawer, does not carry cash, wallets not designed for coins 
    * Person 2: change in glass jar, cash in wallet, wallet not designed to carry coins
    * Person 3: keep loose change in car, cash in wallet ot ATM if full, center console

2. Think about a time when you wanted to save up for a specific, small physical item. How did you track your progress?
- Did you use physical money, digital tools, or a mix of both?
- How did you stay motivated?
    * Person 1: online banking, excel sheet, no motivation, budgeting
    * Person 2: online banking, no motivation
    * Person 3: budgeted to buy a dog and a student budget, digital banking

3. If you had a dedicated physical device for storing money, what kind of information would you want to see on it at a glance?
- Would you prioritize the total amount, progress toward a specific goal, or something else?
    * Person 1: total sum, deeper menu to display coin counts
    * Person 2: total sum, friendly reminders for goals, deeper menu to display counts
    * Person 3: total value on value screen, how many of each currency type, click prompts password to navigate to home screen

4. If you wanted to store any other forms of currency in this device (eg. cash, giftcards), but it couldn't automatically detect them, how would you prefer to keep track of their value?
- Would you be willing to manually enter the value using a dial or buttons?
    * Person 1: name and custom value, user friendly entering
    * Person 2: dropdown, default values to enter ($1, $5, $20), user friendly entering
    * Person 3: prompts to enter custom cash values, gift cards track name and value

5. If the internal coin storage were getting full, how would you expect the device to communicate that to you?
- What would a capacity indicator look like to you?
- Would you expect a visual warning on the screen or a sound if capacity were close to its max?
    * Person 1: capacity warning, half, full, medium
    * Person 2: capacity warning, no distractions
    * Person 3: capacity in the same screen with coin types, (Your Bank screen), (eg. x/25 quarters)

6. Imagine you wanted to take out some money from the device. How would you expect to make that request?
- Would you request a dollar amount or coin type?
    * Person 1: like an ATM, shortest path
    * Person 2: like ATM, withdrawl menu, select bills or coins
    * Person 3: select bills and change to dispense based on the total to dispense, only display options that are available to dispense. arrows to select amount

7. Is there anything else you would expect a modern, nightstand savings device to do that we haven't discussed?
- Any concerns about security, or accessibility?
    * Person 1: why is this not connected and no app is available? pin key, secondary physical key available
    * Person 2: pin code, sleep mode, single touch wakes the device
    * Person 3: pin code to withdrawl, separate screen for each action (dispense, insert, Your Bank info), button to unlock from home screen

```

### Design Requirements

The following design requirements were made based on user reponses and object properties above:

- `REQ-01`: The system shall prompt for a password pin to unlock the device.
- `REQ-02`: The system shall allow custom currency to be tracked using its type/name, and value.
- `REQ-03`: The system shall track coin data such as coin type, value, total count in physical amount, and currency amount.s
  * **03.a**: Upon insertion of a coin, the system shall display a pop-up to notify the user of the inserted coin along with its current count and capacity.
- `REQ-04`: The system shall have a lock screen to display an *"At a Glance"* view of the bank.
    * **04.a**: The lock screen shall display basic information such as total amount and time.
    * **04.b**: The lock screen shall prompt the user for an action to unlock the device.
- `REQ-05`: The system shall contain a source of navigation to external screens.
- `REQ-06`: The system shall contain a secondary display on the side of the device to act as a reactive and informative display.
- `REQ-07`: The system shall be capable of dispensing a user selected currency value.
    * **07.a**: The user shall have the ability to select the cash or coin types to dispense that add to the dispensed value.
    * **07.b**: The system shall prompt the user for a pin code to proceed with a dispense action.
- `REQ-08`: The system shall track current capacity of the bank.
    * **08.a**: Capacity of each coin type shall add up to a calculated total capacity of the bank.
    * **08.b**: A warning indicator shall be present on the screen to notify the user if coin capacity is within 10% of the maximum value.
- `REQ-09`: The system shall have a way to track a small financial goal and display progress on the lock screen.
    * **09.a**: The user shall be able to create, edit, delete any parameters to the goal.


## Interface Sketching

## User Feedback Evaluation

