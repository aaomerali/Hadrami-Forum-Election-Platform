import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function VoteSuccess() {
  const navigate = useNavigate();

  const handleReturn = () => {
    localStorage.removeItem("voterEmail");
    localStorage.removeItem("voteCode");
    navigate("/voter-login");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto mt-16 text-center" dir="rtl">
      {/* شعار المنصة */}
      <div className="flex justify-center mb-8">
        <img src={logo} alt="شعار المنصة" className="w-32 h-auto" />
      </div>

      <h1 className="text-3xl font-bold text-green-600 mb-6">
        ✅ تم تسجيل تصويتك بنجاح!
      </h1>

      <p className="text-lg text-gray-700 mb-6">
        نشكرك على مشاركتك في هذه العملية الانتخابية. صوتك مهم ويساهم في بناء مستقبل أفضل للملتقى.
      </p>

      <button
        onClick={handleReturn}
        className="bg-[#993433] hover:bg-[#b63f3f] text-white px-6 py-3 rounded text-lg"
      >
        العودة إلى صفحة تسجيل الدخول
      </button>
    </div>
  );
}


