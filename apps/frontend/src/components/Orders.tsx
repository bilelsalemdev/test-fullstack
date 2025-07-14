import React, { useState } from 'react';
import Layout from './Layout';

interface Collection {
  id: number;
  collectionId: string;
  collectionName: string;
  issuerName: string;
  expectedReleaseDate: string;
  numberOfCardDesigns: number;
  category: string;
  status: string;
}

const Orders: React.FC = () => {
  const [collections] = useState<Collection[]>([
    {
      id: 1,
      collectionId: '#1',
      collectionName: 'Team Falcons #1',
      issuerName: 'MEDKSA001',
      expectedReleaseDate: 'DD/MM/YYYY',
      numberOfCardDesigns: 5,
      category: 'Esport',
      status: 'In production',
    },
    {
      id: 2,
      collectionId: '#2',
      collectionName: 'Falcons 5',
      issuerName: 'MEDKSA001',
      expectedReleaseDate: 'DD/MM/YYYY',
      numberOfCardDesigns: 3,
      category: 'Gaming',
      status: 'Pending',
    },
    {
      id: 3,
      collectionId: '#3',
      collectionName: '0xabc123...789',
      issuerName: 'MEDKSA001',
      expectedReleaseDate: 'DD/MM/YYYY',
      numberOfCardDesigns: 7,
      category: 'Esport',
      status: 'Pending',
    },
    {
      id: 4,
      collectionId: '#4',
      collectionName: '0xabc123...789',
      issuerName: 'MEDKSA001',
      expectedReleaseDate: 'DD/MM/YYYY',
      numberOfCardDesigns: 8,
      category: 'Gaming',
      status: 'In production',
    },
    {
      id: 5,
      collectionId: '#5',
      collectionName: '0xabc123...789',
      issuerName: 'MEDKSA001',
      expectedReleaseDate: 'DD/MM/YYYY',
      numberOfCardDesigns: 12,
      category: 'Gaming',
      status: 'Pending',
    },
    {
      id: 6,
      collectionId: '#6',
      collectionName: '0xabc123...789',
      issuerName: 'MEDKSA001',
      expectedReleaseDate: 'DD/MM/YYYY',
      numberOfCardDesigns: 1,
      category: 'Gaming',
      status: 'Public',
    },
    {
      id: 7,
      collectionId: '#7',
      collectionName: '0xabc123...789',
      issuerName: 'MEDKSA001',
      expectedReleaseDate: 'DD/MM/YYYY',
      numberOfCardDesigns: 11,
      category: 'Esport',
      status: 'In production',
    },
    {
      id: 8,
      collectionId: '#8',
      collectionName: '0xabc123...789',
      issuerName: 'MEDKSA001',
      expectedReleaseDate: 'DD/MM/YYYY',
      numberOfCardDesigns: 7,
      category: 'Esport',
      status: 'In production',
    },
    {
      id: 9,
      collectionId: '#9',
      collectionName: '0xabc123...789',
      issuerName: 'MEDKSA001',
      expectedReleaseDate: 'DD/MM/YYYY',
      numberOfCardDesigns: 8,
      category: 'Esport',
      status: 'Public',
    },
    {
      id: 10,
      collectionId: '#10',
      collectionName: '0xabc123...789',
      issuerName: 'MEDKSA001',
      expectedReleaseDate: 'DD/MM/YYYY',
      numberOfCardDesigns: 3,
      category: 'Gaming',
      status: 'In production',
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination helpers
  const totalPages = Math.ceil(collections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCollections = collections.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => 'text-white';

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage((prev) => prev + 1);

  return (
    <Layout>
      <div className="p-3 md:p-6 bg-[#1D0054] rounded-xl border border-[#41308D] m-5 max-w-[1100px] overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 ">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white font-poppins">
              Total Created Collections
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Showing {startIndex + 1}-{Math.min(endIndex, collections.length)}{' '}
              of {collections.length} collections
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            {/* Search */}
            <button className="p-2 bg-[#6F4FF2] rounded-lg hover:bg-[#5A3FD9] transition-colors">
              <img
                src="/assets/orders-icons/search-icon.svg"
                alt="search"
                className="w-5 h-5"
              />
            </button>
            {/* Sort */}
            <button className="p-2 bg-[#6F4FF2] rounded-lg hover:bg-[#5A3FD9] transition-colors">
              <img
                src="/assets/orders-icons/sort-icon.svg"
                alt="sort"
                className="w-5 h-5"
              />
            </button>
            {/* All filter */}
            <button className="px-4 py-2 bg-transparent text-white rounded-lg border border-[#822BF1] hover:bg-[#822BF1] transition-colors font-poppins">
              All
            </button>
            {/* Export */}
            <button className="px-6 py-2 bg-[#8B5CF6] text-white hover:bg-[#7C3AED] transition-colors font-poppins font-medium rounded-full">
              Export Data
            </button>
          </div>
        </div>

        {/* Table card */}
        <div className="bg-[#1D0054] rounded-xl">
          {/* Scroll wrapper */}
          <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
            {/* Header row */}
            <div
              className="grid gap-2 px-6 py-4 border-b border-[#6c7aa058] bg-[#1D0054] sticky top-0 z-10"
              style={{
                gridTemplateColumns:
                  '60px 100px 120px 120px 160px 180px 100px 120px 60px',
              }}
            >
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-2 border-gray-500 bg-transparent accent-[#FF04B4] cursor-pointer"
                />
              </div>
              {[
                'Collection Id',
                'Collection name',
                'Issuer Name',
                'Expected release date',
                'Number Of Card Designs',
                'Category',
                'Status',
                '',
              ].map((label) => (
                <div
                  key={label}
                  className="text-xs font-medium text-gray-300 tracking-wider whitespace-nowrap text-center"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Data rows */}
            <div className="space-y-2 p-4">
              {currentCollections.map((collection) => (
                <div
                  key={collection.id}
                  className="grid gap-2 px-2 py-4 bg-[#6F4FF212] hover:bg-[#6F4FF230] transition-colors rounded-lg items-center w-full"
                  style={{
                    gridTemplateColumns:
                      '60px 100px 120px 120px 160px 180px 100px 120px 60px',
                  }}
                >
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-2 border-gray-500 bg-transparent accent-[#FF04B4] cursor-pointer"
                    />
                  </div>
                  <div className="text-xs text-white font-medium text-center whitespace-nowrap">
                    {collection.collectionId}
                  </div>
                  <div className="text-xs text-white text-center whitespace-nowrap">
                    {collection.collectionName}
                  </div>
                  <div className="text-xs text-gray-300 text-center whitespace-nowrap">
                    {collection.issuerName}
                  </div>
                  <div className="text-xs text-gray-300 text-center whitespace-nowrap">
                    {collection.expectedReleaseDate}
                  </div>
                  <div className="text-xs text-white text-center whitespace-nowrap">
                    {collection.numberOfCardDesigns}
                  </div>
                  <div className="text-xs text-gray-300 text-center whitespace-nowrap">
                    {collection.category}
                  </div>
                  <div className="text-xs text-white text-center whitespace-nowrap">
                    {collection.status}
                  </div>
                  <div className="flex justify-center">
                    <button className="text-purple-400 hover:text-purple-300 transition-colors">
                      <img
                        src="/assets/orders-icons/eye-outline.svg"
                        alt="view"
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-6 flex items-center justify-center">
              <div className="flex items-center space-x-3">
                {Array.from({ length: totalPages }, (_, idx) => {
                  const page = idx + 1;
                  const active = page === currentPage;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-full text-sm font-bold flex items-center justify-center shadow-lg border border-[#F81DFB] transition-colors ${
                        active
                          ? 'bg-[#F81DFB] text-white'
                          : 'bg-transparent text-[#F81DFB] hover:bg-[#F81DFB] hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                {currentPage < totalPages && (
                  <img
                    onClick={handleNextPage}
                    src="/assets/orders-icons/arrow-right.svg"
                    alt="next page"
                    className="w-10 h-10 cursor-pointer"
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
