import axios from "axios";

export interface Deployment {
  name: string;
  address: string | null;
  txHash: string | null;
  gasUsed?: string | null;
  date?: string | null;
  network?: string | null;
}

export async function fetchDeployments(): Promise<Deployment[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const res = await axios.get(`${baseUrl}/deployments`);
  const deployments: Deployment[] = [];
  for (const [network, contracts] of Object.entries(res.data)) {
    for (const [name, d] of Object.entries(contracts as Record<string, any>)) {
      deployments.push({
        name,
        address: d.address ?? null,
        txHash: d.txHash ?? d.transactionHash ?? null,
        gasUsed: d.gasUsed ?? null,
        date: d.date ?? null,
        network,
      });
    }
  }
  return deployments;
}

export function hashDeployments(list: Deployment[]): string {
  return list
    .map((d) => `${d.network}|${d.name}|${d.address}|${d.txHash}|${d.date}|${d.gasUsed}`)
    .join("::");
}

type StreamEvent =
  | { type: 'full'; hash: string | null; deployments: any }
  | { type: 'added' | 'updated' | 'removed' | 'noop'; hash?: string | null; network?: string; name?: string; data?: any }
  | { type: 'error'; error: string };

export function connectDeploymentsSSE(onData: (event: StreamEvent) => void): EventSource {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const token = process.env.NEXT_PUBLIC_STREAM_TOKEN;
  const url = new URL(`${baseUrl}/deployments/stream`);
  if (token) url.searchParams.set('token', token);
  const es = new EventSource(url.toString());
  es.onmessage = (ev) => {
    try {
      const event = JSON.parse(ev.data) as StreamEvent;
      onData(event);
    } catch {}
  };
  es.onerror = () => {
    // EventSource otomatik yeniden bağlanır; UI tarafında gerekirse indicator eklenebilir
  };
  return es;
}
