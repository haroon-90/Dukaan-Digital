import React, { useState, useEffect } from 'react'
import { addProduct, getProductById, updateProduct } from '../../Services/productServices.js'
import { useParams, useNavigate } from "react-router-dom";

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
  const [error, setError] = useState('');
  const [success, setsuccess] = useState('');

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const res = await getProductById(id);
          setProduct(res.data);
        } catch (err) {
          setError("Error fetching product");
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateProduct(id, product);
        setsuccess("Product updated successfully");
      } else {
        await addProduct(product);
        setsuccess("Product added successfully");
        setProduct({
          itemname: '',
          category: '',
          purchasePrice: '',
          sellingPrice: '',
          quantity: '',
          unit: ''
        });
      }
      setTimeout(() => {
        setsuccess("");
        navigate('/products');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error saving product');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-6 tracking-tight">
          {id ? "Edit Product" : "Add New Product"}
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-sm text-green-700 bg-green-100 p-3 rounded-lg border border-green-200">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-800 font-semibold mb-1">Item Name</label>
            <input
              name="itemname"
              onChange={handleChange}
              value={product.itemname}
              type="text"
              placeholder="Enter item name"
              className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
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
              className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
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
                className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
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
                className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
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
                className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
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
                className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mx-auto block w-full bg-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-purple-700 hover:shadow-xl transition-all duration-200"
          >
            {id ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductFormPage;
