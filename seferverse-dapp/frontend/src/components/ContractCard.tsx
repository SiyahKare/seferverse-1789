import { useState } from "react";
import { getExplorerTxUrl, getExplorerAddressUrl } from "../utils/format";
import { Copy, ExternalLink } from "lucide-react";

interface ContractCardProps {
  name: string;
  date?: string | null;
  address: string | null;
  txHash: string | null;
  gasUsed?: string | null;
}

export default function ContractCard({
  name,
  date,
  address,
  txHash,
  gasUsed,
}: ContractCardProps) {
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
        relative w-full sm:w-[22rem] p-4 rounded-2xl shadow-xl
        bg-white/5 border border-white/10
        backdrop-blur
        font-mono text-sm text-white
        transition-transform hover:scale-105
        overflow-hidden
        before:(content-[''] absolute inset-0 rounded-2xl pointer-events-none border-2 border-transparent bg-gradient-to-tr from-[#7f5cff80] via-[#00c3ff80] to-[#ff00cc80] opacity-60 blur-[2px] z-0 animate-pulse)
        after:(content-[''] absolute top-0 left-0 w-full h-1/3 rounded-t-2xl bg-white/10 opacity-20 pointer-events-none)
      "
      style={{
        boxShadow:
          "0 4px 32px 0 #00c3ff33, 0 1.5px 0 0 #7f5cff44, 0 0 0 1.5px #ff00cc44",
      }}
    >
      <div className="relative z-10 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold tracking-wide text-cyan-200">
            {name}
          </span>
          {date && (
            <span className="text-xs text-pink-200 font-mono">{date}</span>
          )}
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Address</div>
          <div className="flex items-center gap-2">
            <span className="break-all text-blue-200">{address}</span>
            <button
              className="hover:text-cyan-400 transition"
              title="Copy address"
              onClick={() => handleCopy(address, "address")}
            >
              <Copy size={16} />
            </button>
            <a
              href={getExplorerAddressUrl(undefined, address)}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-cyan-400 hover:text-cyan-200 flex items-center gap-1"
              title="View address on Explorer"
            >
              <ExternalLink size={16} />
            </a>
            {copied === "address" && (
              <span className="text-xs text-green-400 ml-1">Copied!</span>
            )}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-1">Tx Hash</div>
          <div className="flex items-center gap-2">
            <span className="break-all text-pink-200">{txHash}</span>
            <button
              className="hover:text-cyan-400 transition"
              title="Copy txHash"
              onClick={() => handleCopy(txHash, "txHash")}
            >
              <Copy size={16} />
            </button>
            <a
              href={getExplorerTxUrl(undefined, txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-cyan-400 hover:text-cyan-200 flex items-center gap-1"
              title="View on Explorer"
            >
              <ExternalLink size={16} />
            </a>
            {copied === "txHash" && (
              <span className="text-xs text-green-400 ml-1">Copied!</span>
            )}
          </div>
        </div>
        {gasUsed && (
          <div className="text-xs text-gray-400">
            Gas Used: <span className="text-white">{gasUsed}</span>
          </div>
        )}
      </div>
    </div>
  );
}
