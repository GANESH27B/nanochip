'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Alert } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { getAlertsSummary } from '@/app/actions';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const severityStyles: { [key: string]: string } = {
  High: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
};

export default function AlertsList({ initialAlerts }: { initialAlerts: Alert[] }) {
  const [alerts] = useState<Alert[]>(initialAlerts);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsLoading(true);
    const result = await getAlertsSummary({
      alerts: alerts.map((a) => ({ ...a, type: a.type as string })),
    });
    setIsLoading(false);

    if (result.success && result.summary) {
      setSummary(result.summary);
      setIsDialogOpen(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: result.error || 'Could not generate AI summary.',
      });
    }
  };

  return (
    <>
      <Card className="animate-fade-in-up">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Alerts</CardTitle>
            <CardDescription>
              Critical events and anomalies detected in the supply chain.
            </CardDescription>
          </div>
          <Button onClick={handleSummarize} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Summarize with AI
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Batch ID</TableHead>
                <TableHead className="hidden md:table-cell">Timestamp</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert, index) => (
                <TableRow key={alert.alertId} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s`}}>
                  <TableCell>
                    <Badge variant="outline" className={`border-none ${severityStyles[alert.severity]}`}>
                      {alert.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{alert.type}</TableCell>
                  <TableCell>{alert.batchId}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(alert.timestamp), 'MM/dd/yyyy, HH:mm:ss')}
                  </TableCell>
                  <TableCell>{alert.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{alerts.length}</strong> alerts.
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI-Powered Alert Summary
            </DialogTitle>
            <DialogDescription>
              Here is a summary of the current alerts and suggested actions.
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm dark:prose-invert max-h-[60vh] overflow-y-auto rounded-md border bg-muted/50 p-4">
            <p style={{ whiteSpace: 'pre-wrap' }}>{summary}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
