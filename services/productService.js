const db = require('../database/db');

const getAllProducts = async () => {
  return await db.readProducts();
};

const getProductById = async (id) => {
  const products = await db.readProducts();
  return products.find(p => p.id == id) || null;
};

const createProduct = async (productData) => {
  const products = await db.readProducts();
  const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
  const newProduct = {
    id: productData.id || maxId + 1,
    ...productData
  };
  products.push(newProduct);
  await db.writeProducts(products);
  return newProduct;
};

const updateProduct = async (id, productData) => {
  const products = await db.readProducts();
  const index = products.findIndex(p => p.id == id);
  if (index === -1) return null;

  const updatedProduct = {
    ...productData,
    id: products[index].id
  };
  products[index] = updatedProduct;
  await db.writeProducts(products);
  return updatedProduct;
};

const patchProduct = async (id, productData) => {
  const products = await db.readProducts();
  const index = products.findIndex(p => p.id == id);
  if (index === -1) return null;

  const updatedProduct = {
    ...products[index],
    ...productData,
    id: products[index].id
  };
  products[index] = updatedProduct;
  await db.writeProducts(products);
  return updatedProduct;
};

const deleteProduct = async (id) => {
  const products = await db.readProducts();
  const index = products.findIndex(p => p.id == id);
  if (index === -1) return null;

  const deletedProduct = products[index];
  products.splice(index, 1);
  await db.writeProducts(products);
  return deletedProduct;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct
};
