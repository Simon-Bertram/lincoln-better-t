import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [{ label: "Home", href: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-muted-foreground text-sm">
        {allItems.map((item, index) => (
          <li className="flex items-center" key={`${item.label}-${index}`}>
            {index > 0 && (
              <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />
            )}
            {item.href && index < allItems.length - 1 ? (
              <Link
                className="flex items-center transition-colors hover:text-foreground"
                href={item.href}
              >
                {index === 0 && <Home className="mr-1 h-4 w-4" />}
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="flex items-center">
                {index === 0 && <Home className="mr-1 h-4 w-4" />}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Structured data for breadcrumbs
export function BreadcrumbStructuredData({ items }: BreadcrumbsProps) {
  const allItems = [{ label: "Home", href: "/" }, ...items];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href
        ? `https://lincoln-institute-directory.vercel.app${item.href}`
        : undefined,
    })),
  };

  return (
    <Script
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
      id="breadcrumb-structured-data"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for structured data
      type="application/ld+json"
    />
  );
}
