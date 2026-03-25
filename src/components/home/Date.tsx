
const Date = () => {
  return (
    <div className="mt-20 flex flex-col items-center gap-2">
      {/* Main Festival Dates */}
      <p 
        className="font-bold text-primary sm:text-8xl text-4xl text-center leading-tight" 
        style={{ fontFamily: '"Cinzel", serif', fontWeight: 800, letterSpacing: '0.05em' }}
      >
        25-30 June 2026
      </p>
      
      {/* Divider/Accent */}
      <div className="w-24 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 my-3"></div>
      
      {/* MUN Subtitle */}
      <p 
        className="text-primary sm:text-5xl text-2xl text-center font-semibold"
        style={{ fontFamily: '"Cinzel", serif', fontWeight: 600, letterSpacing: '0.03em' }}
      >
        MUN on 25-27 June 2026
      </p>
    </div>
  )
}

export default Date