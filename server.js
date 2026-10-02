const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/products', productRoutes);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
}

module.exports = app;