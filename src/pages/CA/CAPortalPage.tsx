import CaForm from "@/components/ca/CaFORM"
import { ToastContainer } from "react-toastify"

const CAPortalPage = () => {
  return (
    <div className="">
      <CaForm />

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
  )
}

export default CAPortalPage