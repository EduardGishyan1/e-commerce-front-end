import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./userProfile.css";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [sidebarWidth, setSidebarWidth] = useState(80);
  const [isResizing, setIsResizing] = useState(false);
  const [user, setUser] = useState(null);
  const COLLAPSED = 80;
  const navigate = useNavigate();

  const stopResizing = () => setIsResizing(false);
  const resize = (e) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth > COLLAPSED && newWidth < 600) setSidebarWidth(newWidth);
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
        navigate("/")
    }
    const fetchUser = async () => {
      try {
        const accessToken = Cookies.get("accessToken");
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/users/me`,
          { headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {} }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="userProfile">
      <Sidebar
        user={user}
        sidebarWidth={sidebarWidth}
        setSidebarWidth={setSidebarWidth}
      />
      <div className="userData">
        <Header />
        <div className="userInfo">
          {user ? (
            <div className="userCard">
              <div className="userAvatarSection">
                <img
                  src={
                    // user.image_url !== "string"
                    //   ? user.image_url
                       "https://avataaars.io/?avatarStyle=Transparent&topType=Hat&accessoriesType=Blank&hairColor=Black&facialHairType=BeardLight&facialHairColor=Auburn&clotheType=Hoodie&eyeType=Side&eyebrowType=UnibrowNatural&mouthType=Disbelief&skinColor=Tanned"
                  }
                  alt="User Avatar"
                  className="userAvatar"
                />
                                <p>{user.role}</p>

                <h2 className="userFullName">
                  {user.name} {user?.surname}
                </h2>
                <p className="usernameHandle">@{user?.username}</p>
              </div>

              <div className="userInfoSection">
                <div className="userContactInfo">
                  <h3>{user?.name}'s Info</h3>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Phone:</strong> {user?.phone_number}</p>
                  <p><strong>Country:</strong> {user?.sensitive_info?.country}</p>
                  <p><strong>City:</strong> {user?.sensitive_info?.city}</p>
                  <p><strong>State:</strong> {user?.sensitive_info?.state}</p>
                  <p><strong>Street:</strong> {user?.sensitive_info?.street}</p>
                  <p><strong>ZIP Code:</strong> {user?.sensitive_info?.zip_code}</p>
                </div>
              </div>
            </div>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
