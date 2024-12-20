import Head from 'next/head';
import UserLoginForm from '@components/users/UserLoginForm';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';

const Login = () => (
    <>
        <Head>
            <title>Login</title>
        </Head>
        <main className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white p- rounded-lg">
                <UserLoginForm />

                {/* Table with Username and Password for Teachers */}
                <div className="absolute bottom-0 right-0 p-4 bg-white rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-700">User Credentials</h2>
                    <table className="min-w-full mt-4 table-auto">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b text-left">Username</th>
                                <th className="px-4 py-2 border-b text-left">Password</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="px-4 py-2 border-b">admin_user</td>
                                <td className="px-4 py-2 border-b">admin_password</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 border-b">normal_user</td>
                                <td className="px-4 py-2 border-b">user_password</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
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
