import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Header from '@components/header';
import Footer from '@components/footer';
import BoardService from '@services/BoardService';
import { getToken, getUserId } from '@services/LocalStorageService';

const Profile = () => {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [boards, setBoards] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const userId = getUserId();
            const token = getToken();
            if (!userId || !token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const userData = await response.json();
                setUserInfo(userData);

                const boardsResponse = await BoardService.getBoardByUserId();
                setBoards(boardsResponse);
            } catch (error) {
                console.error('Error fetching user info or boards:', error);
            }
        };

        fetchUserInfo();
    }, [router]);

    const handleSignOut = () => {
        localStorage.removeItem('loggedInUser');
        router.push('/login');
    };

    const handleRemoveBoard = async (boardId: number) => {
        try {
            await BoardService.removeBoardFromUser(boardId);
            setBoards((prevBoards) => prevBoards.filter((board) => board.id !== boardId));
        } catch (error) {
            console.error('Error deleting board:', error);
        }
    };

    const handleBoardClick = (boardId: number) => {
        router.push(`/boards/${boardId}`);
    };

    if (!userInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Head>
                <title>Profile</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <div className="container mx-auto py-8 flex-grow">
                <h1 className="text-3xl font-bold text-center mb-6">
                    Profile of {userInfo.username}
                </h1>

                <div className="flex flex-col items-center mb-8">
                    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
                        <div className="flex flex-col mb-6">
                            <label className="mb-2 font-semibold">Username:</label>
                            <p>{userInfo.username}</p>
                        </div>

                        <div className="mt-4">
                            <button
                                onClick={handleSignOut}
                                className="bg-red-600 text-white px-6 py-2 rounded-lg w-full"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Your Boards</h2>
                    {boards.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {boards.map((board) => (
                                <div
                                    key={board.id}
                                    className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                                    onClick={() => handleBoardClick(board.id)}
                                >
                                    <h3 className="text-xl font-semibold">{board.name}</h3>
                                    <p className="text-gray-600 mt-2">
                                        Created on: {new Date(board.createdAt).toLocaleDateString()}
                                    </p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveBoard(board.id);
                                        }}
                                        className="bg-red-600 text-white mt-4 px-4 py-2 rounded-lg w-full"
                                    >
                                        Remove Board
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-600 mt-4">
                            You don't have any boards yet.{' '}
                            <a href="/boards" className="text-red-500 hover:underline">
                                Create a board here!
                            </a>
                        </p>
                    )}
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

export default Profile;
