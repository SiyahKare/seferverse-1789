import { useState } from "react";
import { getExplorerTxUrl, getExplorerAddressUrl } from "../utils/format";
import { Copy, ExternalLink } from "lucide-react";

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

  return (
    <div
      className="
        w-full sm:w-[22rem] rounded-xl p-4 shadow-xl
        bg-white/5 border border-white/10 backdrop-blur-md
        transition-transform hover:scale-105 hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]
        relative overflow-hidden
      "
    >
      {/* Animated shine overlay */}
      <div className="absolute left-0 top-0 w-full h-full pointer-events-none z-0">
        <div className="absolute left-[-60%] top-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shine_2.5s_linear_infinite]" />
      </div>
      <div className="relative z-10 grid grid-cols-[auto_1fr] gap-2 items-center">
        <span className="col-span-2 text-lg font-bold text-cyan-200 mb-2 tracking-wide">
          {name}
          {network && (
            <span className="ml-2 px-2 py-0.5 rounded bg-cyan-900/40 text-cyan-300 text-xs font-mono border border-cyan-700/40 align-middle">{network}</span>
          )}
        </span>
        {date && <>
          <span className="text-gray-400">Date</span>
          <span className="text-white font-mono">{date}</span>
        </>}
        <span className="text-gray-400">Address</span>
        <span className="flex items-center gap-2">
          <span className="break-all text-blue-200">{address}</span>
          <button
            className="hover:text-cyan-400 transition"
            title="Copy address"
            onClick={() => handleCopy(address, "address")}
          >
            <Copy size={16} />
          </button>
          <a
            href={getExplorerAddressUrl(network, address)}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-cyan-400 hover:text-cyan-200 flex items-center gap-1"
            title="View address on Explorer"
          >
            <ExternalLink size={16} />
          </a>
          {copied === "address" && <span className="text-xs text-green-400">Copied!</span>}
        </span>
        <span className="text-gray-400">Tx Hash</span>
        <span className="flex items-center gap-2">
          <span className="break-all text-pink-200">{txHash}</span>
          <button
            className="hover:text-cyan-400 transition"
            title="Copy txHash"
            onClick={() => handleCopy(txHash, "txHash")}
          >
            <Copy size={16} />
          </button>
          <a
            href={getExplorerTxUrl(network, txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 text-cyan-400 hover:text-cyan-200 flex items-center gap-1"
            title="View on Explorer"
          >
            <ExternalLink size={16} />
          </a>
          {copied === "txHash" && <span className="text-xs text-green-400">Copied!</span>}
        </span>
        {gasUsed && <>
          <span className="text-gray-400">Gas Used</span>
          <span className="inline-block px-2 py-0.5 rounded bg-gradient-to-r from-cyan-700/40 to-pink-700/40 text-white text-xs font-mono border border-cyan-700/40 align-middle">
            {gasUsed}
          </span>
        </>}
      </div>
    </div>
  );
}
