import { Phone } from "lucide-react";
import Link from "next/link";

export function MobileCallBar() {
  return (
    <div className="fixed bottom-0 left-0 z-40 flex w-full items-center gap-3 border-t border-black/5 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] backdrop-blur-xl md:hidden">
      <Link
        href="tel:07845531351"
        className="flex h-14 flex-1 items-center justify-center gap-3 rounded-lg bg-[#E6B31E] text-lg font-bold text-[#251a00] transition-transform active:scale-[0.98]"
      >
        <Phone className="h-5 w-5" aria-hidden />
        Call 0784 5531351
      </Link>
    </div>
  );
}
