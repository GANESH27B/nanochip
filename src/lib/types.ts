export type Role = 'Manufacturer' | 'Distributor' | 'Pharmacy' | 'FDA' | 'Ingredient Supplier' | 'Patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
}

export type ShipmentStatus = 'Pending' | 'In-Transit' | 'Delivered' | 'Requires-Approval';

export interface ShipmentHistoryEntry {
  status: ShipmentStatus;
  holder: string;
  timestamp: string;
}

export interface Shipment {
  batchId: string;
  currentHolder: string;
  status: ShipmentStatus;
  createdAt: string;
  alerts: number;
  lastUpdate: string;
  startingPoint?: string;
  endingPoint?: string;
  history?: ShipmentHistoryEntry[];
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

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'You' | string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantRole: Role;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  avatarUrl?: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
}

export type Drug = {
  id: string;
  name: string;
  currentStock: number;
  reorderLevel: number;
  priority: 'High' | 'Medium' | 'Low';
  requestedBy: string;
};

export type RawMaterial = {
  id: string;
  name: string;
  supplier: string;
  lotNumber: string;
  quantity: number;
  units: 'kg' | 'g' | 'L' | 'mL';
  status: 'In-Stock' | 'Low-Stock' | 'Out-of-Stock';
};

export type SupplyChainStage = 'Ingredient Supplier' | 'Manufacturer' | 'Distributor' | 'Pharmacy' | 'Patient';