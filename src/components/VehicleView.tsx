import React, { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { ArrowLeft, Car, AlertCircle, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { infractionsList } from '../store/mockData';

export default function VehicleView({ plate, onBack }: { plate: string, onBack: () => void }) {
  const { vehiclesData, citizensData, infractionsData, addInfraction, currentUser } = useAppContext();
  const vehicle = vehiclesData.find(v => v.plate === plate);
  const owner = vehicle ? citizensData.find(c => c.bi === vehicle.ownerBi) : null;
  
  const [showInfractionForm, setShowInfractionForm] = useState(false);
  const [infractionType, setInfractionType] = useState('warning');
  const [selectedInfraction, setSelectedInfraction] = useState('');

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Veículo não encontrado</h2>
        <p className="text-slate-500 mb-6">A matrícula {plate} não consta na base de dados.</p>
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
          <ArrowLeft size={20} /> Voltar ao Dashboard
        </button>
      </div>
    );
  }

  const vehicleInfractions = infractionsData.filter(i => i.vehiclePlate === plate);

  const handleSubmitInfraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInfraction || !currentUser || !owner) return;

    const infDetails = infractionsList.find(i => i.id === selectedInfraction);
    if (!infDetails) return;

    addInfraction({
      type: infractionType as 'warning' | 'fine',
      date: new Date().toISOString(),
      description: infDetails.description,
      value: infractionType === 'fine' ? infDetails.value : 0,
      status: infractionType === 'fine' ? 'Não pago' : 'Aviso',
      citizenBi: owner.bi,
      vehiclePlate: plate,
      agentId: currentUser.id,
      deadline: infractionType === 'fine' ? new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() : null
    });

    setShowInfractionForm(false);
    setSelectedInfraction('');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Voltar</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Vehicle Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 shrink-0">
              <Car size={40} />
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{vehicle.brand} {vehicle.model}</h1>
                  <div className="inline-block mt-2 px-3 py-1 bg-slate-900 text-white font-mono text-lg rounded-md tracking-widest">
                    {vehicle.plate}
                  </div>
                </div>
                {owner && (
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Proprietário</p>
                    <p className="font-medium text-slate-900">{owner.name}</p>
                    <p className="text-xs text-slate-500 font-mono">{owner.bi}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Imposto de Circulação</p>
                    <p className="font-semibold text-slate-900">Situação Anual</p>
                  </div>
                  {vehicle.taxPaid ? (
                    <CheckCircle2 className="text-emerald-500" size={28} />
                  ) : (
                    <XCircle className="text-red-500" size={28} />
                  )}
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Seguro Obrigatório</p>
                    <p className="font-semibold text-slate-900">Apólice</p>
                  </div>
                  {vehicle.insuranceActive ? (
                    <CheckCircle2 className="text-emerald-500" size={28} />
                  ) : (
                    <XCircle className="text-red-500" size={28} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
            <button 
              onClick={() => setShowInfractionForm(!showInfractionForm)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <FileText size={18} />
              Registar Infração
            </button>
          </div>
        </div>

        {/* Infraction Form */}
        {showInfractionForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-blue-200 p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
            <h2 className="text-lg font-bold text-slate-900 mb-6">Nova Infração / Chamada de Atenção</h2>
            <form onSubmit={handleSubmitInfraction} className="space-y-6">
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="type" className="peer sr-only" checked={infractionType === 'warning'} onChange={() => setInfractionType('warning')} />
                  <div className="p-4 rounded-xl border-2 border-slate-200 peer-checked:border-amber-500 peer-checked:bg-amber-50 transition-all text-center">
                    <AlertCircle className={cn("mx-auto mb-2", infractionType === 'warning' ? "text-amber-500" : "text-slate-400")} size={24} />
                    <span className={cn("font-medium", infractionType === 'warning' ? "text-amber-700" : "text-slate-600")}>Aviso (Sem Multa)</span>
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input type="radio" name="type" className="peer sr-only" checked={infractionType === 'fine'} onChange={() => setInfractionType('fine')} />
                  <div className="p-4 rounded-xl border-2 border-slate-200 peer-checked:border-red-500 peer-checked:bg-red-50 transition-all text-center">
                    <FileText className={cn("mx-auto mb-2", infractionType === 'fine' ? "text-red-500" : "text-slate-400")} size={24} />
                    <span className={cn("font-medium", infractionType === 'fine' ? "text-red-700" : "text-slate-600")}>Multa</span>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tipo de Infração</label>
                <select 
                  required
                  value={selectedInfraction}
                  onChange={(e) => setSelectedInfraction(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  {infractionsList.map(inf => (
                    <option key={inf.id} value={inf.id}>{inf.description} {infractionType === 'fine' ? `- ${inf.value} Kz` : ''}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowInfractionForm(false)} className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 font-medium rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors">
                  Confirmar Registo
                </button>
              </div>
            </form>
          </div>
        )}

        {/* History */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Histórico do Veículo</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {vehicleInfractions.length === 0 ? (
              <div className="p-8 text-center text-slate-500">Nenhum registo encontrado para este veículo.</div>
            ) : (
              vehicleInfractions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(inf => (
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
                    {inf.type === 'fine' && (
                      <div className="mt-1 flex items-center gap-4 text-sm">
                        <span className="text-slate-600">Valor: <strong className="text-slate-900">{inf.value} Kz</strong></span>
                        {inf.code && <span className="text-slate-500 font-mono">Ref: {inf.code}</span>}
                      </div>
                    )}
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
