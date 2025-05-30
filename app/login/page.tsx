import LoginForm from '@/components/auth/login-form';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
      {/* Efectos de fondo decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gray-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gray-700/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative mx-auto flex w-full max-w-[420px] flex-col space-y-6 md:-mt-16">
        {/* Header con glassmorphism */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800/50 to-gray-800/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-600/10 to-gray-800/10"></div>
          <div className="relative p-8 md:p-10">
            <div className="text-white">
              <div className="mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-700 to-black rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Gestión de
                </h1>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">
                  Inventario
                </h2>
              </div>
              <p className="text-gray-400 text-sm">
                Accede a tu panel de control
              </p>
            </div>
          </div>
        </div>

        {/* Formulario con efecto glassmorphism */}
        <div className="relative rounded-2xl bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-700/20 to-transparent"></div>
          <div className="relative p-6 md:p-8">
            <Suspense 
              fallback={
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center space-x-3 text-gray-400">
                    <div className="animate-spin w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                    <span className="text-sm">Cargando formulario...</span>
                  </div>
                </div>
              }
            >
              <LoginForm />
            </Suspense>
          </div>
        </div>

        {/* Footer opcional */}
        <div className="text-center">
          <p className="text-gray-500 text-xs">
            © 2024 Sistema de Inventario. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </main>
  );
}