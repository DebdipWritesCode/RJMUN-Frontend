import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import Footer from "@/components/Footer";

const MainLayout = () => {
  return (
    <div
      className="text-[#b1aa8c] flex flex-col w-full min-h-screen"
      style={{
        backgroundImage: "url('/images/BG2.png')",
        backgroundSize: "auto",
        backgroundPosition: "top left",
        backgroundRepeat: "repeat",
      }}
      >
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6 bg-opacity-80">
        <Outlet />
      </main>
      <Footer />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default MainLayout;
