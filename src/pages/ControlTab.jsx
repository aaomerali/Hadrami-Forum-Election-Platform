import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";

export default function ControlTab() {
  const [isOpen, setIsOpen] = useState(null);
  const [statusDocId, setStatusDocId] = useState(null);

  useEffect(() => {
    const fetchVotingStatus = async () => {
      const querySnapshot = await getDocs(collection(db, "votingStatus"));
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        setStatusDocId(docSnap.id);
        setIsOpen(docSnap.data().isOpen);
      }
    };

    fetchVotingStatus();
  }, []);

  const handleUpdateVotingStatus = async (newStatus) => {
    if (!statusDocId) return;

    const docRef = doc(db, "votingStatus", statusDocId);
    await updateDoc(docRef, { isOpen: newStatus });
    setIsOpen(newStatus);

    toast.success(newStatus ? "✅ تم فتح التصويت" : "⛔ تم إغلاق التصويت");
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] relative">
      <Toaster position="top-center" />

      <div className="bg-white shadow-md rounded p-6 w-full max-w-md text-center space-y-6">
        <h2 className="text-xl font-semibold">التحكم في حالة التصويت</h2>

        <div className="text-lg font-bold">
          حالة التصويت الحالية:{" "}
          {isOpen === null ? (
            <span className="text-gray-500">جارٍ التحميل...</span>
          ) : isOpen ? (
            <span className="text-green-600">✅ مفتوحة</span>
          ) : (
            <span className="text-red-600">⛔ مغلقة</span>
          )}
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => handleUpdateVotingStatus(true)}
            className="bg-[#993433] hover:bg-[#993533cc] text-white px-6 py-2 rounded transition cursor-pointer"
          >
            فتح التصويت
          </button>
          <button
            onClick={() => handleUpdateVotingStatus(false)}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition cursor-pointer"
          >
            إغلاق التصويت
          </button>
        </div>
      </div>
    </div>
  );
}
