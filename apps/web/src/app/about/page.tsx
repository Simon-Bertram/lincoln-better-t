import type { Metadata } from "next";
import Link from "next/link";
import {
  BreadcrumbStructuredData,
  Breadcrumbs,
} from "@/components/breadcrumbs";
import { CloudinaryImage } from "@/components/cloudinary-image";

/**
 * Static Generation Configuration
 *
 * This page contains static historical content that never changes.
 * The page is statically generated at build time and never revalidated.
 *
 * This provides:
 * - Maximum performance - served instantly from CDN
 * - Zero server costs - all static, no server computation
 * - Excellent Core Web Vitals scores - fully static content
 *
 * The page will only regenerate when you redeploy the application.
 */
export const revalidate = false; // Never revalidate - content is static

export const metadata: Metadata = {
  title: "About The Lincoln Institution",
  description:
    "Learn about The Lincoln Institution, a Philadelphia charity founded by Mary McHenry Cox that operated from 1866-1922, housing Civil War orphans and providing education.",
  keywords: [
    "Lincoln Institution history",
    "Mary McHenry Cox",
    "Philadelphia charity",
    "Civil War orphans",
    "Educational Home",
    "808 South Eleventh Street",
    "1866-1922",
    "historical institution",
  ],
  openGraph: {
    title: "About The Lincoln Institution - Historical Institution 1866-1922",
    description:
      "Learn about The Lincoln Institution, a Philadelphia charity founded by Mary McHenry Cox that operated from 1866-1922, housing Civil War orphans and providing education.",
    type: "article",
  },
};

export default function AboutPage() {
  return (
    <main
      className="container mx-auto my-2 w-[95%] px-4 py-2 lg:my-12 lg:max-w-8/10"
      id="main-content"
    >
      <Breadcrumbs items={[{ label: "About" }]} />
      <BreadcrumbStructuredData items={[{ label: "About" }]} />
      <header className="mt-8 mb-12 text-center lg:mt-12 lg:mb-16">
        <h1 className="mb-6 font-bold text-4xl leading-tight lg:mb-8 lg:text-5xl">
          About The Lincoln Institution
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed lg:text-xl">
          Learn about the historical institution and this digital directory
        </p>
      </header>

      <article className="mx-auto mb-16 space-y-16 lg:mb-24 lg:max-w-[85ch] lg:space-y-24 xl:max-w-[95ch]">
        <section aria-labelledby="institution-heading">
          <h2
            className="mb-8 text-center font-semibold text-2xl leading-tight lg:mb-10 lg:text-3xl"
            id="institution-heading"
          >
            The Institution
          </h2>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
            <div className="prose prose-lg prose-gray lg:prose-xl max-w-none flex-1">
              <p className="leading-relaxed">
                The Lincoln Institution was a charitable institution founded by
                Mary McHenry Cox that operated from 1866 to 1922 at 808 South
                Eleventh Street in Philadelphia, Pennsylvania.
              </p>
            </div>
            <div className="flex-shrink-0 lg:mt-2">
              <CloudinaryImage
                alt="The Lincoln Institution Educational Home - Historical building where Civil War orphans were housed and educated"
                className="rounded-lg shadow-lg"
                crop="fill"
                height="300"
                quality="auto"
                src="EducationalHome_m5kpvv"
                width="400"
              />
            </div>
          </div>
        </section>

        <section aria-labelledby="civil-war-orphans-heading">
          <h2
            className="mb-8 text-center font-semibold text-2xl leading-tight lg:mb-10 lg:text-3xl"
            id="civil-war-orphans-heading"
          >
            Civil War Orphans
          </h2>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
            <div className="prose prose-lg prose-gray lg:prose-xl max-w-none flex-1 space-y-6 lg:space-y-7">
              <p className="leading-relaxed">
                The Lincoln Institution, a Philadelphia charity, housed orphaned
                boys of the Civil War during from 1866 to 1884, whose fathers
                had been Episcopalian. The orphans lived at two sites in
                Philadelphia. One at 11th Street and the other at 49th Street,
                the latter with the title of The Educational Home. The first
                site was for younger boys and the second for the older one. The
                older boys worked in city center businesses.
              </p>
              <p className="leading-relaxed">
                Information on the deaths of orphans is available{" "}
                <Link
                  href="https://www.the2nomads.site/TEHSDocumentStore/docs/doc837.html"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  here
                </Link>
                .
              </p>
              <p className="leading-relaxed">
                Documents concerning the Lincoln Institution can be found{" "}
                <Link
                  href="https://www.the2nomads.site/TEHSDocumentStore/LincolnInstitution.html"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  here
                </Link>
                .
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                The data were compiled by Heidi Sproat and Mike Bertram.
              </p>
            </div>
            <div className="flex-shrink-0 lg:mt-2">
              <CloudinaryImage
                alt="Lincoln Institution lithograph - Historical document showing the institution"
                className="rounded-lg shadow-lg"
                crop="fill"
                height="600"
                quality="auto"
                src="LincolnInstitutelithograph_vdkpa8"
                width="350"
              />
            </div>
          </div>
        </section>

        <section aria-labelledby="directory-heading">
          <div className="mx-auto max-w-3xl">
            <h2
              className="mb-8 text-center font-semibold text-2xl leading-tight lg:mb-10 lg:text-3xl"
              id="directory-heading"
            >
              This Digital Directory
            </h2>
            <div className="prose prose-lg prose-gray lg:prose-xl mx-auto max-w-none text-left">
              <p className="leading-relaxed">
                This digital directory contains historical records of students
                who attended the Lincoln Institution during its years of
                operation. The data provides valuable insights into the
                educational opportunities and experiences of students during
                this period in American history.
              </p>
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
