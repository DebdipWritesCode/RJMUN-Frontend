import InfoCard from "@/components/cards/InfoCard";
import Date from "@/components/home/Date";
import Hero from "@/components/home/Hero";
import Timer from "@/components/home/Timer";
import LetterComponent from "@/components/home/LetterComponent";
import { letterFromPrincipal, letterFromSecGen } from "@/utils/letter";
import { about } from "@/utils/about";
import { EVENT_COMMITTEES_PATH } from "@/utils/constants";

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
              src={EVENT_COMMITTEES_PATH}
              alt="Committees"
              className="w-full h-auto sm:mt-6 mt-[-70px]"
            />
          }
        />
      </div>
      <div className="mt-15">
        <InfoCard
          heading="Letter from Principal"
          children={<LetterComponent content={letterFromPrincipal} />}
        />
      </div>
      <div className="mt-15">
        <InfoCard
          heading="Letter from Secretary General"
          children={<LetterComponent content={letterFromSecGen} />}
        />
      </div>
      <div className="mt-15 mb-10">
        <InfoCard
          heading="About Us"
          children={<LetterComponent content={about} />}
        />
      </div>
    </div>
  );
};

export default HomePage;
