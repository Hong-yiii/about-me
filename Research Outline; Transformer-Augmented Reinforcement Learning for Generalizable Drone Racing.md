***


## 1. Background and Motivation

### 1.1 Context
The 2023 *Nature* paper **"Champion-Level Drone Racing Using Deep Reinforcement Learning (Swift)"** demonstrated that an autonomous system trained with **deep reinforcement learning (RL)** could outperform world champion human pilots in first-person-view (FPV) drone racing. The key achievement was the transfer of a **policy trained entirely in simulation** to the **real world**, relying only on onboard sensors.

Swift combined two primary modules:
1. **Perception System:** A visual–inertial odometry (VIO) pipeline fused with a CNN-based gate detector and Kalman filter.
2. **Control Policy:** A lightweight, 2-layer feedforward neural network trained via **Proximal Policy Optimization (PPO)** to map the drone state to control actions (collective thrust and body rates).

Although Swift achieved human-champion-level performance, the design was **task-specific** and not easily generalizable to other tracks or visual domains.

### 1.2 Motivation for Improvement
The next step is to **improve generalization** and **representation learning** while maintaining real-time performance and robust sim-to-real transfer. We aim to augment Swift’s methodology using **Transformer-based architectures** within a modular framework.

Specifically, this project will:
- Integrate a **Vision Transformer (ViT)** or related model as a **representation learner** for perception.
- Maintain a **modular architecture** where perception and control remain distinct but communicate through a richer learned interface.
- Preserve or exceed real-time control capabilities (≥100 Hz control loop) under modern compute standards.

This design seeks to **bridge the gap** between perception-driven learning and robust control by introducing a **generalizable latent representation**.

---

## 2. Objectives

1. **Augment Swift’s Perception Pipeline** with a Transformer-based vision encoder capable of producing both geometric and semantic latent features.
2. **Retain Modular Design:** The perception and control systems remain decoupled for interpretability and robustness.
3. **Introduce a Learned Vision-to-Policy Interface:** Replace the fixed 31-D handcrafted observation vector with a richer but structured latent embedding.
4. **Upgrade the Control Policy** from a static MLP to a **temporal Transformer policy**, improving handling of perception noise and partial observability.
5. **Implement Reward Shaping and Auxiliary Objectives** to encourage geometry-aware, temporally consistent feature learning.
6. **Evaluate Generalization** across unseen tracks, environmental variations (lighting, textures), and dynamic noise.
7. **Preserve Real-Time Constraints:** Maintain or improve end-to-end inference latency below 15 ms.

---

## 3. System Architecture

### 3.1 Overview
```
Camera(s) → Vision Transformer Encoder → Geometric & Latent Heads
               ↓
         [Pose + Latent z_t]
               ↓
         Transformer-based PPO Policy → [Thrust, Body Rates]
```

### 3.2 Vision Module
**Baseline (Swift):** CNN gate detector + IPPE pose estimator + Kalman filter → 31-D state vector.  
**Proposed:** Replace with a **Vision Transformer Encoder** outputting:

1. **Geometric Features**
   - 3D relative gate pose
   - Keypoint or gate-corner coordinates
   - Depth/flow statistics for dynamic awareness
   - Detection confidence (for uncertainty estimation)

2. **Latent Embedding (z_t)**
   - 32–64 D compact representation encoding scene layout and visual context.
   - Trained with contrastive/self-supervised losses (e.g., SimCLR, BYOL-T, or CPC) to ensure invariance to lighting, motion blur, and textures.

**Output Interface (to policy):**
$$o_t = [\text{VIO state},\ \text{gate pose},\ \text{previous action},\ z_t^{latent}]$$

### 3.3 Control Policy Module
**Baseline (Swift):** 2-layer, 128-unit MLP with LeakyReLU activations.  
**Proposed:** A **small Transformer-based PPO policy**, e.g.:
- 2–3 encoder layers
- Hidden dimension: 128–256
- Temporal window: last 3–5 observations (≈0.3 s)

The Transformer enables **temporal reasoning**, smoothing over noisy vision updates and partial observations.  
The output distribution models Gaussian actions:
$$u_t = [\text{collective thrust},\ \omega_x,\ \omega_y,\ \omega_z]$$

### 3.4 Reward Function
Adopt Swift’s dense reward formulation, with additions for representation stability:

$$
r_t = \lambda_1 r_{\text{progress}} + \lambda_2 r_{\text{fov}} + \lambda_3 r_{\text{stability}} + \lambda_4 r_{\text{energy}} + \lambda_5 r_{\text{latent}}
$$

where:
- $r_{\text{progress}}$: distance progress toward next gate.
- $r_{\text{fov}}$: alignment of camera optical axis with gate.
- $r_{\text{stability}}$: penalizes oscillatory commands.
- $r_{\text{energy}}$: encourages efficient flight.
- $r_{\text{latent}} = -\|z_t - z_{t-1}\|$: enforces temporal smoothness in latent space (feature consistency).

### 3.5 Auxiliary Vision Losses
During joint training, the vision encoder is guided by auxiliary tasks:
![[Pasted image 20251101163408.png]]

---

## 4. Methodology

### 4.1 Phase 1 – Baseline Replication
- Reproduce the **Swift** pipeline using PPO with a 2-layer MLP.
- Validate policy on simulation track (7 gates, 75 m lap).
- Ensure reward, physics, and observation models match reported performance.

### 4.2 Phase 2 – Transformer Vision Module
1. Build a **Vision Transformer (ViT or Swin-Tiny)** model pre-trained on ImageNet or synthetic drone data.
2. Collect a dataset of **image → state (31-D)** mappings from simulation.
3. Train the encoder to regress or classify to these targets with auxiliary losses.
4. Evaluate representation quality using linear-probe accuracy and reconstruction error.

### 4.3 Phase 3 – Policy Integration
1. Integrate Transformer vision encoder with PPO policy.
2. Use asynchronous sensor fusion:
   - Vision: 30–60 Hz
   - IMU/VIO: 100–200 Hz
   - Control: 100–250 Hz
3. Fuse via Kalman or GRU-based filter.

### 4.4 Phase 4 – Transformer PPO Policy
1. Replace MLP policy with temporal Transformer encoder.
2. Train with PPO (on-policy RL) using shaped rewards.
3. Introduce **feature consistency loss**:
   $$L_{\text{feat}} = \|z_t - \hat{z}_{t-1}\|_2^2$$
4. Evaluate stability under domain randomization.

### 4.5 Phase 5 – Fine-Tuning with Real Data
1. Collect 3–5 real-world rollouts (≈50 s flight time).
2. Identify residual perception/dynamics errors.
3. Model residuals using Gaussian processes (for perception) and KNN regression (for dynamics), as in Swift.
4. Fine-tune policy using augmented simulation.

### 4.6 Phase 6 – Evaluation
1. Compare to Swift baseline:
   - Lap time
   - Gate completion rate
   - Average thrust/power usage
   - Latent smoothness metrics
2. Test on **new tracks** and **lighting domains**.
3. Analyze **transfer performance** (zero-shot on unseen layouts).

---

## 5. Expected Improvements

| Category | Swift Baseline | Proposed Augmented System | Expected Gain |
|:--|:--|:--|:--|
| **Representation** | Hand-engineered 31-D vector | Transformer-learned latent + pose | Domain-invariant, more expressive |
| **Control** | 2-layer MLP | Transformer PPO (temporal) | Better context & noise tolerance |
| **Generalization** | Track-specific | Multi-track, domain randomized | Robust cross-domain performance |
| **Sim-to-real** | Residual models (GP + KNN) | Same residuals + latent smoothing | More stable perception transfer |
| **Interpretability** | High (explicit state) | Medium (latent + pose) | Retain partial interpretability |
| **Latency** | <15 ms | ≈10–15 ms (modern hardware) | Maintain real-time speed |

---

## 6. Action Items and Deliverables

### 6.1 Implementation Tasks
- [ ] Reproduce Swift PPO baseline.
- [ ] Implement Vision Transformer encoder (pretrained weights, 224×224 input).
- [ ] Build synthetic training set (image → state mapping).
- [ ] Train encoder with supervised + self-supervised losses.
- [ ] Integrate encoder outputs into PPO observation vector.
- [ ] Implement Transformer-based PPO policy (temporal encoder).
- [ ] Develop reward shaping module with latent consistency.
- [ ] Set up domain randomization in simulation (lighting, track layouts, textures).
- [ ] Implement residual modeling (GP + KNN) for real-world fine-tuning.

### 6.2 Evaluation & Metrics
| Metric | Description |
|:--|:--|
| Lap time | Completion speed per 3-lap race |
| Gate success rate | % of gates passed without collision |
| Feature consistency | Temporal smoothness of latent z_t |
| Policy stability | Variance in thrust/command outputs |
| Generalization | Performance drop on unseen tracks |
| Latency | Vision + policy inference time (ms) |

### 6.3 Experimental Hardware
- **Compute:** Jetson Orin / desktop GPU (RTX 3090 or later)
- **Camera:** RealSense T265 or equivalent (RGB + IMU)
- **Flight Controller:** STM32 running Betaflight
- **Policy Runtime:** TensorRT/ONNX (FP16 or INT8)

---

## 7. Constraints and Considerations

| Constraint | Explanation |
|:--|:--|
| **Real-time latency** | Total control latency ≤ 15 ms, deterministic jitter preferred |
| **Power & compute limits** | Jetson TX2/Orin-class devices; models must fit within 8–16 W budget |
| **Dataset diversity** | Need extensive domain randomization (textures, blur, lighting) to generalize |
| **Sim-to-real gap** | Must capture residual dynamics via small real datasets |
| **Policy stability** | PPO hyperparameters (entropy, clip ratio, learning rate) tuned to prevent divergence |
| **Safety** | Collisions terminate episodes; add virtual crash zones in sim |

---

## 8. Expected Outcomes

- Demonstration of a **Transformer-augmented RL framework** achieving comparable or superior performance to Swift.
- Proof that **modular perception + Transformer PPO** retains generalization while staying within real-time constraints.
- Quantitative validation that **feature-aware reward shaping** improves latent consistency and sim-to-real transfer.
- Ablation results comparing:
  - CNN vs Transformer encoders
  - MLP vs Transformer PPO
  - Reward shaping variants (with/without latent penalties)

---

## 9. Long-Term Vision

This research establishes a foundation for **generalizable embodied learning**:
- The modular, Transformer-based perception-control stack could extend to other robotics domains (ground vehicles, quadrupeds, manipulators).
- Latent feature sharing enables multi-task or meta-learning.
- Ultimately, this line of work aims for a **unified, real-time visuomotor foundation model** for robotics — efficient, interpretable, and deployable on embedded systems.

---

## 10. References
1. Kaufmann, E., et al. *Champion-level drone racing using deep reinforcement learning.* Nature 620, 982–987 (2023).  
2. Schulman, J., et al. *Proximal Policy Optimization Algorithms.* arXiv:1707.06347 (2017).  
3. Foehn, P., et al. *Agilicious: open-source and open-hardware agile quadrotor for vision-based flight.* Sci. Robot. 7, eabl6259 (2022).  
4. Williams, C. K. & Rasmussen, C. E. *Gaussian Processes for Machine Learning.* (MIT Press, 2006).  
5. Ronneberger, O., Fischer, P., & Brox, T. *U-Net: Convolutional Networks for Biomedical Image Segmentation.* (MICCAI, 2015).  
6. Dosovitskiy, A., et al. *An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale.* arXiv:2010.11929 (2020).  
7. Carion, N., et al. *End-to-End Object Detection with Transformers (DETR).* ECCV (2020).  

---

### ✅ Deliverable Summary
- Full modular PPO+Transformer architecture implementation.
- Comprehensive experimental comparison to Swift baseline.
- Dataset + code release (simulation & vision pretraining).
- Research paper draft documenting methodology, ablations, and findings.

---

**Prepared for:** Drone Racing RL Research Project  
**Primary Investigator:** [Your Name]  
**Date:** [Insert Date]



*** 
# Additional reference papers 
![[Transformers in Reinforcement Learning- A Survey.pdf]]

![[Stabilizing Deep Q-Learning with ConvNets and Vision Transformers under Data Augmentation.pdf]]

![[Learning Quadrotor Control From Visual Features Using Differentiable Simulation.pdf]]

![[Champion-level_drone_racing_using_deep_reinforceme (1).pdf]]