import Head from 'next/head';
import UserSignupForm from '@components/users/UserSignupForm';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';

const Login = () => (
    <>
        <Head>
            <title>Signup</title>
        </Head>
        <main className="flex justify-center items-center min-h-screen bg-gray-50">
            <UserSignupForm />
        </main>
    </>
);

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale || 'en', ['common'])),
        },
    };
};

export default Login;
