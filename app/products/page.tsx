'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
    images: string[];
    title: string;
    price: number;
    description: string;
    id: number;
    // Add other properties as needed
}

interface Category {
    name: string;
    id: number;
    // Add other properties as needed
}


const Product = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortOrder, setSortOrder] = useState('asc'); // State for sort order

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Set the number of items per page

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await fetch('https://dummyjson.com/products/categories');
            const data = await res.json();
            setCategories(data);
        };

        fetchProducts(itemsPerPage, 1);
        fetchCategories();
    }, []);

    const fetchProducts = async (itemsPerPage:number, currentPage: number) => {
        const res = await fetch(`https://dummyjson.com/products?limit=${itemsPerPage}&skip=${currentPage * itemsPerPage}`);
        const data = await res.json();
        setProducts(data.products);
        setLoading(false);
    };

    const getProductByCategory = async (selectedCategory: string) => {
        const res = await fetch(`https://dummyjson.com/products/category/${selectedCategory}`);
        const data = await res.json();
        setProducts(data.products); // Update the products based on the fetched data
    };

    const filterProduct = async (sortOrder: string) => {
        // You can implement fetching logic if you want to filter based on categories
        // For now, we will just sort the current products
        const sortedProducts = [...products]; // Create a copy of products for sorting

        sortedProducts.sort((a: Product, b: Product) => {
            return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        });

        setProducts(sortedProducts); // Update the state with sorted products
    };


    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
        if(event.target.value != 'all')
            getProductByCategory(event.target.value); 
        else
            fetchProducts(itemsPerPage, currentPage);
        // Call filterProduct to fetch filtered products
        // Optionally filter products based on selected category
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOrder(event.target.value);
        filterProduct(event.target.value);
    };


    if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-8">Product List</h1>

        <div className="mb-6 flex justify-between items-center">
         <div>
                <label className="mr-2">Filter by Category:</label>
                <select 
                        id="category" 
                        className="border rounded-md p-2"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        <option value="all">All</option>
                        {categories.map((category: Category, index) => (
                            <option key={index} value={category.name}>{category.name}</option>
                        ))}
                </select>
            </div>
            <div>
                <label className="mr-2">Sort by Price:</label>
                <select 
                    id="sort" 
                    className="border rounded-md p-2"
                    value={sortOrder}
                    onChange={handleSortChange}
                >
                    <option value="asc">Low to High</option>
                    <option value="desc">High to Low</option>
                </select>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {products.map((product: Product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <Image
                        src={product.images[0]} // Assuming product.images is a valid image source
                        alt="Product 1"
                        width={600} // Set a width
                        height={192} // Set a height (adjust based on your design)
                        className="object-cover rounded-md mb-4" // Note: Width and height are required for Next.js Image
                    />
                    <h2 className="text-xl font-semibold">{product.title}</h2>
                    <p className="text-green-600 text-lg font-bold">{product.price}</p>
                    <p className="text-gray-700">{product.description}</p>
                </div>
            </Link>
         ))}
        </div>

        {/* Pagination Controls */}
       {  
       selectedCategory == 'all' &&
         <div className="flex justify-center mt-6">
         {Array.from({ length: itemsPerPage }, (_, index) => (
             <button 
                 key={index + 1}
                 onClick={() => {
                     setCurrentPage(index + 1);
                     fetchProducts(itemsPerPage, index + 1);
                 }}
                 className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white'}`}
             >
                 {index + 1}
             </button>
         ))}
 </div>
       }
    </div>
  );
}

export default Product