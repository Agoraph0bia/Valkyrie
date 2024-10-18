'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import React, { useState } from 'react';

const Breadcrumbs = () => {
  const paths = usePathname();

  const linkPath = paths.split('/').slice(2);

  const pathArray = linkPath.map((path, i) => {
    return {
      crumb: path,
      href: '/folders/' + linkPath.slice(0, i + 1).join('/'),
    };
  });

  return (
    <div className="flex pt-5 justify-start w-full">
      <ul className="flex">
        <li key={0} className="mx-3">
          <Link href="/folders">Home</Link>
        </li>
        {pathArray.map((link, idx) => {
          return (
            <>
              {'>'}
              <li key={idx + 1} className="mx-3">
                <Link href={link.href}>
                  {link.crumb.replaceAll('/', ' > ')}
                </Link>
              </li>
            </>
          );
        })}
      </ul>
    </div>
  );
};

export default Breadcrumbs;
