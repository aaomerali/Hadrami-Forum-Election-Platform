import { useState, useEffect } from "react";
import { HiPencil, HiTrash } from "react-icons/hi";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore"; 
import { db } from "../firebase/firebase";


export default function UsersTab() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    voteId: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // جلب المستخدمين وترتيبهم
  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // ترتيب حسب voteId (مع التأكد من أن لا يحتوي على فراغات)
    const sortedUsers = usersList
      .map(user => ({
        ...user,
        voteId: user.voteId?.replace(/\s/g, "") || ""
      }))
      .sort((a, b) => a.voteId.localeCompare(b.voteId));

    setUsers(sortedUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedVoteId = formData.voteId.replace(/\s/g, "");

    if (editIndex !== null) {
      const userDoc = doc(db, "users", users[editIndex].id);
      await updateDoc(userDoc, { ...formData, voteId: cleanedVoteId });
      setEditIndex(null);
    } else {
      const newUser = {
        ...formData,
        voteId: cleanedVoteId,
        hasVoted: false,
      };
      await addDoc(collection(db, "users"), newUser);
    }

    setFormData({ name: "", email: "", city: "", voteId: "" });
    setShowForm(false);
    fetchUsers();
  };

  const handleEdit = (index) => {
    const user = users[index];
    setFormData({
      name: user.name,
      email: user.email,
      city: user.city,
      voteId: user.voteId,
    });
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    const user = users[index];
    const userDoc = doc(db, "users", user.id);
    await deleteDoc(userDoc);
    fetchUsers();
  };

  // تصفية المستخدمين بناءً على voteId
  const filteredUsers = users.filter(user =>
    user.voteId.includes(searchTerm.trim())
  );

  return (
    <div className="text-right mt-22 p-4 md:p-10">
      <div className="flex justify-between flex-row-reverse items-center mb-4">
        <h2 className="text-xl font-semibold">قائمة الطلاب</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormData({ name: "", email: "", city: "", voteId: "" });
            setEditIndex(null);
          }}
          className="bg-[#993433] text-white px-4 py-2 rounded hover:bg-[#993533da] cursor-pointer"
        >
          {showForm ? "إلغاء" : "إضافة طالب"}
        </button>
      </div>

      {/* 🔍 حقل البحث */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="ابحث برقم التصويت..."
          className="w-full border px-3 py-2 rounded text-right"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.replace(/\s/g, ""))}
        />
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-4">
          <div>
            <label className="block mb-1">الاسم</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded text-right"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded text-right"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1">المدينة</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded text-right"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1">رقم التصويت</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded text-right"
              value={formData.voteId}
              onChange={(e) =>
                setFormData({ ...formData, voteId: e.target.value.replace(/\s/g, "") })
              }
              required
            />
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            {editIndex !== null ? "تحديث" : "حفظ الطالب"}
          </button>
        </form>
      )}

      <div className="overflow-x-auto" dir="rtl">
        <table className="w-full bg-white border shadow text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">الاسم</th>
              <th className="border p-2">البريد</th>
              <th className="border p-2">المدينة</th>
              <th className="border p-2">رقم التصويت</th>
              <th className="border p-2">تم التصويت؟</th>
              <th className="border p-2">التحكم</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  لا يوجد مستخدمون.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.city}</td>
                  <td className="border p-2">{user.voteId}</td>
                  <td className="border p-2">{user.hasVoted ? "نعم" : "لا"}</td>
                  <td className="border p-2 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                        title="تعديل"
                      >
                        <HiPencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
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
