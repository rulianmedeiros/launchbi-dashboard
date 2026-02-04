import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Users, ClipboardCheck, DollarSign, 
  Smartphone, Heart, Sparkles, CheckCircle2, AlertCircle
} from 'lucide-react';

export default function SurveyView({ projectId, campaignName }: { projectId: number, campaignName: string }) {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://n8n.rulianmedeiros.com/webhook/busca-leads?id=${projectId}&campaign=${campaignName}`)
      .then(res => res.json())
      .then(data => {
        if (data.code === 0 || !Array.isArray(data)) {
          setLeads([]);
        } else {
          setLeads(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLeads([]);
        setLoading(false);
      });
  }, [projectId, campaignName]);

  const totalLeads = leads.length;
  const qualificados = leads.filter(l => l.qualificado).length;
  const mobileUsers = leads.filter(l => l.dispositivo?.toLowerCase() === 'desktop').length; 
  const respondentes = leads.filter(l => l.idade || l.sexo).length;
  const responseRate = totalLeads > 0 ? ((respondentes / totalLeads) * 100).toFixed(1) : "0";

  const INCOME_DATA = [
    { range: '2 a 5 Salários', v: leads.filter(l => l.renda_mensal?.includes('2 a 5')).length },
    { range: 'Outros', v: leads.filter(l => l.renda_mensal && !l.renda_mensal.includes('2 a 5')).length },
  ];

  const GENDER_DIST = [
    { name: 'Masculino', value: leads.filter(l => l.sexo === 'Masculino').length, color: '#3b82f6' },
    { name: 'Feminino', value: leads.filter(l => l.sexo === 'Feminino').length, color: '#ec4899' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10 flex justify-between items-end text-white">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-1 uppercase italic">Intelligence Hub</h2>
          <div className="flex items-center gap-2">
             <p className="text-slate-500 text-sm font-medium italic">Projeto: {projectId}</p>
             <span className="text-slate-700">|</span>
             <p className="text-blue-500 text-sm font-bold uppercase tracking-widest">Campanha: {campaignName}</p>
          </div>
        </div>
        <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-xl flex items-center gap-2 text-blue-400">
          <Sparkles size={16} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">Filtro Ativo</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <SurveyCard label="Leads na Campanha" value={totalLeads} sub={campaignName} icon={<Users size={20}/>} />
        <SurveyCard label="Taxa de Resposta" value={`${responseRate}%`} sub={`${respondentes} respondentes`} icon={<ClipboardCheck size={20}/>} color="text-blue-400" />
        <SurveyCard label="Aprovados IA" value={qualificados} sub="Score de Qualificação" icon={<Heart size={20}/>} color="text-rose-400" />
        <SurveyCard label="Acesso via Celular" value={totalLeads - mobileUsers} sub="Detectado via UTM" icon={<Smartphone size={20}/>} color="text-green-400" />
      </div>

      <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-[32px] shadow-2xl mb-10">
        <div className="flex items-center gap-2 mb-10 text-blue-400">
          <Sparkles size={16} />
          <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Leads da Campanha</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] uppercase font-black text-slate-500 tracking-widest border-b border-white/5">
                <th className="px-4 py-4">Lead / Local</th>
                <th className="px-4 py-4">Status Qualidade</th>
                <th className="px-4 py-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leads.map((lead, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-5">
                    <p className="text-xs font-bold text-white">{lead.email}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">{lead.cidade || 'Não id.'} • {lead.dispositivo}</p>
                  </td>
                  <td className="px-4 py-5 text-white">
                    {lead.qualificado ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-green-500 uppercase">
                        <CheckCircle2 size={12} /> Qualificado
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase">
                        <AlertCircle size={12} /> Analisando
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-5 text-right font-black text-blue-400">
                    {lead.score_ia || '--'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <GlassBox title="Renda" icon={<DollarSign size={16}/>} className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={INCOME_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} />
                <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none'}} />
                <Bar dataKey="v" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassBox>

        <GlassBox title="Gênero" icon={<Users size={16}/>}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={GENDER_DIST} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                  {GENDER_DIST.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{fontSize: '10px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassBox>
      </div>
      {loading && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center text-white font-black italic uppercase">Sincronizando...</div>}
    </div>
  );
}

function SurveyCard({ label, value, sub, icon, color = "text-white" }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[28px] relative overflow-hidden">
      <div className="p-3 w-fit bg-slate-950/40 rounded-2xl text-blue-400 mb-6">{icon}</div>
      <p className="text-slate-500 text-[9px] uppercase font-black tracking-widest mb-1">{label}</p>
      <div className={`text-2xl font-black ${color} mb-1 tracking-tighter`}>{value}</div>
      <p className="text-[9px] font-black text-blue-500 italic truncate">{sub}</p>
    </div>
  );
}

function GlassBox({ title, children, icon, className = "" }: any) {
  return (
    <div className={`bg-white/[0.02] border border-white/5 p-8 rounded-[32px] ${className}`}>
      <div className="flex items-center gap-2 mb-10 text-blue-400">
        {icon} <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{title}</h3>
      </div>
      {children}
    </div>
  );
}