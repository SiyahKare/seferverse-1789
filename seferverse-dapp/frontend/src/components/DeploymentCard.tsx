import { useState } from "react";
import { getExplorerTxUrl, getExplorerAddressUrl } from "../utils/format";
import { Copy, ExternalLink, Calendar, Hash, GasPump, Network } from "lucide-react";

interface DeploymentCardProps {
  name: string;
  date?: string | null;
  address: string | null;
  txHash: string | null;
  gasUsed?: string | null;
  network?: string | null;
}

export default function DeploymentCard({
  name,
  date,
  address,
  txHash,
  gasUsed,
  network,
}: DeploymentCardProps) {
  const [copied, setCopied] = useState<"address" | "txHash" | null>(null);

  const handleCopy = (value: string | null, type: "address" | "txHash") => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(type);
    setTimeout(() => setCopied(null), 1200);
  };

  const getNetworkColor = (net: string) => {
    const colors: Record<string, string> = {
      'localhost': 'bg-gray-500/40 text-gray-200 border-gray-600/40',
      'sepolia': 'bg-blue-500/40 text-blue-200 border-blue-600/40',
      'base-sepolia': 'bg-cyan-500/40 text-cyan-200 border-cyan-600/40',
      'base': 'bg-blue-600/40 text-blue-100 border-blue-700/40',
      'mainnet': 'bg-green-500/40 text-green-200 border-green-600/40',
      'default': 'bg-purple-500/40 text-purple-200 border-purple-600/40'
    };
    return colors[net.toLowerCase()] || colors.default;
  };

  const truncateAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div
      className="
        w-full sm:w-[22rem] rounded-2xl p-6 shadow-2xl
        bg-gradient-to-br from-white/5 to-white/10 border border-white/20 backdrop-blur-md
        transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]
        hover:border-cyan-400/40 relative overflow-hidden group
      "
    >
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2 tracking-wide group-hover:text-cyan-200 transition-colors">
              {name}
            </h3>
            {network && (
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getNetworkColor(network)}`}>
                <Network size={12} />
                {network}
              </span>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="space-y-4">
          {/* Date */}
          {date && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
              <Calendar size={16} className="text-cyan-400 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-xs text-slate-400 uppercase tracking-wide">Deploy Date</div>
                <div className="text-white font-mono text-sm">{date}</div>
              </div>
            </div>
          )}

          {/* Address */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Hash size={16} className="text-blue-400 flex-shrink-0" />
              <div className="text-xs text-slate-400 uppercase tracking-wide">Contract Address</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex-1 break-all text-blue-200 font-mono text-sm">
                {address ? truncateAddress(address) : 'Not deployed'}
              </span>
              {address && (
                <>
                  <button
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 transition-all"
                    title="Copy address"
                    onClick={() => handleCopy(address, "address")}
                  >
                    <Copy size={14} />
                  </button>
                  <a
                    href={getExplorerAddressUrl(network, address)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 transition-all"
                    title="View on Explorer"
                  >
                    <ExternalLink size={14} />
                  </a>
                </>
              )}
            </div>
            {copied === "address" && (
              <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Copied!
              </div>
            )}
          </div>

          {/* Transaction Hash */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Hash size={16} className="text-pink-400 flex-shrink-0" />
              <div className="text-xs text-slate-400 uppercase tracking-wide">Transaction Hash</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex-1 break-all text-pink-200 font-mono text-sm">
                {txHash ? truncateAddress(txHash) : 'Not available'}
              </span>
              {txHash && (
                <>
                  <button
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 transition-all"
                    title="Copy transaction hash"
                    onClick={() => handleCopy(txHash, "txHash")}
                  >
                    <Copy size={14} />
                  </button>
                  <a
                    href={getExplorerTxUrl(network, txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 transition-all"
                    title="View on Explorer"
                  >
                    <ExternalLink size={14} />
                  </a>
                </>
              )}
            </div>
            {copied === "txHash" && (
              <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Copied!
              </div>
            )}
          </div>

          {/* Gas Used */}
          {gasUsed && (
            <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/10 to-pink-500/10 border border-cyan-500/20">
              <div className="flex items-center gap-3">
                <GasPump size={16} className="text-cyan-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Gas Used</div>
                  <div className="text-white font-mono text-sm">{gasUsed}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
