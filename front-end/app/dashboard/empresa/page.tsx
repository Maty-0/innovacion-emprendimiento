// [ESTETICO] Estilo refinado con paleta crema #f4f3ef, Serif y acentos en verde corporativo #264e43.
// [FUNCIONAL] Panel de Empresa Moresa en Matilogo con gestión de contrataciones (ojo para ver perfil + botón Contratar para postulantes).

'use client';

import { useState, useMemo } from 'react';
import { 
  Search, Star, Building2, User, Calendar as CalendarIcon, History, LogOut, 
  Plus, Clock, DollarSign, Users, AlertTriangle, ShieldAlert, X, Eye, Check, Edit2, Trash2, MapPin, Phone, Mail, Send, CheckCircle2, UserCheck
} from 'lucide-react';

// [FUNCIONAL] Datos simulados de postulantes con postulación a turno específico
const MOCK_POSTULANTES = [
  { id: 1, nombre: "Ana García", puesto: "Camarera de sala", edad: 28, rating: 4.9, resenas: 32, ubicacion: "Santiago", disponible: true, tipos: ["Atención al cliente", "Inglés B2"], experiencia: "4 años en restaurante gourmet", telefono: "+56 9 1234 5678", email: "ana.garcia@email.com", turnoPostuladoId: 101, estado: "postulando" },
  { id: 2, nombre: "Carlos Mendoza", puesto: "Cocinero", edad: 34, rating: 4.8, resenas: 26, ubicacion: "Santiago", disponible: true, tipos: ["Cocina internacional", "Manejo de alimentos"], experiencia: "6 años en cocina caliente", telefono: "+56 9 8765 4321", email: "carlos.mendoza@email.com", turnoPostuladoId: 102, estado: "postulando" },
  { id: 3, nombre: "Lucía Fernández", puesto: "Recepcionista", edad: 26, rating: 4.8, resenas: 21, ubicacion: "Santiago", disponible: true, tipos: ["Gestión de reservas", "Inglés C1"], experiencia: "2 años en hotel céntrico", telefono: "+56 9 5555 4444", email: "lucia.f@email.com", turnoPostuladoId: 101, estado: "contratado" },
  { id: 4, nombre: "Diego Rojas", puesto: "Garzón", edad: 25, rating: 4.5, resenas: 10, ubicacion: "Santiago", disponible: true, tipos: ["Servicio de banquetes"], experiencia: "1 año en eventos", telefono: "+56 9 3333 2222", email: "diego.rojas@email.com", turnoPostuladoId: 102, estado: "contratado" }
];

// [FUNCIONAL] Estado inicial de turnos con ubicación física
const INITIAL_TURNOS = [
  { 
    id: 101, 
    titulo: "Apoyo Fin de Semana", 
    horaEntrada: "09:00", 
    horaSalida: "18:00", 
    sueldoHora: 6500, 
    colacion: 1, 
    fechas: ["2026-11-14", "2026-11-15"], 
    descripcion: "Atención de mesas y apoyo general en salón.", 
    tipoTrabajador: "Garzón / Camarero", 
    cupos: 4, 
    postulantesCount: 8,
    ubicacion: "Av. Providencia 1234, Santiago"
  },
  { 
    id: 102, 
    titulo: "Turno Noche Evento", 
    horaEntrada: "20:00", 
    horaSalida: "04:00", 
    sueldoHora: 8000, 
    colacion: 1, 
    fechas: ["2026-11-20"], 
    descripcion: "Montaje de salón y cocina rápida.", 
    tipoTrabajador: "Ayudante Cocina", 
    cupos: 2, 
    postulantesCount: 5,
    ubicacion: "Av. Providencia 1234, Santiago"
  }
];

const OPCIONES_HORAS = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00", "01:00", "02:00", "03:00", "04:00", "05:00"
];

const MOCK_RESENAS_RECIBIDAS = [
  { id: 1, autor: "Carlos Mendoza", estrellas: 5.0, fecha: "2026-10-28", comentario: "Excelente ambiente laboral y pagos a tiempo por parte de Moresa." },
  { id: 2, autor: "mapache anonimo", estrellas: 4.0, fecha: "2026-10-15", comentario: "Buen trato con el personal, las horas de colación se respetan bien." }
];

const MOCK_RESENAS_REALIZADAS = [
  { id: 3, destinatario: "Ana García", estrellas: 5.0, fecha: "2026-10-20", comentario: "Muy puntual y proactiva durante todo el turno asignado." }
];

const INITIAL_RESENAS_PENDIENTES = [
  { id: 201, trabajador: "Pedro Morales", turno: "Turno Noche Evento", fechaFin: "2026-11-01" },
  { id: 202, trabajador: "Marta López", turno: "Apoyo Fin de Semana", fechaFin: "2026-11-02" }
];

export default function EmpresaDashboardPage() {
  const [opcionMenu, setOpcionMenu] = useState<'busqueda' | 'turnos' | 'contrataciones' | 'resenas' | 'perfil'>('busqueda');
  const [filtro, setFiltro] = useState('');

  // [FUNCIONAL] Estados globales
  const [turnos, setTurnos] = useState(INITIAL_TURNOS);
  const [postulantes, setPostulantes] = useState(MOCK_POSTULANTES);
  const [resenasPendientes, setResenasPendientes] = useState(INITIAL_RESENAS_PENDIENTES);
  const [resenasRealizadas, setResenasRealizadas] = useState(MOCK_RESENAS_REALIZADAS);

  // [FUNCIONAL] Ubicación editable de Moresa
  const [datosEmpresa, setDatosEmpresa] = useState({
    nombre: "Empresa Moresa",
    rut: "76.543.210-K",
    rubro: "Gastronomía y Eventos",
    contacto: "contacto@moresa.cl",
    direccion: "Av. Providencia 1234, Santiago"
  });

  // [FUNCIONAL] Modales
  const [modalFormularioTurno, setModalFormularioTurno] = useState(false);
  const [modalResumenTurno, setModalResumenTurno] = useState(false);
  const [modalResenasPendientes, setModalResenasPendientes] = useState(false);
  const [modalEvaluarTrabajador, setModalEvaluarTrabajador] = useState<any | null>(null);
  const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState<any | null>(null);

  // [FUNCIONAL] Modal para contratar postulante
  const [postulanteAContratar, setPostulanteAContratar] = useState<any | null>(null);

  // [FUNCIONAL] Modal para eliminar turno
  const [turnoAEliminar, setTurnoAEliminar] = useState<any | null>(null);
  const [checkConfirmacionEliminar, setCheckConfirmacionEliminar] = useState(false);

  // [FUNCIONAL] Modal para ponerse en contacto
  const [modalContacto, setModalContacto] = useState<any | null>(null);
  const [viaContacto, setViaContacto] = useState<'telefono' | 'email'>('email');

  // [FUNCIONAL] Estado del Formulario de Turno (Creación/Edición)
  const [idTurnoEditar, setIdTurnoEditar] = useState<number | null>(null);
  const [formDataTurno, setFormDataTurno] = useState({
    titulo: '',
    horaEntrada: '09:00',
    horaSalida: '18:00',
    sueldoHora: '',
    colacion: '1',
    fechas: [] as string[],
    descripcion: '',
    tipoTrabajador: '',
    cupos: '1',
    fechaInputManual: '',
    disponibleCalendario: true
  });

  // [FUNCIONAL] Evaluaciones con estrellas
  const [puntuacionEstrellas, setPuntuacionEstrellas] = useState<number>(5.0);
  const [comentarioResena, setComentarioResena] = useState<string>('');

  const postulantesFiltrados = useMemo(() => {
    return postulantes
      .filter((t) => 
        t.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        t.puesto.toLowerCase().includes(filtro.toLowerCase())
      )
      .sort((a, b) => b.rating - a.rating || a.nombre.localeCompare(b.nombre));
  }, [filtro, postulantes]);

  // [FUNCIONAL] Abrir Formulario en Modo Creación
  const handleAbrirCrear = () => {
    setIdTurnoEditar(null);
    setFormDataTurno({
      titulo: '',
      horaEntrada: '09:00',
      horaSalida: '18:00',
      sueldoHora: '6000',
      colacion: '1',
      fechas: ["2026-11-15"],
      descripcion: '',
      tipoTrabajador: '',
      cupos: '1',
      fechaInputManual: '',
      disponibleCalendario: true
    });
    setModalFormularioTurno(true);
  };

  // [FUNCIONAL] Abrir Formulario en Modo Edición
  const handleAbrirEditar = (turno: any) => {
    setIdTurnoEditar(turno.id);
    setFormDataTurno({
      titulo: turno.titulo,
      horaEntrada: turno.horaEntrada,
      horaSalida: turno.horaSalida,
      sueldoHora: turno.sueldoHora.toString(),
      colacion: turno.colacion.toString(),
      fechas: turno.fechas,
      descripcion: turno.descripcion,
      tipoTrabajador: turno.tipoTrabajador,
      cupos: turno.cupos.toString(),
      fechaInputManual: '',
      disponibleCalendario: true
    });
    setModalFormularioTurno(true);
  };

  // [FUNCIONAL] Alternar fecha en calendario interactivo
  const handleToggleFecha = (fechaStr: string) => {
    if (formDataTurno.fechas.includes(fechaStr)) {
      setFormDataTurno({
        ...formDataTurno,
        fechas: formDataTurno.fechas.filter(f => f !== fechaStr)
      });
    } else {
      setFormDataTurno({
        ...formDataTurno,
        fechas: [...formDataTurno.fechas, fechaStr]
      });
    }
  };

  // [FUNCIONAL] Agregar fecha por input tipo disponibilidad
  const handleAgregarFechaManual = () => {
    if (formDataTurno.fechaInputManual && !formDataTurno.fechas.includes(formDataTurno.fechaInputManual)) {
      setFormDataTurno({
        ...formDataTurno,
        fechas: [...formDataTurno.fechas, formDataTurno.fechaInputManual],
        fechaInputManual: ''
      });
    }
  };

  // [FUNCIONAL] Eliminar publicación de turno
  const handleConfirmarEliminarTurno = () => {
    if (turnoAEliminar && checkConfirmacionEliminar) {
      setTurnos(turnos.filter(t => t.id !== turnoAEliminar.id));
      setTurnoAEliminar(null);
      setCheckConfirmacionEliminar(false);
      alert("Turno eliminado exitosamente.");
    }
  };

  // [FUNCIONAL] Contratar postulante de un turno
  const handleConfirmarContratacion = () => {
    if (postulanteAContratar) {
      setPostulantes(postulantes.map(p => 
        p.id === postulanteAContratar.id ? { ...p, estado: 'contratado' } : p
      ));
      alert(`¡Has contratado a ${postulanteAContratar.nombre} exitosamente!`);
      setPostulanteAContratar(null);
    }
  };

  // [FUNCIONAL] Cálculo de resumen previo
  const handlePrepararResumen = (e: React.FormEvent) => {
    e.preventDefault();
    if (formDataTurno.fechas.length === 0) {
      alert("Debes seleccionar al menos una fecha.");
      return;
    }
    setModalFormularioTurno(false);
    setModalResumenTurno(true);
  };

  const calcularResumenFinanciero = () => {
    const hEntrada = parseInt(formDataTurno.horaEntrada.split(':')[0]);
    let hSalida = parseInt(formDataTurno.horaSalida.split(':')[0]);
    if (hSalida <= hEntrada) hSalida += 24;
    
    const horasTotalesBrutas = hSalida - hEntrada;
    const colacion = parseFloat(formDataTurno.colacion) || 0;
    const horasEfectivasTurno = Math.max(0, horasTotalesBrutas - colacion);
    const sueldoHora = parseFloat(formDataTurno.sueldoHora) || 0;
    const pagoPorDia = horasEfectivasTurno * sueldoHora;
    const totalPorTrabajador = pagoPorDia * formDataTurno.fechas.length;
    const totalGeneralTurno = totalPorTrabajador * (parseInt(formDataTurno.cupos) || 1);

    return {
      horasEfectivasTurno,
      pagoPorDia,
      totalPorTrabajador,
      totalGeneralTurno
    };
  };

  // [FUNCIONAL] Confirmar y guardar turno
  const handleConfirmarPublicacion = () => {
    if (idTurnoEditar !== null) {
      setTurnos(turnos.map(t => t.id === idTurnoEditar ? {
        ...t,
        titulo: formDataTurno.titulo || "Turno sin título",
        horaEntrada: formDataTurno.horaEntrada,
        horaSalida: formDataTurno.horaSalida,
        sueldoHora: parseFloat(formDataTurno.sueldoHora),
        colacion: parseFloat(formDataTurno.colacion),
        fechas: formDataTurno.fechas,
        descripcion: formDataTurno.descripcion,
        tipoTrabajador: formDataTurno.tipoTrabajador,
        cupos: parseInt(formDataTurno.cupos),
        ubicacion: datosEmpresa.direccion
      } : t));
      alert("¡Turno actualizado exitosamente!");
    } else {
      const nuevo = {
        id: Date.now(),
        titulo: formDataTurno.titulo || "Nuevo Turno",
        horaEntrada: formDataTurno.horaEntrada,
        horaSalida: formDataTurno.horaSalida,
        sueldoHora: parseFloat(formDataTurno.sueldoHora),
        colacion: parseFloat(formDataTurno.colacion),
        fechas: formDataTurno.fechas,
        descripcion: formDataTurno.descripcion,
        tipoTrabajador: formDataTurno.tipoTrabajador,
        cupos: parseInt(formDataTurno.cupos),
        postulantesCount: 0,
        ubicacion: datosEmpresa.direccion
      };
      setTurnos([nuevo, ...turnos]);
      alert("¡Turno publicado exitosamente!");
    }
    setModalResumenTurno(false);
  };

  // [FUNCIONAL] Notificar contacto a trabajador
  const handleEnviarNotificacionContacto = () => {
    if (modalContacto) {
      alert(`Se ha enviado una notificación a ${modalContacto.nombre} vía ${viaContacto === 'telefono' ? 'Llamada / SMS Telefónico' : 'Correo Electrónico'}.`);
      setModalContacto(null);
    }
  };

  const resumenCalculado = modalResumenTurno ? calcularResumenFinanciero() : null;

  return (
    <div className="min-h-screen bg-[#f4f3ef] text-stone-800 font-sans flex flex-col">
      
      {/* BARRA SUPERIOR (HEADER MATILOGO) */}
      <header className="bg-[#f4f3ef]/80 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-serif font-bold text-stone-900 tracking-tight">Matylogo</span>
          <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase border-l border-stone-300 pl-4 py-1">
            Moresa • Panel de Control
          </span>
        </div>

        <div className="relative w-full max-w-md hidden sm:block">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar postulante por nombre o cargo..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/80 border border-stone-200 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-[#264e43]/20 focus:border-[#264e43]"
          />
        </div>
      </header>

      {/* CUERPO PRINCIPAL */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto">
        
        <main className="flex-1 p-6 sm:p-10">
          
          {/* OPCIÓN 1: BÚSQUEDA DE POSTULANTES */}
          {opcionMenu === 'busqueda' && (
            <div>
              <div className="mb-6">
                <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">Personal Disponible</span>
                <h1 className="text-3xl font-serif text-stone-900 mt-1">Postulantes para Moresa</h1>
                <p className="text-xs text-stone-500 mt-1">Trabajadores ordenados por mejor valoración de reseñas.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {postulantesFiltrados.map((worker) => (
                  <div key={worker.id} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-full h-32 bg-stone-100 rounded-xl mb-4 flex items-center justify-center border border-stone-200">
                        <span className="text-xl font-serif text-stone-400 font-bold">{worker.nombre.split(' ').map(n=>n[0]).join('')}</span>
                      </div>

                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-stone-900 text-sm">{worker.nombre}</h3>
                          <p className="text-xs text-stone-500">{worker.puesto}</p>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {worker.rating}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 my-3">
                        {worker.tipos.map((tipo, idx) => (
                          <span key={idx} className="bg-stone-100 text-stone-600 text-[10px] px-2 py-0.5 rounded font-medium">
                            {tipo}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setTrabajadorSeleccionado(worker)}
                        className="flex-1 bg-[#264e43] hover:bg-[#1e3e35] text-white text-xs font-medium py-2 rounded-xl transition-all flex items-center justify-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Ver Perfil
                      </button>
                      <button
                        onClick={() => setModalContacto(worker)}
                        className="border border-[#264e43] text-[#264e43] hover:bg-[#264e43]/10 text-xs font-medium px-3 py-2 rounded-xl transition-all flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Contactar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OPCIÓN 2: TURNOS PUBLICADOS Y ELIMINACIÓN/EDICIÓN */}
          {opcionMenu === 'turnos' && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">Gestión de Ofertas</span>
                  <h1 className="text-3xl font-serif text-stone-900 mt-1">Turnos de Moresa</h1>
                </div>
                <button
                  onClick={handleAbrirCrear}
                  className="bg-[#264e43] hover:bg-[#1e3e35] text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Crear Nuevo Turno
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {turnos.map((turno) => (
                  <div key={turno.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between relative group">
                    
                    <button
                      onClick={() => {
                        setTurnoAEliminar(turno);
                        setCheckConfirmacionEliminar(false);
                      }}
                      className="absolute top-4 right-4 text-stone-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Eliminar turno"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div>
                      <div className="flex justify-between items-start mb-3 pr-8">
                        <h3 className="font-bold text-stone-900 text-base">{turno.titulo}</h3>
                        <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                          {turno.cupos} Cupos
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mb-4">{turno.descripcion}</p>
                      
                      <div className="space-y-1.5 text-xs text-stone-500 mb-4">
                        <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-stone-400" /> De {turno.horaEntrada} a {turno.horaSalida} ({turno.colacion}h colación)</div>
                        <div className="flex items-center gap-2"><DollarSign className="w-3.5 h-3.5 text-stone-400" /> ${turno.sueldoHora.toLocaleString()} / hora</div>
                        <div className="flex items-center gap-2"><CalendarIcon className="w-3.5 h-3.5 text-stone-400" /> Fechas ({turno.fechas.length}): {turno.fechas.join(', ')}</div>
                        <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-stone-400" /> Busca: {turno.tipoTrabajador}</div>
                        
                        <div className="flex items-center gap-2 text-emerald-900 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#264e43]" /> Ubicación: {turno.ubicacion}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-xs text-stone-400">
                      <span>{turno.postulantesCount} postulantes inscritos</span>
                      <button 
                        onClick={() => handleAbrirEditar(turno)}
                        className="text-[#264e43] font-bold hover:underline flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Editar turno
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OPCIÓN 3: TRABAJADORES CONTRATADOS Y POSTULANTES (BOTÓN CONTRATAR PARA POSTULANTES Y OJO DE PERFIL) */}
          {opcionMenu === 'contrataciones' && (
            <div>
              <div className="mb-6">
                <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">Gestión de Personal</span>
                <h1 className="text-3xl font-serif text-stone-900 mt-1">Trabajadores Contratados y Postulantes</h1>
                <p className="text-xs text-stone-500 mt-1">Revisa el estado de las postulaciones agrupadas por cada turno publicado.</p>
              </div>

              <div className="space-y-8">
                {turnos.map((turno) => {
                  const postulantesDelTurno = postulantes.filter(p => p.turnoPostuladoId === turno.id);
                  return (
                    <div key={turno.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                      <div className="flex justify-between items-center pb-4 border-b mb-4">
                        <div>
                          <h3 className="font-serif font-bold text-lg text-stone-900">{turno.titulo}</h3>
                          <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#264e43]" /> {turno.ubicacion} • {turno.tipoTrabajador}
                          </p>
                        </div>
                        <span className="text-xs font-bold bg-stone-100 text-stone-700 px-3 py-1 rounded-full">
                          {postulantesDelTurno.length} Registrados
                        </span>
                      </div>

                      {postulantesDelTurno.length === 0 ? (
                        <p className="text-xs text-stone-400 italic py-2">No hay trabajadores inscritos para este turno aún.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {postulantesDelTurno.map((persona) => (
                            <div key={persona.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center font-bold text-stone-700 font-serif">
                                  {persona.nombre.split(' ').map(n=>n[0]).join('')}
                                </div>
                                <div>
                                  <h4 className="font-bold text-xs text-stone-900 flex items-center gap-2">
                                    {persona.nombre}
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                      persona.estado === 'contratado' 
                                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                                    }`}>
                                      {persona.estado === 'contratado' ? 'Contratado' : 'En Postulación'}
                                    </span>
                                  </h4>
                                  <p className="text-[11px] text-stone-500">★ {persona.rating} • {persona.puesto}</p>
                                </div>
                              </div>

                              {/* [FUNCIONAL] Ojo para ver perfil y botón de Contratar si está en postulación */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setTrabajadorSeleccionado(persona)}
                                  className="p-2 bg-white border border-stone-200 rounded-xl hover:bg-stone-100 text-stone-600 shadow-sm"
                                  title="Ver Perfil"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                
                                {persona.estado === 'postulando' ? (
                                  <button
                                    onClick={() => setPostulanteAContratar(persona)}
                                    className="bg-[#264e43] hover:bg-[#1e3e35] text-white text-xs px-4 py-2 rounded-xl font-medium shadow-sm transition-all"
                                  >
                                    Contratar
                                  </button>
                                ) : (
                                  <span className="text-[11px] font-medium text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ya contratado
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* OPCIÓN 4: RESEÑAS Y ESTADÍSTICAS */}
          {opcionMenu === 'resenas' && (
            <div>
              <div className="mb-6">
                <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">Reputación y Métricas</span>
                <h1 className="text-3xl font-serif text-stone-900 mt-1">Reseñas de la Empresa</h1>
              </div>

              {/* BARRA DE 5 MÉTRICAS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Promedio Estrellas</span>
                  <div className="flex items-center justify-center gap-1 text-2xl font-serif font-bold text-amber-500 mt-1">
                    ★ 4.8
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Trabajadores Activos</span>
                  <div className="text-2xl font-serif font-bold text-stone-800 mt-1">12</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Postulantes</span>
                  <div className="text-2xl font-serif font-bold text-stone-800 mt-1">28</div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Total Contratado</span>
                  <div className="text-2xl font-serif font-bold text-stone-800 mt-1">45</div>
                </div>

                <button
                  onClick={() => setModalResenasPendientes(true)}
                  className="bg-amber-50 hover:bg-amber-100/80 p-4 rounded-2xl border border-amber-200 text-center transition-colors cursor-pointer"
                >
                  <span className="text-[10px] font-bold text-amber-800 uppercase">Reseñas Pendientes</span>
                  <div className="text-2xl font-serif font-bold text-amber-900 mt-1 flex items-center justify-center gap-1">
                    {resenasPendientes.length}
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  </div>
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-900 mb-4 pb-2 border-b border-stone-300">
                    Reseñas Recibidas por Empresa Moresa
                  </h3>
                  <div className="space-y-4">
                    {MOCK_RESENAS_RECIBIDAS.map((r) => (
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
                          <span>Publicado por: <strong className="text-stone-700">{r.autor}</strong></span>
                          <span>{r.fecha}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-900 mb-4 pb-2 border-b border-stone-300">
                    Reseñas Realizadas por Empresa Moresa
                  </h3>
                  <div className="space-y-4">
                    {resenasRealizadas.map((r) => (
                      <div key={r.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-2xl font-bold text-amber-500">★ {r.estrellas.toFixed(1)}</span>
                          <span className="text-[11px] text-stone-400">{r.fecha}</span>
                        </div>
                        <p className="text-xs text-stone-700 font-light my-2">"{r.comentario}"</p>
                        <span className="text-[11px] text-stone-400">Evaluación enviada a: <strong className="text-stone-700">{r.destinatario}</strong></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OPCIÓN 5: PERFIL CON UBICACIÓN ESCRITA */}
          {opcionMenu === 'perfil' && (
            <div>
              <div className="mb-6">
                <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">Configuración</span>
                <h1 className="text-3xl font-serif text-stone-900 mt-1">Perfil de Empresa Moresa</h1>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm max-w-2xl">
                <form onSubmit={(e) => { e.preventDefault(); alert("Perfil y Ubicación de Moresa guardados correctamente."); }} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Nombre Comercial</label>
                    <input
                      type="text"
                      value={datosEmpresa.nombre}
                      onChange={(e) => setDatosEmpresa({...datosEmpresa, nombre: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg bg-stone-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Ubicación Física Escrita (Zona del local/oficina)</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Av. Providencia 1234, Santiago"
                      value={datosEmpresa.direccion}
                      onChange={(e) => setDatosEmpresa({...datosEmpresa, direccion: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg bg-stone-50 focus:bg-white font-medium text-emerald-900 border-emerald-200"
                    />
                    <p className="text-[10px] text-stone-400 mt-1">Esta dirección escrita se asociará automáticamente a los turnos para informar la zona exacta a los trabajadores.</p>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">RUT Empresa</label>
                    <input
                      type="text"
                      value={datosEmpresa.rut}
                      onChange={(e) => setDatosEmpresa({...datosEmpresa, rut: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg bg-stone-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Rubro Principal</label>
                    <input
                      type="text"
                      value={datosEmpresa.rubro}
                      onChange={(e) => setDatosEmpresa({...datosEmpresa, rubro: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg bg-stone-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Correo de Contacto</label>
                    <input
                      type="email"
                      value={datosEmpresa.contacto}
                      onChange={(e) => setDatosEmpresa({...datosEmpresa, contacto: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg bg-stone-50 focus:bg-white"
                    />
                  </div>
                  <button type="submit" className="bg-[#264e43] text-white font-medium py-2.5 px-6 rounded-xl mt-2">
                    Guardar Perfil y Ubicación
                  </button>
                </form>
              </div>
            </div>
          )}

        </main>

        {/* MENÚ LATERAL DERECHO */}
        <aside className="w-full lg:w-80 bg-white border-l border-stone-200 p-6 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center gap-3 pb-6 border-b border-stone-100 mb-6">
              <div className="w-10 h-10 rounded-full bg-stone-100 border border-stone-300 flex items-center justify-center font-serif text-stone-700 font-bold text-sm">
                M
              </div>
              <div>
                <h3 className="text-xs font-bold text-stone-900">Empresa Moresa</h3>
                <span className="text-[10px] font-semibold text-stone-400 uppercase">Perfil Empresa</span>
              </div>
            </div>

            <div className="space-y-6">
              <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">Navegación</span>
              <nav className="space-y-1.5">
                <button
                  onClick={() => setOpcionMenu('busqueda')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-3 transition-all ${
                    opcionMenu === 'busqueda' ? 'bg-[#264e43] text-white shadow-sm font-semibold' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  Buscar Postulantes
                </button>

                <button
                  onClick={() => setOpcionMenu('turnos')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-3 transition-all ${
                    opcionMenu === 'turnos' ? 'bg-[#264e43] text-white shadow-sm font-semibold' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <CalendarIcon className="w-4 h-4" />
                  Turnos Publicados
                </button>

                <button
                  onClick={() => setOpcionMenu('contrataciones')}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-3 transition-all ${
                    opcionMenu === 'contrataciones' ? 'bg-[#264e43] text-white shadow-sm font-semibold' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Contrataciones
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
                  <Building2 className="w-4 h-4" />
                  Perfil y Ubicación
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

      {/* MODAL 1: FORMULARIO DE EDICIÓN/CREACIÓN DE TURNO */}
      {modalFormularioTurno && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 my-8">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="font-serif font-bold text-lg text-stone-900">
                {idTurnoEditar ? "Editar Turno Moresa" : "Crear Nuevo Turno Moresa"}
              </h3>
              <button onClick={() => setModalFormularioTurno(false)} className="text-stone-400 hover:text-stone-600"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handlePrepararResumen} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">Título del Turno</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Ej: Garzón de fin de semana" 
                  className="w-full p-2.5 border rounded-xl bg-stone-50 focus:bg-white" 
                  value={formDataTurno.titulo} 
                  onChange={e => setFormDataTurno({...formDataTurno, titulo: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Hora Entrada</label>
                  <select 
                    value={formDataTurno.horaEntrada} 
                    onChange={e => setFormDataTurno({...formDataTurno, horaEntrada: e.target.value})}
                    className="w-full p-2.5 border rounded-xl bg-stone-50 font-medium"
                  >
                    {OPCIONES_HORAS.map(h => <option key={h} value={h}>{h} hrs</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Hora Salida</label>
                  <select 
                    value={formDataTurno.horaSalida} 
                    onChange={e => setFormDataTurno({...formDataTurno, horaSalida: e.target.value})}
                    className="w-full p-2.5 border rounded-xl bg-stone-50 font-medium"
                  >
                    {OPCIONES_HORAS.map(h => <option key={h} value={h}>{h} hrs</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Sueldo por Hora ($)</label>
                  <input type="number" required placeholder="Ej: 6000" className="w-full p-2.5 border rounded-xl bg-stone-50" value={formDataTurno.sueldoHora} onChange={e => setFormDataTurno({...formDataTurno, sueldoHora: e.target.value})} />
                </div>
                <div>
                  <label className="block font-bold mb-1">Horas de Colación</label>
                  <input type="number" step="0.5" required placeholder="Ej: 1" className="w-full p-2.5 border rounded-xl bg-stone-50" value={formDataTurno.colacion} onChange={e => setFormDataTurno({...formDataTurno, colacion: e.target.value})} />
                </div>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800">Gestión de Fechas del Turno</span>
                  <span className="text-[10px] bg-[#264e43] text-white px-2 py-0.5 rounded-full font-bold">
                    {formDataTurno.fechas.length} seleccionada(s)
                  </span>
                </div>

                <div className="flex gap-2">
                  <input 
                    type="date" 
                    value={formDataTurno.fechaInputManual}
                    onChange={(e) => setFormDataTurno({...formDataTurno, fechaInputManual: e.target.value})}
                    className="flex-1 p-2 border rounded-lg bg-white"
                  />
                  <button 
                    type="button" 
                    onClick={handleAgregarFechaManual}
                    className="bg-[#264e43] text-white px-3 py-2 rounded-lg font-medium text-[11px]"
                  >
                    Añadir Fecha
                  </button>
                </div>

                <p className="text-[10px] text-stone-500">O marca directamente en el calendario interactivo:</p>
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {["2026-11-14", "2026-11-15", "2026-11-16", "2026-11-17", "2026-11-18", "2026-11-19", "2026-11-20", "2026-11-21", "2026-11-22", "2026-11-23"].map((fecha) => {
                    const sel = formDataTurno.fechas.includes(fecha);
                    return (
                      <button
                        type="button"
                        key={fecha}
                        onClick={() => handleToggleFecha(fecha)}
                        className={`p-1.5 text-[10px] rounded-lg border font-medium transition-all ${
                          sel 
                            ? 'bg-[#264e43] text-white border-[#264e43]' 
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {fecha.slice(5)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Descripción del trabajo a realizar</label>
                <textarea required rows={2} placeholder="Descripción de tareas..." className="w-full p-2.5 border rounded-xl bg-stone-50" value={formDataTurno.descripcion} onChange={e => setFormDataTurno({...formDataTurno, descripcion: e.target.value})}></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Tipo de trabajador buscado</label>
                  <input type="text" required placeholder="Ej: Garzón / Cocinero" className="w-full p-2.5 border rounded-xl bg-stone-50" value={formDataTurno.tipoTrabajador} onChange={e => setFormDataTurno({...formDataTurno, tipoTrabajador: e.target.value})} />
                </div>
                <div>
                  <label className="block font-bold mb-1">Cantidad de cupos</label>
                  <input type="number" required placeholder="Ej: 3" className="w-full p-2.5 border rounded-xl bg-stone-50" value={formDataTurno.cupos} onChange={e => setFormDataTurno({...formDataTurno, cupos: e.target.value})} />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button type="submit" className="flex-1 bg-[#264e43] hover:bg-[#1e3e35] text-white py-3 rounded-xl font-medium shadow-sm">
                  Continuar al Resumen →
                </button>
                <button type="button" onClick={() => setModalFormularioTurno(false)} className="px-4 border rounded-xl">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRMACIÓN DE CONTRATACIÓN */}
      {postulanteAContratar && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2 text-[#264e43]">
                <UserCheck className="w-5 h-5" />
                <h3 className="font-serif font-bold text-base text-stone-900">Confirmar Contratación</h3>
              </div>
              <button onClick={() => setPostulanteAContratar(null)} className="text-stone-400"><X className="w-5 h-5" /></button>
            </div>

            <p className="text-xs text-stone-700 my-3">
              ¿Deseas confirmar la contratación de <strong>{postulanteAContratar.nombre}</strong> para el puesto de <strong>{postulanteAContratar.puesto}</strong>?
            </p>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 my-4 text-xs text-emerald-900 space-y-1">
              <p><strong>Candidato:</strong> {postulanteAContratar.nombre}</p>
              <p><strong>Calificación:</strong> ★ {postulanteAContratar.rating}</p>
              <p><strong>Ubicación:</strong> {postulanteAContratar.ubicacion}</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleConfirmarContratacion}
                className="flex-1 bg-[#264e43] hover:bg-[#1e3e35] text-white py-2.5 rounded-xl text-xs font-bold shadow-md"
              >
                Confirmar Contratación
              </button>
              <button
                onClick={() => setPostulanteAContratar(null)}
                className="px-4 border border-stone-300 rounded-xl text-xs text-stone-600 hover:bg-stone-100"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CONFIRMACIÓN SEGURA DE ELIMINACIÓN DE TURNO */}
      {turnoAEliminar && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-serif font-bold text-base text-stone-900">Eliminar Publicación de Turno</h3>
              </div>
              <button onClick={() => setTurnoAEliminar(null)} className="text-stone-400"><X className="w-5 h-5" /></button>
            </div>

            <p className="text-xs text-stone-700 my-3">
              ¿Seguro de querer eliminar el turno <strong>"{turnoAEliminar.titulo}"</strong>?
            </p>

            <div className="bg-red-50 p-3 rounded-xl border border-red-200 my-4">
              <label className="flex items-start gap-2 text-xs text-red-900 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={checkConfirmacionEliminar}
                  onChange={(e) => setCheckConfirmacionEliminar(e.target.checked)}
                  className="mt-0.5 accent-red-600 rounded"
                />
                <span>Entiendo que al eliminar el turno se retirará de las publicaciones y se cancelarán las postulaciones activas.</span>
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleConfirmarEliminarTurno}
                disabled={!checkConfirmacionEliminar}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  checkConfirmacionEliminar 
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-md' 
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                Eliminar Definitivamente
              </button>
              <button
                onClick={() => setTurnoAEliminar(null)}
                className="px-4 border border-stone-300 rounded-xl text-xs text-stone-600 hover:bg-stone-100"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: NOTIFICACIÓN DE CONTACTO */}
      {modalContacto && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-serif font-bold text-base text-stone-900">Ponerse en Contacto</h3>
              <button onClick={() => setModalContacto(null)} className="text-stone-400"><X className="w-5 h-5" /></button>
            </div>

            <p className="text-xs text-stone-600 mb-4">
              Notificar a <strong>{modalContacto.nombre}</strong> que la empresa Moresa desea comunicarse con él/ella.
            </p>

            <div className="space-y-2 mb-5 text-xs">
              <label className="block font-bold text-stone-700">Selecciona la vía de contacto:</label>
              
              <div 
                onClick={() => setViaContacto('email')}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer ${
                  viaContacto === 'email' ? 'border-[#264e43] bg-[#264e43]/5' : 'border-stone-200'
                }`}
              >
                <Mail className="w-4 h-4 text-[#264e43]" />
                <div>
                  <h4 className="font-bold text-stone-900">Por Correo Electrónico</h4>
                  <p className="text-[11px] text-stone-500">{modalContacto.email}</p>
                </div>
              </div>

              <div 
                onClick={() => setViaContacto('telefono')}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer ${
                  viaContacto === 'telefono' ? 'border-[#264e43] bg-[#264e43]/5' : 'border-stone-200'
                }`}
              >
                <Phone className="w-4 h-4 text-[#264e43]" />
                <div>
                  <h4 className="font-bold text-stone-900">Vía Telefónica / SMS</h4>
                  <p className="text-[11px] text-stone-500">{modalContacto.telefono}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleEnviarNotificacionContacto}
                className="flex-1 bg-[#264e43] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Enviar Notificación
              </button>
              <button
                onClick={() => setModalContacto(null)}
                className="px-4 border rounded-xl text-xs"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RESUMEN TURNO */}
      {modalResumenTurno && resumenCalculado && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2 border-b pb-2">
              Resumen del Turno
            </h3>
            <p className="text-xs text-stone-500 mb-4">Revisa los datos y el sueldo calculado antes de confirmar.</p>

            <div className="space-y-2 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200 mb-5">
              <p><strong>Título:</strong> {formDataTurno.titulo}</p>
              <p><strong>Horario:</strong> De {formDataTurno.horaEntrada} a {formDataTurno.horaSalida} ({resumenCalculado.horasEfectivasTurno} hrs efectivas)</p>
              <p><strong>Ubicación Asignada:</strong> {datosEmpresa.direccion}</p>
              <p><strong>Días seleccionados ({formDataTurno.fechas.length}):</strong> {formDataTurno.fechas.join(', ')}</p>
              <p><strong>Perfil buscado:</strong> {formDataTurno.tipoTrabajador} ({formDataTurno.cupos} cupos)</p>
              
              <div className="pt-2 mt-2 border-t border-stone-200 text-stone-800 space-y-1">
                <p><strong>Pago por día (por pers.):</strong> ${resumenCalculado.pagoPorDia.toLocaleString()}</p>
                <p className="text-[#264e43] font-bold text-sm">
                  Sueldo Total estimado (por trabajador): ${resumenCalculado.totalPorTrabajador.toLocaleString()}
                </p>
                <p className="text-stone-500 text-[11px]">
                  Presupuesto Total (todos los cupos): ${resumenCalculado.totalGeneralTurno.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button 
                onClick={handleConfirmarPublicacion}
                className="w-full bg-[#264e43] hover:bg-[#1e3e35] text-white py-2.5 rounded-xl text-xs font-bold"
              >
                Confirmar y {idTurnoEditar ? "Guardar Cambios" : "Publicar Turno"}
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setModalResumenTurno(false); setModalFormularioTurno(true); }}
                  className="flex-1 border border-stone-300 py-2 rounded-xl text-xs text-stone-700 font-medium"
                >
                  Volver a Editar
                </button>
                <button 
                  onClick={() => setModalResumenTurno(false)}
                  className="px-4 border border-stone-200 text-stone-400 rounded-xl text-xs"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RESEÑAS PENDIENTES */}
      {modalResenasPendientes && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="font-serif font-bold text-base text-stone-900">Reseñas Pendientes de Contratos Finalizados</h3>
              <button onClick={() => setModalResenasPendientes(false)} className="text-stone-400 hover:text-stone-600"><X className="w-5 h-5" /></button>
            </div>

            {resenasPendientes.length === 0 ? (
              <p className="text-xs text-stone-500 text-center py-6">No tienes reseñas pendientes por completar.</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {resenasPendientes.map((item) => (
                  <div key={item.id} className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-stone-800">{item.trabajador}</h4>
                      <p className="text-stone-500">{item.turno} • Fin: {item.fechaFin}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setModalEvaluarTrabajador(item);
                          setPuntuacionEstrellas(5.0);
                          setComentarioResena('');
                        }} 
                        className="bg-[#264e43] text-white px-3 py-1.5 rounded-lg text-[11px]"
                      >
                        Reseñar
                      </button>
                      <button 
                        onClick={() => {
                          setResenasPendientes(resenasPendientes.filter(r => r.id !== item.id));
                          alert(`Te has abstenido de reseñar a ${item.trabajador}.`);
                        }} 
                        className="border border-stone-300 text-stone-600 px-3 py-1.5 rounded-lg text-[11px] hover:bg-stone-100"
                      >
                        Abstenerse
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL EVALUAR TRABAJADOR */}
      {modalEvaluarTrabajador && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">Evaluar a {modalEvaluarTrabajador.trabajador}</h3>
                <p className="text-xs text-stone-500">{modalEvaluarTrabajador.turno}</p>
              </div>
              <button onClick={() => setModalEvaluarTrabajador(null)} className="text-stone-400"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setResenasRealizadas([...resenasRealizadas, {
                id: Date.now(),
                destinatario: modalEvaluarTrabajador.trabajador,
                estrellas: puntuacionEstrellas,
                fecha: new Date().toISOString().split('T')[0],
                comentario: comentarioResena || "Sin comentario."
              }]);
              setResenasPendientes(resenasPendientes.filter(r => r.id !== modalEvaluarTrabajador.id));
              setModalEvaluarTrabajador(null);
              alert(`Reseña enviada exitosamente para ${modalEvaluarTrabajador.trabajador}`);
            }} className="space-y-4 text-xs mt-4">
              <div>
                <label className="block font-bold text-stone-700 mb-2">Puntuación (1.0 a 5.0 Estrellas)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.5"
                    value={puntuacionEstrellas}
                    onChange={(e) => setPuntuacionEstrellas(parseFloat(e.target.value))}
                    className="w-full accent-[#264e43]"
                  />
                  <span className="text-lg font-bold text-amber-500 min-w-[3.5rem]">★ {puntuacionEstrellas.toFixed(1)}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Comentario o Retroalimentación</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Escribe tu opinión sobre el desempeño del trabajador..."
                  value={comentarioResena}
                  onChange={(e) => setComentarioResena(e.target.value)}
                  className="w-full p-2.5 border rounded-xl bg-stone-50 focus:bg-white"
                ></textarea>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="submit" className="flex-1 bg-[#264e43] text-white py-2.5 rounded-xl font-bold">
                  Publicar Reseña
                </button>
                <button type="button" onClick={() => setModalEvaluarTrabajador(null)} className="px-4 border rounded-xl">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETALLE DE TRABAJADOR (OJO / VER PERFIL) */}
      {trabajadorSeleccionado && (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center font-serif font-bold text-stone-700">
                  {trabajadorSeleccionado.nombre.split(' ').map((n: string)=>n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-stone-900">{trabajadorSeleccionado.nombre}</h3>
                  <p className="text-xs text-stone-500">{trabajadorSeleccionado.puesto}</p>
                </div>
              </div>
              <button onClick={() => setTrabajadorSeleccionado(null)} className="text-stone-400 hover:text-stone-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3 text-xs text-stone-600 border-t pt-3">
              <p><strong>Experiencia:</strong> {trabajadorSeleccionado.experiencia}</p>
              <p><strong>Ubicación:</strong> {trabajadorSeleccionado.ubicacion}</p>
              <p><strong>Calificación:</strong> ★ {trabajadorSeleccionado.rating} ({trabajadorSeleccionado.resenas} reseñas)</p>
              <p><strong>Teléfono:</strong> {trabajadorSeleccionado.telefono}</p>
              <p><strong>Correo:</strong> {trabajadorSeleccionado.email}</p>
            </div>

            <div className="flex gap-2 mt-5">
              {trabajadorSeleccionado.estado === 'postulando' && (
                <button 
                  onClick={() => {
                    const target = trabajadorSeleccionado;
                    setTrabajadorSeleccionado(null);
                    setPostulanteAContratar(target);
                  }} 
                  className="flex-1 bg-[#264e43] text-white py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Contratar
                </button>
              )}
              <button onClick={() => setTrabajadorSeleccionado(null)} className="flex-1 border rounded-xl text-xs text-stone-600 py-2">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER MATILOGO */}
      <footer className="border-t border-stone-200 px-8 py-4 flex justify-between items-center text-[11px] text-stone-400">
        <span>© 2026 Matilogo. El trabajo empieza con una conexión.</span>
        <span>Español (ES)</span>
      </footer>
    </div>
  );
}