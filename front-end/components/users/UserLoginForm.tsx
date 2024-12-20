import LanguageLogin from '@components/language/LanguageForm';
import { StatusMessage } from '@types';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import UserService from '@services/UserService';

const UserLoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const router = useRouter();
    const { t } = useTranslation('common');

    const validate = (): boolean => {
        const errors = [];
        if (!username.trim()) errors.push(t('login.validate.name'));
        if (!password.trim()) errors.push(t('login.validate.password'));

        setStatusMessages(errors.map((msg) => ({ message: msg, type: 'error' })));
        return errors.length === 0;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validate()) return;

        try {
            const response = await UserService.loginUser({ username, password });

            if (response.ok) {
                const data = await response.json();

                localStorage.setItem(
                    'loggedInUser',
                    JSON.stringify({
                        token: data.token,
                        id: data.user.id,
                        username: data.user.username,
                        role: data.user.role,
                    })
                );

                setStatusMessages([{ message: t('login.success'), type: 'success' }]);
                setTimeout(() => router.push('/'), 2000);
            } else {
                setStatusMessages([{ message: t('login.error'), type: 'error' }]);
            }
        } catch (error) {
            setStatusMessages([{ message: t('general.error'), type: 'error' }]);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-10">
                <h3 className="text-4xl font-bold text-center mb-8 text-gray-800">
                    {t('login.title')}
                </h3>

                {statusMessages.map(({ message, type }, index) => (
                    <div
                        key={index}
                        className={classNames('mb-3 text-center', {
                            'text-red-500': type === 'error',
                            'text-green-500': type === 'success',
                        })}
                    >
                        {message}
                    </div>
                ))}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="username" className="block text-base mb-3 font-medium">
                            {t('login.label.username')}
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border rounded-lg w-full p-4 text-base focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-base mb-3 font-medium">
                            {t('login.label.password')}
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border rounded-lg w-full p-4 text-base focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white font-bold py-3 text-lg rounded-full hover:bg-red-700 transition"
                    >
                        {t('login.button')}
                    </button>
                </form>

                <p className="text-center text-base mt-8 text-gray-600">
                    {t('login.noAccount')}{' '}
                    <a href="/signup" className="text-red-600 hover:underline font-medium">
                        {t('login.signup')}
                    </a>
                </p>
                <LanguageLogin />
            </div>
        </div>
    );
};

export default UserLoginForm;
