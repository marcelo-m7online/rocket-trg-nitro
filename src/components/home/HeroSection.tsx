import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Flame, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import logoImg from "@/assets/logo-rocket-trg.jpeg";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden racing-stripe">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <img
            src={logoImg}
            alt="The Rocket TRG"
            className="w-32 h-32 md:w-44 md:h-44 rounded-full mx-auto border-2 border-primary/30 glow-fire"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-primary/30 bg-primary/5">
            <Flame className="h-4 w-4 text-primary animate-fire-flicker" />
            <span className="text-sm font-display font-semibold text-primary">
              EMPRESA VIRTUAL DE TRANSPORTE — ETS2
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
        >
          <span className="text-gradient-fire">THE ROCKET</span>
          <br />
          <span className="text-foreground">TRG</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-muted-foreground font-display max-w-2xl mx-auto mb-8"
        >
          Velocidade, precisão e paixão por estradas. A empresa virtual que domina o mapa RBR no Euro Truck Simulator 2.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/recrutamento">
            <Button size="lg" className="bg-gradient-fire text-primary-foreground font-heading text-base px-8 py-6 glow-fire hover:scale-105 transition-transform">
              ENTRAR NA EMPRESA
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/sobre">
            <Button variant="outline" size="lg" className="font-heading text-base px-8 py-6 border-primary/30 hover:bg-primary/10 hover:border-primary">
              CONHEÇA MAIS
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
