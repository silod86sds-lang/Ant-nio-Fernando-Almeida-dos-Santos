import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Search, Car, FileText, AlertTriangle, ShieldCheck, Activity, LogOut, UserCircle } from 'lucide-react';

export default function Dashboard({ onNavigate }: { onNavigate: (view: string, id?: string) => void }) {
  const { currentUser, dailyStats, infractionsData, logout, incrementInspected } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    incrementInspected();
    
    // Simple logic: if it has a hyphen, assume it's a plate, else BI
    if (searchQuery.includes('-')) {
      onNavigate('vehicle', searchQuery.toUpperCase());
    } else {
      onNavigate('citizen', searchQuery.toUpperCase());
    }
  };

  const overdueFinesCount = infractionsData.filter(i => i.status === 'Em atraso').length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://i.ibb.co/VW539V5S/covercc.png" alt="SIFT Logo" className="h-8 w-auto object-contain" referrerPolicy="no-referrer" />
            <span className="font-bold text-lg tracking-tight">SIFT</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('agent')}
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              <UserCircle size={20} />
              <span className="hidden sm:inline">{currentUser?.name}</span>
            </button>
            <div className="w-px h-6 bg-slate-700"></div>
            <button onClick={logout} className="text-slate-400 hover:text-red-400 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Search Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Consulta Rápida</h2>
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-slate-400" size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-24 py-4 text-lg border border-slate-300 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
              placeholder="Nº do BI ou Matrícula (ex: LD-12-34-AA)"
            />
            <div className="absolute inset-y-2 right-2">
              <button
                type="submit"
                className="h-full px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Buscar
              </button>
            </div>
          </form>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Car size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Veículos Fiscalizados</p>
              <p className="text-2xl font-bold text-slate-900">{dailyStats.inspected}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Infrações Registadas</p>
              <p className="text-2xl font-bold text-slate-900">{dailyStats.infractions}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Multas Emitidas</p>
              <p className="text-2xl font-bold text-slate-900">{dailyStats.fines}</p>
            </div>
          </div>
        </section>

        {/* Alerts */}
        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={20} />
            Alertas do Sistema
          </h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {overdueFinesCount > 0 ? (
                <div className="p-4 flex items-start gap-3 bg-red-50/50">
                  <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="text-sm font-medium text-slate-900">Multas em Atraso</p>
                    <p className="text-sm text-slate-600">Existem {overdueFinesCount} multas em atraso no sistema que requerem atenção em caso de fiscalização.</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 text-sm">
                  Nenhum alerta crítico no momento.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
