import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Sobre from "./pages/Sobre";
import ComoFunciona from "./pages/ComoFunciona";
import Ranking from "./pages/Ranking";
import HallDaFama from "./pages/HallDaFama";
import Comboios from "./pages/Comboios";
import Galeria from "./pages/Galeria";
import NossaFrota from "./pages/NossaFrota";
import Loja from "./pages/Loja";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Recrutamento from "./pages/Recrutamento";
import AdminLayout from "./pages/admin/AdminLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/como-funciona" element={<ComoFunciona />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/hall-da-fama" element={<HallDaFama />} />
          <Route path="/comboios" element={<Comboios />} />
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/nossa-frota" element={<NossaFrota />} />
          <Route path="/loja" element={<Loja />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/recrutamento" element={<Recrutamento />} />
          <Route path="/admin" element={<AdminLayout />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
