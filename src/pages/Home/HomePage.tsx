import InfoCard from "@/components/cards/InfoCard";
import Date from "@/components/home/Date";
import Hero from "@/components/home/Hero";
import Timer from "@/components/home/Timer";
import { letterFromSecGen } from "@/utils/letter"
import { about } from "@/utils/about";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center mt-4">
      <Hero />
      <Timer />
      <Date />
      <div className="mt-15">
        <InfoCard
          heading="Committees"
          children={
            <img
              src="/images/Committees2.png"
              alt="Committees"
              className="w-full h-auto sm:mt-6 mt-[-70px]"
            />
          }
        />
      </div>
      <div className="mt-15">
        <InfoCard
          heading="Letter from Secretary General"
          children={
            <p className="text-justify bg-[#c0b8a2] sm:mt-8 mt-[-20px] font-bold font-serif text-lg text-primary-background">
              {letterFromSecGen}
            </p>
          }
        />
      </div>
      <div className="mt-15">
        <InfoCard
          heading="Letter from Principal"
          children={
            <p className="text-justify bg-[#c0b8a2] sm:mt-8 mt-[-20px] font-bold font-serif text-lg text-primary-background">
              {letterFromSecGen}
            </p>
          }
        />
      </div>
      <div className="mt-15 mb-10">
        <InfoCard
          heading="About Us"
          children={
            <p className="text-justify bg-[#c0b8a2] sm:mt-2 mt-[-30px] font-bold font-serif text-lg text-primary-background">
              {about}
            </p>
          }
        />
      </div>
    </div>
  );
};

export default HomePage;
