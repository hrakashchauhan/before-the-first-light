# 46 — Bicycle Controls and Navigation Specification

**Project:** BEFORE THE FIRST LIGHT  
**Date:** 2026-11-21  
**Author:** Character & Animation Engineer (Expert 04), Three.js Graphics Engineer (Expert 02)

---

## 1. 3D Bicycle Geometry & Design

The bicycle is designed as an authentic Indian village single-speed roadster (modelled with Three.js procedural geometry):
- **Frame:** Classic double-diamond tubular steel frame in dark enameled black (`#1c1c1c`).
- **Wheels & Tyres:** Dual 28-inch spoked wheels, silver chrome rims (`#d4d4d4`), and textured rubber tyres (`#121212`).
- **Handlebars:** Swept-back chrome roadster handlebars with rubber grips and a shiny polished brass bell on the left grip.
- **Seat & Carrier:** Sprung black leather saddle; heavy-duty rear tubular luggage carrier for transporting ritual items (soop, daura, and sacred materials).
- **Drive Train:** Chrome crankset, chain ring, chain guard, and dual rotating pedals.
- **Kickstand:** Central spring-loaded stand that pivots down to support the parked bicycle and retracts when mounted.

---

## 2. Player State Machine & Movement Modes

The player exists in one of the following mutually exclusive movement modes:
1. `walking`: Free pedestrian locomotion via WASD/Arrows. Can interact with household items, characters, and props.
2. `approaching-bicycle`: Player is within 1.8 metres of a parked bicycle. Proximity prompt `[E] Mount Bicycle` is active.
3. `mounting`: Kinematic transition (0.5s duration) where the player steps over the frame, aligns with saddle/pedals, kickstand retracts, and camera pulls back to a riding offset.
4. `riding`: Arcade vehicle physics active. Forward acceleration via `W`, steering via `A`/`D`, braking via `Space` / `S`, bell ring via `B`.
5. `braking`: Friction deceleration applied. Brake squeal / friction SFX active.
6. `parked`: Bicycle is stationary with kickstand lowered, persisting at its real-world coordinates.
7. `dismounting`: Player brings bicycle to a stop (<0.5 m/s), presses `[E] Dismount`. Character steps off to the left side, kickstand deploys, and walking mode resumes.
8. `interacting`: Engaged in dialogue or ritual gesture.

---

## 3. Vehicle Physics & Handling Tuning

| Parameter | Value | Rationale |
|---|---|---|
| **Max Speed** | 5.8 m/s (~21 km/h) | Realistic village cycling pace on unpaved dirt lanes. |
| **Acceleration** | 3.2 m/s² | Smooth, measured start from standstill. |
| **Braking Deceleration** | 7.5 m/s² | Responsive stopping without instantaneous jarring halts. |
| **Turning Radius / Rate** | 2.4 rad/s | Realistic wide turning radius preventing unrealistic 180° pivots. |
| **Max Lean Angle** | 0.16 rad (~9.2°) | Subtle visual lean of rider and frame into turns. |
| **Pedal Cadence** | `speed * 3.8` rad/s | Pedal crank rotation directly synchronized with forward velocity. |
| **Wheel Spin** | `speed / wheelRadius` | Wheel and tyre rotation perfectly matched to ground distance. |
