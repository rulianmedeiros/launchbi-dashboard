import { useState, useEffect } from 'react';
import SurveyView from './SurveyView';
import TrafficView from './TrafficView'; 
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  LayoutDashboard, Users, TrendingUp, DollarSign, Target, 
  Activity, MessageSquare, FileSearch, Plus, 
  FolderKanban, Settings2, Tag 
} from 'lucide-react';

const DAILY_FLOW = [
  { date: '01/09', spend: 1100, leads: 160 }, { date: '02/09', spend: 1500, leads: 220 },
  { date: '03/09', spend: 1300, leads: 180 }, { date: '04/09', spend: 1800, leads: 280 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateFilter, setDateFilter] = useState('7d');
  
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('launchbi_projects');
    return saved ? JSON.parse(saved) : [
      { id: 15, name: 'Projeto Rulian', campaigns: ['lc15', 'lc14'], adAccountId: '', token: '' }
    ];
  });

  const [currentProject, setCurrentProject] = useState(() => {
    const saved = localStorage.getItem('active_project');
    return saved ? JSON.parse(saved) : projects[0];
  });

  const [activeCampaign, setActiveCampaign] = useState(() => {
    return localStorage.getItem('active_campaign') || currentProject.campaigns[0] || '';
  });

  useEffect(() => {
    localStorage.setItem('launchbi_projects', JSON.stringify(projects));
    localStorage.setItem('active_project', JSON.stringify(currentProject));
    localStorage.setItem('active_campaign', activeCampaign);
  }, [projects, currentProject, activeCampaign]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editName, setEditName] = useState('');
  const [editCampaigns, setEditCampaigns] = useState('');

  const handleOpenCreate = () => { setModalMode('create'); setEditName(''); setEditCampaigns(''); setIsModalOpen(true); };
  const handleOpenEdit = () => { setModalMode('edit'); setEditName(currentProject.name); setEditCampaigns(currentProject.campaigns.join(', ')); setIsModalOpen(true); };

  const saveProject = () => {
    if (!editName.trim()) return;
    const campaignList = editCampaigns.split(',').map(c => c.trim()).filter(c => c !== '');
    const projectData = { ...currentProject, id: modalMode === 'create' ? Date.now() : currentProject.id, name: editName, campaigns: campaignList.length > 0 ? campaignList : ['Geral'] };

    if (modalMode === 'create') {
      setProjects([...projects, projectData]);
      setCurrentProject(projectData);
      setActiveCampaign(projectData.campaigns[0]);
    } else {
      const updated = projects.map((p: any) => p.id === currentProject.id ? projectData : p);
      setProjects(updated);
      setCurrentProject(projectData);
      if (!projectData.campaigns.includes(activeCampaign)) setActiveCampaign(projectData.campaigns[0]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex overflow-hidden">
      <aside className="w-72 bg-white/[0.02] backdrop-blur-3xl border-r border-white/5 flex flex-col z-20 shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"><Activity size={20} className="text-white" /></div>
          <span className="font-bold text-xl tracking-tight uppercase italic text-white">LaunchBI</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-8">
          <nav className="flex flex-col gap-1">
            <MenuBtn active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={18}/>} label="Dashboard" />
            <MenuBtn active={activeTab === 'pesquisa'} onClick={() => setActiveTab('pesquisa')} icon={<FileSearch size={18}/>} label="Pesquisa Leads" />
            <MenuBtn active={activeTab === 'trafego'} onClick={() => setActiveTab('trafego')} icon={<TrendingUp size={18}/>} label="Tráfego Pago" />
          </nav>
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Seus Projetos</h3>
              <button onClick={handleOpenCreate} className="p-1 hover:bg-blue-600/20 rounded-lg text-blue-500 transition-all"><Plus size={16} /></button>
            </div>
            <div className="space-y-4">
              {projects.map((proj: any) => (
                <div key={proj.id} className="space-y-1">
                  <div onClick={() => { setCurrentProject(proj); setActiveCampaign(proj.campaigns[0]); }} className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${currentProject.id === proj.id ? 'bg-blue-600/10 border-blue-500/30 text-white' : 'bg-transparent border-transparent text-slate-500 hover:bg-white/5'}`}>
                    <div className="flex items-center gap-3 truncate">
                      <FolderKanban size={14} className={currentProject.id === proj.id ? 'text-blue-500' : 'text-slate-600'} />
                      <span className="text-[11px] font-bold truncate">{proj.name}</span>
                    </div>
                    {currentProject.id === proj.id && <button onClick={(e) => { e.stopPropagation(); handleOpenEdit(); }} className="p-1 hover:text-white transition-colors"><Settings2 size={12} /></button>}
                  </div>
                  {currentProject.id === proj.id && (
                    <div className="ml-6 space-y-1 animate-in slide-in-from-left-2 duration-300">
                      {proj.campaigns.map((camp: string) => (
                        <button key={camp} onClick={() => setActiveCampaign(camp)} className={`flex items-center gap-2 w-full p-2 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all ${activeCampaign === camp ? 'text-blue-400 bg-blue-400/5' : 'text-slate-600 hover:text-slate-400'}`}><Tag size={10} /> {camp}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto relative p-8">
        <header className="relative z-10 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/20 border border-blue-500/20 rounded-2xl text-blue-500"><Target size={24} /></div>
            <div><h2 className="text-2xl font-black tracking-tight uppercase italic">{currentProject.name}</h2><p className="text-[10px] font-black uppercase text-blue-500 tracking-widest mt-1">Filtro Ativo: {activeCampaign}</p></div>
          </div>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 p-1.5 rounded-2xl shadow-2xl">
            {['Hoje', 'Ontem', '7d', 'Todo'].map((f) => (
              <button key={f} onClick={() => setDateFilter(f)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${dateFilter === f ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-white/5'}`}>{f}</button>
            ))}
          </div>
        </header>
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <Card label="Investimento" value="R$ 11.500" sub={activeCampaign} icon={<DollarSign size={20}/>} />
              <Card label="Total Leads" value="1.540" sub="Campanha Ativa" icon={<Users size={20}/>} />
              <Card label="Qualificados" value="630" sub="Filtro Postgres" icon={<Target size={20}/>} color="text-green-400" />
              <Card label="Conv. WhatsApp" value="59.1%" sub="n8n Sinc" icon={<MessageSquare size={20}/>} color="text-blue-400" />
            </div>
            <GlassBox title="Fluxo Diário" icon={<TrendingUp size={16}/>}>
              <div className="h-80"><ResponsiveContainer width="100%" height="100%"><AreaChart data={DAILY_FLOW}><XAxis dataKey="date" tick={{fill: '#64748b', fontSize: 12}}/><Tooltip/><Area type="monotone" dataKey="spend" stroke="#3b82f6" fill="#3b82f620" strokeWidth={3}/></AreaChart></ResponsiveContainer></div>
            </GlassBox>
          </div>
        )}
        {activeTab === 'pesquisa' && <SurveyView projectId={currentProject.id} campaignName={activeCampaign} />}
        {activeTab === 'trafego' && <TrafficView adAccountId={currentProject.adAccountId} accessToken={currentProject.token} />}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-white">
            <div className="bg-slate-900 border border-white/10 p-8 rounded-[32px] w-full max-w-md shadow-2xl">
              <h3 className="font-black uppercase tracking-widest text-sm mb-6">{modalMode === 'create' ? 'Novo Projeto' : 'Editar Projeto'}</h3>
              <div className="space-y-4 mb-6">
                <div><label className="text-[10px] font-black text-slate-500 uppercase mb-1 block">Nome do Projeto</label><input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none" /></div>
                <div><label className="text-[10px] font-black text-slate-500 uppercase mb-1 block">Campanhas (Separadas por vírgula)</label><textarea value={editCampaigns} onChange={(e) => setEditCampaigns(e.target.value)} className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none h-24" /></div>
              </div>
              <div className="flex gap-3"><button onClick={() => setIsModalOpen(false)} className="flex-1 p-4 text-xs font-bold uppercase">Cancelar</button><button onClick={saveProject} className="flex-[2] bg-blue-600 p-4 rounded-2xl font-black uppercase text-sm shadow-lg shadow-blue-600/30">Salvar Alterações</button></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function MenuBtn({ active, icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all w-full ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}>
      {icon} <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function Card({ label, value, sub, icon, color = "text-white" }: any) {
  return (
    <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 p-6 rounded-[28px] shadow-2xl relative overflow-hidden group">
      <div className="p-3 w-fit bg-slate-950/40 rounded-2xl border border-white/5 text-blue-400 mb-6">{icon}</div>
      <p className="text-slate-500 text-[9px] uppercase font-black tracking-widest mb-1">{label}</p>
      <div className={`text-2xl font-black ${color} mb-1 tracking-tighter`}>{value}</div>
      <p className="text-[9px] font-black text-blue-500 truncate italic">{sub}</p>
    </div>
  );
}

function GlassBox({ title, children, icon }: any) {
  return (
    <div className={`bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-[32px] shadow-2xl`}>
      <div className="flex items-center gap-2 mb-10 text-blue-400">{icon} <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{title}</h3></div>
      {children}
    </div>
  );
}