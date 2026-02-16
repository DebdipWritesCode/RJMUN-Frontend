interface ProfileCardProps {
  imageSrc: string;
  heading: string;
  subheading: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  imageSrc,
  heading,
  subheading,
}) => {
  return (
    <div
      className="rounded-xl bg-cover bg-center p-4 text-center relative flex justify-center text-primary-foreground mb-3 w-[300px] h-[300px] transition-transform duration-500 transform hover:scale-106"
      style={{ backgroundImage: `url('/images/ContainerBG.png')` }}>
      <div className="flex justify-center">
        <img
          src={imageSrc}
          alt={heading}
          className="h-72 w-auto object-contain absolute top-[-20px]"
        />
      </div>
      <div className="mt-4 rounded-lg bg-primary border-6 border-muted-warm w-[108%] absolute bottom-[-40px] px-4 py-2 text-primary-foreground">
        <h3 className="text-lg font-semibold">{heading}</h3>
        <p className="text-sm">{subheading}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
