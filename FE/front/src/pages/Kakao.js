import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

export function Kakao() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  useEffect(() => {
    // URL에서 토큰 추출
    const extractedToken = new URL(window.location.href).searchParams.get("token");
    setToken(extractedToken);

    // 토큰이 추출되면 로컬 스토리지에 저장하고 메인 페이지로 리다이렉트
    if (extractedToken) {
      localStorage.setItem("authToken", extractedToken);
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      <Spinner />
    </div>
  );
}
export default Kakao;