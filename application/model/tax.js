var simple = require('simple');
var tax = new simple.simplemodel();
tax.modelname = 'tax';
tax.savetax = function(obj, callback)
{   if(obj._id !==undefined) this._id = obj._id;
	this.name = obj.name;
	this.description = obj.desc;
	this.percent = obj.percent;
	
	this.save(callback,obj.event);
}

tax.deletegroup = function(obj,callback)
{
	for(var it in obj)
	{
	
	  var objid = this.createObjectId(obj[it]);
	  obj[it] = objid;
	}
	
	this.removegroup('_id',obj,callback);
	
}
tax.deletecountry = function(id, callback)
{
	this._id = id;
	this.deleteone(callback);
}
tax.gettaxes = function(callback)
{
	this.findall(function(doc)
	{
			
		 
		 var doc1 = tax.decodeallValues(doc);
		 callback(doc1);
	},true);
}

tax.getregions = function(cid, callback)
{
	
 this.find({countrycode:cid},{'regions':true},{},true,function(doc)
  {
     
     var decd = tax.decodeallValues(doc);
     
      callback(decd);
      
  });
}
tax.savecountry= function(obj,callback)
{
   
	this.country = obj.country;
	this.countrycode =obj.countrycode;
	this.countrytax = obj.countrytax;
    if(obj.event ==='A')
	{
	this.regions=[];
	this.overides=[];
	}
	if(obj.event ==="E")
	{
	  this._id = obj._id;
	 
	}
	
	this.save(callback,obj.event);
	
}
tax.saveregion = function(obj,callback)
{
	var region = {};
	if(obj === undefined)
	{
		callback({success: false, message: 'no object passed'})
	}
	else
	{
	region.regionname = obj.regionname;
	region.calculation = obj.calculation;
	region.taxcode = obj.taxcode;
	region.rate = obj.rate;
	region.overides=[];
	var temp= [];
	
    if(obj.event === 'A')
	{
	 this.insertcounters('regionid');
     var taxobj = this;
	 
	 this.generateNextSequence('regionid', function(next){
	  region.regionid=next;
	  temp.push(region);
	 taxobj.pushtoarray({'countrycode':obj.countrycode}, temp,'regions',callback);
	 });
	}
	else if(obj.event ==='E')
	{
		var objid = this.createObjectId(obj._id);
		
	    this.updateinarray({_id:objid, "regions.regionname":obj.prevvalue},{ "regions.$" : region} , callback)
	}
	  
	}
}
tax.removeregion = function(id,regionname, callback)
{
	var objid = this.createObjectId(id);
	this.removefromarray({_id:objid}, {regions:{regionname:regionname}},false,callback);
	
}

tax.fincountry =function(cid, callback)
{
  this.find({countrycode:cid},{},{},true,function(doc)
  {
     
     var decd = tax.decodeallValues(doc);
     
      callback(decd);
      
  });
}

tax.saveoveride = function(obj,callback)
{
	
	
	var overide = {};
	
	overide.rate = obj.rate;
	overide.category = obj.category;
	overide.location = obj.location;
	var temp= [];
	
	
	
	 if(obj.location.locationtype === 'country')
	 {
		 var taxobj = this;
	   if(obj.event === 'A')
	  {
	    this.insertcounters('overideid');
		
		
	    this.generateNextSequence('overideid', function(next){
		
		overide.overideid = next.toString();
		console.log(typeof(overide.overideid));
		temp.push(overide);
		var objid = taxobj.createObjectId(obj.location.country);  
	    taxobj.pushtoarray({'_id':objid}, temp,'overides',callback);
		});
	   }
	   else if(obj.event ==='E')
	   {
		 overide.overideid=obj.overideid; 
		
		 var objid = taxobj.createObjectId(obj.location.country);  
		 
		
	     this.updateinarray({'_id':objid, "overides.overideid":obj.overideid},{ "overides.$" : overide} , callback);
	   } 
	 }
	  else
	  {
		  var tj = this;
		   var countrycode = obj.location['country'];
		  
		  if(obj.event === 'A')
	      { 
		    delete obj.location.country;
		   this.insertcounters('overideid');
	       this.generateNextSequence('overideid', function(next){
		 
		 //  overide.location = obj.location;
		   overide.overideid = next.toString();
		   temp.push(overide);
		   var objid = tj.createObjectId(countrycode);
		   tj.pushtoarray({'_id':objid, 'regions.regionname':obj.location.location}, temp,'regions.$.overides',callback);
		   }
		   );
		  }
		  else if(obj.event ==='E')
		  { 
			   var oid = tj.createObjectId(countrycode);
				   delete obj.location.country;
			      overide.overideid=obj.overideid; 
			    this.find({"regions.overides":{$elemMatch:{overideid:obj.overideid}}},{regions:true},{},true, function(doc)
				{
					
					var reg = doc[0].regions;
					//console.log(reg);
					for(var ovr in reg)
					{
						for(var rds in reg[ovr].overides)
						{
							var rrd = reg[ovr].overides[rds];
							if(rrd.overideid === obj.overideid)
							{
							
							 reg[ovr].overides[rds] = overide;
							
							 tj.updateinarray({'_id':oid, "regions.overides":{$elemMatch:{overideid:obj.overideid}}},{ "regions.$.overides" : reg[ovr].overides} , callback);
							 return;
							}
						}
					}
				});
			    
				 
			   
		  }
		  
	
	}
	
}


module.exports = tax;