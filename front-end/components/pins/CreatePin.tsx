import React, { useState, useEffect } from 'react';
import Modal from '@components/ui/Modal';
import CategoryService from '@services/CategoryService';
import PinService from '@services/PinService';
import { isUserLoggedIn } from '@services/LocalStorageService';
import { useRouter } from 'next/router';

const CreatePin: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [pinDetails, setPinDetails] = useState({
        title: '',
        description: '',
        categories: [] as number[],
        imageUrl: '',
    });
    const [categories, setCategories] = useState<any[]>([]);
    const [errors, setErrors] = useState<any>({});
    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await CategoryService.getCategories();
                setCategories(response);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        if (isModalOpen) {
            fetchCategories();
        }
    }, [isModalOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPinDetails({ ...pinDetails, [e.target.name]: e.target.value });
    };

    const handleCategoryToggle = (categoryId: number) => {
        setPinDetails((prev) => {
            const updatedCategories = new Set(prev.categories);
            if (updatedCategories.has(categoryId)) {
                updatedCategories.delete(categoryId);
            } else {
                updatedCategories.add(categoryId);
            }
            return { ...prev, categories: Array.from(updatedCategories) };
        });
    };

    const validateForm = () => {
        const newErrors: any = {};
        let isValid = true;

        if (!pinDetails.title.trim()) {
            newErrors.title = 'Title is required';
            isValid = false;
        }

        if (!pinDetails.description.trim()) {
            newErrors.description = 'Description is required';
            isValid = false;
        }

        if (!pinDetails.imageUrl.trim()) {
            newErrors.imageUrl = 'Image URL is required';
            isValid = false;
        }

        if (pinDetails.categories.length === 0) {
            newErrors.categories = 'At least one category must be selected';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        console.log('Creating pin:', pinDetails);

        try {
            const response = await PinService.createPin(pinDetails);
            console.log('Pin created successfully!');
            setModalOpen(false);
        } catch (error) {
            console.log('Error creating pin');
        }
    };

    const handleCreatePinClick = () => {
        if (!isUserLoggedIn()) {
            router.push('/login');
        } else {
            setModalOpen(true);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <div
                onClick={handleCreatePinClick}
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

            {/* Modal for Pin Creation */}
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
                <div className="p-6 max-w-md mx-auto">
                    <h2 className="text-2xl font-semibold mb-4">Create New Pin</h2>

                    {/* Pin Title */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={pinDetails.title}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                    </div>

                    {/* Pin Description */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={pinDetails.description}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        ></textarea>
                        {errors.description && (
                            <p className="text-red-500 text-xs">{errors.description}</p>
                        )}
                    </div>

                    {/* Pin Image URL */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Image URL</label>
                        <input
                            type="text"
                            name="imageUrl"
                            value={pinDetails.imageUrl}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        {errors.imageUrl && (
                            <p className="text-red-500 text-xs">{errors.imageUrl}</p>
                        )}
                    </div>

                    {/* Categories */}
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Categories</label>
                        <div className="overflow-y-auto max-h-40">
                            {categories.map((category) => (
                                <div key={category.id} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        checked={pinDetails.categories.includes(category.id)}
                                        onChange={() => handleCategoryToggle(category.id)}
                                        className="mr-2"
                                    />
                                    <label className="text-gray-700">{category.name}</label>
                                </div>
                            ))}
                        </div>
                        {errors.categories && (
                            <p className="text-red-500 text-xs">{errors.categories}</p>
                        )}
                    </div>

                    <div className="mt-4">
                        <button
                            onClick={handleSubmit}
                            className="bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Create Pin
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default CreatePin;
