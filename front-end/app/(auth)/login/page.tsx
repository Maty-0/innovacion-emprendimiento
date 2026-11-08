'use client';

import { useState } from 'react';
import { Building2, User, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

// [FUNCIONAL] Componente principal de Login con diseño basado en la imagen de referencia
export default function LoginPage() {
  // [FUNCIONAL] Estado para alternar entre 'empresa' y 'trabajador'
  const [tipoUsuario, setTipoUsuario] = useState<'empresa' | 'trabajador'>('empresa');

  // [FUNCIONAL] Estados para los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // [FUNCIONAL] Manejador del inicio de sesión
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Iniciando sesión como ${tipoUsuario}:`, { email, password, rememberMe });
    window.location.href = `/dashboard/${tipoUsuario}`;
  };

  // [FUNCIONAL] Generador rápido de cuenta de demostración según el rol activo
  const handleGenerarDemo = () => {
    if (tipoUsuario === 'empresa') {
      setEmail('demo.empresa@nexo.com');
      setPassword('EmpresaDemo2026!');
    } else {
      setEmail('demo.trabajador@nexo.com');
      setPassword('TrabajadorDemo2026!');
    }
    setRememberMe(true);
  };

  return (
    // [ESTETICO] Layout de pantalla completa con fondo de oficina iluminada y overlay tenue
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-8 md:p-12 font-sans bg-stone-900 overflow-hidden">
      
      {/* [ESTETICO] Imagen de fondo con filtro de opacidad y desenfoque elegante */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay scale-105 transition-all duration-700"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/90 via-stone-800/60 to-stone-900/80" />

      {/* [ESTETICO] Tarjeta contenedora de dos columnas (Hero a la izquierda, Formulario a la derecha) */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12">
        
        {/* ========================================================= */}
        {/* COLUMNA IZQUIERDA: MENSAJE HERO Y SELLO                   */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 text-stone-100 space-y-6 px-4 lg:px-8">
          
          {/* [ESTETICO] Etiqueta superior */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-stone-300 uppercase">
            <span className="w-8 h-[1px] bg-stone-400"></span>
            Pagina de inicio de sesion de prueba
          </div>

          {/* [ESTETICO] Título con tipografía Serif refinada */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif leading-[1.1] tracking-tight text-white font-normal">
            El talento y las <br />
            <span className="italic font-light text-stone-200">oportunidades,</span> <br />
            en el mismo lugar.
          </h1>

          {/* [ESTETICO] Descripción secundaria */}
          <p className="text-base sm:text-lg text-stone-300 font-light max-w-xl leading-relaxed">
            Conectamos a quienes buscan un nuevo reto con las empresas que quieren crecer. Tu próxima conexión empieza en Matylogo.
          </p>

          {/* [ESTETICO] Pie de la columna izquierda */}
          <div className="pt-8 flex items-center gap-3 text-xs text-stone-400 font-light">
            <div className="p-2 rounded-full bg-stone-800/80 border border-stone-700">
              <User className="w-4 h-4 text-stone-300" />
            </div>
            <span>Dos perfiles. Un espacio para encontrarse.</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUMNA DERECHA: TARJETA DE INICIO DE SESIÓN             */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-7 sm:p-9 border border-stone-100 text-stone-800">
            
            {/* [ESTETICO] Subtítulo y Título del Formulario */}
            <div className="mb-6">
              <span className="text-[11px] font-bold tracking-widest text-stone-400 uppercase">
                Tu espacio en Matilogo
              </span>
              <h2 className="text-3xl font-serif text-stone-900 mt-1">Inicia sesión</h2>
              <p className="text-xs text-stone-500 mt-1">Elige tu perfil para continuar.</p>
            </div>

            {/* [FUNCIONAL] Selector de pestañas para Empresa / Trabajador (Pill Tabs) */}
            <div className="bg-stone-100/90 p-1 rounded-xl flex gap-1 mb-6 border border-stone-200/60">
              <button
                type="button"
                onClick={() => setTipoUsuario('empresa')}
                // [ESTETICO] Estilos interactivos para la pestaña activa de Empresa
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  tipoUsuario === 'empresa'
                    ? 'bg-white text-stone-900 shadow-sm font-semibold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Empresa
              </button>

              <button
                type="button"
                onClick={() => setTipoUsuario('trabajador')}
                // [ESTETICO] Estilos interactivos para la pestaña activa de Trabajador
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  tipoUsuario === 'trabajador'
                    ? 'bg-white text-stone-900 shadow-sm font-semibold'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Trabajador
              </button>
            </div>

            {/* [FUNCIONAL] Formulario principal */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* [FUNCIONAL] Campo de Correo Electrónico */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    // [ESTETICO] Input con ícono interno y foco en tono esmeralda/verde oscuro
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-lg text-xs text-stone-800 placeholder-stone-400 focus:bg-white focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 focus:outline-none transition-all"
                    placeholder={tipoUsuario === 'empresa' ? 'nombre@tuempresa.com' : 'tu.nombre@correo.com'}
                  />
                </div>
              </div>

              {/* [FUNCIONAL] Campo de Contraseña */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    // [ESTETICO] Input con ícono de candado e ícono para alternar visibilidad
                    className="w-full pl-10 pr-10 py-2.5 bg-stone-50/50 border border-stone-200 rounded-lg text-xs text-stone-800 placeholder-stone-400 focus:bg-white focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 focus:outline-none transition-all"
                    placeholder="Introduce tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* [FUNCIONAL] Recordarme y Recupear Contraseña */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-stone-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-stone-300 text-emerald-800 focus:ring-emerald-800/20"
                  />
                  Recuérdame
                </label>
                <a href="#" className="font-semibold text-stone-700 hover:text-stone-900 underline-offset-2 hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* [ESTETICO] Botón Principal de Envío en Verde Oscuro Corporativo */}
              <button
                type="submit"
                className="w-full mt-2 bg-[#264e43] hover:bg-[#1e3e35] text-white font-medium py-3 rounded-lg text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99]"
              >
                Entrar como {tipoUsuario}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* ========================================================= */}
            {/* GENERADOR DE CUENTA DEMO (REQUERIDO)                       */}
            {/* ========================================================= */}
            <div className="mt-5 pt-4 border-t border-stone-100 space-y-3 text-center">
              
              {/* [FUNCIONAL] Botón para autocompletar credenciales de demostración */}
              <button
                type="button"
                onClick={handleGenerarDemo}
                // [ESTETICO] Botón estilo secundario con ícono de destello para destacar la prueba demo
                className="w-full bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200/80 font-medium py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Generar cuenta de demostración ({tipoUsuario})
              </button>

              <p className="text-[11px] text-stone-500">
                ¿Todavía no tienes cuenta?{' '}
                <a href="#" className="font-bold text-stone-900 hover:underline">
                  Regístrate
                </a>
              </p>

              {/* [ESTETICO] Mensaje de seguridad al pie de la tarjeta */}
              <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Tus datos, protegidos. Tus conexiones, con propósito.</span>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* [ESTETICO] Pie de página global */}
      <footer className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400 font-light">
        <span>© 2026 Matilogo. El trabajo empieza con una conexión.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-stone-200 transition-colors">Privacidad</a>
          <a href="#" className="hover:text-stone-200 transition-colors">Condiciones de uso</a>
          <span>Español (ES)</span>
        </div>
      </footer>

    </div>
  );
}