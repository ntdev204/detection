# PID Control - Deep Dive

## PID Tuning Methods

### Ziegler-Nichols (Ultimate Gain)

1. Set Ki=0, Kd=0
2. Increase Kp until sustained oscillation (critical gain Ku)
3. Measure oscillation period Tu
4. Apply formulas:
    - P: Kp = 0.5×Ku
    - PI: Kp = 0.45×Ku, Ki = 1.2×Kp/Tu
    - PID: Kp = 0.6×Ku, Ki = 2×Kp/Tu, Kd = Kp×Tu/8

### Cohen-Coon

Based on process reaction curve (step response).

### Lambda Tuning (IMC)

- Specify desired closed-loop time constant (λ)
- Kp = τ / (K × λ)
- More conservative than Ziegler-Nichols

### Manual Tuning Process

1. **Start with P**: Kp only, observe response
2. **Add I**: Eliminate steady-state error
3. **Add D**: Reduce overshoot, improve settling

## Anti-Windup Techniques

### Problem

Integrator "winds up" when output saturates (e.g., valve 100% open).

###Solutions

**1. Clamping:**

```python
if output > max:
    output = max
    integral = integral  # Stop integration
```

**2. Back Calculation:**

```python
if output_saturated:
    integral = integral - (Kb × saturation_error)
```

**3. Conditional Integration:**

```python
if not saturated:
    integral += error × dt
```

## Derivative Filtering

### Pure D Problem

Amplifies high-frequency noise.

### Filtered Derivative

```
D_filtered = Kd × (s / (τ×s + 1)) × e(s)

Typical: τ = 0.1 × Td
```

**Implementation:**

```python
filtered_derivative = (alpha × derivative) + ((1-alpha) × prev_filtered)
where alpha = dt / (dt + τ)
```

## Derivative Kick Mitigation

**Problem:** Setpoint step causes derivative spike.

**Solution:** Derivative on measurement only:

```python
error = setpoint - measurement
P_term = Kp × error
I_term = Ki × integral(error)
D_term = -Kd × d(measurement)/dt  # Note negative, on measurement

output = P_term + I_term + D_term
```

## Adaptive PID

| Type                | Description                               | Use Cases                |
| ------------------- | ----------------------------------------- | ------------------------ |
| **Gain Scheduling** | Switch PID gains based on operating point | Varying process dynamics |
| **Self-Tuning**     | Online parameter estimation               | Slowly changing dynamics |
| **Model Reference** | Track reference model response            | Complex systems          |

### Gain Scheduling Example

```python
if temperature < 50:
    Kp, Ki, Kd = 1.0, 0.1, 0.05
elif temperature < 100:
    Kp, Ki, Kd = 1.5, 0.15, 0.075
else:
    Kp, Ki, Kd = 2.0, 0.2, 0.1
```

## Practical Implementation

### Discrete PID (Sample Time Ts)

```python
# Proportional
P = Kp × error

# Integral (rectangular approximation)
I = I_prev + (Ki × error × Ts)

# Derivative
D = Kd × (error - error_prev) / Ts

# Output
output = P + I + D

# Anti-windup
if output > max:
    output = max
    I = I_prev  # Don't update integral
elif output < min:
    output = min
    I = I_prev
```

### Bumpless Transfer

When switching modes (manual → auto):

```python
# Initialize integrator to current output
I_initial = current_output - (Kp × error) - (Kd × derivative)
```

## Performance Metrics

| Metric                 | Description            | Typical Target           |
| ---------------------- | ---------------------- | ------------------------ |
| **Rise Time**          | 10% to 90%             | Minimize                 |
| **Settling Time**      | Within ±2% of setpoint | Minimize                 |
| **Overshoot**          | Peak above setpoint    | < 10%                    |
| **Steady-State Error** | Final error            | 0 (with integral action) |

## Common Tuning Guidelines

| Parameter | Too Low                    | Too High                         |
| --------- | -------------------------- | -------------------------------- |
| **Kp**    | Slow response, large error | Oscillation, instability         |
| **Ki**    | Steady-state error         | Slow, overshoot, oscillation     |
| **Kd**    | Overshoot                  | Noise amplification, instability |

## Real-World Examples

### Temperature Control (Slow Process)

- Kp: 2-10
- Ki: 0.01-0.1
- Kd: 0.1-1
- Anti-windup: Essential
- Derivative filter: Recommended

### Motor Speed Control (Fast Process)

- Kp: 0.1-1
- Ki: 0.5-5
- Kd: 0.001-0.01
- Sample time: 1-10 ms

### Level Control (Integrating Process)

- PI control (no D)
- Kp: 0.5-2
- Ki: 0.001-0.01
