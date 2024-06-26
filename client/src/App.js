import Header from "./components/Header";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import Error from "./components/Error";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { LoginContext } from "./components/ContextProvider/Context";

// add new
import Home from "./elements/Home";
import Register from "./elements/Register";
import Edit from "./elements/Edit";
import Details from "./elements/Details";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  const [data, setData] = useState(false);

  const { logindata, setLoginData } = useContext(LoginContext);

  const history = useNavigate();

  const DashboardValid = async () => {
    let token = localStorage.getItem("usersdatatoken");

    const res = await fetch("/validuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    const data = await res.json();

    if (data.status === 401 || !data) {
      console.log("user not valid");
    } else {
      console.log("user verify");
      setLoginData(data);
      history("/dash");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      DashboardValid();
      setData(true);
    }, 2000);
  }, []);

  return (
    <div style={{ overflow: "hidden" }}>
      {data ? (
        <>
          <Header />

          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dash" element={<Dashboard />} />
            <Route path="*" element={<Error />} />
            {/* add new  */}
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/view/:id" element={<Details />} />
          </Routes>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          Loading... &nbsp;
          <CircularProgress />
        </Box>
      )}
    </div>
  );
}

export default App;
