import { useDispatch, useSelector } from "react-redux";
import { Sparkles, ArrowUpRight, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import axiosInstance from "../../config/axiosInstance";
import { setUserData } from "../../features/auth/authSlice";
import { Navigate } from "react-router";

export default function DashboardPage() {
  const { userData } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  
  async function hydrateUser() {
    const data = await axiosInstance.get("/auth/me");
    dispatch(setUserData(data.data.user));
  }

  useEffect(() => {
    hydrateUser();
  }, []);

  if (!userData) {
    return <Navigate to={"/"} />;
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Your personal space to create something meaningful.</p>
        </div>

        <div className="dashboard-profile">
          <span className="profile-status"></span>
          <span>Account active</span>
        </div>
      </header>

      <section className="dashboard-main">
        <div className="welcome-card">
          <div className="card-glow"></div>

          <div className="welcome-icon">
            <Sparkles size={27} strokeWidth={1.7} />
          </div>

          <span className="welcome-label">YOUR SPACE, IN FOCUS</span>

          <h2>
            Welcome back,
            <br />
            <span>{userData?.name || "there"}.</span>
          </h2>

          <p className="welcome-description">
            Everything starts with an idea. Take a moment, explore your space
            and make something great happen.
          </p>

          <div className="welcome-bottom">
            <div className="welcome-security">
              <ShieldCheck size={17} />
              <span>Your account is secure</span>
            </div>

            <div className="welcome-arrow">
              <ArrowUpRight size={20} />
            </div>
          </div>
        </div>

        <p className="dashboard-footer">
          A clearer way to your next big thing.
        </p>
      </section>
    </main>
  );
}
