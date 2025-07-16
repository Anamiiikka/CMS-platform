export default function Sidebar() {
  return (
    <div className="fixed w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Menu</h2>
      <ul>
        <li className="mb-2"><a href="/careers" className="hover:text-gray-300">Careers</a></li>
        <li className="mb-2"><a href="/leads" className="hover:text-gray-300">Leads</a></li>
      </ul>
    </div>
  );
}