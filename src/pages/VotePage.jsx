import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ← تأكد من استخدام react-router-dom
import logo from '../assets/logo.png';

export default function VotePage() {
  const navigate = useNavigate(); // ← لاستخدام التنقل للصفحات

  const candidates = [
    { name: "أحمد يوسف", position: "الهيئة التنفيذية", votes: 120 },
    { name: "أحمد نبيل", position: "الهيئة التنفيذية", votes: 98 },
    { name: "محمد سعيد", position: "الهيئة التنفيذية", votes: 105 },
    { name: "أنور فؤاد", position: "الهيئة التنفيذية", votes: 110 },
    { name: "جمال سالم", position: "هيئة الرقابة والتفتيش", votes: 87 },
    { name: "مهند خالد", position: "هيئة الرقابة والتفتيش", votes: 92 },
  ];

  const [selectedExecutives, setSelectedExecutives] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSelect = (candidate) => {
    setError("");
    setSuccess("");

    if (candidate.position === "الهيئة التنفيذية") {
      const isSelected = selectedExecutives.find((c) => c.name === candidate.name);
      if (isSelected) {
        setSelectedExecutives(selectedExecutives.filter((c) => c.name !== candidate.name));
      } else {
        if (selectedExecutives.length >= 3) {
          setError("يمكنك اختيار 3 مرشحين فقط من الهيئة التنفيذية.");
        } else {
          setSelectedExecutives([...selectedExecutives, candidate]);
        }
      }
    } else if (candidate.position === "هيئة الرقابة والتفتيش") {
      if (selectedSupervisor && selectedSupervisor.name === candidate.name) {
        setSelectedSupervisor(null);
      } else {
        setSelectedSupervisor(candidate);
      }
    }
  };

  const handleSubmit = () => {
    if (selectedExecutives.length !== 3 || !selectedSupervisor) {
      setError("يرجى اختيار 3 من الهيئة التنفيذية وواحد من هيئة الرقابة والتفتيش.");
      return;
    }

    setError("");
    navigate("/vote-success");
    

    console.log("تم التصويت لـ:", {
      "الهيئة التنفيذية": selectedExecutives,
      "هيئة الرقابة والتفتيش": selectedSupervisor,
    });
  };

  const handleLogout = () => {
    navigate("/voter-login"); // ← غيّر هذا المسار إذا كانت صفحة تسجيل الدخول مختلفة
  };

  const renderCandidate = (candidate, isSelected) => (
    <div
      key={candidate.name}
      onClick={() => handleSelect(candidate)}
      className={`cursor-pointer p-4 border rounded shadow ${
        isSelected ? "bg-green-100 border-green-500" : "bg-white"
      } hover:bg-gray-100 transition`}
    >
      <h2 className="font-bold text-lg text-[#993433]">{candidate.name}</h2>
      <p className="text-sm text-gray-700">المنصب: {candidate.position}</p>
    </div>
  );

  const executiveCandidates = candidates.filter(c => c.position === "الهيئة التنفيذية");
  const supervisorCandidates = candidates.filter(c => c.position === "هيئة الرقابة والتفتيش");

  return (
    <div className="p-6 max-w-5xl mx-auto mt-8" dir="rtl">
      {/* شريط علوي يحتوي على الشعار وزر تسجيل الخروج */}
      <div className="flex justify-between items-center mb-10">
        <img
          src={logo}
          alt="شعار المنصة"
          className="w-40 h-auto"
        />
        <button
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-gray-300 text-sm text-gray-800 px-4 py-2 rounded"
        >
          تسجيل الخروج
        </button>
      </div>

      <h1 className="text-2xl font-bold text-center mb-4 text-[#993433]">
        صفحة التصويت
      </h1>

      <p className="text-center text-lg text-gray-600 mb-10">
        اختر <strong>3</strong> مرشحين من <strong>الهيئة التنفيذية</strong> ومرشحاً <strong>واحداً</strong> من <strong>هيئة الرقابة والتفتيش</strong>
      </p>

      {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
      {success && <div className="text-green-600 mb-4 text-center">{success}</div>}

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">الهيئة التنفيذية</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {executiveCandidates.map((candidate) =>
            renderCandidate(candidate, selectedExecutives.some(c => c.name === candidate.name))
          )}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">هيئة الرقابة والتفتيش</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {supervisorCandidates.map((candidate) =>
            renderCandidate(candidate, selectedSupervisor?.name === candidate.name)
          )}
        </div>
      </section>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-[#993433] hover:bg-[#b63f3f] text-white py-2 px-6 rounded text-lg"
        >
          تأكيد التصويت
        </button>
      </div>
    </div>
  );
}
