import PageHeader from '@/components/layout/pageHeader';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AppDashboard from './app-dashboard';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('sb-access-token')?.value;

  if (!token) {
    redirect('/auth/signIn');
  }

  return (
    <AppDashboard />
  );
}
