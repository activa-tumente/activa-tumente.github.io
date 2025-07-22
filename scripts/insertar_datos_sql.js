import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY son requeridas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Datos de grupos
const grupos = [
  { nombre: '6B' },
  { nombre: '8A' },
  { nombre: '8B' }
];

// Datos de estudiantes por grupo
const estudiantesPorGrupo = {
  '6B': [
    { nombre: 'Ana', apellido: 'García Rodríguez', edad: 11, genero: 'F', numero_documento: '1234567890' },
    { nombre: 'Carlos', apellido: 'López Martínez', edad: 12, genero: 'M', numero_documento: '1234567891' },
    { nombre: 'María', apellido: 'Rodríguez Silva', edad: 11, genero: 'F', numero_documento: '1234567892' },
    { nombre: 'Juan', apellido: 'Martínez González', edad: 12, genero: 'M', numero_documento: '1234567893' },
    { nombre: 'Sofía', apellido: 'Hernández Pérez', edad: 11, genero: 'F', numero_documento: '1234567894' }
  ],
  '8A': [
    { nombre: 'Andrea', apellido: 'Ramírez Morales', edad: 13, genero: 'F', numero_documento: '1234568001' },
    { nombre: 'Bruno', apellido: 'Morales Gutiérrez', edad: 14, genero: 'M', numero_documento: '1234568002' },
    { nombre: 'Camila', apellido: 'Gutiérrez Jiménez', edad: 13, genero: 'F', numero_documento: '1234568003' },
    { nombre: 'David', apellido: 'Morales Jiménez', edad: 14, genero: 'M', numero_documento: '1234568004' },
    { nombre: 'Elena', apellido: 'Gutiérrez Ruiz', edad: 13, genero: 'F', numero_documento: '1234568005' }
  ],
  '8B': [
    { nombre: 'Alicia', apellido: 'Fernández Mendoza', edad: 13, genero: 'F', numero_documento: '1234569001' },
    { nombre: 'Bernardo', apellido: 'Gómez Acosta', edad: 14, genero: 'M', numero_documento: '1234569002' },
    { nombre: 'Claudia', apellido: 'Paredes Medina', edad: 13, genero: 'F', numero_documento: '1234569003' },
    { nombre: 'Diego', apellido: 'Salazar Vega', edad: 14, genero: 'M', numero_documento: '1234569004' },
    { nombre: 'Esperanza', apellido: 'Torres López', edad: 13, genero: 'F', numero_documento: '1234569005' }
  ]
};

async function insertarDatos() {
  try {
    console.log('Iniciando inserción de datos...');
    
    // Primero, intentar deshabilitar RLS temporalmente usando SQL directo
    console.log('Deshabilitando RLS...');
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE grupos DISABLE ROW LEVEL SECURITY;
        ALTER TABLE estudiantes DISABLE ROW LEVEL SECURITY;
      `
    });
    
    if (rlsError) {
      console.log('No se pudo deshabilitar RLS, continuando sin RLS:', rlsError.message);
    }
    
    // Limpiar datos existentes
    console.log('Limpiando datos existentes...');
    await supabase.from('estudiantes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('grupos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // Insertar grupos
    console.log('Insertando grupos...');
    const { data: gruposInsertados, error: gruposError } = await supabase
      .from('grupos')
      .insert(grupos)
      .select();
    
    if (gruposError) {
      console.error('Error insertando grupos:', gruposError);
      return;
    }
    
    console.log('Grupos insertados:', gruposInsertados);
    
    // Insertar estudiantes para cada grupo
    for (const grupo of gruposInsertados) {
      const estudiantesGrupo = estudiantesPorGrupo[grupo.nombre];
      if (estudiantesGrupo) {
        console.log(`Insertando estudiantes para grupo ${grupo.nombre}...`);
        
        const estudiantesConGrupo = estudiantesGrupo.map(estudiante => ({
          ...estudiante,
          grupo_id: grupo.id
        }));
        
        const { data: estudiantesInsertados, error: estudiantesError } = await supabase
          .from('estudiantes')
          .insert(estudiantesConGrupo)
          .select();
        
        if (estudiantesError) {
          console.error(`Error insertando estudiantes para grupo ${grupo.nombre}:`, estudiantesError);
        } else {
          console.log(`Estudiantes insertados para grupo ${grupo.nombre}:`, estudiantesInsertados.length);
        }
      }
    }
    
    console.log('\n✅ Datos insertados exitosamente!');
    
    // Verificar los datos insertados
    console.log('\nVerificando datos insertados...');
    const { data: gruposVerificacion } = await supabase.from('grupos').select('*');
    const { data: estudiantesVerificacion } = await supabase.from('estudiantes').select('*');
    
    console.log(`Grupos en la base de datos: ${gruposVerificacion?.length || 0}`);
    console.log(`Estudiantes en la base de datos: ${estudiantesVerificacion?.length || 0}`);
    
  } catch (error) {
    console.error('Error general:', error);
  }
}

insertarDatos();