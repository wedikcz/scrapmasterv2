import { ScrapComponent } from '../types/scrap';

export const INITIAL_SCRAP_DATABASE: ScrapComponent[] = [
  {
    id: 'comp-ne555',
    name: 'NE555 Precision Timer IC',
    partNumber: 'NE555P',
    category: 'ic',
    packageType: 'DIP-8 / SOIC-8',
    extractedFrom: 'Old CRT TV chassis / microwave control board / toy siren',
    condition: 'working',
    quantity: 4,
    pinCount: 8,
    pinout: [
      { pin: 1, name: 'GND', type: 'ground', desc: 'Ground reference (0V)' },
      { pin: 2, name: 'TRIG', type: 'input', desc: 'Trigger input (< 1/3 Vcc starts cycle)' },
      { pin: 3, name: 'OUT', type: 'output', desc: 'Output pin (can source/sink up to 200mA)' },
      { pin: 4, name: 'RESET', type: 'input', desc: 'Active-low reset (tie to Vcc if unused)' },
      { pin: 5, name: 'CTRL', type: 'analog', desc: 'Control voltage (bypass with 10nF to GND)' },
      { pin: 6, name: 'THRESH', type: 'input', desc: 'Threshold input (> 2/3 Vcc ends cycle)' },
      { pin: 7, name: 'DISCH', type: 'output', desc: 'Open-collector discharge pin' },
      { pin: 8, name: 'VCC', type: 'power', desc: 'Supply voltage (+4.5V to +16V)' }
    ],
    specs: {
      'Supply Voltage': '4.5V – 16V DC',
      'Max Output Current': '200 mA',
      'Timing Range': 'Microseconds to hours',
      'Operating Frequency': 'Up to 500 kHz'
    },
    testProcedure:
      'Set multimeter to Diode/Continuity. Pin 1 (GND) to Pin 8 (VCC) should measure ~0.6V–0.8V forward drop. With 5V applied and 100k pullup on pin 3, ground Pin 2 briefly; Pin 3 should latch HIGH (~4.8V).',
    salvageValueEstimate: 1.5,
    hazardLevel: 'safe',
    dateAdded: '2026-10-01'
  },
  {
    id: 'comp-lm317',
    name: 'LM317T Adjustable Voltage Regulator',
    partNumber: 'LM317T',
    category: 'power',
    packageType: 'TO-220',
    extractedFrom: 'Old PC power supply / Audio amplifier PSU / CRT board',
    condition: 'working',
    quantity: 3,
    pinCount: 3,
    pinout: [
      { pin: 1, name: 'ADJ', type: 'analog', desc: 'Adjust voltage reference pin (1.25V ref)' },
      { pin: 2, name: 'VOUT', type: 'power', desc: 'Regulated output voltage (Tab is also connected)' },
      { pin: 3, name: 'VIN', type: 'power', desc: 'Unregulated DC input (up to 40V)' }
    ],
    specs: {
      'Output Voltage Range': '1.25V – 37V DC',
      'Max Output Current': '1.5 A (with heatsink)',
      'Dropout Voltage': 'Typically 2.0V – 2.5V',
      'Thermal Protection': 'Internal thermal overload shutdown'
    },
    testProcedure:
      'Check resistance between ADJ and VOUT (nominal internal 1.25V bandgap circuit). Apply 12V to VIN and GND via a 240-ohm resistor between VOUT and ADJ; VOUT should stay at ~1.25V relative to ADJ.',
    salvageValueEstimate: 2.2,
    hazardLevel: 'caution',
    safetyWarning: 'Metal tab is electrically connected to Pin 2 (VOUT). Must insulate with mica washer if mounting to grounded chassis.',
    dateAdded: '2026-10-02'
  },
  {
    id: 'comp-18650',
    name: '18650 Li-Ion Rechargeable Cell (2200mAh)',
    partNumber: 'INR18650-22P',
    category: 'power',
    packageType: 'Cylindrical 18650 (18mm x 65mm)',
    extractedFrom: 'Dead Dell / Lenovo laptop battery pack',
    condition: 'working',
    quantity: 6,
    pinCount: 2,
    pinout: [
      { pin: 1, name: 'BATT+', type: 'power', desc: 'Positive raised top terminal (+3.7V nominal)' },
      { pin: 2, name: 'BATT-', type: 'ground', desc: 'Negative flat bottom terminal (0V)' }
    ],
    specs: {
      'Nominal Voltage': '3.6V – 3.7V',
      'Full Charge Voltage': '4.20V ± 0.05V',
      'Cutoff Discharge Voltage': '2.80V – 3.00V',
      'Estimated Capacity': '2100 – 2400 mAh',
      'Max Continuous Discharge': '5A'
    },
    testProcedure:
      'Measure resting open-circuit voltage with DMM. If cell reads < 2.0V, DO NOT fast-charge (dendrite short risk). If cell is > 3.0V, slow charge to 4.2V using dedicated TP4056 with temperature monitoring.',
    salvageValueEstimate: 5.5,
    hazardLevel: 'dangerous',
    safetyWarning: 'CRITICAL LITHIUM SAFETY: Inspect outer shrink wrap for tears. Never short terminals. Never puncture. Always charge through a BMS / TP4056 module with overcurrent cutoff.',
    dateAdded: '2026-10-04'
  },
  {
    id: 'comp-tp4056',
    name: 'TP4056 1A Li-Ion Charger Board with Protection',
    partNumber: 'TP4056-PROT',
    category: 'power',
    packageType: 'Mini PCB Module (Micro-USB / Type-C)',
    extractedFrom: 'Portable mini desk fan / rechargeable work light',
    condition: 'working',
    quantity: 2,
    pinCount: 6,
    pinout: [
      { pin: 1, name: 'IN+', type: 'power', desc: '+5V USB input power' },
      { pin: 2, name: 'IN-', type: 'ground', desc: 'USB input ground' },
      { pin: 3, name: 'BAT+', type: 'power', desc: 'Connect to 18650 positive (+)' },
      { pin: 4, name: 'BAT-', type: 'ground', desc: 'Connect to 18650 negative (-)' },
      { pin: 5, name: 'OUT+', type: 'power', desc: 'Protected load power output (+)' },
      { pin: 6, name: 'OUT-', type: 'ground', desc: 'Protected load power output (-)' }
    ],
    specs: {
      'Charge Current': '1000 mA (programmable via Rprog resistor)',
      'Charging Precision': '1.5%',
      'Over-discharge Cutoff': '2.5V (DW01 protection IC)',
      'Overcurrent Cutoff': '3A (FS8205A dual MOSFET)'
    },
    testProcedure:
      'Plug into 5V USB charger. Red LED lights indicating charging mode. Green/Blue LED lights when 4.2V battery reaches termination current (~100mA).',
    salvageValueEstimate: 1.8,
    hazardLevel: 'safe',
    dateAdded: '2026-10-05'
  },
  {
    id: 'comp-stepper-dvd',
    name: 'Mini Bipolar Stepper Motor (Linear Lead Screw)',
    partNumber: 'PL15S-020',
    category: 'motor',
    packageType: 'Sled Assembly with Lead Screw (4-wire)',
    extractedFrom: 'Dead Samsung DVD-RW drive optical sled',
    condition: 'working',
    quantity: 2,
    pinCount: 4,
    pinout: [
      { pin: 1, name: 'COIL_A1', type: 'io', desc: 'Phase A Terminal 1 (~10 ohms to A2)' },
      { pin: 2, name: 'COIL_A2', type: 'io', desc: 'Phase A Terminal 2' },
      { pin: 3, name: 'COIL_B1', type: 'io', desc: 'Phase B Terminal 1 (~10 ohms to B2)' },
      { pin: 4, name: 'COIL_B2', type: 'io', desc: 'Phase B Terminal 2' }
    ],
    specs: {
      'Rated Voltage': '5V DC',
      'Step Angle': '18 degrees (20 steps/rev)',
      'Lead Screw Pitch': '3mm travel per revolution',
      'Linear Resolution': '0.15mm per full step (microsteppable to 0.009mm)',
      'Coil Resistance': '10 to 12 Ohms'
    },
    testProcedure:
      'Use DMM set to Resistance (200 ohm range). Probe pin pairs to find two isolated circuits reading ~10 ohms each. Spin lead screw by hand while reading AC mV to verify internal coils produce back-EMF.',
    salvageValueEstimate: 7.0,
    hazardLevel: 'safe',
    dateAdded: '2026-10-03'
  },
  {
    id: 'comp-7805',
    name: 'L7805CV +5V Fixed Linear Regulator',
    partNumber: 'L7805CV',
    category: 'power',
    packageType: 'TO-220',
    extractedFrom: 'Vintage stereo receiver / Broken dot-matrix printer',
    condition: 'working',
    quantity: 4,
    pinCount: 3,
    pinout: [
      { pin: 1, name: 'INPUT', type: 'power', desc: 'Unregulated DC in (+7V to +25V)' },
      { pin: 2, name: 'GND', type: 'ground', desc: 'Common ground (tied to heat-sink tab)' },
      { pin: 3, name: 'OUTPUT', type: 'power', desc: 'Regulated +5.0V output' }
    ],
    specs: {
      'Output Voltage': '4.8V – 5.2V DC',
      'Output Current': '1.5 A max',
      'Dropout Voltage': '2.0V',
      'Short Circuit Protection': 'Internal current limit'
    },
    testProcedure:
      'Supply 9V battery to Pin 1 (IN) and Pin 2 (GND). Measure Pin 3 (OUT) with DMM in DC Volts mode; should read between 4.95V and 5.05V.',
    salvageValueEstimate: 1.2,
    hazardLevel: 'safe',
    dateAdded: '2026-10-02'
  },
  {
    id: 'comp-l298n',
    name: 'L298N Dual Full-Bridge Motor Driver',
    partNumber: 'L298HN',
    category: 'motor',
    packageType: 'Multiwatt-15',
    extractedFrom: 'RC toy car / industrial robotic actuator board',
    condition: 'working',
    quantity: 1,
    pinCount: 15,
    pinout: [
      { pin: 1, name: 'SEN_A', type: 'analog', desc: 'Current sensing resistor connection for Bridge A' },
      { pin: 2, name: 'OUT1', type: 'output', desc: 'Motor A Terminal 1' },
      { pin: 3, name: 'OUT2', type: 'output', desc: 'Motor A Terminal 2' },
      { pin: 4, name: 'VS', type: 'power', desc: 'Motor supply voltage (up to 46V)' },
      { pin: 5, name: 'IN1', type: 'input', desc: 'Logic control input 1' },
      { pin: 6, name: 'ENA', type: 'input', desc: 'Enable PWM speed control for Bridge A' },
      { pin: 7, name: 'IN2', type: 'input', desc: 'Logic control input 2' },
      { pin: 8, name: 'GND', type: 'ground', desc: 'Logic and power ground' },
      { pin: 9, name: 'VSS', type: 'power', desc: 'Logic power supply (+5V)' },
      { pin: 10, name: 'IN3', type: 'input', desc: 'Logic control input 3' },
      { pin: 11, name: 'ENB', type: 'input', desc: 'Enable PWM speed control for Bridge B' },
      { pin: 12, name: 'IN4', type: 'input', desc: 'Logic control input 4' },
      { pin: 13, name: 'OUT3', type: 'output', desc: 'Motor B Terminal 1' },
      { pin: 14, name: 'OUT4', type: 'output', desc: 'Motor B Terminal 2' },
      { pin: 15, name: 'SEN_B', type: 'analog', desc: 'Current sensing resistor connection for Bridge B' }
    ],
    specs: {
      'Operating Supply': 'Up to 46V DC',
      'Total DC Current': '4A peak (2A continuous per channel)',
      'Low Saturation Voltage': 'Bipolar Darlington outputs'
    },
    testProcedure:
      'Check resistance between OUT pins and GND/VS to ensure no shorted transistors. Power VSS with 5V, VS with 12V; pulse IN1/IN2 to check direction reversal on voltmeter.',
    salvageValueEstimate: 4.5,
    hazardLevel: 'caution',
    safetyWarning: 'Requires heatsink under > 0.8A load. Always install flyback diodes (e.g. 1N4007 or fast diodes) across motor terminals if not built into PCB.',
    dateAdded: '2026-10-06'
  },
  {
    id: 'comp-irfz44n',
    name: 'IRFZ44N N-Channel Power MOSFET (55V 49A)',
    partNumber: 'IRFZ44N',
    category: 'power',
    packageType: 'TO-220',
    extractedFrom: 'Car audio amplifier / UPS power inverter board',
    condition: 'working',
    quantity: 4,
    pinCount: 3,
    pinout: [
      { pin: 1, name: 'GATE', type: 'input', desc: 'Gate control (isolated oxide layer)' },
      { pin: 2, name: 'DRAIN', type: 'output', desc: 'Drain power terminal (connected to center pin & tab)' },
      { pin: 3, name: 'SOURCE', type: 'ground', desc: 'Source power terminal (connected to GND/load)' }
    ],
    specs: {
      'Drain-Source Voltage (Vdss)': '55V',
      'Continuous Drain Current (Id)': '49A at 25°C',
      'RDS(on)': '17.5 mOhm max',
      'Gate Threshold Voltage (Vgs(th))': '2.0V – 4.0V'
    },
    testProcedure:
      'Set DMM to Diode mode. Touch black probe to Source, red probe to Drain (reads infinite). Touch red probe momentarily to Gate to charge gate capacitance. Now touch red probe to Drain: MOSFET will show ON state (~0.1V)! Touch black probe to Gate to discharge: it turns OFF immediately.',
    salvageValueEstimate: 2.5,
    hazardLevel: 'safe',
    dateAdded: '2026-10-07'
  },
  {
    id: 'comp-400v-cap',
    name: '400V 470uF High-Voltage Primary Electrolytic Capacitor',
    partNumber: 'CAP-400V-470UF',
    category: 'hazard',
    packageType: 'Snap-in Radial Can (35mm x 50mm)',
    extractedFrom: 'PC ATX Power Supply / CRT TV primary switch-mode stage',
    condition: 'untested',
    quantity: 2,
    pinCount: 2,
    pinout: [
      { pin: 1, name: 'POS (+)', type: 'power', desc: 'Positive terminal' },
      { pin: 2, name: 'NEG (-)', type: 'ground', desc: 'Negative terminal (marked by wide white stripe with "-" signs)' }
    ],
    specs: {
      'Working Voltage': '400V DC (surge 450V)',
      'Capacitance': '470 uF ±20%',
      'Stored Energy': '37.6 Joules (FATAL shock hazard)',
      'Temperature Rating': '105°C'
    },
    testProcedure:
      'STEP 1: NEVER TOUCH TERMINALS! STEP 2: Measure DC voltage with DMM across pins. If > 5V, discharge using a 10k 5W ceramic resistor for 30 seconds. Confirm 0.0V before continuing.',
    salvageValueEstimate: 3.5,
    hazardLevel: 'critical',
    safetyWarning: 'LETHAL STORED CHARGE WARNING: This capacitor can hold up to 340V DC long after the device was unplugged from the wall. Always verify discharge with voltmeter before soldering.',
    dateAdded: '2026-10-08'
  },
  {
    id: 'comp-1n4007',
    name: '1N4007 1000V 1A Silicon Rectifier Diode',
    partNumber: '1N4007',
    category: 'passive',
    packageType: 'DO-41 Axial',
    extractedFrom: 'Any AC-DC power adapter / toaster oven board / microwave',
    condition: 'working',
    quantity: 12,
    pinCount: 2,
    pinout: [
      { pin: 1, name: 'ANODE', type: 'passive', desc: 'Unmarked side (+) positive' },
      { pin: 2, name: 'CATHODE', type: 'passive', desc: 'Silver banded side (-) negative' }
    ],
    specs: {
      'Peak Reverse Voltage': '1000V',
      'Average Forward Current': '1.0A',
      'Forward Voltage Drop': '0.7V at 1A',
      'Reverse Leakage': '5 uA'
    },
    testProcedure:
      'Set DMM to Diode Test. Red to Anode, Black to Cathode (silver band) reads ~0.60V. Reverse probes reads "OL" (Over Limit). If reads 0.00V in both directions, diode is shorted.',
    salvageValueEstimate: 0.3,
    hazardLevel: 'safe',
    dateAdded: '2026-10-01'
  },
  {
    id: 'comp-optocoupler-pc817',
    name: 'PC817 4-Pin Phototransistor Optocoupler',
    partNumber: 'PC817C',
    category: 'ic',
    packageType: 'DIP-4',
    extractedFrom: 'Phone charger / SMPS power supply feedback loop',
    condition: 'working',
    quantity: 5,
    pinCount: 4,
    pinout: [
      { pin: 1, name: 'ANODE', type: 'input', desc: 'Infrared LED Anode (+)' },
      { pin: 2, name: 'CATHODE', type: 'ground', desc: 'Infrared LED Cathode (-)' },
      { pin: 3, name: 'EMITTER', type: 'output', desc: 'Phototransistor Emitter' },
      { pin: 4, name: 'COLLECTOR', type: 'power', desc: 'Phototransistor Collector' }
    ],
    specs: {
      'Isolation Voltage': '5000 Vrms',
      'Current Transfer Ratio (CTR)': '200% – 400%',
      'Collector-Emitter Voltage': '80V max'
    },
    testProcedure:
      'Pin 1-2 shows ~1.15V forward drop (IR LED). Connect DMM resistance mode between Pin 3-4 (reads open). Apply 5V through 1k resistor to Pins 1-2: Pin 3-4 resistance drops to < 50 ohms.',
    salvageValueEstimate: 0.8,
    hazardLevel: 'safe',
    dateAdded: '2026-10-02'
  },
  {
    id: 'comp-atmega328p',
    name: 'ATmega328P 8-Bit AVR Microcontroller (DIP-28)',
    partNumber: 'ATmega328P-PU',
    category: 'ic',
    packageType: 'DIP-28',
    extractedFrom: 'Old Arduino Uno clone / industrial controller board',
    condition: 'working',
    quantity: 1,
    pinCount: 28,
    pinout: [
      { pin: 1, name: 'RESET', type: 'input', desc: 'Active-low reset (pull high with 10k)' },
      { pin: 7, name: 'VCC', type: 'power', desc: '+5V Power' },
      { pin: 8, name: 'GND', type: 'ground', desc: 'Ground (0V)' },
      { pin: 9, name: 'XTAL1', type: 'input', desc: '16MHz Crystal oscillator pin 1' },
      { pin: 10, name: 'XTAL2', type: 'output', desc: '16MHz Crystal oscillator pin 2' },
      { pin: 17, name: 'MOSI (D11)', type: 'io', desc: 'SPI Master Out / Slave In' },
      { pin: 18, name: 'MISO (D12)', type: 'io', desc: 'SPI Master In / Slave Out' },
      { pin: 19, name: 'SCK (D13)', type: 'io', desc: 'SPI Clock (Built-in LED pin)' }
    ],
    specs: {
      'Flash Memory': '32 KB',
      'SRAM': '2 KB',
      'Clock Speed': 'Up to 20 MHz (typically 16MHz)',
      'Operating Voltage': '1.8V – 5.5V'
    },
    testProcedure:
      'Power pins 7 (+5V) and 8 (GND) with 100nF decoupling cap. Measure Pin 1 (RESET); ensure it is pulled up to 5V. Check for 16MHz clock oscillations or connect FTDI adapter to test bootloader response.',
    salvageValueEstimate: 4.8,
    hazardLevel: 'safe',
    dateAdded: '2026-10-09'
  }
];

export const EXTERNAL_HARDWARE_CATALOG: ScrapComponent[] = [
  {
    id: 'ext-tl494',
    name: 'TL494 Pulse-Width-Modulation Control Circuit',
    partNumber: 'TL494CN',
    category: 'ic',
    packageType: 'DIP-16 / SOIC-16',
    extractedFrom: 'Desktop ATX Power Supplies, Inverter Boards, Battery Chargers',
    condition: 'untested',
    quantity: 1,
    pinCount: 16,
    pinout: [
      { pin: 1, name: '1IN+', type: 'input', desc: 'Error amplifier 1 non-inverting input' },
      { pin: 2, name: '1IN-', type: 'input', desc: 'Error amplifier 1 inverting input' },
      { pin: 3, name: 'FEEDBACK', type: 'analog', desc: 'Feedback and PWM comparator input' },
      { pin: 4, name: 'DTC', type: 'analog', desc: 'Dead-time control input (0V = max duty)' },
      { pin: 5, name: 'CT', type: 'analog', desc: 'Oscillator timing capacitor' },
      { pin: 6, name: 'RT', type: 'analog', desc: 'Oscillator timing resistor' },
      { pin: 7, name: 'GND', type: 'ground', desc: 'Ground return' },
      { pin: 8, name: 'C1', type: 'output', desc: 'Collector output 1' },
      { pin: 9, name: 'E1', type: 'output', desc: 'Emitter output 1' },
      { pin: 10, name: 'E2', type: 'output', desc: 'Emitter output 2' },
      { pin: 11, name: 'C2', type: 'output', desc: 'Collector output 2' },
      { pin: 12, name: 'VCC', type: 'power', desc: 'Positive supply voltage (7V - 40V)' },
      { pin: 13, name: 'OUTPUT CTRL', type: 'input', desc: 'Push-pull (Vref) or single-ended (GND)' },
      { pin: 14, name: 'REF OUT', type: 'power', desc: 'Precision 5.0V internal reference output' },
      { pin: 15, name: '2IN-', type: 'input', desc: 'Error amplifier 2 inverting input' },
      { pin: 16, name: '2IN+', type: 'input', desc: 'Error amplifier 2 non-inverting input' }
    ],
    specs: {
      'Operating Frequency': '1 kHz – 300 kHz',
      'Reference Output': '5.0V ± 5%',
      'Supply Voltage': '7V to 40V DC',
      'Output Current': '200 mA sink or source'
    },
    testProcedure: 'Apply 12V to Pin 12 (VCC) and Pin 7 (GND). Measure Pin 14 (REF OUT) with DMM; should read exactly 5.0V DC. Check oscillator waveform on Pin 5 (CT).',
    salvageValueEstimate: 1.8,
    hazardLevel: 'safe',
    dateAdded: '2026-10-10'
  },
  {
    id: 'ext-ams1117',
    name: 'AMS1117-3.3 1A Low-Dropout Linear Voltage Regulator',
    partNumber: 'AMS1117-3.3',
    category: 'power',
    packageType: 'SOT-223 / TO-252',
    extractedFrom: 'Routers, NodeMCU boards, Arduino clones, TV Mainboards',
    condition: 'working',
    quantity: 1,
    pinCount: 3,
    pinout: [
      { pin: 1, name: 'GND/ADJ', type: 'ground', desc: 'Ground terminal' },
      { pin: 2, name: 'VOUT', type: 'power', desc: 'Regulated 3.3V output (connected to tab)' },
      { pin: 3, name: 'VIN', type: 'power', desc: 'Unregulated DC input (up to 12V)' }
    ],
    specs: {
      'Fixed Output Voltage': '3.3V DC',
      'Max Output Current': '1.0 A',
      'Dropout Voltage': '1.1V at 800mA',
      'Line Regulation': '0.2% max'
    },
    testProcedure: 'Apply 5V to Pin 3 (VIN) and Pin 1 (GND) with 10uF cap. Measure Pin 2; must yield between 3.26V and 3.34V.',
    salvageValueEstimate: 0.6,
    hazardLevel: 'safe',
    dateAdded: '2026-10-10'
  },
  {
    id: 'ext-ch340g',
    name: 'CH340G USB to Serial UART Interface Controller',
    partNumber: 'CH340G',
    category: 'ic',
    packageType: 'SOP-16',
    extractedFrom: 'Arduino Nano Clones, ESP32 programmer boards, USB TTL dongles',
    condition: 'working',
    quantity: 1,
    pinCount: 16,
    pinout: [
      { pin: 1, name: 'GND', type: 'ground', desc: 'Ground' },
      { pin: 2, name: 'TXD', type: 'output', desc: 'Serial data transmit' },
      { pin: 3, name: 'RXD', type: 'input', desc: 'Serial data receive' },
      { pin: 4, name: 'V3', type: 'power', desc: '3.3V reference capacitor' },
      { pin: 5, name: 'UD+', type: 'io', desc: 'USB D+ differential signal' },
      { pin: 6, name: 'UD-', type: 'io', desc: 'USB D- differential signal' },
      { pin: 7, name: 'XI', type: 'input', desc: '12MHz crystal input' },
      { pin: 8, name: 'XO', type: 'output', desc: '12MHz crystal output' },
      { pin: 16, name: 'VCC', type: 'power', desc: 'Supply voltage (+5V or +3.3V)' }
    ],
    specs: {
      'Baud Rates': '50 bps to 2 Mbps',
      'Operating Voltage': '3.3V to 5.0V',
      'Clock': 'Requires 12MHz external crystal'
    },
    testProcedure: 'Power 5V on pin 16, check for 12MHz oscillation on pins 7/8 and enumeration on PC USB bus (VID: 1A86 PID: 7523).',
    salvageValueEstimate: 1.2,
    hazardLevel: 'safe',
    dateAdded: '2026-10-10'
  },
  {
    id: 'ext-uln2003a',
    name: 'ULN2003A 7-Channel High-Current Darlington Transistor Array',
    partNumber: 'ULN2003A',
    category: 'motor',
    packageType: 'DIP-16 / SOIC-16',
    extractedFrom: 'Printers, Microwave relays, Washing machine controllers',
    condition: 'working',
    quantity: 2,
    pinCount: 16,
    pinout: [
      { pin: 1, name: 'IN1', type: 'input', desc: 'Channel 1 logic input' },
      { pin: 8, name: 'GND', type: 'ground', desc: 'Emitter common ground' },
      { pin: 9, name: 'COM', type: 'power', desc: 'Common cathode clamp diodes (tie to V+)' },
      { pin: 16, name: 'OUT1', type: 'output', desc: 'Channel 1 open-collector output' }
    ],
    specs: {
      'Collector Current': '500 mA per channel',
      'Collector-Emitter Voltage': '50V max',
      'Built-in Clamp Diodes': 'Yes, for inductive transient suppression'
    },
    testProcedure: 'Apply 5V to IN1 through 2.7k resistor; resistance between OUT1 and GND drops from open to < 1.1V drop at 200mA.',
    salvageValueEstimate: 1.0,
    hazardLevel: 'safe',
    dateAdded: '2026-10-10'
  },
  {
    id: 'ext-esp8266',
    name: 'ESP8266-12F Wi-Fi Microcontroller Module',
    partNumber: 'ESP-12F',
    category: 'ic',
    packageType: 'Castellated SMD Module (16-Pin)',
    extractedFrom: 'Smart home plugs, Sonoff switches, Tuya smart bulbs',
    condition: 'working',
    quantity: 1,
    pinCount: 16,
    pinout: [
      { pin: 1, name: 'RESET', type: 'input', desc: 'Active-low reset' },
      { pin: 3, name: 'EN (CH_PD)', type: 'input', desc: 'Chip enable (pull high with 10k)' },
      { pin: 8, name: 'VCC', type: 'power', desc: '+3.3V Power (Never 5V!)' },
      { pin: 9, name: 'GND', type: 'ground', desc: 'Ground return' },
      { pin: 15, name: 'TXD0', type: 'output', desc: 'UART Transmit' },
      { pin: 16, name: 'RXD0', type: 'input', desc: 'UART Receive' }
    ],
    specs: {
      'CPU': 'Tensilica L106 32-bit at 80/160 MHz',
      'Wi-Fi': '802.11 b/g/n (2.4 GHz)',
      'Flash Memory': '4 MB SPI Flash',
      'Operating Voltage': '3.0V – 3.6V (Strictly 3.3V)'
    },
    testProcedure: 'Tie EN to 3.3V, GPIO15 to GND, GPIO0 to 3.3V. Monitor UART at 74880 or 115200 baud on power up for bootloader beacon.',
    salvageValueEstimate: 3.5,
    hazardLevel: 'safe',
    dateAdded: '2026-10-10'
  },
  {
    id: 'ext-sg90',
    name: 'TowerPro SG90 9g Micro Servo Motor',
    partNumber: 'SG90',
    category: 'motor',
    packageType: 'Mini Plastic Gearbox with 3-Wire Cable',
    extractedFrom: 'RC plane, educational robot arm, pan-tilt camera head',
    condition: 'working',
    quantity: 2,
    pinCount: 3,
    pinout: [
      { pin: 1, name: 'GND (Brown)', type: 'ground', desc: 'Ground return' },
      { pin: 2, name: 'VCC (Red)', type: 'power', desc: '+4.8V to +6.0V Power' },
      { pin: 3, name: 'PWM (Orange)', type: 'input', desc: '50Hz PWM control signal (1ms - 2ms pulse)' }
    ],
    specs: {
      'Stall Torque': '1.8 kgf·cm at 4.8V',
      'Operating Speed': '0.10 sec/60°',
      'Rotation Range': '180 degrees'
    },
    testProcedure: 'Power 5V. Send 1.5ms 50Hz PWM pulse from Arduino or 555 timer; servo centers to 90° position.',
    salvageValueEstimate: 2.2,
    hazardLevel: 'safe',
    dateAdded: '2026-10-10'
  }
];

