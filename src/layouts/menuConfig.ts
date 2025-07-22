// src/layouts/menuConfig.ts
import type { LucideIcon } from 'lucide-react';
import {
  BarChart2,
  Settings,
  LogOut,
  HelpCircle,
  FileText,
  Cog,
  School,
  Users,
  Shield,
  BookOpen,
  Activity,
  Home,
  User,
  Server,
} from 'lucide-react';

export interface MenuItem {
  id: string;
  label?: string;
  icon?: LucideIcon;
  path?: string;
  subItems?: MenuItem[];
  isBottom?: boolean; // Para elementos como Ayuda o Logout
  isDivider?: boolean; // Para separadores
  requiresAuth?: boolean; // Ejemplo: si algunos items dependen de roles
  expanded?: boolean; // Para controlar si un menú está expandido por defecto
}

export const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: 'Inicio',
    icon: Home,
    path: '/',
  },
  {
    id: 'dashboards',
    label: 'Dashboards',
    icon: BarChart2,
    subItems: [
      { id: 'bulls-dashboard', label: 'Dashboard BULL-S', path: '/admin/bulls-dashboard', icon: BarChart2 },
      { id: 'dashboard-general', label: 'Dashboard General', path: '/admin/dashboard-general', icon: BarChart2 },
      { id: 'dashboard-convivencia', label: 'Convivencia Escolar', path: '/admin/dashboard-convivencia', icon: Shield },
      { id: 'dashboard-grupos', label: 'Dashboards por Grupo', path: '/admin/dashboards-por-grupo', icon: Activity },
    ],
    expanded: true, // Mantener expandido por defecto
  },
  {
    id: 'students',
    label: 'Estudiantes',
    icon: School,
    subItems: [
      { id: 'students-list', label: 'Listado', path: '/admin/estudiantes', icon: Users },
      { id: 'students-groups', label: 'Grupos', path: '/admin/estudiantes/grupos', icon: BookOpen },
    ],
  },
  {
    id: 'reports',
    label: 'Informes',
    icon: FileText,
    path: '/admin/reports',
  },
  {
    id: 'admin',
    label: 'Administración',
    icon: Settings, // Icono principal para el grupo
    subItems: [
      { id: 'admin-institutions', label: 'Instituciones', path: '/admin/instituciones', icon: School },
      { id: 'admin-users', label: 'Usuarios', path: '/admin/usuarios', icon: Users },
      { id: 'admin-roles', label: 'Roles y Permisos', path: '/admin/roles-permisos', icon: Shield },
    ],
  },
  {
    id: 'settings',
    label: 'Configuración',
    icon: Cog, // Icono principal para el grupo
    subItems: [
      { id: 'settings-system', label: 'Sistema', path: '/admin/configuracion/sistema', icon: Cog },
      { id: 'settings-profile', label: 'Mi Perfil', path: '/admin/configuracion/perfil', icon: User },
      { id: 'settings-diagnostics', label: 'Diagnóstico', path: '/admin/diagnostics/supabase', icon: Server },
    ],
  },
  // --- Elementos inferiores ---
  { id: 'divider-1', isDivider: true, isBottom: true },
  {
    id: 'help',
    label: 'Ayuda y Soporte',
    icon: HelpCircle,
    isBottom: true,
    // path: '/ayuda' // O podría abrir el modal directamente
  },
  {
    id: 'logout',
    label: 'Cerrar Sesión',
    icon: LogOut,
    isBottom: true,
    // path: '#' // No necesita path, usará onClick
  },
];

export const favoriteableItems = menuItems
  .filter(item => !item.isBottom && !item.isDivider)
  .map(item => item.id);