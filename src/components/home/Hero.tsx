import { useNavigate } from "react-router-dom";
import {
  EVENT_LEFT_IMG_PATH,
  EVENT_RIGHT_IMG_PATH,
  REGISTER_PATH,
  SUN_PATH,
} from "@/utils/constants";

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
        bg-black/20
        border-2
        w-[90%] max-w-[680px]
        h-[600px] lg:h-[500px]
        rounded-2xl shadow-2xl
        shadow-black
        relative
        main-box
      "
        style={{ borderColor: "#f0d07e" }}>
        <div className="absolute flex flex-col gap-3 items-center justify-center h-full px-5 sm:px-15 py-3 text-primary">
          <h3
            className="text-3xl text-center"
            style={{ fontFamily: '"Cinzel", serif', fontWeight: 600 }}>
            WELCOME TO
          </h3>
          <h1
            className="font-bold text-3xl text-center sm:text-7xl"
            style={{ fontFamily: '"Cinzel", serif', fontWeight: 600 }}>
            DESTINIQUE
          </h1>
          <p
            className="mt-4 sm:mt-8 text-xl sm:text-center text-justify shadow-2xl"
            style={{
              textShadow: `
    0 2px 4px rgba(0,0,0,0.9),
    0 6px 12px rgba(0,0,0,0.8),
    0 0 25px rgba(0,0,0,0.9)
  `,
              fontFamily: '"Cinzel", serif',
              fontWeight: 600,
            }}>
            DESTINIQUE is a career fest helping students and parents explore
            future paths through insights and interactive sessions,
            guiding informed decisions and a bright future.
          </p>
          <button className="mt-4 sm:mt-8" onClick={onRegisterClick}>
            <img
              src={REGISTER_PATH}
              alt="Register Now"
              className="hover:opacity-80 transition-opacity h-25"
            />
          </button>
        </div>
        {/* Left Character image - hide on small screens */}
        <img
          src={EVENT_LEFT_IMG_PATH}
          className="
            hidden md:block
            absolute
            top-[80px]
            left-[-320px]
            h-[500px]
            w-[500px]
            z-20
          "
          alt="Left Character"
        />

        {/* Right Character image - hide on small screens */}
        <img
          src={EVENT_RIGHT_IMG_PATH}
          className="
            hidden md:block
            absolute
            top-[-80px]
            right-[-180px]
            h-[600px]
            z-20
          "
          alt="Right Character"
        />

        <img
          src={SUN_PATH}
          onClick={onRegisterClick}
          className="
            hidden md:block
            absolute
            top-[200px]
            right-[20px]
            h-[600px]
            opacity-30
            z-20
            pointer-events-none
          "
          alt="Upper Sun"
        />

        <img
          src={SUN_PATH}
          className="
            hidden md:block
            absolute
            top-[-300px]
            right-[20px]
            h-[600px]
            opacity-30
            z-20
            pointer-events-none
          "
          alt="Lower Sun"
        />
      </div>
    </div>
  );
};

export default Hero;
