---
name: iot-solutions
description: IoT architecture, solutions design, and deployment patterns. Hardware selection, communication protocols, cloud platforms, security, and IoT diagram design. Use when designing IoT systems, selecting IoT hardware, planning IoT architecture, or creating IoT solution diagrams.
---

# IoT Solutions

> Systematic approach to designing scalable, secure Internet of Things systems.

## 1. Hardware Selection

### MCU vs. SBC Decision Tree

```
Need full OS (Linux)?
├─ Yes → SBC (Raspberry Pi, Jetson Nano)
└─ No → MCU

Power budget?
├─ Battery (<100mW) → MCU with deep sleep (ESP32, nRF52)
├─ USB power (2.5W) → ESP32, Pico, Arduino
└─ Wall power (5-15W) → SBC

Need ML inference?
├─ Yes → Jetson Nano, Coral Dev Board, ESP32-S3
└─ No → Standard MCU/SBC

Real-time critical?
├─ Hard real-time → MCU (bare metal or RTOS)
└─ Soft/no real-time → SBC or MCU
```

### Quick Hardware Reference

| Use Case                       | Recommended Hardware | Why                                        |
| ------------------------------ | -------------------- | ------------------------------------------ |
| **Wi-Fi sensor**               | ESP32                | Built-in Wi-Fi, low cost, Arduino support  |
| **Battery sensor (long life)** | nRF52 + LoRa         | Ultra-low power, long range                |
| **Edge AI**                    | Jetson Nano, Coral   | GPU/TPU for ML inference                   |
| **Gateway**                    | Raspberry Pi 4       | Linux, multiple interfaces, moderate power |
| **Simple automation**          | Arduino Uno/Nano     | Easy, beginner-friendly                    |
| **Industrial**                 | STM32                | Reliable, real-time, industrial temp range |

**For detailed hardware specs, see [hardware.md](references/hardware.md)**

---

## 2. Architecture Patterns

### Pattern 1: Edge-Cloud (Most Common)

```
Devices → Gateway/Edge → Cloud
```

**Use When:**

- Need local processing (latency < 100ms)
- Intermittent connectivity
- Large data volumes (filter at edge)

### Pattern 2: Direct Cloud

```
Devices (Wi-Fi/4G) → Cloud
```

**Use When:**

- Devices have internet connectivity
- Simple architecture preferred
- Low device count (< 100)

### Pattern 3: Mesh Network

```
Coordinator ← → Routers ← → End Devices
```

**Use When:**

- Home/building automation
- Need self-healing network
- Zigbee, Thread, BLE Mesh

---

## 3. Communication Protocol Selection

| Need                        | Protocol    | Range          | Data Rate   | Power    | Use Cases                |
| --------------------------- | ----------- | -------------- | ----------- | -------- | ------------------------ |
| **General telemetry**       | MQTT        | Network        | Variable    | Medium   | Cloud dashboards, alerts |
| **Low power, long range**   | LoRaWAN     | 2-15 km        | 0.3-50 kbps | Very Low | Agricultural sensors     |
| **Home automation**         | Zigbee, BLE | 10-100m        | 250 kbps    | Low      | Smart home               |
| **Constrained devices**     | CoAP        | Network        | UDP-based   | Low      | Battery-powered sensors  |
| **Universal**               | HTTP REST   | Network        | Variable    | Medium   | Web integration          |
| **Real-time bidirectional** | WebSocket   | Network        | Variable    | Medium   | Live dashboards          |
| **Industrial legacy**       | Modbus      | 1200m (RS-485) | 19.2 kbps   | N/A      | PLC integration          |
| **Industrial modern**       | OPC UA      | Network        | Variable    | N/A      | Factory IIoT             |

**For protocol details (MQTT QoS, CoAP, LoRaWAN classes), see [protocols.md](references/protocols.md)**

---

## 4. Cloud Platform Selection

| Platform             | Strengths                 | Best For                    | Price Model         |
| -------------------- | ------------------------- | --------------------------- | ------------------- |
| **AWS IoT Core**     | Scalable, comprehensive   | Enterprise, large-scale     | Per message         |
| **Azure IoT Hub**    | Microsoft ecosystem       | Enterprise, hybrid cloud    | Per device/month    |
| **Google Cloud IoT** | ML/AI integration         | AI-driven IoT               | Per MB              |
| **ThingsBoard**      | Open source, customizable | SMB, self-hosted            | Free (self) or SaaS |
| **Blynk**            | Easy mobile apps          | Hobbyist, rapid prototyping | Freemium            |

### Self-Hosted vs. Cloud

**Self-Hosted (Raspberry Pi + Mosquitto + InfluxDB):**

- ✅ One-time cost
- ✅ Full control, data privacy
- ❌ Manage infrastructure
- ❌ Limited scalability

**Cloud (AWS IoT, Azure):**

- ✅ Auto-scaling
- ✅ Managed service
- ❌ Ongoing costs
- ❌ Vendor lock-in

---

## 5. Design Workflow

### Phase 1: Requirements

**Questions:**

1. What data to collect? (temperature, motion, etc.)
2. How often? (every second, minute, hour?)
3. How many devices? (10, 100, 10k?)
4. Where deployed? (indoor, outdoor, range?)
5. Power source? (battery, solar, wall power?)
6. Latency requirements? (real-time or batch?)
7. Security requirements? (TLS, VPN, compliance?)

### Phase 2: Architecture Design

1. **Select hardware** (section 1)
2. **Choose protocols** (section 3)
3. **Design topology** (direct, gateway, mesh)
4. **Select cloud platform** (section 4)
5. **Plan security** (section 6)

### Phase 3: Prototyping

- Build 1-device proof-of-concept
- Test end-to-end data flow
- Measure power consumption
- Validate latency

### Phase 4: Scaling

- Test with 10-100 devices
- Load testing
- Database optimization (indexing, sharding)
- Edge processing (if needed)

### Phase 5: Deployment

- Provision devices
- Monitor health (heartbeats)
- OTA firmware updates
- Documentation

**For system diagrams and examples, see [diagrams.md](references/diagrams.md)**

---

## 6. Security Best Practices

### Device-Level

- **Unique credentials** per device (no shared passwords)
- **Secure boot** and encrypted storage
- **OTA updates** with signature verification

### Network-Level

- **TLS/DTLS** for all communication
- **VPN** or private network
- **Firewall** rules (whitelist only)

### Application-Level

- **Authentication**: OAuth, JWT, API keys
- **Authorization**: Role-based access control (RBAC)
- **Input validation**: Prevent injection attacks

### Data-Level

- **Encryption at rest** (database)
- **Encryption in transit** (TLS)
- **Access logs** and auditing

---

## 7. Edge Computing Decisions

### When to Use Edge Processing

```
Latency requirement < 100ms?
├─ Yes → Edge processing required
└─ No → Cloud OK

Bandwidth constrained?
├─ Yes → Aggregate/filter at edge
└─ No → Send raw data

Privacy/compliance?
├─ Yes → Process locally
└─ No → Cloud processing OK

Need offline operation?
├─ Yes → Edge with local DB
└─ No → Cloud dependency OK
```

### Edge Processing Examples

**Data Aggregation:**

```python
# Send average every 5 min instead of 300 points
Send avg(readings) every 5 minutes
```

**Local Decision:**

```python
if temperature > threshold:
    turn_on_fan()  # Immediate local action
    send_alert_to_cloud()  # Also notify cloud
```

**ML Inference:**

- Run TensorFlow Lite on edge
- Classify locally, send results only

---

## 8. Power Budget Design

### Battery Life Calculation

```
Battery Life (hours) = Capacity (mAh) / Avg Current (mA)

Example (ESP32):
- Deep sleep: 10 μA
- Active (Wi-Fi): 160 mA
- Duty cycle: 1% active
- Avg current = 0.01×160 + 0.99×0.01 = 1.6 mA
- 2000 mAh battery: 2000/1.6 = 1250h (~52 days)
```

### Optimization Strategies

1. **Deep sleep** between readings
2. **Reduce transmission** frequency
3. **Use low-power protocol** (LoRa vs. Wi-Fi)
4. **Wake on interrupt** (motion sensor)
5. **Optimize code** (avoid busy loops)

---

## 9. Scalability Considerations

### Device Growth Strategy

| Devices | Architecture            | Database                  | Notes             |
| ------- | ----------------------- | ------------------------- | ----------------- |
| 1-100   | Single MQTT broker      | SQLite, PostgreSQL        | Simple setup      |
| 100-10k | Clustered brokers       | Time-series DB (InfluxDB) | Add load balancer |
| 10k-1M  | Cloud managed (AWS IoT) | Sharded DB, Kafka         | Enterprise scale  |

### Performance Optimization

- **Caching** (Redis) for frequently accessed data
- **Batching** messages (reduce overhead)
- **Indexing** database (device_id, timestamp)
- **Message queue** (Kafka, RabbitMQ) for buffering

---

## 10. Monitoring & Maintenance

### Device Health Monitoring

- **Heartbeat** messages (every X minutes)
- **Last Will Testament** (MQTT LWT)
- **Battery level** reporting
- **Signal strength** (RSSI)

### Alerts

- Device offline > 10 minutes
- Low battery (< 20%)
- Sensor out-of-range values
- Security anomalies

### OTA Updates

- Sign firmware with certificates
- Staged rollout (10% → 50% → 100%)
- Rollback mechanism
- Version tracking

---

## 11. Quick Start Checklist

- [ ] Define requirements (section 5)
- [ ] Select hardware (section 1)
- [ ] Choose communication protocol (section 3)
- [ ] Design architecture (edge vs. cloud)
- [ ] Select cloud platform (section 4)
- [ ] Plan security (TLS, auth)
- [ ] Calculate power budget (section 8)
- [ ] Prototype with 1 device
- [ ] Test scalability (10-100 devices)
- [ ] Implement monitoring
- [ ] Plan OTA updates
- [ ] Document architecture

---

## 12. Common Pitfalls

| Problem                              | Solution                           |
| ------------------------------------ | ---------------------------------- |
| **Underestimated power consumption** | Measure actual, add 50% margin     |
| **No OTA updates**                   | Plan from day one                  |
| **Single point of failure**          | Add redundancy (dual connectivity) |
| **No authentication**                | Always use TLS + auth              |
| **Poor network planning**            | Consider range, obstacles, density |
| **Database not optimized**           | Use time-series DB, index properly |
| **No monitoring**                    | Implement heartbeats, alerts       |

---

> **Philosophy:** Start simple, measure everything, scale incrementally. Security and monitoring are not optional.

## References

- [hardware.md](references/hardware.md) - MCU, SBC, sensors, communication modules
- [protocols.md](references/protocols.md) - MQTT, HTTP, CoAP, LoRaWAN, Zigbee, BLE, Modbus, OPC UA
- [diagrams.md](references/diagrams.md) - Architecture patterns, cloud platforms, diagram examples
