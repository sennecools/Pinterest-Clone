import React from 'react';
import PinCard from './PinCard';

interface PinsGridProps {
    pins: {
        id: number;
        title: string;
        imageUrl: string;
        description?: string;
        categories?: { id: number; name: string }[];
    }[];
}

const PinsGrid: React.FC<PinsGridProps> = ({ pins }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {pins.map((pin) => (
                <PinCard
                    id={pin.id}
                    key={pin.id}
                    title={pin.title}
                    imageUrl={pin.imageUrl}
                    description={pin.description}
                    categories={pin.categories}
                />
            ))}
        </div>
    );
};

export default PinsGrid;
