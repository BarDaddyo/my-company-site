import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Your Company — Full-Stack Software Development',
  description: 'We build full-stack web and mobile applications for UK businesses — fast, competitively priced, and without the agency overhead.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <div className="container">
            <Link href="/" className="logo">dev<span>studio</span></Link>
            <ul>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
        </nav>

        {children}

        <footer>
          <div className="container">
            <p>© {new Date().getFullYear()} DevStudio. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}