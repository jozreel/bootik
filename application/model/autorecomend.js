var Mod = require('simple');

var autorecomend = new Mod.simplemodel();

autorecomend.Rater=function(kind)
{
	this.kind = kind;
}

autorecomend.AddUserRating = function(user, item,callback)
{
	this.modelname= this.kind;
	var ar = this;
	this.find({"user":user,item:item},{},{},true,function(doc)
	{
		
		if(doc.user === undefined)
		{
			
			var obj = {}
			obj.user= user; obj.item=item;
			ar.updateOne({user:user,item:item},obj,callback,true);
		}
	});
}

autorecomend.RemoveUserRating =  function(user, item)
{
	
}

autorecomend.ItemsByUser = function(user,callback)
{
	this.modelname= this.kind;
	var ar = this;
	this.find({"user":user},{},{},true,function(doc)
	{
		
		callback(doc);
		
	});
}

autorecomend.UsersByItem = function(item,user,callback)
{
	this.modelname= this.kind;
	var ar = this;
	this.find({item:item,user:{$ne:user}},{},{},true,function(doc)
	{
		
		callback(doc);
		
	});
}

autorecomend.UsersByItemObj = function(item,user,callback)
{
	this.modelname= this.kind;
	var ar = this;
	var it=item.item;
	
	
	this.find({item:it, user:{$ne:user}},{},{},true,function(doc)
	{
		
		return callback(doc);
		
	});
}
module.exports = autorecomend;
