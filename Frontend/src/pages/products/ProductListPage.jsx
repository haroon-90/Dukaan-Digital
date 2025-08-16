import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getProducts, deleteProducts } from "../../Services/productServices.js";
import { createsale } from "../../Services/saleService.js";
import { Edit2, Trash2, PackagePlus, ShoppingCart, Eye, PlusSquare } from "lucide-react";
import toast from "react-hot-toast";

const ProductListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [saleQuantities, setSaleQuantities] = useState({});
  const [cart, setCart] = useState([]);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [TotalBill, setTotalBill] = useState(0);
  const [prprice, setprprice] = useState(false);
  const [isSale, setisSale] = useState(false);
  const [isPurchase, setisPurchase] = useState(false);

  const filteredProduct = products.filter((item) =>
    item.itemname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaleChange = (p, value) => {
    if (isSale && p.quantity < value) {
      toast.error('Stock shortage');
    } else {
      setSaleQuantities((prev) => ({
        ...prev,
        [p._id]: value
      }));
    }
  };

  const handleCartAdd = (product) => {
    const quantity = Number(saleQuantities[product._id] || 0);
    if (quantity <= 0) {
      toast.error('Please enter quantity');
      return;
    }

    const cartItem = {
      id: product._id,
      productname: product.itemname,
      price: isPurchase ? product.purchasePrice : product.sellingPrice,
      quantity
    };

    setTotalBill(
      TotalBill + ((isPurchase ? product.purchasePrice : product.sellingPrice) * quantity)
    );

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, cartItem];
      }
    });

    setSaleQuantities((prev) => ({
      ...prev,
      [product._id]: ""
    }));
    toast.success("Added to cart");
  };

  const ShowCart = () => {
    setShowSaleModal(true);
  };

  const confirmSaleOrPurchase = async () => {
    if (!customerName.trim()) {
      // alert(`Please enter ${isPurchase ? "supplier" : "customer"} name`);
      toast.error(`Please enter ${isPurchase ? "supplier" : "customer"} name`);
      return;
    }

    const payload = {
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      type: isPurchase ? "purchase" : "sale",
      customerName: customerName.trim()
    };

    try {
      const res = await createsale(payload);
      console.log(`${isPurchase ? "Purchase" : "Sale"} Created:`, res.data);
      toast.success(`${isPurchase ? "Purchase" : "Sale"} Created`)
      setCart([]);
      setSaleQuantities({});
      setCustomerName("");
      setShowSaleModal(false);
      setTotalBill(0);
      loadProducts();
    } catch (err) {
      toast.error(`Failed to create ${isPurchase ? "Purchase" : "Sale"}`)
      console.error("Error creating record:", err);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
      toast.success("Products refreshed!")
    } catch (err) {
      toast.error("Failed to refresh products")
      console.error("Error fetching products:", err);
    }
  };

  const handleEdit = (e) => {
    navigate("/products/edit/" + e._id);
  };

  const handleDelete = async (e) => {
    try {
      if (confirm(`Are you sure you want to delete "${e.itemname}"?`)) {
        await deleteProducts(e._id);
        toast.success('Product deleted successfully!');
        loadProducts();
      }
    } catch (err) {
      toast.error("Failed to delete product!")
      console.log(err);
    }
  };

  useEffect(() => {
    if (location.pathname === "/products") {
      setisSale(false);
      setisPurchase(false);
    } else if (location.pathname === "/sales/new") {
      setisSale(true);
      setisPurchase(false);
    } else if (location.pathname === "/sales/purchase") {
      setisSale(false);
      setisPurchase(true);
    }
    loadProducts();
  }, []);

  return (
    <div className="relative p-6 bg-blue-50 min-h-screen">
      {showSaleModal && (
        <div className="absolute inset-0 flex items-start justify-center bg-black/60 z-50 backdrop-blur-sm p-4 print:p-0">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg font-mono text-gray-800 print:shadow-none print:border-0 print:rounded-none print:p-0">
            <div className="text-center pb-4 mb-4 border-b border-dashed border-gray-400 print:border-solid print:mb-2">
              <h2 className="text-2xl font-bold text-blue-700 tracking-wide">
                {JSON.parse(sessionStorage.getItem("user")).shopname}
              </h2>
              <p className="text-sm font-semibold text-gray-600 mt-1">
                {isPurchase ? "Purchase Receipt" : "Sales Invoice"}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Date: {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="mb-6 flex flex-col sm:flex-row items-baseline">
              <p className="text-sm font-semibold text-gray-700 mr-2">
                {isPurchase ? "Supplier:" : "Customer:"}
              </p>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder={`Enter ${isPurchase ? "supplier" : "customer"} name`}
                className="flex-1 px-3 py-1 border-b border-gray-300 bg-transparent outline-none text-sm focus:border-blue-500 transition"
              />
            </div>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No items added to the cart.</p>
            ) : (
              <div className="max-h-60 overflow-y-auto pr-2">
                <div className="flex justify-between font-bold text-sm border-b border-dashed border-gray-400 py-2 sticky top-0 bg-white print:border-solid">
                  <span className="flex-1">Item</span>
                  <span className="w-16 text-right">Qty</span>
                  <span className="w-20 text-right">Price</span>
                  <span className="w-20 text-right">Total</span>
                </div>
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm py-2 border-b border-dashed border-gray-200 print:border-solid">
                    <span className="flex-1 text-blue-800 font-medium truncate">
                      {item.productname}
                    </span>
                    <span className="w-16 text-right">{item.quantity}{item.unit}</span>
                    <span className="w-20 text-right">₨ {item.price.toLocaleString()}</span>
                    <span className="w-20 text-right font-semibold">
                      ₨ {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="border-t border-dashed border-gray-400 my-4 print:border-solid"></div>
            <div className="flex justify-between items-baseline font-bold text-xl pt-2">
              <span>TOTAL:</span>
              <span className="text-red-600">
                ₨ {TotalBill.toLocaleString()}
              </span>
            </div>
            <div className="text-center text-xs text-gray-500 mt-6 pt-4 border-t border-dashed border-gray-400 print:border-solid">
              <p>Thank you for your business!</p>
            </div>
            <div className="flex justify-end gap-3 mt-8 print:hidden">
              <button
                onClick={() => setShowSaleModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSaleOrPurchase}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Confirm {isPurchase ? "Purchase" : "Sale"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800">Products</h1>
        <div className="flex gap-2">
          {cart.length > 0 && (
            <button
              onClick={ShowCart}
              className="bg-blue-600 flex gap-2 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <ShoppingCart size={23} />
              {isPurchase ? "Purchase" : "Sale"}
            </button>
          )}
          {!isSale && <button
            onClick={() => navigate("/products/new")}
            className="bg-blue-600 flex gap-2 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <PackagePlus size={23} />
            Add Product
          </button>}
        </div>
      </div>

      <input
        type="text"
        placeholder="Search product..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="bg-white rounded-lg shadow overflow-x-auto border border-blue-100">
        <table className="min-w-full divide-y divide-blue-200">
          <thead className="bg-blue-600 sticky top-0">
            <tr>
              {[
                "Item Name",
                "Category",
                "Purchase Price",
                "Selling Price",
                "Quantity",
                "Unit",
                ...(isSale || isPurchase ? [isPurchase ? "Purchase" : "Sale"] : []),
                "Created At",
                ...(isSale || isPurchase ? [] : ["Actions"]),
              ].map((header, i) => (
                <th
                  key={i}
                  className="px-6 py-3 text-left text-sm font-semibold text-white uppercase"
                >
                  {header === "Purchase Price" ? (
                    <div className="flex gap-1 items-center">
                      {header}
                      <Eye
                        className="text-white cursor-pointer"
                        onClick={() => setprprice(!prprice)}
                        size={20}
                      />
                    </div>
                  ) : (
                    header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100">
            {filteredProduct.length > 0 ? (
              filteredProduct.map((p) => (
                <tr
                  key={p._id}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm">{p.itemname}</td>
                  <td className="px-6 py-4 text-sm">{p.category}</td>
                  <td className="px-6 py-4 text-sm font-bold text-green-500">
                    {prprice ? `${p.purchasePrice} PKR` : "•••"}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-green-500">
                    {p.sellingPrice} PKR
                  </td>
                  <td className="px-6 py-4 text-sm">{p.quantity}</td>
                  <td className="px-6 py-4 text-sm">{p.unit}</td>

                  {(isSale || isPurchase) && (
                    <td className="px-6 py-4 text-sm flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        value={saleQuantities[p._id] || ""}
                        onChange={(e) => handleSaleChange(p, e.target.value)}
                        className="w-16 px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-400 outline-none"
                      />
                      {
                        isPurchase ?
                          <PlusSquare
                            onClick={() => handleCartAdd(p)}
                            className="text-blue-600 cursor-pointer"
                            size={18}
                          /> :
                          <ShoppingCart
                            onClick={() => handleCartAdd(p)}
                            className="text-blue-600 cursor-pointer"
                            size={18}
                          />

                      }
                    </td>
                  )}

                  <td className="px-6 py-4 text-sm text-blue-700">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>

                  {!isSale && !isPurchase && (
                    <td className="py-2 flex justify-center items-center gap-2">
                      <span
                        onClick={() => handleEdit(p)}
                        className="p-2 text-blue-600 rounded-lg hover:bg-blue-100 transition cursor-pointer"
                      >
                        <Edit2 size={18} />
                      </span>
                      <span
                        onClick={() => handleDelete(p)}
                        className="p-2 text-red-500 rounded-lg hover:bg-red-100 transition cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </span>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="px-6 py-4 text-center text-blue-500"
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductListPage;
