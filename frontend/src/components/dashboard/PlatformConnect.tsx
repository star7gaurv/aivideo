'use client';
import { useEffect, useRef } from 'react';
import { Youtube, Instagram, CheckCircle2, Link2, Unlink, Loader2 } from 'lucide-react';
import {
  useSocialAccounts,
  useConnectPlatform,
  useDisconnectPlatform,
  SocialAccount,
} from '@/lib/hooks/usePublish';
import { useQueryClient } from '@tanstack/react-query';

const PLATFORM_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  youtube: {
    label: 'YouTube',
    icon: <Youtube className="h-4 w-4" />,
    color: 'text-red-400',
  },
  instagram: {
    label: 'Instagram',
    icon: <Instagram className="h-4 w-4" />,
    color: 'text-pink-400',
  },
};

function PlatformRow({ platform, account }: { platform: string; account?: SocialAccount }) {
  const qc           = useQueryClient();
  const meta         = PLATFORM_META[platform];
  const popupRef     = useRef<Window | null>(null);
  const { mutate: connect, isPending: connecting } = useConnectPlatform();
  const { mutate: disconnect, isPending: disconnecting } = useDisconnectPlatform();

  // Listen for OAuth popup success message
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.success && e.data?.platform === platform) {
        qc.invalidateQueries({ queryKey: ['social-accounts'] });
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [platform, qc]);

  const handleConnect = () => {
    connect(platform, {
      onSuccess: ({ url }) => {
        popupRef.current = window.open(url, 'oauth', 'width=560,height=640,left=200,top=100');
      },
    });
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-zinc-800 last:border-0">
      <div className="flex items-center gap-2">
        <span className={meta.color}>{meta.icon}</span>
        <span className="text-sm text-zinc-200">{meta.label}</span>
        {account && (
          <span className="text-xs text-zinc-500">@{account.platform_username ?? account.platform_channel_id}</span>
        )}
      </div>

      {account ? (
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-green-400">
            <CheckCircle2 className="h-3 w-3" /> Connected
          </span>
          <button
            onClick={() => disconnect(platform)}
            disabled={disconnecting}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-red-400 transition-colors"
          >
            {disconnecting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Unlink className="h-3 w-3" />}
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 border border-violet-700 hover:border-violet-500 rounded-md px-2.5 py-1 transition-colors"
        >
          {connecting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Link2 className="h-3 w-3" />}
          Connect
        </button>
      )}
    </div>
  );
}

export function PlatformConnect() {
  const { data: accounts = [], isLoading } = useSocialAccounts();

  const accountMap = Object.fromEntries(accounts.map((a) => [a.platform, a]));

  return (
    <div className="space-y-1">
      <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Connected platforms</h3>
      {Object.keys(PLATFORM_META).map((platform) => (
        <PlatformRow key={platform} platform={platform} account={accountMap[platform]} />
      ))}
    </div>
  );
}
