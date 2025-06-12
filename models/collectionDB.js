const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
name: {
    type: String,
    required: true,
 
},
image: {
    data: Buffer,
    contentType: String,
},
products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;
