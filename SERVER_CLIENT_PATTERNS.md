# Server/Client Component Patterns - Learning Guide

## Problem Summary

### The Issue
The main page (`app/page.tsx`) was marked as `"use client"`, which meant:
- **No server-side rendering** - All content was client-rendered
- **Poor SEO** - Search engines couldn't see content in initial HTML
- **Slower initial load** - JavaScript had to load before content appeared
- **Wasted server capabilities** - Not using Next.js 15's server component features

### Root Cause
The page was using client-side hooks (`useTableToggle`) for state management, which required the entire component tree to be client-side. This created an unnecessary client boundary.

---

## Solution Overview

### What We Did
1. **Separated concerns**: Moved client-side logic to dedicated client components
2. **Created server component**: Made the main page a server component
3. **Added server-side data fetching**: Pre-fetch data on the server for better performance
4. **Used React Query hydration**: Hydrate client-side queries with server-fetched data

### Key Files Created/Modified

1. **`apps/web/src/lib/server-data.ts`** - Server-side data fetching utilities
2. **`apps/web/src/components/interactive-table-section.tsx`** - Client component for interactive parts
3. **`apps/web/src/app/page.tsx`** - Converted to server component with data prefetching

---

## Understanding the Problem

### How to Identify This Issue

#### Red Flags 🚩
1. **Main page routes marked as `"use client"`**
   ```typescript
   // ❌ BAD - Entire page is client-side
   "use client";
   export default function Home() { ... }
   ```

2. **Using hooks in page components unnecessarily**
   ```typescript
   // ❌ BAD - Forces entire page to be client-side
   export default function Page() {
     const state = useState(); // Requires "use client"
     return <div>...</div>;
   }
   ```

3. **All data fetching happens client-side**
   ```typescript
   // ❌ BAD - No server-side data fetching
   "use client";
   export default function Page() {
     const { data } = useQuery(...); // Client-side only
     return <div>{data}</div>;
   }
   ```

#### What to Look For
- Check if your page components have `"use client"` at the top
- Look for hooks (`useState`, `useEffect`, `useQuery`) in page components
- Verify if data fetching happens only in client components
- Check if static content is unnecessarily client-rendered

---

## Solution Patterns

### Pattern 1: Server Component with Client Boundaries

#### Structure
```
Server Component (page.tsx)
├── Static Content (server-rendered)
├── HydrationBoundary (passes server data)
└── Client Component (interactive parts)
    ├── State Management
    ├── Hooks
    └── Data Fetching (hydrated from server)
```

#### Implementation

**Server Component (Page)**
```typescript
// ✅ GOOD - Server component
export default async function Home() {
  // Pre-fetch data on server
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['students'],
      queryFn: getStudentsServer,
    }),
  ]);

  return (
    <div>
      {/* Static content - server-rendered */}
      <h1>Static Title</h1>
      
      {/* Hydrate React Query with server data */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <InteractiveClientComponent />
      </HydrationBoundary>
    </div>
  );
}
```

**Client Component (Interactive Parts)**
```typescript
// ✅ GOOD - Client component for interactive parts
"use client";

export function InteractiveClientComponent() {
  const { data } = useQuery({
    queryKey: ['students'],
    queryFn: getStudentsClient,
  });
  // React Query automatically uses hydrated data
  return <div>{/* Interactive UI */}</div>;
}
```

### Pattern 2: Server-Side Data Fetching

#### Create Server Utilities
```typescript
// ✅ GOOD - Server-side data fetching
// lib/server-data.ts

export async function getStudentsServer(): Promise<Student[]> {
  const client = createServerClient();
  return await client.getStudents();
}
```

#### Use in Server Component
```typescript
// ✅ GOOD - Fetch in server component
export default async function Page() {
  const students = await getStudentsServer();
  // Data is available immediately, no loading state needed
  return <div>{/* Render with data */}</div>;
}
```

### Pattern 3: React Query Hydration

#### How It Works
1. **Server**: Pre-fetch data and dehydrate QueryClient
2. **HydrationBoundary**: Pass dehydrated state to client
3. **Client**: React Query automatically hydrates from server data
4. **Result**: No loading state, instant data display

#### Implementation
```typescript
// Server Component
export default async function Page() {
  const queryClient = new QueryClient();
  
  // Pre-fetch
  await queryClient.prefetchQuery({
    queryKey: ['key'],
    queryFn: fetchData,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientComponent />
    </HydrationBoundary>
  );
}

// Client Component
"use client";
export function ClientComponent() {
  // This will use hydrated data immediately
  const { data } = useQuery({
    queryKey: ['key'], // Must match!
    queryFn: fetchData,
  });
  
  // data is available immediately, no loading state
  return <div>{data}</div>;
}
```

---

## Decision Tree: Server vs Client Component

### Use Server Component When:
- ✅ Rendering static content
- ✅ Fetching data for initial display
- ✅ No interactivity needed
- ✅ SEO is important
- ✅ Performance optimization is needed

### Use Client Component When:
- ✅ Using React hooks (`useState`, `useEffect`, etc.)
- ✅ Event handlers (`onClick`, `onChange`, etc.)
- ✅ Browser APIs (`window`, `localStorage`, etc.)
- ✅ State management libraries (Zustand, Redux, etc.)
- ✅ Real-time updates needed

### Use Hybrid Approach When:
- ✅ Page has both static and interactive parts
- ✅ Data needs to be pre-fetched but also updated client-side
- ✅ You want best of both worlds (performance + interactivity)

---

## Best Practices Checklist

### ✅ DO

1. **Default to Server Components**
   - Start with server component, add `"use client"` only when needed
   - Next.js 15 components are server components by default

2. **Separate Static from Interactive**
   - Keep static content in server components
   - Move interactive parts to client components

3. **Pre-fetch Data on Server**
   - Fetch data in server components when possible
   - Use React Query hydration for client-side updates

4. **Use HydrationBoundary**
   - Pass server-fetched data to client components
   - Avoid loading states on initial render

5. **Keep Client Boundaries Small**
   - Only mark components as client when absolutely necessary
   - Create focused client components for specific features

### ❌ DON'T

1. **Don't Mark Pages as Client Unnecessarily**
   ```typescript
   // ❌ BAD - Don't do this unless you need client-side features
   "use client";
   export default function Page() {
     return <div>Static content</div>;
   }
   ```

2. **Don't Use Hooks in Server Components**
   ```typescript
   // ❌ BAD - Hooks don't work in server components
   export default function Page() {
     const [state, setState] = useState(); // ERROR!
     return <div>...</div>;
   }
   ```

3. **Don't Mix Server and Client Code**
   ```typescript
   // ❌ BAD - Can't use client-side features in server components
   export default async function Page() {
     const data = await fetchData();
     localStorage.setItem('key', data); // ERROR!
     return <div>...</div>;
   }
   ```

4. **Don't Fetch Data Only Client-Side**
   ```typescript
   // ❌ BAD - No server-side fetching
   "use client";
   export default function Page() {
     const { data } = useQuery(...); // Loads after JS executes
     return <div>{data}</div>;
   }
   ```

5. **Don't Create Large Client Boundaries**
   ```typescript
   // ❌ BAD - Entire app is client-side
   "use client";
   export default function App() {
     // Everything is client-rendered
   }
   ```

---

## Common Patterns and Solutions

### Pattern: Page with Static Content + Interactive Table

**Problem**: Page has static content and interactive table, but entire page is client-side.

**Solution**: 
- Server component for static content
- Client component for interactive table
- Pre-fetch table data on server

```typescript
// Server Component
export default async function Page() {
  // Pre-fetch data
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({...});

  return (
    <div>
      {/* Static content - server-rendered */}
      <h1>Title</h1>
      <p>Description</p>
      
      {/* Interactive part - client-rendered */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <InteractiveTable />
      </HydrationBoundary>
    </div>
  );
}
```

### Pattern: Conditional Rendering Based on URL

**Problem**: Need to conditionally render based on URL params, but hooks require client component.

**Solution**:
- Read URL params in server component using `searchParams`
- Pass initial state to client component
- Client component handles updates

```typescript
// Server Component
export default async function Page({ 
  searchParams 
}: { 
  searchParams: { table?: string } 
}) {
  const initialTable = searchParams.table || 'students';
  
  return (
    <ClientTableSelector initialTable={initialTable} />
  );
}

// Client Component
"use client";
export function ClientTableSelector({ initialTable }: { initialTable: string }) {
  const [table, setTable] = useState(initialTable);
  // Handle updates...
}
```

### Pattern: Data Fetching with React Query

**Problem**: Want to use React Query but also need server-side fetching.

**Solution**:
- Pre-fetch in server component
- Hydrate React Query
- Client component uses hydrated data

```typescript
// Server: Pre-fetch
const queryClient = new QueryClient();
await queryClient.prefetchQuery({
  queryKey: ['data'],
  queryFn: fetchData,
});

// Client: Use hydrated data
const { data } = useQuery({
  queryKey: ['data'], // Must match!
  queryFn: fetchData,
});
// data is available immediately
```

---

## Debugging Tips

### How to Check if Component is Server or Client

1. **Check for `"use client"` directive**
   - If present: Client component
   - If absent: Server component (default in Next.js 15)

2. **Check console logs**
   - Server components: Logs appear in terminal/server logs
   - Client components: Logs appear in browser console

3. **Check for hooks**
   - Using hooks: Must be client component
   - No hooks: Can be server component

### Common Errors

#### Error: "useState is not defined"
**Cause**: Using hooks in server component
**Fix**: Move hook usage to client component or remove hook

#### Error: "Cannot use localStorage in server component"
**Cause**: Browser APIs don't work in server components
**Fix**: Use in client component or pass data as props

#### Error: "Hydration mismatch"
**Cause**: Server and client render different content
**Fix**: Ensure server and client render same content initially

---

## Performance Impact

### Before (Client Component)
- ⏱️ Initial load: ~2-3 seconds (wait for JS + data fetch)
- 📦 Bundle size: Larger (all code in client bundle)
- 🔍 SEO: Poor (content not in initial HTML)
- ⚡ Time to Interactive: Higher

### After (Server Component)
- ⏱️ Initial load: ~0.5-1 second (server-rendered HTML)
- 📦 Bundle size: Smaller (code split better)
- 🔍 SEO: Excellent (content in initial HTML)
- ⚡ Time to Interactive: Lower

### Expected Improvements
- **30-50% faster initial page load**
- **Better SEO scores**
- **Improved Core Web Vitals**
- **Better user experience**

---

## Key Takeaways

1. **Default to Server Components**
   - Start server-side, add client boundaries only when needed

2. **Separate Concerns**
   - Static content → Server component
   - Interactive features → Client component

3. **Pre-fetch Data**
   - Fetch on server for initial load
   - Hydrate React Query for client-side updates

4. **Keep Client Boundaries Small**
   - Only mark components as client when necessary
   - Create focused client components

5. **Use HydrationBoundary**
   - Pass server-fetched data to client
   - Avoid loading states on initial render

6. **Test Both Environments**
   - Verify server-side rendering works
   - Verify client-side interactivity works
   - Check for hydration mismatches

---

## Quick Reference

### When to Use Server Component
- ✅ Static content
- ✅ Data fetching
- ✅ SEO important
- ✅ Performance critical

### When to Use Client Component
- ✅ React hooks needed
- ✅ Event handlers
- ✅ Browser APIs
- ✅ State management
- ✅ Real-time updates

### Migration Checklist
- [ ] Identify what requires client-side features
- [ ] Extract client-side logic to separate components
- [ ] Convert page to server component
- [ ] Add server-side data fetching
- [ ] Use HydrationBoundary for React Query
- [ ] Test server and client rendering
- [ ] Verify performance improvements

---

## Related Resources

- [Next.js Server Components Documentation](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [React Query Hydration Guide](https://tanstack.com/query/latest/docs/react/guides/ssr)
- [Next.js Data Fetching Patterns](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

## Summary

**Problem**: Entire page was client-side, causing poor performance and SEO.

**Solution**: 
1. Separated static content (server) from interactive parts (client)
2. Added server-side data fetching
3. Used React Query hydration for seamless client-side updates

**Result**: Faster initial load, better SEO, improved performance, while maintaining all interactivity.

**Key Lesson**: Always default to server components and only add client boundaries where absolutely necessary. This gives you the best performance while maintaining flexibility.

