'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
// Modifica esta línea para importar la instancia 'supabase' en lugar de la función 'createClient'
import { supabase } from '@/lib/supabase/client'; 
import { Button } from '@/components/ui/button'; // Asumiendo que tienes un componente Button
import { Input } from '@/components/ui/input';   // Asumiendo que tienes un componente Input
import { Label } from '@/components/ui/label';   // Asumiendo que tienes un componente Label

export default function LoginForm() {
  const router = useRouter();
  // Ya no necesitas llamar a createClient() aquí, porque 'supabase' ya es la instancia
  // const supabase = createClient(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      console.error('Error al iniciar sesión:', signInError);
      if (signInError.message.includes('Invalid login credentials')) {
        setError('Credenciales de inicio de sesión inválidas. Por favor, verifica tu email y contraseña.');
      } else {
        setError(`Error al iniciar sesión: ${signInError.message}`);
      }
      return;
    }

    // Redirigir al dashboard o página principal después del login exitoso
    router.push('/dashboard'); // O la ruta que prefieras
    // Puedes mantener o quitar router.refresh() según necesites. 
    // Si /dashboard es una página que necesita datos frescos tras el login, router.refresh() puede ser útil ANTES del push o que el layout lo maneje.
    // Pero para una simple redirección, router.push() es lo principal.
    // router.refresh(); 
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-white mb-2">
            Inicia Sesión
          </h1>
          <p className="text-gray-400 text-sm">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <div className="space-y-4">
          {/* Campo Email */}
          <div className="space-y-2">
            <Label 
              className="text-sm font-medium text-gray-300" 
              htmlFor="email"
            >
              Correo Electrónico
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <Input
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:border-gray-500/50 focus:ring-2 focus:ring-gray-500/20 transition-all duration-200 backdrop-blur-sm"
                id="email"
                type="email"
                name="email"
                placeholder="tu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div className="space-y-2">
            <Label 
              className="text-sm font-medium text-gray-300" 
              htmlFor="password"
            >
              Contraseña
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <Input
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-gray-400 focus:border-gray-500/50 focus:ring-2 focus:ring-gray-500/20 transition-all duration-200 backdrop-blur-sm"
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Botón de Login */}
        <Button 
          type="submit" 
          className="w-full py-3 px-4 bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-gray-500/50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg" 
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Iniciando sesión...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Iniciar Sesión</span>
            </div>
          )}
        </Button>

        {/* Mensaje de Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl backdrop-blur-sm" aria-live="polite">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* Enlaces adicionales */}
        <div className="pt-4 text-center">
          <a href="#" className="text-sm text-gray-400 hover:text-gray-300 transition-colors duration-200">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </form>
  );
}