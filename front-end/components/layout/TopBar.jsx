import { Bell, ChevronDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInventory } from '@/hooks/useInventory';

export default function TopBar() {
  const inventory = useInventory();
  const count = inventory?.metrics?.alerts || 0;
  return <header className="sticky top-0 z-20 flex h-16 items-center gap-6 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-6">
    <div className="relative flex-1 max-w-md"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input placeholder="Search here..." className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" /></div>
    <Link to="/messages" className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"><Bell className="h-[18px] w-[18px]" />{count > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">{count}</span>}</Link>
    <Link to="/profile" className="flex items-center gap-2 rounded-lg border border-border bg-card p-1 pr-2 transition-colors hover:border-primary"><div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary font-heading text-xs font-bold text-foreground">JD</div><ChevronDown className="h-4 w-4 text-muted-foreground" /></Link>
  </header>;
}