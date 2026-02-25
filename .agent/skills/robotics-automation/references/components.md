# Robot Components - Detailed Specifications

## Sensors

### Vision Systems

| Type              | Resolution         | Use Cases                       | Cost     |
| ----------------- | ------------------ | ------------------------------- | -------- |
| **2D Camera**     | VGA to 4K          | Inspection, OCR, barcode        | Low-Mid  |
| **3D Camera**     | 640x480+ depth     | Bin picking, measurement        | Mid-High |
| **Thermal**       | 80x60 to 640x480   | Predictive maintenance, quality | Mid      |
| **Hyperspectral** | Varied wavelengths | Material identification         | High     |

**Common Interfaces:**

- GigE Vision (Ethernet)
- USB3 Vision
- Camera Link (high bandwidth)

**Software:**

- OpenCV (open source)
- Cognex VisionPro (industrial)
- Halcon MVTec (advanced)

### Proximity Sensors

| Type            | Range     | Environment         | Accuracy |
| --------------- | --------- | ------------------- | -------- |
| **Inductive**   | 0-40mm    | Metallic targets    | ±10%     |
| **Capacitive**  | 0-30mm    | Any material        | ±15%     |
| **Ultrasonic**  | 30mm-10m  | Non-contact         | ±1%      |
| **Laser (ToF)** | 10mm-100m | High precision      | 1mm      |
| **LiDAR**       | 0.1-100m  | Navigation, mapping | cm-level |

### Force/Torque Sensors

**Specifications:**

- Force range: 50N to 1000N
- Torque range: 5Nm to 200Nm
- Axes: 3-axis or 6-axis
- Sample rate: 1-7kHz

**Applications:**

- Assembly (force feedback)
- Polishing/grinding
- Collaborative tasks

### Encoders

| Type            | Accuracy           | Installation  | Use Cases            |
| --------------- | ------------------ | ------------- | -------------------- |
| **Incremental** | ppulses/rev        | Simple        | Position feedback    |
| **Absolute**    | Single, multi-turn | Complex       | Critical positioning |
| **Magnetic**    | Medium             | Harsh environ | Dirty environments   |
| **Optical**     | High               | Clean environ | Precision motion     |

**Common Resolutions:**

- 360-10,000 PPR (pulses per revolution)

## Actuators

### Motors Comparison

| Type                    | Torque      | Speed      | Control          | Cost   |
| ----------------------- | ----------- | ---------- | ---------------- | ------ |
| **DC Brush**            | Low-Medium  | High       | Simple           | Low    |
| **DC Brushless (BLDC)** | Medium-High | High       | Complex          | Medium |
| **Servo**               | High        | Variable   | Precise          | High   |
| **Stepper**             | Medium      | Low-Medium | Open/closed loop | Medium |
| **Linear**              | Variable    | Variable   | Position control | High   |
| **Hydraulic**           | Very High   | Medium     | Complex          | High   |
| **Pneumatic**           | Medium      | High       | Simple ON/OFF    | Low    |

### Servo Motors

**Sizing Calculations:**

1. **Load inertia** (J_load)
2. **Motor inertia** (J_motor)
3. **Inertia ratio**: J_load / J_motor (optimal: 1:1 to 10:1)
4. **Torque**: T = J × α (angular acceleration)
5. **Power**: P = T × ω (angular velocity)

**Feedback**:

- Incremental encoder (2500-4096 PPR typical)
- Absolute encoder (17-bit to 23-bit)
- Resolver (analog)

### Pneumatic Components

**Cylinders:**

- Single-acting: Spring return
- Double-acting: Powered both directions
- Rodless: Long stroke applications

**Valves:**

- 3/2-way: Single-acting cylinders
- 5/2-way: Double-acting cylinders
- 5/3-way: Center position (hold)

**Pressure:**

- Standard: 6 bar (87 psi)
- Range: 4-10 bar

## Grippers & End Effectors

### Gripper Types

| Type                | Force    | Precision | Applications         |
| ------------------- | -------- | --------- | -------------------- |
| **Parallel Jaw**    | Medium   | High      | General purpose      |
| **Three-Jaw Chuck** | High     | Medium    | Cylindrical parts    |
| **Vacuum**          | Low      | Medium    | Flat, porous objects |
| **Magnetic**        | Medium   | Low       | Ferrous materials    |
| **Soft/Adaptive**   | Low      | High      | Delicate, irregular  |
| **Needle Gripper**  | Very Low | Very High | Small components     |

### Vacuum Systems

**Components:**

- Vacuum generator (ejector or pump)
- Suction cups (various materials: NBR, silicone)
- Vacuum switch (monitoring)

**Sizing:**

- Required vacuum: 60-80% of max vacuum
- Suction cup area: based on weight + safety factor
- Flow rate: based on cycle time

## Motion Control

### Drive Systems

**Servo Drives:**

- Position, velocity, torque modes
- EtherCAT, PROFINET fieldbus
- Safety-rated (STO, SBC, SS1)

**VFDs (Variable Frequency Drives):**

- AC motor speed control
- V/f control or vector control
- Modbus, Profibus communication

### Motion Profiles

**Trapezoidal:**

- Constant acceleration/deceleration
- Simple, widely used
- Jerk not limited (harsh)

**S-Curve:**

- Limited jerk (smooth)
- Better for delicate handling
- Slightly longer cycle time

## Power Transmission

### Gearboxes

| Type          | Ratio         | Efficiency | Backlash  |
| ------------- | ------------- | ---------- | --------- |
| **Spur**      | 1:1 to 10:1   | 98%        | Low       |
| **Planetary** | 3:1 to 100:1  | 95-97%     | Very Low  |
| **Harmonic**  | 30:1 to 320:1 | 65-90%     | Near zero |
| **Worm**      | 5:1 to 100:1  | 40-90%     | Near zero |

**Selection Criteria:**

- Torque multiplication
- Backlash tolerance
- Efficiency
- Size constraints

### Belt/Chain Systems

**Timing Belts:**

- No slip (synchronous)
- Low noise
- Medium torque

**V-Belts:**

- Allow slip
- Simple, low cost
- Medium torque

**Chains:**

- High torque
- Precise positioning
- Higher noise

### Linear Motion

| Type              | Precision      | Speed     | Load       |
| ----------------- | -------------- | --------- | ---------- |
| **Ball Screw**    | Very High (μm) | Medium    | High       |
| **Lead Screw**    | Medium         | Low       | Medium     |
| **Belt Drive**    | Medium         | Very High | Low-Medium |
| **Linear Motor**  | High           | Very High | Medium     |
| **Rack & Pinion** | Medium         | High      | High       |

## Material Selection

### Structural Materials

**Aluminum:**

- Lightweight
- Good machinability
- Lower strength than steel

**Steel:**

- High strength
- Heavier
- Requires surface treatment

**Carbon Fiber:**

- Lightweight
- High stiffness
- Expensive

### Component Specifications

**Bearings:**

- Ball bearings: Radial/axial loads
- Roller bearings: Heavy radial loads
- Linear bearings: Guided motion

**Bushings:**

- Bronze: Self-lubricating
- Plastic: Low friction, quiet

## Maintenance

### Preventive Maintenance Schedule

| Component        | Frequency | Tasks                   |
| ---------------- | --------- | ----------------------- |
| **Servo motors** | 6 months  | Clean, check cables     |
| **Gearboxes**    | 12 months | Oil change, check seals |
| **Pneumatics**   | 3 months  | Filter, lubrication     |
| **Encoders**     | 6 months  | Clean, alignment check  |
| **Cables**       | 6 months  | Inspect wear, flex life |

### Common Failure Modes

**Motors:**

- Bearing wear (vibration, noise)
- Encoder failure (position errors)
- Thermal overload

**Pneumatics:**

- Air leaks
- Cylinder seal wear
- Valve stiction

**Sensors:**

- Contamination (optical)
- Electrical noise (proximity)
- Mechanical damage
