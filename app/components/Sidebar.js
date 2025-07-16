export default function Sidebar() {
  return (
    <div className="fixed w-64 h-screen bg-white shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">CMS Dashboard</h2>
      <ul className="space-y-2">
        <li>
          <a
            href="/careers"
            className="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
          >
            Careers
          </a>
        </li>
        <li>
          <a
            href="/leads"
            className="block py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors"
          >
            Leads
          </a>
        </li>
      </ul>
    </div>
  );
}