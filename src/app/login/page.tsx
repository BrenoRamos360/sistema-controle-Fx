'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DollarSign } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si ya está autenticado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/');
      } else {
        setLoading(false);
      }
    });

    // Escuchar cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl shadow-2xl mb-4">
            <DollarSign className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Control Financiero
          </h1>
          <p className="text-lg text-gray-600">
            Gestiona tus finanzas de forma inteligente
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                  },
                },
              },
              className: {
                container: 'w-full',
                button: 'rounded-xl font-semibold',
                input: 'rounded-xl',
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Correo electrónico',
                  password_label: 'Contraseña',
                  email_input_placeholder: 'tu@email.com',
                  password_input_placeholder: 'Tu contraseña',
                  button_label: 'Iniciar sesión',
                  loading_button_label: 'Iniciando sesión...',
                  social_provider_text: 'Iniciar sesión con {{provider}}',
                  link_text: '¿Ya tienes cuenta? Inicia sesión',
                },
                sign_up: {
                  email_label: 'Correo electrónico',
                  password_label: 'Contraseña',
                  email_input_placeholder: 'tu@email.com',
                  password_input_placeholder: 'Tu contraseña',
                  button_label: 'Registrarse',
                  loading_button_label: 'Registrando...',
                  social_provider_text: 'Registrarse con {{provider}}',
                  link_text: '¿No tienes cuenta? Regístrate',
                },
                forgotten_password: {
                  email_label: 'Correo electrónico',
                  password_label: 'Contraseña',
                  email_input_placeholder: 'tu@email.com',
                  button_label: 'Enviar instrucciones',
                  loading_button_label: 'Enviando...',
                  link_text: '¿Olvidaste tu contraseña?',
                },
              },
            }}
            providers={[]}
          />
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm font-semibold text-gray-700">Dashboard Completo</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
            <div className="text-3xl mb-2">🔔</div>
            <p className="text-sm font-semibold text-gray-700">Notificaciones</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <p className="text-sm font-semibold text-gray-700">Metas Financieras</p>
          </div>
        </div>
      </div>
    </div>
  );
}
