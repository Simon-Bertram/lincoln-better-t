import Script from 'next/script';

type StructuredDataProps = {
  type: 'Organization' | 'WebSite' | 'Dataset';
  data: Record<string, unknown>;
};

export function StructuredData({ type, data }: StructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <Script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for structured data
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
      id={`structured-data-${type.toLowerCase()}`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for structured data
      type="application/ld+json"
    />
  );
}

// Predefined structured data for the Lincoln Institute
export function LincolnInstituteStructuredData() {
  return (
    <StructuredData
      data={{
        name: 'The Lincoln Institute',
        description:
          'A Philadelphia charity that operated from 1866 to 1922, housing Civil War orphans and providing education.',
        url: 'https://lincoln-institute-directory.vercel.app',
        foundingDate: '1866',
        dissolutionDate: '1922',
        founder: {
          '@type': 'Person',
          name: 'Mary McHenry Cox',
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: '808 South Eleventh Street',
          addressLocality: 'Philadelphia',
          addressRegion: 'Pennsylvania',
          addressCountry: 'US',
        },
        sameAs: [
          'https://www.the2nomads.site/TEHSDocumentStore/LincolnInstitution.html',
        ],
      }}
      type="Organization"
    />
  );
}

export function WebsiteStructuredData() {
  return (
    <StructuredData
      data={{
        name: 'The Lincoln Institute Directory',
        description:
          'Digital directory containing historical records of students who attended The Lincoln Institute from 1866-1922.',
        url: 'https://lincoln-institute-directory.vercel.app',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate:
              'https://lincoln-institute-directory.vercel.app/?search={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Heidi Sproat and Mike Bertram',
        },
      }}
      type="WebSite"
    />
  );
}

export function DatasetStructuredData() {
  return (
    <StructuredData
      data={{
        name: 'Lincoln Institute Student Records',
        description:
          'Historical records of students and Civil War orphans who attended The Lincoln Institute from 1866-1922.',
        url: 'https://lincoln-institute-directory.vercel.app',
        temporalCoverage: '1866/1922',
        spatialCoverage: {
          '@type': 'Place',
          name: 'Philadelphia, Pennsylvania',
        },
        creator: {
          '@type': 'Person',
          name: 'Heidi Sproat and Mike Bertram',
        },
        datePublished: new Date().toISOString(),
        license: 'https://creativecommons.org/licenses/by/4.0/',
        keywords: [
          'Lincoln Institute',
          'Civil War orphans',
          'student records',
          'Philadelphia history',
          'educational history',
          '1866-1922',
        ],
      }}
      type="Dataset"
    />
  );
}
