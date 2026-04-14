interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

const Footer2 = ({
  logo = {
    src: "https://www.shadcnblocks.com/images/block/block-1.svg",
    alt: "logo",
    title: "Company",
    url: "/",
  },
  tagline = "Components made easy.",
  menuItems = [
    {
      title: "Product",
      links: [
        { text: "Overview", url: "#" },
        { text: "Pricing", url: "#" },
        { text: "Features", url: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About", url: "#" },
        { text: "Team", url: "#" },
        { text: "Contact", url: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { text: "Help", url: "#" },
        { text: "Sales", url: "#" },
      ],
    },
    {
      title: "Social",
      links: [
        { text: "Twitter", url: "#" },
        { text: "Instagram", url: "#" },
        { text: "LinkedIn", url: "#" },
      ],
    },
  ],
  copyright = "© 2024 Copyright. All rights reserved.",
  bottomLinks = [
    { text: "Terms and Conditions", url: "#" },
    { text: "Privacy Policy", url: "#" },
  ],
}: Footer2Props) => {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <footer>
          <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
            {/* Logo + tagline */}
            <div className="flex flex-col items-start gap-4 lg:max-w-sm">
              <a href={logo.url} className="flex items-center gap-3">
                <img src={logo.src} alt={logo.alt} className="h-8 w-auto" />
                <span className="text-xl font-heading font-bold text-foreground">
                  {logo.title}
                </span>
              </a>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tagline}
              </p>
            </div>

            {/* Menu columns */}
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {menuItems.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 className="mb-4 text-sm font-semibold text-foreground tracking-wide">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <a
                          href={link.url}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
            <p className="text-xs text-muted-foreground">{copyright}</p>
            <div className="flex gap-6">
              {bottomLinks.map((link, linkIdx) => (
                <a
                  key={linkIdx}
                  href={link.url}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
};

export { Footer2 };
