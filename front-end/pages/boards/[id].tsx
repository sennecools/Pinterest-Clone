import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import BoardService from '@services/BoardService';
import Head from 'next/head';
import Header from '@components/header';
import Footer from '@components/footer';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const BoardDetail: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [board, setBoard] = useState<any | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchBoardData = async () => {
            try {
                const fetchedBoard = await BoardService.getBoardById(id as string);
                setBoard(fetchedBoard);
            } catch (error) {
                console.error('Error fetching board details:', error);
            }
        };

        fetchBoardData();
    }, [id]);

    if (!board) return <div>Loading...</div>;

    return (
        <div className="flex flex-col min-h-screen">
            <Head>
                <title>{board.name}</title>
            </Head>
            <Header />
            <div className="container mx-auto p-6 flex-grow">
                <h1 className="text-3xl font-semibold text-gray-800 text-center">{board.name}</h1>
                <p className="text-gray-600 mt-2">{board.description}</p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {board.pins.map((pin: any) => (
                        <div key={pin.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img
                                src={pin.imageUrl}
                                alt={pin.title}
                                className="w-full h-[200px] object-cover"
                            />
                            <div className="p-3">
                                <h3 className="text-sm font-semibold text-gray-800">{pin.title}</h3>
                                <p className="text-gray-600 text-xs mt-1">{pin.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
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

export default BoardDetail;
