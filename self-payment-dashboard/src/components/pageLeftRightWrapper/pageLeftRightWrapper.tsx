'use client';

import { ReactNode } from "react";

interface PageLeftRightWrapperProps {
  leftComponent: ReactNode;
  rightComponent: ReactNode;
  className?: string;
}

const PageLeftRightWrapper: React.FC<PageLeftRightWrapperProps> = ({
  leftComponent,
  rightComponent,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col p-1 md:p-0 mt-4 lg:flex-row justify-between items-start w-full h-full sm:gap-4 lg:gap-6 ${className}`}
    >
      <aside className="w-full lg:w-auto flex-1 min-w-0">
        {leftComponent}
      </aside>

      <aside className="w-full lg:w-auto flex-shrink-0 mt-2 lg:mt-0">
        {rightComponent}
      </aside>
    </div>
  );
};

export default PageLeftRightWrapper;
