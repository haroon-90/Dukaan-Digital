import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getProducts, deleteProducts } from "../../Services/productServices.js";
import { createsale } from "../../Services/saleServices.js";
import { Edit2, Trash2, PackagePlus, ShoppingCart, Eye } from "lucide-react";

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

  const filteredProduct = products.filter((item) =>
    item.itemname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaleChange = (p, value) => {
    if (p.quantity < value) {
      alert("Stock shotage")
    } else {
      setSaleQuantities((prev) => ({
        ...prev,
        [p._id]: value
      }));
    }
  };

  const handleSale = (product) => {
    const quantity = Number(saleQuantities[product._id] || 0);
    if (quantity <= 0) {
      alert("Please enter quantity");
      return;
    }

    const cartItem = {
      id: product._id,
      productname: product.itemname,
      price: product.sellingPrice,
      quantity: quantity
    };

    setTotalBill(TotalBill + (product.sellingPrice * quantity))

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
  };

  const ShowCart = () => {
    setShowSaleModal(true);
  };

  const confirmSale = async () => {
    if (!customerName.trim()) {
      alert("Please enter customer name");
      return;
    }

    const payload = {
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      type: "sale",
      customerName: customerName.trim()
    };

    try {
      const res = await createsale(payload);
      console.log("Sale Created:", res.data);
      setCart([]);
      setSaleQuantities({});
      setCustomerName("");
      setShowSaleModal(false);
      setTotalBill(0);
      loadProducts();
    } catch (err) {
      console.error("Error creating sale:", err);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleEdit = (e) => {
    navigate("/products/edit/" + e._id);
  };

  const handleDelete = async (e) => {
    try {
      if (
        confirm(
          `Are you really want to delete "${e.itemname}" from product list?`
        )
      ) {
        await deleteProducts(e._id);
        loadProducts();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (location.pathname === '/products') {
      setisSale(false);
    } else if (location.pathname === '/sales/new') {
      setisSale(true);
    }
    loadProducts();
  }, []);

  return (
  <div className="relative p-6 bg-purple-50 min-h-screen">
    {showSaleModal && (
      <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm">
        <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg border-t-4 border-purple-600">
          <h2 className="text-xl font-bold text-purple-700 border-b pb-3 mb-4">
            Sale Record
          </h2>

          {/* Customer Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-6">No items in cart</p>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b border-purple-100 pb-2"
                >
                  <span className="font-medium text-purple-800">
                    {item.productname}
                  </span>
                  <span className="text-sm text-purple-600">
                    Qty: {item.quantity} | Price: ₨ {item.price} |
                    <span className="font-semibold text-purple-800 ml-1">
                      Total: ₨ {item.price * item.quantity}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center pt-4">
            Total bill: &nbsp; 
            <span className="font-bold text-red-600">{TotalBill}</span>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowSaleModal(false)}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={confirmSale}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Confirm Sale
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Header Buttons */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-purple-800">Products</h1>
      <div className="flex gap-2">
        {cart.length > 0 && (
          <button
            onClick={ShowCart}
            className="bg-purple-600 flex gap-2 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            <ShoppingCart size={23} />
            Sale
          </button>
        )}
        <button
          onClick={() => navigate("/products/new")}
          className="bg-purple-600 flex gap-2 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          <PackagePlus size={23} />
          Add Product
        </button>
      </div>
    </div>

    {/* Search */}
    <input
      type="text"
      placeholder="Search product..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full mb-4 px-3 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
    />

    {/* Table */}
    <div className="bg-white rounded-lg shadow overflow-x-auto border border-purple-100">
      <table className="min-w-full divide-y divide-purple-200">
        <thead className="bg-purple-600">
          <tr>
            {[
              "Item Name",
              "Category",
              "Purchase Price",
              "Selling Price",
              "Quantity",
              "Unit",
              ...(isSale ? ["Sale"] : []),
              "Created At",
              ...(isSale ? [] : ["Actions"]),
            ].map((header, i) => (
              <th
                key={i}
                className="px-6 py-3 text-left text-sm font-semibold text-white"
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
        <tbody className="divide-y divide-purple-100">
          {filteredProduct.length > 0 ? (
            filteredProduct.map((p) => (
              <tr
                key={p._id}
                className="hover:bg-purple-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm">
                  {p.itemname}
                </td>
                <td className="px-6 py-4 text-sm">
                  {p.category}
                </td>
                <td className="px-6 py-4 text-sm">
                  {prprice ? `${p.purchasePrice} PKR` : "⬤⬤⬤"}
                </td>
                <td className="px-6 py-4 text-sm">
                  {p.sellingPrice} PKR
                </td>
                <td className="px-6 py-4 text-sm">
                  {p.quantity}
                </td>
                <td className="px-6 py-4 text-sm">{p.unit}</td>

                {isSale && (
                  <td className="px-6 py-4 text-sm flex items-center gap-1">
                    <input
                      type="number"
                      min="1"
                      value={saleQuantities[p._id] || ""}
                      onChange={(e) => handleSaleChange(p, e.target.value)}
                      className="w-16 px-2 py-1 border border-purple-300 rounded focus:ring-2 focus:ring-purple-400 outline-none"
                    />
                    <ShoppingCart
                      onClick={() => handleSale(p)}
                      className="text-purple-600 cursor-pointer"
                      size={18}
                    />
                  </td>
                )}

                <td className="px-6 py-4 text-sm">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>

                {!isSale && (
                  <td className="py-2 flex justify-center items-center gap-2">
                    <span
                      onClick={() => handleEdit(p)}
                      className="p-2 text-purple-600 rounded-lg hover:bg-purple-100 transition cursor-pointer"
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
                className="px-6 py-4 text-center text-purple-500"
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