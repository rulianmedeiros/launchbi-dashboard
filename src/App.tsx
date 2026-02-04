import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Users, DollarSign, Target, Globe } from 'lucide-react';

const PIE_COLORS = ['#3b82f6', '#8b5cf6']; 

const Dashboard = ({ data }: any) => {
  // Simulação de dados para garantir que os gráficos apareçam agora
  const totalLeads = data?.length > 0 ? data.length : 1540;
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
    leads: Math.floor(Math.random() * 50) + 10
  }));

  return (
    <div className="p-6 bg-slate-950 text-white min-h-screen">
      {/* MÉTRICAS PRINCIPAIS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Total de Leads" value={totalLeads} icon={<Users />} color="bg-blue-600" />
        <MetricCard title="Investimento" value={`R$ ${investimento}`} icon={<DollarSign />} color="bg-purple-600" />
        <MetricCard title="Custo por Lead" value={`R$ ${cpl}`} icon={<Target />} color="bg-pink-600" />
        <MetricCard title="Países Ativos" value="12" icon={<Globe />} color="bg-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRÁFICO DE ONDAS (PICO 24H) - ALTURA FIXA PARA EVITAR ERRO 0 */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-blue-400">Pico de Entrada (24h)</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={dataHoras}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hora" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                <Area type="monotone" dataKey="leads" stroke="#3b82f6" fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO DE BARRAS (ORIGEM) */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-purple-400">Origem dos Leads</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={dataOrigem}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip cursor={{fill: '#1e293b'}} contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRÁFICO DE PIZZA (ADS VS PLAYER) */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-pink-400">Tráfego: ADS vs Orgânico</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
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

        {/* DISTRIBUIÇÃO POR REGIÃO */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-lg font-semibold mb-4 text-emerald-400">Principais Regiões</h3>
          <div className="space-y-4 pt-4">
            <RegionItem country="Brasil" count="1.240" percent="80%" />
            <RegionItem country="EUA" count="180" percent="12%" />
            <RegionItem country="Portugal" count="120" percent="8%" />
          </div>
        </div>
      </div>
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
  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
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