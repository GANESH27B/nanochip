'use client';

import { Logo } from '../logo';
import Link from 'next/link';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { cn } from '@/lib/utils';

const footerLinkClasses = "text-muted-foreground hover:text-primary-foreground transition-colors";
const footerTitleClasses = "text-lg font-semibold mb-4 text-primary-foreground";


export default function AppFooter() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground border-t border-sidebar-border">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-muted-foreground text-sm">
              Simplifying the pharmaceutical supply chain with secure and transparent solutions.
            </p>
            <div className="flex space-x-4 mt-4">
              <Link href="#" className={cn(footerLinkClasses, "hover:text-primary")}>
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className={cn(footerLinkClasses, "hover:text-primary")}>
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className={cn(footerLinkClasses, "hover:text-primary")}>
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className={cn(footerLinkClasses, "hover:text-primary")}>
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
            <p className="text-muted-foreground text-sm mb-4">
              Subscribe to our newsletter to get the latest updates.
            </p>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="email" placeholder="Email" className="bg-sidebar-accent border-sidebar-border focus:ring-sidebar-ring" />
              <Button type="submit" variant="secondary">Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-sidebar-border text-center text-sm text-muted-foreground">
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
