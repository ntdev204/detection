# Modern Control Methods

## LQR (Linear Quadratic Regulator)

### State-Space Form

```
ẋ = Ax + Bu
y = Cx + Du
```

### Cost Function

```
J = ∫(x'Qx + u'Ru) dt
```

- **Q**: State weighting matrix (penalize state deviation)
- **R**: Control effort weighting matrix (penalize large inputs)

### Optimal Control Law

```
u = -Kx
where K = R⁻¹B'P
P: solution to Algebraic Riccati Equation (ARE)
```

### Design Process

1. **Model system** in state-space form
2. **Choose Q and R** matrices
    - Larger Q → tighter state tracking
    - Larger R → less aggressive control
3. **Solve ARE** (using MATLAB `lqr()` or Python `scipy.linalg.solve_continuous_are`)
4. **Compute feedback gain K**

### Example (Python)

```python
import numpy as np
from scipy.linalg import solve_continuous_are

A = np.array([[0, 1], [-2, -3]])
B = np.array([[0], [1]])
Q = np.eye(2)  # Equal weight on both states
R = np.array([[1]])  # Control effort weight

# Solve ARE
P = solve_continuous_are(A, B, Q, R)
K = np.linalg.inv(R) @ B.T @ P

print("Optimal gain K:", K)
```

---

## MPC (Model Predictive Control)

### Core Concept

At each time step:

1. **Predict** future behavior over horizon N
2. **Optimize** control sequence to minimize cost
3. **Apply** only first control input
4. **Repeat** at next time step (receding horizon)

### Cost Function

```
J = Σ(||y[k] - r[k]||²_Q + ||u[k]||²_R + ||Δu[k]||²_S)

where:
- y[k]: predicted output
- r[k]: reference
- u[k]: control input
- Δu[k]: control increment
```

### Horizons

- **Prediction horizon (N)**: How far to predict (10-50 steps)
- **Control horizon (M)**: How many control moves (M ≤ N)

### Constraints

**Key advantage of MPC:**

```
Input constraints: u_min ≤ u ≤ u_max
Output constraints: y_min ≤ y ≤ y_max
Rate constraints: Δu_min ≤ Δu ≤ Δu_max
```

### Applications

- Chemical processes (MIMO, constraints)
- Autonomous vehicles (path following, obstacle avoidance)
- Power systems (economic dispatch)

### Disadvantages

- Computational cost (online optimization)
- Requires accurate model
- Tuning (Q, R, N, M)

---

## Sliding Mode Control (SMC)

### Sliding Surface

Define a surface in state space:

```
s(x) = cx + ẋ = 0
```

**Goal:** Drive system to sliding surface and keep it there.

### Control Law

```
u = u_eq + u_sw

u_eq: equivalent control (keeps on surface)
u_sw: switching control (drives to surface)

Typical: u_sw = -K × sign(s)
```

### Chattering Problem

High-frequency switching causes:

- Wear on actuators
- Excitation of unmodeled dynamics

**Mitigation:**

1. **Boundary layer:**

    ```
    sign(s) → sat(s/φ)  where φ is boundary thickness
    ```

2. **Higher-order SMC:** Continuous control derivatives

### Advantages

- Robust to disturbances and parameter variations
- Finite-time convergence

### Disadvantages

- Chattering
- Requires knowledge of disturbance bounds

---

## State Feedback Design

### Pole Placement

**Goal:** Place closed-loop poles at desired locations.

```
u = -Kx
Acl = A - BK

Design K such that eig(Acl) = desired poles
```

**MATLAB:** `K = place(A, B, poles)`

**Python:** `K = scipy.signal.place_poles(A, B, poles).gain_matrix`

### Observer Design (Luenberger)

**Problem:** Can't measure all states.

**Solution:** Estimate states from output.

```
Observer dynamics:
ẋ_hat = Ax_hat + Bu + L(y - Cx_hat)

where L = observer gain matrix
```

**Design:** Place observer poles faster than controller poles (rule of thumb: 3-5× faster).

---

## Comparison Table

| Method  | Model Needed | Constraints  | Disturbance Rejection       | Computational Cost         |
| ------- | ------------ | ------------ | --------------------------- | -------------------------- |
| **LQR** | Yes (linear) | No           | Good (with integral action) | Low                        |
| **MPC** | Yes          | Yes (native) | Excellent                   | High (online optimization) |
| **SMC** | Yes (bounds) | Indirect     | Excellent                   | Medium                     |
| **PID** | No           | No           | Good (tuned)                | Very Low                   |

---

## Practical Tips

### LQR

- Start with Q = C'C (output tracking)
- Increase R to reduce control effort
- Add integral action for zero steady-state error

### MPC

- Prediction horizon: 10-30× sampling time
- Control horizon: N/3 to N/2
- Soft constraints for robustness

### SMC

- Start with small boundary layer
- Increase gradually to reduce chattering
- Monitor actuator stress
