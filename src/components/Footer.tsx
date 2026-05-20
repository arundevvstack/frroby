import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/assets/images/logo.webp" alt="Fr. Roby CMI Logo" width="200" height="17" />
            <p>
              Official website of Dr. Fr. Roby Kannanchira CMI — dedicated to promoting interfaith
              harmony, cultural preservation, and social empowerment across the globe.
            </p>
            <p className="footer-tagline">✦ Building Bridges Through Faith, Culture &amp; Service</p>
          </div>
          <div className="footer-col">
            <h5>Navigation</h5>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Fr. Roby</Link></li>
              <li><Link href="/associations">Associations</Link></li>
              <li><Link href="/initiatives">Initiatives</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Initiatives</h5>
            <ul>
              <li><Link href="/initiatives">Chavara Cultural Centre</Link></li>
              <li><Link href="/initiatives">UN NGO Representation</Link></li>
              <li><Link href="/initiatives">Interfaith Dialogues</Link></li>
              <li><Link href="/initiatives">Peace Education</Link></li>
              <li><Link href="/initiatives">Cultural Programmes</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Contact</h5>
            <ul>
              <li><a href="mailto:robykannan@gmail.com">robykannan@gmail.com</a></li>
              <li><a href="tel:+919447824575">+91 94478 24575</a></li>
              <li><Link href="/contact">Chavara Cultural Centre, Delhi</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Dr. Fr. Roby Kannanchira CMI. All Rights Reserved. |{' '}
            <Link href="/privacy">Privacy Policy</Link> | <Link href="/terms">Terms of Use</Link>
          </p>
          <p>Designed with ✦ for Peace &amp; Harmony</p>
        </div>
      </div>
    </footer>
  );
}
