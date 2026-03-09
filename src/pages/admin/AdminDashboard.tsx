import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Users, Trophy, Truck, Camera, ShoppingBag, Newspaper, Crown,
  UserPlus, LogOut, LayoutDashboard,
} from "lucide-react";
import logoImg from "@/assets/logo-rocket-trg.jpeg";
import AdminDrivers from "./sections/AdminDrivers";
import AdminRanking from "./sections/AdminRanking";
import AdminComboios from "./sections/AdminComboios";
import AdminGaleria from "./sections/AdminGaleria";
import AdminProdutos from "./sections/AdminProdutos";
import AdminBlog from "./sections/AdminBlog";
import AdminHallDaFama from "./sections/AdminHallDaFama";
import AdminRecrutamento from "./sections/AdminRecrutamento";

const tabs = [
  { id: "drivers", label: "Motoristas", icon: Users },
  { id: "ranking", label: "Ranking", icon: Trophy },
  { id: "comboios", label: "Comboios", icon: Truck },
  { id: "galeria", label: "Galeria", icon: Camera },
  { id: "produtos", label: "Produtos", icon: ShoppingBag },
  { id: "blog", label: "Blog", icon: Newspaper },
  { id: "hall", label: "Hall da Fama", icon: Crown },
  { id: "recrutamento", label: "Recrutamento", icon: UserPlus },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("drivers");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado!");
  };

  const renderSection = () => {
    switch (activeTab) {
      case "drivers": return <AdminDrivers />;
      case "ranking": return <AdminRanking />;
      case "comboios": return <AdminComboios />;
      case "galeria": return <AdminGaleria />;
      case "produtos": return <AdminProdutos />;
      case "blog": return <AdminBlog />;
      case "hall": return <AdminHallDaFama />;
      case "recrutamento": return <AdminRecrutamento />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col shrink-0 hidden md:flex">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <img src={logoImg} alt="Logo" className="w-10 h-10 rounded-full border border-primary/30" />
          <div>
            <p className="font-heading text-sm font-bold text-gradient-fire">ADMIN</p>
            <p className="text-xs text-muted-foreground font-display">The Rocket TRG</p>
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-display font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-muted-foreground font-display">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="Logo" className="w-8 h-8 rounded-full" />
            <span className="font-heading text-sm font-bold text-gradient-fire">ADMIN</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex overflow-x-auto gap-1 px-2 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-display font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <tab.icon className="h-3 w-3" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto md:mt-0 mt-24">
        {renderSection()}
      </main>
    </div>
  );
}
