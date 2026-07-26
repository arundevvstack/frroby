'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsDropdownOpen(false);
    document.body.style.overflow = '';
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="nav-inner">
        <Link href="/" className="nav-logo" onClick={closeMenu}>
          <img src="/assets/images/logo.webp" alt="Fr. Roby CMI Logo" />
        </Link>

        <ul className={`nav-links ${isOpen ? 'open' : ''}`} id="navLinks">
          <li>
            <Link href="/" className={isActive('/') ? 'active' : ''} onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li className={`nav-dropdown ${isDropdownOpen ? 'open' : ''}`}>
            <Link
              href="/about"
              className={isActive('/about') || isActive('/associations') ? 'active' : ''}
              onClick={handleDropdownClick}
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
            >
              About <span className="dropdown-arrow">▾</span>
            </Link>
            <ul className="nav-dropdown-menu">
              <li>
                <Link href="/about" onClick={closeMenu}>
                  Fr. Roby
                </Link>
              </li>
              <li>
                <Link href="/associations" onClick={closeMenu}>
                  Associations &amp; Collaborations
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link
              href="/initiatives"
              className={isActive('/initiatives') ? 'active' : ''}
              onClick={closeMenu}
            >
              Initiatives &amp; Contributions
            </Link>
          </li>
          <li>
            <Link
              href="/gallery"
              className={isActive('/gallery') ? 'active' : ''}
              onClick={closeMenu}
            >
              Gallery
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className={isActive('/contact') ? 'active' : ''}
              onClick={closeMenu}
            >
              Contact
            </Link>
          </li>
        </ul>

        <button
          className="hamburger"
          id="hamburger"
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
          aria-controls="navLinks"
          onClick={toggleMenu}
        >
          <span style={{
            transform: isOpen ? 'translateY(6.5px) rotate(45deg)' : '',
            transition: 'transform 0.3s ease'
          }}></span>
          <span style={{
            opacity: isOpen ? '0' : '1',
            transition: 'opacity 0.3s ease'
          }}></span>
          <span style={{
            transform: isOpen ? 'translateY(-6.5px) rotate(-45deg)' : '',
            transition: 'transform 0.3s ease'
          }}></span>
        </button>
      </div>
    </nav>
  );
}
