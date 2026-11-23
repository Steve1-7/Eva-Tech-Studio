export const blogPosts = [
  {
    slug: 'website-or-web-app',
    category: 'Product basics',
    title: 'Website or web app: what does your project need?',
    excerpt: 'A practical way to tell whether you need a public website, a logged-in product, or a bit of both.',
    sections: [
      {
        heading: 'Start with the task',
        paragraphs: [
          'A website explains something and helps a visitor take an action. A web app helps someone do a task: manage an account, submit work, review records, or coordinate a process.',
          'The boundary is not always sharp. A business can have a public website and a separate application behind sign-in. What matters is understanding who will use each part and what they need to do.',
        ],
      },
      {
        heading: 'Signs a website is enough',
        paragraphs: [
          'If most visitors need to learn about your service, compare options, and contact you, a well-structured website may be the right starting point. You may still need a CMS, booking form, or payment integration, but that does not automatically make the project a software product.',
        ],
      },
      {
        heading: 'Signs you need an application',
        paragraphs: [
          'If people sign in, save information, collaborate, track activity, or use different permissions, you are probably describing an application. Plan for data, security, error handling, and ongoing support as part of the project—not as extras after the interface is built.',
        ],
      },
      {
        heading: 'Choose the smallest useful first release',
        paragraphs: [
          'Write down the user, the task, and the result you expect. Then list the minimum steps needed to complete that task. A clear first release is easier to estimate, test, and improve than a long feature wishlist.',
        ],
      },
    ],
  },
  {
    slug: 'what-a-project-estimate-includes',
    category: 'Project planning',
    title: 'What should a software project estimate include?',
    excerpt: 'A useful estimate explains the work, assumptions, and unknowns—not just a number at the bottom of a page.',
    sections: [
      {
        heading: 'Scope and deliverables',
        paragraphs: [
          'The estimate should describe what is being built and what is not. Name the key screens, integrations, user roles, and handover items. If two people could read the scope and imagine very different products, it needs more detail.',
        ],
      },
      {
        heading: 'Assumptions and dependencies',
        paragraphs: [
          'List what the estimate relies on: access to an existing system, content supplied by your team, an approved design, or a third-party service. These dependencies help everyone see where time or price could change.',
        ],
      },
      {
        heading: 'Milestones and review points',
        paragraphs: [
          'A project plan should show when you can review progress and make decisions. Breaking work into milestones gives you earlier feedback and avoids discovering a mismatch only at the end.',
        ],
      },
      {
        heading: 'Ownership and support',
        paragraphs: [
          'Ask who owns the source code, hosting, domains, and service accounts. Also ask what happens after launch: what support is included, what is optional, and how urgent issues are handled.',
        ],
      },
    ],
  },
  {
    slug: 'automation-without-the-mess',
    category: 'Automation',
    title: 'Automate a workflow without creating a bigger mess',
    excerpt: 'Good automation handles the normal path and makes exceptions visible, recoverable, and safe.',
    sections: [
      {
        heading: 'Map the current process first',
        paragraphs: [
          'Write down what starts the process, what information moves, who makes decisions, and where work gets stuck. Automating an unclear process can make mistakes happen faster without removing their cause.',
        ],
      },
      {
        heading: 'Plan for exceptions',
        paragraphs: [
          'Real data is incomplete. Services go offline. People change their minds. Decide what should happen when a required field is missing, an API call fails, or an approval is delayed.',
        ],
      },
      {
        heading: 'Keep sensitive actions reviewable',
        paragraphs: [
          'For payments, customer messages, account changes, or other consequential actions, use explicit approvals and useful logs. Make it possible for a person to pause, correct, or reverse a workflow when appropriate.',
        ],
      },
      {
        heading: 'Measure the work saved',
        paragraphs: [
          'Choose a simple measure before launch: time spent, hand-offs, errors, or completion time. Review it after release and keep the automation only if it improves the actual process.',
        ],
      },
    ],
  },
] as const
