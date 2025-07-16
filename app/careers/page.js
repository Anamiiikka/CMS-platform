'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

async function getCareers(page = 1, sort = '-createdAt') {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/careers?page=${page}&sort=${sort}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch careers: ${res.status}`);
  return res.json();
}

export default function Careers() {
  const [careers, setCareers] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState('-createdAt');
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCareers(currentPage, sortOrder);
        setCareers(data.careers);
        setTotalPages(Math.ceil(data.total / itemsPerPage));
      } catch (err) {
        setError(err.message);
      }
    }
    fetchData();
  }, [currentPage, sortOrder]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === 'createdAt' ? '-createdAt' : 'createdAt');
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-64 p-6 flex-1 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Career Applicants</h2>
            <button
              onClick={handleSortChange}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Sort by Date {sortOrder === '-createdAt' ? '(Newest First)' : '(Oldest First)'}
            </button>
          </div>
          {error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : careers.length === 0 ? (
            <p className="text-gray-600">No data available</p>
          ) : (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resume</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {careers.map((career, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm text-gray-900">{career.name}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{career.email}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{career.phone}</td>
                      <td className="py-4 px-6 text-sm">
                        {career.resume ? (
                          <a
                            href={career.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            Download Resume
                          </a>
                        ) : 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">{career.appliedPosition}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{career.status}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {career.createdAt ? new Date(career.createdAt).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 hover:bg-blue-700 transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-300 hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}