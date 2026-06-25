'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Video } from 'lucide-react';

export default function LoginPage() {
  const router                    = useRouter();
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('aivideo_token', res.data.token);
      router.push('/dashboard/projects');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="h-12 w-12 bg-violet-600 rounded-xl flex items-center justify-center">
            <Video className="h-6 w-6 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-zinc-100">AI Video Studio</h1>
        <p className="text-sm text-zinc-400">Sign in to your account</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-sm text-zinc-400 block mb-1">Email</label>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="text-sm text-zinc-400 block mb-1">Password</label>
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">Sign in</Button>
      </form>
    </div>
  );
}
