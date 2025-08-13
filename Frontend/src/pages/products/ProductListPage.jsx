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
      setTotalBill(0)
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
    <div className="relative p-6 bg-gray-50">
      {showSaleModal && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">
              Sale Record
            </h2>

            {/* Customer Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-6">No items in cart</p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <span className="font-medium text-gray-700">
                      {item.productname}
                    </span>
                    <span className="text-sm text-gray-500">
                      Qty: {item.quantity} | Price: ₨ {item.price} |
                      <span className="font-semibold text-gray-800 ml-1">
                        Total: ₨ {item.price * item.quantity}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-center pt-4">
              Total bill : &nbsp; <span className="font-bold text-red-700">{TotalBill}</span>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowSaleModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmSale}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Confirm Sale
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
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

      <input
        type="text"
        placeholder="Search product..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
      />

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Item Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Category
              </th>
              <th className="flex gap-1 items-center px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Purchase Price <Eye className="text-purple-600" onClick={() => setprprice(!prprice)} size={20} />
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Selling Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Unit
              </th>
              {isSale &&
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Sale
                </th>
              }
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Created At
              </th>
              {!isSale &&
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700"></th>
              }
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProduct.length > 0 ? (
              filteredProduct.map((p) => (
                <tr className="hover:bg-gray-100" key={p._id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {p.itemname}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {p.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {prprice ? ((p.purchasePrice) + " PKR") : "⬤⬤⬤"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {p.sellingPrice} PKR
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {p.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.unit}</td>
                  {isSale &&
                    <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-1">
                      <input
                        type="number"
                        name="quantity"
                        min="1"
                        value={saleQuantities[p._id] || ""}
                        onChange={(e) =>
                          handleSaleChange(p, e.target.value)
                        }
                        className="w-15 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <ShoppingCart
                        onClick={() => handleSale(p)}
                        className="text-purple-600 cursor-pointer"
                        size={18}
                      />
                    </td>
                  }
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  {!isSale &&
                    <td className="py-2 flex justify-center items-center gap-2">
                      <span
                        onClick={() => handleEdit(p)}
                        className="p-2 text-blue-500 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition cursor-pointer"
                      >
                        <Edit2 size={18} />
                      </span>
                      <span
                        onClick={() => handleDelete(p)}
                        className="p-2 text-red-500 rounded-lg hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </span>
                    </td>
                  }
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="px-6 py-4 text-center text-gray-500"
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