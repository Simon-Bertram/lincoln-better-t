'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    // In production, you would send this to a service like Sentry
    if (process.env.NODE_ENV === 'development') {
      console.error('Route error caught:', error);
    }
  }, [error]);

  return (
    <div className="container mx-auto my-4 max-w-8/10 px-4 py-2">
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-xl">Something went wrong!</CardTitle>
          <CardDescription>
            An error occurred while loading this page. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-muted p-3">
            <p className="text-muted-foreground text-sm">
              Error ID: {error.digest || 'Unknown'}
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-2">
                <summary className="cursor-pointer font-medium text-sm">
                  Error Details
                </summary>
                <pre className="mt-2 whitespace-pre-wrap text-muted-foreground text-xs">
                  {error.message}
                </pre>
              </details>
            )}
          </div>
          <Button className="w-full" onClick={() => reset()} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
