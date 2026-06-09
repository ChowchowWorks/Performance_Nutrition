import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase";

const RequireAuth = () => {
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      const loginTime = localStorage.getItem("loginTime");
      const now = Date.now();

      if (currentUser && loginTime) {
        if (now - Number(loginTime) > SEVEN_DAYS) {
          await signOut(auth);
          localStorage.removeItem("token");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("loginTime");
          setUser(null);
        } else {
          setUser(currentUser);
        }
      } else {
        if (!loginTime) {
          await signOut(auth);
          localStorage.removeItem("token");
          localStorage.removeItem("userEmail");
        }

        setUser(null);
      }

      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  if (checkingAuth) {
    return <div> Checking authentication... </div>;
  }

  if (!user) {
    return <Navigate to = "/login" state = {{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;

