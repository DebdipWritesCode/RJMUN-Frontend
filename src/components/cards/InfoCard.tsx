interface InfoCardProps {
  heading: string;
  children: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ heading, children }) => {
  return (
    <div
      className="rounded-xl bg-cover bg-center p-6 text-white"
      style={{ backgroundImage: `url('/images/ContainerBG.png')` }}>
      <div className="mx-auto max-w-4xl text-center relative flex flex-col items-center">
        <h2 className="mb-4 absolute top-[-50px] inline-block rounded-3xl border-6 border-[#b1aa8c] bg-[#1C1F26] px-8 py-3 text-4xl font-semibold">
          {heading}
        </h2>
        <div className="rounded-b-lg px-6 py-4 text-base leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
