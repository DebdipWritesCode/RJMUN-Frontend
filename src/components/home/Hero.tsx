const Hero = () => {
  return (
    <div className="relative w-full h-screen flex justify-center items-start pt-10">
      {/* Main Box */}
      <div
        className="
          bg-[#9e9776]
          w-[90%] max-w-[680px]
          h-[500px]
          rounded-2xl shadow-2xl
          z-10
          relative
        "
      >
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
