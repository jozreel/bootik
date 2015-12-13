var simple = require('simple');
var taxdef = new simple.simplemodel();
taxdef.modelname='taxdef';
taxdef.global = function(obj, callback)
{
    var td=this;
	var event ='E';
	this.findall(function(doc)
	{
	 console.log(doc);
	if(doc[0].success !== false)
	{
      event ='E';
	  taxdef._id=doc[0]._id;
	}
	else{
		console.log('mo');
		event = 'A';
	}
	var arr = [];
	for(var a in obj)
	{
	  arr.push(obj[a]);
	}
	console.log(event);
	taxdef.definitions = arr;
	console.log(taxdef.definitions);
    taxdef.save(callback,event);
	},true);
	
}

module.exports = taxdef;