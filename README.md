# Technical test

## Goal

The goal of this test is to evaluate your skills as a senior frontend engineer.  
Your delivery will be reviewed by two of our engineers and will mainly serve as material for discussion during the technical interview.

## Business Context

**Transmission System Operators (TSOs)** are responsible for balancing the electricity grid.  
When there is an imbalance (e.g. consumption > production), a TSO can ask Flexcity to help restore balance. This request is called an **activation**.

To respond to an activation, Flexcity can control certain **assets** (consumption or production sites) by turning them on or off.

An **asset** is defined by:
* `code`: unique string
* `contact`: object with `email` and `phone`

**Nominations** represent the **capacity and availability** of an asset to contribute to balancing the grid on a given date.  
Each nomination contains:
* a **volume** in MW (positive or negative),
* a **price** representing the tariff of this capacity for that day.

## Existing Project

The provided project is 2 years old and implements a simple CRUD for assets:

* Create an asset
* List assets (with filtering and pagination)
* Read asset details
* Update an asset
* Delete an asset

This project has intentionally been left “as is”: it will be the starting point for the test.

## Your Mission

You are asked to implement a **calendar view for nominations** within this legacy project.  
As the business grows, this project is expected to become a **pillar** of the company’s platform.

### Objectives

1. **Understand & audit** the existing codebase.
2. **Calendar View** (new feature):
    * Display a monthly view of assets and their nominations.
    * Provide an optional month selector (default = current month).
    * For each asset, display its nominations (volume, price) on the corresponding dates.
    * Ensure clear UX for days without nominations.
3. **Plan for the future**:
    * Refactor where needed to implement the new feature cleanly.
    * Prepare a **battle plan** of the things that should be done to bring this project up to state-of-the-art frontend development.

### What we evaluate

👉 Your ability to implement a new feature cleanly while working within a legacy project.  
👉 How you handle technical debt and plan to reduce it.  
👉 Your **technical reasoning** and ability to justify decisions.  
👉 The deliverable is as important as the discussion we will have in the technical interview.

### Constraints / Freedom

* You are **free to modify absolutely anything** in the project: code structure, technology choices, dependencies, formatting, UI/UX, etc.
* The API implementation in `server.js` can be left “as is” — after all, this is a frontend test, not a backend one 😉.

## Delivery

Send back a link to your git repository once the work is done 😉.
