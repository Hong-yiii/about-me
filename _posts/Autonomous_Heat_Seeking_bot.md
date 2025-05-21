---
title: "Autonomous Heat-Seeking Bot"
excerpt: |
  Built a fully autonomous robot using ROS2, capable of navigating a maze, detecting thermal sources, and launching projectiles. The system integrated pathfinding and heatsensing together with mechanical flywheels.
coverImage: "/assets/blog/Autonomous_Heat_Seeking_bot/coverpic.png"
date: "2025-05-15T10:00:00.000Z"
author:
  name: ROS2, NAV2, LIDAR, Thermal Vision
  picture: "/assets/blog/authors/2310teampic.jpeg"
ogImage:
  url: "/assets/blog/Autonomous_Heat_Seeking_bot/coverpic.png"
---

# **Autonomous Heat-Seeking Bot: Thermal Target Engagement under Constraints**

This project documents the design, development, and deployment of an autonomous mobile robot capable of exploring an unknown indoor maze, identifying heat sources, and launching a projectile at them using a dual-flywheel mechanism.

Inspired by real-world thermal response scenarios (disaster rescue), the bot was designed for full autonomous functionality.

---

## Our Robot

<div style="text-align:center;">
  <iframe 
      width="100%" 
      height="480" 
      style="border:1px solid #cccccc;" 
      src="https://3dviewer.net/embed.html#model=https://raw.githubusercontent.com/Hong-yiii/CDE2310_System_Design/main/CAD/turtlebot%20with%20launcher.STL$camera=93.42291,-333.17682,179.88174,93.73459,187.34505,-94.63919,0.00000,1.00000,0.00000,45.00000$projectionmode=perspective$envsettings=fishermans_bastion,off$backgroundcolor=255,255,255,255$defaultcolor=200,200,200$defaultlinecolor=100,100,100$edgesettings=off,0,0,0,1">
  </iframe>
</div>

### Final navitgation run at 4x speed
<div style="display: flex; justify-content: center; margin: 2em 0;">
  <video width="640" height="360" controls style="border: 2px solid #ddd; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <source src="/assets/blog/Autonomous_Heat_Seeking_bot/Final_run.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>



## 🔧 **Key Features**

- **ROS2-based Modular System**  
  Leverages Nav2 for exploration, MPPI for local control, and custom Python logic for mission flow.

- **Thermal Detection & Localization**  
  Dual AMG8833 sensors fused with LIDAR to precisely locate and track heat sources.

- **Autonomous Target Engagement**  
  Flywheel launcher actuated at runtime using servo-driven rack-and-pinion feed.

- **Real-Time Decision Logic**  
  FSM architecture using multi-threaded execution (fast sensor loop + slow decision loop).

---

## 📷 **System Overview**

![System Diagram](/assets/images/general_system/System_Diagram_2310.drawio.png)

Each subsystem is orchestrated via a centralized `GlobalController` node:

- State-driven transitions (Exploration → Goal Nav → Launching)
- IMU-based ramp detection & hazard avoidance
- Heat clustering via KMeans
- Visualization via RViz Markers

---

## 🚀 **Mission Pipeline**

1. **Mapping**:  
   Navigate maze autonomously using LIDAR + SLAM.  
2. **Heat Detection**:  
   Thermal data processed & filtered to detect anomalies.  
3. **Localization**:  
   LIDAR returns from angular bins are fused with robot pose to get (x, y) coordinates.  
4. **Clustering**:  
   KMeans clustering reduces noise and sets launch targets.  
5. **Engagement**:  
   Robot drives to each heat source, aligns, and fires.


## 📎 **Project Links**

<div style="margin-bottom: 1.5em;">
  <strong>Want to see the full breakdown?</strong><br>
  <br>
  <a href="https://hong-yiii.github.io/CDE2310_System_Design/" 
     target="_blank" 
     rel="noopener noreferrer" 
     style="color: #0066cc; text-decoration: underline; font-size: 1.1em;">
    🌐 Full Project Site
  </a>
</div>

<div>
  <strong>Explore the code and documentation:</strong><br>
  <br>
  <a href="https://github.com/Hong-yiii/CDE2310_System_Design" 
     target="_blank" 
     rel="noopener noreferrer" 
     style="color: #0066cc; text-decoration: underline; font-size: 1.1em;">
    🔗 GitHub Repository
  </a>
</div>

---

## 🧠 **What I Learned**

- Multi-threaded execution in ROS2
- Sensor fusion with LIDAR and thermal IR
- Mechanical debugging under tight tolerances
- Designing for power and compute limits (Raspberry Pi 4B)
