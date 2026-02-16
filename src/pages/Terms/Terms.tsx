import {
  definition,
  codeOfConduct,
  paymentPoints,
  miscellaneousPoints,
} from "@/utils/terms";

const Terms = () => {
  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-bold sm:text-[60px] text-primary text-[40px] sm:mb-20 mb-15 text-center">
        TERMS AND CONDITIONS
      </h1>

      <div className="w-full space-y-16">
        <section className="w-full">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6 text-primary">
            Definitions
          </h3>
          <div className="border-l-2 border-border pl-6">
            <p className="text-base leading-relaxed text-primary">{definition}</p>
          </div>
        </section>

        <section className="w-full">
          <h3 className="text-lg sm:text-2xl text-primary font-semibold mb-6">Payment</h3>
          <div className="border-l-2 border-border pl-6 text-primary">
            <ul className="space-y-4">
              {paymentPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-current rounded-full mt-2 mr-4 flex-shrink-0 opacity-60"></span>
                  <span className="text-base leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="w-full text-primary">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6">
            Code of Conduct
          </h3>
          <div className="border-l-2 border-border pl-6">
            <ul className="space-y-4">
              {codeOfConduct.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-current rounded-full mt-2 mr-4 flex-shrink-0 opacity-60"></span>
                  <span className="text-base leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="w-full text-primary">
          <h3 className="text-lg sm:text-2xl font-semibold mb-6">
            Miscellaneous
          </h3>
          <div className="border-l-2 border-border pl-6">
            <ul className="space-y-4">
              {miscellaneousPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-current rounded-full mt-2 mr-4 flex-shrink-0 opacity-60"></span>
                  <span className="text-base leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Terms;
