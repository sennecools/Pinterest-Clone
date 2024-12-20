import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@components/header';
import Footer from '@components/footer';
import BoardGrid from '@components/boards/BoardsGrid';
import BoardService from '@services/BoardService';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import CreateBoard from '@components/boards/CreateBoard';

const Home = () => {
    const [boards, setBoards] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBoards = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await BoardService.getAllBoards();
            const filteredBoards = response.filter((board: any) => board.pins.length > 2);
            setBoards(filteredBoards);
        } catch (err: any) {
            console.error('Error fetching boards:', err);
            setError('Failed to load boards. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBoards();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Head>
                <title>Boards</title>
            </Head>
            <Header />
            <div className="container mx-auto py-8 flex-grow">
                {/* Show loading state */}
                {loading && <div className="text-center">Loading boards...</div>}

                {/* Show error message */}
                {error && <div className="text-red-500 text-center">{error}</div>}

                {/* Show boards once they are fetched */}
                {!loading && !error && <BoardGrid boards={boards} />}
            </div>
            <CreateBoard />
            <Footer />
        </div>
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
