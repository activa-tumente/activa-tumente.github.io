# Funciones Serverless para BULLS

Este directorio contiene las funciones serverless (Edge Functions) para el proyecto BULLS, implementadas en Supabase.

## Estructura

- `user-management/`: Funciones para gestión de usuarios
- `role-management/`: Funciones para gestión de roles y permisos

## Requisitos previos

1. Tener instalado el CLI de Supabase
2. Tener configurado el proyecto de Supabase

## Pasos para implementar las funciones

### 1. Crear las tablas y funciones SQL

Primero, debes ejecutar los scripts SQL para crear las tablas y funciones necesarias:

```bash
# Conectarse a la base de datos de Supabase
supabase db reset

# O ejecutar los scripts manualmente
psql -h <host> -p <port> -d <database> -U <user> -f sql/create_roles_modules_tables.sql
psql -h <host> -p <port> -d <database> -U <user> -f sql/create_user_management_functions.sql
psql -h <host> -p <port> -d <database> -U <user> -f sql/create_admin_functions.sql
```

### 2. Implementar las funciones serverless

```bash
# Implementar la función de gestión de usuarios
supabase functions deploy user-management --project-ref <project-ref>

# Implementar la función de gestión de roles
supabase functions deploy role-management --project-ref <project-ref>
```

### 3. Configurar las variables de entorno

Asegúrate de configurar las siguientes variables de entorno en el panel de Supabase:

- `SUPABASE_URL`: URL de tu proyecto Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Clave de servicio de tu proyecto Supabase

```bash
# Configurar variables de entorno
supabase secrets set SUPABASE_URL=<url> --project-ref <project-ref>
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<key> --project-ref <project-ref>
```

## Uso

Las funciones serverless se pueden invocar desde el frontend utilizando el cliente de Supabase:

```typescript
import { supabase } from '../lib/supabase';

// Ejemplo de invocación
const { data, error } = await supabase.functions.invoke('user-management', {
  body: JSON.stringify({
    action: 'createUser',
    email: 'usuario@ejemplo.com',
    password: 'contraseña',
    firstName: 'Nombre',
    lastName: 'Apellido',
    role: 'Psicologo'
  })
});
```

Para facilitar el uso, se ha creado un cliente en `src/lib/api/serverlessFunctions.ts` que proporciona métodos para interactuar con estas funciones.

## Seguridad

Estas funciones utilizan la clave de servicio de Supabase para realizar operaciones administrativas, por lo que es importante asegurarse de que:

1. Las funciones validen adecuadamente los permisos del usuario que las invoca
2. Las políticas RLS estén correctamente configuradas
3. Las variables de entorno estén seguras

## Solución de problemas

Si encuentras problemas al implementar o utilizar estas funciones:

1. Verifica los logs de las funciones en el panel de Supabase
2. Asegúrate de que las tablas y funciones SQL se hayan creado correctamente
3. Verifica que las variables de entorno estén configuradas correctamente
4. Comprueba que el usuario tenga los permisos necesarios para realizar la operación
