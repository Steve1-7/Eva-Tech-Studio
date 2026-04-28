'use client'
import { useState } from 'react'
import Link from 'next/link'
import SectionLabel from './SectionLabel'
import ScrollReveal from './ScrollReveal'
import CountUp from './CountUp'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'reports', label: 'Reports' },
]

const CAMPAIGNS = [
  { name: 'Google Search - Brand', status: 'active', budget: 8000, spent: 5200, roas: 2.8, clicks: 1800, conversions: 42 },
  { name: 'Meta - Prospecting', status: 'active', budget: 5000, spent: 4100, roas: 2.4, clicks: 1200, conversions: 28 },
  { name: 'LinkedIn - B2B', status: 'paused', budget: 3000, spent: 2100, roas: 3.1, clicks: 480, conversions: 12 },
]

const RECENT_ACTIVITY = [
  { time: '2m ago', action: 'Campaign budget increased by 15%', user: 'Sarah M.', type: 'budget' },
  { time: '15m ago', action: 'New creative uploaded to Meta campaign', user: 'James K.', type: 'creative' },
  { time: '1h ago', action: 'Weekly report generated', user: 'System', type: 'report' },
  { time: '3h ago', action: 'A/B test winner selected', user: 'AI Optimizer', type: 'test' },
]

export default function ClientPortalPreview() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <section className="py-[100px] px-6 md:px-[60px]" style={{ background: 'var(--obsidian)' }}>
      <div className="max-w-[1200px] mx-auto">
        <ScrollReveal>
          <div className="text-center max-w-[620px] mx-auto mb-14">
            <SectionLabel center>Client Portal</SectionLabel>
            <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-semibold mt-2 mb-4" style={{ color: '#E8E3D8' }}>
              Your Growth Command Center
            </h2>
            <p className="font-light leading-[1.75]" style={{ color: '#6B6860' }}>
              Real-time access to your campaign performance, analytics, and reports — all in one place.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          {/* Portal Mockup */}
          <div 
            className="rounded-[24px] overflow-hidden"
            style={{ 
              background: 'var(--obsidian-3)', 
              border: '1px solid rgba(232,227,216,0.1)',
              boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,169,110,0.05)',
            }}
          >
            {/* Portal Header */}
            <div 
              className="px-6 py-4 flex items-center justify-between"
              style={{ background: 'var(--obsidian-4)', borderBottom: '1px solid rgba(232,227,216,0.05)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(201,169,110,0.1)' }}>
                  <span className="text-lg">🥧</span>
                </div>
                <div>
                  <div className="font-semibold text-[0.9rem]" style={{ color: '#E8E3D8' }}>DripGather</div>
                  <div className="text-[0.65rem]" style={{ color: '#4A7A64' }}>● Live Dashboard</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {['SK', 'JM', 'AL'].map((initials, i) => (
                    <div 
                      key={i}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[0.7rem] font-bold border-2"
                      style={{ 
                        background: 'var(--obsidian-3)', 
                        borderColor: 'var(--obsidian-4)',
                        color: '#C9A96E',
                      }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Portal Tabs */}
            <div 
              className="px-6 py-3 flex items-center gap-1"
              style={{ background: 'var(--obsidian-3)', borderBottom: '1px solid rgba(232,227,216,0.05)' }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-[0.8rem] font-medium transition-all ${
                    activeTab === tab.id 
                      ? 'text-[#07080F]' 
                      : 'hover:bg-[rgba(232,227,216,0.05)]'
                  }`}
                  style={{ 
                    background: activeTab === tab.id ? '#C9A96E' : 'transparent',
                    color: activeTab === tab.id ? undefined : '#6B6860',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Portal Content */}
            <div className="p-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Monthly Revenue', value: 85000, prefix: 'R', suffix: '', format: true, trend: '+34%' },
                  { label: 'Total ROAS', value: 2.8, prefix: '', suffix: '×', format: false, trend: '+0.6×' },
                  { label: 'Conversions', value: 82, prefix: '', suffix: '', format: false, trend: '+45%' },
                  { label: 'Ad Spend', value: 11300, prefix: 'R', suffix: '', format: true, trend: '75% of budget' },
                ].map((kpi, i) => (
                  <div 
                    key={i}
                    className="p-4 rounded-[16px]"
                    style={{ background: 'var(--obsidian-4)' }}
                  >
                    <div className="text-[0.68rem] mb-1" style={{ color: '#6B6860' }}>{kpi.label}</div>
                    <div className="font-cormorant text-[1.6rem] font-bold text-shimmer" style={{ color: '#E8E3D8' }}>
                      {kpi.prefix}{kpi.format ? <CountUp end={kpi.value / 1000} decimals={0} /> : kpi.value}{kpi.format ? 'K' : ''}{kpi.suffix}
                    </div>
                    <div className="text-[0.65rem] mt-1" style={{ color: '#4A7A64' }}>{kpi.trend}</div>
                  </div>
                ))}
              </div>

              {/* Campaigns Table */}
              <div className="mb-6">
                <h4 className="text-[0.8rem] font-bold uppercase tracking-wider mb-3" style={{ color: '#6B6860' }}>
                  Active Campaigns
                </h4>
                <div className="rounded-[16px] overflow-hidden" style={{ background: 'var(--obsidian-4)' }}>
                  <div className="grid grid-cols-6 gap-4 p-3 text-[0.7rem] font-medium" style={{ color: '#6B6860', background: 'rgba(0,0,0,0.2)' }}>
                    <div className="col-span-2">Campaign</div>
                    <div>Status</div>
                    <div>Budget</div>
                    <div>ROAS</div>
                    <div>Conv.</div>
                  </div>
                  {CAMPAIGNS.map((campaign, i) => (
                    <div 
                      key={i}
                      className="grid grid-cols-6 gap-4 p-3 text-[0.75rem] border-t"
                      style={{ borderColor: 'rgba(232,227,216,0.03)' }}
                    >
                      <div className="col-span-2" style={{ color: '#E8E3D8' }}>{campaign.name}</div>
                      <div>
                        <span className={`px-2 py-0.5 rounded-full text-[0.65rem] font-medium ${
                          campaign.status === 'active' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                      <div style={{ color: '#B8B2A8' }}>R{(campaign.spent / 1000).toFixed(1)}K / R{(campaign.budget / 1000).toFixed(0)}K</div>
                      <div className="font-bold" style={{ color: '#C9A96E' }}>{campaign.roas}×</div>
                      <div style={{ color: '#B8B2A8' }}>{campaign.conversions}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Recent Activity */}
                <div 
                  className="p-4 rounded-[16px]"
                  style={{ background: 'var(--obsidian-4)' }}
                >
                  <h4 className="text-[0.8rem] font-bold uppercase tracking-wider mb-3" style={{ color: '#6B6860' }}>
                    Recent Activity
                  </h4>
                  <div className="space-y-3">
                    {RECENT_ACTIVITY.map((activity, i) => (
                      <div key={i} className="flex items-start gap-3 text-[0.75rem]">
                        <span style={{ color: '#3A3830' }}>{activity.time}</span>
                        <span style={{ color: '#B8B2A8' }}>{activity.action}</span>
                        <span className="ml-auto text-[0.65rem]" style={{ color: '#4A7A64' }}>{activity.user}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div 
                  className="p-4 rounded-[16px]"
                  style={{ background: 'var(--obsidian-4)' }}
                >
                  <h4 className="text-[0.8rem] font-bold uppercase tracking-wider mb-3" style={{ color: '#6B6860' }}>
                    Quick Actions
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Download Report', href: '/contact' },
                      { label: 'Schedule Call', href: '/contact' },
                      { label: 'Request Changes', href: '/contact' },
                      { label: 'View Invoices', href: '/contact' },
                    ].map((action, i) => (
                      <Link
                        key={i}
                        href={action.href}
                        className="px-3 py-2 rounded-lg text-[0.75rem] font-medium transition-all hover:bg-[rgba(201,169,110,0.1)] block text-center"
                        style={{ 
                          background: 'var(--obsidian-3)', 
                          color: '#B8B2A8',
                          border: '1px solid rgba(232,227,216,0.05)',
                        }}
                      >
                        {action.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Portal Footer */}
            <div 
              className="px-6 py-4 flex items-center justify-between"
              style={{ background: 'var(--obsidian-4)', borderTop: '1px solid rgba(232,227,216,0.05)' }}
            >
              <span className="text-[0.7rem]" style={{ color: '#3A3830' }}>
                Last synced: Just now
              </span>
              <Link 
                href="/contact"
                className="px-4 py-2 rounded-lg text-[0.75rem] font-medium text-[#07080F] inline-flex items-center gap-1"
                style={{ background: '#C9A96E' }}
              >
                Access Full Portal →
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
