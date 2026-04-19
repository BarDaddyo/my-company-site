export const metadata = {
  title: 'Contact — DevStudio',
  description: 'Get in touch with DevStudio. We respond to all enquiries within one business day.',
}

const details = [
  { icon: '📧', label: 'Email', value: 'hello@devstudio.co.uk' },
  { icon: '📞', label: 'Phone', value: '+44 (0)20 0000 0000' },
  { icon: '📍', label: 'Based in', value: 'London, United Kingdom' },
  { icon: '🕐', label: 'Response time', value: 'Within one business day' },
]

export default function Contact() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <h1>Get in touch</h1>
          <p>Tell us what you're working on. We'll come back to you within one business day.</p>
        </div>
      </section>

      <section className="page-content">
        <div className="container">
          <div className="about-grid">
            <div>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--navy)', marginBottom: '8px' }}>Send us a message</h2>
              <p style={{ color: 'var(--muted)', marginBottom: '32px', lineHeight: '1.7' }}>
                Fill in the form and one of our team will be in touch shortly. No sales scripts — just a straightforward conversation.
              </p>

              <form className="contact-form" action="#" method="POST">
                <div className="form-group">
                  <label htmlFor="name">Full name</label>
                  <input type="text" id="name" name="name" placeholder="Jane Smith" required />
                </div>
                <div className="form-group">
                  <label htmlFor="company">Company</label>
                  <input type="text" id="company" name="company" placeholder="Acme Ltd" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Work email</label>
                  <input type="email" id="email" name="email" placeholder="jane@acme.co.uk" required />
                </div>
                <div className="form-group">
                  <label htmlFor="budget">Approximate budget</label>
                  <input type="text" id="budget" name="budget" placeholder="e.g. £10k–£25k, or TBD" />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Tell us about your project</label>
                  <textarea id="message" name="message" placeholder="What are you building? What's the timeline? What does success look like?" required></textarea>
                </div>
                <button type="submit" className="btn-primary" style={{ border: 'none', cursor: 'pointer' }}>
                  Send message
                </button>
                <p className="form-note">We respond to all enquiries within one business day. Your details will never be shared with third parties.</p>
              </form>
            </div>

            <div>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--navy)', marginBottom: '8px' }}>Contact details</h2>
              <p style={{ color: 'var(--muted)', marginBottom: '32px', lineHeight: '1.7' }}>
                Prefer to reach out directly? You can find us here.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '48px' }}>
                {details.map((detail) => (
                  <div key={detail.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <span style={{ fontSize: '1.4rem', flexShrink: 0, marginTop: '2px' }}>{detail.icon}</span>
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{detail.label}</p>
                      <p style={{ color: 'var(--navy)', fontWeight: '500' }}>{detail.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'var(--offwhite)', borderRadius: '10px', padding: '28px' }}>
                <h3 style={{ color: 'var(--navy)', fontSize: '1.1rem', marginBottom: '10px' }}>Working hours</h3>
                <p style={{ color: 'var(--muted)', lineHeight: '1.7', marginBottom: '8px' }}>Monday – Friday: 9:00am – 6:00pm GMT</p>
                <p style={{ color: 'var(--muted)', lineHeight: '1.7' }}>For existing clients on a support retainer, emergency contact details are provided separately.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
