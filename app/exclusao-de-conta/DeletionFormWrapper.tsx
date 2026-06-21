'use client';

import { useSearchParams } from 'next/navigation';
import { DeletionForm } from '@/components/DeletionForm';

export function DeletionFormWrapper() {
  const searchParams = useSearchParams();
  const source = searchParams.get('source') === 'app' ? 'app_webview' : 'web';
  return <DeletionForm source={source} />;
}
