import { ToastContainer } from "react-toastify";

const ToastNotification = () => {
  return(
    <ToastContainer 
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      theme="colored"
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default ToastNotification;