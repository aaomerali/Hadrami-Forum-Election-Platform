import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

export default function DashboardHome() {
  const [stats, setStats] = useState({
    students: 0,
    candidates: 0,
    voted: 0,
    notVoted: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get students
        const usersSnapshot = await getDocs(collection(db, "users"));
        const users = usersSnapshot.docs.map((doc) => doc.data());
        const totalStudents = users.length;

        // Get candidates
        const candidatesSnapshot = await getDocs(collection(db, "candidates"));
        const totalCandidates = candidatesSnapshot.size;

        // Get votes
        const votesSnapshot = await getDocs(collection(db, "votes"));
        const votedIds = new Set(
          votesSnapshot.docs.map((doc) => doc.data().voteId)
        );

        const totalVoted = votedIds.size;
        const totalNotVoted = totalStudents - totalVoted;

        setStats({
          students: totalStudents,
          candidates: totalCandidates,
          voted: totalVoted,
          notVoted: totalNotVoted,
        });
      } catch (err) {
        console.error("فشل تحميل الإحصائيات:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 mt-22 md:p-10" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-[#993433] text-center">إحصائيات المنصة</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox title="عدد الطلاب" value={stats.students} color="bg-[#993433] " />
        <StatBox title="عدد المترشحين" value={stats.candidates} color="bg-[#993433]" />
        <StatBox title="عدد المصوّتين" value={stats.voted} color="bg-[#993433]" />
        <StatBox title="عدد غير المصوّتين" value={stats.notVoted} color="bg-[#993433]" />
      </div>
    </div>
  );
}

function StatBox({ title, value, color }) {
  return (
    <div className={`rounded-lg p-6 text-white ${color} shadow-xl hover:bg-[#993533e0]`}>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
