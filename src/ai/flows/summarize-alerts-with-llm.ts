'use server';
/**
 * @fileOverview Summarizes alerts related to drug shipments using an LLM.
 *
 * - summarizeAlerts - A function that summarizes alerts and suggests actions.
 * - SummarizeAlertsInput - The input type for the summarizeAlerts function.
 * - SummarizeAlertsOutput - The return type for the summarizeAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAlertsInputSchema = z.object({
  alerts: z.array(
    z.object({
      alertId: z.string().describe('The unique identifier of the alert.'),
      batchId: z.string().describe('The batch ID associated with the alert.'),
      timestamp: z.string().describe('The timestamp of when the alert was triggered.'),
      type: z.string().describe('The type of alert (e.g., temperature deviation, tamper detection).'),
      details: z.string().describe('Detailed description of the alert.'),
    })
  ).describe('A list of alerts to be summarized.'),
});
export type SummarizeAlertsInput = z.infer<typeof SummarizeAlertsInputSchema>;

const SummarizeAlertsOutputSchema = z.object({
  summary: z.string().describe('A summary of the alerts and suggested actions.'),
});
export type SummarizeAlertsOutput = z.infer<typeof SummarizeAlertsOutputSchema>;

export async function summarizeAlerts(input: SummarizeAlertsInput): Promise<SummarizeAlertsOutput> {
  return summarizeAlertsFlow(input);
}

const summarizeAlertsPrompt = ai.definePrompt({
  name: 'summarizeAlertsPrompt',
  input: {schema: SummarizeAlertsInputSchema},
  output: {schema: SummarizeAlertsOutputSchema},
  prompt: `You are a supply chain manager responsible for ensuring the safety and integrity of pharmaceutical shipments.
  You will be provided with a list of alerts related to drug shipments. Analyze these alerts and provide a concise summary of the key issues and the actions that need to be taken.

  Here are the alerts:
  {{#each alerts}}
  Alert ID: {{alertId}}
  Batch ID: {{batchId}}
  Timestamp: {{timestamp}}
  Type: {{type}}
  Details: {{details}}
  {{/each}}

  Provide a summary of the alerts and suggest specific actions that should be taken to address the issues.
  Summary and Actions:`, // Prompt is now properly formatted with Handlebars.
});

const summarizeAlertsFlow = ai.defineFlow(
  {
    name: 'summarizeAlertsFlow',
    inputSchema: SummarizeAlertsInputSchema,
    outputSchema: SummarizeAlertsOutputSchema,
  },
  async input => {
    const {output} = await summarizeAlertsPrompt(input);
    return output!;
  }
);
