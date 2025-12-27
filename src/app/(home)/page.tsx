import BlogSection from "@/components/home/BlogSection";
import BusinessMarquee from "@/components/home/BusinessMarquee";
import HeroSlider from "@/components/home/hero";
import MediaSection from "@/components/home/MediaSection";

export default function Home() {
  return (
    <div>
      <HeroSlider/>
      <BusinessMarquee/>
      <MediaSection/>
      <BlogSection/>
    </div>
  );
}
