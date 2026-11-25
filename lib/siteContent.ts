export const services = [
  {
    number: '01',
    title: 'Website Development',
    description: 'Fast, accessible marketing and e-commerce websites built around your content, customers, and goals.',
    href: '/services/website-development',
    tag: 'Websites',
  },
  {
    number: '02',
    title: 'Web App Development',
    description: 'Secure browser-based products, portals, and dashboards that make complex work easier.',
    href: '/services/web-applications',
    tag: 'Web apps',
  },
  {
    number: '03',
    title: 'Mobile and App Development',
    description: 'Mobile-first experiences and cross-platform apps designed for real people and real use.',
    href: '/services/mobile-app-development',
    tag: 'Mobile',
  },
  {
    number: '04',
    title: 'Custom Software',
    description: 'Purpose-built internal tools and software that fit the way your business actually operates.',
    href: '/services/custom-software',
    tag: 'Software',
  },
  {
    number: '05',
    title: 'AI Chatbots',
    description: 'Useful chat experiences connected to your approved content, support, and workflows.',
    href: '/services/ai-chatbots',
    tag: 'AI',
  },
  {
    number: '06',
    title: 'Trading Bots',
    description: 'Trading-system engineering, simulation, and integrations—with risk controls and clear limits.',
    href: '/services/trading-bots',
    tag: 'Trading',
  },
  {
    number: '07',
    title: 'Automation and Integrations',
    description: 'Connect the tools you use and remove repetitive hand-offs with reliable, observable workflows.',
    href: '/services/automation',
    tag: 'Automation',
  },
] as const

export const faqs = [
  {
    question: 'What happens in a free project scoping session?',
    answer: 'We review your goals, constraints, and current setup, then send a clear technical assessment and suggested next steps within 48 hours. There is no obligation to hire us.',
  },
  {
    question: 'Who will work on my project?',
    answer: 'You work directly with experienced people responsible for the technical decisions and delivery. We keep the team small and introduce everyone involved before work begins.',
  },
  {
    question: 'Do I own the code and accounts?',
    answer: 'Yes. Your project is built in accounts you control, and the agreed deliverables, source code, and documentation are handed over to you when the work is complete and paid for.',
  },
  {
    question: 'How do you estimate a project?',
    answer: 'We first clarify scope, risks, and dependencies. You receive a written proposal with deliverables, assumptions, milestones, and price before development starts.',
  },
  {
    question: 'Can you work with our existing product or team?',
    answer: 'Yes. We can take on a defined feature, review an existing codebase, integrate with your team, or plan a staged rebuild when replacing everything would be unnecessary.',
  },
  {
    question: 'Do trading bots guarantee a return?',
    answer: 'No. We can build and test software, but markets are uncertain and no bot can guarantee profit. Any trading system needs independent risk review and should be tested in simulation before live use.',
  },
  {
    question: 'What does ongoing support include?',
    answer: 'Support can cover monitoring, dependency and security updates, bug fixes, small improvements, and advice. The scope and response expectations are agreed in writing; there is no automatic lock-in.',
  },
]

export const projects = [
  {
    slug: 'awsp',
    name: 'AWSP',
    type: 'Website',
    description: 'Live website for AWSP, available at www.awsp.co.za.',
    href: '/work/awsp',
    liveUrl: 'https://www.awsp.co.za/',
    tech: 'Website · Responsive · Live',
  },
  {
    slug: 'promptlyos',
    name: 'PromptlyOS',
    type: 'AI-powered SaaS',
    description: 'Career-tracking product with role-specific dashboards, account features, analytics, and AI-assisted insights.',
    href: '/work/promptlyos',
    liveUrl: 'https://promptlyos-seven.vercel.app/',
    tech: 'Next.js · TypeScript · AI integration',
  },
  {
    slug: 'drip-gather',
    name: 'Drip-Gather',
    type: 'E-commerce',
    description: 'Online shopping experience with product discovery, recommendations, checkout, and a tailored storefront.',
    href: '/work/drip-gather',
    liveUrl: 'https://drip-gather.vercel.app/',
    tech: 'Next.js · Stripe · product discovery',
  },
  {
    slug: 'cleansmith',
    name: 'CleanSmith',
    type: 'Service business',
    description: 'Mobile detailing website with service packages, a visual gallery, and WhatsApp-connected booking.',
    href: '/work/cleansmith',
    liveUrl: 'https://cleansmith.co.za/',
    tech: 'Next.js · booking · WhatsApp',
  },
  {
    slug: 'gold-coast-mining-review',
    name: 'Gold Coast Mining Review',
    type: 'Publishing platform',
    description: 'Mining publication platform with editorial workflows, magazine downloads, advertising placements, and search foundations.',
    href: '/work/gold-coast-mining-review',
    liveUrl: 'https://www.goldcoastminingreview.com',
    tech: 'Next.js · Supabase · publishing',
  },
  {
    slug: 'bagmaa',
    name: 'Bagmaa',
    type: 'Customer web app',
    description: 'Mobile-friendly app combining orders, ticket purchases, service bookings, customer accounts, and admin operations.',
    href: '/work/bagmaa',
    liveUrl: 'https://bagmaa.vercel.app/',
    tech: 'Web app · Supabase · PWA',
  },
] as const

export const techStack = [
  'Next.js', 'React', 'Node.js', 'Python', 'Flutter', 'React Native',
  'OpenAI API', 'Claude API', 'PostgreSQL', 'Supabase', 'Vercel', 'AWS',
  'MetaTrader APIs', 'Binance APIs',
] as const
