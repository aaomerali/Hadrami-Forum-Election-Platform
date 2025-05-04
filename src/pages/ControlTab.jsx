export default function ControlTab() {
  const handleOpenVoting = () => {
    console.log("✅ تم فتح التصويت");
    // هنا يمكن استدعاء Firebase لتحديث حالة التصويت
  };

  const handleCloseVoting = () => {
    console.log("⛔ تم إغلاق التصويت");
    // هنا يمكن استدعاء Firebase لتحديث حالة التصويت
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] ">
      <div className="bg-white shadow-md rounded p-6 w-full max-w-md text-center space-y-6">
        <h2 className="text-xl font-semibold">التحكم في حالة التصويت</h2>

        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={handleOpenVoting}
            className="bg-[#993433] hover:bg-[#993533cc] text-white px-6 py-2 rounded transition cursor-pointer"
          >
            فتح التصويت
          </button>
          <button
            onClick={handleCloseVoting}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded transition cursor-pointer"
          >
            إغلاق التصويت
          </button>
        </div>
      </div>
    </div>
  );
}
