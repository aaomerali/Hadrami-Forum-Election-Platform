import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function ResultsTab() {
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [selectedCandidateName, setSelectedCandidateName] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const candidateSnapshot = await getDocs(collection(db, "candidates"));
        const candidatesData = candidateSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const votesSnapshot = await getDocs(collection(db, "votes"));
        const votesData = votesSnapshot.docs.map((doc) => doc.data());

        const voteCounts = {};
        votesData.forEach((vote) => {
          const cid = vote.candidateId;
          voteCounts[cid] = (voteCounts[cid] || 0) + 1;
        });

        const merged = candidatesData.map((candidate) => ({
          ...candidate,
          votes: voteCounts[candidate.candidateId] || 0,
        }));

        setCandidates(merged);
      } catch (error) {
        console.error("خطأ أثناء جلب النتائج:", error);
      }
    };

    fetchResults();
  }, []);

  const handleViewVoters = async (candidateId, candidateName) => {
    try {
      // جلب كل الأصوات لهذا المرشح
      const votesSnapshot = await getDocs(
        query(collection(db, "votes"), where("candidateId", "==", candidateId))
      );

      const voteIds = votesSnapshot.docs.map((doc) => doc.data().voteId);

      if (voteIds.length === 0) {
        setVoters([]);
        setSelectedCandidateName(candidateName);
        setShowModal(true);
        return;
      }

      // جلب كل المستخدمين الذين قاموا بالتصويت لهذا المرشح
      const usersSnapshot = await getDocs(collection(db, "users"));
      const matchedVoters = usersSnapshot.docs
        .map((doc) => doc.data())
        .filter((user) => voteIds.includes(user.voteId));

      setVoters(matchedVoters);
      setSelectedCandidateName(candidateName);
      setShowModal(true);
    } catch (error) {
      console.error("خطأ أثناء جلب المصوتين:", error);
    }
  };

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

      <Section
        title="الهيئة التنفيذية"
        data={executiveCandidates}
        handleViewVoters={handleViewVoters}
      />

      <Section
        title="هيئة الرقابة والتفتيش"
        data={oversightCandidates}
        handleViewVoters={handleViewVoters}
      />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded max-w-md w-full shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-[#993433]">
              المصوتين لـ {selectedCandidateName}
            </h3>
            {voters.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-gray-800 max-h-60 overflow-y-auto">
                {voters.map((voter, idx) => (
                  <li key={idx}>{voter.name} ({voter.email})</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">لا يوجد مصوتين لهذا المرشح.</p>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-[#993433] text-white px-4 py-2 rounded"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, data, handleViewVoters }) {
  return (
    <>
      <h2 className="text-xl font-bold mb-3 text-[#993433]">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {data.map((candidate) => (
          <div
            key={candidate.id}
            className="bg-white shadow rounded p-4 border flex flex-col justify-between"
          >
            <div className="space-y-2 mb-4">
              <h3 className="text-lg font-bold text-[#993433]">{candidate.name}</h3>
              <p className="text-gray-700">المنصب: {candidate.position}</p>
              <p className="text-gray-700">عدد الأصوات: {candidate.votes}</p>
            </div>
            <button
              onClick={() => handleViewVoters(candidate.candidateId, candidate.name)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded mt-auto cursor-pointer"
            >
              عرض المصوتين
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
