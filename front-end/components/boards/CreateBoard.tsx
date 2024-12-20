import React, { useState } from 'react';
import Modal from '@components/ui/Modal';
import BoardService from '@services/BoardService';
import { getToken, getUserId } from '@services/LocalStorageService';
import { useRouter } from 'next/router';

const CreateBoard: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [boardName, setBoardName] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBoardName(e.target.value);
    };

    const handleCreateBoardClick = () => {
        if (!getToken() || !getUserId()) {
            router.push('/login');
        } else {
            setModalOpen(true);
        }
    };

    const handleSubmit = async () => {
        if (!boardName.trim()) {
            setError('Board name is required');
            return;
        }

        try {
            const response = await BoardService.createBoard(boardName);
            console.log('Board created successfully!');
            setModalOpen(false);
        } catch (error) {
            console.log('Error creating board', error);
            alert('Failed to create board');
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <div
                onClick={handleCreateBoardClick}
                className="fixed bottom-4 right-4 bg-red-500 text-white rounded-full p-6 shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:bg-red-600"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16M4 12h16" />
                </svg>
            </div>

            {/* Modal for Board Creation */}
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <div className="p-6 max-w-md mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">Create New Board</h2>

                    {/* Board Name */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Board Name</label>
                        <input
                            type="text"
                            value={boardName}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {error && <p className="text-red-500 text-xs">{error}</p>}
                    </div>

                    <div className="mt-4">
                        <button
                            onClick={handleSubmit}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Create Board
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default CreateBoard;
