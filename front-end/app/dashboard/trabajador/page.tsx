// [ESTETICO] Estilo refinado con paleta crema #f4f3ef, Serif y acentos en verde corporativo #264e43.
// [FUNCIONAL] Dashboard de Trabajador localizado en Valparaíso, Chile con sueldos en CLP, postulación a ofertas, calendario de disponibilidad, edición de perfil y módulo de reseñas.

'use client';

import { useState, useMemo } from 'react';
import { 
  Search, Star, User, Calendar as CalendarIcon, History, LogOut, 
  Clock, DollarSign, MapPin, Briefcase, CheckCircle2, ShieldAlert, X, Edit3, Send, AlertTriangle, FileText
} from 'lucide-react';

// [FUNCIONAL] Ofertas laborales iniciales ubicadas en Valparaíso, Chile y en Pesos Chilenos
const INITIAL_OFERTAS = [
  { 
    id: 101, 
    empresa: "Empresa Moresa", 
    titulo: "Garzón / Camarero de Fin de Semana", 
    horaEntrada: "12:00", 
    horaSalida: "20:00", 
    sueldoHora: 7500, 
    colacion: 1, 
    fechas: ["2026-11-14", "2026-11-15"], 
    descripcion: "Atención de mesas, toma de pedidos y apoyo general en salón de restaurante céntrico.", 
    ubicacionEmpresa: "Av. Errázuriz 1234, Valparaíso, Chile", 
    cupos: 3 
  },
  { 
    id: 102, 
    empresa: "Hostal Cerro Alegre", 
    titulo: "Ayudante de Cocina y Reepostería", 
    horaEntrada: "08:00", 
    horaSalida: "16:00", 
    sueldoHora: 6800, 
    colacion: 1, 
    fechas: ["2026-11-18", "2026-11-19"], 
    descripcion: "Preparación de desayunos y apoyo en área de producción fría.", 
    ubicacionEmpresa: "Paseo Dimalow 456, Cerro Alegre, Valparaíso, Chile", 
    cupos: 2 
  },
  { 
    id: 103, 
    empresa: "Eventos Puerto Muelle", 
    titulo: "Personal de Montaje y Eventos Nocturnos", 
    horaEntrada: "20:00", 
    horaSalida: "04:00", 
    sueldoHora: 9000, 
    colacion: 1, 
    fechas: ["2026-11-21"], 
    descripcion: "Montaje de estructuras ligeras, atención de barra y apoyo logístico.", 
    ubicacionEmpresa: "Muelle Prat s/n, Valparaíso, Chile", 
    cupos: 5 
  }
];

// [FUNCIONAL] Horarios Pactados (Turnos ya confirmación/contratados)
const INITIAL_HORARIOS_PACTADOS = [
  {
    id: 201,
    empresa: "Empresa Moresa",
    puesto: "Garzón de Refuerzo",
    fecha: "2026-11-10",
    horario: "13:00 a 21:00 hrs",
    sueldoTotal: 60000,
    ubicacionEmpresa: "Av. Errázuriz 1234, Valparaíso, Chile",
    contactoEmpresa: "+56 32 2123 4567"
  }
];

// [FUNCIONAL] Reseñas Recibidas y Realizadas
const MOCK_RESENAS_RECIBIDAS = [
  { id: 1, autor: "Empresa Moresa", estrellas: 5.0, fecha: "2026-10-25", comentario: "Excelente puntualidad y gran compromiso en la atención del salón." },
  { id: 2, autor: "Café Cerro Concepción", estrellas: 4.5, fecha: "2026-10-12", comentario: "Muy proactivo y con excelente disposición con los clientes." }
];

const MOCK_RESENAS_REALIZADAS = [
  { id: 3, destinatario: "Hostal Cerro Alegre", estrellas: 4.8, fecha: "2026-10-18", comentario: "Buen ambiente de trabajo, pagaron oportunamente en pesos chilenos y respetaron las horas de colación." }
];

export default function TrabajadorDashboardPage() {
  const [opcionMenu, setOpcionMenu] = useState<'ofertas' | 'postulaciones' | 'horarios' | 'disponibilidad' | 'resenas' | 'perfil'>('ofertas');
  const [filtro, setFiltro] = useState('');

  // [FUNCIONAL] Estados globales
  const [ofertas, setOfertas] = useState(INITIAL_OFERTAS);
  const [postulaciones, setPostulaciones] = useState<any[]>([]);
  const [horariosPactados, setHorariosPactados] = useState(INITIAL_HORARIOS_PACTADOS);
  const [resenasRecibidas, setResenasRecibidas] = useState(MOCK_RESENAS_RECIBIDAS);
  const [resenasRealizadas, setResenasRealizadas] = useState(MOCK_RESENAS_REALIZADAS);

  // [FUNCIONAL] Estado del Perfil del Trabajador (Editable)
  const [perfil, setPerfil] = useState({
    nombre: "Matías González",
    rut: "18.765.432-1",
    tituloProfesional: "Garzón Profesional & Ayudante Gastronómico",
    ubicacion: "Valparaíso, Chile",
    telefono: "+56 9 9876 5432",
    email: "matias.gonzalez@email.cl",
    biografia: "Trabajador dinámico con más de 4 años de experiencia en atención al cliente, eventos en la Quinta Región y servicio de salón.",
    habilidades: ["Atención al Cliente", "Manejo de POS", "Barman Básico", "Inglés Intermedio", "Trabajo en Equipo"]
  });

  const [nuevaHabilidad, setNuevaHabilidad] = useState('');

  // [FUNCIONAL] Calendario de Disponibilidad (Selección de Fechas en Grande)
  const [fechasDisponibles, setFechasDisponibles] = useState<string[]>([
    "2026-11-14", "2026-11-15", "2026-11-20", "2026-11-21"
  ]);

  // [FUNCIONAL] Modales
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState<any | null>(null);

  // [FUNCIONAL] Filtrado de ofertas laborales por buscador
  const ofertasFiltradas = useMemo(() => {
    return ofertas.filter(o => 
      o.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
      o.empresa.toLowerCase().includes(filtro.toLowerCase()) ||
      o.descripcion.toLowerCase().includes(filtro.toLowerCase())
    );
  }, [ofertas, filtro]);

  // [FUNCIONAL] Postular a una oferta laboral
  const handlePostular = (oferta: any) => {
    // Verificar si ya está postulando
    if (postulaciones.some(p => p.id === oferta.id)) {
      alert("Ya has postulado a esta oferta laboral.");
      return;
    }

    const nuevaPostulacion = {
      ...oferta,
      fechaPostulacion: new Date().toISOString().split('T')[0],
      estado: "Pendiente"
    };

    setPostulaciones([nuevaPostulacion, ...postulaciones]);
    alert(`¡Postulación enviada exitosamente a ${oferta.empresa}! Se ha agregado al apartado "Mis Postulaciones".`);
    setOfertaSeleccionada(null);
  };

  // [FUNCIONAL] Selección de fechas en el Calendario de Disponibilidad Grande
  const handleToggleFechaDisponibilidad = (fechaStr: string) => {
    if (fechasDisponibles.includes(fechaStr)) {
      setFechasDisponibles(fechasDisponibles.filter(f => f !== fechaStr));
    } else {
      setFechasDisponibles([...fechasDisponibles, fechaStr]);
    }
  };

  // [FUNCIONAL] Agregar Habilidad al Perfil
  const handleAgregarHabilidad = (e: React.FormEvent) => {
    e.preventDefault();
    if (nuevaHabilidad.trim() && !perfil.habilidades.includes(nuevaHabilidad.trim())) {
      setPerfil({
        ...perfil,
        habilidades: [...perfil.habilidades, nuevaHabilidad.trim()]
      });
      setNuevaHabilidad('');
    }
  };

  const handleEliminarHabilidad = (hab: string) => {
    setPerfil({
      ...perfil,
      habilidades: perfil.habilidades.filter(h => h !== hab)
    });
  };

  // [FUNCIONAL] Días generados para el Calendario Grande de Disponibilidad (Noviembre 2026)
  const DIAS_NOVIEMBRE_2026 = Array.from({ length: 30 }, (_, i) => {
    const diaNum = i + 1;
    const diaStr = diaNum < 10 ? `0${diaNum}` : `${diaNum}`;
    return `2026-11-${diaStr}`;
  });

  return (
    <div className="min-h-screen bg-[#f4f3ef] text-stone-800 font-sans flex flex-col">
      
      {/* ========================================================= */}
      {/* BARRA SUPERIOR (HEADER MATILOGO)                          */}
      {/* ========================================================= */}
      <header className="bg-[#f4f3ef]/80 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-serif font-bold text-stone-900 tracking-tight">Matilogo</span>
          <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase border-l border-stone-300 pl-4 py-1">
            Valparaíso, Chile • Tu próximo paso
          </span>
        </div>

        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar ofertas laborales o empresas en Valparaíso..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/80 border border-stone-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-[#264e43]/20 focus:border-[#264e43]"
          />
        </div>
      </header>

      {/* ========================================================= */}
      {/* CUERPO PRINCIPAL (CONTENIDO + MENÚ LATERAL DERECHO)        */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto">
        
        <main className="flex-1 p-6 sm:p-10">
          
          {/* OPCIÓN 1: OFERTAS LABORALES */}
          {opcionMenu === 'ofertas' && (
            <div>
              <div className="mb-6">
                <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">Oportunidades de Empleo</span>
                <h1 className="text-3xl font-serif text-stone-900 mt-1">Ofertas Laborales Disponibles</h1>
                <p className="text-xs text-stone-500 mt-1">Explora los turnos y trabajos publicados en Valparaíso, Chile.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ofertasFiltradas.map((oferta) => {
                  const yaPostulado = postulaciones.some(p => p.id === oferta.id);
                  return (
                    <div key={oferta.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-[#264e43] uppercase tracking-wider">{oferta.empresa}</span>
                          <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                            {oferta.cupos} Vacantes
                          </span>
                        </div>

                        <h3 className="font-bold text-stone-900 text-base mb-2">{oferta.titulo}</h3>
                        <p className="text-xs text-stone-600 mb-4 font-light">{oferta.descripcion}</p>

                        <div className="space-y-1.5 text-xs text-stone-500 mb-4 bg-stone-50 p-3 rounded-xl border border-stone-100">
                          <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                            <MapPin className="w-3.5 h-3.5 text-[#264e43]" /> Ubicación: {oferta.ubicacionEmpresa}
                          </div>
                          <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> Horario: De {oferta.horaEntrada} a {oferta.horaSalida} hrs</div>
                          <div className="flex items-center gap-2 font-bold text-stone-800">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-700" /> 
                            Sueldo: ${oferta.sueldoHora.toLocaleString('es-CL')} CLP / hora
                          </div>
                          <div className="flex items-center gap-2"><CalendarIcon className="w-3.5 h-3.5" /> Días: {oferta.fechas.join(', ')}</div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex gap-2">
                        {yaPostulado ? (
                          <div className="w-full bg-emerald-50 text-emerald-800 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4" />
                            Postulación Enviada
                          </div>
                        ) : (
                          <button
                            onClick={() => setOfertaSeleccionada(oferta)}
                            className="w-full bg-[#264e43] hover:bg-[#1e3e35] text-white text-xs font-medium py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Postular a la Oferta
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* OPCIÓN 2: MIS POSTULACIONES */}
          {opcionMenu === 'postulaciones' && (
            <div>
              <div className="mb-6">
                <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">Seguimiento</span>
                <h1 className="text-3xl font-serif text-stone-900 mt-1">Mis Postulaciones Pendientes</h1>
                <p className="text-xs text-stone-500 mt-1">Listado de las vacantes a las que has postulado y su estado actual.</p>
              </div>

              {postulaciones.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center text-xs text-stone-500">
                  <FileText className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p>Aún no tienes postulaciones activas. Revisa las ofertas laborales y postula para comenzar.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {postulaciones.map((postulacion) => (
                    <div key={postulacion.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-stone-500 uppercase">{postulacion.empresa}</span>
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                            {postulacion.estado}
                          </span>
                        </div>
                        <h3 className="font-bold text-stone-900 text-base">{postulacion.titulo}</h3>
                        <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#264e43]" /> {postulacion.ubicacionEmpresa}
                        </p>
                        <p className="text-[11px] text-stone-400 mt-1">
                          Postulado el: {postulacion.fechaPostulacion} • Pago: ${postulacion.sueldoHora.toLocaleString('es-CL')} CLP / hr
                        </p>
                      </div>

                      <div className="text-right border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto flex justify-between md:flex-col items-center md:items-end">
                        <span className="text-xs text-stone-400">En revisión por reclutador</span>
                        <button 
                          onClick={() => {
                            setPostulaciones(postulaciones.filter(p => p.id !== postulacion.id));
                            alert("Postulación retirada.");
                          }}
                          className="text-xs text-red-600 hover:underline font-medium mt-1"
                        >
                          Cancelar Postulación
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* OPCIÓN 3: HORARIOS PACTADOS */}
          {opcionMenu === 'horarios' && (
            <div>
              <div className="mb-6">
                <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">Compromisos Confirmados</span>
                <h1 className="text-3xl font-serif text-stone-900 mt-1">Horarios Pactados</h1>
                <p className="text-xs text-stone-500 mt-1">Turnos contratados con ubicación de la empresa e instrucciones de asistencia.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {horariosPactados.map((horario) => (
                  <div key={horario.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                    <div className="flex justify-between items-start border-b pb-3 border-stone-100">
                      <div>
                        <span className="text-xs font-bold text-[#264e43] uppercase">{horario.empresa}</span>
                        <h3 className="font-bold text-stone-900 text-base">{horario.puesto}</h3>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        Confirmado
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-stone-700">
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                        <span className="text-[10px] font-bold text-emerald-900 uppercase">Ubicación de Asistencia</span>
                        <p className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#264e43]" /> {horario.ubicacionEmpresa}
                        </p>
                      </div>

                      <p><strong>Fecha Asignada:</strong> {horario.fecha}</p>
                      <p><strong>Horario de Entrada y Salida:</strong> {horario.horario}</p>
                      <p><strong>Contacto Empresa:</strong> {horario.contactoEmpresa}</p>
                      <p className="text-[#264e43] font-bold pt-1">Sueldo Pactado: ${horario.sueldoTotal.toLocaleString('es-CL')} CLP</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OPCIÓN 4: DISPONIBILIDAD (CALENDARIO EN GRANDE) */}
          {opcionMenu === 'disponibilidad' && (
            <div>
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">Agenda de Trabajo</span>
                  <h1 className="text-3xl font-serif text-stone-900 mt-1">Gestión de Disponibilidad</h1>
                  <p className="text-xs text-stone-500 mt-1">Haz clic en los días del calendario en los que estarás disponible para recibir ofertas laborales.</p>
                </div>
                <span className="bg-[#264e43] text-white text-xs font-bold px-4 py-2 rounded-xl text-center">
                  {fechasDisponibles.length} Días Marcados Disponibles
                </span>
              </div>

              {/* CALENDARIO EN GRANDE */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <h3 className="font-serif font-bold text-lg text-stone-900">Noviembre 2026</h3>
                  <div className="flex items-center gap-4 text-xs font-medium text-stone-500">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#264e43]"></span> Disponible</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-stone-200"></span> No disponible</span>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-stone-400 uppercase mb-3">
                  <div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div><div>Dom</div>
                </div>

                <div className="grid grid-cols-7 gap-2.5">
                  {DIAS_NOVIEMBRE_2026.map((fecha) => {
                    const sel = fechasDisponibles.includes(fecha);
                    const numeroDia = parseInt(fecha.split('-')[2]);
                    return (
                      <button
                        key={fecha}
                        type="button"
                        onClick={() => handleToggleFechaDisponibilidad(fecha)}
                        className={`h-24 sm:h-28 p-2 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                          sel
                            ? 'bg-[#264e43] text-white border-[#264e43] shadow-md scale-[1.02]'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <span className="font-serif font-bold text-sm sm:text-base">{numeroDia}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          sel ? 'bg-emerald-800 text-emerald-100' : 'text-stone-400'
                        }`}>
                          {sel ? 'Disponible' : 'Sin libre'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* OPCIÓN 5: PERFIL DE TRABAJADOR EDITABLE */}
          {opcionMenu === 'perfil' && (
            <div>
              <div className="mb-6">
                <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">Configuración de Cuenta</span>
                <h1 className="text-3xl font-serif text-stone-900 mt-1">Perfil del Trabajador</h1>
                <p className="text-xs text-stone-500 mt-1">Edita tus datos personales, habilidades y datos de contacto.</p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm max-w-3xl space-y-6">
                <form onSubmit={(e) => { e.preventDefault(); alert("¡Perfil actualizado con éxito!"); }} className="space-y-4 text-xs">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Nombre Completo</label>
                      <input
                        type="text"
                        required
                        value={perfil.nombre}
                        onChange={(e) => setPerfil({...perfil, nombre: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-xl bg-stone-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">RUT</label>
                      <input
                        type="text"
                        required
                        value={perfil.rut}
                        onChange={(e) => setPerfil({...perfil, rut: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-xl bg-stone-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Título / Ocupación Principal</label>
                    <input
                      type="text"
                      required
                      value={perfil.tituloProfesional}
                      onChange={(e) => setPerfil({...perfil, tituloProfesional: e.target.value})}
                      className="w-full px-4 py-2.5 border rounded-xl bg-stone-50 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Ubicación</label>
                      <input
                        type="text"
                        required
                        value={perfil.ubicacion}
                        onChange={(e) => setPerfil({...perfil, ubicacion: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-xl bg-stone-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Teléfono Móvil</label>
                      <input
                        type="text"
                        required
                        value={perfil.telefono}
                        onChange={(e) => setPerfil({...perfil, telefono: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-xl bg-stone-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Correo Electrónico</label>
                      <input
                        type="email"
                        required
                        value={perfil.email}
                        onChange={(e) => setPerfil({...perfil, email: e.target.value})}
                        className="w-full px-4 py-2.5 border rounded-xl bg-stone-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Resumen / Experiencia Breve</label>
                    <textarea
                      rows={3}
                      value={perfil.biografia}
                      onChange={(e) => setPerfil({...perfil, biografia: e.target.value})}
                      className="w-full px-4 py-2.5 border rounded-xl bg-stone-50 focus:bg-white"
                    ></textarea>
                  </div>

                  {/* SECCIÓN HABILIDADES */}
                  <div className="pt-2 border-t pt-4">
                    <label className="block font-bold text-stone-700 mb-2">Habilidades y Competencias</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {perfil.habilidades.map((hab, idx) => (
                        <span key={idx} className="bg-stone-100 border border-stone-200 text-stone-700 px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 font-medium">
                          {hab}
                          <button type="button" onClick={() => handleEliminarHabilidad(hab)} className="text-stone-400 hover:text-red-600">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Añadir nueva habilidad (Ej: Manejo de bandeja, Cocina fría)..."
                        value={nuevaHabilidad}
                        onChange={(e) => setNuevaHabilidad(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-xl bg-stone-50"
                      />
                      <button
                        type="button"
                        onClick={handleAgregarHabilidad}
                        className="bg-[#264e43] text-white px-4 py-2 rounded-xl text-xs font-bold"
                      >
                        Añadir
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button type="submit" className="bg-[#264e43] hover:bg-[#1e3e35] text-white font-medium py-3 px-8 rounded-xl shadow-sm text-xs">
                      Guardar Cambios de Perfil
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* OPCIÓN 6: RESEÑAS Y REPUTACIÓN */}
          {opcionMenu === 'resenas' && (
            <div>
              <div className="mb-6">
                <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">Reputación Laboral</span>
                <h1 className="text-3xl font-serif text-stone-900 mt-1">Reseñas y Calificaciones</h1>
                <p className="text-xs text-stone-500 mt-1">Retroalimentación recibida por empresas de Valparaíso y evaluaciones realizadas.</p>
              </div>

              {/* MÉTRICA SUPERIOR */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between mb-8 max-w-md">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Promedio de Calificación</span>
                  <div className="text-3xl font-serif font-bold text-amber-500 mt-1 flex items-center gap-2">
                    ★ 4.9 <span className="text-xs text-stone-400 font-sans font-normal">(18 reseñas totales)</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-200">
                  <Star className="w-6 h-6 fill-amber-400" />
                </div>
              </div>

              {/* LISTADO DIVIDIDO DE RESEÑAS */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-900 mb-4 pb-2 border-b border-stone-300">
                    Reseñas Recibidas por la Empresa
                  </h3>
                  <div className="space-y-4">
                    {resenasRecibidas.map((r) => (
                      <div key={r.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-2xl font-bold text-amber-500">★ {r.estrellas.toFixed(1)}</span>
                            <button className="text-[11px] text-stone-400 hover:text-red-600 flex items-center gap-1">
                              <ShieldAlert className="w-3.5 h-3.5" /> Reportar / Solicitar revisión
                            </button>
                          </div>
                          <p className="text-xs text-stone-700 font-light my-2">"{r.comentario}"</p>
                        </div>
                        <div className="pt-3 border-t border-stone-100 flex justify-between text-[11px] text-stone-400">
                          <span>Empresa: <strong className="text-stone-700">{r.autor}</strong></span>
                          <span>{r.fecha}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-900 mb-4 pb-2 border-b border-stone-300">
                    Reseñas Realizadas a Empresas
                  </h3>
                  <div className="space-y-4">
                    {resenasRealizadas.map((r) => (
                      <div key={r.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-2xl font-bold text-amber-500">★ {r.estrellas.toFixed(1)}</span>
                          <span className="text-[11px] text-stone-400">{r.fecha}</span>
                        </div>
                        <p className="text-xs text-stone-700 font-light my-2">"{r.comentario}"</p>
                        <span className="text-[11px] text-stone-400">Evaluación emitida a: <strong className="text-stone-700">{r.destinatario}</strong></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* ========================================================= */}
        {/* MENÚ LATERAL DERECHO DE NAVEGACIÓN                         */}
        {/* ========================================================= */}
        <aside className="w-full lg:w-80 bg-white border-l border-stone-200 p-6 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center gap-3 pb-6 border-b border-stone-100 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#264e43] text-white flex items-center justify-center font-serif font-bold text-sm">
                {perfil.nombre.split(' ').map(n=>n[0]).join('')}
              </div>
              <div>
                <h3 className="text-xs font-bold text-stone-900">{perfil.nombre}</h3>
                <span className="text-[10px] font-semibold text-stone-400 uppercase">Trabajador • Valparaíso</span>
              </div>
            </div>

            <div className="space-y-6">
              <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">Menú Principal</span>
              <nav className="space-y-1.5">
                <button
                  onClick={() => setOpcionMenu('ofertas')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-3 transition-all ${
                    opcionMenu === 'ofertas' ? 'bg-[#264e43] text-white shadow-sm font-semibold' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  Ofertas Laborales
                </button>

                <button
                  onClick={() => setOpcionMenu('postulaciones')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-3 transition-all ${
                    opcionMenu === 'postulaciones' ? 'bg-[#264e43] text-white shadow-sm font-semibold' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  Mis Postulaciones ({postulaciones.length})
                </button>

                <button
                  onClick={() => setOpcionMenu('horarios')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-3 transition-all ${
                    opcionMenu === 'horarios' ? 'bg-[#264e43] text-white shadow-sm font-semibold' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Horarios Pactados
                </button>

                <button
                  onClick={() => setOpcionMenu('disponibilidad')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-3 transition-all ${
                    opcionMenu === 'disponibilidad' ? 'bg-[#264e43] text-white shadow-sm font-semibold' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <CalendarIcon className="w-4 h-4" />
                  Disponibilidad
                </button>

                <button
                  onClick={() => setOpcionMenu('resenas')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-3 transition-all ${
                    opcionMenu === 'resenas' ? 'bg-[#264e43] text-white shadow-sm font-semibold' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <History className="w-4 h-4" />
                  Reseñas
                </button>

                <button
                  onClick={() => setOpcionMenu('perfil')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-3 transition-all ${
                    opcionMenu === 'perfil' ? 'bg-[#264e43] text-white shadow-sm font-semibold' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Perfil de Trabajador
                </button>
              </nav>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100 mt-8">
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full flex items-center gap-2 text-xs text-stone-500 hover:text-red-600 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              Cerrar sesión
            </button>
          </div>
        </aside>

      </div>

      {/* MODAL DETALLE Y CONFIRMACIÓN DE POSTULACIÓN */}
      {ofertaSeleccionada && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-start mb-4 pb-2 border-b">
              <div>
                <span className="text-xs font-bold text-[#264e43] uppercase">{ofertaSeleccionada.empresa}</span>
                <h3 className="font-serif font-bold text-lg text-stone-900">{ofertaSeleccionada.titulo}</h3>
              </div>
              <button onClick={() => setOfertaSeleccionada(null)} className="text-stone-400 hover:text-stone-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 text-xs text-stone-600 mb-6">
              <p><strong>Descripción:</strong> {ofertaSeleccionada.descripcion}</p>
              <div className="p-3 bg-stone-50 rounded-xl border space-y-1">
                <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#264e43]" /> {ofertaSeleccionada.ubicacionEmpresa}
                </p>
                <p><strong>Horario:</strong> {ofertaSeleccionada.horaEntrada} a {ofertaSeleccionada.horaSalida} hrs</p>
                <p><strong>Pago:</strong> ${ofertaSeleccionada.sueldoHora.toLocaleString('es-CL')} CLP / hr</p>
                <p><strong>Días:</strong> {ofertaSeleccionada.fechas.join(', ')}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handlePostular(ofertaSeleccionada)}
                className="flex-1 bg-[#264e43] hover:bg-[#1e3e35] text-white py-2.5 rounded-xl text-xs font-bold shadow-sm"
              >
                Confirmar y Postular
              </button>
              <button
                onClick={() => setOfertaSeleccionada(null)}
                className="px-4 border border-stone-300 text-stone-600 rounded-xl text-xs"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER MATILOGO */}
      <footer className="border-t border-stone-200 px-8 py-4 flex justify-between items-center text-[11px] text-stone-400">
        <span>© 2026 Matilogo. El trabajo empieza con una conexión.</span>
        <span>Español (Chile)</span>
      </footer>
    </div>
  );
}