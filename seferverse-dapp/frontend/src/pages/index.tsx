import { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import { fetchDeployments, Deployment, hashDeployments, connectDeploymentsSSE } from "../lib/api";
import { formatDate, formatGas } from "../utils/format";
import DeploymentCard from "../components/DeploymentCard";
import StatusBadge from "../components/StatusBadge";
import WalletConnect from "../components/WalletConnect";
import ContractInteraction from "../components/ContractInteraction";
import NFTMinting from "../components/NFTMinting";

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
        return;
      }
      if (!latest) return;
      if (event.type === 'added' || event.type === 'updated') {
        const net = event.network!;
        latest[net] = latest[net] || {};
        latest[net][event.name!] = event.data;
        rebuild(latest);
        setOnline(true);
        return;
      }
      if (event.type === 'removed') {
        const net = event.network!;
        if (latest[net]) {
          delete latest[net][event.name!];
        }
        rebuild(latest);
        setOnline(true);
        return;
      }
      // noop / error ignored for UI rebuild
    });
    es.onerror = () => setOnline(false);
    return () => es.close();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20" />
        <div className="relative px-6 py-16 sm:px-12 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                🌌 SeferVerse 1789
              </h1>
              <p className="mt-6 text-xl leading-8 text-cyan-200">
                Baron Devrimi - Web3 + NFT + Token + Müzik + Tribe
              </p>
              <p className="mt-4 text-lg text-slate-300">
                Rugcılardan tahsilat, hayallerin refund'u ve kültürel adalet!
              </p>
              <div className="mt-8 flex justify-center">
                <WalletConnect />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 sm:px-12 -mt-8 relative z-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400">{stats.totalContracts}</div>
              <div className="text-slate-300">Toplam Kontrat</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 text-center">
              <div className="text-3xl font-bold text-purple-400">{stats.networks}</div>
              <div className="text-slate-300">Ağ Sayısı</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 text-center">
              <div className="text-3xl font-bold text-green-400">
                <StatusBadge online={online} />
              </div>
              <div className="text-slate-300">Bağlantı Durumu</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contract Interaction Section */}
      <div className="px-6 sm:px-12 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight text-white mb-4">🔗 Kontrat Etkileşimi</h2>
            <ContractInteraction />
          </div>
        </div>
      </div>

      {/* NFT Minting Section */}
      <div className="px-6 sm:px-12 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold tracking-tight text-white mb-4">🎵 NFT Minting</h2>
            <NFTMinting />
          </div>
        </div>
      </div>

      {/* Deployments Section */}
      <div className="px-6 sm:px-12 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center gap-3">
            <h2 className="text-3xl font-semibold tracking-tight text-white">📋 Deployments</h2>
            <span className="ml-auto">
              <StatusBadge online={online} />
            </span>
          </div>
          
          <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 shadow-2xl">
            {items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((d, i) => (
                  <DeploymentCard
                    key={`${d.address ?? ''}-${d.txHash ?? ''}-${i}`}
                    name={d.name}
                    date={formatDate(d.date)}
                    address={d.address}
                    txHash={d.txHash}
                    gasUsed={formatGas(d.gasUsed)}
                    network={d.network}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">Henüz Deploy Edilmemiş</h3>
                <p className="text-slate-400">İlk kontratınızı deploy etmek için blockchain klasörüne gidin</p>
              </div>
            )}
            
            <div className="mt-6 text-right text-xs text-slate-400">
              Data signature: {hash}
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


