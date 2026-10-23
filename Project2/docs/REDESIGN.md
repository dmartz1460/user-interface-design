# Redesign

- [Overview](#overview)
- [Initial Design Analysis](#initial-design-analysis)
    - [Design Flaws](#design-flaws)

## Overview

This document covers the following topics:
- Initial observation of design flaws
- User Feedback
- Redesign target
- Redesign decisions
- Redesign feedback

## Initial Design Analysis

### Design Flaws

`Guest View`

Upon entering the 25Live dashboard, a user is considered a guest and is presented with a restricted view of the dashboard screen. As a user of 25Live, I am most likely a student or faculty member of the University of Cincinnati as a user cannot perform any actions within the dashboard without signing in with UC credentials. Once signed in, the user is unable to perform a sign-out action. This makes the guest view obsolete.

`Choice of Icons`

The design choice of the icons representing `Events`, `Organizations`, `Locations`, and `Resources` are poor as they have now universal meaning behind them in a general sense to the user. 

<p align="center">
  <img src="icons.png" width="250px"></img>
</p>

`Dashboard Organization`

Upon entering the dashboard screen, the user is presented with a wide range of unnecessary dropdown menus pertaining to a user's events, resources, etc. The user has the ability to move these dropdown menus around the screen and add/remove dropdown menus to provide customizability. If the design goal was to provide enhanced customization to the user, the designer failed to consider that these options come with increased complexity to what the user should have control of. 

<p align="center">
  <img src="customization.png" width="650px"></img>
</p>

`Menu Options`

In addition, the menu dropdown in the dashboard provides additional methods of traveling to the same screens that the dashboard menu dropdowns provide. As a result, this design lacks simplicity of providing the shortest path to an option screen from the dashboard. For the case of the `Reports` screen, a user is able to travel to that screen using two different buttons from the menu creating unnecessary redundancy.

<p align="center">
  <img src="menu.png" width="200px"></img>
</p>

`Search Options`

Searching 25Live can be done with the following options:
- Click on the `Go to Search` at the top of the dashboard.
- Click on `Search` under the menu
- Click on one of the following menu options for a targeted Search
    - `Availability`
    - `Calendar`
    - `List`
- Use the `Quick Search` dropdown

If the goal of these options was to provide enhanced filter methods of searching, this goal is achieved. However, it comes at the expense of simplicity to access these methods.

<p align="center">
  <img src="search_options.png" width="650px"></img>
</p>

### User Feedback of Current Design

### Redesign Target

## Redesign Decisions

### User Feedback of New Design