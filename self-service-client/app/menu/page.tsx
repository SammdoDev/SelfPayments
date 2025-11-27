'use client';

import { Suspense } from 'react';
import AppMenu from './app-menu';

export default function InvoicePage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading Session.</p>}>
      <AppMenu />
    </Suspense>
  );
}
