import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>Software that ships.<br />Teams that deliver.</h1>
          <p className="subtitle">We build full-stack web and mobile applications for UK businesses — fast, competitively priced, and without the agency overhead.</p>
          <Link href="/contact" className="btn-primary">Start a conversation</Link>
        </div>
      </section>

      <section className="why-us">
        <div className="container">
          <h2>Why teams choose us</h2>
          <div className="cards">
            <div className="card">
              <span className="icon">⚡</span>
              <h3>Fast turnaround</h3>
              <p>We move quickly without cutting corners. Most projects kick off within days, not months.</p>
            </div>
            <div className="card">
              <span className="icon">💷</span>
              <h3>Competitive pricing</h3>
              <p>Senior-level development at rates that make sense for growing UK businesses.</p>
            </div>
            <div className="card">
              <span className="icon">🛠️</span>
              <h3>Full-stack capability</h3>
              <p>From front-end interfaces to back-end APIs and cloud infrastructure — we cover the full picture.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Got a project in mind?</h2>
          <p>Tell us what you're building and we'll come back to you within one business day.</p>
          <Link href="/contact" className="btn-primary">Get in touch</Link>
        </div>
      </section>
    </main>
  )
}