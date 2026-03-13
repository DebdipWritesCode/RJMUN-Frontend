interface InfoCardProps {
  heading: string;
  children: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ heading, children }) => {
  const marginTopClass =
    heading.length > 50 ? "sm:mt-20 mt-40" : "sm:mt-6 mt-20";

  return (
    <div
      className="rounded-xl bg-cover bg-center p-6 text-primary-foreground border-2 relative"
      style={{
        backgroundImage: `url('/images/ContainerBG.png')`,
        borderColor: "#f8c94c",
        fontFamily: '"Cinzel", serif',
      }}>
      <div className="mx-auto max-w-4xl text-center relative flex flex-col items-center">
        <h2 className="mb-4 absolute top-[-50px] inline-block rounded-3xl border-4 border-card-label-border bg-card-label-bg text-card-label-text px-8 py-3 sm:text-4xl text-2xl font-semibold">
          {heading}
        </h2>

        <div
          className={`rounded-b-lg px-6 py-4 text-base leading-relaxed ${marginTopClass}`}>
          {children}
        </div>
      </div>

      <img
        src="/images/sun.png"
        className="
            absolute
            top-[-320px]
            right-[80px]
            h-[600px]
            opacity-30
            pointer-events-none
          "
        alt="Upper Sun"
      />
    </div>
  );
};

export default InfoCard;
