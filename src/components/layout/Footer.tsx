import { Link } from "react-router-dom";
import { ExternalLink, Instagram } from "lucide-react";
import logoImg from "@/assets/logo-rocket-trg.jpeg";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={logoImg} alt="The Rocket TRG" className="h-8 w-8 rounded-full border border-primary/30" />
              <span className="font-heading text-lg font-bold text-gradient-fire">THE ROCKET TRG</span>
            </div>
            <p className="text-sm text-muted-foreground font-body">
              A melhor empresa virtual de transporte do Euro Truck Simulator 2 no mapa RBR.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="https://www.instagram.com/trg.news/reels/" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/10 transition-all">
                <Instagram className="h-4 w-4 text-muted-foreground hover:text-primary" />
              </a>
              <a href="https://www.instagram.com/trg_transportes_e_logistica/" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/10 transition-all">
                <Instagram className="h-4 w-4 text-muted-foreground hover:text-primary" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold text-primary mb-4">NAVEGAÇÃO</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Home", path: "/" },
                { label: "Sobre Nós", path: "/sobre" },
                { label: "Ranking", path: "/ranking" },
                { label: "Comboios", path: "/comboios" },
                { label: "Nossa Frota", path: "/nossa-frota" },
                { label: "Recrutamento", path: "/recrutamento" },
              ].map((item) => (
                <Link key={item.path} to={item.path} className="text-sm text-muted-foreground hover:text-primary transition-colors font-body">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold text-primary mb-4">RECURSOS</h4>
            <div className="flex flex-col gap-2">
              {[
                { label: "Galeria", path: "/galeria" },
                { label: "Blog", path: "/blog" },
                { label: "Loja", path: "/loja" },
                { label: "Hall da Fama", path: "/hall-da-fama" },
              ].map((item) => (
                <Link key={item.path} to={item.path} className="text-sm text-muted-foreground hover:text-primary transition-colors font-body">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading text-sm font-bold text-primary mb-4">REDES SOCIAIS</h4>
            <div className="flex flex-col gap-2">
              <a href="https://www.instagram.com/trg.news/reels/" target="_blank" rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-body inline-flex items-center gap-1">
                <Instagram className="h-3 w-3" /> TRG News
              </a>
              <a href="https://www.instagram.com/trg_transportes_e_logistica/" target="_blank" rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-body inline-flex items-center gap-1">
                <Instagram className="h-3 w-3" /> TRG Transportes
              </a>
              <a href="https://maparbr.com.br/" target="_blank" rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-body inline-flex items-center gap-1">
                Mapa RBR <ExternalLink className="h-3 w-3" />
              </a>
              <a href="https://vtlog.net/" target="_blank" rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-body inline-flex items-center gap-1">
                VTLOG <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground font-body">
            © {new Date().getFullYear()} The Rocket TRG. Todos os direitos reservados. Empresa virtual do Euro Truck Simulator 2.
          </p>
        </div>
      </div>
    </footer>
  );
}
