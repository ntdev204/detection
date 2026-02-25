# IoT Communication Protocols - Deep Dive

## MQTT (Message Queuing Telemetry Transport)

### Core Concepts

**Publish/Subscribe Pattern:**

```
Publisher → Topic → Broker → Subscribers
```

**QoS Levels:**

| QoS   | Name          | Delivery                          | Use Cases                   |
| ----- | ------------- | --------------------------------- | --------------------------- |
| **0** | At most once  | Fire and forget, no ACK           | Sensor data (tolerate loss) |
| **1** | At least once | Acknowledged, possible duplicates | General telemetry           |
| **2** | Exactly once  | Guaranteed, no duplicates         | Critical commands           |

### Topic Structure

**Best Practices:**

```
device_type/location/device_id/sensor_type

Examples:
- temperature/warehouse/zone1/device001
- actuator/factory/line2/motor_status
- alert/building_a/floor3/fire_alarm
```

**Wildcards:**

- `+`: Single-level wildcard (`temperature/+/zone1`)
- `#`: Multi-level wildcard (`temperature/#`)

### Retained Messages

**Usage:**

- Last known state
- Configuration
- Status ("online"/"offline")

**Example:**

```python
client.publish("device/status", "online", retain=True)
```

### Last Will and Testament (LWT)

**Purpose:** Notify when client disconnects unexpectedly

```python
client.will_set("device/status", "offline", qos=1, retain=True)
```

### Popular Brokers

| Broker            | Type                     | Use Cases                             |
| ----------------- | ------------------------ | ------------------------------------- |
| **Mosquitto**     | Open source, lightweight | Development, small-medium deployments |
| **HiveMQ**        | Enterprise               | Large-scale, clustering               |
| **EMQX**          | Open source, scalable    | IoT platforms, millions of devices    |
| **AWS IoT Core**  | Cloud (managed)          | AWS ecosystem integration             |
| **Azure IoT Hub** | Cloud (managed)          | Azure ecosystem                       |

### Security

**Authentication:**

- Username/password
- TLS client certificates

**Encryption:**

- TLS/SSL (port 8883)

**Authorization:**

- ACL (access control lists) on topics

---

## HTTP/HTTPS (REST APIs)

### Request Methods for IoT

| Method     | Purpose         | Example              |
| ---------- | --------------- | -------------------- |
| **GET**    | Retrieve data   | Get sensor reading   |
| **POST**   | Send data       | Upload telemetry     |
| **PUT**    | Update resource | Update device config |
| **DELETE** | Remove resource | Deregister device    |

### Patterns

**Polling (Pull):**

```
Device → GET /api/config → Server
(Every X seconds)
```

**Webhook (Push):**

```
Device → POST /api/data → Server
Server → POST /webhook/alert → External service
```

### Advantages

- Universal support
- Firewall-friendly (port 80/443)
- Stateless
- Easy debugging (curl, Postman)

### Disadvantages

- Higher overhead than MQTT
- Not optimized for low power
- No built-in pub/sub

---

## CoAP (Constrained Application Protocol)

### Overview

- **UDP-based** (lightweight)
- **RESTful** like HTTP
- **Designed for** constrained devices

### Message Types

| Type    | Description                       |
| ------- | --------------------------------- |
| **CON** | Confirmable (requires ACK)        |
| **NON** | Non-confirmable (fire and forget) |
| **ACK** | Acknowledgement                   |
| **RST** | Reset (error)                     |

### Methods

- GET, POST, PUT, DELETE (like HTTP)

### Observe (Pub/Sub)

**Client can "observe" a resource:**

```
Client → GET /temperature (Observe: yes)
Server → Notifications on changes
```

### DTLS Security

- UDP equivalent of TLS
- Encryption and authentication

### Use Cases

- Battery-powered sensors
- Low-bandwidth networks
- M2M communication

---

## WebSocket

### Full-Duplex Communication

```
Client ↔ Server (Bidirectional, persistent connection)
```

### Use Cases

- Real-time dashboards
- Live telemetry visualization
- Bidirectional control

### Example (JavaScript)

```javascript
const ws = new WebSocket("ws://iot-server:8080");
ws.onmessage = (event) => {
    console.log("Data:", event.data);
};
ws.send('{"sensor":"temp","value":25}');
```

---

## LoRaWAN

### Network Architecture

```
End Devices → Gateways → Network Server → Application Server
```

### Classes

| Class       | Description                    | Use Cases         |
| ----------- | ------------------------------ | ----------------- |
| **Class A** | Lowest power, device-initiated | Sensors (battery) |
| **Class B** | Scheduled downlink             | Actuators         |
| **Class C** | Continuous listen              | Powered devices   |

### Data Rates

- **SF7-SF12** (Spreading Factor): Trade data rate for range
- Higher SF = longer range, lower data rate

### Security

- End-to-end AES-128 encryption
- Device EUI, App EUI, App Key

---

## Zigbee

### Mesh Networking

**Roles:**

- **Coordinator**: Network manager (1 per network)
- **Router**: Relay messages
- **End Device**: Sensors/actuators

### Advantages

- Low power
- Mesh topology (self-healing)
- Good for home automation

### Profiles

- **ZHA** (Zigbee Home Automation)
- **ZLL** (Lighting)
- **ZCL** (Cluster Library)

---

## BLE (Bluetooth Low Energy)

### Architectures

| Type                         | Description                    | Use Cases                           |
| ---------------------------- | ------------------------------ | ----------------------------------- |
| **GATT** (Generic Attribute) | Client-server, characteristics | Wearables, health devices           |
| **Beacon**                   | Broadcast-only                 | Proximity marketing, asset tracking |
| **Mesh**                     | Many-to-many                   | Smart lighting, building automation |

### GATT Structure

```
Service → Characteristic → Descriptor

Example (Heart Rate Service):
- Service UUID:0x180D
  - Characteristic: Heart Rate Measurement (UUID: 0x2A37)
```

### Advertising

- Broadcast name, UUID
- Connection or connectionless

### Power Modes

- **Advertising**: ~10-50 mA (short bursts)
- **Connected**: ~5-15 mA (active)
- **Sleep**: < 10 μA

---

## Modbus

### Variants

| Variant        | Medium          | Use Cases                |
| -------------- | --------------- | ------------------------ |
| **Modbus RTU** | RS-485 (serial) | Industrial sensors, PLCs |
| **Modbus TCP** | Ethernet        | SCADA, factory networks  |

### Function Codes

- 01: Read coils
- 03: Read holding registers
- 05: Write single coil
- 06: Write single register
- 16: Write multiple registers

### IoT Integration

- Modbus → MQTT gateway
- Edge devices translate Modbus to cloud protocols

---

## OPC UA (Unified Architecture)

### Features

- **Platform-independent**
- **Secure** (encryption, authentication)
- **Pub/Sub** or client-server
- **Rich data models**

### Use Cases

- Industrial IoT (IIoT)
- Factory to cloud integration
- SCADA to ERP connectivity

---

## Protocol Selection Matrix

| Need                         | Protocol    | Why                          |
| ---------------------------- | ----------- | ---------------------------- |
| **Low power, long range**    | LoRaWAN     | Battery-powered, km range    |
| **Real-time, bidirectional** | WebSocket   | Live dashboards              |
| **Lightweight pub/sub**      | MQTT        | General IoT telemetry        |
| **Constrained devices**      | CoAP        | UDP, low overhead            |
| **Home automation**          | Zigbee, BLE | Mesh, low power              |
| **Industrial (legacy)**      | Modbus      | Integration with PLCs        |
| **Industrial (modern)**      | OPC UA      | Security, interoperability   |
| **HTTP-based**               | HTTP REST   | Universal, firewall-friendly |

---

## Security Best Practices

### Device-Level

- **Unique credentials** per device
- **Hardware security modules** (HSM) for keys
- **Secure boot** and firmware updates

### Network-Level

- **TLS/DTLS** encryption
- **VPN** or private networks
- **Firewall** rules

### Application-Level

- **Authentication** (API keys, certificates)
- **Authorization** (RBAC)
- **Input validation**

### Common Vulnerabilities

- Default credentials
- Unencrypted communication
- No firmware update mechanism
- Open ports/services
