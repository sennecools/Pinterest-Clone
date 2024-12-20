import Head from 'next/head';
import Header from '@components/header';
import Footer from '@components/footer';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const About: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Head>
                <title>About Pinnacle</title>
            </Head>
            <Header />
            <div className="flex flex-col items-center justify-center flex-grow">
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
                        About Pinnacle
                    </h1>
                    <p className="text-gray-600 text-lg mb-6">
                        Pinnacle is a school project created by Senne Cools. It is a
                        Pinterest-inspired application designed to organize and share your favorite
                        ideas, inspirations, and projects in a creative way.
                    </p>
                    <p className="text-gray-600 text-lg mb-6">
                        This project is not intended for commercial use but serves as a
                        demonstration of full-stack web development skills.
                    </p>
                    <p className="text-gray-500 text-sm">Built with ❤️ by Senne Cools.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale || 'en', ['common'])),
        },
    };
};

export default About;
