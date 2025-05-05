import { useState } from "react";

export default function ResultsTab() {
  const [candidates] = useState([
    {
      name: "أحمد يوسف",
      position: "الهيئة التنفيذية",
      votes: 120,
    },
    {
      name: "أحمد نبيل",
      position: "الهيئة التنفيذية",
      votes: 98,
    },
    {
      name: "محمد سعيد",
      position: "الهيئة التنفيذية",
      votes: 105,
    },
    {
      name: "أنور فؤاد",
      position: "الهيئة التنفيذية",
      votes: 110,
    },
    {
      name: "جمال سالم",
      position: "هيئة الرقابة والتفتيش",
      votes: 87,
    },
    {
      name: "مهند خالد",
      position: "هيئة الرقابة والتفتيش",
      votes: 92,
    },
  ]);

  const handleViewVoters = (name) => {
    console.log(`عرض المصوتين لـ ${name}`);
  };

  // تقسيم المترشحين حسب المنصب
  const executiveCandidates = candidates.filter(
    (c) => c.position === "الهيئة التنفيذية"
  );
  const oversightCandidates = candidates.filter(
    (c) => c.position === "هيئة الرقابة والتفتيش"
  );

  return (
    <div className="mt-22 p-4 md:p-10" dir="rtl">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        إعلان نتائج التصويت
      </h1>

      {/* الهيئة التنفيذية */}
      <h2 className="text-xl font-bold mb-3 text-[#993433]">
        الهيئة التنفيذية
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {executiveCandidates.map((candidate, index) => (
          <div
            key={index}
            className="bg-white shadow rounded p-4 border flex flex-col justify-between"
          >
            <div className="space-y-2 mb-4">
              <h3 className="text-lg font-bold text-[#993433]">{candidate.name}</h3>
              <p className="text-gray-700">المنصب: {candidate.position}</p>
              <p className="text-gray-700">عدد الأصوات: {candidate.votes}</p>
            </div>
            <button
              onClick={() => handleViewVoters(candidate.name)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded mt-auto cursor-pointer"
            >
              عرض المصوتين
            </button>
          </div>
        ))}
      </div>

      {/* هيئة الرقابة والتفتيش */}
      <h2 className="text-xl font-bold mb-3 text-[#993433]">
        هيئة الرقابة والتفتيش
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {oversightCandidates.map((candidate, index) => (
          <div
            key={index}
            className="bg-white shadow rounded p-4 border flex flex-col justify-between"
          >
            <div className="space-y-2 mb-4">
              <h3 className="text-lg font-bold text-[#993433]">{candidate.name}</h3>
              <p className="text-gray-700">المنصب: {candidate.position}</p>
              <p className="text-gray-700">عدد الأصوات: {candidate.votes}</p>
            </div>
            <button
              onClick={() => handleViewVoters(candidate.name)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded mt-auto cursor-pointer"
            >
              عرض المصوتين
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
