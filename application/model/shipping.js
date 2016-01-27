var simple = require('simple');
var shipping= new simple.simplemodel();
shipping.modelname = 'shipping';

shipping.adddestinationcountry = function(obj, callback)
{
	
	this.destinationcountry = obj.destinationcountry;
	
	this.shippingarea = obj.shippingarea;
	
	if(obj.event === "A")
	{
		
	    this.destinations=[];
	}
	else
	{
		this._id = this.createObjectId(obj._id);
	}
	var temp = this.prepare();
	
	this.insertOrUpdate(temp, callback);
}

shipping.addDestination = function(obj, callback)
{
	var shp ={};
	shp.destinationname = obj.destinationname;
	if(obj.destinationtax !== undefined)
	   shp.destinationtax = obj.destinationtax;
	 shp.shippingrate = obj.shippingrate;
	 shp.estimateddelivery = obj.estimateddelivery;
	var temp=[];
    if(obj.event === 'A')
	{
	 this.insertcounters('regionid');
     var shiper = this;
	 
	 this.generateNextSequence('regionid', function(next){
	  shp.regionid=next;
	  temp.push(shp);
	 shiper.pushtoarray({'detinationcoyntry.code':obj.countrycode}, temp,'destinations',callback);
	 });
	}
	 
}

module.exports = shipping;