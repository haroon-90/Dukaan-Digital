import mongoose from "mongoose";

const shopschema = new mongoose.Schema({
    shopname: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    ownername: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Shop = mongoose.model("Shop", shopschema);

export default Shop;