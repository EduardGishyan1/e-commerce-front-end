import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./loginForm.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = Cookies.get("accessToken");

        if (accessToken) {
            navigate("/profile");
            return;
        }
    }, [navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
            const response = await axios.post(
                `${BACKEND_URL}/auth/login`,
                { email, password },
                { withCredentials: true }
            );

            const data = response.data;
            console.log("Login successful:", data);


            Cookies.set("accessToken", data.accessToken, { secure: true, sameSite: "strict" });
            Cookies.set("refreshToken", data.refreshToken, {secure: true, sameSite: "strict" })

            navigate(`/profile`);
        } catch (err) {
            if (err.response.status == 401 && err.response.data) {
                setError("Invalid email or password");
            } else {
                console.log(err)
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form">
            <h1 className="title">Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="fieldWrapper">
                    <p>Email address</p>
                    <input
                        className="loginField"
                        type="email"
                        placeholder="user@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="fieldWrapper">
                    <p>Password</p>
                    <input
                        className="loginField"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <a className="forgotPassword" href="#">
                        forgot password
                    </a>
                </div>

                {error && <p style={{ color: "red", marginTop: "5px" }}>{error}</p>}
                <div className="loginButtonWrapper">
                <input
                    className="loginButton"
                    type="submit"
                    value={loading ? "Logging in..." : "Login"}
                    disabled={loading}
                />
                </div>
            </form>
        </div>
    );
};

export default Login;
