export type Role = 'Manufacturer' | 'Distributor' | 'Pharmacy' | 'FDA';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export type ShipmentStatus = 'Pending' | 'In-Transit' | 'Delivered' | 'Requires-Approval';

export interface Shipment {
  batchId: string;
  currentHolder: string;
  status: ShipmentStatus;
  createdAt: string;
  alerts: number;
  lastUpdate: string;
}

export type AlertType = 'Temperature' | 'Tamper' | 'Fake-Transfer' | 'Pressure' | 'Humidity';

export interface Alert {
  alertId: string;
  batchId: string;
  timestamp: string;
  type: AlertType;
  details: string;
  severity: 'Low' | 'Medium' | 'High';
}

export interface TelemetryData {
  time: string;
  temperature: number;
  humidity: number;
  pressure: number;
}

export interface Batch {
  id: string;
  drugName: string;
  quantity: number;
  manufactureDate: string;
  expiryDate: string;
  status: 'In-Production' | 'Ready-for-Shipment' | 'Shipped';
}
