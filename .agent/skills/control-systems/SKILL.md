---
name: control-systems
description: Control theory and advanced control methods. PID control (traditional and adaptive), Fuzzy logic control (Type-1, Type-2, higher-order), modern control methods (LQR, MPC, sliding mode), control system design and tuning. Use when designing control systems, implementing controllers, or optimizing control performance.
---

# Control Systems

> Principles for designing feedback control systems from classical to advanced methods.

## 1. Controller Selection Decision Tree

```
System complexity?
├─ Simple (SISO, linear) → PID
├─ Moderate (nonlinear, uncertain) → Fuzzy or Adaptive PID
└─ Complex (MIMO, constraints) → MPC or State-Space

Need constraints handling?
├─ Yes → MPC
└─ No → Other methods

Model available?
├─ Yes → Model-based (LQR, MPC, SMC)
├─ Rough model → Fuzzy, Adaptive
└─ No model → PID (manual tuning)

Disturbance rejection critical?
├─ Yes → SMC, MPC with feedforward
└─ No → PID, LQR

Real-time constraints?
├─ Hard (< 1ms) → PID, pre-computed LQR
├─ Soft (< 100ms) → MPC with fast solver
└─ No constraints → Any method
```

---

## 2. PID Control (Most Common)

### PID Equation

```
u(t) = Kp×e(t) + Ki×∫e(t)dt + Kd×de(t)/dt

Kp: Proportional gain
Ki: Integral gain
Kd: Derivative gain
e(t): error = setpoint - measurement
```

### Tuning Quick Start

**Step 1:** Start with P-only (Ki=0, Kd=0)
**Step 2:** Increase Kp until stable oscillation
**Step 3:** Add Ki to eliminate steady-state error
**Step 4:** Add Kd to reduce overshoot

### Common Issues & Solutions

| Problem              | Solution                                 |
| -------------------- | ---------------------------------------- |
| **Integral windup**  | Anti-windup (clamping, back-calculation) |
| **Derivative noise** | Filter derivative term                   |
| **Setpoint kick**    | Derivative on measurement only           |
| **Varying dynamics** | Gain scheduling (adaptive PID)           |

**For detailed PID tuning methods, anti-windup, and implementation, see [pid.md](references/pid.md)**

---

## 3. Fuzzy Logic Control

### When to Use

- Nonlinear systems
- No precise mathematical model
- Expert knowledge available (linguistic rules)
- Need robustness to uncertainty

### Type-1 vs. Type-2

| Feature         | Type-1                | Type-2                     |
| --------------- | --------------------- | -------------------------- |
| **Membership**  | Crisp (μ = 0.7)       | Fuzzy (μ ∈ [0.6, 0.8])     |
| **Uncertainty** | None                  | Handles noise, uncertainty |
| **Computation** | Fast                  | Slower                     |
| **Use Cases**   | General fuzzy control | High noise environments    |

### Fuzzy System Flow

```
Input → Fuzzification → Inference (Rules) → Defuzzification → Output
```

**Example Rule:**

```
IF error is Positive_Large AND change_error is Negative_Small
THEN output is Medium_Increase
```

**For Type-1/Type-2 details, membership functions, defuzzification, see [fuzzy.md](references/fuzzy.md)**

---

## 4. Modern Control Methods

### LQR (Linear Quadratic Regulator)

**Cost Function:**

```
J = ∫(x'Qx + u'Ru) dt

Q: State weighting
R: Control effort weighting
```

**Use When:**

- Linear system model available
- State feedback possible
- Want optimal performance
- MIMO systems

### MPC (Model Predictive Control)

**Key Features:**

- **Optimize** over future horizon
- **Handle constraints** (input/output limits)
- **Receding horizon** (re-optimize each step)

**Use When:**

- Constraints critical (safety, physical limits)
- MIMO systems
- Can tolerate computational cost
- Accurate model available

### Sliding Mode Control (SMC)

**Characteristics:**

- **Robust** to disturbances
- **Finite-time** convergence
- **Chattering** (main drawback)

**Use When:**

- High disturbance rejection needed
- Parameter uncertainty
- Can mitigate chattering (boundary layer)

**For LQR, MPC, SMC implementation details, see [modern-control.md](references/modern-control.md)**

---

## 5. Control System Metrics

### Time-Domain

| Metric                 | Description         | Target            |
| ---------------------- | ------------------- | ----------------- |
| **Rise Time**          | 10% to 90%          | Minimize          |
| **Settling Time**      | Enter ±2% band      | < desired         |
| **Overshoot**          | Peak above setpoint | < 10%             |
| **Steady-State Error** | Final error         | 0 (with integral) |

### Frequency-Domain

| Metric           | Description                       | Safe Value |
| ---------------- | --------------------------------- | ---------- |
| **Gain Margin**  | Safety from instability (dB)      | > 6 dB     |
| **Phase Margin** | Safety from instability (degrees) | > 45°      |

---

## 6. State-Space Methods

### State-Space Representation

```
ẋ = Ax + Bu  (state equation)
y = Cx + Du  (output equation)
```

### Controllability & Observability

**Controllable:** Can reach any state from any initial state
**Observable:** Can infer all states from output

**Check:**

```
Controllability: rank([B AB A²B...]) = n
Observability: rank([C' A'C'...]) = n
```

### Observer Design

**Luenberger Observer:**

```
ẋ_hat = Ax_hat + Bu + L(y - Cx_hat)

L: observer gain matrix
```

---

## 7. Stability Analysis

### Routh-Hurwitz

**Quick check:** All coefficients of characteristic polynomial > 0

### Nyquist Criterion

Encirclements of -1 point in Nyquist plot.

### Bode Stability

- Gain Margin > 6 dB
- Phase Margin > 45°

---

## 8. Practical Implementation

### Discretization

**Continuous → Digital:**

| Method                    | When to Use                            |
| ------------------------- | -------------------------------------- |
| **Tustin (Bilinear)**     | General purpose (best frequency match) |
| **ZOH (Zero-Order Hold)** | Most accurate                          |
| **Forward Euler**         | Simple (less stable)                   |

### Sampling Time

**Rule:** Ts = (1/10 to 1/20) × fastest time constant

### Anti-Aliasing

Low-pass filter before ADC, cutoff < fs/2

**For discretization details, performance metrics, troubleshooting, see [implementation.md](references/implementation.md)**

---

## 9. Common Control Architectures

### Cascade Control

```
Outer Loop (slow) → Inner Loop (fast) → Process

Example: Temperature (outer) → Flow (inner)
```

**Benefits:** Better disturbance rejection

### Feedforward + Feedback

```
Disturbance → Feedforward ─┐
                           ├─→ Process
Feedback (PID) ────────────┘
```

**Use:** When disturbance is measurable

---

## 10. Design Workflow

### Step 1: System Identification

- Step response
- Frequency response
- Parameter estimation

### Step 2: Controller Selection

Use decision tree (section 1)

### Step 3: Design

- PID: Tune using Ziegler-Nichols, Cohen-Coon, or manual
- Fuzzy: Define rules, membership functions
- LQR: Choose Q, R matrices
- MPC: Set horizons, constraints

### Step 4: Simulation

- Test in MATLAB/Simulink, Python
- Verify stability, performance

### Step 5: Implementation

- Discretize controller
- Handle saturation (anti-windup)
- Add safety limits

### Step 6: Tuning

- Start conservative (low gains)
- Incrementally increase
- Monitor stability margins

---

## 11. Quick Start Checklist

- [ ] Model the system (transfer function or state-space)
- [ ] Check controllability/observability (if using state-space)
- [ ] Select control method (section 1)
- [ ] Design controller
- [ ] Simulate (verify stability, performance)
- [ ] Discretize (choose sampling time, method)
- [ ] Implement anti-windup and saturation handling
- [ ] Add safety limits and fault detection
- [ ] Test with actual hardware
- [ ] Monitor and fine-tune

---

## 12. Common Pitfalls

| Problem                    | Solution                              |
| -------------------------- | ------------------------------------- |
| **Integral windup**        | Anti-windup (conditional integration) |
| **Derivative noise**       | Low-pass filter on derivative         |
| **Saturation ignored**     | Implement anti-windup, clamping       |
| **Poor sampling**          | Follow Nyquist (fs > 2×f_max)         |
| **Model mismatch**         | Adaptive control, robust design (H∞)  |
| **Unstable tuning**        | Start with conservative gains         |
| **Setpoint step response** | Setpoint weighting, ramping           |

---

> **Philosophy:** Start simple (P or PI), add complexity only when needed. Stability first, then performance. Test thoroughly before deployment.

## References

- [pid.md](references/pid.md) - PID tuning methods, anti-windup, adaptive PID, implementation
- [fuzzy.md](references/fuzzy.md) - Type-1/Type-2 fuzzy logic, membership functions, defuzzification
- [modern-control.md](references/modern-control.md) - LQR, MPC, Sliding Mode Control
- [implementation.md](references/implementation.md) - Discretization, metrics, stability analysis, troubleshooting
