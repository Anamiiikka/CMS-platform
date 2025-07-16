import Sidebar from "../components/Sidebar";

async function getCareers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/careers`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch careers: ${res.status}`);
  return res.json();
}

export default async function Careers() {
  let careers = [];
  let error = null;

  try {
    careers = await getCareers();
  } catch (err) {
    error = err.message;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-6 flex-1">
        <h2 className="text-3xl font-bold mb-4">Careers</h2>
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : careers.length === 0 ? (
          <p>No data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Age</th>
                  <th className="py-2 px-4 border-b">Experience</th>
                  <th className="py-2 px-4 border-b">Resume URL</th>
                  <th className="py-2 px-4 border-b">Job ID</th>
                  <th className="py-2 px-4 border-b">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {careers.map((career, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">{career.name || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">{career.age || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">{career.experience || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">
                      <a href={career.resumeUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                        {career.resumeUrl ? 'View Resume' : 'N/A'}
                      </a>
                    </td>
                    <td className="py-2 px-4 border-b">{career.jobId || 'N/A'}</td>
                    <td className="py-2 px-4 border-b">
                      {career.submittedAt ? new Date(career.submittedAt).toLocaleString() : 'N/A'}
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