import { useState, useEffect } from 'react'
import { getProductById, updateProduct } from '../../services/productServices.js'
import { useParams, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    itemname: '',
    category: '',
    purchasePrice: '',
    sellingPrice: '',
    quantity: '',
    unit: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.data);
      } catch (err) {
        toast.error("Failed to edit product")
        navigate('/products')
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(id, product);
      toast.success("Product updated successfully");
      setTimeout(() => {
        navigate('/products');
      }, 500);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to add product!")
    }
  };

  return (
    <div className="flex items-center justify-center p-6 bg-white">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mb-6 tracking-tight">
          Edit Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-800 font-semibold mb-1">Item Name</label>
            <input
              name="itemname"
              onChange={handleChange}
              value={product.itemname}
              type="text"
              placeholder="Enter item name"
              required
              className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-gray-800 font-semibold mb-1">Category</label>
            <input
              name="category"
              onChange={handleChange}
              value={product.category}
              type="text"
              placeholder="Enter category"
              required
              className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-800 font-semibold mb-1">Purchase Price</label>
              <input
                name="purchasePrice"
                onChange={handleChange}
                value={product.purchasePrice}
                type="number"
                placeholder="0.00"
                required
                className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-1">Selling Price</label>
              <input
                name="sellingPrice"
                onChange={handleChange}
                value={product.sellingPrice}
                type="number"
                placeholder="0.00"
                required
                className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-800 font-semibold mb-1">Quantity</label>
              <input
                name="quantity"
                onChange={handleChange}
                value={product.quantity}
                type="number"
                placeholder="Enter quantity"
                required
                className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-gray-800 font-semibold mb-1">Unit</label>
              <input
                name="unit"
                onChange={handleChange}
                value={product.unit}
                type="text"
                placeholder="e.g. kg, pcs"
                required
                className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mx-auto block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductFormPage;
