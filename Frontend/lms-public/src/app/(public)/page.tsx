import CompaniesComponent from "@/components/homePage/Companies.Component";
import HeroComponent from "@/components/homePage/Hero.Component";
import MentorComponent from "@/components/homePage/Mentor.Component";
import NewsletterComponent from "@/components/homePage/Newsletter.Component";
import TestimonialComponent from "@/components/homePage/Testimonial.Component";

const Home = () => {
  return (
    <>
      <HeroComponent></HeroComponent>
      <CompaniesComponent></CompaniesComponent>
      <MentorComponent></MentorComponent>
      <TestimonialComponent></TestimonialComponent>
      <NewsletterComponent></NewsletterComponent>
    </>
  );
};

export default Home;
