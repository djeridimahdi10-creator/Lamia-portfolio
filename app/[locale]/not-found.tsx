import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-[#FAF9F6] dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#EDEDEF]">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-[#C5A059]/10 text-[#C5A059] rounded-2xl flex items-center justify-center mx-auto border border-[#C5A059]/20 shadow-sm">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <p className="font-mono text-xs uppercase tracking-widest text-[#C5A059] font-bold">
            Error 404
          </p>
          <h1 className="font-playfair text-3xl sm:text-4xl font-bold">
            Page Non Trouvée / Page Not Found
          </h1>
          <p className="text-sm text-[#52525B] dark:text-[#A1A1AA] leading-relaxed">
            L'espace architectural que vous recherchez n'existe pas ou a été déplacé.
          </p>
        </div>

        <div>
          <Link
            href="/fr"
            className="admin-btn-primary inline-flex items-center gap-2 py-3 px-6 text-xs uppercase tracking-wider font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à l'accueil / Back Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
