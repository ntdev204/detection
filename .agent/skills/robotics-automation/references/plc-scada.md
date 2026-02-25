# PLC & SCADA Systems - Deep Dive

## PLC Programming

### IEC 61131-3 Languages

| Language                            | Type      | Best For                                | Learning Curve |
| ----------------------------------- | --------- | --------------------------------------- | -------------- |
| **Ladder Logic (LD)**               | Graphical | Simple Boolean logic, relay replacement | Easy           |
| **Function Block (FBD)**            | Graphical | Process control, complex logic          | Medium         |
| **Structured Text (ST)**            | Text      | Complex algorithms, data processing     | Medium-Hard    |
| **Sequential Function Chart (SFC)** | Graphical | State machines, batch processes         | Medium         |
| **Instruction List (IL)**           | Text      | Low-level optimization                  | Hard           |

### Ladder Logic Patterns

**Basic ON/OFF Control:**

```
|--[ ]--[ ]--( )--|    // AND logic
|--[/]--[/]--( )--|    // NOT logic
|--[ ]--------------|
|      |--[ ]--( )--|  // OR logic
```

**Latch/Unlatch:**

```
Start ----[ ]----(S)---- Motor
Stop  ----[ ]----(R)---- Motor
```

**Timer Patterns:**

- TON: On-delay (start delay)
- TOF: Off-delay (stop delay)
- TP: Pulse (fixed duration)

### Structured Text Examples

**PID Control Loop:**

```st
Error := Setpoint - ProcessValue;
Integral := Integral + (Error * ScanTime);
Derivative := (Error - LastError) / ScanTime;
Output := (Kp * Error) + (Ki * Integral) + (Kd * Derivative);
LastError := Error;
```

**State Machine:**

```st
CASE State OF
    0: // IDLE
        IF StartButton THEN State := 1; END_IF;
    1: // RUNNING
        Motor := TRUE;
        IF StopButton OR Fault THEN State := 2; END_IF;
    2: // STOPPING
        Motor := FALSE;
        State := 0;
END_CASE
```

## SCADA Architecture

### Layers

```
┌─────────────────────────────┐
│   HMI / Client Workstations │  (Visualization)
├─────────────────────────────┤
│   SCADA Server              │  (Data processing, alarming)
├─────────────────────────────┤
│   OPC Server / IO Gateways  │  (Protocol conversion)
├────────────────────────────┤
│   PLCs / RTUs / Field       │  (Control logic)
│   Devices                   │
└─────────────────────────────┘
```

### SCADA Platforms Comparison

| Platform                   | Strengths                        | Use Cases                   |
| -------------------------- | -------------------------------- | --------------------------- |
| **Wonderware (AVEVA)**     | Industry standard, rich features | Large factories, enterprise |
| **Ignition**               | Web-based, unlimited licensing   | Multi-site, modern UI       |
| **WinCC (Siemens)**        | TIA Portal integration           | Siemens PLC ecosystems      |
| **FactoryTalk (Rockwell)** | Logix integration                | Rockwell PLC ecosystems     |
| **Citect (Schneider)**     | Power utilities focus            | Utilities, infrastructure   |
| **Open Source (ScadaBR)**  | Free, customizable               | Small projects, learning    |

## Communication Protocols

### Modbus

**Modbus RTU (Serial):**

- Baud rate: 9600-115200
- Max devices: 247 per network
- Distance: up to 1200m (RS-485)

**Modbus TCP/IP:**

- Ethernet-based
- Port 502
- Unlimited devices

**Function Codes:**

- 01: Read coils
- 03: Read holding registers
- 05: Write single coil
- 06: Write single register
- 16: Write multiple registers

### EtherNet/IP (Rockwell)

- Industrial Ethernet protocol
- CIP (Common Industrial Protocol) above TCP/IP
- Implicit (real-time) and Explicit messaging
- Used in Allen-Bradley PLCs

### Profinet (Siemens)

- Industrial Ethernet for Siemens
- Real-time communication
- IRT (Isochronous Real-Time) for motion control
- Used in Simatic S7 family

### OPC UA (Open Platform Communications)

**Advantages:**

- Vendor-neutral
- Security (encryption, authentication)
- Platform-independent
- Service-oriented architecture

**Use Cases:**

- SCADA to PLC communication
- Enterprise to plant floor integration
- IoT gateway

### Industrial Protocols Comparison

| Protocol        | Speed                 | Distance         | Topology       | Cost   |
| --------------- | --------------------- | ---------------- | -------------- | ------ |
| **Modbus RTU**  | Low (19.2 kbps)       | 1200m            | Bus            | Low    |
| **Modbus TCP**  | High (100 Mbps)       | Ethernet         | Star           | Low    |
| **Profinet**    | Very High (100 Mbps+) | 100m per segment | Star           | Medium |
| **EtherNet/IP** | High (100 Mbps)       | 100m per segment | Star           | Medium |
| **DeviceNet**   | Medium (500 kbps)     | 500m             | Trunk-drop     | Low    |
| **IO-Link**     | Low (230 kbps)        | 20m              | Point-to-point | Low    |

## PLC Hardware Selection

### Major Manufacturers

| Brand             | Series                     | Use Cases                   |
| ----------------- | -------------------------- | --------------------------- |
| **Siemens**       | S7-1200, S7-1500           | Medium to large automation  |
| **Allen-Bradley** | CompactLogix, ControlLogix | Industrial automation       |
| **Mitsubishi**    | FX, Q Series               | Manufacturing, Asia-Pacific |
| **Omron**         | CP, NJ Series              | Packaging, motion control   |
| **Schneider**     | Modicon M340, M580         | Process automation          |
| **Beckhoff**      | TwinCAT                    | Motion control, PC-based    |

### Micro PLC selection:\n- **Siemens Logo!**, **AB Micro800**: < 20 I/O, simple logic

- **Siemens S7-1200**, **AB CompactLogix**: 20-500 I/O, moderate complexity
- **Siemens S7-1500**, **AB ControlLogix**: > 500 I/O, complex systems, redundancy

## Safety Systems (SIL/PLd)

### Safety Integrity Levels

| SIL Level | Risk Reduction   | Probability of Failure |
| --------- | ---------------- | ---------------------- |
| **SIL 1** | 10x to 100x      | 10⁻¹ to 10⁻²           |
| **SIL 2** | 100x to 1000x    | 10⁻² to 10⁻³           |
| **SIL 3** | 1000x to 10,000x | 10⁻³ to 10⁻⁴           |
| **SIL 4** | > 10,000x        | < 10⁻⁴                 |

### Safety PLCs

- Siemens S7-1500F
- Allen-Bradley GuardLogix
- Pilz PSS 4000

### Safety Patterns

- Emergency stop (Category 0, 1)
- Light curtains
- Safety relays
- Two-hand control
- Speed monitoring

## HMI Design Best Practices

### Principles

- High-contrast displays (dark background, bright text)
- Alarm prioritization (critical, warning, info)
- Consistent navigation
- Quick access to alarms/trends
- Mobile-friendly (responsive design)

### Color Standards

- Red: Emergency stop, critical alarms
- Yellow: Warnings, needs attention
- Green: Normal operation
- Gray: Equipment off
- Blue: Manual mode

### Performance Targets

- Screen load time: < 2 seconds
- Tag update rate: 100-500 ms
- Alarm response: Immediate

## Programming Best Practices

### Scan Cycle

1. Read inputs
2. Execute logic
3. Write outputs
4. Update diagnostics

**Scan time:** Typically 10-50 ms (should be consistent)

### Structuring Code

- Modular programming (functions, function blocks)
- Separate safety logic
- Comment complex logic
- Use symbolic addressing
- Version control (TIA Portal, Studio 5000 built-in)

### Error Handling

- Watchdog timers
- Input validation
- Communication timeouts
- Fall-back modes

## Network Architecture

### Typical Factory Network

```
Enterprise Network (IT)
        |
    Firewall
        |
SCADA / MES Network
        |
    Industrial Switches
   /    |    \
PLC1  PLC2  PLC3
  |     |     |
I/O   I/O   I/O
```

### Network Segmentation

- **Level 4**: Enterprise (ERP, IT systems)
- **Level 3**: Manufacturing operations (MES, SCADA)
- **Level 2**: Supervisory control (HMI, historians)
- **Level 1**: Control (PLC, DCS)
- **Level 0**: Field devices (sensors, actuators)

(Purdue Model / ISA-95)
