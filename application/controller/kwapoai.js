var simple = require('simple');
var kwapoai = new simple.simplecontroler();

kwapoai.addlike = function()
{
	
	
	var user = this.req.postdata.user;	
	var item = this.req.postdata.item;
	var mod = this.loadmodel('autorecomend');
	mod.kind = "likes"
	mod.AddUserRating(user,item,function()
	{
		
	});
}

kwapoai.adddislike = function()
{
	
	
	var user = this.req.postdata.user;	
	var item = this.req.postdata.item;
	var mod = this.loadmodel('autorecomend');
	mod.kind = "dislikes"
	mod.AddUserRating(user,item,function()
	{
		
	});
}
kwapoai.addviewed = function()
{
	
	
	var user = this.req.postdata.user;	
	var item = this.req.postdata.item;
	var mod = this.loadmodel('autorecomend');
	mod.kind = "viewed";
	mod.AddUserRating(user,item,function(doc)
	{
		kwapoai.jsonResp(doc);
	});
}


//auto recomend algorithm using jacard index
kwapoai.recomendfrombrowsing =function(userid)
{
	
	var rec = this;
	var async = require("async")
	var mod = this.loadmodel('autorecomend');
	mod.kind = "viewed";
	async.auto({
		 likes:function(callback)
		{
			mod.ItemsByUser(userid, function(doc)
	        {
				var ta = [];
				var j=0;
				for(var it in doc)
				{ j++;
					ta.push(doc[it].item);
					if(j == doc.length)
				       callback(null, ta);
				}
				
			});
		}	
	},
	function(err, results)
	{
		var similarUsers =[];
		async.auto({otherUsers:function(callbackt)
		{
		    mod.find({'item': {$in:results.likes}, user:{$ne:userid}},{_id:false, item:false},{},true,function(db)
			{
				
		    for(var usr in db)
			{
				
				similarUsers.push(db[usr].user)
			}
			   similarUsers =  removeDuplicates(similarUsers);
			   mod.aggregate({user: {$in:similarUsers}},{_id: "$user", count: { $sum: 1 },itemsviewed: { $push:  "$item" } },function(doc){
		     
				callbackt(null,doc)
				
		   });
		   });}},
		function(err,resultothers)
		{
			
		    async.auto({
				similars:function(calm)
				{
					 async.map(resultothers.otherUsers, function(otherusr, callbackit) 
					           {
								  
								   var int = intersect(otherusr.itemsviewed,results.likes);
						           var un = union(otherusr.itemsviewed,results.likes);
					     
						       var smi = int.length/un.length;
					           var uniq = removeDuplicates(otherusr.itemsviewed);
					           var df = difference(uniq,results.likes);
							  
					            var user= {user:otherusr, similarity:smi, differentitems:df}
								callbackit(null,user);
							   },
							   function(err, similars){
								  calm(null,similars); 
							   }
					 );
						        
				}
			},function(err,res)
			{
				
	
						async.auto(
							{
							  	otheruseritems:function(callb)
								{
									
									async.map(res.similars,function(usar, callbacksm)
						            {
							
							
							         callbacksm(null,usar.differentitems)
							
						            },
						           function(err, resultsim)
						           {
									  var tmp =[];
							        for(var s in resultsim)
									{
										tmp = tmp.concat(resultsim[s]);
									}
								
								    callb(null,tmp);
						           }
							
							
						          );
								}
							},
							function(err, callbtw)
							{
								
								
								var uniqe = removeDuplicates(callbtw.otheruseritems);
							
								var diff = difference(uniqe,results.likes);
								   async.auto({
									   
									   oulikes:function(callbackat)
									   {
										   
										   mod.aggregate({item: {$in:diff}},{_id: "$item", count: { $sum: 1 }, itemusers: { $push:  "$user" }},function(doc)
								            {
									           var arit =[];
											    
										      async.map(doc, function(itusr,callfc)
											  {
												
												  async.map(itusr.itemusers, function(us,calbk)
												  {  var ou;
												     var num=0;
														
												    for(var usim in res.similars)
										              {
													  if(res.similars[usim].user._id === us)
											            {  
											              ou=res.similars[usim];
														
											             if(ou !== undefined)
											             {
												          num=ou.similarity;
											             }
											             }
													  }
													 
													  calbk(null, num);
												  },
												  function(err, resu)
												  {     var wt = 0;
													    for(var uind in resu)
												        {
															wt+= resu[uind];
														}
													    var sugest ={weight: wt/itusr.itemusers.length, item:itusr._id}
													    callfc(null, sugest);
													//console.log(resu) ; 
												  });
												 // callfc(null,itusr.itemusers);
											  },
											  function(err, r)
											  {
												 callbackat(null,r);
											  }
											  );
											     
										      });
											 
									          }
								            
										  
									 }
								   , function(err,resulikes)
								   {
									 // console.log(resulikes);
									  var modinv = rec.loadmodel('inventory');
									var arr=[];
									for(var recit in resulikes.oulikes)
									{
										
										arr.push(modinv.createObjectId(resulikes.oulikes[recit].item));
									}
									
									modinv.find({'_id': {$in:arr}},{},{},true,function(dcc)
									{
										 dcc = modinv.decodeallValues(dcc);
      
                                         modinv.convertImagesToBase64(dcc);
										rec.jsonResp(dcc);
									});
									 
								   });	
									
							}
							
						);
						
					}
				  );
				
		});
	  
	}
	);
	
    
}

function intersect(arr1,arr2)
{
	var temp = [];
	//console.log(arr1,arr2);
		 for(var olike in arr1)
						 {
							
							for(var v =0; v<  arr2.length; v++)
							{
							  if(arr1[olike] === arr2[v])
							  {
								  temp.push(arr1[olike]);
							  }
							}
						 }
						
						 return temp;
}

function union(arr1, arr2)
{
	var arr = arr1.concat(arr2);
	//console.log(arr);
	var uniqueArray = arr.filter(function(elem, pos) {
    return arr.indexOf(elem) == pos;
  }); 
  
  return uniqueArray;

}

function removeDuplicates(arr)
{
	var uniqueArray = arr.filter(function(elem, pos) {
    return arr.indexOf(elem) == pos;
  }); 
  
  return uniqueArray;
}

function difference(arrothers, arruser)
{
   // console.log(arrothers, arruser);	
	var uniqueArray = arrothers.filter(function(elem, pos) {
    return arruser.indexOf(elem) === -1;
  }); 
  
  return uniqueArray;
}

module.exports = kwapoai;