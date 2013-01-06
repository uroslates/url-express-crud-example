var mongoose = require('mongoose')
	, Schema = mongoose.Schema

	// ProductSchema definition
	, ProductSchema = new Schema({
		name: { type: String, index: true, required: true, default: '' }
		, description: { type: String, default: '' }
		, img: { type: String, default: '' }
		, slug: { type: String, index: true, unique: true, required: true, default: '' }
		, createdOn: { type: Date }
		, updatedOn: { type: Date, default: Date.now }
	});

mongoose.model('Product', ProductSchema);
var Product = mongoose.model('Product');

Product.on('error', function () {
	console.log('\n\nDATABASE ERROR <Mongoose.Model> | <Item>: \n', arguments, '\n\n');
});

exports = module.exports = Product;