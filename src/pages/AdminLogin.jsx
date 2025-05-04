import { useState } from "react";
import logo from '../assets/logo.png'
import { useNavigate } from "react-router-dom";


export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
    // لاحقًا سيتم ربطها مع Firebase
    console.log("Logging in with:", email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm text-center"
      >
        {/* شعار المنصة */}
        <div className="mb-4">
          <img
            src={logo} // قم بتعديل المسار حسب موقع الشعار الفعلي
            alt="شعار المنصة"
            className="mx-auto h-20 w-45 object-contain"
          />
          <p className="mt-2 text-gray-600 text-2xl font-bold mb-10">المنصة الالكترونية للانتخابات</p>
          <hr />
        </div>

        <h2 className="text-2xl font-bold mb-4 mt-10">تسجيل دخول الادمن</h2>

        <input
          type="email"
          placeholder="البريد الإلكتروني"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-[#993433] text-white py-2 rounded cursor-pointer hover:bg-[#993533d2] "
        >
          تسجيل الدخول
        </button>
      </form>
    </div>
  );
}
