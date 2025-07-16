import Date from "@/components/home/Date"
import Hero from "@/components/home/Hero"
import Timer from "@/components/home/Timer"

const HomePage = () => {
  return (
    <div className="flex flex-col items-center h-800 mt-4">
      <Hero />
      <Timer />
      <Date />
    </div>
  )
}

export default HomePage