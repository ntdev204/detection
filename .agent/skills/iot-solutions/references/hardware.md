# IoT Hardware - Deep Dive

## Microcontrollers (MCU)

| MCU                            | Architecture        | Clock   | RAM    | Flash        | GPIO | Price | Use Cases             |
| ------------------------------ | ------------------- | ------- | ------ | ------------ | ---- | ----- | --------------------- |
| **ESP32**                      | Xtensa dual-core    | 240 MHz | 520 KB | 4-16 MB      | 34   | $2-5  | Wi-Fi/BLE projects    |
| **ESP8266**                    | Xtensa single       | 80 MHz  | 80 KB  | 4 MB         | 17   | $1-3  | Budget Wi-Fi          |
| **Arduino Uno (ATmega328P)**   | AVR 8-bit           | 16 MHz  | 2 KB   | 32 KB        | 14   | $3-25 | Learning, simple      |
| **STM32F4**                    | ARM Cortex-M4       | 168 MHz | 192 KB | 1 MB         | 80+  | $5-15 | Industrial, real-time |
| **nRF52840**                   | ARM Cortex-M4       | 64 MHz  | 256 KB | 1 MB         | 48   | $5-10 | BLE, Zigbee, Thread   |
| **Raspberry Pi Pico (RP2040)** | ARM Cortex-M0+ dual | 133 MHz | 264 KB | 2 MB (flash) | 26   | $4    | Budget, PIO           |

## Single-Board Computers (SBC)

| SBC                       | CPU                     | RAM         | Storage   | Networking     | GPIO | Price   | Use Cases                   |
| ------------------------- | ----------------------- | ----------- | --------- | -------------- | ---- | ------- | --------------------------- |
| **Raspberry Pi 4**        | Quad-core ARM A72       | 2-8 GB      | microSD   | Wi-Fi, BT, GbE | 40   | $35-75  | Edge computing, gateways    |
| **Raspberry Pi Zero 2 W** | Quad-core ARM A53       | 512 MB      | microSD   | Wi-Fi, BT      | 40   | $15     | Compact IoT                 |
| **BeagleBone Black**      | Single-core ARM A8      | 512 MB      | 4 GB eMMC | Ethernet       | 92   | $60     | Industrial, real-time (PRU) |
| **NVIDIA Jetson Nano**    | Quad-core ARM A57 + GPU | 2-4 GB      | microSD   | Wi-Fi, GbE     | 40   | $99-149 | AI/ML inference             |
| **Orange Pi**             | Quad-core ARM           | 512 MB-2 GB | microSD   | Varies         | 40   | $10-40  | Budget alternative          |

### MCU vs. SBC Decision

```
Need OS (Linux)?
├─ Yes → SBC (Raspberry Pi, Jetson)
└─ No → MCU (ESP32, STM32)

Need ML inference?
├─ Yes → Jetson Nano, Coral Dev Board
└─ No → Depends on other factors

Power budget?
├─ Battery (<100mW) → MCU with deep sleep
├─ USB power (2.5W) → ESP32, Pico
└─ Wall power (5-15W) → SBC

Real-time critical?
├─ Hard real-time → MCU (bare metal or RTOS)
├─ Soft real-time → SBC with real-time Linux
└─ No real-time → SBC
```

## Sensors

### Environmental Sensors

| Sensor      | Measures                 | Interface | Accuracy             | Price |
| ----------- | ------------------------ | --------- | -------------------- | ----- |
| **DHT22**   | Temp, Humidity           | 1-wire    | ±0.5°C, ±2% RH       | $3-5  |
| **BME280**  | Temp, Humidity, Pressure | I2C/SPI   | ±1°C, ±3% RH, ±1 hPa | $5-10 |
| **SHT31**   | Temp, Humidity           | I2C       | ±0.3°C, ±2% RH       | $5-8  |
| **DS18B20** | Temperature              | 1-wire    | ±0.5°C               | $2-5  |
| **BMP280**  | Pressure, Temp           | I2C/SPI   | ±1 hPa, ±1°C         | $2-5  |

### Motion & Position

| Sensor           | Measures                  | Interface | Range                             | Use Cases                |
| ---------------- | ------------------------- | --------- | --------------------------------- | ------------------------ |
| **MPU6050**      | Accel, Gyro (6-axis)      | I2C       | ±2/4/8/16g, ±250/500/1000/2000°/s | IMU, motion detection    |
| **MPU9250**      | Accel, Gyro, Mag (9-axis) | I2C/SPI   | Same as MPU6050 + mag             | Orientation, AHRS        |
| **VL53L0X**      | Distance (ToF)            | I2C       | 30mm-2m                           | Proximity, level sensing |
| **HC-SR04**      | Distance (ultrasonic)     | GPIO      | 2cm-4m                            | Obstacle avoidance       |
| **GPS (NEO-6M)** | Location                  | UART      | 2.5m CEP                          | Tracking, navigation     |

### Current & Power

| Sensor        | Type                    | Interface   | Range         | Accuracy |
| ------------- | ----------------------- | ----------- | ------------- | -------- |
| **INA219**    | Voltage, Current, Power | I2C         | 0-26V, ±3.2A  | ±0.5%    |
| **ACS712**    | Current (Hall effect)   | Analog      | ±5/20/30A     | 1.5%     |
| **PZEM-004T** | AC Power meter          | UART/Modbus | 80-260V, 100A | 1%       |

### Gas & Air Quality

| Sensor     | Detects                | Interface | Response Time |
| ---------- | ---------------------- | --------- | ------------- |
| **MQ-2**   | Smoke, LPG, CO         | Analog    | 10-20s        |
| **MQ-135** | Air quality (CO2, NH3) | Analog    | Fast          |
| **CCS811** | eCO2, TVOC             | I2C       | 60s           |
| **SGP30**  | eCO2, TVOC             | I2C       | 15s           |

## Communication Modules

### Wireless

| Module            | Protocol            | Range     | Data Rate       | Power          | Price  |
| ----------------- | ------------------- | --------- | --------------- | -------------- | ------ |
| **ESP32**         | Wi-Fi 802.11n, BLE  | 50-100m   | Up to 150 Mbps  | 80-240 mA      | $2-5   |
| **nRF24L01**      | 2.4 GHz proprietary | 100-1000m | 250 kbps-2 Mbps | 11-13 mA       | $1-3   |
| **HC-05/06**      | Bluetooth Classic   | 10-100m   | 2.1 Mbps        | 30-40 mA       | $3-5   |
| **LoRa (SX1276)** | LoRa                | 2-15 km   | 0.3-50 kbps     | 10-120 mA      | $5-10  |
| **SIM800L**       | 2G GSM/GPRS         | Cellular  | Up to 85.6 kbps | 0.5-2A (peaks) | $10-15 |
| **SIM7600**       | 4G LTE              | Cellular  | Up to 150 Mbps  | 0.5-2A         | $30-50 |
| **XBee (Zigbee)** | Zigbee              | 40-1200m  | 250 kbps        | 40-215 mA      | $15-30 |

### Wired

| Interface  | Speed           | Cable                         | Distance      | Devices                   |
| ---------- | --------------- | ----------------------------- | ------------- | ------------------------- |
| **UART**   | 9600-115200 bps | 2-3 wires                     | 15m (typical) | Point-to-point            |
| **I2C**    | 100-400 kHz     | 2 wires (SDA, SCL)            | < 1m          | Multiple (7-bit address)  |
| **SPI**    | 1-50 MHz        | 4 wires (MISO, MOSI, SCK, CS) | < 3m          | Multiple (CS select)      |
| **1-Wire** | 15.4 kbps       | 1 data wire + GND             | 100m          | Multiple (ROM ID)         |
| **RS-485** | Up to 10 Mbps   | 2 wires (differential)        | 1200m         | Multi-drop (32-256 nodes) |

## Power Management

### Power Sources

| Source                 | Voltage              | Capacity       | Use Cases          | Recharge     |
| ---------------------- | -------------------- | -------------- | ------------------ | ------------ |
| **AA Battery**         | 1.5V (alkaline)      | 2000-3000 mAh  | Low-power sensors  | No           |
| **18650 Li-ion**       | 3.7V                 | 2000-3500 mAh  | Portable devices   | Yes          |
| **LiPo Battery**       | 3.7V (1S), 7.4V (2S) | Variable       | Drones, RC         | Yes          |
| **Coin Cell (CR2032)** | 3V                   | 200-240 mAh    | Ultra-low power    | No           |
| **Solar Panel**        | 5-12V                | Variable (mA)  | Continuous outdoor | N/A (source) |
| **USB Power Bank**     | 5V                   | 5000-20000 mAh | Dev/prototype      | Yes          |

### Battery Life Estimation

```
Battery Life (hours) = Battery Capacity (mAh) / Average Current (mA)

Example:
- ESP32 deep sleep: 10 μA
- ESP32 active Wi-Fi: 160 mA
- Duty cycle: 1% active, 99% sleep
- Average current: (0.01 × 160) + (0.99 × 0.01) = 1.6 mA
- With 2000 mAh battery: 2000 / 1.6 = 1250 hours (~52 days)
```

### Regulators

| Type                      | Input     | Output   | Efficiency | Use Cases           |
| ------------------------- | --------- | -------- | ---------- | ------------------- |
| **LM7805 (Linear)**       | 7-35V     | 5V       | 50-60%     | Low noise, simple   |
| **AMS1117 (Linear)**      | Up to 15V | 3.3V/5V  | 60-70%     | Low dropout         |
| **Buck (Switching)**      | Higher V  | Lower V  | 85-95%     | Efficiency critical |
| **Boost (Switching)**     | Lower V   | Higher V | 80-90%     | Battery to 5V/12V   |
| **LiPo Charger (TP4056)** | 5V        | 4.2V     | N/A        | Charge Li battery   |

## Storage & Logging

### Local Storage

| Type                | Capacity   | Interface   | Speed                  | Use Cases          |
| ------------------- | ---------- | ----------- | ---------------------- | ------------------ |
| **EEPROM (24C256)** | 32 KB      | I2C         | Slow                   | Config, small data |
| **SD Card**         | MB to GB   | SPI/SD mode | Fast                   | Data logging       |
| **Flash (W25Q64)**  | 8 MB       | SPI         | Fast                   | Firmware, cache    |
| **FRAM (MB85RS)**   | 32-1024 KB | SPI/I2C     | Fast, unlimited writes | Real-time logging  |

### Cloud Storage

- **MQTT Broker**: Mosquitto, HiveMQ
- **Time-Series DB**: InfluxDB, TimescaleDB
- **Cloud Platforms**: AWS IoT, Azure IoT, ThingsBoard

## Development Boards Ecosystems

### Arduino Ecosystem

**Strengths:**

- Beginner-friendly
- Huge library support
- Large community

**Boards:**

- Uno (learning)
- Mega (more I/O)
- Nano (compact)
- MKR series (IoT-ready)

### ESP Ecosystem

**Strengths:**

- Built-in Wi-Fi/BLE
- Low cost
- Arduino/MicroPython/ESP-IDF support

**Boards:**

- ESP8266 (budget Wi-Fi)
- ESP32 (full-featured)
- ESP32-S2/S3/C3 (variants)

### STM32 Ecosystem

**Strengths:**

- Industrial-grade
- Real-time performance
- HAL library support

**Boards:**

- Nucleo series
- Discovery series
- Blue Pill (cheap dev board)

### Raspberry Pi Ecosystem

**Strengths:**

- Full Linux OS
- Powerful (for SBC)
- Huge community

**Boards:**

- Pi 4 (flagship)
- Pi Zero (compact, budget)
- Pico (MCU, different from SBC line)
