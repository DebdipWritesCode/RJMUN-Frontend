import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const Hero = () => {
  const navigate = useNavigate();

  const onRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="relative w-full h-screen flex justify-center items-start pt-10">
      {/* Main Box */}
      <div
        className="
          bg-[#9e9776]
          w-[90%] max-w-[680px]
          h-[500px]
          rounded-2xl shadow-2xl
          shadow-black
          z-10
          relative
        ">
        <div className="absolute flex flex-col gap-3 items-center justify-center h-full px-5 sm:px-15 py-3 text-[#1c2d27]">
          <h3 className="text-3xl text-center">WELCOME TO</h3>
          <h1 className="font-bold text-7xl text-center">RJMUN</h1>
          <p className="mt-4 sm:mt-8 text-xl text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt
            necessitatibus totam illo laborum, ipsam provident dolorum excepturi
            eligendi amet ducimus non, modi velit labore dicta doloribus
            veritatis tenetur! Ad, eveniet.
          </p>
          <Button
            className="mt-4 sm:mt-8 text-[#d1c19e] bg-[#1c2d27] rounded-2xl text-2xl px-10 py-6"
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
            top-[-200px]
            right-[-300px]
            h-[800px]
            z-20
          "
          alt="Mic"
        />
      </div>
    </div>
  );
};

export default Hero;
