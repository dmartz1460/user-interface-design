# Implementation

## Table of Contents

- [Overview](#overview)
- [Svelte Architecture](#svelte-architecture)
- [Navigation](#navigation)
- [Features](#features)
- [Future Work](#future-work)

## Overview

The purpose of this document is to detail the implementation decisions for the functionality of the Smart Bank's UI. It will cover decisions regarding the following: 
- Svelte Architecture
- Navigation
- Features
- Future Fmplementation

## Svelte Architecture

The software architecture of the Smart Bank UI is governed by the use of Svelte's ability to track the current `state` of a variable. The various screens in the UI are controlled using a state machine held in the root svelte component called `Control` with each screen hosted in its own component under `src/screens`. The variable state of the `activeScreen`, `ReactiveDisplay`, and `Testing-UI` objects are wrapped in the primary `bank-app (<main>)` HTML element in the index.HTML file. In addition, the Smart Bank's style sheet is strictly hosted under `bank.css`. Scripts for each component are held within their respective files.

## Navigation

Navigation of the Smart Bank's UI came to the decision to use menu selection or buttons to navigate screens. Since there are only 4 additional screens from `Home` which acts as an `At-a-Glance` screen for each feature, it was decided to use buttons underneath each At-a-Glance window to signal the user that additional features and options for the window reside on an additional screen. In additon, those who were interviewed requested that additional info about the contents of the bank should reside in a deeper menu screen. This screen is found under the `Your Bank` button which also acts as the header of the `Home/At-a-Glance` screen.

To unlock the screen, an `Unlock` button was used instead of the traditional swipe-up action used by many smart devices since this device will most likely be used by children learning to bank. `Enter` and `Cancel/Back` buttons were also chosen over arrows to signal the action of the button. 

## Features

The primary features of the Smart Bank's UI are the following:
- Ability to track current capacity, coin counts, goals, custom entries
- Pinpad to provide security 
- Control display for primary device interaction
    - Touch screen HMI
- Secondary/Reactive display to provide additional reactive features
    - Popups to signal dispense and insertion actions
    - Capacity indication
- Warning indicators when capacity is near full

### Security

In order to unlock the Smart Bank from its lock screen, the user must select the unlock button to proceed to the `Pinpad` screen. There, the user must type in the correct pin code using a pinpad. Dots are used to indicate the number of digits in the pin and the number of digits currently entered. If the user enters the wrong pin, an `Incorrect Pin` prompt appears. 

### Banking

The additional features included in the Smart Bank that are absent from a standard piggy bank are the following: 
- ability to detect current capacity, balance, coin counts
- ability to autonomously dispense a desired amount
- financial goal tracking
- custom currency tracking (cash, gift cards)

### Dispensing

Instead of typing in a dispense target using a pinpad, control over what coins are dispensed were given to the user with arrow selection. Arrows were placed above and below each coin type and to the left and right of the dispense target. The arrows closest to the dispense target allow the user to increment the target by $1.00 using the highest available coin value (eg. 4 quarters if 4 quarters are available). If selection is unavailable for a certain type (eg. out of quarters), the arrow is disabled and greyed out.

### Reactive Display

The reactive display provides a secondary interface that the user will use to monitor the current state of the bank. This display will react to coin insertions by signaling the user of how many coins were inserted through a pop-up window. The same window is also used to signal the user of current balance and how many coins were dispensed.

Current capacity is also constantly displayed to the user and will react to any insert or dispense action.

## Future Work

At this point in the project, custom currency entries and financial goal tracking are absent from the interface. These features would be implemented in the future to fulfill the design requirements. 

Future features that need requirements and user needs would be the following: 
- Clock feature set
    - Alarm clock
    - Always-on time displayed with Secondary Display
- Wake device upon a press of the Control Display

## AI Usage 

The use of AI in this project came strictly for coding/syntax purposes. Inline suggestions with GitHub Copilot in VS-Code were used to assist the programming of this project. AI was also used to help draft interview questions through an experiement to determine the quality of its output. 
