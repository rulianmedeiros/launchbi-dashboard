import { useEffect } from 'react';
// Removido 'Target' que não estava sendo usado
import { TrendingUp, DollarSign, Eye, Loader2, AlertTriangle } from 'lucide-react';

export default function TrafficView({ adAccountId, accessToken }: { adAccountId: string, accessToken: string }) {
  // Removido o estado 'loading' que não estava sendo usado

  useEffect(() => {
    console.log("Configurando Tráfego para:", adAccountId);
  }, [adAccountId, accessToken]);

  return (
    <div className="animate-in fade-in duration-500 text-white">
      <header className="mb-10">
        <h2 className="text-3xl font-extrabold tracking-tight mb-1 uppercase italic">Traffic Analyzer</h2>
        <p className="text-slate-500 text-sm font-medium italic">Monitorando Conta: {adAccountId || 'Não configurada'}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <TrafficCard label="Alcance" value="--" icon={<Eye size={20}/>} />
        <TrafficCard label="CTR" value="--" icon={<TrendingUp size={20}/>} />
        <TrafficCard label="Investido" value="R$ --" icon={<DollarSign size={20}/>} color="text-green-400" />
      </div>

      <div className="bg-white/[0.02] border border-white/5 p-20 rounded-[32px] flex flex-col items-center justify-center text-center">
        {!accessToken ? (
          <>
            <AlertTriangle size={48} className="text-amber-500 mb-4" />
            <h3 className="text-xl font-black uppercase tracking-widest mb-2">Token de Acesso Ausente</h3>
            <p className="text-slate-500 text-xs max-w-xs">Configure o Access Token do Meta Ads no modal de configurações do projeto para visualizar os dados reais de tráfego.</p>
          </>
        ) : (
          <>
            <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
            <h3 className="text-xl font-black uppercase tracking-widest mb-2">Conectando ao Meta API</h3>
            <p className="text-slate-500 text-xs">Sincronizando métricas da conta act_{adAccountId}...</p>
          </>
        )}
      </div>
    </div>
  );
}

function TrafficCard({ label, value, icon, color = "text-white" }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[28px]">
      <div className="p-3 w-fit bg-slate-950/40 rounded-2xl text-blue-400 mb-6">{icon}</div>
      <p className="text-slate-500 text-[9px] uppercase font-black tracking-widest mb-1">{label}</p>
      <div className={`text-2xl font-black ${color} tracking-tighter`}>{value}</div>
    </div>
  );
}