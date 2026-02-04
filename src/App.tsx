import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Users, DollarSign, Target, Globe, ArrowUpRight } from 'lucide-react';

const PIE_COLORS = ['#3b82f6', '#8b5cf6']; 

// Usei _data para o TypeScript ignorar que a variável ainda não está sendo usada
const Dashboard = ({ data: _data }: any) => {
  // Dados fictícios para o seu lançamento de inglês aparecer agora
  const totalLeads = 1540;
  const investimento = 11500; 
  const cpl = (investimento / totalLeads).toFixed(2);

  const dataOrigem = [
    { name: 'Instagram', value: 850 },
    { name: 'YouTube', value: 690 },
  ];

  const dataSrc = [
    { name: 'Tráfego Pago (ADS)', value: 980 },
    { name: 'Orgânico (Player)', value: 560 },
  ];

  const dataHoras = Array.from({ length: 24 }, (_, i) => ({
    hora: `${i}h`,
    leads: Math.floor(Math.random() * 40) + 10
  }));

  return (
    <div className="p-6 bg-[#020617] text-white min-h-screen font-sans">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Intelligence Hub</h1>
          <p className="text-slate-400">Projeto Rulian | Campanha: LC14</p>
        </div>
        <div className="bg-blue-600/10 border border-blue-600/20 px-4 py-2 rounded-lg flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          <span className="text-blue-400 text-sm font-medium">Dashboard Ativo</span>
        </div>
      </div>

      {/* MÉTRICAS NO TOPO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total de Leads" value={totalLeads} icon={<Users size={20}/>} color="text-blue-500" />
        <MetricCard title="Investimento" value={`R$ ${investimento}`} icon={<DollarSign size={20}/>} color="text-purple-500" />
        <MetricCard title="Custo por Lead" value={`R$ ${cpl}`} icon={<Target size={20}/>} color="text-pink-500" />
        <MetricCard title="Países Ativos" value="12" icon={<Globe size={20}/>} color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRÁFICO DE ONDAS - PICO DE HORÁRIO */}
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            Fluxo Diário <span className="text-xs font-normal text-slate-500">(24h)</span>
          </h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={dataHoras}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hora" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO DE ORIGEM - BARRAS */}
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h3 className="text-lg font-semibold mb-6">Origem dos Leads</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={dataOrigem}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis stroke="#475569" fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO DE PIZZA - ADS VS PLAYER */}
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h3 className="text-lg font-semibold mb-6">Tráfego: ADS vs Orgânico</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={dataSrc} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                  {dataSrc.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DISTRIBUIÇÃO GLOBAL POR REGIÃO */}
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h3 className="text-lg font-semibold mb-6 flex justify-between items-center">
            Principais Regiões <ArrowUpRight size={18} className="text-slate-500" />
          </h3>
          <div className="space-y-5">
            <RegionItem country="Brasil" count="1.240" percent="80%" progress={80} />
            <RegionItem country="EUA" count="180" percent="12%" progress={12} />
            <RegionItem country="Portugal" count="120" percent="8%" progress={8} />
          </div>
        </div>
      </div>
      {/* Marcador para as cores não aparecerem como erro de 'não utilizado' se precisar do COLORS depois */}
      <div className="hidden">#2563eb</div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, color }: any) => (
  <div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800 shadow-lg">
    <div className="flex justify-between items-start mb-2">
      <span className="text-slate-400 text-sm font-medium">{title}</span>
      <div className={`${color} bg-slate-900/50 p-2 rounded-lg`}>{icon}</div>
    </div>
    <div className="text-2xl font-bold tracking-tight text-white">{value}</div>
  </div>
);

const RegionItem = ({ country, count, percent, progress }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="font-medium text-white">{country}</span>
      <span className="text-slate-400">{count} leads ({percent})</span>
    </div>
    <div className="w-full bg-slate-800 rounded-full h-1.5">
      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

export default function App() {
  return <Dashboard data={[]} />;
}