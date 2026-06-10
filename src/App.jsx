import { useState, useEffect, useMemo } from 'react';
import { getProducts, getCategories, getProductsByCategory } from './services/api';

function App() {
  // ============ STATE MANAGEMENT ============
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [sortBy, setSortBy] = useState('default');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentView, setCurrentView] = useState('catalog');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Wishlist with localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wishlist')) || [];
    } catch {
      return [];
    }
  });

  // Cart with localStorage
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      return [];
    }
  });

  // ============ UTILITY FUNCTIONS ============
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      let updated;
      if (existingItem) {
        updated = prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...prev, { ...product, quantity: 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
    showToast(`✅ "${product.title.slice(0, 30)}..." ditambahkan ke keranjang!`);
    setSelectedProduct(null);
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
    showToast('Item dihapus dari keranjang');
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  const renderStars = (rate) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.round(rate) ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  // ============ FETCH DATA AWAL ============
  const initData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [prodData, catData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(prodData);
      setCategories(['Semua', ...catData]);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setError('Gagal mengambil data awal. Periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  };

  // ============ LIFECYCLE EFFECTS ============
  useEffect(() => {
    (async () => {
      await initData();
    })();
  }, []);

  // Efek untuk fetch ulang saat kategori berubah
  useEffect(() => {
    if (categories.length === 0) return;

    let mounted = true;
    const controller = new AbortController();

    (async () => {
      if (!mounted || controller.signal.aborted) return;

      try {
        setLoading(true);
        setError(null);

        const prodData =
          selectedCategory === 'Semua'
            ? await getProducts()
            : await getProductsByCategory(selectedCategory);

        if (!mounted || controller.signal.aborted) return;
        setProducts(prodData);
        setCurrentPage(1);
      } catch (err) {
        if (!mounted || controller.signal.aborted) return;
        console.error(err);
        setError(`Gagal memuat produk dari kategori "${selectedCategory}".`);
      } finally {
        if (mounted && !controller.signal.aborted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [selectedCategory, categories.length]);

  // Efek keyboard listener
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setSelectedProduct(null);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // ============ FILTER & SORT & PAGINATION ============
  const filteredProducts = useMemo(() => {
    let output = [...products];

    if (searchQuery.trim() !== '') {
      output = output.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortBy === 'price-low') output.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') output.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') output.sort((a, b) => b.rating.rate - a.rating.rate);
    else if (sortBy === 'popular') output.sort((a, b) => b.rating.count - a.rating.count);

    return output;
  }, [searchQuery, sortBy, products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-white">
      {/* ===== NAVBAR - MOBILE-FIRST RESPONSIVE ===== */}
      <nav className="sticky top-0 z-40 bg-white border-b border-[#dddddd] shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4 max-w-7xl mx-auto">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 
                className="text-xl sm:text-2xl font-bold text-[#222222] cursor-pointer" 
                onClick={() => { 
                  setCurrentView('catalog'); 
                  setCurrentPage(1); 
                }}
              >
                <span className="text-[#ff385c]">SECOND</span>Store.
              </h1>
            </div>

            {/* Search Bar - Full Width on Mobile */}
            {currentView === 'catalog' && (
              <div className="w-full md:flex-1 md:max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-4 py-2 sm:py-2.5 rounded-full border border-[#dddddd] focus:outline-none focus:border-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/20 transition text-[#222222] placeholder-[#6a6a6a] text-sm sm:text-base"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setCurrentPage(1);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Nav Actions - Touch-Friendly */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => toggleWishlist(selectedProduct?.id)}
                className="relative p-2 sm:p-2.5 text-[#222222] hover:text-[#ff385c] transition text-lg sm:text-xl h-10 w-10 flex items-center justify-center"
                title="Wishlist"
              >
                ♥
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ff385c] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCurrentView(currentView === 'cart' ? 'catalog' : 'cart')}
                className="relative p-2 sm:p-2.5 text-[#222222] hover:text-[#ff385c] transition text-lg sm:text-xl h-10 w-10 flex items-center justify-center"
                title="Keranjang"
              >
                🛒
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ff385c] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== CATALOG VIEW ===== */}
      {currentView === 'catalog' && (
        <main className="w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-6 sm:mb-8 text-center">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#222222] mb-2">
                  Koleksi Produk Premium
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-[#6a6a6a] px-2">
                  Belanja dari ribuan produk berkualitas tinggi dengan harga terjangkau
                </p>
              </div>

              {/* Filters Row - Responsive */}
              <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
                {/* Category Tabs - Scrollable on Mobile */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 snap-x whitespace-nowrap -mx-4 px-4 sm:mx-0 sm:px-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentPage(1);
                      }}
                      className={`px-3 sm:px-4 py-2 rounded-full font-medium text-sm sm:text-base transition flex-shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-[#ff385c] text-white'
                          : 'bg-gray-100 text-[#222222] border border-[#dddddd] hover:border-[#ff385c]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Sort Select */}
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-[#dddddd] bg-white text-[#222222] focus:outline-none focus:border-[#ff385c] transition text-sm sm:text-base"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Harga Terendah</option>
                  <option value="price-high">Harga Tertinggi</option>
                  <option value="rating">Rating Tertinggi</option>
                  <option value="popular">Paling Populer</option>
                </select>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-16 sm:py-20">
                  <div className="w-12 h-12 border-4 border-[#dddddd] border-t-[#ff385c] rounded-full animate-spin"></div>
                  <p className="mt-4 text-[#6a6a6a] font-medium text-sm sm:text-base">Memuat produk...</p>
                </div>
              )}

              {/* Error State */}
              {error && !loading && (
                <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-6 text-center">
                  <div className="text-3xl sm:text-4xl mb-2">⚠️</div>
                  <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-2">Ada yang salah</h3>
                  <p className="text-sm sm:text-base text-red-700 mb-4">{error}</p>
                  <button
                    onClick={initData}
                    className="bg-[#ff385c] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium hover:bg-[#e00b41] transition text-sm sm:text-base"
                  >
                    🔄 Coba Lagi
                  </button>
                </div>
              )}

              {/* Products Grid - Mobile-Safe */}
              {!loading && !error && (
                <>
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-16 sm:py-20">
                      <p className="text-[#6a6a6a] text-sm sm:text-lg">
                        Tidak ada produk yang sesuai dengan pencarian Anda 😢
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                        {displayedProducts.map((product) => (
                          <div
                            key={product.id}
                            className="w-full bg-white border border-[#dddddd] rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer group"
                          >
                            {/* Product Image */}
                            <div className="relative w-full bg-gray-50 h-48 flex items-center justify-center overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-contain group-hover:scale-110 transition duration-300"
                              />
                              <button
                                onClick={() => toggleWishlist(product.id)}
                                className="absolute top-2 sm:top-3 right-2 sm:right-3 w-10 h-10 sm:w-10 sm:h-10 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center text-lg sm:text-lg transition"
                              >
                                {wishlist.includes(product.id) ? '❤️' : '🤍'}
                              </button>
                            </div>

                            {/* Product Info */}
                            <div className="p-3 sm:p-4">
                              <p className="text-xs font-semibold text-[#ff385c] uppercase tracking-wide mb-1 sm:mb-2">
                                {product.category}
                              </p>
                              <h3 className="text-xs sm:text-sm font-semibold text-[#222222] line-clamp-2 mb-2 h-8 sm:h-10">
                                {product.title}
                              </h3>

                              {/* Rating */}
                              <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                                <div className="flex text-xs sm:text-sm gap-0.5">
                                  {renderStars(product.rating.rate)}
                                </div>
                                <span className="text-xs text-[#6a6a6a]">
                                  {product.rating.rate.toFixed(1)} ({product.rating.count})
                                </span>
                              </div>

                              {/* Price & CTA */}
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-base sm:text-lg font-bold text-[#ff385c]">
                                  ${product.price.toFixed(2)}
                                </span>
                                <button
                                  onClick={() => setSelectedProduct(product)}
                                  className="bg-[#ff385c] text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium hover:bg-[#e00b41] transition"
                                >
                                  Detail
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Pagination - Touch-Friendly */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-6 sm:mb-8 flex-wrap">
                          <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-2 sm:px-3 py-2 h-10 rounded-lg border border-[#dddddd] text-[#222222] hover:border-[#ff385c] disabled:opacity-50 transition text-xs sm:text-sm font-medium"
                          >
                            ← Sebelumnya
                          </button>

                          <div className="flex gap-0.5 sm:gap-1">
                            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                              const pageNum = i + 1;
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition text-sm ${
                                    currentPage === pageNum
                                      ? 'bg-[#ff385c] text-white'
                                      : 'border border-[#dddddd] text-[#222222] hover:border-[#ff385c]'
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            })}
                            {totalPages > 5 && (
                              <span className="px-2 py-2 text-sm text-[#6a6a6a]">...</span>
                            )}
                          </div>

                          <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-2 sm:px-3 py-2 h-10 rounded-lg border border-[#dddddd] text-[#222222] hover:border-[#ff385c] disabled:opacity-50 transition text-xs sm:text-sm font-medium"
                          >
                            Selanjutnya →
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      )}

      {/* ===== CART VIEW - MOBILE RESPONSIVE ===== */}
      {currentView === 'cart' && (
        <main className="w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-4xl font-bold text-[#222222]">Keranjang Belanja</h2>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16 sm:py-20">
                  <p className="text-[#6a6a6a] text-base sm:text-lg mb-4">Keranjang Anda kosong</p>
                  <button
                    onClick={() => setCurrentView('catalog')}
                    className="bg-[#ff385c] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium hover:bg-[#e00b41] transition text-sm sm:text-base"
                  >
                    Lanjut Belanja
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {/* Cart Items List - Vertical Cards on Mobile */}
                  <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="w-full bg-white border border-[#dddddd] rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4"
                      >
                        {/* Image */}
                        <div className="w-full sm:w-24 h-32 sm:h-24 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-20 sm:h-20 object-contain"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h3 className="text-sm sm:text-base font-semibold text-[#222222] line-clamp-2 mb-1">
                              {item.title}
                            </h3>
                            <p className="text-xs text-[#6a6a6a] mb-2">{item.category}</p>
                          </div>
                          <div className="text-base sm:text-lg font-bold text-[#ff385c]">
                            ${item.price.toFixed(2)}
                          </div>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="flex sm:flex-col items-center justify-between sm:justify-end gap-2 sm:gap-3">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-600 transition text-lg h-8 w-8 flex items-center justify-center"
                          >
                            ✕
                          </button>

                          <div className="flex items-center gap-1 border border-[#dddddd] rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 text-[#222222] hover:text-[#ff385c] transition text-sm"
                            >
                              −
                            </button>
                            <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold text-[#222222]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-[#222222] hover:text-[#ff385c] transition text-sm"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-sm sm:text-base font-semibold text-[#222222]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary - Responsive */}
                  <div className="h-fit">
                    <div className="w-full bg-white border border-[#dddddd] rounded-xl p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-bold text-[#222222] mb-4">Ringkasan Pesanan</h3>

                      <div className="space-y-2 sm:space-y-3 mb-4 pb-4 border-b border-[#dddddd]">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-[#6a6a6a]">Subtotal ({cartItemsCount} item)</span>
                          <span className="font-semibold text-[#222222]">${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-[#6a6a6a]">Ongkos Kirim</span>
                          <span className="font-semibold text-[#222222]">Gratis</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-[#6a6a6a]">Pajak</span>
                          <span className="font-semibold text-[#222222]">-</span>
                        </div>
                      </div>

                      <div className="flex justify-between text-base sm:text-lg font-bold mb-4 sm:mb-6">
                        <span>Total</span>
                        <span className="text-[#ff385c]">${cartTotal.toFixed(2)}</span>
                      </div>

                      <button className="w-full bg-[#ff385c] text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-[#e00b41] transition mb-2 sm:mb-3 text-sm sm:text-base">
                        Proses Pembayaran
                      </button>

                      <button
                        onClick={() => setCurrentView('catalog')}
                        className="w-full border border-[#dddddd] text-[#222222] py-2.5 sm:py-3 rounded-lg font-semibold hover:border-[#ff385c] transition text-sm sm:text-base"
                      >
                        Lanjut Belanja
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* ===== MODAL OVERLAY - RESPONSIVE ===== */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="w-full max-w-2xl bg-white rounded-2xl p-4 sm:p-6 md:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
            >
              ✕
            </button>

            {/* Modal Grid - Responsive 1 to 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2 sm:pt-4">
              {/* Left: Product Image */}
              <div className="flex items-center justify-center bg-gray-50 rounded-xl p-4 sm:p-6">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="max-h-64 sm:max-h-80 object-contain"
                />
              </div>

              {/* Right: Product Info */}
              <div className="flex flex-col gap-3 sm:gap-4">
                {/* Category */}
                <p className="text-xs font-semibold text-[#ff385c] uppercase tracking-wide">
                  {selectedProduct.category}
                </p>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#222222]">
                  {selectedProduct.title}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex gap-0.5 text-base sm:text-lg">
                    {renderStars(selectedProduct.rating.rate)}
                  </div>
                  <span className="text-xs sm:text-sm text-[#6a6a6a]">
                    {selectedProduct.rating.rate.toFixed(1)} dari 5 ({selectedProduct.rating.count} ulasan)
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t border-[#dddddd] my-1 sm:my-2"></div>

                {/* Description */}
                <p className="text-[#6a6a6a] leading-relaxed text-xs sm:text-sm md:text-base line-clamp-3">
                  {selectedProduct.description}
                </p>

                {/* Price */}
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#ff385c]">
                  ${selectedProduct.price.toFixed(2)}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className={`px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm sm:text-base ${
                      wishlist.includes(selectedProduct.id)
                        ? 'bg-[#ff385c] text-white'
                        : 'bg-gray-100 text-[#222222] border border-[#dddddd] hover:border-[#ff385c]'
                    }`}
                  >
                    {wishlist.includes(selectedProduct.id) ? '❤️' : '🤍'} Wishlist
                  </button>
                  <button
                    onClick={() => addToCart(selectedProduct)}
                    className="bg-[#ff385c] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg font-medium hover:bg-[#e00b41] transition flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    🛒 Tambah ke Keranjang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== TOAST NOTIFICATION ===== */}
      {toast && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-[#ff385c] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg z-40 animate-pulse text-sm sm:text-base">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;