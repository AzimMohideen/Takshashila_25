import { FaInstagram, FaFacebookF, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const Footer = () => {
  const pathname = usePathname();
  const isTeamPage = pathname === '/team';

  return (
    <section className="relative z-20 bg-black/40 backdrop-blur-md py-16 mt-20" data-scroll-section>
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Socials */}
        <div className="space-y-4">
          <h3 className="text-white text-xl font-semibold mb-6">Connect With Us</h3>
          <div className="flex space-x-4">
            <a href="https://www.instagram.com/cittakshashila/" target="_blank" rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
              <FaInstagram size={20} />
            </a>
            <a href="https://www.facebook.com/people/CIT-Takshashila/100064056814271/" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
              <FaFacebookF size={20} />
            </a>
            <a href="https://www.linkedin.com/in/cittakshashila/" target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
              <FaLinkedinIn size={20} />
            </a>
          </div>
          
          <div className="mt-70 -ml-10">
            <a 
              href="https://cit-celestius.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image 
                src="/TK FOOTER.svg" 
                alt="Takshashila Footer Logo" 
                width={256}
                height={100}
                className="opacity-70 hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </div>

        {/* Events */}
        <div className="space-y-4">
          <h3 className="text-white text-xl font-semibold mb-6">Events</h3>
          <ul className="space-y-3">
            <li>
              <a href={"/Events"} className="text-white/70 hover:text-white transition-colors">Technical Events</a>
            </li>
            <li>
              <a href={"/Events"} className="text-white/70 hover:text-white transition-colors">Non-Technical Events</a>
            </li>
            <li>
              <a href={"/Events"} className="text-white/70 hover:text-white transition-colors">Workshops</a>
            </li>
            <li>
              <a href={"/Proshows"} className="text-white/70 hover:text-white transition-colors">Proshows</a>
            </li>
            
          </ul>
        </div>

        {/* Website */}
        <div className="space-y-4">
          <h3 className="text-white text-xl font-semibold mb-6">Website</h3>
          <ul className="space-y-3">
            <li>
              <Link href="/" className="text-white/70 hover:text-white transition-colors">Home</Link>
            </li>
            <li>
              <Link href="https://www.citchennai.edu.in/" target="_blank" className="text-white/70 hover:text-white transition-colors">About</Link>
            </li>
            {/* <li>
              <div className="text-white/70">
                Contact:
                <div className="ml-2 mt-1">
                  <p>+91 81489 17472 (Mohan Kumar)</p>
                  <p>+91 8807088905 (Tharun Kumar)</p>
                </div>
              </div>
            </li> */}
          </ul>
        </div>

        {/* Support */}
        <div className="space-y-4">
          <h3 className="text-white text-xl font-semibold mb-6">Support</h3>
          <ul className="space-y-3">
            <li>
              <Link href="/faq" className="text-white/70 hover:text-white transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/guidelines" className="text-white/70 hover:text-white transition-colors">
                Guidelines
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-white/70 hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-white/70 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 pt-8 border-t border-white/10">
        <p className="text-center text-white/50">
          © {new Date().getFullYear()} Takshashila. All rights reserved.
        </p>
      </div>

      {/* Meet the Team button - only show if not on team page */}
      {!isTeamPage && (
        <div className="absolute bottom-8 right-8">
          <Link href="/team" className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-3 rounded-full transition-colors duration-300 flex items-center gap-2">
            <span>Web Dev Team</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      )}
    </section>
  );
};

export default Footer;
