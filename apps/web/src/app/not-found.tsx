import { Home, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="container mx-auto my-4 max-w-8/10 px-4 py-2">
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-xl">Page Not Found</CardTitle>
          <CardDescription>
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-muted p-3">
            <p className="text-muted-foreground text-sm">
              Error 404 - The requested resource could not be found.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full" variant="default">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button asChild className="w-full" variant="outline">
              <Link href="/about">About</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
