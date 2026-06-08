import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import LiveStreaming from "@/components/home/LiveStreaming";
import StatsSection from "@/components/home/StatsSection";
import QuickRanking from "@/components/home/QuickRanking";
import UpcomingConvoys from "@/components/home/UpcomingConvoys";
import GalleryCarousel from "@/components/home/GalleryCarousel";
import CampeonatoFotos from "@/components/home/CampeonatoFotos";
import FormulaTruckNoticia from "@/components/home/FormulaTruckNoticia";
import LatestNews from "@/components/home/LatestNews";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <LiveStreaming />
      <StatsSection />
      <QuickRanking />
      <UpcomingConvoys />
      <CampeonatoFotos />
      <FormulaTruckNoticia />
      <GalleryCarousel />
      <LatestNews />
    </Layout>
  );
};

export default Index;
