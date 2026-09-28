import  { useState, useMemo } from "react";
import {
  Search,
  Package,
} from "lucide-react";



import { useGetAllproducts } from "../../../hook/server/useGetproduct.tsx";
import AppNavbar from "../../../common/Navbar.tsx";
import Loader from "../../../../../components/ui/loader.tsx";
import { ProductCard } from "../components/ProductCad.tsx";



 const UserDashboardPage = () => {


  const { data: products, isLoading } = useGetAllproducts();

  const [searchQuery, setSearchQuery] = useState("");


  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products?.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [products, searchQuery]);

  if(isLoading){
    return <Loader/>
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0d11] text-zinc-100 selection:bg-purple-500/30 selection:text-purple-200">
      {/* Reusable Modern Navbar (No login/register buttons) */}
      <AppNavbar role="user" />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
    

        {/* Search, Filter & Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-6">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or keyword..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#14151b] border border-[#252733] text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-[#7c5cfc] focus:ring-1 focus:ring-[#7c5cfc]/40 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Product Cards Grid: Animated and Responsive */}
        {filteredProducts && filteredProducts?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.slug || product.sku}
                product={product}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 text-center flex flex-col items-center justify-center rounded-2xl bg-[#14151b]/50 border border-dashed border-[#292b36] p-8">
            <div className="w-14 h-14 rounded-2xl bg-[#1f2029] border border-[#2e303d] flex items-center justify-center text-zinc-500 mb-3">
              <Package size={26} />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              No products match your filters
            </h3>
            <p className="text-xs text-zinc-400 max-w-sm mt-1 mb-4">
              Try adjusting your search query, selecting another category, or
              viewing all products.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white transition-all cursor-pointer"
            >
              Reset search
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboardPage;
