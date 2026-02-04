import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Users, DollarSign, Target, Globe } from 'lucide-react';

// Cores definidas para uso nos gráficos
const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#059669', '#ca8a04'];
const PIE_COLORS = ['#3b82f6', '#8b5cf6']; 

const Dashboard = ({ data }: any) => {
  const totalLeads = data?.length || 19;
  const investimento = 1500; 
  const cpl = (investimento / totalLeads).toFixed(2);

  const dataOrigem = [
    { name: 'Instagram', value: 12 },
    { name: 'YouTube', value: 7 },
  ];

  const dataSrc = [
    { name: 'Tráfego Pago (ADS)', value: data?.filter((l: any) => l.src === 'ADS').length || 10 },
    { name: 'Orgânico (Player)', value: data?.filter((l: any) => l.src === 'Player').length || 9 },
  ];

  const dataHoras = Array.from({ length: 24 }, (_, i) => ({
    hora: `${i}h`,
    leads: Math.floor(Math.random() * 10) 
  }));

  return (
    <div className="p-6 bg-slate-950 text-white min-h-screen">
      {/* HEADER MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total de Leads" value={totalLeads} icon={<Users />} color="bg-blue-600" />
        <MetricCard title="Investimento" value={`R$ ${investimento}`} icon={<DollarSign />} color="bg-purple-600" />
        <MetricCard title="Custo por Lead" value={`R$ ${cpl}`} icon={<Target />} color="bg-pink-600" />
        <MetricCard title="Paises Ativos" value="5+" icon={<Globe />} color="bg-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRÁFICO DE ONDAS - ALTURA FIXA APLICADA */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-lg font-semibold mb-4">Pico de Entrada (24h)</h3>
          <div className="h-[300px] w-full"> 
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataHoras}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hora" stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                <Area type="monotone" dataKey="leads" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO DE ORIGEM - ALTURA FIXA APLICADA */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-lg font-semibold mb-4">Origem dos Leads</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataOrigem}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO ADS VS PLAYER - ALTURA FIXA APLICADA */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-lg font-semibold mb-4">Tipo de Tráfego (ADS vs Orgânico)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={dataSrc} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {dataSrc.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DISTRIBUIÇÃO GLOBAL */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-lg font-semibold mb-4">Distribuição Global</h3>
          <div className="space-y-4">
            <RegionItem country="Brasil" count="12" percent="63%" />
            <RegionItem country="EUA" count="4" percent="21%" />
            <RegionItem country="Portugal" count="3" percent="16%" />
          </div>
        </div>
      </div>
      <div className="hidden">{COLORS[0]}</div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, color }: any) => (
  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center space-x-4">
    <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
    <div>
      <p className="text-slate-400 text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  </div>
);

const RegionItem = ({ country, count, percent }: any) => (
  <div className="flex justify-between items-center">
    <span>{country}</span>
    <div className="flex items-center space-x-4">
      <span className="text-slate-400">{count} leads</span>
      <span className="bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs">{percent}</span>
    </div>
  </div>
);

export default function App() {
  return <Dashboard data={[]} />;
}