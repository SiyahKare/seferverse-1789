import { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import { fetchDeployments, Deployment, hashDeployments, connectDeploymentsSSE } from "../lib/api";
import { formatDate, formatGas } from "../utils/format";
import WalletConnect from "../components/WalletConnect";

interface HomeProps {
  deployments: Deployment[];
}

export default function Home({ deployments }: HomeProps) {
  const [loading, setLoading] = useState(false);
  const [hash, setHash] = useState<string>(hashDeployments(deployments));
  const [items, setItems] = useState<Deployment[]>(deployments);
  const [online, setOnline] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [stats, setStats] = useState({
    totalContracts: deployments.length,
    networks: new Set(deployments.map(d => d.network)).size,
    lastUpdated: '' // Will be set client-side only
  });

  useEffect(() => {
    setIsMounted(true);
    
    // Set lastUpdated client-side only to avoid hydration mismatch
    setStats(prev => ({ ...prev, lastUpdated: new Date().toISOString() }));
    
    // Scroll Progress & Back to Top
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setShowBackToTop(window.scrollY > 500);
    };
    
    // Keyboard Shortcuts
    const handleKeyboard = (e: KeyboardEvent) => {
      // ESC - Close mobile menu
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
      
      // Ctrl/Cmd + K - Search (placeholder)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Search functionality placeholder
      }
      
      // Arrow Up - Scroll to top
      if (e.altKey && e.key === 'ArrowUp') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      // Arrow Down - Scroll to bottom
      if (e.altKey && e.key === 'ArrowDown') {
        e.preventDefault();
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyboard);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyboard);
    };
  }, [mobileMenuOpen]);

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
      setStats({
        totalContracts: list.length,
        networks: new Set(list.map(d => d.network)).size,
        lastUpdated: new Date().toISOString()
      });
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
    es.onerror = () => {
      setOnline(false);
    };
    return () => es.close();
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden scanlines">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-30" />
      
      {/* Animated Neon Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-black to-magenta-500/5" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-magenta-500/10 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 w-full h-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-yellow-500/5 via-transparent to-transparent -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-black/50">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 via-magenta-500 to-yellow-500 transition-all duration-150"
          style={{
            width: `${scrollProgress}%`,
            boxShadow: '0 0 20px var(--neon-cyan), 0 0 40px var(--neon-magenta)'
          }}
        />
      </div>

      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b-2 border-cyan-500/50" style={{boxShadow: '0 2px 30px rgba(0,255,255,0.3)'}}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-cyan-500 rotate-45 flex items-center justify-center" style={{boxShadow: '0 0 20px var(--neon-cyan)'}}>
                <span className="text-xl sm:text-2xl -rotate-45">⚡</span>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black font-mono tracking-wider">
                  <span className="neon-text-cyan">SEFERVERSE</span>
                </h2>
                <p className="text-[10px] sm:text-xs text-magenta-400 font-mono font-bold" style={{textShadow: '0 0 5px var(--neon-magenta)'}}>
                  [[_1789_REVOLUTION_]]
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <a href="#deployments" className="text-sm font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors relative group">
                <span>&gt; CONTRACTS</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300" style={{boxShadow: '0 0 10px var(--neon-cyan)'}} />
              </a>
              <a href="#features" className="text-sm font-mono font-bold text-magenta-400 hover:text-magenta-300 transition-colors relative group">
                <span>&gt; FEATURES</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-magenta-500 group-hover:w-full transition-all duration-300" style={{boxShadow: '0 0 10px var(--neon-magenta)'}} />
              </a>
              <a href="#dao" className="text-sm font-mono font-bold text-yellow-400 hover:text-yellow-300 transition-colors relative group">
                <span>&gt; DAO</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-500 group-hover:w-full transition-all duration-300" style={{boxShadow: '0 0 10px var(--neon-yellow)'}} />
              </a>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* System Status Indicator */}
              <div className="hidden lg:flex items-center gap-2 border border-green-500/50 px-3 py-1.5 rounded" style={{boxShadow: '0 0 10px rgba(0,255,65,0.3)'}}>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{boxShadow: '0 0 10px var(--neon-green)'}} />
                <span className="text-xs font-mono text-green-400 font-bold">LIVE</span>
              </div>
              
              {/* Wallet Connect */}
              <div className="hidden md:block scale-90 sm:scale-100">
                <WalletConnect />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 border-2 border-cyan-500 rounded bg-black/50 hover:bg-cyan-500/10 transition-all"
                style={{boxShadow: '0 0 15px rgba(0,255,255,0.3)'}}
                aria-label="Toggle menu"
              >
                <span className={`w-6 h-0.5 bg-cyan-400 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} style={{boxShadow: '0 0 10px var(--neon-cyan)'}} />
                <span className={`w-6 h-0.5 bg-magenta-400 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} style={{boxShadow: '0 0 10px var(--neon-magenta)'}} />
                <span className={`w-6 h-0.5 bg-cyan-400 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{boxShadow: '0 0 10px var(--neon-cyan)'}} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 py-6 space-y-4 border-t-2 border-cyan-500/30 bg-black/80 backdrop-blur-xl">
            <a 
              href="#deployments" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-cyan-400 hover:text-cyan-300 font-mono font-bold text-sm py-2 px-4 border-l-2 border-cyan-500 hover:bg-cyan-500/10 transition-all"
              style={{textShadow: '0 0 10px var(--neon-cyan)'}}
            >
              &gt; CONTRACTS
            </a>
            <a 
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-magenta-400 hover:text-magenta-300 font-mono font-bold text-sm py-2 px-4 border-l-2 border-magenta-500 hover:bg-magenta-500/10 transition-all"
              style={{textShadow: '0 0 10px var(--neon-magenta)'}}
            >
              &gt; FEATURES
            </a>
            <a 
              href="#dao"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-yellow-400 hover:text-yellow-300 font-mono font-bold text-sm py-2 px-4 border-l-2 border-yellow-500 hover:bg-yellow-500/10 transition-all"
              style={{textShadow: '0 0 10px var(--neon-yellow)'}}
            >
              &gt; DAO
            </a>
            <div className="pt-4">
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Redesigned */}
      <div className="relative z-10">
        <div className="px-4 py-12 sm:px-6 sm:py-16 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-7xl">
            {/* Main Hero Content */}
            <div className="text-center mb-12 sm:mb-16">
              {/* Animated Title with Corner Brackets */}
              <div className="relative inline-block mb-6 sm:mb-8">
                {/* Corner Decorations */}
                <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-500 opacity-80" style={{boxShadow: '0 0 10px var(--neon-cyan)'}} />
                <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-magenta-500 opacity-80" style={{boxShadow: '0 0 10px var(--neon-magenta)'}} />
                <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-yellow-500 opacity-80" style={{boxShadow: '0 0 10px var(--neon-yellow)'}} />
                <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-cyan-500 opacity-80" style={{boxShadow: '0 0 10px var(--neon-cyan)'}} />
                
                {/* Main Title with Glitch Effect */}
                <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black tracking-tight mb-3 sm:mb-4 relative px-8 py-4">
                  <span className="neon-text-cyan inline-block font-mono uppercase tracking-wider relative z-10 glitch" data-text="SEFERVERSE">
                    SEFERVERSE
                  </span>
                </h1>
                
                {/* Version Number */}
                <div className="text-xl sm:text-2xl lg:text-4xl font-bold relative">
                  <span className="neon-text-magenta font-mono">[[ 1789_REVOLUTION ]]</span>
                </div>
              </div>

              {/* Tagline */}
              <div className="max-w-3xl mx-auto mb-8 sm:mb-10">
                <div className="relative bg-black/60 backdrop-blur-sm border-2 border-cyan-500/50 rounded-lg p-4 sm:p-6" style={{boxShadow: '0 0 30px rgba(0,255,255,0.2), inset 0 0 30px rgba(0,255,255,0.05)'}}>
                  {/* Terminal Prompt Style */}
                  <div className="text-left font-mono text-xs sm:text-sm mb-3 text-green-400" style={{textShadow: '0 0 10px var(--neon-green)'}}>
                    <span className="text-green-500">&gt;</span> root@seferverse:~$ cat revolution.txt
                  </div>
                  
                  {/* Main Description */}
                  <p className="text-base sm:text-lg lg:text-xl font-bold leading-relaxed mb-3 font-mono text-left">
                    <span className="text-cyan-400" style={{textShadow: '0 0 10px var(--neon-cyan)'}}>Baron Devrimi:</span>
                    <span className="text-white/90 mx-2">Rugcılardan</span>
                    <span className="text-magenta-400" style={{textShadow: '0 0 10px var(--neon-magenta)'}}>Tahsilat</span>
                    <span className="text-white/90">,</span>
                    <br className="sm:hidden" />
                    <span className="text-yellow-400 mx-2" style={{textShadow: '0 0 10px var(--neon-yellow)'}}>Refund</span>
                    <span className="text-white/90">ve</span>
                    <span className="neon-text-green mx-2">Kültürel Adalet!</span>
                  </p>
                  
                  {/* Tech Stack Badges */}
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border-2 border-cyan-500 rounded font-mono font-bold bg-cyan-500/10" style={{boxShadow: '0 0 10px rgba(0,255,255,0.3)'}}>
                      <span className="text-cyan-400">◆</span> WEB3
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border-2 border-magenta-500 rounded font-mono font-bold bg-magenta-500/10" style={{boxShadow: '0 0 10px rgba(255,0,255,0.3)'}}>
                      <span className="text-magenta-400">◆</span> NFT
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border-2 border-yellow-500 rounded font-mono font-bold bg-yellow-500/10" style={{boxShadow: '0 0 10px rgba(255,255,0,0.3)'}}>
                      <span className="text-yellow-400">◆</span> TOKEN
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs border-2 border-green-500 rounded font-mono font-bold bg-green-500/10" style={{boxShadow: '0 0 10px rgba(0,255,65,0.3)'}}>
                      <span className="text-green-400">◆</span> DAO
                    </span>
                  </div>
                  
                  {/* Terminal Cursor */}
                  <div className="text-left font-mono text-xs sm:text-sm mt-3 text-cyan-400">
                    <span className="text-cyan-500">&gt;</span> <span className="animate-pulse">█</span>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                {/* Primary CTA - Connect Wallet */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-magenta-500 to-yellow-500 rounded-lg blur-md group-hover:blur-lg transition-all duration-300 opacity-75" />
                  <button className="relative bg-black border-2 border-cyan-500 text-cyan-400 font-bold py-4 px-8 rounded font-mono uppercase text-sm sm:text-base hover:border-magenta-500 hover:text-magenta-400 transition-all duration-300" style={{boxShadow: '0 0 20px var(--neon-cyan), inset 0 0 20px rgba(0,255,255,0.1)'}}>
                    <span className="flex items-center gap-2">
                      <span>⚡</span>
                      <span>LAUNCH_DAPP</span>
                    </span>
                  </button>
                </div>

                {/* Secondary CTA */}
                <button className="bg-black/50 border-2 border-magenta-500/50 text-magenta-400 font-bold py-4 px-8 rounded font-mono uppercase text-sm sm:text-base hover:border-magenta-500 hover:bg-magenta-500/10 transition-all duration-300" style={{boxShadow: '0 0 15px rgba(255,0,255,0.2)'}}>
                  <span className="flex items-center gap-2">
                    <span>📖</span>
                    <span>READ_DOCS</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Floating Geometric Elements */}
            <div className="fixed top-24 left-10 w-16 h-16 border-2 border-cyan-500 rotate-45 pointer-events-none opacity-30 hover:opacity-60 transition-opacity" style={{boxShadow: '0 0 20px var(--neon-cyan)', animation: 'float 6s ease-in-out infinite'}} />
            <div className="fixed top-32 right-20 w-12 h-12 border-2 border-magenta-500 rounded-full pointer-events-none opacity-30 hover:opacity-60 transition-opacity" style={{boxShadow: '0 0 20px var(--neon-magenta)', animation: 'float 8s ease-in-out infinite', animationDelay: '1s'}} />
            <div className="fixed bottom-32 left-20 w-20 h-20 border-2 border-yellow-500 pointer-events-none opacity-30 hover:opacity-60 transition-opacity" style={{boxShadow: '0 0 20px var(--neon-yellow)', clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)', animation: 'float 7s ease-in-out infinite', animationDelay: '2s'}} />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-4 sm:px-6 lg:px-12 -mt-8 sm:-mt-16 relative z-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
            {/* Contract Stats */}
            <div className="group relative animate-slide-up">
              <div className="absolute inset-0 bg-cyan-500/10 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-black/80 backdrop-blur-xl rounded-lg border-2 border-cyan-500 p-8 text-center hover:bg-black/90 transition-all duration-300 hover:scale-105" style={{boxShadow: '0 0 20px var(--neon-cyan), inset 0 0 20px rgba(0,255,255,0.1)'}}>
                <div className="w-16 h-16 border-2 border-cyan-400 rounded-lg flex items-center justify-center mx-auto mb-4 rotate-45" style={{boxShadow: '0 0 15px var(--neon-cyan)'}}>
                  <span className="text-2xl -rotate-45">📄</span>
                </div>
                <div className="text-4xl font-black neon-text-cyan mb-2 font-mono">{stats.totalContracts}</div>
                <div className="text-cyan-300 font-bold font-mono text-sm">TOPLAM_KONTRAT</div>
                <div className="text-xs text-cyan-400/60 mt-2 font-mono">&gt; Deploy edilen akıllı kontratlar</div>
              </div>
            </div>

            {/* Network Stats */}
            <div className="group relative animate-slide-up delay-100">
              <div className="absolute inset-0 bg-magenta-500/10 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-black/80 backdrop-blur-xl rounded-lg border-2 border-magenta-500 p-8 text-center hover:bg-black/90 transition-all duration-300 hover:scale-105" style={{boxShadow: '0 0 20px var(--neon-magenta), inset 0 0 20px rgba(255,0,255,0.1)'}}>
                <div className="w-16 h-16 border-2 border-magenta-400 rounded-full flex items-center justify-center mx-auto mb-4" style={{boxShadow: '0 0 15px var(--neon-magenta)'}}>
                  <span className="text-2xl">🌐</span>
                </div>
                <div className="text-4xl font-black neon-text-magenta mb-2 font-mono">{stats.networks}</div>
                <div className="text-magenta-300 font-bold font-mono text-sm">AĞ_SAYISI</div>
                <div className="text-xs text-magenta-400/60 mt-2 font-mono">&gt; Desteklenen blockchain ağları</div>
              </div>
            </div>

            {/* Connection Status */}
            <div className="group relative animate-slide-up delay-200">
              <div className="absolute inset-0 bg-yellow-500/10 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-black/80 backdrop-blur-xl rounded-lg border-2 border-yellow-500 p-8 text-center hover:bg-black/90 transition-all duration-300 hover:scale-105" style={{boxShadow: '0 0 20px var(--neon-yellow), inset 0 0 20px rgba(255,255,0,0.1)'}}>
                <div className="w-16 h-16 border-2 border-yellow-400 flex items-center justify-center mx-auto mb-4" style={{boxShadow: '0 0 15px var(--neon-yellow)', clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)'}}>
                  <span className="text-2xl">⚡</span>
                </div>
                <div className="mb-2">
                  <span className="inline-flex items-center gap-2 px-4 py-2 text-sm border-2 border-green-500 rounded font-mono font-bold" style={{boxShadow: '0 0 10px var(--neon-green)'}}>
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{boxShadow: '0 0 10px var(--neon-green)'}}></div>
                    <span className="neon-text-green">ONLINE</span>
                  </span>
                </div>
                <div className="text-yellow-300 font-bold font-mono text-sm">BAĞLANTI_DURUMU</div>
                <div className="text-xs text-yellow-400/60 mt-2 font-mono">&gt; Real-time veri akışı aktif</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="scroll-mt-20 px-4 sm:px-6 lg:px-12 pb-12 sm:pb-16 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 font-mono">
              <span className="neon-text-magenta">
                [[ ÖZELLİKLER_v2.077 ]]
              </span>
            </h2>
            <p className="text-magenta-300/80 max-w-2xl mx-auto font-mono text-sm">
              <span className="text-cyan-400">&gt;</span> SeferVerse 1789'un güçlü Web3 özelliklerini keşfedin
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {/* NFT Minting */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎵</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">NFT Minting</h3>
                <p className="text-slate-300 text-sm mb-4">Baron Trilogy Audio NFT'lerini mint edin</p>
                <div className="text-xs text-slate-400 bg-slate-800/50 rounded-lg px-3 py-1">Yakında Aktif</div>
              </div>
            </div>

            {/* NFT Gallery */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🖼️</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">NFT Gallery</h3>
                <p className="text-slate-300 text-sm mb-4">Koleksiyonunuzu görüntüleyin</p>
                <div className="text-xs text-slate-400 bg-slate-800/50 rounded-lg px-3 py-1">Yakında Aktif</div>
              </div>
            </div>

            {/* DAO Governance */}
            <div id="dao" className="scroll-mt-20 group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🗳️</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">DAO Governance</h3>
                <p className="text-slate-300 text-sm mb-4">Topluluk yönetimine katılın</p>
                <div className="text-xs text-slate-400 bg-slate-800/50 rounded-lg px-3 py-1">Yakında Aktif</div>
              </div>
            </div>

            {/* Analytics */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-6 text-center hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Analytics</h3>
                <p className="text-slate-300 text-sm mb-4">Detaylı istatistikler</p>
                <div className="text-xs text-slate-400 bg-slate-800/50 rounded-lg px-3 py-1">Yakında Aktif</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deployments Section */}
      <div id="deployments" className="scroll-mt-20 px-4 sm:px-6 lg:px-12 pb-12 sm:pb-16 lg:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 font-mono">
              <span className="neon-text-cyan">
                [[ DEPLOYMENTS_TERMINAL ]]
              </span>
            </h2>
            <p className="text-cyan-300/80 max-w-2xl mx-auto mb-6 font-mono text-sm">
              <span className="text-magenta-400">&gt;</span> Deploy edilen akıllı kontratlarınızı görüntüleyin ve yönetin
            </p>
            <div className="inline-flex items-center gap-2 border-2 border-green-500 px-4 py-2 text-sm font-mono font-bold" style={{boxShadow: '0 0 15px var(--neon-green)'}}>
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{boxShadow: '0 0 10px var(--neon-green)'}}></div>
              <span className="neon-text-green">LIVE_STREAM_ACTIVE</span>
            </div>
          </div>
          
          <div className="rounded-lg bg-black/80 backdrop-blur-xl border-2 border-cyan-500/50 p-4 sm:p-6 lg:p-8" style={{boxShadow: '0 0 30px rgba(0,255,255,0.2), inset 0 0 30px rgba(0,255,255,0.05)'}}>
            {items.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {items.map((d, i) => (
                  <div key={`${d.address ?? ''}-${d.txHash ?? ''}-${i}`} className="group relative">
                    {/* Card Glow Effect */}
                    <div className="absolute inset-0 bg-cyan-500/10 rounded-lg blur-lg group-hover:blur-xl transition-all duration-300" />
                    
                    {/* Card Content */}
                    <div className="relative bg-black/90 backdrop-blur-xl rounded-lg border-2 border-cyan-500 p-4 sm:p-6 hover:bg-black/95 transition-all duration-300 hover:scale-105 hover:border-magenta-500" style={{boxShadow: '0 0 15px var(--neon-cyan), inset 0 0 15px rgba(0,255,255,0.1)'}}>
                      {/* Contract Icon */}
                      <div className="w-12 h-12 border-2 border-cyan-400 rounded flex items-center justify-center mb-4 rotate-45" style={{boxShadow: '0 0 10px var(--neon-cyan)'}}>
                        <span className="text-xl -rotate-45">📄</span>
                      </div>
                      
                      {/* Contract Name */}
                      <h3 className="text-xl font-black mb-3 font-mono uppercase" style={{color: '#00ffff', textShadow: '0 0 10px var(--neon-cyan)'}}>
                        {d.name}
                      </h3>
                      
                      {/* Network Badge */}
                      <div className="mb-4">
                        <span className="inline-flex items-center gap-2 border-2 border-magenta-500 px-3 py-1 text-xs font-mono font-bold" style={{boxShadow: '0 0 10px var(--neon-magenta)'}}>
                          <div className="w-2 h-2 rounded-full bg-magenta-400 animate-pulse"></div>
                          <span className="text-magenta-300">{d.network?.toUpperCase() || 'UNKNOWN'}</span>
                        </span>
                      </div>
                      
                      {/* Contract Details */}
                      <div className="space-y-3">
                        {/* Address */}
                        <div>
                          <div className="text-xs text-cyan-400/70 font-mono font-bold mb-1">&gt; CONTRACT_ADDRESS:</div>
                          <div className="text-xs text-cyan-300 font-mono bg-black/50 border border-cyan-500/30 rounded p-2 break-all" style={{boxShadow: 'inset 0 0 10px rgba(0,255,255,0.1)'}}>
                            {d.address || 'N/A'}
                          </div>
                        </div>
                        
                        {/* Transaction Hash */}
                        {d.txHash && (
                          <div>
                            <div className="text-xs text-magenta-400/70 font-mono font-bold mb-1">&gt; TX_HASH:</div>
                            <div className="text-xs text-magenta-300 font-mono bg-black/50 border border-magenta-500/30 rounded p-2 break-all" style={{boxShadow: 'inset 0 0 10px rgba(255,0,255,0.1)'}}>
                              {d.txHash.slice(0, 10)}...{d.txHash.slice(-8)}
                            </div>
                          </div>
                        )}
                        
                        {/* Gas Used & Date */}
                        <div className="flex justify-between items-center pt-2 border-t-2 border-cyan-500/30" style={{boxShadow: '0 1px 0 rgba(0,255,255,0.1)'}}>
                          {d.gasUsed && (
                            <div>
                              <div className="text-xs text-yellow-400/70 font-mono font-bold">GAS_USED</div>
                              <div className="text-xs text-yellow-300 font-mono font-semibold">{d.gasUsed}</div>
                            </div>
                          )}
                          {d.date && (
                            <div className="text-right">
                              <div className="text-xs text-green-400/70 font-mono font-bold">DEPLOYED</div>
                              <div className="text-xs text-green-300 font-mono font-semibold">{formatDate(d.date)}</div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Hover Effect */}
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{boxShadow: '0 0 30px var(--neon-magenta)'}} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="relative">
                  <div className="text-8xl mb-6 animate-bounce">🚀</div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-slate-300 mb-4">Henüz Deploy Edilmemiş</h3>
                <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
                  İlk kontratınızı deploy etmek için blockchain klasörüne gidin ve 
                  <span className="text-cyan-300 font-medium"> npx hardhat deploy</span> komutunu çalıştırın
                </p>
                <div className="mt-6">
                  <div className="inline-flex items-center gap-2 bg-slate-800/50 rounded-lg px-4 py-2 text-sm text-slate-300 font-mono">
                    <span className="text-green-400">$</span>
                    npx hardhat deploy --network baseSepolia
                  </div>
                </div>
              </div>
            )}
            
            {/* Data Signature */}
            <div className="mt-8 pt-6 border-t-2 border-cyan-500/30" style={{boxShadow: '0 1px 0 rgba(0,255,255,0.1)'}}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="text-sm text-cyan-400 font-mono font-bold">
                  <span>&gt; DATA_SIGNATURE:</span>
                </div>
                <div className="text-xs text-cyan-300 font-mono bg-black/50 border border-cyan-500/30 rounded px-3 py-1 break-all" style={{boxShadow: 'inset 0 0 10px rgba(0,255,255,0.1)'}}>
                  {hash}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="i-svg-spinners:90-ring-with-bg w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
            <div className="text-white text-center">Yükleniyor...</div>
          </div>
        </div>
      )}

      {/* Connection Status */}
      {!online && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:right-6 sm:bottom-6 bg-amber-500/90 backdrop-blur-sm rounded-xl px-4 py-3 text-white shadow-lg z-50">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <div className="w-2 h-2 bg-amber-200 rounded-full animate-pulse flex-shrink-0" />
            <span>Canlı bağlantı kesildi, yeniden bağlanılıyor...</span>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-black border-2 border-cyan-500 rounded-lg hover:border-magenta-500 transition-all duration-300 group hover:scale-110"
          style={{boxShadow: '0 0 30px var(--neon-cyan), inset 0 0 20px rgba(0,255,255,0.1)'}}
          aria-label="Back to top"
        >
          <svg 
            className="w-6 h-6 text-cyan-400 group-hover:text-magenta-400 transition-colors" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{filter: 'drop-shadow(0 0 10px var(--neon-cyan))'}}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full animate-pulse" style={{boxShadow: '0 0 10px var(--neon-cyan)'}} />
        </button>
      )}

      {/* PWA Install Button */}
      {/* <PWAInstall /> */}

      {/* Cyberpunk Footer */}
      <footer className="relative z-10 px-4 sm:px-6 lg:px-12 py-8 sm:py-12 border-t-2 border-cyan-500/50" style={{boxShadow: '0 -2px 20px rgba(0,255,255,0.2)'}}>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-black font-mono mb-3">
                <span className="neon-text-cyan">[[ SEFERVERSE_1789 ]]</span>
              </h3>
              <p className="text-cyan-300/80 text-sm leading-relaxed font-mono">
                <span className="text-magenta-400">&gt;</span> Baron Devrimi
                <br />
                <span className="text-yellow-400">&gt;</span> Web3 üzerinde kültürel adalet
              </p>
            </div>
            
            {/* Links */}
            <div>
              <h4 className="text-cyan-400 font-bold font-mono mb-3" style={{textShadow: '0 0 10px var(--neon-cyan)'}}>QUICK_LINKS</h4>
              <ul className="space-y-2 text-sm font-mono">
                     <li><a href="#" className="text-cyan-300/70 hover:text-cyan-300 transition-colors hover:translate-x-1 inline-block">&gt; Dokümantasyon</a></li>
                <li><a href="#" className="text-magenta-300/70 hover:text-magenta-300 transition-colors hover:translate-x-1 inline-block">&gt; NFT Koleksiyonu</a></li>
                <li><a href="#" className="text-yellow-300/70 hover:text-yellow-300 transition-colors hover:translate-x-1 inline-block">&gt; DAO Governance</a></li>
                <li><a href="#" className="text-green-300/70 hover:text-green-300 transition-colors hover:translate-x-1 inline-block">&gt; Analytics</a></li>
              </ul>
            </div>
            
            {/* Status */}
            <div>
              <h4 className="text-magenta-400 font-bold font-mono mb-3" style={{textShadow: '0 0 10px var(--neon-magenta)'}}>SYSTEM_STATUS</h4>
              <div className="space-y-2 font-mono">
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${online ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} style={{boxShadow: online ? '0 0 10px var(--neon-green)' : '0 0 10px red'}}></div>
                  <span className="text-cyan-300/80">BACKEND: <span className={online ? 'text-green-400' : 'text-red-400'}>{online ? 'ONLINE' : 'OFFLINE'}</span></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{boxShadow: '0 0 10px var(--neon-green)'}}></div>
                  <span className="text-cyan-300/80">FRONTEND: <span className="text-green-400">ONLINE</span></span>
                </div>
                {isMounted && stats.lastUpdated && (
                  <div className="text-xs text-yellow-400/70 mt-3">
                    &gt; LAST_UPDATE: {new Date(stats.lastUpdated).toLocaleTimeString('tr-TR')}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="pt-6 border-t-2 border-magenta-500/30 flex flex-col sm:flex-row justify-between items-center gap-4" style={{boxShadow: '0 1px 0 rgba(255,0,255,0.1)'}}>
            <div className="text-cyan-300/70 text-sm font-mono">
              © 2025 <span className="text-cyan-400">SEFERVERSE_1789</span> // ALL_RIGHTS_RESERVED
            </div>
            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 transition-colors border-2 border-cyan-500/50 p-2 hover:border-cyan-500 rounded" style={{boxShadow: '0 0 10px rgba(0,255,255,0.3)'}}>
                <span className="text-lg">🐙</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-magenta-400 hover:text-magenta-300 transition-colors border-2 border-magenta-500/50 p-2 hover:border-magenta-500 rounded" style={{boxShadow: '0 0 10px rgba(255,0,255,0.3)'}}>
                <span className="text-lg">🐦</span>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 transition-colors border-2 border-yellow-500/50 p-2 hover:border-yellow-500 rounded" style={{boxShadow: '0 0 10px rgba(255,255,0,0.3)'}}>
                <span className="text-lg">💬</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
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


