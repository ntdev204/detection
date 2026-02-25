# Fuzzy Logic Control - Deep Dive

## Type-1 Fuzzy System

### Architecture

```
Input → Fuzzification → Inference Engine → Defuzzification → Output
```

### Membership Functions

| Type            | Equation         | Use                |
| --------------- | ---------------- | ------------------ |
| **Triangular**  | Linear slopes    | General purpose    |
| **Trapezoidal** | Flat top         | Plateaus           |
| **Gaussian**    | exp(-(x-c)²/2σ²) | Smooth, continuous |
| **Singleton**   | Single point     | Outputs            |

### Fuzzy Rule Base

**Example (Temperature Control):**

```
IF error is Negative_Large AND change_error is Negative
THEN output is Large_Decrease

IF error is Zero AND change_error is Zero
THEN output is No_Change

IF error is Positive_Large AND change_error is Positive
THEN output is Large_Increase
```

### Defuzzification Methods

| Method                    | Description           | Characteristics      |
| ------------------------- | --------------------- | -------------------- |
| **Centroid (COA)**        | Center of area        | Most common          |
| **Bisector**              | Divides area in half  | Balanced             |
| **Mean of Maximum (MOM)** | Average of max values | Fast                 |
| **Smallest of Maximum**   | Conservative          | Safety-critical      |
| **Largest of Maximum**    | Aggressive            | Performance-critical |

**Centroid Formula:**

```
Output = Σ(μ(x) × x) / Σ(μ(x))
```

## Type-2 Fuzzy Logic

### Key Difference

- **Type-1**: Crisp membership values (μ = 0.7)
- **Type-2**: Fuzzy membership values (μ ∈ [0.6, 0.8])

### Footprint of Uncertainty (FOU)

```
Upper Membership Function (UMF)
        |
       FOU (shaded region)
        |
Lower Membership Function (LMF)
```

**Use When:**

- High measurement noise
- Uncertain system parameters
- Linguistic uncertainty

### Type Reduction

Convert Type-2 to Type-1 for defuzzification:

- Karnik-Mendel algorithm
- Nie-Tan method (simpler, faster)

## Fuzzy PID

**Combine fuzzy logic with PID:**

1. **Fuzzy Gain Scheduling**: Use fuzzy rules to adjust Kp, Ki, Kd
2. **Fuzzy PD + I**: Fuzzy for P and D, classical integral

**Example Rules:**

```
IF error is Small AND change_error is Small
THEN Kp is Medium, Kd is Small

IF error is Large AND change_error is Large
THEN Kp is Large, Kd is Large
```

## Design Workflow

### 1. Define Fuzzy Variables

**Input 1: Error**

- Linguistic terms: NL (Negative Large), NM, NS, ZE, PS, PM, PL

**Input 2: Change in Error**

- Same terms

**Output: Control Signal**

- Linguistic terms: DL (Decrease Large), DM, DS, ZE, IS, IM, IL

### 2. Design Membership Functions

- Choose shape (triangular, Gaussian)
- Define ranges (universe of discourse)
- Set overlap (typically 50%)

### 3. Create Rule Base

**7×7 rule table (error × change_error):**

|        | NL  | NM  | NS  | ZE  | PS  | PM  | PL  |
| ------ | --- | --- | --- | --- | --- | --- | --- |
| **NL** | DL  | DL  | DM  | DM  | DS  | ZE  | IS  |
| **NM** | DL  | DM  | DM  | DS  | ZE  | IS  | IM  |
| ...    | ... | ... | ... | ... | ... | ... | ... |

### 4. Test and Tune

- Simulate with different inputs
- Adjust membership functions
- Modify rule weights

## Implementation (Python Example)

```python
import numpy as np
import skfuzzy as fuzz

# Define universe of discourse
error = np.arange(-10, 11, 1)
change_error = np.arange(-5, 6, 1)
output = np.arange(-100, 101, 1)

# Membership functions
error_nl = fuzz.trimf(error, [-10, -10, -5])
error_ze = fuzz.trimf(error, [-2, 0, 2])
error_pl = fuzz.trimf(error, [5, 10, 10])

# Rules (using Mamdani inference)
# IF error is NL AND change_error is NL THEN output is DL

# Fuzzification
error_level_nl = fuzz.interp_membership(error, error_nl, 3.5)

# Inference (combine rules with AND=min, OR=max)
rule1 = np.fmin(error_level_nl, change_error_level_nl)

# Aggregation (combine all rules with OR=max)
aggregated = np.fmax(rule1, rule2, ...)

# Defuzzification (centroid)
output_value = fuzz.defuzz(output, aggregated, 'centroid')
```

## Advantages & Disadvantages

### Advantages

- Handle nonlinear systems
- No precise mathematical model needed
- Linguistic rules (human-understandable)
- Robust to noise and uncertainty

### Disadvantages

- Rule explosion (large systems)
- Tuning can be trial-and-error
- No guarantee of stability
- Computationally intensive (Type-2)

## Applications

- **HVAC**: Temperature, humidity control
- **Washing machines**: Load, dirt sensing
- **Automotive**: Cruise control, ABS
- **Robotics**: Path following, obstacle avoidance
