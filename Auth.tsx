import React, { useState } from 'react';
import { UserProfile } from '../types';

interface Props {
  onLogin: (user: UserProfile) => void;
  onBack: () => void;
}

export const Auth: React.FC<Props> = ({ onLogin, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    onLogin({
      name: name || (email.split('@')[0] || 'Usuario'),
      email: email,
      monthlyIncome: 0
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-mx-green hover:text-green-700">
              {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="sr-only">Nombre completo</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-mx-green focus:border-mx-green focus:z-10 sm:text-sm"
                  placeholder="Nombre completo"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">Correo electrónico</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${!isLogin ? '' : 'rounded-t-md'} focus:outline-none focus:ring-mx-green focus:border-mx-green focus:z-10 sm:text-sm`}
                placeholder="Correo electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-mx-green focus:border-mx-green focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                defaultValue="password123"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-mx-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mx-green transition-colors"
            >
              {isLogin ? 'Entrar' : 'Registrarse'}
            </button>
          </div>
          <div className="text-center">
             <button type="button" onClick={onBack} className="text-sm text-gray-500 hover:text-gray-900">Volver al inicio</button>
          </div>
        </form>
      </div>
    </div>
  );
};