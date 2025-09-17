import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction, useAccount } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { useContractAddresses } from './useContractAddresses'

// Contract ABIs
const SEFER_VERSE_DAO_ABI = [
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "string", name: "_name", type: "string" }],
    name: "setName",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const

const BARON_TOKEN_ABI = [
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const

const BARON_NFT_ABI = [
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "quantity", type: "uint256" }
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const

// Contract addresses will be loaded dynamically from deployments.json

export function useSeferVerseDAO() {
  const { addresses } = useContractAddresses()
  
  const { data: daoName, isLoading: isLoadingName } = useContractRead({
    address: addresses.seferVerseDAO as `0x${string}`,
    abi: SEFER_VERSE_DAO_ABI,
    functionName: 'name',
    enabled: !!addresses.seferVerseDAO,
  })

  const { config: setNameConfig } = usePrepareContractWrite({
    address: addresses.seferVerseDAO as `0x${string}`,
    abi: SEFER_VERSE_DAO_ABI,
    functionName: 'setName',
    enabled: !!addresses.seferVerseDAO,
  })

  const { data: setNameData, write: setName } = useContractWrite(setNameConfig)

  const { isLoading: isSettingName, isSuccess: setNameSuccess } = useWaitForTransaction({
    hash: setNameData?.hash,
  })

  return {
    daoName: daoName as string,
    isLoadingName,
    setName,
    isSettingName,
    setNameSuccess
  }
}

export function useBaronToken() {
  const { address } = useAccount()
  const { addresses } = useContractAddresses()
  
  const { data: totalSupply, isLoading: isLoadingSupply } = useContractRead({
    address: addresses.baronToken as `0x${string}`,
    abi: BARON_TOKEN_ABI,
    functionName: 'totalSupply',
    enabled: !!addresses.baronToken,
  })

  const { data: balance, isLoading: isLoadingBalance } = useContractRead({
    address: addresses.baronToken as `0x${string}`,
    abi: BARON_TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!address && !!addresses.baronToken,
  })

  const { config: transferConfig } = usePrepareContractWrite({
    address: addresses.baronToken as `0x${string}`,
    abi: BARON_TOKEN_ABI,
    functionName: 'transfer',
    enabled: false, // Manuel olarak etkinleştirilecek
  })

  const { data: transferData, write: transfer } = useContractWrite(transferConfig)

  const { isLoading: isTransferring, isSuccess: transferSuccess } = useWaitForTransaction({
    hash: transferData?.hash,
  })

  return {
    totalSupply: totalSupply ? formatEther(totalSupply) : '0',
    balance: balance ? formatEther(balance) : '0',
    isLoadingSupply,
    isLoadingBalance,
    transfer,
    isTransferring,
    transferSuccess
  }
}

export function useBaronNFT() {
  const { address } = useAccount()
  const { addresses } = useContractAddresses()
  
  const { data: totalSupply, isLoading: isLoadingSupply } = useContractRead({
    address: addresses.baronNFT as `0x${string}`,
    abi: BARON_NFT_ABI,
    functionName: 'totalSupply',
    enabled: !!addresses.baronNFT,
  })

  const { data: nftBalance, isLoading: isLoadingBalance } = useContractRead({
    address: addresses.baronNFT as `0x${string}`,
    abi: BARON_NFT_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!address && !!addresses.baronNFT,
  })

  const { config: mintConfig } = usePrepareContractWrite({
    address: addresses.baronNFT as `0x${string}`,
    abi: BARON_NFT_ABI,
    functionName: 'mint',
    enabled: false, // Manuel olarak etkinleştirilecek
  })

  const { data: mintData, write: mint } = useContractWrite(mintConfig)

  const { isLoading: isMinting, isSuccess: mintSuccess } = useWaitForTransaction({
    hash: mintData?.hash,
  })

  return {
    totalSupply: totalSupply ? totalSupply.toString() : '0',
    nftBalance: nftBalance ? nftBalance.toString() : '0',
    isLoadingSupply,
    isLoadingBalance,
    mint,
    isMinting,
    mintSuccess
  }
}

// useContractAddresses hook is now in a separate file
