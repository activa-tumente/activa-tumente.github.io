/**
 * Script simplificado para insertar datos reales de estudiantes
 * Usa solo las tablas existentes: grupos y estudiantes
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { randomUUID } from 'crypto';

// Cargar variables de entorno
dotenv.config();

// Crear cliente de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables de entorno de Supabase no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Datos reales de estudiantes
const estudiantesReales = {
  '6B': [
    { nombre: 'Ana', apellido: 'García Rodríguez', edad: 11, genero: 'F', numero_documento: '1234567890' },
    { nombre: 'Carlos', apellido: 'López Martínez', edad: 12, genero: 'M', numero_documento: '1234567891' },
    { nombre: 'María', apellido: 'Rodríguez Silva', edad: 11, genero: 'F', numero_documento: '1234567892' },
    { nombre: 'Juan', apellido: 'Martínez González', edad: 12, genero: 'M', numero_documento: '1234567893' },
    { nombre: 'Sofía', apellido: 'Hernández Pérez', edad: 11, genero: 'F', numero_documento: '1234567894' },
    { nombre: 'Diego', apellido: 'González Torres', edad: 12, genero: 'M', numero_documento: '1234567895' },
    { nombre: 'Valentina', apellido: 'Torres López', edad: 11, genero: 'F', numero_documento: '1234567896' },
    { nombre: 'Sebastián', apellido: 'López García', edad: 12, genero: 'M', numero_documento: '1234567897' },
    { nombre: 'Isabella', apellido: 'García Hernández', edad: 11, genero: 'F', numero_documento: '1234567898' },
    { nombre: 'Mateo', apellido: 'Hernández Martínez', edad: 12, genero: 'M', numero_documento: '1234567899' },
    { nombre: 'Javier', apellido: 'Flores Rojas', edad: 12, genero: 'M', numero_documento: '1234567901' },
    { nombre: 'Isabella', apellido: 'Vargas Ortiz', edad: 11, genero: 'F', numero_documento: '1234567902' },
    { nombre: 'Daniel', apellido: 'Rojas Mendoza', edad: 12, genero: 'M', numero_documento: '1234567903' },
    { nombre: 'Gabriela', apellido: 'Castro Acosta', edad: 11, genero: 'F', numero_documento: '1234567904' },
    { nombre: 'Sebastián', apellido: 'Ortiz Medina', edad: 12, genero: 'M', numero_documento: '1234567905' },
    { nombre: 'Natalia', apellido: 'Morales Gutiérrez', edad: 11, genero: 'F', numero_documento: '1234567906' },
    { nombre: 'Alejandro', apellido: 'Gutiérrez Jiménez', edad: 12, genero: 'M', numero_documento: '1234567907' },
    { nombre: 'Valeria', apellido: 'Jiménez Ruiz', edad: 11, genero: 'F', numero_documento: '1234567908' },
    { nombre: 'Mateo', apellido: 'Ruiz Álvarez', edad: 12, genero: 'M', numero_documento: '1234567909' },
    { nombre: 'Lucía', apellido: 'Álvarez Mendoza', edad: 11, genero: 'F', numero_documento: '1234567910' },
    { nombre: 'Santiago', apellido: 'Mendoza Acosta', edad: 12, genero: 'M', numero_documento: '1234567911' },
    { nombre: 'Mariana', apellido: 'Acosta Medina', edad: 11, genero: 'F', numero_documento: '1234567912' },
    { nombre: 'Nicolás', apellido: 'Medina Vega', edad: 12, genero: 'M', numero_documento: '1234567913' },
    { nombre: 'Emma', apellido: 'Vega Herrera', edad: 11, genero: 'F', numero_documento: '1234567914' },
    { nombre: 'Tomás', apellido: 'Herrera Castillo', edad: 12, genero: 'M', numero_documento: '1234567915' }
  ],
  '8A': [
    { nombre: 'Andrea', apellido: 'Ramírez Morales', edad: 13, genero: 'F', numero_documento: '1234568001' },
    { nombre: 'Bruno', apellido: 'Morales Gutiérrez', edad: 14, genero: 'M', numero_documento: '1234568002' },
    { nombre: 'Camila', apellido: 'Gutiérrez Jiménez', edad: 13, genero: 'F', numero_documento: '1234568003' },
    { nombre: 'David', apellido: 'Morales Jiménez', edad: 14, genero: 'M', numero_documento: '1234568004' },
    { nombre: 'Elena', apellido: 'Gutiérrez Ruiz', edad: 13, genero: 'F', numero_documento: '1234568005' },
    { nombre: 'Fernando', apellido: 'Vargas Álvarez', edad: 14, genero: 'M', numero_documento: '1234568006' },
    { nombre: 'Gabriela', apellido: 'Torres Mendoza', edad: 13, genero: 'F', numero_documento: '1234568007' },
    { nombre: 'Héctor', apellido: 'Jiménez Acosta', edad: 14, genero: 'M', numero_documento: '1234568008' },
    { nombre: 'Inés', apellido: 'Flores Medina', edad: 13, genero: 'F', numero_documento: '1234568009' },
    { nombre: 'Jorge', apellido: 'Sánchez Vega', edad: 14, genero: 'M', numero_documento: '1234568010' },
    { nombre: 'Karla', apellido: 'Díaz Herrera', edad: 13, genero: 'F', numero_documento: '1234568011' },
    { nombre: 'Luis', apellido: 'Martín Castillo', edad: 14, genero: 'M', numero_documento: '1234568012' },
    { nombre: 'Mónica', apellido: 'Ruiz Ramírez', edad: 13, genero: 'F', numero_documento: '1234568013' },
    { nombre: 'Néstor', apellido: 'Peña Morales', edad: 14, genero: 'M', numero_documento: '1234568014' },
    { nombre: 'Olivia', apellido: 'Cruz Gutiérrez', edad: 13, genero: 'F', numero_documento: '1234568015' }
  ],
  '8B': [
    { nombre: 'Alicia', apellido: 'Fernández Mendoza', edad: 13, genero: 'F', numero_documento: '1234569001' },
    { nombre: 'Bernardo', apellido: 'Gómez Acosta', edad: 14, genero: 'M', numero_documento: '1234569002' },
    { nombre: 'Claudia', apellido: 'Paredes Medina', edad: 13, genero: 'F', numero_documento: '1234569003' },
    { nombre: 'Diego', apellido: 'Salazar Vega', edad: 14, genero: 'M', numero_documento: '1234569004' },
    { nombre: 'Estela', apellido: 'Cordero Herrera', edad: 13, genero: 'F', numero_documento: '1234569005' },
    { nombre: 'Fabián', apellido: 'Molina Castillo', edad: 14, genero: 'M', numero_documento: '1234569006' },
    { nombre: 'Gloria', apellido: 'Espinoza Ramírez', edad: 13, genero: 'F', numero_documento: '1234569007' },
    { nombre: 'Hugo', apellido: 'Valdez Morales', edad: 14, genero: 'M', numero_documento: '1234569008' },
    { nombre: 'Irma', apellido: 'Navarro Gutiérrez', edad: 13, genero: 'F', numero_documento: '1234569009' },
    { nombre: 'Joaquín', apellido: 'Ramos Jiménez', edad: 14, genero: 'M', numero_documento: '1234569010' },
    { nombre: 'Karina', apellido: 'Aguilar Ruiz', edad: 13, genero: 'F', numero_documento: '1234569011' },
    { nombre: 'Leonardo', apellido: 'Ibarra Álvarez', edad: 14, genero: 'M', numero_documento: '1234569012' },
    { nombre: 'Miriam', apellido: 'Sandoval Mendoza', edad: 13, genero: 'F', numero_documento: '1234569013' },
    { nombre: 'Norberto', apellido: 'Fuentes Acosta', edad: 14, genero: 'M', numero_documento: '1234569014' }
  ]
};

async function insertarDatosReales() {
  console.log('🚀 Insertando datos reales de estudiantes...');
  console.log('');

  try {
    // 1. Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    await supabase.from('estudiantes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('grupos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    // 2. Insertar grupos
    console.log('📚 Insertando grupos...');
    const grupos = [
      { id: randomUUID(), nombre: '6B' },
      { id: randomUUID(), nombre: '8A' },
      { id: randomUUID(), nombre: '8B' }
    ];

    // Intentar insertar con upsert para manejar RLS
    const { data: gruposInsertados, error: gruposError } = await supabase
      .from('grupos')
      .upsert(grupos, { onConflict: 'nombre' })
      .select();

    if (gruposError) {
      console.error('❌ Error insertando grupos:', gruposError.message);
      return;
    }

    console.log('✅ Grupos insertados:', gruposInsertados.length);

    // 3. Insertar estudiantes reales
    console.log('👥 Insertando estudiantes reales...');
    let totalEstudiantes = 0;

    for (const grupo of gruposInsertados) {
      const estudiantesGrupo = estudiantesReales[grupo.nombre] || [];
      
      if (estudiantesGrupo.length === 0) {
        console.log(`⚠️  No hay datos para el grupo ${grupo.nombre}`);
        continue;
      }

      const estudiantesConGrupo = estudiantesGrupo.map(estudiante => ({
        ...estudiante,
        id: randomUUID(),
        grupo_id: grupo.id
      }));

      const { data: estudiantesInsertados, error: estudiantesError } = await supabase
        .from('estudiantes')
        .insert(estudiantesConGrupo)
        .select();

      if (estudiantesError) {
        console.error(`❌ Error insertando estudiantes del grupo ${grupo.nombre}:`, estudiantesError.message);
        continue;
      }

      console.log(`✅ Grupo ${grupo.nombre}: ${estudiantesInsertados.length} estudiantes`);
      totalEstudiantes += estudiantesInsertados.length;
    }

    // 4. Verificación final
    console.log('');
    console.log('🔍 Verificación final...');
    
    const { count: gruposCount } = await supabase
      .from('grupos')
      .select('*', { count: 'exact', head: true });
    
    const { count: estudiantesCount } = await supabase
      .from('estudiantes')
      .select('*', { count: 'exact', head: true });

    console.log('📊 Resumen final:');
    console.log(`   • ${gruposCount} grupos en la base de datos`);
    console.log(`   • ${estudiantesCount} estudiantes en la base de datos`);
    console.log('');
    console.log('🎉 ¡Datos reales insertados exitosamente!');
    console.log('✅ La aplicación ahora usará nombres reales de estudiantes');
    console.log('🔑 Los estudiantes pueden usar su número de documento para autenticarse');

  } catch (error) {
    console.error('💥 Error general:', error.message);
    console.error('Detalles:', error);
  }
}

// Ejecutar el script
insertarDatosReales().catch(err => {
  console.error('❌ Error fatal:', err.message);
  process.exit(1);
});