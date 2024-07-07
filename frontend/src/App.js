import { useEffect, useState } from "react";
import {
  Link,
  Navigate,
  RouterProvider,
  createBrowserRouter
} from "react-router-dom";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import axios from "axios";
import Home from "./Pages/Home";
import PrivateRoute from "./Pages/PrivateRoute";
import Activities from "./Pages/Activities";


function App() {

  axios.defaults.baseURL = 'http://localhost:3002';

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (username, password) => {
    const result = await axios.get('/userLogin',{ params: { username, password: password  } })
    if(result.data.message===true){
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("username",username);
        sessionStorage.setItem("id",result.data.id);
      }
      else{
        console.log("Login failed");
      }
  };

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(storedIsLoggedIn === "true");
 }, []);


  const router = createBrowserRouter([
        {
          path: "/",
          // element:<h1>Home</h1>,
           element: isLoggedIn ? <Navigate to="/dashboard" replace /> : <SignIn handleLogin={handleLogin} />,
        },
        {
          path:"signup",
          element:<SignUp/>
        },
        {
          path:"dashboard",
          element: <PrivateRoute><Home /></PrivateRoute>,
          children: [
            { path: "", element: <Activities/> },
            { path:"activity",element:<Activities />}
          ]},
        {
          path:"activities",
          element:<Activities/>
        }
    ])


  return (
    <RouterProvider router={router} />
  );
}

export default App;
