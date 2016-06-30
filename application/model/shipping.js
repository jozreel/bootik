var simple = require('simple');
var shipping= new simple.simplemodel();
shipping.modelname = 'shipping';

shipping.adddestinationcountry = function(obj, callback)
{
	console.log(obj.event,obj._id);
	delete this._id;
	this.destinationcountry = obj.destinationcountry;
	
	this.shippingarea = obj.shippingarea;
	this.singledest = obj.singledest;
	this.countryrate = obj.countryrate;
	if(obj.event === "A")
	{
		
	    this.destinations=[];
	}
	if(obj.event === "E")
	{
		
		this._id = this.createObjectId(obj._id);
	}
	//var temp = this.prepare();
	
	this.save(callback,obj.event);
}

shipping.addDestination = function(obj, callback)
{
	
	//modify to allow multiple shipping providers
	var shp ={};
	shp.destinationname = obj.destinationname;
	if(obj.destinationtax !== undefined)
	   shp.destinationtax = obj.destinationtax;
	 shp.shippingrate = obj.destinationrate;
	 shp.zippost = obj.zippost;
	 shp.estimateddelivery = obj.estimateddelivery;
	var temp=[];
    if(obj.event === 'A')
	{
	 this.insertcounters('destinationid');
     var shiper = this;
	 
	 this.generateNextSequence('destinationid', function(next){
	  shp.destinationid=next.toString();
	  temp.push(shp);
	  
	 shiper.pushtoarray({'destinationcountry.code':obj.countrycode}, temp,'destinations',callback);
	 });
	}
	else
	{    shp.destinationid = obj.destinationid;
		
		var objid = this.createObjectId(obj._id);
		
	    this.updateinarray({_id:objid, "destinations.destinationid":obj.destinationid},{ "destinations.$" : shp} , callback)
	}
	 
}
shipping.finddestinationbycountry = function(cid, callback)
{

	
 this.find({"destinationcountry.code":cid},{destinations:true},{},true,function(doc)
  {
     
     var decd =  shipping.decodeallValues(doc);
     
      callback(decd);
      
  });

}
shipping.removeDestination = function(id,did, callback)
{
	console.log(id,did);
	var objid = this.createObjectId(id);
	this.removefromarray({_id:objid}, {destinations:{destinationid:did}},false,callback);
}
module.exports = shipping;