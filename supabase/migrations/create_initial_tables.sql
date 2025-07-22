```sql
/*
  # Create Initial Tables and Basic RLS

  This migration creates the foundational tables for the application and enables basic Row Level Security.

  1. New Tables
     - `instituciones_educativas`: Stores information about educational institutions.
       - `id` (uuid, pk): Unique identifier.
       - `nombre` (text): Name of the institution (required).
       - `tipo_institucion` (varchar(50)): Type of institution (e.g., 'Colegio', 'Instituto').
       - `direccion` (text): Address of the institution.
       - `fecha_creacion` (timestamptz): Timestamp of creation.
       - `fecha_actualizacion` (timestamptz): Timestamp of last update.
     - `estudiantes`: Stores student information.
       - `id` (uuid, pk): Unique identifier.
       - `codigo_anonimizado` (varchar(50)): Anonymized student code (required).
       - `grado` (varchar(20)): Grade or level (e.g., '5A', '1 ESO').
       - `institucion_id` (uuid): Foreign key referencing `instituciones_educativas` (required, constraint added later).
       - `fecha_creacion` (timestamptz): Timestamp of creation.
       - `fecha_actualizacion` (timestamptz): Timestamp of last update.
     - `grupos`: Stores group/class information.
       - `id` (uuid, pk): Unique identifier.
       - `nombre` (varchar(100)): Name of the group (required).
       - `descripcion` (text): Optional description of the group.
       - `institucion_id` (uuid): Foreign key referencing `instituciones_educativas` (required, constraint added later).
       - `fecha_creacion` (timestamptz): Timestamp of creation.
       - `fecha_actualizacion` (timestamptz): Timestamp of last update.
     - `cuestionarios`: Stores questionnaire definitions.
       - `id` (uuid, pk): Unique identifier.
       - `titulo` (varchar(200)): Title of the questionnaire (required).
       - `descripcion` (text): Optional description.
       - `fecha_administracion` (timestamptz): Date the questionnaire was administered (optional).
       - `fecha_creacion` (timestamptz): Timestamp of creation.
       - `fecha_actualizacion` (timestamptz): Timestamp of last update.

  2. Security
     - Enabled Row Level Security (RLS) on all four tables.
     - Added initial RLS policies:
       - `instituciones_educativas`: Accessible only by users in the (currently undefined) `administrators` table.
       - `estudiantes`: Accessible by administrators or users linked via the (currently undefined) `profesores_instituciones` table.
       - `grupos`: Accessible by administrators or users linked via the (currently undefined) `profesores_instituciones` table.
       - `cuestionarios`: Accessible by any authenticated user.

  3. Important Notes
     - Foreign key constraints are NOT added in this migration; they will be added in a subsequent migration after all tables are created.
     - The RLS policies depend on `administrators` and `profesores_instituciones` tables/logic, which need to be defined separately for the policies to work as intended.
     - A trigger for automatically updating `fecha_actualizacion` is recommended but not included here.
*/

-- Crear tablas principales
CREATE TABLE IF NOT EXISTS instituciones_educativas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    tipo_institucion VARCHAR(50),
    direccion TEXT,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now(),
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS estudiantes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_anonimizado VARCHAR(50) NOT NULL UNIQUE, -- Added UNIQUE constraint
    grado VARCHAR(20),
    institucion_id UUID NOT NULL, -- FK constraint added later
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now(),
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS grupos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    institucion_id UUID NOT NULL, -- FK constraint added later
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now(),
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cuestionarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    fecha_administracion TIMESTAMPTZ,
    fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT now(),
    fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security para todas las tablas
ALTER TABLE instituciones_educativas ENABLE ROW LEVEL SECURITY;
ALTER TABLE estudiantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cuestionarios ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS básicas para cada tabla
-- Política para instituciones_educativas - Asumiendo una tabla 'administrators' con 'user_id'
DROP POLICY IF EXISTS "Instituciones acceso administradores" ON instituciones_educativas;
CREATE POLICY "Instituciones acceso administradores" ON instituciones_educativas
    FOR ALL -- Use FOR ALL for simplicity, can be refined later
    USING (
      exists(select 1 from public.administrators where user_id = auth.uid()) -- Check if user is in administrators table
    )
    WITH CHECK (
      exists(select 1 from public.administrators where user_id = auth.uid())
    );

-- Política para estudiantes - Asumiendo 'administrators' y 'profesores_instituciones'
DROP POLICY IF EXISTS "Estudiantes acceso restringido" ON estudiantes;
CREATE POLICY "Estudiantes acceso restringido" ON estudiantes
    FOR ALL
    USING (
      exists(select 1 from public.administrators where user_id = auth.uid())
      OR
      exists(select 1 from public.profesores_instituciones pi where pi.profesor_id = auth.uid() and pi.institucion_id = estudiantes.institucion_id)
    )
    WITH CHECK (
      exists(select 1 from public.administrators where user_id = auth.uid())
      OR
      exists(select 1 from public.profesores_instituciones pi where pi.profesor_id = auth.uid() and pi.institucion_id = estudiantes.institucion_id)
    );


-- Política para grupos - Similar a estudiantes
DROP POLICY IF EXISTS "Grupos acceso restringido" ON grupos;
CREATE POLICY "Grupos acceso restringido" ON grupos
    FOR ALL
    USING (
      exists(select 1 from public.administrators where user_id = auth.uid())
      OR
      exists(select 1 from public.profesores_instituciones pi where pi.profesor_id = auth.uid() and pi.institucion_id = grupos.institucion_id)
    )
     WITH CHECK (
      exists(select 1 from public.administrators where user_id = auth.uid())
      OR
      exists(select 1 from public.profesores_instituciones pi where pi.profesor_id = auth.uid() and pi.institucion_id = grupos.institucion_id)
    );

-- Política para cuestionarios - disponibles para usuarios autenticados
DROP POLICY IF EXISTS "Cuestionarios acceso autenticado" ON cuestionarios;
CREATE POLICY "Cuestionarios acceso autenticado" ON cuestionarios
    FOR SELECT -- Allow SELECT for any authenticated user
    USING (auth.role() = 'authenticated');

CREATE POLICY "Cuestionarios manejo administradores" ON cuestionarios
    FOR ALL -- Allow full control for administrators
    USING (
      exists(select 1 from public.administrators where user_id = auth.uid())
    )
    WITH CHECK (
      exists(select 1 from public.administrators where user_id = auth.uid())
    );

    ```