'use client';

import { Suspense } from 'react';
import AppInvoice from './app-invoice';

export default function InvoicePage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading invoice...</p>}>
      <AppInvoice />
    </Suspense>
  );
}
