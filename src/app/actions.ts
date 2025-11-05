'use server';

import { summarizeAlerts, SummarizeAlertsInput } from '@/ai/flows/summarize-alerts-with-llm';
import { z } from 'zod';

const SummarizeActionInput = z.object({
  alerts: z.array(
    z.object({
      alertId: z.string(),
      batchId: z.string(),
      timestamp: z.string(),
      type: z.string(),
      details: z.string(),
    })
  ),
});

export async function getAlertsSummary(input: SummarizeAlertsInput) {
  try {
    const validatedInput = SummarizeActionInput.parse(input);
    const result = await summarizeAlerts(validatedInput);
    return { success: true, summary: result.summary };
  } catch (error) {
    console.error('Error summarizing alerts:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid input data.' };
    }
    return { success: false, error: 'Failed to generate summary.' };
  }
}
