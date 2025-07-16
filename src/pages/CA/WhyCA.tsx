import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const benefits = [
  {
    text: "Certificate to add in your Resume. You can use this experience to build a portfolio.",
    image: "/images/ca-props/2.png",
    alignment: "left",
  },
  {
    text: "Campus Ambassador at our fest gets the chance to represent their college in our fest.",
    image: "/images/ca-props/1.png",
    alignment: "right",
  },
  {
    text: "Free entry for the Campus Ambassador on 30+ participation.",
    image: "/images/ca-props/2.png",
    alignment: "left",
  },
  {
    text: "You can use this experience to grab internship opportunities from our sponsors.",
    image: "/images/ca-props/1.png",
    alignment: "right",
  },
];

const WhyCA = () => {
  return (
    <div className="flex flex-col items-center px-4">
      <h1 className="font-bold sm:text-[100px] text-[40px] sm:mb-20 mb-10 text-center">
        Why Become a CA?
      </h1>

      <Button className="mb-10">
        <Link to="/ca" className="text-[#d1c19e] font-semibold text-lg py-10 px-4">
          Register as CA
        </Link>
      </Button>

      <div className="flex flex-col gap-12 w-full max-w-6xl">
        {benefits.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col sm:flex-row ${
              item.alignment === "left" ? "sm:flex-row" : "sm:flex-row-reverse"
            } items-center gap-2`}
          >
            <img
              src={item.image}
              alt={`CA Benefit ${index + 1}`}
              className="w-[80px] h-[80px] sm:w-[150px] sm:h-[150px]"
            />
            <p className="text-[#d1c19e] font-mono text-lg sm:text-2xl text-center sm:text-left max-w-xl leading-relaxed">
              {item.text}
            </p>
            <div className="w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] invisible sm:visible" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyCA;
