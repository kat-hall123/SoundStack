import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'SoundStack — Anonymous Music Forum',
  description: 'Talk about music. No accounts, no logins, just sound.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <header className="site-header">
          <div className="site-header__inner">
            <Link href="/" className="logo">
              <span className="logo__dot" />
              <span className="logo__text">SoundStack</span>
            </Link>
            <nav className="nav">
              <Link href="/" className="nav__link">Feed</Link>
              <Link href="/search" className="nav__link">Search</Link>
            </nav>
          </div>
        </header>
        <main className="page">{children}</main>
        <footer className="site-footer">
          <p>Built for CMSC335 · Anonymous music forum · Spotify-powered</p>
        </footer>
      </body>
    </html>
  );
}
