import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Modal from '@components/ui/Modal';
import BoardService from '@services/BoardService';
import PinService from '@services/PinService';
import { isUserLoggedIn } from '@services/LocalStorageService';

interface PinCardProps {
    id: number;
    title: string;
    imageUrl: string;
    description?: string;
    categories?: { id: number; name: string }[];
}

const PinCard: React.FC<PinCardProps> = ({ id, title, imageUrl, description, categories }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [boards, setBoards] = useState<any[]>([]);
    const [selectedBoards, setSelectedBoards] = useState<Set<number>>(new Set());
    const [userHasBoards, setUserHasBoards] = useState(true);
    const [initialSelectedBoards, setInitialSelectedBoards] = useState<Set<number>>(new Set());
    const router = useRouter();

    const fetchUserBoards = async () => {
        try {
            const response = await BoardService.getBoardByUserId();
            const data = response;

            if (data.length === 0) {
                setUserHasBoards(false);
            } else {
                setBoards(data);
                const pinBoardIds = data.reduce((acc: number[], board: any) => {
                    board.pins.forEach((pin: any) => {
                        if (pin.id === id) acc.push(board.id);
                    });
                    return acc;
                }, []);

                setInitialSelectedBoards(new Set(pinBoardIds));
                setSelectedBoards(new Set(pinBoardIds));
            }
        } catch (error) {
            setUserHasBoards(false);
            console.error('Error fetching boards:', error);
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            fetchUserBoards();
        }
    }, [isModalOpen]);

    const handleBoardToggle = (boardId: number) => {
        setSelectedBoards((prev) => {
            const updated = new Set(prev);

            if (updated.has(boardId)) {
                updated.delete(boardId);
            } else {
                updated.add(boardId);
            }

            return updated;
        });
    };

    const handleSave = async () => {
        const selectedBoardsArray = Array.from(selectedBoards);

        const boardsToRemove = Array.from(initialSelectedBoards).filter(
            (boardId) => !selectedBoards.has(boardId)
        );

        const boardsToAdd = selectedBoardsArray.filter(
            (boardId) => !initialSelectedBoards.has(boardId)
        );

        if (boardsToRemove.length > 0) {
            await PinService.removePinFromBoards(id, boardsToRemove);
        }

        if (boardsToAdd.length > 0) {
            await PinService.addPinToBoards(id, boardsToAdd);
        }

        setModalOpen(false);
    };

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };

    const handleModalOpen = () => {
        if (!isUserLoggedIn()) {
            router.push('/login');
        } else {
            setModalOpen(true);
        }
    };

    return (
        <>
            <div
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform transform hover:scale-105"
                onClick={handleModalOpen}
            >
                <img src={imageUrl} alt={title} className="w-full h-[192px] object-cover" />
                <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-800">
                        {truncateText(title, 30)}
                    </h3>
                    {description && (
                        <p className="text-gray-600 text-xs mt-1">
                            {truncateText(description, 40)}
                        </p>
                    )}
                    {categories && categories.length > 0 && (
                        <div className="mt-2">
                            <p className="text-xs text-gray-500">Categories:</p>
                            <ul className="flex flex-wrap gap-1 mt-1">
                                {categories.slice(0, 2).map((category) => (
                                    <li
                                        key={category.id}
                                        className="text-xs bg-red-100 text-gray-700 px-2 py-1 rounded"
                                    >
                                        {category.name}
                                    </li>
                                ))}
                                {categories.length > 2 && (
                                    <li className="text-xs bg-red-100 text-gray-800 px-2 py-1 rounded">
                                        +{categories.length - 2}
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <div>
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-64 object-cover rounded mb-4"
                    />
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
                    <p className="text-gray-600 mb-4">
                        {description || 'No description available.'}
                    </p>

                    {categories && categories.length > 0 && (
                        <div className="mt-4">
                            <h4 className="text-lg font-semibold mb-2">Categories:</h4>
                            <ul className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <li
                                        key={category.id}
                                        className="text-sm bg-red-100 text-gray-700 px-3 py-1 rounded"
                                    >
                                        {category.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {userHasBoards && boards.length > 0 ? (
                        <div>
                            <h4 className="mt-4 text-lg font-semibold mb-2">
                                Select boards to add the pin
                            </h4>
                            <ul className="mb-6">
                                {boards.map((board) => (
                                    <li key={board.id} className="flex gap-2 mb-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedBoards.has(board.id)}
                                            onChange={() => handleBoardToggle(board.id)}
                                            className="form-checkbox h-5 w-5 text-red-500 hover:cursor-pointer accent-red-500"
                                        />
                                        <label className="text-gray-700">{board.name}</label>
                                    </li>
                                ))}
                            </ul>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={handleSave}
                            >
                                Add to boards
                            </button>
                        </div>
                    ) : (
                        <div className="text-center text-red-500 mt-4">
                            <a href="/boards" className="text-red-500 hover:underline">
                                Create a board
                            </a>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default PinCard;
