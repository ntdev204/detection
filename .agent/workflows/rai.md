---
description: Plan and implement Robotics & AI solutions
---

# /rai - Robotics & AI Solution Builder

Orchestrates AI engineering, robotics automation, IoT, control systems, and ROS2 skills for comprehensive solution development.

---

## Step 1: Requirements Analysis

Ask strategic questions to understand the user's needs:

### Domain Identification

**Questions:**

1. What domain(s) are involved?
    - AI/ML (classification, generation, RL)?
    - Robotics (pick-place, welding, assembly)?
    - IoT (sensors, cloud, edge)?
    - Control systems (PID, fuzzy, MPC)?
    - ROS2 (autonomous robot, distributed system)?
2. What is the end goal?
    - Example: "Build a mobile robot for warehouse automation"
    - Example: "Create an AI vision system for quality inspection"
    - Example: "Implement temperature control using fuzzy logic"

### Skill Routing

Based on domain, route to appropriate skills:

- **AI/ML** → `ai-engineering`
- **Robotics** → `robotics-automation`
- **IoT** → `iot-solutions`
- **Control** → `control-systems`
- **ROS2** → `ros2-humble`

**Multi-domain projects** use multiple skills (e.g., ROS2 robot with AI vision = `ros2-humble` + `ai-engineering`).

---

## Step 2: Architecture Design

### Use Socratic Questions (@brainstorming skill)

Ask:

- What are the system components?
- What hardware is needed?
- What communication protocols?
- What are the constraints? (power, latency, cost)
- What are the failure modes?

### Create Architecture Diagram

**For IoT/Robotics:**

- Use `iot-solutions` references (diagrams.md)
- Show: Devices → Gateway → Cloud
- Label: Protocols, data flows

**For AI/ML:**

- Show: Data → Training → Inference → Deployment
- Use `ai-engineering` references (mlops.md)

**For Control:**

- Show: Controller → Actuator → Plant → Sensor → Controller (feedback loop)

---

## Step 3: Implementation Planning

Use `project-planner` agent to create structured plan:

### Planning Document Structure

```markdown
# [Project Name]

## Overview

[Brief description, goals]

## Requirements

- Functional requirements
- Performance requirements (latency, accuracy, throughput)
- Constraints (power, size, cost)

## Architecture

[Diagram or description]

## Implementation Phases

### Phase 1: [Name]

- [ ] Task 1
- [ ] Task 2

## Verification Plan

- Unit tests
- Integration tests
- Performance benchmarks
```

---

## Step 4: Implementation

### Follow Best Practices from Skills

**AI/ML** (`ai-engineering`):

1. Select framework (PyTorch, TensorFlow, etc.)
2. Prepare data (split, augment)
3. Train model
4. Evaluate and tune
5. Deploy (TF Serving, TorchServe, edge)

**Robotics** (`robotics-automation`):

1. Select robot type and components
2. Design control architecture (PLC, PAC)
3. Program logic (ladder, ST, FBD)
4. Create HMI
5. Commission (FAT, SAT)

**IoT** (`iot-solutions`):

1. Select hardware (MCU/SBC)
2. Choose protocol (MQTT, HTTP, LoRaWAN)
3. Implement edge processing (if needed)
4. Select cloud platform
5. Implement security (TLS, auth)

**Control** (`control-systems`):

1. Model system
2. Select controller (PID, fuzzy, MPC)
3. Design and tune
4. Simulate
5. Discretize and implement

**ROS2** (`ros2-humble`):

1. Create package
2. Implement nodes (pub/sub, service, action)
3. Write launch files
4. Configure parameters
5. Test and visualize (RViz, Gazebo)

---

## Step 5: Verification

### Testing Strategy

**Unit Testing:**

- Individual components
- Mock dependencies

**Integration Testing:**

- Component interfaces
- End-to-end data flow

**Performance Testing:**

- Latency benchmarks
- Throughput tests
- Load testing (for IoT/cloud)

**Safety/Compliance:**

- Control systems: Stability margins
- Robotics: Safety standards (ISO 13849, ISO 10218)
- AI: Bias/fairness testing

### Use Skill-Specific Verification

- **AI**: Evaluate on test set, analyze errors
- **Robotics**: FAT (Factory Acceptance Test), SAT (Site Acceptance Test)
- **IoT**: Measure power consumption, test connectivity
- **Control**: Step response, Bode plots, stability margins
- **ROS2**: `ros2 bag` record/play, `rqt_graph`, performance profiling

---

## Step 6: Deployment

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Documentation complete (README, API docs, wiring diagrams)
- [ ] Safety systems verified
- [ ] Backup/rollback plan ready
- [ ] Monitoring configured

### Deployment Patterns

**AI/ML:**

- Cloud: AWS IoT, Azure, GCP
- Edge: TFLite, ONNX Runtime
- Monitoring: Model drift detection

**Robotics:**

- Commission on-site
- Train operators
- Handover documentation

**IoT:**

- Provision devices
- OTA update capability
- Monitor heartbeats

**Control:**

- Deploy to PLC/controller
- Backup original program
- Monitor stability

**ROS2:**

- Deploy to robot/edge computer
- Configure DDS (domain ID, QoS)
- Set up remote monitoring

---

## Common Patterns

### Pattern 1: AI Vision + Robotics

```
Skills: ai-engineering + robotics-automation (+ ros2-humble if ROS2)

Flow:
1. Train vision model (ai-engineering)
2. Deploy on edge (TFLite/ONNX)
3. Integrate with robot controller (robotics-automation)
4. Implement pick-and-place logic
5. Test end-to-end
```

### Pattern 2: IoT + Control System

```
Skills: iot-solutions + control-systems

Flow:
1. Select sensors/actuators (iot-solutions)
2. Choose communication (MQTT, Modbus)
3. Design controller (PID, fuzzy) (control-systems)
4. Implement edge processing (if needed)
5. Deploy cloud monitoring
```

### Pattern 3: Autonomous Robot (ROS2 + AI + Control)

```
Skills: ros2-humble + ai-engineering + control-systems

Flow:
1. Set up ROS2 workspace (ros2-humble)
2. Implement navigation stack (Nav2)
3. Train perception model (ai-engineering: object detection)
4. Implement motion control (control-systems: PID for motors)
5. Integrate all in ROS2 nodes
6. Test in Gazebo, deploy to robot
```

### Pattern 4: Industrial Automation (Robotics + Control + IoT)

```
Skills: robotics-automation + control-systems + iot-solutions

Flow:
1. Design PLC logic (robotics-automation)
2. Implement process control (control-systems)
3. Add IoT monitoring (iot-solutions: MQTT to cloud)
4. Create SCADA HMI
5. Commission system
```

---

## Troubleshooting

### Multi-Skill Integration Issues

| Issue                           | Skills Involved                     | Solution                                                |
| ------------------------------- | ----------------------------------- | ------------------------------------------------------- |
| **ROS2 + AI latency**           | ros2-humble, ai-engineering         | Use composable nodes, optimize model (quantization)     |
| **IoT + Control stability**     | iot-solutions, control-systems      | Ensure sampling time consistency, handle network delays |
| **Robot + Vision coordination** | robotics-automation, ai-engineering | Calibrate transforms, synchronize timestamps            |

---

## Best Practices

1. **Start simple**: Prototype with 1 component at a time
2. **Test early**: Don't wait for full integration
3. **Document as you go**: Architecture decisions, wiring, configurations
4. **Iterate**: Continuous improvement based on testing
5. **Safety first**: Especially for robotics and control systems
6. **Monitor**: From day one (logging, dashboards)

---

> **Tip:** When stuck, revisit the skill references. Each skill has detailed implementation guides and troubleshooting sections.

## Skill Reference Quick Links

- **AI/ML**: [ai-engineering](../skills/ai-engineering/SKILL.md) → frameworks, architectures, RL, MLOps
- **Robotics**: [robotics-automation](../skills/robotics-automation/SKILL.md) → PLC, SCADA, components, integration
- **IoT**: [iot-solutions](../skills/iot-solutions/SKILL.md) → hardware, protocols, cloud platforms
- **Control**: [control-systems](../skills/control-systems/SKILL.md) → PID, fuzzy, LQR, MPC
- **ROS2**: [ros2-humble](../skills/ros2-humble/SKILL.md) → nodes, topics, services, packages
