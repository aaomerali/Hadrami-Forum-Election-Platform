import { useState } from "react";
import { HiPencil, HiTrash } from "react-icons/hi"; // أيقونات التعديل والحذف


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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      // تعديل مستخدم
      const updatedUsers = [...users];
      updatedUsers[editIndex] = { ...formData, hasVoted: users[editIndex].hasVoted };
      setUsers(updatedUsers);
      setEditIndex(null);
    } else {
      // إضافة مستخدم
      const newUser = {
        ...formData,
        hasVoted: false,
      };
      setUsers((prev) => [...prev, newUser]);
    }

    setFormData({ name: "", email: "", city: "", voteId: "" });
    setShowForm(false);
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

  const handleDelete = (index) => {
    const filtered = users.filter((_, i) => i !== index);
    setUsers(filtered);
  };

  return (
    <div className="text-right mt-22 p-4 md:p-10">
      <div className="flex justify-between flex-row-reverse items-center mb-4">
        <h2 className="text-xl font-semibold">قائمة المستخدمين</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormData({ name: "", email: "", city: "", voteId: "" });
            setEditIndex(null);
          }}
          className="bg-[#993433] text-white px-4 py-2 rounded hover:bg-[#993533da] cursor-pointer"
        >
          {showForm ? "إلغاء" : "إضافة مستخدم"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow mb-6 space-y-4"
        >
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
              onChange={(e) => setFormData({ ...formData, voteId: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {editIndex !== null ? "تحديث" : "حفظ المستخدم"}
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
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  لا يوجد مستخدمون بعد.
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={index}>
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
