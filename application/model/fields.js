var Simple = require('simple');
var fields= new Simple.simplemodel();
fields.modelname = 'fields';

fields.addoredit = function(obj, callback)
{
	var event = obj.event;
	delete obj.event;
    if(obj._id !==undefined)
       obj._id = this.createObjectId(obj._id);
	this.insertOrUpdate(obj ,callback);
}
module.exports = fields;
