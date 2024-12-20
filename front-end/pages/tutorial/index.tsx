import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '@components/header';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';

const Home = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const { t } = useTranslation('common');

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            router.push('/login');
        }
    }, [router]);

    return (
        <>
            <Head>
                <title>{t('home.title')}</title>
            </Head>
            <Header />
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <h1 className="text-6xl font-bold mb-4">{t('home.title')}</h1>
                {user && (
                    <p className="text-2xl">{t('home.greeting', { username: user.username })}</p>
                )}
                <p className="text-gray-600 mt-4 text-xl">{t('home.explore')}</p>
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale || 'en', ['common'])),
        },
    };
};

export default Home;
