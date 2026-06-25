'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Video, FolderOpen, LayoutTemplate, LogOut, Plus } from 'lucide-react';

const navItems = [
  { href: '/projects',  label: 'Projects',   icon: FolderOpen },
  { href: '/templates', label: 'Templates',  icon: LayoutTemplate },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('aivideo_token')) router.replace('/login');
    setEmail(localStorage.getItem('aivideo_user_email') ?? '');
  }, [router]);

  // Studio pages (/projects/[id]) use their own full-screen layout — no sidebar
  if (pathname.match(/^\/projects\/\d+$/)) {
    return <>{children}</>;
  }

  const signOut = () => {
    localStorage.removeItem('aivideo_token');
    localStorage.removeItem('aivideo_user_email');
    router.replace('/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-4 flex items-center gap-2 border-b border-zinc-800">
          <div className="h-8 w-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <Video className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-zinc-100 text-sm">AI Video Studio</span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <Link
            href="/projects"
            onClick={e => { e.preventDefault(); router.push('/projects'); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium mb-3 transition-colors"
          >
            <Plus className="h-4 w-4" /> New Video
          </Link>
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href} href={href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === href || pathname.startsWith(href + '/')
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              <Icon className="h-4 w-4" />{label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-zinc-800 space-y-1">
          {email && (
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="h-6 w-6 rounded-full bg-violet-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                {email[0]?.toUpperCase()}
              </div>
              <span className="text-xs text-zinc-500 truncate">{email}</span>
            </div>
          )}
          <button onClick={signOut} className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-zinc-950 p-6">
        {children}
      </main>
    </div>
  );
}
