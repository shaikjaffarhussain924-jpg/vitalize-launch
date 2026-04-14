import React from 'react';
import { MenuIcon, Phone } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CLINIC, SERVICES } from '@/lib/constants';
import { getCallLink } from '@/lib/whatsapp';

interface FloatingHeaderProps {
  className?: string;
}

export function FloatingHeader({ className }: FloatingHeaderProps) {
  const [open, setOpen] = React.useState(false);

  const links = [
    { label: 'Home', to: '/' },
    { label: 'About', to: '/about' },
    { label: 'Services', to: '/services' },
    { label: 'Doctors', to: '/doctors' },
    { label: 'Gallery', to: '/gallery' },
    { label: 'Blog', to: '/blog' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <header className={cn("w-full z-50 px-4 pt-4 fixed top-0 left-0 right-0", className)}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/20 bg-white/10 backdrop-blur-2xl px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.2)]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center text-navy-foreground font-heading font-bold text-lg group-hover:bg-gold transition-colors duration-300">
            H
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-heading font-bold tracking-tight text-navy">
              {CLINIC.name}
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to as any}
              className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-gold tracking-wide"
              activeProps={{ className: 'text-gold' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <a
            href={getCallLink()}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden lg:inline-flex text-gold hover:text-gold/80 gap-1.5"
            )}
          >
            <Phone className="w-3.5 h-3.5" /> {CLINIC.phone}
          </a>
          <Link to="/book-appointment" className="hidden lg:inline-flex">
            <Button className="bg-gold hover:bg-gold/90 text-gold-foreground font-semibold rounded-full px-5 tracking-wide shadow-[0_4px_15px_-3px_oklch(0.62_0.10_65/0.4)]">
              Book Appointment
            </Button>
          </Link>

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(!open)}
              className="lg:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-1 pt-6">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to as any}
                    className="block px-4 py-2.5 text-sm font-medium text-foreground/80 rounded-lg hover:bg-accent transition-colors tracking-wide"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <SheetFooter className="mt-8 flex flex-col gap-2">
                <a href={getCallLink()} className="w-full">
                  <Button variant="outline" className="w-full gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Call Us
                  </Button>
                </a>
                <Link to="/book-appointment" onClick={() => setOpen(false)} className="w-full">
                  <Button className="w-full bg-gold hover:bg-gold/90 text-gold-foreground font-semibold">
                    Book Appointment
                  </Button>
                </Link>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
