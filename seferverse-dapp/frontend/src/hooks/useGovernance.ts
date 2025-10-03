import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction, useAccount } from 'wagmi'
import { useContractAddresses } from './useContractAddresses'

// Governor ABI - temel fonksiyonlar
const GOVERNOR_ABI = [
  {
    inputs: [],
    name: "proposalCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "proposalId", type: "uint256" }],
    name: "proposals",
    outputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "address", name: "proposer", type: "address" },
      { internalType: "uint256", name: "startBlock", type: "uint256" },
      { internalType: "uint256", name: "endBlock", type: "uint256" },
      { internalType: "uint256", name: "forVotes", type: "uint256" },
      { internalType: "uint256", name: "againstVotes", type: "uint256" },
      { internalType: "bool", name: "executed", type: "bool" },
      { internalType: "bool", name: "canceled", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address[]", name: "targets", type: "address[]" },
      { internalType: "uint256[]", name: "values", type: "uint256[]" },
      { internalType: "bytes[]", name: "calldatas", type: "bytes[]" },
      { internalType: "string", name: "description", type: "string" }
    ],
    name: "propose",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "proposalId", type: "uint256" },
      { internalType: "uint8", name: "support", type: "uint8" }
    ],
    name: "castVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "proposalId", type: "uint256" }],
    name: "execute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "proposalId", type: "uint256" }],
    name: "cancel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const

export interface Proposal {
  id: number
  proposer: string
  startBlock: number
  endBlock: number
  forVotes: string
  againstVotes: string
  executed: boolean
  canceled: boolean
  description?: string
  status?: 'active' | 'succeeded' | 'defeated' | 'executed' | 'canceled'
}

export function useGovernance() {
  const { address } = useAccount()
  const { addresses } = useContractAddresses()

  // Proposal count
  const { data: proposalCount, isLoading: isLoadingCount } = useContractRead({
    address: addresses.seferGovernor as `0x${string}`,
    abi: GOVERNOR_ABI,
    functionName: 'proposalCount',
    enabled: !!addresses.seferGovernor,
  })

  // Get all proposals
  const getProposals = async (): Promise<Proposal[]> => {
    if (!proposalCount || !addresses.seferGovernor) return []
    
    const proposals: Proposal[] = []
    const count = Number(proposalCount)
    
    for (let i = 1; i <= count; i++) {
      try {
        // Bu kısım gerçek uygulamada contract call ile yapılacak
        // Şimdilik mock data kullanıyoruz
        proposals.push({
          id: i,
          proposer: '0x1234567890123456789012345678901234567890',
          startBlock: 1000000 + i * 1000,
          endBlock: 1000000 + i * 1000 + 10000,
          forVotes: (Math.random() * 1000000).toString(),
          againstVotes: (Math.random() * 100000).toString(),
          executed: i % 3 === 0,
          canceled: i % 5 === 0,
          description: `Proposal ${i}: Update DAO parameters`,
          status: i % 3 === 0 ? 'executed' : i % 5 === 0 ? 'canceled' : 'active'
        })
      } catch (error) {
        console.error(`Error fetching proposal ${i}:`, error)
      }
    }
    
    return proposals
  }

  // Create proposal
  const { config: proposeConfig } = usePrepareContractWrite({
    address: addresses.seferGovernor as `0x${string}`,
    abi: GOVERNOR_ABI,
    functionName: 'propose',
    enabled: false, // Manuel olarak etkinleştirilecek
  })

  const { data: proposeData, write: propose } = useContractWrite(proposeConfig)

  const { isLoading: isProposing, isSuccess: proposeSuccess } = useWaitForTransaction({
    hash: proposeData?.hash,
  })

  // Cast vote
  const { config: voteConfig } = usePrepareContractWrite({
    address: addresses.seferGovernor as `0x${string}`,
    abi: GOVERNOR_ABI,
    functionName: 'castVote',
    enabled: false, // Manuel olarak etkinleştirilecek
  })

  const { data: voteData, write: castVote } = useContractWrite(voteConfig)

  const { isLoading: isVoting, isSuccess: voteSuccess } = useWaitForTransaction({
    hash: voteData?.hash,
  })

  // Execute proposal
  const { config: executeConfig } = usePrepareContractWrite({
    address: addresses.seferGovernor as `0x${string}`,
    abi: GOVERNOR_ABI,
    functionName: 'execute',
    enabled: false, // Manuel olarak etkinleştirilecek
  })

  const { data: executeData, write: execute } = useContractWrite(executeConfig)

  const { isLoading: isExecuting, isSuccess: executeSuccess } = useWaitForTransaction({
    hash: executeData?.hash,
  })

  return {
    proposalCount: proposalCount ? Number(proposalCount) : 0,
    isLoadingCount,
    getProposals,
    propose,
    isProposing,
    proposeSuccess,
    castVote,
    isVoting,
    voteSuccess,
    execute,
    isExecuting,
    executeSuccess
  }
}

