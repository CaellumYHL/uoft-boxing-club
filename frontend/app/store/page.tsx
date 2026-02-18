import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { getProducts } from '../../utils/productService';



export default function Store() {
  const products = getProducts();
  const memberships = products.filter(p => p.id.includes('membership'));
  const merch = products.filter(p => !p.id.includes('membership'));

  return (
    <main className="min-h-screen bg-background text-white pb-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-32">

        {/* MEMBERSHIPS SECTION */}
        <h2 className="text-center text-2xl font-bold mb-10">Memberships</h2>
        <div className="flex justify-center gap-12 mb-16">
          {memberships.map((item) => (
            <Link href={`/store/${item.id}`} key={item.id} className="group flex flex-col items-center">
              <div className="w-64 h-64 bg-[#3B71CA] rounded-xl mb-4 group-hover:bg-blue-400 transition cursor-pointer shadow-lg shadow-blue-900/20"></div>
              <h3 className="font-bold text-lg text-center w-40">{item.name}</h3>
              <p className="text-white font-bold">${item.price}</p>
            </Link>
          ))}
        </div>

        {/* DIVIDER */}
        <div className="w-1/2 mx-auto h-px bg-white/30 mb-16"></div>

        {/* MERCH SECTION */}
        <h2 className="text-center text-2xl font-bold mb-10">Merch</h2>
        <div className="flex justify-center gap-12 flex-wrap">
          {merch.map((item) => (
            <Link href={`/store/${item.id}`} key={item.id} className="group flex flex-col items-center">
              {/* Merch cards are slightly smaller in your design */}
              <div className="w-56 h-56 bg-[#3B71CA] rounded-xl mb-4 group-hover:bg-blue-400 transition cursor-pointer shadow-lg shadow-blue-900/20"></div>
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-white font-bold">${item.price}</p>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
