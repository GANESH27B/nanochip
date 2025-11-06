import type { Shipment, Alert, User, Role, TelemetryData, Batch, Conversation, ChatMessage, Drug, Transaction, ShipmentHistoryEntry, RawMaterial, Product } from './types';

import usersData from './datasets/users.json';
import shipmentsData from './datasets/shipments.json';
import alertsData from './datasets/alerts.json';
import batchesData from './datasets/batches.json';
import conversationsData from './datasets/conversations.json';
import chatMessagesData from './datasets/chat-messages.json';
import neededDrugsData from './datasets/needed-drugs.json';
import transactionsData from './datasets/transactions.json';
import rawMaterialsData from './datasets/raw-materials.json';
import productsData from './datasets/products.json';


export const users: Record<string, User> = usersData;
export const shipments: Shipment[] = shipmentsData.map(shipment => {
    // For sample data, let's assume Manufacturer is the start and Pharmacy is the end.
    const manufacturer = Object.values(users).find(u => u.role === 'Manufacturer');
    const pharmacy = Object.values(users).find(u => u.role === 'Pharmacy');
    const newShipment = {
        ...shipment,
        startingPoint: shipment.startingPoint || manufacturer?.location,
        endingPoint: shipment.endingPoint || pharmacy?.location,
    };

    if (!newShipment.history) {
        newShipment.history = [
            {
                status: newShipment.status,
                holder: newShipment.currentHolder,
                timestamp: newShipment.createdAt,
            }
        ];
    }
    return newShipment;
});
export const alerts: Alert[] = alertsData;
export const batches: Batch[] = batchesData;
export const conversations: Conversation[] = conversationsData;
export const chatMessages: ChatMessage[] = chatMessagesData;
export const neededDrugs: Drug[] = neededDrugsData;
export const transactions: Transaction[] = transactionsData;
export const rawMaterials: RawMaterial[] = rawMaterialsData;
export const products: Product[] = productsData;


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
