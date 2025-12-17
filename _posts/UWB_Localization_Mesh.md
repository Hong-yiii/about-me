---
title: "Building a UWB Localization Mesh"
excerpt: "Employed sensor-fusion using pose graph optimization, allowing multiple UWB sensors to achieve high accuracy user positioning."
coverImage: "/assets/blog/UWB_Localization_Mesh/High_Level_Architecture.png"
date: "2025-12-17T05:35:07.322Z"
author:
  name: Hong Yi, Ji Yong, Anitej
  picture: "/assets/blog/authors/Location_intelligence_Team.png"
ogImage:
  url: "/assets/blog/UWB_Localization_Mesh/High_Level_Architecture.png"
---

# UWB Localization Mesh for Spatial Audio

In collaboration with Bang & Olufsen, we built a **UWB (Ultra‑Wideband) localization middleware** that turns raw, noisy RF ranging measurements into a **live, high‑resolution 2D position** of a listener moving through their home. The goal was simple but demanding: make high‑end speakers feel “aware” of where you are, allowing us to power novel user experiences.

Instead of treating UWB as a single device feature, the project leverages the distributed speakers to form a **localization mesh**. A pose‑graph optimization backend fuses Time‑of‑Flight (ToF) and Angle‑of‑Arrival (AoA) measurements from multiple anchors, rejects bad data in real time, and outputs a smooth, globally consistent user pose.

The end result is a middleware layer that:

- **Improves positioning accuracy by ~32%** over a single‑anchor baseline  
- **Reduces mean error by 3–4×** through multi‑anchor fusion and outlier rejection  
- **Delivers sub‑20cm accuracy**, robust enough for real‑time UX like follow‑me audio sweet spots

---
## Why build this software?

Our middleware acts as a **spatial “truth layer”** that any application can subscribe to:

- Audio engines can place the listener in a virtual soundstage and **steer sweet spots** dynamically.
- Multi‑room controllers can **crossfade between speakers** as you walk between zones.
- Future apps—AR, gaming, asset tracking—can all share the **same precise indoor coordinate frame**.


Here's a demonstration of the middleware in action, showing real-time tracking of user movement with sub-20cm accuracy:

<video controls style="max-width: 720px;">
  <source src="/assets/blog/UWB_Localization_Mesh/raw_data_render.mp4" type="video/mp4">
</video>

---

## System Architecture: Three-Layer UWB Middleware

At a high level, the system is split into three layers: **Edge**, **Communication**, and **Processing**.

![High Level Architecture](/assets/blog/UWB_Localization_Mesh/High_Level_Architecture.png)

### 1. Edge Layer — Anchors and Raw UWB Sensing

The edge layer consists of multiple ceiling‑mounted UWB anchors:

- **NXP Qorvo Type‑2BP UWB modules** provide ToF and AoA measurements to a mobile device (e.g. iPhone).
- Each module is attached to a **Raspberry Pi 4B** that:
  - Configures the UWB radio
  - Reads raw measurements
  - Packages them into well‑defined messages for the network
- **45° ceiling mounts** are used to maximize coverage and signal quality across the listening area.

Each anchor is intentionally **stateless** beyond its own health and calibration; all global reasoning happens upstream.

### 2. Communication Layer — MQTT Pub/Sub Mesh

To keep anchors loosely coupled, we use an **MQTT publish–subscribe architecture**:

- Each anchor publishes measurement packets (ranges, AoA, timestamps, anchor ID) to topics on a **central MQTT broker**.
- The broker runs on a **central processing server** and can span:
  - Single‑room deployments (e.g. 4 anchors in a living room)
  - Multi‑room setups with MQTT bridging and additional anchors
- New anchors can be added or removed **without changing the core server code**—they just start publishing to the right topics.

This decoupling makes the system **scalable and resilient**: if one anchor loses line of sight or goes offline, others continue to contribute cleanly.

### 3. Processing Layer — Pose Graph Optimization Engine

The processing layer is where noisy, partial measurements become a **clean global pose estimate**:

![Detailed System Architecture](/assets/blog/UWB_Localization_Mesh/Overall_detailed_system_arch.png)

The pipeline:

1. **Data Ingestion**  
   MQTT clients subscribe to anchor topics and ingest raw UWB measurements.
2. **Preprocessing & Outlier Rejection**  
   Statistical filters reject obviously wrong readings (~10% of data), preventing single bad measurements from corrupting the estimate.
3. **Sliding Window Smoothing**  
   A ~2‑second **sliding window** averages measurements, trading negligible latency for a large drop in noise.
4. **Pose Graph Optimization (PGO)**  
   - Anchors and the user device are modeled as **nodes** in a pose graph.  
   - Ranging/AoA measurements become **edges** with associated noise models.  
   - The optimizer adjusts node positions to **minimize the global residual error** across all edges.
5. **Dynamic Anchor Gating**  
   Anchors with consistently high variance are **temporarily disabled** so they stop polluting the global solution.
6. **Real-Time Position Output**  
   The system publishes a time‑stamped user pose (and uncertainty) for any downstream applications to consume.

This design gives us:

- **Accuracy:** Multi‑anchor fusion and PGO shrink error by 3–4×.  
- **Stability:** Sliding windows and outlier rejection kill jitter and wild spikes.  
- **Robustness:** Dynamic gating handles sick anchors gracefully, rather than collapsing the entire estimate.

---

## Algorithms and Performance: Making UWB Actually Useful

Raw UWB is messy: multipath, occlusions, and orientation‑dependent nulls can all blow up individual range estimates. The middleware is intentionally conservative:

- **Sliding window averaging** smooths high‑frequency noise without sacrificing responsiveness.
- **Outlier rejection** drops the worst ~10% of measurements before they reach the optimizer.
- **Dynamic anchor disabling** removes anchors whose variance spikes beyond configured thresholds.

Across multiple phone orientations, we consistently see:

- **~32% accuracy improvement** vs. the worst‑anchor baseline  
- **Tighter error bars** as more anchors are added (from 1 to 4), with standard error shrinking significantly

In practice, this means the user’s icon on a floor‑plan view **stays glued to where they actually are**, instead of jumping around as RF conditions change.

---

## Application Layer: Turning Coordinates into Experiences

Once you have a robust, real‑time position stream, you can start asking a much more interesting question:  
**“What should the system do because the user is *here* right now?”**

### Adaptive Multi-Room Speaker Handover

In a multi‑room deployment:

- The house is partitioned into **zones** (e.g. living room, kitchen, hallway).
- As the user crosses zone boundaries, the controller:
  - Crossfades audio between speakers
- From the user’s perspective, **the music simply follows them** without taps, pairing, or manual device switching.

### Zone-Based Audio Interfaces

We also built a **zone‑based audio demo**, where each area has its own playlist or profile:

<video controls style="max-width: 720px;">
  <source src="/assets/blog/UWB_Localization_Mesh/sample_application.mp4" type="video/mp4">
</video>

Walking between zones becomes a kind of **spatial interface**—your location is effectively an input modality that the system can react to.

Beyond audio, the same middleware can power:

- **Smart home automation** (lights, HVAC, security reacting to fine‑grained occupancy)  
- **AR overlays** that stay locked to the room, not just to the device  
- **Indoor asset tracking** and navigation in more industrial environments

---

## Engineering the Middleware: From Test Rig to Python Packages

To validate the system, we built a **repeatable test rig** in a controlled environment:

- Four ceiling‑mounted UWB anchors in a rectangular configuration  
- Precisely measured test points and device orientations  
- Systematic sweeps of:
  - User position within the grid
  - Device orientation (portrait/landscape, camera up/down, etc.)

This setup made it possible to:

- Compare **raw anchor coordinates** vs. **fused PGO output**  
- Quantify error reduction and stability across orientations  
- Tune filters, sliding window sizes, and anchor‑gating thresholds

On the software side, the middleware is packaged into **clean, side‑effect‑free Python modules**:

- **Hardware client/server** for UWB + MQTT  
- **Localization algorithms** implementing PGO and filters  
- **Visualization + widgets** for real‑time monitoring and app prototyping

Bringing up a full system is intentionally simple—configure MQTT, start the server, and subscribe to the user pose stream from any application process.

---

## What I Took Away

This project sits at the intersection of **embedded sensing, real‑time networking, probabilistic optimization, and UX design**. A few key lessons:

- **Good UX needs good priors:** Without a robust spatial truth layer, even the best audio UX ideas fall apart in practice.  
- **Multi‑anchor fusion > clever single‑device tricks:** Once we embraced the “mesh” mindset, accuracy and reliability jumped.  
- **Architecture is a product decision:** The three‑layer design (Edge → MQTT → PGO) wasn’t just neat engineering—it made the system deployable, debuggable, and ready for future applications beyond audio.

Most importantly, the work turned UWB from a **spec sheet bullet point** into a **platform capability**: a middleware layer that B&O (or any developer) can build rich, location‑aware experiences on top of.


## Full Project Documentation

For comprehensive technical details, you can view the complete project documentation and demos on the GitHub Pages site:  
**[View Full UWB Localization Mesh Project](https://hong-yiii.github.io/uwb-localization-mesh/)**

### Download Final Report

The complete final report is available for download, this breaks down the entire project as well as the data collection, validation and iterative design process:  
**[Download IS313 Final Report PDF](/assets/blog/UWB_Localization_Mesh/IS313_Final_report.pdf)**


