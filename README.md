# BULL-S Analysis Platform

Sistema completo de análisis sociométrico para la detección y prevención de bullying escolar basado en el Test BULL-S.

## 🚀 Demo en Vivo

**[Ver Demo](https://activa-tumente.github.io/Bull-S/)** - Sitio desplegado en GitHub Pages

## 🎯 Características

- **Análisis Sociométrico**: Implementación completa del Test BULL-S
- **Dashboard Interactivo**: Visualización de datos en tiempo real
- **Gestión de Usuarios**: Sistema de autenticación para estudiantes y administradores
- **Reportes Avanzados**: Generación de reportes en PDF con análisis detallados
- **Interfaz Moderna**: Desarrollado con React, TypeScript y Tailwind CSS

## 🚀 Tecnologías

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Visualización**: Recharts, Framer Motion
- **Herramientas**: Vite, ESLint, PostCSS
- **Despliegue**: GitHub Pages con GitHub Actions

## 🌐 Demo en Vivo

El proyecto está desplegado automáticamente en GitHub Pages:
**https://activa-tumente.github.io/Bull-S/**

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta en Supabase

## ⚙️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/activa-tumente/Bull-S.git
   cd Bull-S
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` con tus credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

## 🌐 Despliegue en GitHub Pages

El proyecto se despliega automáticamente en GitHub Pages usando GitHub Actions. Para configurar el despliegue:

1. **Configurar GitHub Pages**: Ve a Settings > Pages y selecciona "GitHub Actions" como source
2. **Agregar Secrets**: En Settings > Secrets and variables > Actions, agrega:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **Despliegue automático**: Cada push a `main` despliega automáticamente

Ver [GITHUB_SETUP.md](./GITHUB_SETUP.md) para instrucciones detalladas.

## 🏗️ Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la build
- `npm run lint` - Ejecutar linter
- `npm run type-check` - Verificar tipos TypeScript

## 📁 Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas de la aplicación
├── lib/           # Utilidades y configuración
├── services/      # Servicios de negocio
├── types/         # Definiciones de tipos
├── hooks/         # Custom hooks
└── utils/         # Funciones utilitarias
```

## 🔧 Configuración de Base de Datos

El proyecto incluye scripts para configurar la base de datos en Supabase:

```bash
# Crear usuarios de prueba
npm run crear-usuarios

# Crear grupos y estudiantes
npm run crear-grupo-6b
```

## 📊 Funcionalidades Principales

### Para Estudiantes
- Acceso al cuestionario BULL-S
- Visualización de resultados personales
- Dashboard con métricas sociométricas

### Para Administradores
- Gestión de grupos y estudiantes
- Análisis completo de resultados
- Generación de reportes
- Dashboard administrativo

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

Desarrollado por el equipo BULL-S Development Team.

## 📞 Soporte

Para soporte técnico o preguntas, por favor abre un issue en GitHub.
