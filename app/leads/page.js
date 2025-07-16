import Sidebar from '../components/Sidebar';

async function getLeads() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch leads: ${res.status}`);
  return res.json();
}

export default async function Leads() {
  let leads = [];
  let error = null;

  try {
    leads = await getLeads();
  } catch (err) {
    error = err.message;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-6 flex-1">
        <h2 className="text-3xl font-bold mb-4">Leads</h2>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : leads.length === 0 ? (
          <p>No data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Message</th>
                  <th className="py-2 px-4 border-b">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">{lead.name || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">{lead.email || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">{lead.message || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">
                      {lead.submittedAt ? new Date(lead.submittedAt).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}