"use client";

import { SiGithub } from "react-icons/si";
import { PiGlobeHemisphereWestDuotone } from "react-icons/pi";
import { Link } from "@/i18n/navigation";

export function Footer() {
  return (
    <footer className="border-t bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <div className="flex items-center space-x-6">
            <Link
              href="https://github.com/lemonteaau/artist-array"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <SiGithub className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">GitHub</span>
            </Link>

            <Link
              href="https://lemontea.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <PiGlobeHemisphereWestDuotone className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">Website</span>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            Made with ❤️ by lemontea
          </p>
        </div>
      </div>
    </footer>
  );
}
