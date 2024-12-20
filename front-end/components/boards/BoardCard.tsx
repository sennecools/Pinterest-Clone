import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface BoardCardProps {
    id: number;
    name: string;
    pins: { id: number; title: string; imageUrl: string; description: string }[];
}

const BoardCard: React.FC<BoardCardProps> = ({ id, name, pins }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageTransitioning, setImageTransitioning] = useState(false);

    const cycleImages = () => {
        setImageTransitioning(true);
        setTimeout(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % pins.length);
            setImageTransitioning(false);
        }, 300);
    };

    useEffect(() => {
        const intervalId = setInterval(cycleImages, 5000);
        return () => clearInterval(intervalId);
    }, [pins.length]);

    const pin = pins[currentImageIndex];
    const truncatedName = name.length > 30 ? `${name.slice(0, 30)}...` : name;
    const truncatedPins = pins.slice(0, 3);
    const extraPins = pins.length - 3;

    return (
        <Link
            href={`/boards/${id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform transform hover:scale-105 w-[340px] h-[450px] flex flex-col"
        >
            {/* Image carousel */}
            <div className="relative w-full h-[192px] overflow-hidden">
                <img
                    src={pin?.imageUrl}
                    alt={name}
                    className={`w-full h-full object-cover transition-all duration-300 ease-in-out ${
                        imageTransitioning ? 'opacity-0' : 'opacity-100'
                    }`}
                />
            </div>

            <div className="p-3 flex flex-col flex-grow">
                {/* Truncated Board Title */}
                <h3 className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                    {truncatedName}
                </h3>

                {/* Truncated Description */}
                <p className="text-gray-600 text-xs mt-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {pin?.description}
                </p>

                {/* Pin Titles List */}
                <div className="mt-2 flex-grow">
                    <p className="text-xs text-gray-500">Titles:</p>
                    <ul className="mt-1">
                        {truncatedPins.map((pin) => (
                            <li key={pin.id} className="text-xs text-gray-700 m-1">
                                <div className="bg-red-50 text-gray-700 px-3 py-1 rounded inline-block max-w-full overflow-hidden">
                                    {pin.title.length > 50
                                        ? `${pin.title.slice(0, 50)}...`
                                        : pin.title}
                                </div>
                            </li>
                        ))}
                        {extraPins > 0 && (
                            <li className="text-xs text-gray-500">
                                +{extraPins} more title{extraPins > 1 ? 's' : ''}
                            </li>
                        )}
                    </ul>
                </div>

                {/* Pins Count */}
                <div className="mt-2 flex items-center justify-between">
                    <div className="text-xs bg-red-50 text-gray-700 px-2 py-1 rounded">
                        {pins.length} pins
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BoardCard;
