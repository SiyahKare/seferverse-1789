import React, { useState, useEffect } from 'react'
import { useGovernance, Proposal } from '../hooks/useGovernance'
import { useAccount } from 'wagmi'
import { 
  Vote, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play, 
  Loader2,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar
} from 'lucide-react'

export default function GovernancePanel() {
  const { isConnected } = useAccount()
  const { 
    proposalCount, 
    isLoadingCount, 
    getProposals, 
    propose, 
    isProposing, 
    castVote, 
    isVoting, 
    execute, 
    isExecuting 
  } = useGovernance()
  
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [isLoadingProposals, setIsLoadingProposals] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    targets: [''],
    values: ['0'],
    calldatas: ['']
  })

  useEffect(() => {
    if (isConnected && proposalCount > 0) {
      loadProposals()
    }
  }, [isConnected, proposalCount])

  const loadProposals = async () => {
    setIsLoadingProposals(true)
    try {
      const proposalsData = await getProposals()
      setProposals(proposalsData)
    } catch (error) {
      console.error('Error loading proposals:', error)
    } finally {
      setIsLoadingProposals(false)
    }
  }

  const handleCreateProposal = () => {
    if (propose && newProposal.title && newProposal.description) {
      // Mock proposal creation
      console.log('Creating proposal:', newProposal)
      setShowCreateForm(false)
      setNewProposal({ title: '', description: '', targets: [''], values: ['0'], calldatas: [''] })
    }
  }

  const handleVote = (proposalId: number, support: number) => {
    if (castVote) {
      castVote({ args: [BigInt(proposalId), support] })
    }
  }

  const handleExecute = (proposalId: number) => {
    if (execute) {
      execute({ args: [BigInt(proposalId)] })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'succeeded': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'defeated': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'executed': return 'text-purple-400 bg-purple-500/20 border-purple-500/30'
      case 'canceled': return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="w-4 h-4" />
      case 'succeeded': return <CheckCircle className="w-4 h-4" />
      case 'defeated': return <XCircle className="w-4 h-4" />
      case 'executed': return <Play className="w-4 h-4" />
      case 'canceled': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  if (!isConnected) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
        <div className="text-center py-8">
          <Vote className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">DAO Governance</h3>
          <p className="text-slate-400">Governance sistemine katılmak için cüzdanınızı bağlayın</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Vote className="w-6 h-6 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">🗳️ DAO Governance</h3>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg px-4 py-2 text-cyan-400 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Yeni Proposal
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-cyan-400">
            {isLoadingCount ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : proposalCount}
          </div>
          <div className="text-slate-400 text-sm">Toplam Proposal</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">
            {proposals.filter(p => p.status === 'active').length}
          </div>
          <div className="text-slate-400 text-sm">Aktif</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {proposals.filter(p => p.status === 'executed').length}
          </div>
          <div className="text-slate-400 text-sm">Uygulanan</div>
        </div>
      </div>

      {/* Create Proposal Form */}
      {showCreateForm && (
        <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
          <h4 className="text-white font-semibold mb-4">Yeni Proposal Oluştur</h4>
          <div className="space-y-4">
            <input
              type="text"
              value={newProposal.title}
              onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Proposal başlığı..."
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <textarea
              value={newProposal.description}
              onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Proposal açıklaması..."
              rows={3}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateProposal}
                disabled={!newProposal.title || !newProposal.description || isProposing}
                className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed border border-cyan-500/30 rounded-lg px-4 py-2 text-cyan-400 transition-colors"
              >
                {isProposing ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Oluşturuluyor...
                  </div>
                ) : (
                  'Proposal Oluştur'
                )}
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Proposals List */}
      <div className="space-y-4">
        {isLoadingProposals ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
            <p className="text-slate-400">Proposallar yükleniyor...</p>
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-8">
            <Vote className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-slate-300 mb-2">Henüz Proposal Yok</h4>
            <p className="text-slate-400">İlk proposal'ı oluşturmak için yukarıdaki butonu kullanın</p>
          </div>
        ) : (
          proposals.map((proposal) => (
            <div key={proposal.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">
                    Proposal #{proposal.id}
                  </h4>
                  <p className="text-slate-300 text-sm mb-2">
                    {proposal.description || 'Proposal açıklaması yok'}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Block {proposal.startBlock} - {proposal.endBlock}
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(proposal.status || 'active')}`}>
                  {getStatusIcon(proposal.status || 'active')}
                  {proposal.status || 'active'}
                </div>
              </div>

              {/* Voting Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-500/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-medium">For</span>
                  </div>
                  <div className="text-white font-bold">
                    {parseFloat(proposal.forVotes).toLocaleString()} votes
                  </div>
                </div>
                <div className="bg-red-500/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingDown className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm font-medium">Against</span>
                  </div>
                  <div className="text-white font-bold">
                    {parseFloat(proposal.againstVotes).toLocaleString()} votes
                  </div>
                </div>
              </div>

              {/* Actions */}
              {proposal.status === 'active' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleVote(proposal.id, 1)}
                    disabled={isVoting}
                    className="flex-1 bg-green-500/20 hover:bg-green-500/30 disabled:opacity-50 border border-green-500/30 rounded-lg px-3 py-2 text-green-400 text-sm transition-colors"
                  >
                    {isVoting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'For'}
                  </button>
                  <button
                    onClick={() => handleVote(proposal.id, 0)}
                    disabled={isVoting}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 border border-red-500/30 rounded-lg px-3 py-2 text-red-400 text-sm transition-colors"
                  >
                    {isVoting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Against'}
                  </button>
                </div>
              )}

              {proposal.status === 'succeeded' && (
                <button
                  onClick={() => handleExecute(proposal.id)}
                  disabled={isExecuting}
                  className="w-full bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 border border-purple-500/30 rounded-lg px-4 py-2 text-purple-400 transition-colors"
                >
                  {isExecuting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uygulanıyor...
                    </div>
                  ) : (
                    'Execute Proposal'
                  )}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

