import { useState } from "react";
import { HiPencil, HiTrash } from "react-icons/hi";

export default function CandidatesTab() {
  const [candidates, setCandidates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    position: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdd = () => {
    if (!formData.name || !formData.city || !formData.position) return;

    setCandidates((prev) => [...prev, { ...formData, votes: 0, voters: [] }]);
    setFormData({ name: "", city: "", position: "" });
    setShowForm(false);
  };

  const handleDelete = (index) => {
    setCandidates((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    const candidate = candidates[index];
    setFormData({
      name: candidate.name,
      city: candidate.city,
      position: candidate.position,
    });
    setCandidates((prev) => prev.filter((_, i) => i !== index));
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
            <input
              name="position"
              placeholder="المنصب"
              value={formData.position}
              onChange={handleChange}
              className="p-2 border rounded"
            />
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
              candidates.map((c, index) => (
                <tr key={index}>
                  <td className="border p-2">{c.name}</td>
                  <td className="border p-2">{c.city}</td>
                  <td className="border p-2">{c.position}</td>
                  <td className="border p-2">{c.votes}</td>
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
