import type { Shipment, Alert, User, Role, TelemetryData } from './types';

export const users: Record<Role, User> = {
  Manufacturer: {
    id: 'user-mfg',
    name: 'Alice Manufacturer',
    email: 'alice@pharma.co',
    role: 'Manufacturer',
  },
  Distributor: {
    id: 'user-dist',
    name: 'Bob Distributor',
    email: 'bob@logistics.co',
    role: 'Distributor',
  },
  Pharmacy: {
    id: 'user-pharma',
    name: 'Charlie Pharmacist',
    email: 'charlie@meds.co',
    role: 'Pharmacy',
  },
  FDA: {
    id: 'user-fda',
    name: 'Diana Regulator',
    email: 'diana@fda.gov',
    role: 'FDA',
  },
};

export const shipments: Shipment[] = [
  {
    batchId: 'B-XYZ-12345',
    currentHolder: 'City-Distro',
    status: 'In-Transit',
    createdAt: '2024-07-28T10:00:00Z',
    alerts: 2,
    lastUpdate: '2024-07-28T14:30:00Z',
  },
  {
    batchId: 'B-ABC-67890',
    currentHolder: 'Pharma-Factory',
    status: 'Requires-Approval',
    createdAt: '2024-07-27T15:00:00Z',
    alerts: 1,
    lastUpdate: '2024-07-28T09:00:00Z',
  },
  {
    batchId: 'B-DEF-11223',
    currentHolder: 'General Hospital',
    status: 'Delivered',
    createdAt: '2024-07-25T08:00:00Z',
    alerts: 0,
    lastUpdate: '2024-07-26T18:00:00Z',
  },
  {
    batchId: 'B-GHI-44556',
    currentHolder: 'Regional-Logistics',
    status: 'In-Transit',
    createdAt: '2024-07-28T11:00:00Z',
    alerts: 0,
    lastUpdate: '2024-07-28T16:45:00Z',
  },
  {
    batchId: 'B-JKL-77889',
    currentHolder: 'Pharma-Factory',
    status: 'Pending',
    createdAt: '2024-07-28T18:00:00Z',
    alerts: 0,
    lastUpdate: '2024-07-28T18:00:00Z',
  },
];

export const alerts: Alert[] = [
  {
    alertId: 'A-001',
    batchId: 'B-XYZ-12345',
    timestamp: '2024-07-28T12:05:00Z',
    type: 'Temperature',
    details: 'Temperature exceeded 8°C for 15 minutes. Current reading: 8.5°C.',
    severity: 'High',
  },
  {
    alertId: 'A-002',
    batchId: 'B-ABC-67890',
    timestamp: '2024-07-28T08:30:00Z',
    type: 'Tamper',
    details: 'Package seal was broken and then re-sealed.',
    severity: 'High',
  },
  {
    alertId: 'A-003',
    batchId: 'B-XYZ-12345',
    timestamp: '2024-07-28T13:45:00Z',
    type: 'Pressure',
    details: 'Atmospheric pressure dropped significantly, suggesting altitude change.',
    severity: 'Medium',
  },
  {
    alertId: 'A-004',
    batchId: 'B-XYZ-12345',
    timestamp: '2024-07-28T15:00:00Z',
    type: 'Humidity',
    details: 'Humidity level rose to 75%.',
    severity: 'Low',
  },
];

const generateRandomValue = (base: number, range: number, factor: number) => {
  // Simple pseudo-random generator based on a factor to keep it deterministic
  const a = 1103515245;
  const c = 12345;
  const m = Math.pow(2, 31);
  const pseudoRandom = (a * factor + c) % m / m;
  return base + pseudoRandom * range;
};


export const generateTelemetryData = (days: number): TelemetryData[] => {
  const data: TelemetryData[] = [];
  const now = new Date('2024-07-29T12:00:00Z').getTime();
  for (let i = 0; i < 24 * days; i++) {
    const time = new Date(now - i * 60 * 60 * 1000);
    const dayHour = time.getUTCHours();
    
    const seed = time.getTime();

    data.push({
      time: time.toISOString().substring(0, 16).replace('T', ' '),
      temperature: generateRandomValue(4, 2, seed) + (dayHour > 10 && dayHour < 18 ? generateRandomValue(0,1,seed) : -generateRandomValue(0,1,seed)),
      humidity: generateRandomValue(60, 5, seed + 1),
      pressure: generateRandomValue(1010, 10, seed + 2) - 5,
    });
  }
  return data.reverse();
};
