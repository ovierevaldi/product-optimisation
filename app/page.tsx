import { redirect } from 'next/navigation';

const HomePage = () => {
    redirect('/products');
};

export default HomePage;