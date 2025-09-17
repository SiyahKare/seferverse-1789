import { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import { fetchDeployments, Deployment, hashDeployments, connectDeploymentsSSE } from "../lib/api";
import { formatDate, formatGas } from "../utils/format";
// import DeploymentCard from "../components/DeploymentCard";
// import StatusBadge from "../components/StatusBadge";
import WalletConnect from "../components/WalletConnect";
// import ContractInteraction from "../components/ContractInteraction";
// import NFTMinting from "../components/NFTMinting";
// import NFTGallery from "../components/NFTGallery";
// import AnalyticsDashboard from "../components/AnalyticsDashboard";
// import GovernancePanel from "../components/GovernancePanel";
// import PWAInstall from "../components/PWAInstall";
// import { ToastContainer } from "../components/Toast";
// import { useToast } from "../hooks/useToast";

interface HomeProps {
  deployments: Deployment[];
}

export default function Home({ deployments }: HomeProps) {
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState<string>(hashDeployments(deployments));
  const [items, setItems] = useState<Deployment[]>(deployments);
  const [online, setOnline] = useState<boolean>(true);
  const [stats, setStats] = useState({
    totalContracts: deployments.length,
    networks: new Set(deployments.map(d => d.network)).size,
    lastUpdated: new Date().toISOString()
  });
  // const { toasts, removeToast, success, error, warning } = useToast();

  useEffect(() => {
    let latest: Record<string, any> | null = null;
    const rebuild = (payload: any) => {
      const list: Deployment[] = [];
      for (const [network, contracts] of Object.entries(payload as Record<string, any>)) {
        for (const [name, d] of Object.entries(contracts as Record<string, any>)) {
          list.push({
            name,
            address: (d as any).address ?? null,
            txHash: (d as any).txHash ?? (d as any).transactionHash ?? null,
            gasUsed: (d as any).gasUsed ?? null,
            date: (d as any).date ?? null,
            network,
          });
        }
      }
      setItems(list);
      setHash(hashDeployments(list));
      setStats({
        totalContracts: list.length,
        networks: new Set(list.map(d => d.network)).size,
        lastUpdated: new Date().toISOString()
      });
    };

    const es = connectDeploymentsSSE((event) => {
      if (!event) return;
      if (event.type === 'full' && event.deployments) {
        latest = event.deployments;
        rebuild(latest);
        setOnline(true);
        // success('Bağlantı Kuruldu', 'Canlı veri akışı başlatıldı');
        return;
      }
      if (!latest) return;
      if (event.type === 'added' || event.type === 'updated') {
        const net = event.network!;
        latest[net] = latest[net] || {};
        latest[net][event.name!] = event.data;
        rebuild(latest);
        setOnline(true);
        if (event.type === 'added') {
          // success('Yeni Kontrat', `${event.name} başarıyla deploy edildi`);
        }
        return;
      }
      if (event.type === 'removed') {
        const net = event.network!;
        if (latest[net]) {
          delete latest[net][event.name!];
        }
        rebuild(latest);
        setOnline(true);
        // warning('Kontrat Kaldırıldı', `${event.name} listeden çıkarıldı`);
        return;
      }
      // noop / error ignored for UI rebuild
    });
    es.onerror = () => {
      setOnline(false);
      // error('Bağlantı Hatası', 'Canlı veri akışı kesildi');
    };
    return () => es.close();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="px-6 py-20 sm:px-12 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              {/* Main Title with Glow Effect */}
              <div className="relative">
                <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl mb-4">
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                    🌌 SeferVerse
                  </span>
                </h1>
                <div className="text-3xl font-bold text-amber-400 sm:text-4xl lg:text-5xl mb-8">
                  1789
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-pink-400/20 blur-3xl -z-10" />
              </div>

              {/* Subtitle */}
              <div className="max-w-4xl mx-auto">
                <p className="text-2xl font-semibold leading-8 text-cyan-200 mb-4">
                  Baron Devrimi - Web3 + NFT + Token + Müzik + Tribe
                </p>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                  Rugcılardan tahsilat, hayallerin refund'u ve kültürel adalet! 
                  <br />
                  <span className="text-amber-300 font-medium">Blockchain üzerinde devrim başlıyor...</span>
                </p>
              </div>

              {/* Wallet Connect Button */}
              <div className="mt-12 flex justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-75" />
                  <div className="relative">
                    <WalletConnect />
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-20 left-10 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}} />
              <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}} />
              <div className="absolute bottom-20 left-20 w-12 h-12 bg-pink-500/20 rounded-full blur-xl animate-bounce" style={{animationDelay: '2s', animationDuration: '5s'}} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 sm:px-12 -mt-16 relative z-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Contract Stats */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📄</span>
                </div>
                <div className="text-4xl font-black text-cyan-400 mb-2">{stats.totalContracts}</div>
                <div className="text-slate-300 font-medium">Toplam Kontrat</div>
                <div className="text-xs text-slate-400 mt-2">Deploy edilen akıllı kontratlar</div>
              </div>
            </div>

            {/* Network Stats */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌐</span>
                </div>
                <div className="text-4xl font-black text-purple-400 mb-2">{stats.networks}</div>
                <div className="text-slate-300 font-medium">Ağ Sayısı</div>
                <div className="text-xs text-slate-400 mt-2">Desteklenen blockchain ağları</div>
              </div>
            </div>

            {/* Connection Status */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="mb-2">
                  <span className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm bg-green-500/20 border-green-500/30 text-green-300 font-medium">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    Canlı Bağlantı
                  </span>
                </div>
                <div className="text-slate-300 font-medium">Bağlantı Durumu</div>
                <div className="text-xs text-slate-400 mt-2">Real-time veri akışı aktif</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Interaction Section */}
      <div className="px-6 sm:px-12 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold tracking-tight text-white mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  🔗 Kontrat Etkileşimi
                </span>
              </h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                Akıllı kontratlarınızla etkileşim kurun, token transferleri yapın ve DAO yönetimine katılın
              </p>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 text-center hover:bg-white/15 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Yakında Aktif</h3>
                <p className="text-slate-300">Kontrat etkileşimi özellikleri yakında eklenecek</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-6 sm:px-12 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-white mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                🚀 Özellikler
              </span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto">
              SeferVerse 1789'un güçlü Web3 özelliklerini keşfedin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* NFT Minting */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎵</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">NFT Minting</h3>
                <p className="text-slate-300 text-sm mb-4">Baron Trilogy Audio NFT'lerini mint edin</p>
                <div className="text-xs text-slate-400 bg-slate-800/50 rounded-lg px-3 py-1">Yakında Aktif</div>
              </div>
            </div>

            {/* NFT Gallery */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🖼️</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">NFT Gallery</h3>
                <p className="text-slate-300 text-sm mb-4">Koleksiyonunuzu görüntüleyin</p>
                <div className="text-xs text-slate-400 bg-slate-800/50 rounded-lg px-3 py-1">Yakında Aktif</div>
              </div>
            </div>

            {/* DAO Governance */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🗳️</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">DAO Governance</h3>
                <p className="text-slate-300 text-sm mb-4">Topluluk yönetimine katılın</p>
                <div className="text-xs text-slate-400 bg-slate-800/50 rounded-lg px-3 py-1">Yakında Aktif</div>
              </div>
            </div>

            {/* Analytics */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Analytics</h3>
                <p className="text-slate-300 text-sm mb-4">Detaylı istatistikler</p>
                <div className="text-xs text-slate-400 bg-slate-800/50 rounded-lg px-3 py-1">Yakında Aktif</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deployments Section */}
      <div className="px-6 sm:px-12 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-white mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                🚀 Deployments
              </span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-6">
              Deploy edilen akıllı kontratlarınızı görüntüleyin ve yönetin
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm bg-green-500/20 border-green-500/30 text-green-300 font-medium">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              Canlı Bağlantı
            </div>
          </div>
          
          <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
            {items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((d, i) => (
                  <div key={`${d.address ?? ''}-${d.txHash ?? ''}-${i}`} className="group relative">
                    {/* Card Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                    
                    {/* Card Content */}
                    <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:border-cyan-400/30">
                      {/* Contract Icon */}
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mb-4">
                        <span className="text-xl">📄</span>
                      </div>
                      
                      {/* Contract Name */}
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                        {d.name}
                      </h3>
                      
                      {/* Network Badge */}
                      <div className="mb-4">
                        <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs bg-purple-500/20 border-purple-500/30 text-purple-300 font-medium">
                          <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                          {d.network}
                        </span>
                      </div>
                      
                      {/* Address */}
                      <div className="space-y-2">
                        <div className="text-xs text-slate-400 font-medium">Contract Address:</div>
                        <div className="text-sm text-slate-300 font-mono bg-slate-800/50 rounded-lg p-2 break-all">
                          {d.address || 'N/A'}
                        </div>
                      </div>
                      
                      {/* Hover Effect */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="relative">
                  <div className="text-8xl mb-6 animate-bounce">🚀</div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-slate-300 mb-4">Henüz Deploy Edilmemiş</h3>
                <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                  İlk kontratınızı deploy etmek için blockchain klasörüne gidin ve 
                  <span className="text-cyan-300 font-medium"> npx hardhat deploy</span> komutunu çalıştırın
                </p>
                <div className="mt-6">
                  <div className="inline-flex items-center gap-2 bg-slate-800/50 rounded-lg px-4 py-2 text-sm text-slate-300 font-mono">
                    <span className="text-green-400">$</span>
                    npx hardhat deploy --network baseSepolia
                  </div>
                </div>
              </div>
            )}
            
            {/* Data Signature */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-400">
                  <span className="font-medium">Data Signature:</span>
                </div>
                <div className="text-xs text-slate-500 font-mono bg-slate-800/30 rounded-lg px-3 py-1">
                  {hash}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="i-svg-spinners:90-ring-with-bg w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
            <div className="text-white text-center">Yükleniyor...</div>
          </div>
        </div>
      )}

      {/* Connection Status */}
      {!online && (
        <div className="fixed bottom-6 right-6 bg-amber-500/90 backdrop-blur-sm rounded-xl px-4 py-3 text-white shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-200 rounded-full animate-pulse" />
            Canlı bağlantı kesildi, yeniden bağlanılıyor...
          </div>
        </div>
      )}

      {/* Toast Container */}
      {/* <ToastContainer toasts={toasts} onClose={removeToast} /> */}

      {/* PWA Install Button */}
      {/* <PWAInstall /> */}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const deployments = await fetchDeployments();
    return { props: { deployments } };
  } catch {
    return { props: { deployments: [] } };
  }
};


