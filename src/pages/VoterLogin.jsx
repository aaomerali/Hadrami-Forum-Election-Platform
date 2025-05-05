import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png'


export default function VoterLogin() {
  const [email, setEmail] = useState("");
  const [voteCode, setVoteCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !voteCode) {
      setError("يرجى إدخال البريد الإلكتروني ورقم التصويت");
      return;
    }

    // تخزين مؤقت
    localStorage.setItem("voterEmail", email);
    localStorage.setItem("voteCode", voteCode);

    navigate("/vote");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        
        {/* شعار المنصة */}
        <div className="flex justify-center mb-4">
          {/* قم بإضافة src للشعار هنا لاحقًا */}
          <img
            src={logo} // قم بتعديل المسار حسب موقع الشعار الفعلي
            alt="شعار المنصة"
            className="mx-auto h-20 w-45 object-contain"
          />
        </div>

        {/* عبارة ترحيب */}
        <h1 className="text-[22px] font-bold mb-4 text-center text-[#993433]">
        مرحبًا بك ..<br />في المنصة الإلكترونية للانتخابات
        </h1>
        <p className="text-lg font-medium text-center text-gray-700 mb-6">
            قم بإدخال بريدك الإلكتروني ورقم التصويت الخاص بك لتتمكن من التصويت
        </p>

        

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">البريد الإلكتروني</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">رقم التصويت</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={voteCode}
              onChange={(e) => setVoteCode(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#993433] text-white py-2 rounded hover:bg-[#b63f3f]"
          >
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
}
