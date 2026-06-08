import { X, Target, DollarSign, Trophy, Truck, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Driver {
  id: string; // steam_id
  nickname: string;
  nome: string; // role
  pontos: number; // based on experience
  avatar?: string;
  lucro?: number;
  level?: number;
  // Fallbacks for optional supabase props removed during transition
  bio?: string;
  avatar_url_caminhao?: string;
  data_entrada?: string;
}

interface Props {
  driver: Driver | null;
  onClose: () => void;
}

export default function DriverProfileModal({ driver, onClose }: Props) {
  if (!driver) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex items-center justify-center p-4" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border border-border rounded-2xl max-w-lg w-full overflow-hidden"
        >
          {/* Header with truck photo */}
          {driver.avatar_url_caminhao ? (
            <div className="h-40 relative">
              <img src={driver.avatar_url_caminhao} alt="Caminhão" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            </div>
          ) : (
            <div className="h-20 bg-gradient-fire opacity-30" />
          )}

          <div className="p-6 -mt-12 relative">
            <button onClick={onClose} className="absolute top-2 right-4 text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-end gap-4 mb-6">
              {driver.avatar ? (
                <img src={driver.avatar} alt={driver.nickname} className="w-20 h-20 rounded-full border-4 border-card object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full border-4 border-card bg-muted flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <h2 className="font-heading text-2xl font-bold text-gradient-fire">{driver.nickname}</h2>
                <p className="text-sm text-muted-foreground font-display">{driver.nome}</p>
              </div>
            </div>

            {driver.bio && (
              <p className="text-sm text-muted-foreground font-body mb-6 leading-relaxed">{driver.bio}</p>
            )}

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 rounded-xl bg-muted/50 border border-border">
                <Trophy className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="font-heading text-lg font-bold text-primary">{driver.pontos?.toLocaleString("pt-BR")}</p>
                <p className="text-xs text-muted-foreground">Exp.</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50 border border-border">
                <DollarSign className="h-5 w-5 text-green-500/70 mx-auto mb-1" />
                <p className="font-heading text-lg font-bold text-green-500/90 tooltip" title={`R$ ${driver.lucro?.toLocaleString("pt-BR")}`}>
                  {driver.lucro ? `R$ ${(driver.lucro / 1000).toFixed(1)}k` : "R$ 0"}
                </p>
                <p className="text-xs text-muted-foreground">Lucro</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50 border border-border">
                <Target className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="font-heading text-lg font-bold text-foreground">{driver.level || 0}</p>
                <p className="text-xs text-muted-foreground">Level</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground font-display">
              <Truck className="h-3 w-3" />
              <span>Conectado à API VTLOG • ID: {driver.id}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
