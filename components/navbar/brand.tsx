import { Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function NavbarBrand() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
        <Sparkles className="h-5 w-5 text-primary" />
      </div>
      <h1 className="hidden md:block text-xl font-bold gradient-text whitespace-nowrap">
        Artist Array
      </h1>
    </Link>
  );
}
