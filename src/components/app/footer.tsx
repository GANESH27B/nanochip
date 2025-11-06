'use client';

import { Logo } from '../logo';
import Link from 'next/link';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

const footerLinkClasses = "text-primary-foreground/80 hover:text-primary-foreground transition-colors";
const footerTitleClasses = "text-lg font-semibold mb-4 text-primary-foreground";


export default function AppFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-primary-foreground/80 text-sm">
              Simplifying the pharmaceutical supply chain with secure and transparent solutions.
            </p>
            <div className="flex space-x-4 mt-4">
              <Link href="#" className={footerLinkClasses}>
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className={footerLinkClasses}>
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className={footerLinkClasses}>
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className={footerLinkClasses}>
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className={footerTitleClasses}>About Us</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className={footerLinkClasses}>About PharmaChain</Link></li>
              <li><Link href="#" className={footerLinkClasses}>Careers</Link></li>
              <li><Link href="#" className={footerLinkClasses}>Press</Link></li>
              <li><Link href="#" className={footerLinkClasses}>Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className={footerTitleClasses}>Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className={footerLinkClasses}>Contact Us</Link></li>
              <li><Link href="#" className={footerLinkClasses}>Help & FAQs</Link></li>
              <li><Link href="#" className={footerLinkClasses}>Track Your Order</Link></li>
              <li><Link href="#" className={footerLinkClasses}>Returns & Exchanges</Link></li>
            </ul>
          </div>
          <div>
            <h3 className={footerTitleClasses}>Stay Connected</h3>
            <p className="text-primary-foreground/80 text-sm mb-4">
              Subscribe to our newsletter to get the latest updates.
            </p>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input 
                type="email" 
                placeholder="Email" 
                className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/60 focus:ring-primary-foreground" 
              />
              <Button type="submit" variant="secondary">Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/80">
          <p>&copy; {new Date().getFullYear()} PharmaChain. All Rights Reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
             <Link href="#" className={footerLinkClasses}>Privacy Policy</Link>
             <Link href="#" className={footerLinkClasses}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
