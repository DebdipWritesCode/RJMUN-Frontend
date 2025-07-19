import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const Hero = () => {
  const navigate = useNavigate();

  const onRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="relative w-full flex justify-center items-start pt-10">
      {/* Main Box */}
      <div
        className="
        bg-[#9e9776]
        w-[90%] max-w-[680px]
        h-[600px] lg:h-[500px]
        rounded-2xl shadow-2xl
        shadow-black
        z-10
        relative
        main-box
      ">
        <div className="absolute flex flex-col gap-3 items-center justify-center h-full px-5 sm:px-15 py-3 text-[#1c2d27]">
          <h3 className="text-3xl text-center">WELCOME TO</h3>
          <h1 className="font-bold text-6xl text-center sm:text-7xl">RJMUN</h1>
          <p className="mt-4 sm:mt-8 text-xl sm:text-center text-justify">
            Step into the arena of diplomacy, dialogue, and debate. At RJMUN, we
            don’t just simulate global affairs — we shape perspectives,
            challenge narratives, and empower voices. This is your platform to
            think, speak, and lead.
          </p>
          <Button
            className="mt-4 sm:mt-8 text-[#d1c19e] bg-[#1c2d27] rounded-2xl text-xl sm:text-2xl px-10 py-6"
            onClick={onRegisterClick}>
            REGISTER NOW
          </Button>
        </div>
        {/* Flags image - hide on small screens */}
        <img
          src="./images/Flags2.png"
          className="
            hidden md:block
            absolute
            top-[60px]
            left-[-280px]
            h-[550px]
            z-20
            rotate-[-10deg]
          "
          alt="Flags"
        />

        {/* Mic image - hide on small screens */}
        <img
          src="./images/Mic2.png"
          className="
            hidden md:block
            absolute
            top-[-80px]
            right-[-250px]
            h-[600px]
            z-20
          "
          alt="Mic"
        />
      </div>
    </div>
  );
};

export default Hero;
