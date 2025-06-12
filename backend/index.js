const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/item');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use('/api', authRoutes);
app.use('/api', itemRoutes);
app.use('/api', cartRoutes);
app.use('/api', orderRoutes);

app.get('/', (req, res) => {
  res.send('Hello world!');
});

/*production environment
if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    });
}
*/

//MongoDB connection
const PORT = process.env.PORT || 5011;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    })
  )
  .catch(err => console.log(err));