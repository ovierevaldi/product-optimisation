'use client';

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
}

const ProductDetail = () => {
    const router = useRouter();
    const { id } = useParams();

    const [productDetail, setProductDetail] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProductDetail = async () => {
            const res = await fetch(`https://dummyjson.com/products/${id}`);
            const data = await res.json();
            setProductDetail(data); // Assuming `data` is the product object
            setLoading(false);
        };

        if (id) {
            getProductDetail();
        }
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!productDetail) return <div>Product not found</div>;

    return (
        <div className="container mx-auto py-10">
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
                <AliceCarousel
                    items={productDetail.images.map((imageSrc, index) => (
                        <Image
                            key={index}
                            src={imageSrc}
                            alt={`${productDetail.name} image ${index + 1}`}
                            width={600} // Set a width
                            height={240} // Set a height
                            className="object-cover rounded-md" // Note: Width and height are required for Next.js Image
                        />
                    ))}
                    autoPlay
                    autoPlayInterval={3000}
                    infinite
                    disableButtonsControls
                    responsive={{
                        0: { items: 1 },
                        1024: { items: 1 },
                    }}
                />
                <h1 className="text-3xl font-bold mb-2">{productDetail.name}</h1>
                <p className="text-gray-700 mb-4">{productDetail.description}</p>
                <p className="text-green-600 text-lg font-bold mb-6">${productDetail.price}</p>
                <button 
                    onClick={() => router.back()} 
                    className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 transition duration-200"
                >
                    Back to Products
                </button>
            </div>
        </div>
    );
};

export default ProductDetail;
