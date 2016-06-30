var Simple = require('simple');
var fieldgroups= new Simple.simplemodel();
fieldgroups.modelname = 'fieldgroups';

fieldgroups.addgroup = function(obj, callback)
{
	
	delete obj.event;
	obj.fieldsets={};
	this.insertOrUpdate(obj ,callback);
}

fieldgroups.findnames = function(callback)
{
    this.find({},{fieldgroupname:true},{},true,function(doc){callback(doc);})
}
/*fieldgroups.addgroupfields = function(obj, callback)
{
	var objid = this.createObjectId(obj._id);
	var temp = [];
	if(obj.event === 'A')
	{
	 this.insertcounters('fldid');
     var fld = this;
	 
	 this.generateNextSequence('fldid', function(next){
	  obj.fldid=next.toString();
	  temp.push(obj);
	  
	 fld.pushtoarray({'_id':objid}, temp,'fields',callback);
	 });
	}
	else
	{    
		
		
		
	    this.updateinarray({_id:objid, "fields.fieldid":obj.fieldid},{ "fields.$" : obj} , callback)
	}
}*/
fieldgroups.addfieldsets = function(obj, callback)
{
	
	var id = this.createObjectId(obj._id);
	var fobj ={};
	 fobj.fieldsets = obj.fieldsets;
	this.findandupdate(id, fobj,callback);
	
}

fieldgroups.paginate = function(limit,last,fields,callback)
{
  
  //this.page(limit,last,fields,callback);
 /* var options = {"limit":limit, "skip":last, "sort":"name"};
 
  this.find({},fields,options,true,function(doc)
  {
     
     var decd = fieldgroups.decodeallValues(doc);
      
      
      callback(decd);
      
  });*/
  
  
}
module.exports= fieldgroups;