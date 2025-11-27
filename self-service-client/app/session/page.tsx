'use client';

import { Suspense } from 'react';
import AppSession from './app-session';

export default function InvoicePage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading Session.</p>}>
      <AppSession />
    </Suspense>
  );
}
