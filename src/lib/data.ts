import type { Shipment, Alert, User, Role, TelemetryData, Batch, Conversation, ChatMessage } from './types';

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
    startingPoint: 'New York, NY',
    endingPoint: 'Boston, MA',
  },
  {
    batchId: 'B-ABC-67890',
    currentHolder: 'Pharma-Factory',
    status: 'Requires-Approval',
    createdAt: '2024-07-27T15:00:00Z',
    alerts: 1,
    lastUpdate: '2024-07-28T09:00:00Z',
    startingPoint: 'Chicago, IL',
    endingPoint: 'Los Angeles, CA',
  },
  {
    batchId: 'B-DEF-11223',
    currentHolder: 'General Hospital',
    status: 'Delivered',
    createdAt: '2024-07-25T08:00:00Z',
    alerts: 0,
    lastUpdate: '2024-07-26T18:00:00Z',
    startingPoint: 'San Francisco, CA',
    endingPoint: 'Seattle, WA',
  },
  {
    batchId: 'B-GHI-44556',
    currentHolder: 'Regional-Logistics',
    status: 'In-Transit',
    createdAt: '2024-07-28T11:00:00Z',
    alerts: 0,
    lastUpdate: '2024-07-28T16:45:00Z',
     startingPoint: 'Miami, FL',
    endingPoint: 'Atlanta, GA',
  },
  {
    batchId: 'B-JKL-77889',
    currentHolder: 'Pharma-Factory',
    status: 'Pending',
    createdAt: '2024-07-28T18:00:00Z',
    alerts: 0,
    lastUpdate: '2024-07-28T18:00:00Z',
    startingPoint: 'Dallas, TX',
    endingPoint: 'Houston, TX',
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

export const batches: Batch[] = [
  {
    id: 'B-XYZ-12345',
    drugName: 'Sertraline',
    quantity: 5000,
    manufactureDate: '2024-07-20T00:00:00Z',
    expiryDate: '2026-07-20T00:00:00Z',
    status: 'Shipped',
  },
  {
    id: 'B-ABC-67890',
    drugName: 'Lisinopril',
    quantity: 10000,
    manufactureDate: '2024-07-15T00:00:00Z',
    expiryDate: '2026-07-15T00:00:00Z',
    status: 'Shipped',
  },
  {
    id: 'B-MNO-33445',
    drugName: 'Atorvastatin',
    quantity: 20000,
    manufactureDate: '2024-07-28T00:00:00Z',
    expiryDate: '2026-07-28T00:00:00Z',
    status: 'Ready-for-Shipment',
  },
  {
    id: 'B-PQR-66778',
    drugName: 'Metformin',
    quantity: 15000,
    manufactureDate: '2024-07-29T00:00:00Z',
    expiryDate: '2026-07-29T00:00:00Z',
    status: 'In-Production',
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

export const conversations: Conversation[] = [
  {
    id: 'CONV-001',
    participantName: 'Diana Regulator',
    participantRole: 'FDA',
    lastMessage: 'Yes, please proceed with the submission for batch B-ABC-67890.',
    lastMessageTimestamp: '2024-07-29T14:30:00Z',
    unreadCount: 0,
  },
  {
    id: 'CONV-002',
    participantName: 'Bob Distributor',
    participantRole: 'Distributor',
    lastMessage: 'Okay, sounds good. I will get the truck ready for pickup.',
    lastMessageTimestamp: '2024-07-29T11:15:00Z',
    unreadCount: 2,
  },
  {
    id: 'CONV-003',
    participantName: 'Charlie Pharmacist',
    participantRole: 'Pharmacy',
    lastMessage: 'We are running low on Amoxicillin, can you expedite?',
    lastMessageTimestamp: '2024-07-28T18:05:00Z',
    unreadCount: 0,
  },
];

export const chatMessages: ChatMessage[] = [
    { id: 'MSG-001', conversationId: 'CONV-001', sender: 'Diana Regulator', text: 'Have you addressed the tamper alert on batch B-ABC-67890?', timestamp: '2024-07-29T14:20:00Z', isRead: true },
    { id: 'MSG-002', conversationId: 'CONV-001', sender: 'You', text: 'Yes, we have investigated. It was a false positive during routine inspection. The batch is secure.', timestamp: '2024-07-29T14:25:00Z', isRead: true },
    { id: 'MSG-003', conversationId: 'CONV-001', sender: 'Diana Regulator', text: 'Thank you for confirming. Yes, please proceed with the submission for batch B-ABC-67890.', timestamp: '2024-07-29T14:30:00Z', isRead: true },
    { id: 'MSG-004', conversationId: 'CONV-002', sender: 'Bob Distributor', text: 'Shipment for B-MNO-33445 is ready for transit. What is the destination?', timestamp: '2024-07-29T11:00:00Z', isRead: true },
    { id: 'MSG-005', conversationId: 'CONV-002', sender: 'You', text: 'Destination is General Hospital. Please ensure temperature is maintained at 5°C.', timestamp: '2024-07-29T11:05:00Z', isRead: true },
    { id: 'MSG-006', conversationId: 'CONV-002', sender: 'Bob Distributor', text: 'Understood. Will monitor.', timestamp: '2024-07-29T11:07:00Z', isRead: false },
    { id: 'MSG-007', conversationId: 'CONV-002', sender: 'Bob Distributor', text: 'Okay, sounds good. I will get the truck ready for pickup.', timestamp: '2024-07-29T11:15:00Z', isRead: false },
    { id: 'MSG-008', conversationId: 'CONV-003', sender: 'Charlie Pharmacist', text: 'We are running low on Amoxicillin, can you expedite?', timestamp: '2024-07-28T18:05:00Z', isRead: true },
    { id: 'MSG-009', conversationId: 'CONV-003', sender: 'You', text: 'I see that. I will check with production and get back to you shortly.', timestamp: '2024-07-28T18:10:00Z', isRead: true },
];
