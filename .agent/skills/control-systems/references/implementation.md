# Control System Implementation Guide

## Discretization (Continuous → Digital)

### Methods

| Method                    | Transform             | Characteristics                    |
| ------------------------- | --------------------- | ---------------------------------- |
| **Forward Euler**         | s = (z-1)/T           | Simple, unstable for fast dynamics |
| **Backward Euler**        | s = (z-1)/(zT)        | More stable                        |
| **Tustin (Bilinear)**     | s = (2/T)(z-1)/(z+1)  | Best frequency response match      |
| **ZOH (Zero-Order Hold)** | Exact for step inputs | Most accurate                      |

### Sampling Time Selection

**Shannon-Nyquist:** fs > 2 × f_max

**Rule of thumb:**

- **10-20× faster** than system bandwidth
- For PID: Ts = Td / 10 to Td / 20

### Anti-Aliasing Filter

- Low-pass filter before ADC
- Cutoff < fs / 2
- Analog (RC) or digital (IIR)

---

## Performance Metrics

### Time-Domain

| Metric                       | Definition                    | Typical Target     |
| ---------------------------- | ----------------------------- | ------------------ |
| **Rise Time (tr)**           | 10% to 90% of final value     | Minimize           |
| **Peak Time (tp)**           | Time to first peak            | -                  |
| **Settling Time (ts)**       | Enter and stay within ±2%     | < 4/ζωn            |
| **Overshoot (Mp)**           | (peak - final) / final × 100% | < 10%              |
| **Steady-State Error (ess)** | lim (r - y) as t→∞            | 0 (Type 1+ system) |

### Frequency-Domain

| Metric                 | Description                               | Safe Value |
| ---------------------- | ----------------------------------------- | ---------- | ------- | ---------------------- |
| **Gain Margin**        | How much gain before instability (dB)     | > 6 dB     |
| **Phase Margin**       | How much phase lag before instability (°) | > 45°      |
| **Bandwidth**          | Frequency where                           | G          | = -3 dB | Depends on application |
| **Resonant Peak (Mr)** | Max                                       | G(jω)      |         | < 1.5 (< 3.5 dB)       |

---

## Stability Analysis

### Routh-Hurwitz Criterion

**For polynomial:** a_n s^n + ... + a_1 s + a_0 = 0

1. All coefficients must be > 0 (necessary)
2. Construct Routh array
3. First column all > 0 → Stable

### Nyquist Criterion

```
N = P - Z

N: encirclements of -1
P: RHP poles (open-loop)
Z: RHP poles (closed-loop)

Stable if Z = 0
```

### Bode Stability

- **Gain crossover** (|G| = 1): Phase > -180° + PM
- **Phase crossover** (∠G = -180°): |G| < 1 / GM

---

## State-Space Methods

### Controllability

```
Controllability matrix: C = [B AB A²B ... A^(n-1)B]
Controllable if rank(C) = n
```

### Observability

```
Observability matrix: O = [C' A'C' (A²)'C' ... (A^(n-1))'C']
Observable if rank(O) = n
```

**Can't control** → Can't place poles arbitrarily
**Can't observe** → Can't estimate all states

---

## Common Control Architectures

### Cascade Control

```
Outer Loop (slow) → Inner Loop (fast)
Example: Position (outer) → Velocity (inner)
```

**Benefits:**

- Disturbance rejection in inner loop
- Faster response

### Feedforward Control

```
Disturbance measurement → Feedforward → Process
                                ↓
                           Feedback (PID) → Process
```

**Use When:** Measurable disturbance (e.g., load change)

### Ratio Control

Maintain ratio between two flows:

```
Flow A / Flow B = K (constant)
```

---

## Practical Implementation Tips

### Initialization

- **Integrator**: Initialize to current output (bumpless transfer)
- **Derivative**: Initialize to 0 or filtered measurement

### Saturation Handling

```python
if output > max:
    output = max
elif output < min:
    output = min
```

**Anti-windup** (see PID reference)

### Noise Filtering

**Low-pass filter:**

```
y_filtered[k] = α × y[k] + (1-α) × y_filtered[k-1]
where α = T / (T + τ), τ = filter time constant
```

### Derivative Calculation

**Avoid pure derivative** (noise amplification):

```python
# Filtered derivative
derivative = (measurement - prev_measurement) / dt
filtered_deriv = alpha * derivative + (1-alpha) * prev_filtered_deriv
```

---

## Tuning Workflow

1. **Model identification**: Step response, frequency response
2. **Simulate**: Test controller in simulation
3. **Conservative start**: Low gains
4. **Incremental tuning**: Increase one parameter at a time
5. **Monitor**: Stability margins, overshoot, settling time
6. **Document**: Final parameters, performance achieved

---

## Troubleshooting

| Symptom                | Possible Cause                | Solution               |
| ---------------------- | ----------------------------- | ---------------------- |
| **Oscillation**        | Kp or Kd too high             | Reduce gains           |
| **Slow response**      | Kp too low                    | Increase Kp            |
| **Steady-state error** | No integral action            | Add/increase Ki        |
| **Derivative noise**   | No filter                     | Add low-pass filter    |
| **Integral windup**    | Saturation                    | Implement anti-windup  |
| **Instability**        | Negative feedback is positive | Check sign conventions |

---

## Safety Checklist

- [ ] Output limits (saturation)
- [ ] Input validation (sensor fail-safe)
- [ ] Watchdog timer (detect hang)
- [ ] Emergency stop (manual override)
- [ ] Graceful degradation (sensor failure mode)
- [ ] Parameter bounds checking
