import LanguageLogin from '@components/language/LanguageForm';
import { StatusMessage } from '@types';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import UserService from '@services/UserService';

const UserSignupForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const router = useRouter();
    const { t } = useTranslation('common');

    const validate = (): boolean => {
        const errors = [];
        if (!username.trim()) errors.push(t('signup.validate.name'));
        if (!password.trim()) errors.push(t('signup.validate.password'));
        if (password.length < 8) errors.push(t('signup.validate.passwordLength'));
        if (password !== confirmPassword) errors.push(t('signup.validate.confirmPassword'));

        setStatusMessages(errors.map((msg) => ({ message: msg, type: 'error' })));
        return errors.length === 0;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!validate()) return;

        try {
            const signupResponse = await UserService.signupUser({ username, password });

            if (!signupResponse.ok) {
                const errorData = await signupResponse.json();
                setStatusMessages([{ message: errorData.error, type: 'error' }]);
                return;
            }

            const loginResponse = await UserService.loginUser({ username, password });

            if (loginResponse.ok) {
                const loginData = await loginResponse.json();
                localStorage.setItem(
                    'loggedInUser',
                    JSON.stringify({
                        token: loginData.token,
                        username: loginData.user.username,
                        role: loginData.user.role,
                    })
                );

                setStatusMessages([{ message: t('signup.success'), type: 'success' }]);
                setTimeout(() => router.push('/tutorial'), 2000);
            } else {
                setStatusMessages([{ message: t('signup.errorLogin'), type: 'error' }]);
            }
        } catch (error: any) {
            setStatusMessages([{ message: error.message, type: 'error' }]);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-10">
                <h3 className="text-4xl font-bold text-center mb-8 text-gray-800">
                    {t('signup.title')}
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
                            {t('signup.label.username')}
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
                            {t('signup.label.password')}
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border rounded-lg w-full p-4 text-base focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-base mb-3 font-medium"
                        >
                            {t('signup.label.confirmPassword')}
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="border rounded-lg w-full p-4 text-base focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white font-bold py-3 text-lg rounded-full hover:bg-red-700 transition"
                    >
                        {t('signup.button')}
                    </button>
                </form>

                <p className="text-center text-base mt-8 text-gray-600">
                    {t('signup.alreadyUser')}{' '}
                    <a href="/login" className="text-red-600 hover:underline font-medium">
                        {t('signup.login')}
                    </a>
                </p>
                <LanguageLogin />
            </div>
        </div>
    );
};

export default UserSignupForm;
