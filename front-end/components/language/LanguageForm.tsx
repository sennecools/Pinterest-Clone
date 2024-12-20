import { useRouter } from 'next/router';

const LanguageForm: React.FC = () => {
    const router = useRouter();
    const { locale, pathname, asPath, query } = router;

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newLocale = event.target.value;
        router.push({ pathname, query }, asPath, { locale: newLocale });
    };

    return (
        <div className="flex justify-center mt-4">
            <select
                className="p-2 border rounded text-gray-700 bg-white focus:ring-2 focus:ring-red-500"
                value={locale}
                onChange={handleLanguageChange}
            >
                <option value="en">English</option>
                <option value="nl">Nederlands</option>
            </select>
        </div>
    );
};

export default LanguageForm;
