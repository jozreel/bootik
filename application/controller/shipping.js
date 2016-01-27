var simple = require('simple');
var shipping = new simple.simplecontroler();

shipping.adddestinationcountry = function(callback)
{
	var shp =this;
	var mod = this.loadmodel('shipping');
	if(this.req.postdata === 'A')
	{
	delete mod._id;
	mod.find({"destinationcountry.code":this.req.postdata.destinationcountry.code},{},{},true,function(doc){
		if(Object.keys(doc).length === 0)
		{
			mod.adddestinationcountry(shp.req.postdata,function(doc)
			{
				
				shipping.jsonResp(doc);
			});
		}
		else{
			shipping.jsonResp({success:false, error:"DUPLICATE", message:'Country already exist'});
		}
		
	});
	}
	else{
		mod.adddestinationcountry(shp.req.postdata,function(doc)
			{
				
				shipping.jsonResp(doc);
			});
	}
}
shipping.zones = function()
{
	this.viewholder.title="Zones";
	this.loadview('shippingzones');
	
}
shipping.savezone = function()
{
	var shp = this;
	var mod = this.loadmodel('zone');
	var regex = new RegExp(this.req.postdata.zonename,'i');
	
	if(this.req.postdata.event ==="A")
	{
	mod.find({zonename:{$regex:regex}},{zonename:true},{},false,function(doc)
	{
		if(Object.keys(doc).length === 0) 
		{
		 delete mod._id;
		  mod.addzone(shp.req.postdata, function(doc)
	      {
		   
		   shipping.jsonResp(doc);
	      });
		}
		else
		{
		   shipping.jsonResp({success:false,error:'DUPLICATE', message:"A region with this name already exist"});
		}
		
	});
	}else
	{
		mod.addzone(shp.req.postdata, function(doc)
	      {
		   
		   shipping.jsonResp(doc);
	      });
	}
	
	
}
shipping.findzones =function()
{
	var mod = this.loadmodel('zone');
	mod.findall(function(doc)
	{ 
		
		shipping.jsonResp(doc);
		
	},true);
}
shipping.country	 = function()
{
	this.loadview('shippingcountry');
	
}
shipping.findcountries = function()
{
	var mod = this.loadmodel('shipping');
	mod.findall(function(doc)
	{
		shipping.jsonResp(doc);
	},true);
}
shipping.addddestination=function()
{
   var mod = this.loadmodel('shipping');
   mod.addDestination(this.req.postdata, function(doc)
   {
	  shipping.jsonResp(doc); 
   });
}
shipping.destinations = function()
{
	this.title="Shipping Destinations"
	this.loadview('destinations');
}
module.exports = shipping;