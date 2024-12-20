import React from 'react';
import BoardCard from './BoardCard';

interface BoardGridProps {
    boards: {
        id: number;
        name: string;
        userId: number;
        createdAt: string;
        pins: { id: number; title: string; imageUrl: string; description: string }[];
    }[];
}

const BoardGrid: React.FC<BoardGridProps> = ({ boards }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {boards.map((board) => (
                <BoardCard key={board.id} id={board.id} name={board.name} pins={board.pins} />
            ))}
        </div>
    );
};

export default BoardGrid;
