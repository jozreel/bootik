var simple = require('simple');
var cart = new simple.simplemodel();
cart.modelname = 'cart';
cart.savecart = function(obj, callback)
{   
   var ct = this;
    this.insertcounters('cartid');
	//console.log(obj);
	this.generateNextSequence('cartid', function(next){
	var tempobj ={};
	var citems=[];
	ct.cartid = next;
	ct.userid = obj.userid;
	
	tempobj.count = 1;
	tempobj.itemid = obj.itemid;
	citems.push(tempobj);
	ct.items = citems;
	ct.count=1;
	ct.save(function(doc)
	{
		if(doc.success ===true)
		{
			callback({sucess:true, count:1});
		}
		else
		   callback({sucess:false, count:0});
	}
	,'A');
	});
}

cart.updatecart = function(doc,itemid,ev, qty,callback)
{
	console.log(ev);
  // var id = this.createObjectId(obj.itemid)
	this._id = doc._id;
	var counupdated = false;
	for(var item in doc.items)
	{
		
		if(doc.items[item] !== null && doc.items[item].itemid === itemid)
		{   
			
			if(ev==='D')
			{
				
				this.count = parseInt(doc.count) - parseInt(doc.items[item].count);
				delete doc.items[item];
				console.log(doc.items);
			}
			
			if(ev=== 'A')
			{
		      doc.items[item].count = parseInt(doc.items[item].count)+1;
			  this.count = parseInt(doc.count)+1;
			}
			if(ev === 'E')
			{    var prevcount = parseInt(doc.count);
			     var mincount = prevcount - parseInt(doc.items[item].count);
				 doc.items[item].count = qty;
				   if(qty === 0)
				     delete doc.items[item];
				   
				  this.count =  mincount +parseInt(qty);
			}
			counupdated = true;
			this.items = doc.items;
			break;
		}
		
		
	}
	if(! counupdated)
	{
		doc.items.push({count:1, itemid:itemid});
		this.items = doc.items;
		
		this.count = parseInt(doc.count)+1;
	}
	var count =this.count;
	console.log(count);
	this.save(function(doc1)
	{
		
	   if(doc1.success ===true)
	   {
		  
		   callback({sucess:true, count:count});
	   }
	   else {
		  
		   callback({sucess:false, count:doc.count});
	   }
	},'E');
}

cart.findusercart = function(user,callback)
{
	try{
	this.find({userid:user},{},{},false,callback);
	}
	catch(error)
	{
		console.log(error);
	}
}

module.exports =cart;
