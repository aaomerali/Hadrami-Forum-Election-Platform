import { useState } from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword , signOut} from "firebase/auth";
import { auth } from "../firebase/firebase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm text-center"
      >
        <div className="mb-4">
          <img
            src={logo}
            alt="شعار المنصة"
            className="mx-auto h-20 w-45 object-contain"
          />
          <p className="mt-2 text-gray-600 text-2xl font-bold mb-10">
            المنصة الالكترونية للانتخابات
          </p>
          <hr />
        </div>

        <h2 className="text-2xl font-bold mb-4 mt-10">تسجيل دخول الادمن</h2>

        <input
          type="email"
          placeholder="البريد الإلكتروني"
          className="w-full mb-3 p-2 border rounded text-right"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          className="w-full mb-4 p-2 border rounded text-right"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <div className="text-red-600 text-sm mb-4">{error}</div>
        )}

        <button
          type="submit"
          className="w-full bg-[#993433] text-white py-2 rounded cursor-pointer hover:bg-[#993533d2]"
        >
          تسجيل الدخول
        </button>
      </form>
    </div>
  );
}
