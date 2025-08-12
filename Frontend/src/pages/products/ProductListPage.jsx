import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProducts } from "../../Services/productServices.js";
import { Edit2, Trash2, PackagePlus } from "lucide-react";

const ProductListPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      console.log(res.data);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleEdit = (e) => {
    navigate('/products/edit/' + e._id)
  }

  const handleDelete = async (e) => {
    try {
      if (confirm(`Are you really want to delete "${e.itemname}" from product list?`)) {
        const res = await deleteProducts(e._id)
        if (res.ok) {
          console.log(e.itemname, "deleted successfully")
        }
        loadProducts();
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="p-6  bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button
          onClick={() => navigate("/products/new")}
          className="bg-purple-600 flex gap-2 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          <PackagePlus size={23} />
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Item Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Purchase Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Selling Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Unit</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created At</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.length > 0 ? (
              products.map((p) => (
                <tr className="hover:bg-gray-100" key={p._id?.$oid || p._id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{p.itemname}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">₨ {p.purchasePrice}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">₨ {p.sellingPrice}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.unit}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(p.createdAt?.$date || p.createdAt).toLocaleDateString()}
                  </td>
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
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
