'use client'

const services = [
  {
    n: '01', icon: '📱', title: 'Social Media Marketing',
    desc: 'Platform-native content strategies that grow your audience, build community, and turn passive scrollers into active buyers.',
    features: ['Full social media management (4 platforms)', 'Content creation, shooting & editing', 'Community management & engagement', 'Monthly analytics & optimisation', 'Influencer partnership sourcing', 'Social commerce setup'],
    stat: '8.4×', statLabel: 'avg engagement increase',
  },
  {
    n: '02', icon: '🎯', title: 'Paid Ads Management',
    desc: 'Data-driven paid media across Google, Meta, and beyond — engineered for maximum ROAS. We find your ideal customers and bring them to you, profitably.',
    features: ['Google Ads (Search, Display, Performance Max)', 'Meta Ads (Facebook & Instagram)', 'Full funnel: awareness → retargeting → conversion', 'Creative testing (copy, visuals, formats)', 'Pixel setup & attribution modelling', 'Weekly optimisation & reporting'],
    stat: '5.1×', statLabel: 'average ROAS delivered',
  },
  {
    n: '03', icon: '🎨', title: 'Branding & Content',
    desc: 'Visual identities and messaging frameworks that command premium positioning and resonate deeply with your target audience.',
    features: ['Brand identity design', 'Brand voice & messaging framework', 'Content strategy & editorial calendars', 'Copywriting: web, ads, email & campaigns', 'Photography & videography direction', 'Competitor positioning analysis'],
    stat: '3.2×', statLabel: 'brand recognition increase',
  },
  {
    n: '04', icon: '💻', title: 'Website Development',
    desc: 'Conversion-obsessed websites on modern stacks — lightning-fast, beautifully designed, and architected to rank on Google.',
    features: ['Next.js, React & headless architecture', 'Custom UI/UX design (mobile-first)', 'CMS integration (Sanity, Contentful)', 'Core Web Vitals & performance optimisation', 'Conversion rate optimisation (CRO)', 'Ongoing maintenance & improvements'],
    stat: '94%', statLabel: 'Core Web Vitals score avg',
  },
  {
    n: '05', icon: '🛒', title: 'E-commerce Development',
    desc: 'Stores built to maximise AOV, reduce abandonment, and deliver exceptional shopping experiences that bring customers back.',
    features: ['Shopify & Shopify Plus builds', 'WooCommerce custom development', 'Payment gateway integration', 'Abandoned cart & email automation', 'Product page CRO', 'Analytics & revenue attribution'],
    stat: '41%', statLabel: 'avg cart abandonment reduction',
  },
  {
    n: '06', icon: '🔍', title: 'SEO Optimisation',
    desc: 'Sustainable, compounding organic growth that keeps working 24/7 — without relying entirely on paid spend.',
    features: ['Technical SEO audit & implementation', 'Keyword research & content roadmap', 'On-page & schema optimisation', 'Link building & domain authority', 'Local SEO & Google Business Profile', 'Monthly rank tracking & reporting'],
    stat: '340%', statLabel: 'avg organic traffic growth',
  },
  {
    n: '07', icon: '⚙️', title: 'Automation & CRM',
    desc: 'Replace manual effort with intelligent automation. Systems that nurture leads, close sales, and manage relationships — on autopilot.',
    features: ['CRM setup (HubSpot, Salesforce, GoHighLevel)', 'Lead nurture email & SMS sequences', 'Zapier / Make workflow automation', 'Booking & appointment funnel setup', 'Customer onboarding automation', 'Sales pipeline & reporting dashboards'],
    stat: '22hrs', statLabel: 'saved per week on average',
  },
]

export default function StickySplitServices() {
  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-[60px] py-[60px]">
      <div className="flex flex-col gap-8">
        {services.map((sv) => (
          <div key={sv.n} className="grid lg:grid-cols-2 gap-6 items-stretch">
            {/* ── Left: Service Overview ── */}
            <div
              className="rounded-[28px] p-10 flex flex-col justify-between"
              style={{
                background: 'var(--obsidian-4)',
                border: '1px solid rgba(201,169,110,0.18)',
                boxShadow: '0 0 80px rgba(201,169,110,0.05), inset 0 1px 0 rgba(201,169,110,0.06)',
              }}
            >
              <div>
                <div
                  className="w-14 h-14 rounded-[16px] flex items-center justify-center text-[1.9rem] mb-6"
                  style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.15)' }}
                >
                  {sv.icon}
                </div>
                <div className="font-syne text-[0.68rem] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: '#C9A96E' }}>
                  Service {sv.n}
                </div>
                <h3 className="font-cormorant text-[2rem] font-semibold mb-4" style={{ color: '#E8E3D8' }}>
                  {sv.title}
                </h3>
                <p className="text-[0.87rem] leading-[1.78]" style={{ color: '#6B6860' }}>
                  {sv.desc}
                </p>
              </div>
              <div className="pt-6 mt-6" style={{ borderTop: '1px solid rgba(201,169,110,0.1)' }}>
                <div className="font-cormorant text-[3.2rem] font-bold leading-none text-shimmer">{sv.stat}</div>
                <div className="text-[0.75rem] mt-1.5" style={{ color: '#6B6860' }}>{sv.statLabel}</div>
              </div>
            </div>

            {/* ── Right: Features ── */}
            <div
              className="rounded-[20px] p-8"
              style={{
                background: 'var(--obsidian-3)',
                border: '1px solid rgba(232,227,216,0.05)',
              }}
            >
              <h4 className="font-syne text-[0.7rem] font-bold uppercase tracking-[0.12em] mb-5" style={{ color: '#6B6860' }}>
                What's Included
              </h4>
              <ul className="flex flex-col gap-3">
                {sv.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-[0.84rem]" style={{ color: '#B8B2A8' }}>
                    <span className="font-bold text-[0.75rem] shrink-0 mt-0.5" style={{ color: '#C9A96E' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
