import Link from 'next/link'

export const metadata = {
  title: 'About — DevStudio',
  description: 'A lean, senior-led software development team built for UK businesses that need quality work done fast.',
}

const values = [
  {
    icon: '🎯',
    title: 'Outcome-focused',
    description: 'We measure success by business results, not lines of code or hours billed. If it doesn\'t move the needle, we\'ll tell you.',
  },
  {
    icon: '🤝',
    title: 'Transparent by default',
    description: 'No jargon, no hidden costs, no surprises. You\'ll always know where things stand — progress, blockers, and trade-offs included.',
  },
  {
    icon: '🏗️',
    title: 'Built to last',
    description: 'We write code as if we\'ll be maintaining it in five years, because often we are. No quick fixes that become tomorrow\'s technical debt.',
  },
]

export default function About() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <h1>About DevStudio</h1>
          <p>A lean, senior-led team that builds software for UK businesses — without the overhead or hand-holding of a traditional agency.</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="about-grid">
            <div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--navy)', marginBottom: '20px' }}>Who we are</h2>
              <p style={{ color: 'var(--muted)', lineHeight: '1.8', marginBottom: '20px' }}>
                DevStudio is a specialist software development consultancy based in the UK. We work with startups, scale-ups, and established businesses that need serious engineering capability without committing to a full in-house team.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: '1.8', marginBottom: '20px' }}>
                Our team is small by design. Every project is led by a senior engineer — not handed off to a junior once the contract is signed. That means faster ramp-up, fewer miscommunications, and software that actually reflects what you asked for.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
                We've shipped products across fintech, e-commerce, SaaS, and the public sector. Whether you need a full build from scratch or specialist hands on an existing codebase, we fit in quickly and get to work.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--navy)', marginBottom: '20px' }}>How we work</h2>
              <p style={{ color: 'var(--muted)', lineHeight: '1.8', marginBottom: '20px' }}>
                We keep things simple. A short discovery call, a clear proposal, and a fixed or time-and-materials engagement — whichever suits your project. No bloated retainers, no unnecessary process.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: '1.8', marginBottom: '20px' }}>
                We embed into your workflow: your Slack, your Jira, your Git repos. Weekly check-ins, clear milestones, and a direct line to the engineer doing the work.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: '1.8' }}>
                Most of our work comes from repeat clients and referrals. We'd rather earn long-term trust than win a one-off contract.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="why-us" style={{ padding: '80px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.8rem', color: 'var(--navy)', marginBottom: '48px' }}>What we stand for</h2>
          <div className="cards">
            {values.map((value) => (
              <div key={value.title} className="card">
                <span className="icon">{value.icon}</span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Let's work together</h2>
          <p>We're always open to the right project. Get in touch and let's see if we're a fit.</p>
          <Link href="/contact" className="btn-primary">Start a conversation</Link>
        </div>
      </section>
    </main>
  )
}
