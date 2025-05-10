import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase"; 
import logo from '../assets/logo.png';

export default function VoterLogin() {
  const [email, setEmail] = useState("");
  const [voteCode, setVoteCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !voteCode) {
      setError("يرجى إدخال البريد الإلكتروني ورقم التصويت");
      return;
    }

    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("لا يوجد مستخدم بهذا البريد الإلكتروني.");
        return;
      }

      const userData = querySnapshot.docs[0].data();

      if (userData.voteId !== voteCode) {
        setError("رقم التصويت غير صحيح.");
        return;
      }

      // (اختياري) إذا أردت تخزينه أيضًا في localStorage
      localStorage.setItem("voterEmail", email);
      localStorage.setItem("voteCode", voteCode);

      // ✅ إعادة التوجيه مع تضمين voteId في الرابط
      navigate(`/vote/${voteCode}`);

    } catch (err) {
      console.error("خطأ أثناء التحقق من المستخدم:", err);
      setError("حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى لاحقًا.");
    }
  };

  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="شعار المنصة" className="mx-auto h-20 w-45 object-contain" />
        </div>

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
