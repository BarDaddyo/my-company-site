import Link from 'next/link'

export const metadata = {
  title: 'Services — DevStudio',
  description: 'Full-stack web development, mobile apps, cloud infrastructure, and ongoing support for UK businesses.',
}

const services = [
  {
    icon: '🌐',
    title: 'Web Application Development',
    description: 'Custom web apps built on modern stacks — React, Next.js, Node.js, and more. From MVPs to enterprise platforms, we deliver clean, scalable code that your team can maintain.',
  },
  {
    icon: '📱',
    title: 'Mobile App Development',
    description: 'Cross-platform iOS and Android apps using React Native. One codebase, two stores, without sacrificing the native feel your users expect.',
  },
  {
    icon: '⚙️',
    title: 'API & Backend Engineering',
    description: 'Robust REST and GraphQL APIs, microservices, database design, and integrations with third-party platforms. We build the plumbing that keeps your product running.',
  },
  {
    icon: '☁️',
    title: 'Cloud Infrastructure',
    description: 'AWS, GCP, and Azure deployments — CI/CD pipelines, containerisation, auto-scaling, and cost optimisation. We set you up for reliability from day one.',
  },
  {
    icon: '🔍',
    title: 'Technical Discovery & Architecture',
    description: "Not sure where to start? We'll map out your requirements, recommend the right tech stack, and produce a detailed technical specification before a line of code is written.",
  },
  {
    icon: '🛡️',
    title: 'Ongoing Support & Maintenance',
    description: 'Retainer-based support packages that keep your product healthy — security patches, performance monitoring, feature iterations, and rapid incident response.',
  },
]

export default function Services() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <h1>What we build</h1>
          <p>End-to-end software development services for UK businesses — from initial idea to production and beyond.</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.title} className="service-card">
                <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '14px' }}>{service.icon}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to get started?</h2>
          <p>Tell us about your project and we'll respond within one business day.</p>
          <Link href="/contact" className="btn-primary">Talk to us</Link>
        </div>
      </section>
    </main>
  )
}
