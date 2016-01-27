var simple = require('simple');
var zone= new simple.simplemodel();
zone.modelname= 'zone';
zone.addzone = function(obj, callback)
{
	this.zonename = obj.zonename;
	this.zonedescription = obj.zonedescription;
	if(obj._id !== undefined)
	{
		
	  this._id = this.createObjectId(obj._id);
	}
	var tmp = this.prepare();
	console.log(obj,'store');
	this.insertOrUpdate(tmp,callback);
	 //this.updateOne({zonename: {$regex:regex}},tmp,callback,true);
}
zone.removezone= function(obj, callback)
{
  this._id = obj.id;
  console.log(obj);
  this.deleteone(callback);
}
module.exports=zone;