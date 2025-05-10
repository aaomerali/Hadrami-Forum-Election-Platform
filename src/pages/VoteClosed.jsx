import { useNavigate } from "react-router-dom";

export default function VoteClosed() {

    const navigate = useNavigate();

    const handleReturn = () => {
        localStorage.removeItem("voterEmail");
        localStorage.removeItem("voteCode");
        navigate("/voter-login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100" dir="rtl">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">عذرًا، التصويت مغلق حاليًا</h1>
        <p className="text-gray-700 mb-6">
          لقد تم إغلاق فترة التصويت، شكرًا لمشاركتكم.
        </p>
        <button
            onClick={handleReturn}
            className="bg-[#993433] hover:bg-[#b63f3f] text-white px-6 py-3 rounded text-lg"
        >
            العودة إلى صفحة تسجيل الدخول
        </button>
      </div>
    </div>
  );
}
