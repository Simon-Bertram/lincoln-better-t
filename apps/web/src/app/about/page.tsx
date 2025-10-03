import Link from 'next/link';

export default function AboutPage() {
  return (
    <main
      className="container mx-auto my-4 w-[95%] px-4 py-2 lg:max-w-8/10"
      id="main-content"
    >
      <header className="mb-8">
        <h1 className="mb-4 font-bold text-3xl">About The Lincoln Institute</h1>
        <p className="text-lg text-muted-foreground">
          Learn about the historical institution and this digital directory
        </p>
      </header>

      <article className="prose prose-lg max-w-none">
        <section aria-labelledby="institution-heading">
          <h2 className="mb-4 font-semibold text-xl" id="institution-heading">
            The Institution
          </h2>
          <p>
            The Lincoln Institute was a charitable institution founded by Mary
            McHenry Cox that operated from 1866 to 1922 at 808 South Eleventh
            Street in Philadelphia, Pennsylvania.
          </p>
        </section>

        <section aria-labelledby="civil-war-orphans-heading" className="mt-8">
          <h2
            className="mb-4 font-semibold text-xl"
            id="civil-war-orphans-heading"
          >
            Civil War Orphans
          </h2>
          <p>
            The Lincoln Institute, a Philadelphia charity, housed orphaned boys
            of the Civil War during from 1866 to 1884, whose fathers had been
            Episcopalian. The orphans lived at two sites in Philadelphia. One at
            11th Street and the other at 49th Street, the latter with the title
            of The Educational Home. The first site was for younger boys and the
            second for the older one. The older boys worked in city center
            businesses.
          </p>
          <p>
            Information on the deaths of orphans is available
            <Link href="https://www.the2nomads.site/TEHSDocumentStore/docs/doc837.html">
              here
            </Link>
            .
          </p>
          <p>
            Documents concerning the Lincoln Institute can be found{' '}
            <Link href="https://www.the2nomads.site/TEHSDocumentStore/LincolnInstitution.html">
              here
            </Link>
            .
          </p>
        </section>

        <section aria-labelledby="directory-heading" className="mt-8">
          <h2 className="mb-4 font-semibold text-xl" id="directory-heading">
            This Digital Directory
          </h2>
          <p>
            This digital directory contains historical records of students who
            attended the Lincoln Institute during its years of operation. The
            data provides valuable insights into the educational opportunities
            and experiences of students during this period in American history.
          </p>
        </section>
      </article>

      <footer className="mt-8">
        <p>The data were compiled by Heidi Sproat and Mike Bertram.</p>
      </footer>
    </main>
  );
}
