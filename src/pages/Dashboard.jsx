import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from '../assets/logo.png'


export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItem = (to, label) => (
    <Link
      to={to}
      onClick={() => setIsSidebarOpen(false)}
      className={`px-4 py-2 rounded-md transition-all text-lg font-medium text-right ${
        currentPath === to
          ? "bg-[#993433] text-white"
          : "text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-row-reverse bg-gray-50">
      {/* Sidebar - on the right side */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-40 p-6 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } md:static md:translate-x-0 md:w-64 md:h-auto md:shadow-none border-l`}
      >
        <div className="flex justify-between items-center md:hidden mb-10 ">
        
          <button onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <img
            src={logo} // قم بتعديل المسار حسب موقع الشعار الفعلي
            alt="شعار المنصة"
            className="mx-auto h-20 w-35 object-contain mb-10"
          />
        <nav className="flex flex-col gap-2">
          {navItem("/dashboard/users", "الطلاب")}
          {navItem("/dashboard/candidates", "المترشحون")}
          {navItem("/dashboard/control", "التحكم بالتصويت")}
          {navItem("/dashboard/results", "عرض النتائج")}
        </nav>

        <button
          onClick={() => navigate("/")}
          className="mt-10 w-full bg-neutral-600 text-white py-2 rounded cursor-pointer hover:bg-neutral-500 transition-all"
        >
          تسجيل الخروج
        </button>
      </aside>

      {/* Main content area */}
      <div className="flex-1 p-4">
        {/* Header for small screens */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h1 className="text-xl font-semibold">لوحة التحكم</h1>
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
