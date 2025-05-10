import { useEffect, useState } from "react";
import { HiPencil, HiTrash } from "react-icons/hi";
import { db } from "../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";


export default function CandidatesTab() {
  const [candidates, setCandidates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    position: "",
  });

  const candidatesCollection = collection(db, "candidates");

  useEffect(() => {
    const unsubscribe = onSnapshot(candidatesCollection, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        votes: 0,
        voters: [],
      }));
      setCandidates(fetched);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdd = async () => {
  if (!formData.name || !formData.city || !formData.position) return;

  const candidateId = uuidv4(); // ← توليد معرف فريد

  try {
    await addDoc(candidatesCollection, {
      candidateId,
      name: formData.name,
      city: formData.city,
      position: formData.position,
    });

    setFormData({ name: "", city: "", position: "" });
    setShowForm(false);
  } catch (error) {
    console.error("خطأ في الإضافة:", error);
  }
};



  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "candidates", id));
    } catch (error) {
      console.error("خطأ في الحذف:", error);
    }
  };

  const handleEdit = async (id) => {
    const candidate = candidates.find((c) => c.id === id);
    if (!candidate) return;

    setFormData({
      name: candidate.name,
      city: candidate.city,
      position: candidate.position,
    });

    await handleDelete(id); // حذف المرشح القديم وإعادة إضافته
    setShowForm(true);
  };

  return (
    <div className="space-y-6 mt-22 p-4 md:p-10" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">إدارة المترشحين</h1>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-[#993433] hover:bg-[#993533da] text-white px-4 py-2 rounded cursor-pointer"
        >
          {showForm ? "إغلاق" : "إضافة مترشح"}
        </button>
      </div>

      {showForm && (
  <div className="bg-white p-4 rounded shadow border space-y-4">
    <div className="grid gap-4 md:grid-cols-3">
      <input
        name="name"
        placeholder="الاسم"
        value={formData.name}
        onChange={handleChange}
        className="p-2 border rounded"
      />
      <input
        name="city"
        placeholder="المدينة"
        value={formData.city}
        onChange={handleChange}
        className="p-2 border rounded"
      />
      <select
        name="position"
        value={formData.position}
        onChange={handleChange}
        className="p-2 border rounded"
      >
        <option value="">اختر المنصب</option>
        <option value="الهيئة التنفيذية">الهيئة التنفيذية</option>
        <option value="هيئة الرقابة والتفتيش">هيئة الرقابة والتفتيش</option>
      </select>
    </div>
    <button
      onClick={handleAdd}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
    >
      حفظ
    </button>
  </div>
)}


      <div className="overflow-x-auto">
        <table className="w-full bg-white border shadow text-sm" dir="rtl">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">الاسم</th>
              <th className="border p-2">المدينة</th>
              <th className="border p-2">المنصب</th>
              <th className="border p-2">عدد الأصوات</th>
              <th className="border p-2">التحكم</th>
            </tr>
          </thead>
          <tbody>
            {candidates.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  لا يوجد مترشحون حتى الآن.
                </td>
              </tr>
            ) : (
              candidates.map((c) => (
                <tr key={c.id}>
                  <td className="border p-2">{c.name}</td>
                  <td className="border p-2">{c.city}</td>
                  <td className="border p-2">{c.position}</td>
                  <td className="border p-2">{c.votes || 0}</td>
                  <td className="border p-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(c.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                        title="تعديل"
                      >
                        <HiPencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                        title="حذف"
                      >
                        <HiTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
