import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BreadcrumbStructuredData,
  Breadcrumbs,
} from '@/components/breadcrumbs';
import { CloudinaryImage } from '@/components/cloudinary-image';

export const metadata: Metadata = {
  title: 'About The Lincoln Institute',
  description:
    'Learn about The Lincoln Institute, a Philadelphia charity founded by Mary McHenry Cox that operated from 1866-1922, housing Civil War orphans and providing education.',
  keywords: [
    'Lincoln Institute history',
    'Mary McHenry Cox',
    'Philadelphia charity',
    'Civil War orphans',
    'Educational Home',
    '808 South Eleventh Street',
    '1866-1922',
    'historical institution',
  ],
  openGraph: {
    title: 'About The Lincoln Institute - Historical Institution 1866-1922',
    description:
      'Learn about The Lincoln Institute, a Philadelphia charity founded by Mary McHenry Cox that operated from 1866-1922, housing Civil War orphans and providing education.',
    type: 'article',
  },
};

export default function AboutPage() {
  return (
    <main
      className="container mx-auto my-4 w-[95%] px-4 py-2 lg:max-w-8/10"
      id="main-content"
    >
      <Breadcrumbs items={[{ label: 'About' }]} />
      <BreadcrumbStructuredData items={[{ label: 'About' }]} />
      <header className="mb-8 text-center">
        <h1 className="mb-4 font-bold text-3xl">About The Lincoln Institute</h1>
        <p className="text-lg text-muted-foreground">
          Learn about the historical institution and this digital directory
        </p>
      </header>

      <article className="mx-auto mb-16 lg:max-w-[80ch] xl:max-w-[95ch]">
        <section aria-labelledby="institution-heading">
          <h2
            className="mb-8 text-center font-semibold text-xl"
            id="institution-heading"
          >
            The Institution
          </h2>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="prose prose-lg flex-1">
              <p>
                The Lincoln Institute was a charitable institution founded by
                Mary McHenry Cox that operated from 1866 to 1922 at 808 South
                Eleventh Street in Philadelphia, Pennsylvania.
              </p>
            </div>
            <div className="flex-shrink-0">
              <CloudinaryImage
                alt="The Lincoln Institute Educational Home - Historical building where Civil War orphans were housed and educated"
                className="rounded-lg"
                crop="fill"
                height="300"
                quality="auto"
                src="EducationalHome_m5kpvv"
                width="400"
              />
            </div>
          </div>
        </section>

        <section aria-labelledby="civil-war-orphans-heading" className="mt-8">
          <h2
            className="mb-8 text-center font-semibold text-xl"
            id="civil-war-orphans-heading"
          >
            Civil War Orphans
          </h2>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="prose prose-lg flex-1">
              <p>
                The Lincoln Institute, a Philadelphia charity, housed orphaned
                boys of the Civil War during from 1866 to 1884, whose fathers
                had been Episcopalian. The orphans lived at two sites in
                Philadelphia. One at 11th Street and the other at 49th Street,
                the latter with the title of The Educational Home. The first
                site was for younger boys and the second for the older one. The
                older boys worked in city center businesses.
              </p>
              <p>
                Information on the deaths of orphans is available{' '}
                <Link
                  href="https://www.the2nomads.site/TEHSDocumentStore/docs/doc837.html"
                  target="_blank"
                >
                  here
                </Link>
                .
              </p>
              <p>
                Documents concerning the Lincoln Institute can be found{' '}
                <Link
                  href="https://www.the2nomads.site/TEHSDocumentStore/LincolnInstitution.html"
                  target="_blank"
                >
                  here
                </Link>
                .
              </p>
              <p className="text-sm">
                The data were compiled by Heidi Sproat and Mike Bertram.
              </p>
            </div>
            <div className="flex-shrink-0">
              <CloudinaryImage
                alt="Lincoln Institute lithograph - Historical document showing the institution"
                className="rounded-lg shadow-md"
                crop="fill"
                height="600"
                quality="auto"
                src="LincolnInstitutelithograph_vdkpa8"
                width="350"
              />
            </div>
          </div>
        </section>

        <section aria-labelledby="directory-heading" className="mt-8">
          <div className="text-center">
            <h2
              className="mb-8 text-center font-semibold text-xl"
              id="directory-heading"
            >
              This Digital Directory
            </h2>
            <p className="prose prose-lg mx-auto max-w-3xl text-left">
              This digital directory contains historical records of students who
              attended the Lincoln Institute during its years of operation. The
              data provides valuable insights into the educational opportunities
              and experiences of students during this period in American
              history.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}
