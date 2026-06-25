const colours: Record<string, string> = {
  landscape:    'bg-blue-900 text-blue-300',
  portrait:     'bg-purple-900 text-purple-300',
  ad:           'bg-orange-900 text-orange-300',
  draft:        'bg-zinc-800 text-zinc-300',
  rendering:    'bg-yellow-900 text-yellow-300',
  done:         'bg-green-900 text-green-300',
  failed:       'bg-red-900 text-red-300',
  upbeat:       'bg-yellow-900 text-yellow-300',
  calm:         'bg-sky-900 text-sky-300',
  dramatic:     'bg-red-900 text-red-300',
  corporate:    'bg-blue-900 text-blue-300',
  chill:        'bg-teal-900 text-teal-300',
  inspirational:'bg-violet-900 text-violet-300',
};

export function Badge({ label }: { label: string }) {
  const cls = colours[label] ?? 'bg-zinc-800 text-zinc-300';
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full capitalize ${cls}`}>
      {label}
    </span>
  );
}
