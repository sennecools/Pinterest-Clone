import Head from 'next/head';
import Header from '@components/header';
import Footer from '@components/footer';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Contact: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Head>
                <title>Contact Pinnacle</title>
            </Head>
            <Header />
            <div className="flex flex-col items-center justify-center flex-grow">
                <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
                    <p className="text-gray-600 text-lg mb-6">
                        Have questions, feedback, or suggestions? Feel free to reach out!
                    </p>
                    <p className="text-gray-600 text-lg mb-6">
                        {'You can contact the creator of Pinnacle, Senne Cools, at: '}
                        <a
                            href="mailto:sennecools2004@gmail.com"
                            className="hover:underline text-red-500"
                        >
                            sennecools2004@gmail.com
                        </a>
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

export default Contact;
