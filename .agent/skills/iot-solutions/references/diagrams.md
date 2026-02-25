# IoT Solution Design & Diagrams

## Architecture Patterns

### 1. Edge-Cloud Architecture

```
┌──────────────┐
│ Cloud Layer  │ (Analytics, Storage, ML)
└──────┬───────┘
       │ (MQTT/HTTP/OPC UA)
┌──────┴──────────┐
│ Gateway/Edge    │ (Protocol translation, edge processing)
└──────┬──────────┘
       │ (Modbus/BLE/Zigbee/LoRa)
┌──────┴──────────┐
│ Device Layer    │ (Sensors, Actuators)
└─────────────────┘
```

**Use When:**

- Need local processing (latency-sensitive)
- Intermittent connectivity
- Large volumes of data (filter at edge)

### 2. Direct Cloud Connection

```
Devices (Wi-Fi/4G) ──→ Cloud Platform

Examples:
- ESP32 → AWS IoT Core
- Cellular module → Azure IoT Hub
```

**Use When:**

- Devices have internet connectivity
- Simple architecture preferred
- Cloud-native applications

### 3. Mesh Network

```
       Coordinator
      /    |    \
   Router Router Router
   /  \    |    /  \
  ED  ED  ED  ED  ED

ED = End Device (sensor/actuator)
```

**Use When:**

- Home/building automation
- Need self-healing network
- Zigbee, Thread, BLE Mesh

---

## Cloud Platform Selection

| Platform             | Strengths                 | Use Cases                   | Pricing Model              |
| -------------------- | ------------------------- | --------------------------- | -------------------------- |
| **AWS IoT Core**     | Comprehensive, scalable   | Enterprise IoT              | Pay per message            |
| **Azure IoT Hub**    | Microsoft ecosystem       | Enterprise, hybrid          | Per device/month           |
| **Google Cloud IoT** | ML integration            | AI/ML-driven IoT            | Per MB transferred         |
| **ThingsBoard**      | Open source, customizable | SMB, custom solutions       | Free (self-hosted) or SaaS |
| **Blynk**            | Easy mobile app           | Hobbyist, rapid prototyping | Freemium                   |
| **Ubidots**          | Quick setup, dashboards   | Industrial monitoring       | Per device/month           |

---

## Diagram Design Guidelines

### System Architecture Diagram

**Elements to Include:**

- Device layer (sensors, actuators)
- Gateway/edge layer
- Network protocols (labels on connections)
- Cloud services (storage, analytics, APIs)
- User interfaces (mobile, web)

**Example:**

```
[Temp Sensor] ─(MQTT)→ [Edge Gateway] ─(HTTPS)→ [Cloud]
[Door Lock]   ─(BLE)──→     │                       │
                            └──(WebSocket)──→ [Dashboard]
```

### Network Topology Diagram

**Showึ:**

- Device IP addresses/IDs
- Switches, routers, firewalls
- VLANs (if segmented)
- Wireless access points

### Data Flow Diagram

**Stages:**

1. **Collect**: Sensors→ Gateway
2. **Process**: Edge processing, filtering
3. **Transmit**: Gateway → Cloud
4. **Store**: Database (time-series, SQL)
5. **Analyze**: Analytics, ML models
6. **Visualize**: Dashboards, alerts
7. **Act**: Commands → Actuators

---

## Edge Computing Patterns

### When to Use Edge

- **Latency-critical**: < 100ms response (industrial control)
- **Bandwidth-constrained**: Limited or expensive internet
- **Privacy/compliance**: Data must stay local
- **Resilience**: Must work when cloud unavailable

### Edge Processing Examples

**Data Aggregation:**

```python
# Send average every 5 minutes instead of 300 data points
averaged_data = sum(buffer) / len(buffer)
send_to_cloud(averaged_data)
```

**Anomaly Detection:**

```python
if sensor_value > threshold:
    send_alert_to_cloud()
    # Local action (turn on fan)
```

**ML Inference:**

- Run TensorFlow Lite models on edge
- Classify images locally
- Send only results to cloud

---

## Security Architecture

### Defense in Depth

**Layer 1: Device**

- Secure boot
- Encrypted storage
- Unique device credentials

**Layer 2: Network**

- TLS/DTLS encryption
- VPN or private network
- Firewall rules

**Layer 3: Application**

- Authentication (OAuth, JWT)
- Authorization (RBAC)
- API rate limiting

**Layer 4: Data**

- Encryption at rest
- Encryption in transit
- Access logs and audits

---

## Scalability Considerations

### Horizontal Scaling

**Device Growth:**

- Use load balancers
- Database sharding (by device ID)
- Message queue (Kafka, RabbitMQ)

**Example:**

```
1-100 devices → Single MQTT broker
100-10k devices → Clustered brokers
10k+ devices → Cloud managed (AWS IoT Core)
```

### Vertical Scaling

- Upgrade server CPU/RAM
- Optimize queries (indexing)
- Use caching (Redis)

---

## Power Budget Design

### Power Consumption Analysis

**Components:**
| Component | Active (mA) | Sleep (μA) | Duty Cycle |
|-----------|-------------|------------|------------|
| ESP32 | 160 | 10 | 1% active |
| Sensor (DHT22) | 1.5 | 0.15 | 0.1% active |
| Total | ~3 mA average | - | - |

**Battery Life:**

```
2000 mAh / 3 mA = 667 hours (~28 days)
```

### Optimizations

- Deep sleep between readings
- Wake on interrupt (motion sensor)
- Reduce transmission frequency
- Use lower power radio (LoRa vs. Wi-Fi)

---

## Reliability & Redundancy

### Patterns

**Device Redundancy:**

- Multiple sensors for critical measurements
- Voting/averaging algorithms

**Network Redundancy:**

- Dual connectivity (Wi-Fi + 4G)
- Mesh self-healing

**Cloud Redundancy:**

- Multi-region deployment
- Database replication
- Automated fail-over

### Monitoring

- Heartbeat messages (every X minutes)
- LWT (Last Will Testament) in MQTT
- Cloud-side device status tracking

---

## Example: Smart Building IoT Architecture

```
┌─────────────────────┐
│   Cloud Platform    │ (AWS IoT/Azure/ThingsBoard)
│ - Time-series DB    │
│ - Analytics Engine  │
│ - Dashboard         │
└──────────┬──────────┘
           │ HTTPS/MQTT
┌──────────┴──────────┐
│   Edge Gateway      │ (Raspberry Pi 4)
│ - MQTT Broker       │
│ - Node-RED          │
│ - Local DB (cache)  │
└─┬─────────┬─────────┘
  │ Modbus  │ Zigbee
┌─┴─────┐ ┌─┴──────────┐
│ HVAC  │ │ Sensors    │
│ (PLC) │ │ - Temp     │
│       │ │ - Humidity │
│       │ │ - Occupancy│
└───────┘ └────────────┘
```

**Data Flows:**

1. Sensors → Zigbee → Gateway (every 1 min)
2. Gateway aggregates → Cloud (every 5 min)
3. HVAC status → Modbus → Gateway → Cloud
4. Cloud analytics → Optimize HVAC setpoints
5. Commands → Gateway → HVAC

---

## Diagram Tools

| Tool           | Type             | Use Cases                   |
| -------------- | ---------------- | --------------------------- |
| **draw.io**    | Free, web-based  | General diagrams            |
| **Lucidchart** | Commercial       | Professional diagrams       |
| **PlantUML**   | Text-based       | Version-controlled diagrams |
| **Mermaid**    | Markdown-based   | Documentation               |
| **Visio**      | Microsoft        | Enterprise architecture     |
| **Fritzing**   | Circuit diagrams | Hardware wiring             |

---

## Best Practices Checklist

- [ ] Show all communication protocols
- [ ] Label data flows with direction
- [ ] Include security layers (TLS, VPN)
- [ ] Specify cloud services used
- [ ] Document IP addressing scheme
- [ ] Show redundancy (if applicable)
- [ ] Include power source for battery devices
- [ ] Legend for symbols/icons
- [ ] Version and date on diagram
