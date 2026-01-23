'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { Product } from '../../utils/data';

export default function Admin() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetch('/api/products')
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            });
    }, []);

    const handleChange = (index: number, field: keyof Product, value: string | number) => {
        const newProducts = [...products];
        newProducts[index] = { ...newProducts[index], [field]: value };
        setProducts(newProducts);
    };

    const handleAdd = () => {
        setProducts([{
            id: `new-product-${Date.now()}`,
            name: 'New Product',
            price: 0,
            description: 'Description here...',
        }, ...products]);
    };

    const handleSave = async () => {
        setStatus('Saving...');
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(products),
            });
            if (res.ok) {
                setStatus('Saved successfully!');
                setTimeout(() => setStatus(''), 3000);
            } else {
                setStatus('Error saving.');
            }
        } catch (e) {
            setStatus('Error saving.');
        }
    };

    if (loading) return <div className="min-h-screen bg-background text-white flex items-center justify-center">Loading...</div>;

    return (
        <main className="min-h-screen bg-background text-white pb-20">
            <Navbar />
            <div className="max-w-6xl mx-auto px-6 pt-32">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-bold">Store Admin</h1>
                    <div className="flex gap-4">
                        <button onClick={handleAdd} className="bg-[#3B71CA] hover:bg-blue-600 px-6 py-2 rounded font-bold transition">
                            + Add Item
                        </button>
                        <button onClick={handleSave} className="bg-[#C92C2C] hover:bg-red-700 px-6 py-2 rounded-full font-bold transition">
                            {status || 'Save Changes'}
                        </button>
                    </div>
                </div>

                <div className="space-y-8">
                    {products.map((product, index) => (
                        <div key={product.id} className="bg-white/5 p-6 rounded-xl border border-white/10">
                            <h3 className="text-xl font-bold mb-4">{product.name} ({product.id})</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={product.name}
                                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                                        className="w-full bg-black/30 p-2 rounded text-white border border-white/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Price ($)</label>
                                    <input
                                        type="number"
                                        value={product.price}
                                        onChange={(e) => handleChange(index, 'price', Number(e.target.value))}
                                        className="w-full bg-black/30 p-2 rounded text-white border border-white/20"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold mb-2">Description</label>
                                    <textarea
                                        value={product.description}
                                        onChange={(e) => handleChange(index, 'description', e.target.value)}
                                        className="w-full bg-black/30 p-2 rounded text-white border border-white/20 h-24"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold mb-2">Image URL (Optional)</label>
                                    <input
                                        type="text"
                                        value={product.image || ''}
                                        onChange={(e) => handleChange(index, 'image', e.target.value)}
                                        className="w-full bg-black/30 p-2 rounded text-white border border-white/20"
                                        placeholder="/path/to/image.jpg"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
