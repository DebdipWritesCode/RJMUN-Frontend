interface ProfileCardProps {
  imageSrc: string;
  heading: string;
  subheading: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ imageSrc, heading, subheading }) => {
  return (
    <div
      className="rounded-xl bg-cover bg-center p-4 text-center"
      style={{ backgroundImage: `url('/images/ContainerBG.png')` }}
    >
      <div className="flex justify-center">
        <img src={imageSrc} alt={heading} className="max-h-72 w-auto object-contain" />
      </div>
      <div className="mt-4 rounded-lg bg-[#1C1F26] px-4 py-2 text-white">
        <h3 className="text-lg font-semibold">{heading}</h3>
        <p className="text-sm">{subheading}</p>
      </div>
    </div>
  );
};

export default ProfileCard;