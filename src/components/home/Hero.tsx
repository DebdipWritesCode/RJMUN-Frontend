const Hero = () => {
  return (
    <div className="relative w-full h-screen flex justify-center items-start pt-10">
      {/* Flags image - hidden on small screens */}
      <img
        src="./images/Flags2.png"
        className="
          hidden sm:block
          absolute
          top-[60px] md:top-[80px]
          left-[calc(50%-300px)] md:left-[calc(50%-600px)]
          h-[400px] md:h-[500px] lg:h-[600px]
          z-20
          rotate-[-10deg]
        "
        alt="Flags"
      />

      {/* Main Box - fully responsive */}
      <div
        className="
          bg-[#9e9776]
          w-[90%] sm:w-[500px] md:w-[600px] lg:w-[680px]
          h-[300px] sm:h-[400px] md:h-[500px] lg:h-[560px]
          rounded-2xl shadow-2xl
          z-10
        "
      />

      {/* Mic image - hidden on small screens */}
      <img
        src="./images/Mic.png"
        className="
          hidden sm:block
          absolute
          top-0
          right-0
          h-[400px] md:h-[500px] lg:h-[600px]
          translate-x-[5%]
          z-20
        "
        alt="Mic"
      />
    </div>
  );
};

export default Hero;
