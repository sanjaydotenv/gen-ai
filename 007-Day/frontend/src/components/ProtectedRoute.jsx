import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const user = useSelector((state) => state.auth.user);
  return user ? <Outlet /> : null;
}
