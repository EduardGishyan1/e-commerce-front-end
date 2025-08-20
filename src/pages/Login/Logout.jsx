import { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    navigate("/", { replace: true });
  }, [navigate]);

  return null;
};

export default Logout;
