import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Target, Eye, Heart, Flame, Users, Map, Shield, Zap } from "lucide-react";

const values = [
  { icon: Shield, title: "Respeito", desc: "Tratamos todos com igualdade e respeito mútuo." },
  { icon: Users, title: "Trabalho em Equipe", desc: "Juntos somos mais fortes nas estradas." },
  { icon: Zap, title: "Dedicação", desc: "Compromisso total com a excelência." },
  { icon: Heart, title: "Paixão", desc: "Amor por caminhões e estradas virtuais." },
];

const team = [
  { nome: "Fundador", cargo: "CEO / Fundador", desc: "Criador da The Rocket TRG" },
  { nome: "Vice-Líder", cargo: "Vice-Presidente", desc: "Responsável por operações" },
  { nome: "Coordenador", cargo: "Coordenador de Comboios", desc: "Organiza os comboios semanais" },
];

export default function Sobre() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 racing-stripe relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background" />
        <div className="container mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Flame className="h-12 w-12 text-primary mx-auto mb-4 animate-fire-flicker" />
            <h1 className="font-heading text-4xl md:text-6xl font-black text-gradient-fire mb-4">
              SOBRE NÓS
            </h1>
            <p className="text-lg text-muted-foreground font-display max-w-2xl mx-auto">
              Conheça a história, missão e os valores da The Rocket TRG
            </p>
          </motion.div>
        </div>
      </section>

      {/* História */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-gradient-fire mb-6">NOSSA HISTÓRIA</h2>
            <div className="space-y-4 text-muted-foreground font-body text-lg leading-relaxed">
              <p>
                A The Rocket TRG nasceu da paixão por estradas e pela comunidade do Euro Truck Simulator 2.
                Fundada com o objetivo de reunir motoristas apaixonados pelo mapa RBR, nossa empresa virtual
                se tornou referência em organização, companheirismo e competitividade saudável.
              </p>
              <p>
                Utilizamos o sistema VTLOG para controle de viagens e pontuação, garantindo transparência
                e motivação para todos os nossos motoristas. Cada quilômetro rodado é registrado,
                cada viagem conta.
              </p>
              <p>
                Operamos no mapa RBR (Rodovias Brasileiras), o mais realista mapa brasileiro para ETS2,
                trazendo a experiência de dirigir pelas estradas do Brasil com fidelidade impressionante.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Missão, Visão */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
            >
              <Target className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">MISSÃO</h3>
              <p className="text-muted-foreground font-body">
                Proporcionar a melhor experiência de empresa virtual no ETS2, com organização,
                tecnologia e uma comunidade acolhedora e competitiva.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
            >
              <Eye className="h-10 w-10 text-gold mb-4" />
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">VISÃO</h3>
              <p className="text-muted-foreground font-body">
                Ser a empresa virtual de transporte mais profissional e reconhecida do mapa RBR,
                inspirando outras empresas com nosso padrão de qualidade.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-gradient-fire mb-10 text-center">
            NOSSOS VALORES
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 text-center transition-all group"
              >
                <v.icon className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-heading text-sm font-bold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground font-body">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mapa RBR */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Map className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-gradient-fire mb-4">MAPA RBR</h2>
            <p className="text-muted-foreground font-body text-lg mb-6">
              Operamos exclusivamente no mapa Rodovias Brasileiras (RBR), o mapa mais realista
              do Brasil para o ETS2. Com estradas fielmente reproduzidas, nossa empresa oferece
              a experiência mais autêntica de transporte rodoviário virtual.
            </p>
            <a
              href="https://maparbr.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-display font-semibold hover:underline"
            >
              Visite o site do Mapa RBR →
            </a>
          </motion.div>
        </div>
      </section>

      {/* Equipe */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-gradient-fire mb-10 text-center">
            EQUIPE ADMINISTRATIVA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={member.cargo}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 text-center transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading text-sm font-bold text-foreground">{member.nome}</h3>
                <p className="text-xs text-primary font-display font-semibold mt-1">{member.cargo}</p>
                <p className="text-xs text-muted-foreground font-body mt-2">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
