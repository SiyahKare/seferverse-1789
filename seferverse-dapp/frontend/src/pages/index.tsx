import { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import { fetchDeployments, Deployment, hashDeployments, connectDeploymentsSSE } from "../lib/api";
import { formatDate, formatGas } from "../utils/format";
import DeploymentCard from "../components/DeploymentCard";
import StatusBadge from "../components/StatusBadge";

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
    <div>
      <div className="mb-8 flex items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">Deployments</h1>
        <span className="ml-auto"><StatusBadge online={online} /></span>
      </div>
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 shadow-xl">
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
        <div className="mt-6 text-right text-xs text-slate-400">Data signature: {hash}</div>
      </div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="i-svg-spinners:90-ring-with-bg w-12 h-12 text-cyan-400 animate-spin" />
        </div>
      )}
      {!online && (
        <div className="mt-4 text-sm text-amber-300">Canlı bağlantı kesildi, yeniden bağlanılıyor...</div>
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


