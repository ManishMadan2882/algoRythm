const path = require('path');
const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use('/api/v1/compile', require('./routes/compileRoute'));
app.get('/status',(req,res)=>{
    res.json({msg:"working fine"})
})


/* app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});
 */
app.listen(port, () => {
  console.log('Server running at port '+port);
});