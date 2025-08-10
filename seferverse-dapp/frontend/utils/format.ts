import { format } from "date-fns";

export function formatDate(date: string | null | undefined): string | null {
  if (!date) return null;
  try {
    return format(new Date(date), "dd.MM.yyyy HH:mm");
  } catch {
    return date;
  }
}

export function formatGas(gas: string | null | undefined): string | null {
  if (!gas) return null;
  // örnek: "0.000000494973597184 ETH" → "0.00000049 ETH"
  return gas.replace(/(\d+\.\d{0,8})\d*( ETH)/, "$1$2");
}

export function getExplorerTxUrl(
  network: string | null | undefined,
  txHash: string | null | undefined
): string {
  if (!txHash) return "#";
  const overrideBase = (process.env.NEXT_PUBLIC_EXPLORER_BASE || "").replace(/\/$/, "");
  if (overrideBase) {
    return `${overrideBase}/tx/${txHash}`;
  }
  const n = (network || "").toLowerCase();
  if (n.includes("basesepolia") || n.includes("base-sepolia") || n.includes("sepolia")) {
    return `https://sepolia.basescan.org/tx/${txHash}`;
  }
  if (n.includes("base")) {
    return `https://basescan.org/tx/${txHash}`;
  }
  if (n.includes("sepolia")) {
    return `https://sepolia.etherscan.io/tx/${txHash}`;
  }
  return `https://etherscan.io/tx/${txHash}`;
}

export function getExplorerAddressUrl(
  network: string | null | undefined,
  address: string | null | undefined
): string {
  if (!address) return "#";
  const overrideBase = (process.env.NEXT_PUBLIC_EXPLORER_BASE || "").replace(/\/$/, "");
  if (overrideBase) {
    return `${overrideBase}/address/${address}`;
  }
  const n = (network || "").toLowerCase();
  if (n.includes("basesepolia") || n.includes("base-sepolia") || n.includes("sepolia")) {
    return `https://sepolia.basescan.org/address/${address}`;
  }
  if (n.includes("base")) {
    return `https://basescan.org/address/${address}`;
  }
  if (n.includes("sepolia")) {
    return `https://sepolia.etherscan.io/address/${address}`;
  }
  return `https://etherscan.io/address/${address}`;
}
