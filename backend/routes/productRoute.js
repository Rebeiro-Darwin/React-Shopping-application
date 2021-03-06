import express from 'express';
import Product from '../models/productModel';
import { isAuth, isAdmin } from '../util';

const router = express.Router();

router.get('/', async (req, res) => {
  const products = await Product.find({});
  res.send(products);
});

router.get('/:id', async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ msg: "Product Not Found" });
  }
});

router.post('/', isAuth, isAdmin, async (req, res) => {
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    brand: req.body.brand,
    category: req.body.category,
    countInStock: req.body.countInStock,
    description: req.body.description,
  });
  const newProduct = await product.save();
  if (newProduct) {
    return res.status(201).send({ message: 'New Product Created', data: newProduct })
  }
  res.status(500).send({ message: 'Error in creating Product.' })
});

router.put('/:id', isAuth, isAdmin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = req.body.name;
    product.price = req.body.price;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.category = req.body.category;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    const updatedProduct = await product.save();
    if (updatedProduct) {
      return res.status(200).send({ message: 'Product Updated', data: updatedProduct })
    }
  }
  res.status(500).send({ message: 'Error in updating Product.' })
});

router.delete('/:id', isAuth, isAdmin, async (req, res) => {
  const deletedProduct = await Product.findById(req.params.id);
  if (deletedProduct) {
    await deletedProduct.remove();
    res.send({ message: 'Product Deleted' });
  } else {
    res.send({ message: 'Error in deletion.' });
  }
})

export default router;