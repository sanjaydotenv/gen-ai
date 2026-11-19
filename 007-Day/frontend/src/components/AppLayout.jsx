import { Outlet, useNavigation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthError, refreshSession } from "../store/slices/authSlice.js";

export default function AppLayout() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigation = useNavigation();

  if (loading && navigation.state === "loading") {
    return <main className="loading-screen"><span className="spinner" />Preparing your space…</main>;
  }

  return (
    <>
      {error && (
        <div className="session-banner" role="alert">
          {error}
          <button
            type="button"
            onClick={() => {
              dispatch(clearAuthError());
              dispatch(refreshSession());
            }}
          >
            Try again
          </button>
        </div>
      )}
      <Outlet />
    </>
  );
}
