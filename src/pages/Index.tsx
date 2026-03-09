import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import QuickRanking from "@/components/home/QuickRanking";
import UpcomingConvoys from "@/components/home/UpcomingConvoys";
import LatestNews from "@/components/home/LatestNews";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <QuickRanking />
      <UpcomingConvoys />
      <LatestNews />
    </Layout>
  );
};

export default Index;
