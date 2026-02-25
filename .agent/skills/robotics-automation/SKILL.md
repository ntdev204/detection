---
name: robotics-automation
description: Robotics systems and industrial automation design. Robot types, locomotion, sensor integration, PLC/SCADA systems, automation patterns, and system design methodology. Use when designing robotic systems, industrial automation, or automated manufacturing solutions.
---

# Robotics & Automation

> Systematic approach to designing robotic systems and industrial automation.

## 1. Robot Selection

| Application           | Robot Type            | Payload     | Reach           | Speed      |
| --------------------- | --------------------- | ----------- | --------------- | ---------- |
| **Pick & Place**      | SCARA, Delta          | 1-20 kg     | 0.5-1.5 m       | Very High  |
| **Assembly**          | Collaborative (Cobot) | 3-20 kg     | 0.5-1.3 m       | Medium     |
| **Welding**           | 6-axis Articulated    | 5-150 kg    | 1-3 m           | Medium     |
| **Palletizing**       | 4-6 axis Articulated  | 50-500 kg   | 2-4 m           | Medium     |
| **Inspection**        | Cartesian/Gantry      | Variable    | Large workspace | Low-Medium |
| **Material Handling** | AMR, AGV              | 100-2000 kg | Facility-wide   | Low        |
| **Painting/Coating**  | 6-7 axis Articulated  | 10-30 kg    | 2-3.5 m         | High       |

---

## 2. Robot Components Decision Tree

```
Need perception?
├─ Yes → Vision (2D/3D), LiDAR, force sensors
└─ No → Position encoders only

Precision requirement?
├─ High (< 0.1mm) → Servo motors, absolute encoders
├─ Medium (0.1-1mm) → Stepper motors, incremental encoders
└─ Low (> 1mm) → DC motors, limit switches

Force control needed?
├─ Yes → Force/torque sensors (6-axis)
└─ No → Standard position control

Environment?
├─ Clean room → IP54+, stainless steel
├─ Harsh (dust, water) → IP65-67, sealed components
└─ Standard → IP40, standard materials
```

**For detailed component specs, see [components.md](references/components.md)**

---

## 3. Locomotion Selection

### Mobile Robots

| Type                     | Terrain       | Accuracy | Complexity | Use Cases                      |
| ------------------------ | ------------- | -------- | ---------- | ------------------------------ |
| **Differential Drive**   | Flat          | Medium   | Low        | Indoor warehouses              |
| **Ackermann (Car-like)** | Flat/outdoor  | High     | Medium     | Outdoor delivery               |
| **Mecanum/Omni**         | Flat          | Medium   | Highโ      | Tight spaces, sideway movement |
| **Tracked**              | Rough terrain | Low      | Medium     | Outdoor, uneven ground         |
| **Legged (Quadruped)**   | Very rough    | Medium   | Very High  | Stairs, obstacles              |

### Navigation Methods

- **AGV (Automated Guided Vehicle)**: Magnetic tape, wire-guided (fixed paths)
- **AMR (Autonomous Mobile Robot)**: SLAM, vision (flexible paths)
- **Hybrid**: Combination of both

---

## 4. Industrial Automation Architecture (ISA-95)

### Automation Pyramid

```
Level 4: Enterprise (ERP)
          ↓
Level 3: MES (Manufacturing Execution)
          ↓
Level 2: SCADA/HMI (Supervision)
          ↓
Level 1: PLC/DCS (Control)
          ↓
Level 0: Sensors/Actuators (Field Devices)
```

### Control System Selection

| System                 | Complexity | Cost       | Flexibility | Use Cases              |
| ---------------------- | ---------- | ---------- | ----------- | ---------------------- |
| **Relay Logic**        | Very Low   | Low        | Very Low    | Simple ON/OFF          |
| **PLC (Ladder)**       | Low        | Medium     | Medium      | Discrete manufacturing |
| **PLC (ST/FBD)**       | Medium     | Medium     | High        | Process control        |
| **DCS**                | High       | High       | High        | Continuous processes   |
| **PAC**                | High       | High       | Very High   | Motion + process       |
| **PC-Based (TwinCAT)** | Medium     | Low-Medium | Very High   | Motion control, custom |

**For PLC programming and SCADA details, see [plc-scada.md](references/plc-scada.md)**

---

## 5. Communication Protocols

### Protocol Selection Matrix

| Need                   | Protocol    | Speed     | Distance     | Devices        |
| ---------------------- | ----------- | --------- | ------------ | -------------- |
| **Simple device**      | Modbus RTU  | 19.2 kbps | 1200m        | 247            |
| **Ethernet-based**     | Modbus TCP  | 100 Mbps  | Network      | Unlimited      |
| **Siemens ecosystem**  | PROFINET    | 100 Mbps+ | 100m/segment | 512            |
| **Rockwell ecosystem** | EtherNet/IP | 100 Mbps  | 100m/segment | Large          |
| **Cross-platform**     | OPC UA      | Variable  | Network      | Unlimited      |
| **Sensor level**       | IO-Link     | 230 kbps  | 20m          | Point-to-point |

---

## 6. Design Workflow

### Phase 1: Requirements Analysis

**Questions to Ask:**

1. What is the task? (pick, place, assemble, inspect, transport)
2. What are the objects? (weight, size, material, fragility)
3. Cycle time requirement?
4. Accuracy/repeatability requirement?
5. Environment? (temperature, cleanliness, safety)
6. Integration needs? (existing systems, data exchange)

### Phase 2: Conceptual Design

1. **Robot selection** (see section 1)
2. **End effector design** (gripper type)
3. **Workspace layout** (reach analysis, collision avoidance)
4. **Safety assessment** (risk analysis, ISO 13849)

### Phase 3: Detailed Design

1. **Component specification** (motors, sensors, controllers)
2. **Control architecture** (PLC program structure)
3. **Network design** (topology, redundancy)
4. **HMI design** (operator interface)

### Phase 4: Implementation

1. **Mechanical assembly**
2. **Electrical wiring** (follow schematics)
3. **PLC programming** (ladder, ST, FBD)
4. **HMI development**
5. **Network configuration**

### Phase 5: Commissioning

1. **FAT (Factory Acceptance Test)**
2. **SAT (Site Acceptance Test)**
3. **Operator training**
4. **Documentation handover**

**For commissioning details, see [integration.md](references/integration.md)**

---

## 7. Safety Standards

### Risk Assessment (ISO 12100)

1. **Identify hazards** (crushing, cutting, collision)
2. **Estimate risk** (severity × probability)
3. **Reduce risk** (eliminate → guards → warnings)
4. **Verify** (validate residual risk acceptable)

### Safety Levels

| Level       | Application    | Examples                      |
| ----------- | -------------- | ----------------------------- |
| **PLa-PLb** | Slight injury  | Light curtains (non-critical) |
| **PLc**     | Serious injury | Two-hand control              |
| **PLd**     | Serious injury | Safeguarded robot cells       |
| **PLe**     | Death          | Critical safety systems       |

### Collaborative Robots (ISO/TS 15066)

**Safety Functions:**

- Safety-rated monitored stop
- Hand guiding
- Speed and separation monitoring
- Power and force limiting

---

## 8. Programming Approaches

### Robot Programming Methods

| Method                  | Flexibility | Programming Time | Use Cases                 |
| ----------------------- | ----------- | ---------------- | ------------------------- |
| **Teach Pendant**       | Low         | Fast             | Repetitive tasks          |
| **Offline Programming** | High        | Medium           | Complex paths, simulation |
| **Vision-Guided**       | Very High   | Medium           | Variable positions        |
| **Force-Guided**        | High        | Long             | Assembly, polishing       |

### PLC Programming Languages (IEC 61131-3)

- **Ladder Logic (LD)**: Simple Boolean, relay replacement
- **Function Block (FBD)**: Process control, reusable blocks
- **Structured Text (ST)**: Complex algorithms, loops
- **Sequential Function Chart (SFC)**: State machines, batch
- **Instruction List (IL)**: Low-level (rarely used)

---

## 9. System Integration

### IT/OT Integration

```
ERP (SAP, Oracle)
      ↓
MES (Production Management)
      ↓
SCADA (Visualization)
      ↓
PLC (Control)
      ↓
Field Devices
```

### Data Flow

- **Upward**: Sensor data → PLC → SCADA → MES → ERP
- **Downward**: Production orders → MES → SCADA → PLC setpoints

**For integration procedures, see [integration.md](references/integration.md)**

---

## 10. Common Design Patterns

### Pattern 1: Conveyor Control

**Components:**

- Motor (VFD or contactor)
- Proximity sensors (part detection)
- PLC logic (interlock, sequence)

**Logic:**

```
IF (upstream_ready AND downstream_clear AND no_fault) THEN
    Run_Conveyor = TRUE
ELSE
    Run_Conveyor = FALSE
END_IF
```

### Pattern 2: Pick-and-Place

**Steps:**

1. Home position
2. Move to pick location (vision-guided)
3. Close gripper
4. Verify grip (vacuum/force sensor)
5. Move to place location
6. Open gripper
7. Return to home

### Pattern 3: Palletizing

**Pattern generation:**

- Layer pattern definition (e.g., 4x3 grid)
- Z-height increment per layer
- Rotation (if needed)

---

## 11. Performance Metrics

### OEE (Overall Equipment Effectiveness)

```
OEE = Availability × Performance × Quality

Availability = Uptime / Planned Production Time
Performance = Actual Output / Theoretical Max Output
Quality = Good Parts / Total Parts
```

**Target**: 85%+ (world-class)

### Cycle Time Optimization

1. **Minimize travel distance** (optimize layout)
2. **Parallel operations** (multi-robot, overlapping)
3. **Tune motion profiles** (acceleration, jerk limits)
4. **Reduce non-value time** (grippening/release)

---

## 12. Quick Start Checklist

- [ ] Define task and requirements
- [ ] Select robot type and size (section 1)
- [ ] Choose sensors and actuators (section 2)
- [ ] Design workspace layout
- [ ] Conduct safety risk assessment (section 7)
- [ ] Select control architecture (PLC, DCS, PAC)
- [ ] Design network topology
- [ ] Program PLC logic
- [ ] Develop HMI
- [ ] Plan commissioning (FAT, SAT)
- [ ] Prepare documentation

---

## 13. Common Pitfalls

| Problem                     | Solution                                 |
| --------------------------- | ---------------------------------------- |
| **Under-spec'd robot**      | Add safety margin (1.5-2x payload/speed) |
| **Poor cable management**   | Use cable carriers, strain relief        |
| **No redundancy**           | Add backup for critical systems          |
| **Inadequate grounding**    | Proper grounding reduces EMI issues      |
| **Skipped risk assessment** | Always perform before commissioning      |
| **No documentation**        | Maintain as-built drawings, backups      |

---

> **Philosophy:** Safety first, then reliability, then performance. Design for maintenance from day one.

## References

- [plc-scada.md](references/plc-scada.md) - PLC programming, SCADA platforms, protocols
- [components.md](references/components.md) - Sensors, actuators, grippers, motion control
- [integration.md](references/integration.md) - Commissioning, testing, troubleshooting
