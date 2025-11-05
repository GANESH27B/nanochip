import type { Shipment, Alert, User, Role, TelemetryData, Batch, Conversation, ChatMessage } from './types';

import usersData from './datasets/users.json';
import shipmentsData from './datasets/shipments.json';
import alertsData from './datasets/alerts.json';
import batchesData from './datasets/batches.json';
import conversationsData from './datasets/conversations.json';
import chatMessagesData from './datasets/chat-messages.json';

export const users: Record<Role, User> = usersData;
export const shipments: Shipment[] = shipmentsData;
export const alerts: Alert[] = alertsData;
export const batches: Batch[] = batchesData;
export const conversations: Conversation[] = conversationsData;
export const chatMessages: ChatMessage[] = chatMessagesData;


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