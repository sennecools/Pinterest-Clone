import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@components/header';
import Footer from '@components/footer';
import PinsGrid from '@components/pins/PinsGrid';
import PinsService from '@services/PinService';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CreatePin from '@components/pins/CreatePin';

const Home = () => {
    const [pins, setPins] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPins = async (currentPage: number) => {
        setLoading(true);
        try {
            const response = await PinsService.getPins(currentPage);
            const data = await response.json();
            if (data.length < 12) {
                setHasMore(false);
            }
            setPins((prevPins) => [...prevPins, ...data]);
        } catch (err: any) {
            console.error('Error fetching pins:', err);
            setError('Failed to load pins. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPins(page);
    }, [page]);

    const loadMorePins = () => {
        setPage((prevPage) => prevPage + 1);
    };

    return (
        <>
            <Head>
                <title>Home - Pins</title>
            </Head>
            <Header />
            <div className="container mx-auto py-4">
                {error ? (
                    <div className="text-red-500 text-center">{error}</div>
                ) : (
                    <>
                        <PinsGrid pins={pins} />
                        {hasMore && (
                            <div className="text-center mt-8">
                                <button
                                    onClick={loadMorePins}
                                    disabled={loading}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-300"
                                >
                                    {loading ? 'Loading...' : 'Load More'}
                                </button>
                            </div>
                        )}
                        {!hasMore && (
                            <p className="text-center text-gray-500 mt-4">No more pins to load.</p>
                        )}
                    </>
                )}
            </div>
            <CreatePin />
            <Footer />
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale || 'en', ['common'])),
        },
    };
};

export default Home;
