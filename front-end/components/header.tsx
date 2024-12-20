import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import Language from '@components/language/Language';
import { isUserLoggedIn, getUserRole } from '@services/LocalStorageService';

const Header: React.FC = () => {
    const { t } = useTranslation('common');

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const loggedIn = isUserLoggedIn();
        setIsLoggedIn(loggedIn);
        if (loggedIn) {
            const userRole = getUserRole();
            setIsAdmin(userRole === 'ADMIN');
        }
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        window.location.href = '/';
    };

    return (
        <header className="flex justify-between items-center px-8 py-4 bg-white">
            {/* Left side of the navbar */}
            <div className="text-xl flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-red-600 mr-3">
                    <Link href="/">
                        <span>Pinnacle</span>
                    </Link>
                </h1>
                <nav className="flex space-x-4">
                    <Link href="/" className="text-gray-700 hover:text-black">
                        {t('header.nav.pins')}
                    </Link>
                    <Link href="/boards" className="text-gray-700 hover:text-black">
                        {t('header.nav.boards')}
                    </Link>
                    {isAdmin && (
                        <Link href="/admin" className="text-gray-700 hover:text-black">
                            Admin
                        </Link>
                    )}
                </nav>
            </div>

            {/* Right side of the navbar */}
            <div className="text-xl flex items-center space-x-6">
                <Language />
                <Link href="/profile" className="text-gray-700 hover:text-black">
                    {t('header.nav.profile')}
                </Link>

                {/* login / logout */}
                {isLoggedIn ? (
                    <button
                        onClick={handleSignOut}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        {t('header.nav.signout')}
                    </button>
                ) : (
                    <Link href="/login">
                        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                            {t('header.nav.login')}
                        </button>
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;
