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

### Dispense Feature


## Future Work


