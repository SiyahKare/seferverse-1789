import { useEffect, useState } from "react";
import { Copy, ExternalLink } from "lucide-react";
import type { GetServerSideProps } from "next";
// import DeploymentTable from "../components/DeploymentTable";

import { fetchDeployments, Deployment, hashDeployments, connectDeploymentsSSE } from "../lib/api";
import { formatDate, formatGas, getExplorerTxUrl } from "../utils/format";

type DeploymentCardProps = {
  deployment: Deployment;
};

function DeploymentCard({ deployment }: DeploymentCardProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const { name, network, date, address, txHash, gasUsed } = deployment;
  const explorerUrl = txHash ? getExplorerTxUrl(network, txHash) : "#";

  const handleCopy = async (value: string | undefined, label: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1200);
    } catch {}
  };

  return (
    <div
      className="relative w-full min-h-[220px] rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 shadow-xl p-6 flex flex-col gap-4 transition-all duration-300 hover:scale-[1.02] backdrop-blur-md overflow-hidden group hover:shadow-cyan-900/20 hover:shadow-2xl hover:border-slate-600/50"
    >
      <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-br from-cyan-500/[0.05] via-transparent to-pink-500/[0.05]" />
      <div className="flex items-center gap-3 mb-3 relative z-10">
        <span className="text-lg font-semibold text-white tracking-tight group-hover:text-cyan-50 transition-colors">{name}</span>
        <span className="ml-auto text-xs text-emerald-200 bg-emerald-900/30 rounded-md px-2.5 py-1 shadow-sm font-mono border border-emerald-700/30">{network}</span>
      </div>
      <div className="flex items-center gap-2.5 relative z-10">
        <span className="text-xs font-medium bg-slate-700/50 text-slate-200 rounded-md px-2.5 py-1 border border-slate-600/30">Tarih</span>
        <span className="text-sm text-slate-300 font-mono">{formatDate(date)}</span>
      </div>
      <div className="flex items-center gap-2.5 relative z-10">
        <span className="text-xs font-medium bg-slate-700/50 text-slate-200 rounded-md px-2.5 py-1 border border-slate-600/30">Adres</span>
        <span className="text-sm text-slate-300 flex-1 truncate max-w-[120px] sm:max-w-[180px] md:max-w-[240px] lg:max-w-[320px] font-mono">{address}</span>
        <button
          className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-700/50 rounded-md transition-all"
          title="Kopyala"
          onClick={() => handleCopy(address ?? undefined, 'address')}
        >
          <Copy size={14} />
        </button>
        {copied === 'address' && <span className="text-xs text-green-400 ml-1">Kopyalandı!</span>}
      </div>
      <div className="flex items-center gap-2.5 relative z-10">
        <span className="text-xs font-medium bg-slate-700/50 text-slate-200 rounded-md px-2.5 py-1 border border-slate-600/30">Tx Hash</span>
        <span className="text-sm text-slate-300 flex-1 truncate max-w-[120px] sm:max-w-[180px] md:max-w-[240px] lg:max-w-[320px] font-mono">{txHash}</span>
        <button
          className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-700/50 rounded-md transition-all"
          title="Kopyala"
          onClick={() => handleCopy(txHash ?? undefined, 'txHash')}
        >
          <Copy size={14} />
        </button>
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 text-slate-400 hover:text-cyan-300 hover:bg-slate-700/50 rounded-md transition-all flex items-center"
          title="Explorer'da Gör"
        >
          <ExternalLink size={14} />
        </a>
        {copied === 'txHash' && <span className="text-xs text-green-400 ml-1">Kopyalandı!</span>}
      </div>
      <div className="flex items-center gap-2.5 mt-4 relative z-10">
        <span className="text-xs font-medium bg-slate-700/50 text-slate-200 rounded-md px-2.5 py-1 border border-slate-600/30">Gas Used</span>
        <span className="inline-block px-3 py-1 rounded-md bg-gradient-to-r from-slate-800 to-slate-700 text-slate-200 text-sm font-mono border border-slate-600/30 shadow-sm">
          {formatGas(gasUsed)}
        </span>
      </div>
    </div>
  );
}

interface HomeProps {
  deployments: Deployment[];
}

export default function Home({ deployments }: HomeProps) {
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState<string>(hashDeployments(deployments));
  const [items, setItems] = useState<Deployment[]>(deployments);
  const [online, setOnline] = useState<boolean>(true);

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
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-6xl mx-auto rounded-3xl bg-slate-900/50 backdrop-blur-2xl border border-slate-700/30 shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-white mb-12 tracking-tight">
          SeferVerse 1789 Deployments
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((d, i) => (
            <DeploymentCard key={`${d.address ?? ''}-${d.txHash ?? ''}-${i}`} deployment={d} />
          ))}
        </div>
        <div className="mt-6 text-center text-xs text-slate-400">
          Data signature: {hash}
        </div>
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="i-svg-spinners:90-ring-with-bg w-12 h-12 text-cyan-400 animate-spin" />
          </div>
        )}
        {!online && (
          <div className="mt-4 text-center text-xs text-amber-300">Canlı bağlantı kesildi, yeniden bağlanılıyor...</div>
        )}
      </div>
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