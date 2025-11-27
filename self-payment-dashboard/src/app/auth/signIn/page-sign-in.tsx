'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomTextField from '@/components/textField/textField';
import CustomButton from '@/components/button/button';

const PageSignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staffName, setStaffName] = useState('');
  const [role, setRole] = useState('Admin');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('userName', data.user.staff_name);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userRole', data.user.role);

      // Arahkan ke dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          {'Sign In'}
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <CustomTextField
          name="email"
          label="Email"
          placeholder="Input email"
          value={email}
          onChange={(e: { name: string; value: string }) => setEmail(e.value)}
        />

        <CustomTextField
          name="password"
          label="Password"
          placeholder="Input password"
          type="password"
          value={password}
          onChange={(e: { name: string; value: string }) => setPassword(e.value)}
        />

        <CustomButton
          label={'Sign In'}
          icon={'pi pi-sign-in'}
          type="submit"
          severity='info'
        />

      </form>
    </div>
  );
};

export default PageSignIn;
