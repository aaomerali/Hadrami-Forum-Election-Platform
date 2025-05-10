import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, addDoc, serverTimestamp , query, where, updateDoc, doc , getDoc } from "firebase/firestore"; 
import { db } from "../firebase/firebase";
import logo from '../assets/logo.png';

export default function VotePage() {
  const navigate = useNavigate();
  const { voteId } = useParams();

  const [candidates, setCandidates] = useState([]);
  const [selectedExecutives, setSelectedExecutives] = useState([]);
  const [selectedSupervisors, setSelectedSupervisors] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedCode = localStorage.getItem("voteCode");

    if (!storedCode || storedCode !== voteId) {
      navigate("/voter-login");
      return;
    }

    const checkVotingStatus = async () => {
      try {
        const statusCollection = collection(db, "votingStatus");
        const q = query(statusCollection, where("stateId", "==", "STATE"));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const statusDoc = querySnapshot.docs[0];
          const statusData = statusDoc.data();

          if (statusData.isOpen === false) {
            navigate("/vote-closed");
            return false;
          }
        }

        return true;
      } catch (err) {
        console.error("حدث خطأ أثناء التحقق من حالة التصويت:", err);
        return false;
      }
    };

    const checkIfUserVoted = async () => {
      try {
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("voteId", "==", voteId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();

          if (userData.hasVoted === true) {
            navigate("/vote-success");
            return false;
          }
        }

        return true;
      } catch (err) {
        console.error("فشل التحقق من حالة التصويت:", err);
        return false;
      }
    };

    const fetchCandidates = async () => {
      try {
        const snapshot = await getDocs(collection(db, "candidates"));
        const fetched = snapshot.docs.map(doc => doc.data());
        setCandidates(fetched);
      } catch (err) {
        console.error("حدث خطأ أثناء جلب المرشحين:", err);
      }
    };

    const init = async () => {
      const votingOpen = await checkVotingStatus();
      if (!votingOpen) return;

      const notVoted = await checkIfUserVoted();
      if (!notVoted) return;

      await fetchCandidates();
    };

    init();
  }, [voteId, navigate]);



  const handleSelect = (candidate) => {
    setError("");

    if (candidate.position === "الهيئة التنفيذية") {
      const isSelected = selectedExecutives.find((c) => c.name === candidate.name);
      if (isSelected) {
        setSelectedExecutives(selectedExecutives.filter((c) => c.name !== candidate.name));
      } else {
        if (selectedExecutives.length >= 4) {
          setError("يمكنك اختيار 4 مرشحين فقط من الهيئة التنفيذية.");
        } else {
          setSelectedExecutives([...selectedExecutives, candidate]);
        }
      }
    } else if (candidate.position === "هيئة الرقابة والتفتيش") {
      const isSelected = selectedSupervisors.find((c) => c.name === candidate.name);
      if (isSelected) {
        setSelectedSupervisors(selectedSupervisors.filter((c) => c.name !== candidate.name));
      } else {
        if (selectedSupervisors.length >= 2) {
          setError("يمكنك اختيار مرشحين فقط من هيئة الرقابة والتفتيش.");
        } else {
          setSelectedSupervisors([...selectedSupervisors, candidate]);
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (selectedExecutives.length !== 4 || selectedSupervisors.length !== 2) {
      setError("يرجى اختيار 4 من الهيئة التنفيذية و 2 مرشحين من هيئة الرقابة والتفتيش.");
      return;
    }

    try {
      const votesCollection = collection(db, "votes");

      for (const candidate of selectedExecutives) {
        await addDoc(votesCollection, {
          voteId,
          candidateId: candidate.candidateId,
          timestamp: serverTimestamp()
        });
      }

      for (const candidate of selectedSupervisors) {
        await addDoc(votesCollection, {
          voteId,
          candidateId: candidate.candidateId,
          timestamp: serverTimestamp()
        });
      }

      // ✅ جلب مستند المستخدم الذي يحتوي على voteId وتحديثه
      const usersCollection = collection(db, "users");
      const q = query(usersCollection, where("voteId", "==", voteId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]; // نفترض أنه يوجد مستخدم واحد فقط لكل voteId
        await updateDoc(doc(db, "users", userDoc.id), {
          hasVoted: true,
        });
      }

      localStorage.removeItem("voterEmail");
      localStorage.removeItem("voteCode");
      navigate("/vote-success");

    } catch (err) {
      console.error("حدث خطأ أثناء تسجيل التصويت:", err);
      setError("حدث خطأ أثناء تسجيل التصويت. حاول مرة أخرى.");
    }
  };



  const handleLogout = () => {
    localStorage.removeItem("voterEmail");
    localStorage.removeItem("voteCode");
    navigate("/voter-login");
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
      <div className="flex justify-between items-center mb-10">
        <img src={logo} alt="شعار المنصة" className="w-40 h-auto" />
        <button onClick={handleLogout} className="bg-gray-200 hover:bg-gray-300 text-sm text-gray-800 px-4 py-2 rounded">
          تسجيل الخروج
        </button>
      </div>

      <h1 className="text-2xl font-bold text-center mb-4 text-[#993433]">صفحة التصويت</h1>
      <p className="text-center text-lg text-gray-600 mb-10">
        اختر <strong>4</strong> مرشحين من <strong>الهيئة التنفيذية</strong> و <strong>2 مرشحين</strong> من <strong>هيئة الرقابة والتفتيش</strong>
      </p>

      {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

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
            renderCandidate(candidate, selectedSupervisors.some(c => c.name === candidate.name))
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
