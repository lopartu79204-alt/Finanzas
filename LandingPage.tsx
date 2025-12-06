import React from 'react';
import { ArrowRight, CheckCircle2, DollarSign, ShieldCheck, TrendingDown } from 'lucide-react';

interface Props {
  onLoginClick: () => void;
}

export const LandingPage: React.FC<Props> = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900 tracking-tight">Finanzas<span className="text-mx-green">MX</span></span>
          </div>
          <div className="flex gap-4">
            <button 
                onClick={onLoginClick}
                className="text-gray-600 hover:text-mx-green font-medium transition-colors"
            >
                Iniciar Sesión
            </button>
            <button 
                onClick={onLoginClick}
                className="bg-mx-green hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
                Empezar Gratis
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto z-10 relative">
                <span className="inline-block py-1 px-3 rounded-full bg-green-50 text-mx-green text-sm font-semibold mb-6 border border-green-100">
                    Diseñado para familias mexicanas 🇲🇽
                </span>
                <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                    Toma el control de tu <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-mx-green to-emerald-400">futuro financiero</span>
                </h1>
                <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                    Administra tus gastos, planea el pago de tus deudas y calcula cuánto necesitas ahorrar para ese auto o casa nueva. Todo en una sola plataforma inteligente.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button 
                        onClick={onLoginClick}
                        className="flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-slate-900/20"
                    >
                        Crear cuenta gratis <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                    <button className="flex items-center justify-center bg-white border border-gray-200 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-colors">
                        Ver demostración
                    </button>
                </div>
            </div>
            
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-40 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-20 right-10 w-72 h-72 bg-mx-gold/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-mx-red/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Herramientas que transforman tu cartera</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Dejamos atrás las hojas de cálculo complicadas. Usamos tecnología para simplificar tu vida.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                        <TrendingDown className="w-6 h-6 text-mx-red" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Calculadora de Deuda</h3>
                    <p className="text-gray-600">
                        Descubre exactamente cuándo serás libre de deudas usando estrategias como "Bola de Nieve". Ingresa tu tarjeta, tasa y pago mensual.
                    </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                        <DollarSign className="w-6 h-6 text-mx-green" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Metas Inteligentes</h3>
                    <p className="text-gray-600">
                        ¿Quieres un auto o dar el enganche de una casa? Proyecta tus ahorros y visualiza el tiempo exacto para alcanzar tu objetivo.
                    </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                        <ShieldCheck className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Asesoría con IA</h3>
                    <p className="text-gray-600">
                        Recibe consejos personalizados basados en el contexto económico de México. Pregunta sobre inflación, CETES o Afores.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-500 text-sm">
                © 2024 FinanzasMX. Hecho con ❤️ para México.
            </div>
            <div className="flex gap-6 text-sm text-gray-600 font-medium">
                <a href="#" className="hover:text-mx-green">Privacidad</a>
                <a href="#" className="hover:text-mx-green">Términos</a>
                <a href="#" className="hover:text-mx-green">Contacto</a>
            </div>
        </div>
      </footer>
    </div>
  );
};