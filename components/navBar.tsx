'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = (shouldClose = true) => {
    if (shouldClose) {
      setIsMobileMenuOpen(false);
    } else {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

  const getLinkClassName = (href: string) => {
    const isActive = pathname === href;
    return `text-white hover:text-gray-300 text-xl font-kompot font-bold relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-green-500 after:left-0 after:bottom-[-4px] ${
      isActive ? 'after:scale-x-100' : 'after:scale-x-0'
    } hover:after:scale-x-100 after:transition-transform after:duration-300 group-hover:after:scale-x-0 hover:group-hover:after:scale-x-100`;
  };

  return (
    <nav className="fixed left-0 right-0 z-[100] bg-opacity-50 h-20">
      <div className="max-w-7xl mx-auto px-5 py-5  flex items-center  justify-between ">
        {/* Left Logo */}
        <div className="flex items-center space-x-2">
          <div className="absolute left-10 top-3">
            <Link href="/">
              <Image src="/tk25-logo.svg" alt="Icon" width={35} height={35} />
            </Link>{" "}
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-10 group">
          <Link href="/" className={getLinkClassName('/')}>
            Home
          </Link>
          <Link href="/Events" className={getLinkClassName('/Events')}>
            Events
          </Link>
          <Link href="/Proshows" className={getLinkClassName('/Proshows')}>
            Proshows
          </Link>
          <Link href="/register" className={getLinkClassName('/register')}>
            Register
          </Link>
        </div>

        {/* Mobile Hamburger Icon */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => toggleMobileMenu(false)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden bg-black bg-opacity-90 p-5 z-[100]"
          data-hoverable
        >
          <Link
            href="/"
            className={`block py-2 ${getLinkClassName('/')}`}
            onClick={() => toggleMobileMenu()}
            scroll={false}
          >
            Home
          </Link>
          <Link
            href="/Events"
            className={`block py-2 ${getLinkClassName('/Events')}`}
            onClick={() => toggleMobileMenu()}
            scroll={false}
          >
            Events
          </Link>
          <Link
            href="/Proshows"
            className={`block py-2 ${getLinkClassName('/Proshows')}`}
            onClick={() => toggleMobileMenu()}
          >
            Proshows
          </Link>
          <Link
            href="/register"
            className={`block py-2 ${getLinkClassName('/register')}`}
            onClick={() => toggleMobileMenu()}
            scroll={false}
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
