import { EVENT_DATE, FEST_DATE, MUN_DATE } from "@/utils/constants";

const Date = () => {
  return (
    <div className="mt-20 flex flex-col items-center gap-2">
      {/* Main Festival Dates */}
      <p
        className="font-bold text-primary sm:text-8xl text-4xl text-center leading-tight"
        style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 800,
          letterSpacing: "0.05em",
        }}
      >
        {EVENT_DATE}
      </p>

      {/* Divider/Accent */}
      <div className="w-24 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 my-3"></div>

      {/* MUN Subtitle */}
      <p
        className="text-primary sm:text-5xl text-2xl text-center font-semibold"
        style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 600,
          letterSpacing: "0.03em",
        }}
      >
        MUN: {MUN_DATE}
      </p>
      <p
        className="text-primary/90 sm:text-4xl text-xl text-center font-semibold"
        style={{ fontFamily: '"Cinzel", serif', letterSpacing: "0.03em" }}
      >
        DESTINIQUE: {FEST_DATE}
      </p>
    </div>
  );
};

export default Date;
