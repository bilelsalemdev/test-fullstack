import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import {
  collectionsApi,
  Collection as APICollection,
} from '../services/collectionsApi';
import { Button, Table, Pagination, LoadingState, PageHeader } from './ui';

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

const mapAPICollectionToFrontend = (
  apiCollection: APICollection
): Collection => {
  const statusMap = {
    pending: 'Pending',
    in_production: 'In production',
    issued: 'Public',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  return {
    id: apiCollection.id,
    collectionId: `#${apiCollection.id}`,
    collectionName: apiCollection.name,
    issuerName: 'MEDKSA001',
    expectedReleaseDate: formatDate(apiCollection.expected_release_date),
    numberOfCardDesigns: apiCollection.total_cards,
    category:
      apiCollection.name.toLowerCase().includes('esport') ||
      apiCollection.name.toLowerCase().includes('falcons')
        ? 'Esport'
        : 'Gaming',
    status: statusMap[apiCollection.status] || apiCollection.status,
  };
};

const Collections: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const columns = [
    { key: 'id', label: 'Collection Id', width: '100px' },
    { key: 'name', label: 'Collection name', width: '120px' },
    { key: 'issuer', label: 'Issuer Name', width: '120px' },
    { key: 'date', label: 'Expected release date', width: '160px' },
    { key: 'designs', label: 'Number Of Card Designs', width: '180px' },
    { key: 'category', label: 'Category', width: '100px' },
    { key: 'status', label: 'Status', width: '120px' },
    { key: 'actions', label: '', width: '60px' },
  ];

  const gridTemplate = '60px 100px 120px 120px 160px 180px 100px 120px 60px';

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await collectionsApi.getCollections({
          page_size: 100,
          ordering: '-created_at',
        });

        const frontendCollections = response.results.map(
          mapAPICollectionToFrontend
        );
        setCollections(frontendCollections);
      } catch (err) {
        setError('Failed to fetch collections');
        console.error('Error fetching collections:', err);

        setCollections([
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
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  const totalPages = Math.ceil(collections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCollections = collections.slice(startIndex, endIndex);

  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  const headerActions = (
    <>
      <Button
        variant="icon"
        icon="/assets/orders-icons/search-icon.svg"
        iconAlt="search"
      />
      <Button
        variant="icon"
        icon="/assets/orders-icons/sort-icon.svg"
        iconAlt="sort"
      />
      <Button variant="outline">All</Button>
      <Button variant="primary">Export Data</Button>
    </>
  );

  return (
    <Layout>
      <div className="p-3 md:p-6 bg-[#1D0054] rounded-xl border border-[#41308D] m-5 max-w-[1100px] overflow-x-hidden">
        <PageHeader
          title="Collections Management"
          subtitle={`Showing ${startIndex + 1}-${Math.min(
            endIndex,
            collections.length
          )} of ${collections.length} collections`}
          actions={headerActions}
        />

        <Table columns={columns} maxHeight="480px">
          <Table.Header
            columns={columns}
            gridTemplate={gridTemplate}
            showSelectAll={true}
          />

          <Table.Body>
            <LoadingState
              loading={loading}
              error={error}
              empty={collections.length === 0}
              emptyText="No collections found"
              loadingText="Loading collections..."
              errorRetry={handleRetry}
            >
              {currentCollections.map((collection) => (
                <Table.Row key={collection.id} gridTemplate={gridTemplate}>
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-2 border-gray-500 bg-transparent accent-[#FF04B4] cursor-pointer"
                    />
                  </div>
                  <Table.Cell className="text-white font-medium">
                    {collection.collectionId}
                  </Table.Cell>
                  <Table.Cell className="text-white">
                    {collection.collectionName}
                  </Table.Cell>
                  <Table.Cell className="text-gray-300">
                    {collection.issuerName}
                  </Table.Cell>
                  <Table.Cell className="text-gray-300">
                    {collection.expectedReleaseDate}
                  </Table.Cell>
                  <Table.Cell className="text-white">
                    {collection.numberOfCardDesigns}
                  </Table.Cell>
                  <Table.Cell className="text-gray-300">
                    {collection.category}
                  </Table.Cell>
                  <Table.Cell className="text-white">
                    {collection.status}
                  </Table.Cell>
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      icon="/assets/orders-icons/eye-outline.svg"
                      iconAlt="view"
                      className="text-purple-400 hover:text-purple-300"
                    />
                  </div>
                </Table.Row>
              ))}
            </LoadingState>
          </Table.Body>
        </Table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Layout>
  );
};

export default Collections;
