import React from 'react';
import {
  ShieldCheck,
  Zap,
  Lock,
  Layers,
} from 'lucide-react';

export const AuthBrandPanel: React.FC = () => {
  return (
    <div className="relative flex flex-col justify-between h-full p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-[#26272e] bg-gradient-to-b from-[#16171c] to-[#121316] select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Identity */}
      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-[#6842ed] to-[#8d6eff] flex items-center justify-center text-white shadow-md shadow-purple-600/20">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white font-sans">
            ShopFlow
          </span>
        </div>

        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight mb-3">
          The next generation commerce infrastructure.
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
          Unify global transactions, multi-currency routing, and automated dispute defense through a single programmable API.
        </p>

        {/* Dashboard Mockup Visual Card */}
        <div className="mt-8 rounded-xl bg-[#111216]/90 border border-[#262833] p-4.5 shadow-2xl backdrop-blur-sm relative overflow-hidden group">
          {/* Top Bar of Mockup */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#21232c]">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-300">
                GLOBAL TRANSACTION ORCHESTRATOR
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE</span>
            </div>
          </div>

          {/* Metric Indicators */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-[#181921]/60 border border-[#232530]">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                NET GMV
              </span>
              <div className="text-base font-bold text-white font-mono tabular-nums tracking-tight mt-0.5">
                $2.48M
              </div>
              <div className="text-[10px] text-emerald-400 font-medium font-mono tabular-nums">
                +18.4%
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#181921]/60 border border-[#232530]">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                ORDERS
              </span>
              <div className="text-base font-bold text-white font-mono tabular-nums tracking-tight mt-0.5">
                48,291
              </div>
              <div className="text-[10px] text-emerald-400 font-medium font-mono tabular-nums">
                +12.1%
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#181921]/60 border border-[#232530]">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                LATENCY
              </span>
              <div className="text-base font-bold text-purple-300 font-mono tabular-nums tracking-tight mt-0.5">
                24ms
              </div>
              <div className="text-[10px] text-zinc-400 font-mono tabular-nums">
                p99.9 global
              </div>
            </div>
          </div>

          {/* Simple Vector Area Graph */}
          <div className="relative h-24 w-full pt-1">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 320 80"
              preserveAspectRatio="none"
              aria-label="Transaction volume trend line"
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c5cfc" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#7c5cfc" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>

              {/* Grid guide lines */}
              <line x1="0" y1="20" x2="320" y2="20" stroke="#262835" strokeDasharray="3 3" />
              <line x1="0" y1="50" x2="320" y2="50" stroke="#262835" strokeDasharray="3 3" />

              {/* Shaded Area */}
              <path
                d="M0,65 Q30,55 60,60 T120,40 T180,30 T240,42 T290,18 L320,12 L320,80 L0,80 Z"
                fill="url(#areaGradient)"
              />

              {/* Primary Line */}
              <path
                d="M0,65 Q30,55 60,60 T120,40 T180,30 T240,42 T290,18 L320,12"
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* High Watermark Point */}
              <circle cx="320" cy="12" r="3.5" fill="#c084fc" className="animate-ping" opacity="0.75" />
              <circle cx="320" cy="12" r="3" fill="#ffffff" stroke="#7c5cfc" strokeWidth="2" />
            </svg>
          </div>

          {/* Time axis labels */}
          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono mt-1 pt-1 border-t border-[#1e2028]">
            <span>00:00 UTC</span>
            <span>08:00 UTC</span>
            <span>16:00 UTC</span>
            <span className="text-purple-400 font-semibold">NOW</span>
          </div>

          {/* Mini settlement item */}
          <div className="mt-3 pt-2.5 border-t border-[#21232c] flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2 text-zinc-400 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span className="truncate">Instant Settlement · US-East / EU-West</span>
            </div>
            <span className="font-mono text-emerald-400 font-medium whitespace-nowrap">
              $1,420.00
            </span>
          </div>
        </div>
      </div>

      {/* Feature points */}
      <div className="relative z-10 pt-8 mt-6 border-t border-[#22242b] space-y-3.5">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400 shrink-0 mt-0.5 border border-purple-500/20">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-200">
              99.99% Core API Uptime
            </div>
            <div className="text-[11px] text-zinc-400">
              Guaranteed by enterprise multi-region failover and SLA.
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400 shrink-0 mt-0.5 border border-purple-500/20">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-200">
              End-to-End Enterprise Encryption
            </div>
            <div className="text-[11px] text-zinc-400">
              AES-256 at rest, TLS 1.3 in transit, and PCI-DSS Level 1 certified.
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400 shrink-0 mt-0.5 border border-purple-500/20">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-200">
              Sub-50ms Global Payment Routing
            </div>
            <div className="text-[11px] text-zinc-400">
              Intelligent least-cost routing across direct banking rails in 140+ countries.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
