import React from 'react';
import { useAppContext } from '../store/AppContext';
import { ArrowLeft, Award, FileText, CheckCircle2, TrendingUp } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AgentPanel({ onBack }: { onBack: () => void }) {
  const { currentUser, infractionsData } = useAppContext();

  if (!currentUser) return null;

  const agentInfractions = infractionsData.filter(i => i.agentId === currentUser.id);
  const agentFines = agentInfractions.filter(i => i.type === 'fine');
  const paidFines = agentFines.filter(i => i.status === 'Pago');
  
  const totalFinesValue = agentFines.reduce((acc, curr) => acc + curr.value, 0);
  const totalPaidValue = paidFines.reduce((acc, curr) => acc + curr.value, 0);
  
  // 1% commission on paid fines
  const commission = totalPaidValue * 0.01;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Voltar ao Dashboard</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{currentUser.name}</h1>
            <p className="text-slate-500 font-mono">NIF: {currentUser.nif}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <FileText size={20} />
              </div>
              <h3 className="font-medium text-slate-700">Total de Multas</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{agentFines.length}</p>
            <p className="text-sm text-slate-500 mt-2">Aplicadas por si</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="font-medium text-slate-700">Multas Pagas</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{paidFines.length}</p>
            <p className="text-sm text-slate-500 mt-2">
              {agentFines.length > 0 ? Math.round((paidFines.length / agentFines.length) * 100) : 0}% de taxa de pagamento
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-sm border border-blue-500 p-6 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
              <Award size={120} />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                <TrendingUp size={20} />
              </div>
              <h3 className="font-medium text-blue-100">Incentivo Acumulado</h3>
            </div>
            <p className="text-3xl font-bold relative z-10">{commission.toLocaleString('pt-PT')} Kz</p>
            <p className="text-sm text-blue-200 mt-2 relative z-10">1% sobre multas pagas</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Suas Últimas Ações</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {agentInfractions.length === 0 ? (
              <div className="p-8 text-center text-slate-500">Nenhum registo encontrado.</div>
            ) : (
              agentInfractions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10).map(inf => (
                <div key={inf.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider",
                        inf.type === 'warning' ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                      )}>
                        {inf.type === 'warning' ? 'Aviso' : 'Multa'}
                      </span>
                      <span className="text-sm text-slate-500">{new Date(inf.date).toLocaleString('pt-PT')}</span>
                    </div>
                    <p className="font-medium text-slate-900">{inf.description}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Alvo: <span className="font-mono">{inf.vehiclePlate || inf.citizenBi}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium border",
                      inf.status === 'Pago' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      inf.status === 'Em atraso' ? "bg-red-50 text-red-700 border-red-200" :
                      inf.status === 'Aviso' ? "bg-slate-100 text-slate-700 border-slate-200" :
                      "bg-amber-50 text-amber-700 border-amber-200"
                    )}>
                      {inf.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
