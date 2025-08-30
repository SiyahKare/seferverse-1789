import { ExternalLink, Copy } from "lucide-react";
import { useState } from "react";
import { getExplorerTxUrl, getExplorerAddressUrl } from "../utils/format";

interface DeploymentRow {
  name: string;
  date?: string | null;
  address: string | null;
  txHash: string | null;
  gasUsed?: string | null;
  network?: string | null;
}

export default function DeploymentTable({ deployments }: { deployments: DeploymentRow[] }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");


  const handleCopy = (value: string | null, key: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1200);
  };

  const rows = deployments.filter(d => !filter || (d.name?.toLowerCase().includes(filter.toLowerCase()) || (d.network||"").toLowerCase().includes(filter.toLowerCase())));

  return (
    <div className="overflow-x-auto rounded-xl shadow-xl bg-white/5 border border-white/10 backdrop-blur-md">
      <div className="p-3 flex items-center gap-2">
        <input
          className="w-full rounded-md bg-white/10 border border-white/20 text-white text-sm px-3 py-2 outline-none"
          placeholder="Filtre: isim veya ağ"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <table className="min-w-full text-sm font-mono text-white">
        <thead>
          <tr className="bg-gradient-to-r from-[#0f2027]/80 to-[#2c5364]/80">
            <th className="p-5 text-left">Name</th>
            <th className="p-5 text-left">Network</th>
            <th className="p-5 text-left">Date</th>
            <th className="p-5 text-left">Address</th>
            <th className="p-5 text-left">Tx Hash</th>
            <th className="p-5 text-left">Gas Used</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((d, i) => (
            <tr
              key={`${d.address ?? ""}-${d.txHash ?? ""}-${i}`}
              className="even:bg-white/5 hover:bg-cyan-900/10 transition"
            >
              <td className="p-5 font-bold text-cyan-200">{d.name}</td>
              <td className="p-5 text-cyan-300 text-xs">{d.network}</td>
              <td className="p-5 text-pink-200 text-xs">{d.date}</td>
              <td className="p-5">
                <div className="flex items-center gap-2">
                  <span className="break-all text-blue-200">{d.address}</span>
                  <button
                    className="hover:text-cyan-400 transition"
                    title="Copy address"
                    onClick={() => handleCopy(d.address, `address-${i}`)}
                  >
                    <Copy size={16} />
                  </button>
                  <a
                    href={getExplorerAddressUrl(d.network, d.address || undefined)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-cyan-400 hover:text-cyan-200 flex items-center gap-1"
                    title="View address on Explorer"
                  >
                    <ExternalLink size={16} />
                  </a>
                  {copied === `address-${i}` && <span className="text-xs text-green-400">Copied!</span>}
                </div>
              </td>
              <td className="p-5">
                <div className="flex items-center gap-2">
                  <span className="break-all text-pink-200">{d.txHash}</span>
                  <button
                    className="hover:text-cyan-400 transition"
                    title="Copy txHash"
                    onClick={() => handleCopy(d.txHash, `txHash-${i}`)}
                  >
                    <Copy size={16} />
                  </button>
                  <a
                    href={getExplorerTxUrl(d.network, d.txHash || undefined)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-cyan-400 hover:text-cyan-200 flex items-center gap-1"
                    title="View on Explorer"
                  >
                    <ExternalLink size={16} />
                  </a>
                  {copied === `txHash-${i}` && <span className="text-xs text-green-400">Copied!</span>}
                </div>
              </td>
              <td className="p-5">
                {d.gasUsed && (
                  <span className="inline-block px-4 py-2 rounded bg-gradient-to-r from-cyan-700/40 to-pink-700/40 text-white text-xs font-mono border border-cyan-700/40 align-middle">
                    {d.gasUsed}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
