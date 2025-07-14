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

  // Calculate pagination
  const totalPages = Math.ceil(collections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCollections = collections.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    return 'text-white';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Layout>
      <div className="p-3 md:p-6 bg-[#1D0054] rounded-xl border border-[#41308D] m-5 max-w-full overflow-hidden">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
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
            {/* Search Button */}
            <button className="p-2 bg-[#6F4FF2] rounded-lg hover:bg-[#5A3FD9] transition-colors cursor-pointer">
              <img
                src="/assets/orders-icons/search-icon.svg"
                alt="search"
                className="w-5 h-5 cursor-pointer"
              />
            </button>

            {/* Sort Button */}
            <button className="p-2 bg-[#6F4FF2] rounded-lg hover:bg-[#5A3FD9] transition-colors cursor-pointer">
              <img
                src="/assets/orders-icons/sort-icon.svg"
                alt="sort"
                className="w-5 h-5 cursor-pointer"
              />
            </button>

            {/* All Filter */}
            <button className="px-4 py-2 bg-transparent text-white rounded-lg border border-[#822BF1] hover:bg-[#822BF1] transition-colors font-poppins cursor-pointer">
              All
            </button>

            {/* Export Data Button */}
            <button
              className="px-6 py-2 bg-[#8B5CF6] text-white hover:bg-[#7C3AED] transition-colors font-poppins font-medium cursor-pointer"
              style={{ borderRadius: '29px' }}
            >
              Export Data
            </button>
          </div>
        </div>

        {/* Modern Table */}
        <div className="bg-[#1D0054] rounded-xl overflow-hidden max-w-full">
          <div className="overflow-x-auto">
            <div className="min-w-[1300px]">
              {/* Header */}
              <div
                className="grid gap-2 px-6 py-4 border-b border-[#6C7AA0] bg-[#1D0054]"
                style={{
                  gridTemplateColumns:
                    '60px 100px 1fr 120px 160px 180px 100px 120px 60px',
                }}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-2 border-gray-500 bg-transparent text-[#FF04B4] focus:ring-[#FF04B4] focus:ring-2 focus:ring-offset-0 checked:bg-[#FF04B4] checked:border-[#FF04B4] hover:border-[#FF04B4] transition-colors cursor-pointer"
                    style={{
                      accentColor: '#FF04B4',
                    }}
                  />
                </div>
                <div className="text-xs font-medium text-gray-300 tracking-wider whitespace-nowrap">
                  Collection Id
                </div>
                <div className="text-xs font-medium text-gray-300 tracking-wider whitespace-nowrap">
                  Collection name
                </div>
                <div className="text-xs font-medium text-gray-300 tracking-wider whitespace-nowrap">
                  Issuer Name
                </div>
                <div className="text-xs font-medium text-gray-300 tracking-wider whitespace-nowrap">
                  Expected release date
                </div>
                <div className="text-xs font-medium text-gray-300 tracking-wider text-center whitespace-nowrap">
                  Number Of Card Designs
                </div>
                <div className="text-xs font-medium text-gray-300 tracking-wider whitespace-nowrap">
                  Category
                </div>
                <div className="text-xs font-medium text-gray-300 tracking-wider whitespace-nowrap">
                  Status
                </div>
                <div className="text-xs font-medium text-gray-300 tracking-wider text-center"></div>
              </div>

              {/* Data Rows */}
              <div className="space-y-2 p-4">
                {currentCollections.map((collection, index) => (
                  <div
                    key={collection.id}
                    className="grid gap-2 px-2 py-4 bg-[#6F4FF212] hover:bg-[#6F4FF230] transition-colors rounded-lg items-center"
                    style={{
                      gridTemplateColumns:
                        '60px 100px 1fr 120px 160px 180px 100px 120px 60px',
                    }}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-2 border-gray-500 bg-transparent text-[#FF04B4] focus:ring-[#FF04B4] focus:ring-2 focus:ring-offset-0 checked:bg-[#FF04B4] checked:border-[#FF04B4] hover:border-[#FF04B4] transition-colors cursor-pointer"
                        style={{
                          accentColor: '#FF04B4',
                        }}
                      />
                    </div>
                    <div className="text-xs text-white font-medium whitespace-nowrap">
                      {collection.collectionId}
                    </div>
                    <div className="text-xs text-white whitespace-nowrap">
                      {collection.collectionName}
                    </div>
                    <div className="text-xs text-gray-300 whitespace-nowrap">
                      {collection.issuerName}
                    </div>
                    <div className="text-xs text-gray-300 whitespace-nowrap">
                      {collection.expectedReleaseDate}
                    </div>
                    <div className="text-xs text-white text-center whitespace-nowrap">
                      {collection.numberOfCardDesigns}
                    </div>
                    <div className="text-xs text-gray-300 whitespace-nowrap">
                      {collection.category}
                    </div>
                    <div className="text-xs whitespace-nowrap">
                      <span className={getStatusColor(collection.status)}>
                        {collection.status}
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <button className="text-purple-400 hover:text-purple-300 transition-colors cursor-pointer">
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
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-transparent px-6 py-6 flex items-center justify-center border-t border-[#6C7AA0]">
              <div className="flex items-center space-x-3">
                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  const isActive = pageNumber === currentPage;

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`w-10 h-10 rounded-full text-sm font-bold flex items-center justify-center shadow-lg border border-[#F81DFB] cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-[#F81DFB] text-white'
                          : 'bg-transparent text-[#F81DFB] hover:bg-[#F81DFB] hover:text-white'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                {/* Next Page Arrow */}
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
