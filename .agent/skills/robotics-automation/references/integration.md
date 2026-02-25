# System Integration & Commissioning

## Integration Layers

### Information Technology (IT) Integration

**ERP Systems:**

- SAP, Oracle, Microsoft Dynamics
- Production orders, material requirements
- Real-time inventory updates

**MES (Manufacturing Execution System):**

- Production scheduling
- Quality management
- Track & trace
- OEE (Overall Equipment Effectiveness)

**Databases:**

- SQL Server, PostgreSQL
- Historical data storage
- Production records

### Operational Technology (OT) Integration

**SCADA to PLC:**

- OPC UA (preferred, secure)
- Modbus TCP
- Proprietary protocols

**PLC to Field Devices:**

- EtherNet/IP, PROFINET (industrial Ethernet)
- DeviceNet, PROFIBUS (fieldbus)
- IO-Link (sensor level)

**Robot Integration:**

- EtherNet/IP for Universal Robots, Fanuc
- PROFINET for KUKA, ABB
- Custom interfaces (socket communication)

##Commissioning Phases

### Phase 1: Pre-Commissioning (FAT - Factory Acceptance Test)

**Documents Preparation:**

- [ ] Electrical schematics reviewed
- [ ] P&ID (Process & Instrumentation Diagram)
- [ ] I/O list verified
- [ ] Network topology documented
- [ ] Safety risk assessment completed

**Hardware Checks:**

- [ ] Power quality (voltage, frequency)
- [ ] Grounding and bonding
- [ ] Cable continuity tests
- [ ] Sensor calibration certificates
- [ ] Motor insulation resistance

**Software:**

- [ ] PLC program uploaded and backed up
- [ ] HMI screens functional
- [ ] Alarm configurations tested
- [ ] Data logging verified

### Phase 2: Dry Run (No Load Testing)

**Steps:**

1. Energize control panels (no field devices)
2. Test interlocks and safety circuits
3. Verify I/O signals (simulation mode)
4. Test HMI navigation and alarms
5. Check network communication
6. Simulate production sequences

**Safety Functionality:**

- Emergency stops functional
- Light curtains operational
- Lockout/tagout procedures tested

### Phase 3: Wet Commissioning (SAT - Site Acceptance Test)

**With Load:**

1. Connect and power field devices
2. Jog motors individually (low speed)
3. Run automated sequences (low speed)
4. Gradually increase to production speed
5. Run full production cycle
6. Monitor performance metrics

**Tuning:**

- PID loop tuning (temperature, pressure, flow)
- Motion profile optimization
- Sensor threshold adjustments
- Communication timeout settings

### Phase 4: Production Ramp-Up

**Validation:**

- Produce first articles
- Quality inspection
- Statistical process control (SPC)
- OEE measurement
- Operator training

**Handover:**

- Documentation package (as-built drawings)
- Maintenance manuals
- Spare parts list
- Training completion certificates

## Testing Methodologies

### Functional Testing

**Positive Testing:**

- Normal operating scenarios
- Expected inputs
- Standard sequences

**Negative Testing:**

- Out-of-range inputs
- Communication failures
- Power loss scenarios
- Emergency stop during operation

### Performance Testing

**Metrics:**

- Cycle time (actual vs. spec)
- Throughput (parts per hour)
- Accuracy/repeatability
- Energy consumption

**Tools:**

- Data loggers
- Power analyzers
- Vibration sensors
- Thermal cameras

### Safety Testing

**Required Tests:**

- Emergency stop response time (< 1 second)
- Two-hand control functionality
- Safety relay monitoring
- Light curtain mute function (if applicable)
- Risk reduction verification (SIL/PLd validation)

## Network Configuration

### Industrial Network Design

**Segmentation:**

```
Enterprise VLAN (10.0.0.0/24)
    ↓
Firewall (DMZ)
    ↓
SCADA VLAN (192.168.1.0/24)
    ↓
Control VLAN (192.168.10.0/24)
    ↓
Field Device VLAN (192.168.100.0/24)
```

**Best Practices:**

- Separate IT and OT networks (air gap or firewall)
- Use managed switches with VLAN support
- Implement redundant ring topology (for critical systems)
- QoS (Quality of Service) for real-time traffic
- Static IP addressing for critical devices

### Redundancy Strategies

**Network Redundancy:**

- MRP (Media Redundancy Protocol)
- RSTP (Rapid Spanning Tree)
- Parallel redundancy (seamless failover)

**Controller Redundancy:**

- Hot standby (automatic switchover)
- Warm standby (manual switchover)
- Load sharing (distributed control)

##Troubleshooting Procedures

### Systematic Approach

**1. Gather Information:**

- When did the problem start?
- What changed recently?
- Can the problem be reproduced?
- Error codes/alarms

**2. Isolate:**

- Which subsystem (mechanical, electrical, software)?
- Single device or system-wide?
- Intermittent or persistent?

**3. Diagnose:**

- Check diagnostics (PLC fault logs)
- Monitor communication (Wireshark)
- Visual inspection
- Test individual components

**4. Repair:**

- Replace faulty components
- Update firmware/software
- Recalibrate sensors
- Reset configurations

**5. Verify:**

- Test fix under normal conditions
- Run full production cycle
- Monitor for recurrence

### Common Issues & Solutions

| Issue                       | Possible Causes                          | Solutions                                      |
| --------------------------- | ---------------------------------------- | ---------------------------------------------- |
| **Communication loss**      | Cable damage, IP conflict, timeout       | Check cables, ping test, verify settings       |
| **Erratic sensor readings** | EMI, loose wiring, calibration           | Shield cables, check terminations, recalibrate |
| **Motor overheating**       | Overload, poor ventilation, high ambient | Reduce load, add cooling, check current        |
| **Intermittent faults**     | Loose connections, EMI, grounding        | Tighten terminals, add filters, verify ground  |
| **Safety circuit fault**    | Wiring, component failure, E-stop        | Test continuity, replace relays, reset E-stop  |

## Documentation Standards

### Required Documents

**Design Phase:**

- System architecture diagram
- Electrical schematics (AutoCAD Electrical, EPLAN)
- P&ID (for processes)
- Network topology
- Bill of Materials (BOM)

**Implementation Phase:**

- PLC program (with version control)
- HMI screenshots
- As-built drawings (changes highlighted)
- Configuration backups

**Maintenance Phase:**

- Preventive maintenance schedule
- Spare parts list
- Troubleshooting guide
- Contact list (vendors, integrators)

### Version Control Best Practices

- Use consistent naming (ProjectName_v1.0_Date)
- Tag major releases
- Keep changelog
- Back up before every download to PLC
- Store in centralized repository (Git, TIA Portal teamwork)

## Performance Optimization

### OEE Improvement

**OEE = Availability × Performance × Quality**

**Availability:**

- Reduce downtime (MTBF/MTTR)
- Improve changeover time
- Predictive maintenance

**Performance:**

- Optimize cycle time
- Reduce micro-stops
- Tune motion profiles

**Quality:**

- Statistical process control (SPC)
- Real-time quality checks
- Root cause analysis

### Energy Efficiency

- Variable frequency drives (VFDs) for fans, pumps
- Regenerative braking (servo systems)
- Power monitoring (identify waste)
- Scheduled equipment shutdown (idle periods)
- Compressed air leak detection

## Safety Certifications

### Standards

- **ISO 13849**: Safety of machinery (PLa to PLe)
- **IEC 62061**: Functional safety (SIL 1 to SIL 3)
- **IEC 61508**: General functional safety
- **ISO 10218**: Industrial robots
- **ISO/TS 15066**: Collaborative robots

### Documentation for Certification

- Risk assessment
- Safety concept
- Safety validation report
- Maintenance procedures
- Operator training records
