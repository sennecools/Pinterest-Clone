import { useRouter } from 'next/router';

const Language: React.FC = () => {
    const router = useRouter();
    const { locale, pathname, asPath, query } = router;

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocale = event.target.value;
        router.push({ pathname, query }, asPath, { locale: newLocale });
    };

    return (
        <div className="ml-4">
            <select
                id="language"
                value={locale}
                onChange={handleLanguageChange}
                className="bg-transparent border-b-2 border-gray-300 text-gray-700 focus:outline-none focus:border-red-600 text-lg cursor-pointer rounded-md py-1 px-2 transition-all ease-in-out bg-white"
            >
                <option value="en" className="text-gray-700">
                    English
                </option>
                <option value="nl" className="text-gray-700">
                    Nederlands
                </option>
            </select>
        </div>
    );
};

export default Language;
