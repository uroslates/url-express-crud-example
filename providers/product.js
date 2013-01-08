
var AbstractResourceProvider = require('url-express-crud').AbstractResourceProvider;

var Product = function(o) {
	this.id = this._id = o._id || 0;
	this.name = o.name || '';
	this.description = o.description;
	this.img = o.img || '';
	this.slug = o.slug || '';
	this.createdOn = o.createdOn || new Date();

	this.isNew =function(){
		return this._id > 0;
	}();
};

// ProductInMemoryProvider class, implementation of <AbstractResourceProvider> interface for in memory storage.

// Its used to create provide consistent API so that this could be pluggable into url-express-crud library.

// @author <a href="http://uroslates.com/contact/">Uroš Lates</a>
var ProductInMemoryProvider = function(config) {
	var p1 = {
			_id: '1'
			, name: 'Product 1'
			, description: 'Product 1 lorem ipsum dolet sum...'
			, img: 'http://flickholdr.com/300/300/forest'
			, slug: 'product-1'
			, createdOn: new Date()
		}
		, p2 = {
			_id: '2'
			, name: 'Product 2'
			, description: 'Product 2 lorem ipsum dolet sum...'
			, img: 'http://flickholdr.com/300/300/sea'
			, slug: 'product-2'
			, createdOn: new Date()
		}
		, p3 = {
			_id: '3'
			, name: 'Product 3'
			, description: 'Product 3 lorem ipsum dolet sum...'
			, img: 'http://flickholdr.com/300/300/nature'
			, slug: 'product-3'
			, createdOn: new Date()
		};

	this.products = [new Product(p1), new Product(p2), new Product(p3)];
};

// Extends AbstractResrouceController class (conforms to its API)
ProductInMemoryProvider.prototype = AbstractResourceProvider;

// <AbstractResourceController> interface implementation
ProductInMemoryProvider.prototype = {

	_get: function(conditions) {
		var products = []
			, ckeys = Object.keys(conditions)
			, ckeysTotal = ckeys.length
			, matchProduct = function(prod, iteration) {
				return function(key) {
					var condition = (ckeysTotal === ++iteration) && (conditions[key] === prod[key]);

					if (condition) {
						products.push(new Product(prod));
					}
				};
			};

		if (Object.keys(conditions).length) {
			for (var i = 0, iteration, total = this.products.length; i < total; i++) {
				iteration = 0;
				// match conditions with properties of product object
				ckeys.forEach(matchProduct(this.products[i], iteration));
			}
		}

		return products;
	}

	// Retrieves all the records that conform to the provided query.
	// @param conditions - JSON object of property/value pairs to match (e.g. {slug: 'something'})
	, find: function(conditions, callback) {
		var products = Object.keys(conditions).length ? this._get(conditions) : this.products;
		return callback.call(null, null, products);
	}

	, findOne: function(conditions, callback) {
		var products = this._get(conditions)
			, product = products.length ? products[0] : null;
		return callback.call(null, null, product);
	}

	// Saves an instance.
	, save: function(resourceJson, fn) {
		var product = new Product(resourceJson);
		this.products.push(product);
		return fn.call(null, null, product);
	}

	// Saves an instance.
	, update: function(resourceJson, newResource, fn) {
		var product = this._get({_id: resourceJson._id})[0];

		for (var i = 0, total = this.products.length; i < total; i++) {
			if (this.products[i]._id === product._id) {

				// TODO: merge newResoruce with this.products[i]
				this.products[i] = newResource;
			}
		}

		return fn.call(null, null, product);
	}

	// Delete the instance from the configured store
	, delete: function(conditions, callback) {
		var products = this._get(conditions);

		if (products.length == 1) {
			for (var i = 0, total = this.products.length; i < total; i++) {
				if (this.products[i]._id === products[0]._id) {
					this.products.splice(i, 1);
					break;
				}
			}
		}

		return callback.call(null, null, products[0]);
	}

};


exports = module.exports = ProductInMemoryProvider;