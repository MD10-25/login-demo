import "../App.css";
import { Outlet, useNavigation } from "react-router-dom";
import AuthStatus from "./AuthStatus";
import Navigation from "./Navigation";
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';


function Layout() {
  const navigation = useNavigation();


  return (
      <div className="App">
        <header>
          <p>header</p>
          <AuthStatus/>
         <Navigation/>
        </header>
        <main>
          {navigation.state === "loading" ? <p>loading...</p> : <Outlet />}
        </main>
        <footer>
          <p>footer</p>
        </footer>
        <ToastContainer autoClose={5000} hideProgressBar position="top-center" />
      </div>
  );
}

export default Layout;
