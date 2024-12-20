import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-100 border-t border-gray-300 py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-between items-center">
                    {/* Copyright */}
                    <div className="flex flex-col items-start mb-6 md:mb-0">
                        <h2 className="text-2xl font-bold text-gray-800">Pinterest Clone</h2>
                        <p className="text-sm text-gray-600 mt-2">
                            &copy; {new Date().getFullYear()} Senne Cools. All rights reserved.
                        </p>
                    </div>

                    {/* Navigatielinks */}
                    <div className="flex space-x-8 mb-6 md:mb-0">
                        <a href="/about" className="text-gray-600 hover:text-gray-800">
                            About
                        </a>
                        <a href="/contact" className="text-gray-600 hover:text-gray-800">
                            Contact
                        </a>
                    </div>

                    {/* LinkedIn Link */}
                    <div className="flex space-x-4">
                        <a
                            href="https://www.linkedin.com/in/senne-cools/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-blue-600"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.2.79 24 1.77 24h20.46c.99 0 1.77-.8 1.77-1.73V1.73C24 .77 23.22 0 22.23 0zM7.12 20.44H3.56V9.07h3.56v11.37zM5.34 7.59c-1.14 0-2.06-.93-2.06-2.08 0-1.14.92-2.07 2.06-2.07 1.15 0 2.08.93 2.08 2.07 0 1.15-.93 2.08-2.08 2.08zm15.1 12.85h-3.56v-5.52c0-1.31-.03-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9v5.62h-3.56V9.07h3.42v1.55h.05c.48-.91 1.64-1.87 3.37-1.87 3.61 0 4.28 2.38 4.28 5.47v6.22z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
