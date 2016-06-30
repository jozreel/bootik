var simple = require('simple');
var rootcategory = new simple.simplemodel();
rootcategory.modelname = "rootcategory";

rootcategory.addrootcategory = function(obj,callback)
{   
	this.name = obj.name;
	this.description =obj.description;
	this.save(callback,'A');
}
rootcategory.editrootcategory = function(obj,callback)
{   this._id = obj._id;
	this.name = obj.name;
	this.description =obj.description;
	this.save(callback,'E');
}
rootcategory.getcategories =function(callback)
{
	this.findall(callback,true);
}
rootcategory.removerootcategory = function(arr,callback)
{
	for(var it in arr)
	{
	
	  var objid = this.createObjectId(arr[it]);
	  arr[it] = objid;
	}
	
	this.removegroup('_id',arr,callback);
}
module.exports = rootcategory;