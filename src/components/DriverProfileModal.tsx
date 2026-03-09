import { X, Route, MapPin, Trophy, Truck, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Driver {
  id: string;
  nome: string;
  nickname: string;
  pontos: number;
  km_rodados: number;
  viagens: number;
  cargo: string | null;
  bio: string | null;
  avatar_url: string | null;
  avatar_url_caminhao: string | null;
  data_entrada: string;
  vtlog_id: string | null;
  status: string;
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
              {driver.avatar_url ? (
                <img src={driver.avatar_url} alt={driver.nickname} className="w-20 h-20 rounded-full border-4 border-card object-cover" />
              ) : (
                <div className="w-20 h-20 rounded-full border-4 border-card bg-muted flex items-center justify-center">
                  <User className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <h2 className="font-heading text-2xl font-bold text-gradient-fire">{driver.nickname}</h2>
                <p className="text-sm text-muted-foreground font-display">{driver.nome} • {driver.cargo || "Motorista"}</p>
              </div>
            </div>

            {driver.bio && (
              <p className="text-sm text-muted-foreground font-body mb-6 leading-relaxed">{driver.bio}</p>
            )}

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 rounded-xl bg-muted/50 border border-border">
                <Trophy className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="font-heading text-lg font-bold text-primary">{driver.pontos.toLocaleString("pt-BR")}</p>
                <p className="text-xs text-muted-foreground">Pontos</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50 border border-border">
                <Route className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="font-heading text-lg font-bold text-foreground">{driver.viagens}</p>
                <p className="text-xs text-muted-foreground">Viagens</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50 border border-border">
                <MapPin className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="font-heading text-lg font-bold text-foreground">{driver.km_rodados.toLocaleString("pt-BR")}</p>
                <p className="text-xs text-muted-foreground">KM</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground font-display">
              <Truck className="h-3 w-3" />
              <span>Membro desde {new Date(driver.data_entrada).toLocaleDateString("pt-BR")}</span>
              {driver.vtlog_id && <span>• VTLOG: {driver.vtlog_id}</span>}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
