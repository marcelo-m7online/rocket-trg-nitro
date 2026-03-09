import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { UserPlus, BookOpen, Truck, Trophy, Star, CheckCircle } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "1. Inscreva-se", desc: "Entre em contato com a administração e solicite sua entrada na empresa." },
  { icon: BookOpen, title: "2. Leia as Regras", desc: "Conheça o regulamento da empresa e as diretrizes de conduta." },
  { icon: Truck, title: "3. Instale o VTLOG", desc: "Configure o VTLOG para registrar suas viagens automaticamente." },
  { icon: Trophy, title: "4. Faça Viagens", desc: "Comece a rodar e acumular pontos, quilômetros e conquistas." },
  { icon: Star, title: "5. Suba no Ranking", desc: "Quanto mais viagens e dedicação, mais alto você chega no ranking." },
];

const rules = [
  "Respeitar todos os membros da empresa",
  "Utilizar o VTLOG em todas as viagens",
  "Participar de pelo menos 1 comboio por mês",
  "Manter velocidade dentro dos limites do mapa",
  "Não utilizar mods que alterem a jogabilidade",
  "Reportar problemas à administração",
];

const benefits = [
  "Ranking competitivo com premiações",
  "Participação em comboios organizados",
  "Badges e conquistas exclusivas",
  "Comunidade ativa e amigável",
  "Hall da Fama para os melhores",
  "Produtos exclusivos na loja",
];

export default function ComoFunciona() {
  return (
    <Layout>
      <section className="py-20 racing-stripe relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        <div className="container mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-6xl font-black text-gradient-fire mb-4">
              COMO FUNCIONA
            </h1>
            <p className="text-lg text-muted-foreground font-display max-w-2xl mx-auto">
              Saiba como participar da The Rocket TRG e começar sua jornada
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-gradient-fire mb-10 text-center">
            PASSO A PASSO
          </h2>
          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
              >
                <step.icon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground font-body mt-1">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VTLOG */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-gradient-fire mb-4">
              INTEGRAÇÃO COM VTLOG
            </h2>
            <p className="text-muted-foreground font-body text-lg mb-4">
              O VTLOG é nosso sistema oficial de controle de viagens. Ele registra automaticamente
              cada viagem realizada, contabilizando quilômetros, pontos e tempo de jogo.
              Seu ranking é atualizado automaticamente via integração com a API do VTLOG.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              {["Registro automático", "Ranking em tempo real", "Histórico completo"].map((item, i) => (
                <div key={item} className="p-4 rounded-lg bg-card border border-border">
                  <p className="text-sm font-display font-semibold text-primary">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rules & Benefits */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-xl font-bold text-gradient-fire mb-6">REGRAS</h2>
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div key={rule} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground font-body">{rule}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading text-xl font-bold text-gradient-gold mb-6">BENEFÍCIOS</h2>
              <div className="space-y-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-gold flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground font-body">{benefit}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
