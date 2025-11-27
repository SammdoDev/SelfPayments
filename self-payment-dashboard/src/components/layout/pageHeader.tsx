'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';

interface PageHeaderProps {
  extra?: ReactNode;
  title?: string;
}

export default function PageHeader({ extra, title }: PageHeaderProps) {
  const pathname = usePathname();
  const pathParts = pathname.split('/').filter((part) => part);

  const formatName = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');

  const breadcrumbs = pathParts.map((part, index) => {
    const href = '/' + pathParts.slice(0, index + 1).join('/');
    const isLast = index === pathParts.length - 1;

    return (
      <div key={href} className="flex items-center shrink-0">
        {index > 0 && (
          <ChevronRight size={14} className="mx-1 shrink-0" />
        )}
        {isLast ? (
          <span className="font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
            {formatName(part)}
          </span>
        ) : (
          <Link
            href={href}
            className="text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none"
          >
            {formatName(part)}
          </Link>
        )}
      </div>
    );
  });

  return (
    <div className="mb-4 sm:mb-6 pb-2 sm:pb-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-1.5">
        <div className="flex items-center gap-x-1 gap-y-0.5 overflow-x-auto no-scrollbar whitespace-nowrap max-w-full pr-1">
          {breadcrumbs}
        </div>

        {extra && <div className="flex sm:justify-end">{extra}</div>}
      </div>

      <h1 className="text-lg sm:text-2xl font-bold leading-tight">
        {title}
      </h1>
    </div>
  );
}
