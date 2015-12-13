var simple = require('simple');
var store = new simple.simplecontroler();
store.index = function()
{
	this.loadview('setup')
}
module.exports = store;