'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

async function getLeads(page = 1, sort = '-submittedAt') {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leads?page=${page}&sort=${sort}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch leads: ${res.status}`);
  return res.json();
}

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState('-submittedAt');

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getLeads(currentPage, sortOrder);
        setLeads(data.leads || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchData();
  }, [currentPage, sortOrder]); // Re-run when sortOrder or currentPage changes

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSortChange = () => {
    const newSortOrder = sortOrder === 'submittedAt' ? '-submittedAt' : 'submittedAt';
    setSortOrder(newSortOrder);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-64 p-6 flex-1 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Lead Submissions</h2>
            <button
              onClick={handleSortChange}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Sort by Date {sortOrder === '-submittedAt' ? '(Newest First)' : '(Oldest First)'}
            </button>
          </div>
          {error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : leads.length === 0 ? (
            <p className="text-gray-600">No leads available</p>
          ) : (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-4 px-6 text-sm text-gray-900">{lead.firstName}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{lead.lastName}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{lead.email}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{lead.industry}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{lead.message}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {lead.submittedAt ? new Date(lead.submittedAt).toLocaleString() : 'N/A'}
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