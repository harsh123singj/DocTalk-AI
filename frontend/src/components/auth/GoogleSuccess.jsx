import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const GoogleSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const { loginWithToken } = useAuth();

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        const authenticate = async () => {
            const success = await loginWithToken(token);

            if (success) {
                navigate("/dashboard", { replace: true });
            } else {
                navigate("/login", { replace: true });
            }
        };

        authenticate();
    }, []);

    return (
        <div className="min-h-screen bg-[#0b0e13] text-white flex items-center justify-center">
            <p>Signing you in with Google...</p>
        </div>
    );
};

export default GoogleSuccess;