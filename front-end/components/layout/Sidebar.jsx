import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Trophy, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Heart, 
  Clock, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

export default function Sidebar() {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Pedidos', icon: ShoppingCart, path: '/orders' },
    { name: 'Produtos', icon: Package, path: '/products' },
    { name: 'Relatório de Vendas', icon: BarChart3, path: '/sales-report' },
    { name: 'Histórico', icon: Clock, path: '/history' },
    { name: 'Favoritos', icon: Heart, path: '/favourites' },
    { name: 'Mensagens', icon: MessageSquare, path: '/messages' },
    { name: 'Classificação', icon: Trophy, path: '/leaderboard' },
    { name: 'Configurações', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-full">
      <div className="p-6 flex flex-col items-center leading-none">
        <span className="font-serif text-lg font-bold tracking-tight text-foreground">FLORA</span>
        <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-muted-foreground">Acessórios</span>
        <span className="mt-1 h-0.5 w-full rounded-full bg-primary"></span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-4">
        {user && (
          <div className="text-xs text-muted-foreground px-2">
            Logado como: <span className="font-semibold text-foreground">{user.email}</span>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  );
}