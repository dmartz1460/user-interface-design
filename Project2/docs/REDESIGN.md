# Redesign

## Overview

This document covers the following topics:
- Initial observation of design flaws
- Observational feedback from various users
- Redesign target
- Redesign decisions
- Redesign feedback

## Redesign Research

### Design Flaws

`Guest View`

Upon entering the 25Live dashboard, a user is considered a guest and is presented with a restricted view of the dashboard screen. As a user of 25Live, I am most likely a student or faculty member of the University of Cincinnati as a user cannot perform any actions within the dashboard without signing in with UC credentials. Once signed in, the user is unable to perform a sign-out action. This makes the guest view obsolete.

`Choice of Icons`

The design choice of the icons representing `Events`, `Organizations`, `Locations`, and `Resources` are poor as they have now universal meaning behind them in a general sense to the user. 

![alt text](icons.png)

`Dashboard Organization`

Upon entering the dashboard screen, the user is presented with a wide range of unnecesary dropdown menus pertaining to a user's events, resources, etc. The user has the ability to move these dropdown menus around the screen and add/remove dropdown menus to provide customizability. If the design goal was to provide enhanced customization to the user, the designer failed to consider that these options provide increased complexity to what the user should have control of. 

In addition, the menu dropdown in the dashboard provides additional methods of travelling to the same screens that the dashboard menu dropdowns provide. As a result, this design lacks simplicity in providing the shortest path to an option screen from the dashboard.

![alt text](dashboard.png)

### Observational Study Setup

**Research Goals:**

- Assign users with "challenges" that they must solve by using 25Live
- Diagnose problems with 25Live by observing how users solve the presented challenges and what struggles they encounter
- Document struggles to influence redesign

**User Challenges:**

Each study participant will be observed solving the following 2 challenges:

1. Schedule an event in Langsam 520 for the earliest timeslot available. Once it is scheduled, cancel the booking.
2. Schedule an event for 11/01/2026 at 5 p.m. in any available space. The space must be able to be scheduled without providing a sponsoring organization. (The user does not need to actually schedule the event. Rather, go through the steps as if they were to schedule. This is to prevent reserving a room that someone else may actually need.)

Watch as the user solves these challenges. Have them think aloud and express any problems they encounter or confusion they may have. If the user has never used 25Live before, there will be a learning curve. For example, they may not know where to start, where to find things, etc. Having them express this in real-time will be useful for diagnosing UI learnability issues.

**Potential Issues:**

While solving these challenges, the user may encounter the following problems:

1. Using express scheduler, it may be difficult to find the earliest available timeslot for a location. Challenge 1 may require the user to use the search tab instead.
2. The user may not be able to delete their reservation.
3. For challenge 2, if the user uses the search tab, they may attempt to schedule rooms not available via the express scheduler, which will bring them to the Event Wizard and require a sponsoring organization. They would have to click through rooms 1 by 1 until they find one they can schedule. If they user the express scheduler in the dashboard, this challenge will be easy.

### User Feedback of Current 

### Redesign Target

## Redesign Decisions

### User Feedback of New Design