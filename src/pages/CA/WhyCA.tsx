import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { benefits } from "@/utils/ca-benefits";

const WhyCA = () => {
  return (
    <div className="flex flex-col items-center px-4">
      <h1 className="font-bold sm:text-[100px] text-primary text-[40px] sm:mb-20 mb-10 text-center">
        Why Become a CA?
      </h1>

      <Button className="mb-10">
        <Link
          to="/ca"
          className="text-accent-soft font-semibold text-lg py-10 px-4">
          Register as CA
        </Link>
      </Button>

      <ul className="flex flex-col gap-4 list-disc text-accent-soft font-mono text-lg sm:hidden max-w-xl px-6">
        {benefits.map((item, index) => (
          <li key={index}>{item.text}</li>
        ))}
      </ul>

      <div className="hidden sm:flex flex-col gap-12 w-full max-w-6xl">
        {benefits.map((item, index) => (
          <div
            key={index}
            className={`flex sm:flex-row ${
              item.alignment === "left" ? "sm:flex-row" : "sm:flex-row-reverse"
            } items-center gap-2`}>
            <img
              src={item.image}
              alt={`CA Benefit ${index + 1}`}
              className="w-[80px] h-[80px] sm:w-[150px] sm:h-[150px]"
            />
            <p className="text-primary font-mono text-lg sm:text-2xl text-left max-w-xl leading-relaxed">
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