var simple = require('simple');
var taxes = new simple.simplecontroler();
taxes.save = function()
{
	var mod = this.loadmodel('tax');
	
	mod.savetax(this.req.postdata,function(doc)
	{
		
		taxes.jsonResp(doc);
	});
	
}
taxes.remove = function()
{
	 
	var mod = this.loadmodel('tax');
	mod.deletecountry(this.req.postdata._id, function(doc){
	this.jsonResp(doc);	
	});
}
taxes.index = function()
{
	
	this.loadview('taxes');
}
taxes.getall = function()
{
	var mod = this.loadmodel('tax');
	mod.gettaxes(function(doc)
	{
		taxes.jsonResp(doc);
	});
}
taxes.taxdef = function()
{
	this.loadview('taxdef');
}
taxes.addglobal = function()
{
	var mod = this.loadmodel('taxdef');
	mod.global(this.req.postdata, function(doc)
	{
		taxes.jsonResp(doc);
	});
}
taxes.getdefinitions = function()
{
	var mod = this.loadmodel('taxdef');
	mod.findall(function(doc)
	{
		taxes.jsonResp(doc);
	},true);
}
taxes.country=function()
{
	this.loadview('country');
}
taxes.countrysave= function()
{
	var tax = this.loadmodel('tax');
	
	tax.savecountry(this.req.postdata, function(doc)
	{

		taxes.jsonResp(doc);
	});
	
}

taxes.regions = function(countryid)
{
	var mod = this.loadmodel('tax');
	var tx = this;
	mod.find({countrycode:countryid},{},{},true,
    function(doc)
    {
		
      var decd = mod.decodeallValues(doc);
      tx.viewholder.title = "Regions";
	  tx.viewholder.countrycode = decd[0].countrycode;
	  tx.viewholder.country = decd[0].country;
	  tx.loadview('regions');
      //mod.convertImagesToBase64(decd);
      //taxes.jsonResp(decd);
    }
    );
	
}

taxes.getregions = function(cid)
{
	var mod = this.loadmodel('tax');
	mod.getregions(cid, function(doc)
	{
		
		taxes.jsonResp(doc);
	});
}

taxes.regionadd = function()
{
	
	var tax = this.loadmodel('tax');
	tax.saveregion(this.req.postdata,function(doc){
		
		taxes.jsonResp(doc);});
}
taxes.removeregion = function()
{
	var obj = this.req.postdata;
	var mod = this.loadmodel('tax');
	console.log(obj);
	mod.removeregion(obj._id, obj.regionname, function(doc)
	{
		taxes.jsonResp(doc);
	});
	
}

taxes.overides=function()
{
	this.loadview('overides');
}

taxes.collections=function()
{
	this.loadview('collections');
}

taxes.getoverides = function()
{
	var mod = this.loadmodel('tax');
	mod.gettaxes(function(doc)
	{
		
		var tempdoc= {};
		tempdoc.overides=[];
		tempdoc.locations = [];
		
		var rides = [];
		for(var pais in doc)
		{
		var loc= {};
		loc.sublocations=[];
		//tempdoc.locations();
		
		loc.country = doc[pais].country;
		loc.countryid = doc[pais]._id;
		loc.countrycode =doc[pais].countrycode;
		if(doc[pais].regions.length > 0)
		{
			
			
			for(var reg in doc[pais].regions)
			{  
				loc.sublocations.push(doc[pais].regions[reg].regionname);
				var ovr = doc[pais].regions[reg].overides;
				if(ovr != undefined && ovr.length !== 0)
				 for(var vrides in ovr)
				 {
				   tempdoc.overides.push(ovr[vrides]);
				   
				 }
		
			} 
			
			
			
		}
		
		if(doc[pais].overides!== undefined && doc[pais].overides.length > 0)
		{
			rides =doc[pais].overides;
			for(var ovr in rides)
			{
				tempdoc.overides.push(rides[ovr]);
			}
		}
		tempdoc.locations.push(loc);
		
		}
		
		
		
		
		
		taxes.jsonResp(tempdoc);
	});
}
taxes.overidesave = function()
{
	var tax = this.loadmodel('tax');
	tax.saveoveride(this.req.postdata,function(doc){
		
		taxes.jsonResp(doc);});
}
module.exports = taxes;

