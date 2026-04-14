import React from 'react';
import { Grid2x2PlusIcon, MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetFooter } from '@/components/ui/sheet';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingHeaderProps {
  logo?: string;
  logoIcon?: React.ReactNode;
  links?: { label: string; href: string }[];
  className?: string;
}

export function FloatingHeader({
  logo = "Asme",
  logoIcon,
  links = [
    { label: 'Features', href: '#' },
    { label: 'Pricing', href: '#' },
    { label: 'About', href: '#' },
  ],
  className,
}: FloatingHeaderProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <header className={cn("w-full z-50 px-4 pt-4", className)}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-border bg-card/80 backdrop-blur-lg px-6 py-3 shadow-lg">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          {logoIcon || <Grid2x2PlusIcon className="h-7 w-7 text-primary" />}
          <span className="text-lg font-heading font-bold tracking-tight text-foreground">
            {logo}
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden lg:inline-flex"
            )}
          >
            Login
          </a>

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
              <div className="flex flex-col gap-3 pt-6">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block px-4 py-2.5 text-sm font-medium text-foreground/80 rounded-lg hover:bg-accent transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <SheetFooter className="mt-8 flex flex-col gap-2">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
                <Button className="w-full">Get Started</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
