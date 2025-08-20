import { Palette } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function NavbarBrand() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <div className="p-2 rounded-sm bg-[#f97316]/7 group-hover:bg-[#f97316]/15">
        <Palette className="h-5 w-5 text-[#f97316]" />
      </div>
      <h1 className="hidden md:block text-xl  font-bold whitespace-nowrap text-[#f97316]">
        Artist Array
      </h1>
    </Link>
  );
}
