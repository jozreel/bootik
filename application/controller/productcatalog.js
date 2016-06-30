var simple = require('simple');
var productcatalog= new simple.simplecontroler();

 function testlogin()
 {
   
   if(productcatalog.req.session.get('login'))
   {
     return true;
   }
   else{
     
   
     productcatalog.req.redirect.redirect('https://'+productcatalog.req.hostname+':4433/user/login');
   }
 }

  productcatalog.add =function()
	{
     // console.log(this.req);
     var pc= this;
    if(testlogin())
    {
	  
	  var mod = this.loadmodel('store');
      mod.find({}, {defaultlang:true},{},false, function(d)
      {  
          pc.viewholder.title = "this is the inventory page";
          pc.viewholder.defaultlang = d.defaultlang;
	  // console.log('sda');
	      pc.req.session.get('username');
          pc.loadview('addproduct');
       });
	   
	   
	   
	   
	  // var view = 
      }
   
	  
	}
	
    productcatalog.edit = function(id)
    {
        var pc = this;
      var mod = this.loadmodel('store');
      mod.find({}, {defaultlang:true},{},false, function(d)
      {  
        pc.viewholder.productid = id;
        pc.viewholder.defaultlang = d.defaultlang;
        pc.loadview('addproduct');
      });
    }
    productcatalog.findbyid = function(id,locale)
    {  
        var mod = this.loadmodel('inventory');
        id = mod.createObjectId(id);
        
        proj ={}
        proj[locale] = true;
        proj.instore = true;
        proj.fieldgroup = true;
        ret = {}
       
        mod.find({_id:id}, proj,{},false,function(doc){
           
            ret = doc[locale];
            if(ret !== undefined)
            {
              ret._id=doc._id;
              ret.fieldgroup = doc.fieldgroup;
              ret.instore = doc.instore;
            }
           
            productcatalog.jsonResp(ret);} );
    }
    
	productcatalog.passdata = function()
	{
    
     if(testlogin())
    {
	    var mymod = this.loadmodel('inventory');
	 //  if(this.req.postdata.event == 'A')
    
       if(this.req.postdata._id === undefined)
       {
            id = mymod.createObjectId();
       }
       else
       {
          id = mymod.createObjectId(this.req.postdata._id);
          delete this.req.postdata._id;
       }
       
         mymod.updateOne({_id: id}, this.req.postdata, function(r){productcatalog.jsonResp(r);},true);
	  // if(this.req.postdata.event == 'E')
	     //  mymod.modify(this.req.postdata, function(r){productcatalog.jsonResp(r);});
    
    }
        
	}
	productcatalog.viewall =function()
	{
		if(testlogin())
    {
		var mymod = this.loadmodel('inventory');
		
		mymod.getAll(this.display);
    }
	}
	
	productcatalog.viewtable =function()
	{
		
		var mymod = this.loadmodel('inventory');
		
		mymod.getAll(this.display);
	}

  productcatalog.display=function(docs)
   {
	   
	    //console.log(docs,);
	  //console.log(docs);
	  // var r = Array();
	  // r.push(doc);
	  
	//   console.log(strdoc);
      
      productcatalog.res.writeHead(200, {'Content-Type':'text/json'});
	  //var view = productcatalog.loadview('admin',{dyn:strdoc}, productcatalog.res);
	   var strdoc =JSON.stringify(docs);
	  
	  
	 //console.log(r.length);
	 productcatalog.res.end(strdoc);
   }
 /* productcatalog.jsonResp =function(r)
  {
	  
	 // console.log(r);
	   productcatalog.res.writeHead(200, {'Content-Type':'text/json'});
	   var jsn = JSON.stringify(r);
	  // console.log(jsn);
	   productcatalog.res.end(jsn);
  }
  */
 productcatalog.searchfortable=function(txt,limit,last)   
 {
   var mod = this.loadmodel('inventory');
   mod.adsearch(txt,{name:true, cat:true, sku:true,uprice:true,qty:true,instore:true,},{"limit":limit, "skip":last, "sort":"name"},function(doc){productcatalog.jsonResp(mod.decodeallValues(doc));});
 }
 
  productcatalog.search=function(txt)
  {
	 // console.log(txt);
   if(testlogin())
    {
	  var mymod = this.loadmodel('inventory');
	 // console.log("hi");
	  mymod.search(txt,showres);
    }
	  
  }
  productcatalog.delete = function()
  {
    if(testlogin())
    {
	   var mymod = this.loadmodel('inventory');
	   
	  mymod.removeinv(this.req.postdata, function(doc)
    {
      doc.message = 'item deleted'
      productcatalog.jsonResp(doc);
    });
    }
  }
  productcatalog.index = function()
  {
	 this.viewholder.title = "this is the inventory page";
	 this.loadview('catalogtable');
  }
  
  function showres(doc)
  {
	 
	  productcatalog.jsonResp(doc);
  }
  productcatalog.rootcategories = function()
  {
    if(testlogin())
    {
	  this.loadview('rootcategories');
    }
  }
  productcatalog.addrootcategory = function()
  {
    if(testlogin())
    {
    var obj=this;
	  var invmod = this.loadmodel('rootcategory');
	  invmod.addrootcategory(this.req.postdata,
    function(r){obj.jsonResp(r);} );
    }
  }
  productcatalog.editrootcategory = function()
  {
    if(testlogin())
    {
    var obj=this;
    
	  var invmod = this.loadmodel('rootcategory');
	  invmod.editrootcategory(this.req.postdata,
    function(r){obj.jsonResp(r);} );
    }
  }
  
   productcatalog.getrootcategory = function()
  {
    if(testlogin())
    {
    var obj=this;
	  var invmod = this.loadmodel('rootcategory');
   
	  invmod.getcategories(function(r){
      obj.jsonResp(r);
    }
      );
    }
  }
   productcatalog.testdata = function()
  {
  
	 this.loadview('test');
     
  }
  productcatalog.removerootcategory = function()
  {
    
    if(testlogin())
    {
     var obj = this.req.postdata;
    
    var mod = this.loadmodel('rootcategory');
   
     mod.removerootcategory(obj.ids, function(doc){console.log(doc,"kokok"); productcatalog.jsonResp(doc);});
    }
  }
  
   productcatalog.categories=  function(rootid)
  {
      var pc = this;
      var mod = this.loadmodel('store');
      mod.find({},{defaultlang:true},{},false, function(doc){
          pc.viewholder.defaultsite = doc.defaultlang;
          pc.viewholder.rootid=rootid;
      
         pc.loadview('categories');
      });
      
  }
  
   productcatalog.getcatcount = function()
  {
    
    var mod = this.loadmodel('category');
    mod.recordcount(function(doc){productcatalog.jsonResp(doc);});
  }
  
  productcatalog.getcattable = function(rootcat,limit,num,lan)
  {
     var mod = this.loadmodel('category');
        
      var rootcat = mod.createObjectId(rootcat);
      mod.page({rootcategory:rootcat},parseInt(limit), parseInt(num), {formfields:{$elemMatch:{language:lan}}}, function(r){
          retar = [];
          for(f in r)
          {
              
             if(r[f].formfields !== undefined && r[f].formfields.length >0)
             {
             delete r[f].formfields[0].language;
             r[f].formfields[0]._id = r[f]._id;
            //  r[f].formfields[0].rootcategory = r[f].rootcategory;
             retar.push(r[f].formfields[0]);
             }
          }
          productcatalog.jsonResp(retar)});
  }
  
  productcatalog.getcatbyid = function(catid,lan)
  {
     var mod = this.loadmodel('category');
    
      var catid =mod.createObjectId(catid);
      mod.find({_id:catid},{formfields:{$elemMatch:{language:lan}},children:1,enabled:1},{},false, function(r){
             if(Object.keys(r).length >0 && r.formfields!==undefined)
             {
                
              r.formfields[0]._id = r._id;
              r.formfields[0].enabled = r.enabled;
                mod.find({children:r._id},{formfields:{$elemMatch:{language:lan}}},{},false,function(dd){
                  if(Object.keys(dd).length >0)
                  {
                   r.formfields[0].parentid = dd._id;
                   r.formfields[0].parentname = dd.formfields[0].name;
                 
                  }
                  productcatalog.jsonResp(r.formfields[0])
                  
                 
             });
             }
             else
             {
                 productcatalog.jsonResp({});
             }
            //  r[f].formfields[0].rootcategory = r[f].rootcategory;
            
         
         });
  }
  
  productcatalog.categoryadd =  function(rootid,lan,catid)
  {
      
      this.viewholder.rootid=rootid;
      
      if(catid !==undefined)
        this.viewholder.catid = catid;
      else
        this.viewholder.catid="";
        this.viewholder.defaultsite = lan;
      this.loadview('categoryadd');
  }
  productcatalog.getcategories=function(rootid,lan)
  {
    
     var catmod = this.loadmodel('category');
     catmod.getbyroot(rootid,lan,function(doc){
         var retstr = []
        
        
         for(ff in doc)
         {
             var flds = doc[ff].formfields[0];
            
             tm = {};
             tm._id = doc[ff]._id;
             tm.enabled= doc[ff].enabled;
             tm.name= flds.name;
             tm.description =flds.description;
             tm.language = flds.language;
             tm.children = doc[ff].children;
             retstr.push(tm);
             
         }
         productcatalog.jsonResp(retstr);});
  }
  
  productcatalog.addcategory = function()
  {
      var obj = this;
      var catmod = this.loadmodel('category');
   var regex = new RegExp(this.req.postdata.name,'i');
   catmod.find({formfields:{$elemMatch:{name:{$regex:regex}}}},{formfields:{$elemMatch:{language:this.req.postdata.locale}}},{},false,function(doc)
   {
       //console.log(doc);
       if(Object.keys(doc).length === 0)
       {
           catmod.add(obj.req.postdata,function(respns)
           {
              productcatalog.jsonResp(respns);
           }
           );
       }
   });
         
  }
  
  productcatalog.editcategory=function()
  {
      var catmod = this.loadmodel('category');
      catmod.add(this.req.postdata, function(respns)
      {
          productcatalog.jsonResp(respns);
      }
      );
  }
  
  
  
  productcatalog.units = function()
  {
    if(testlogin())
    {
    this.loadview('unit');
    }
  }
  
  productcatalog.getunits = function()
  {
    if(testlogin())
    {
    var obj = this;
    var invmod = this.loadmodel('unit');
    invmod.getunits(function(r)
    {
     
       obj.jsonResp(r);
    });
    }
  }
  productcatalog.addunit = function()
  {
    if(testlogin())
    {
     var invmod = this.loadmodel('unit');
     invmod.addunit(this.req.postdata,  function(doc){productcatalog.jsonResp(doc);});
    }
  }
  productcatalog.editunit = function()
  {
    if(testlogin())
    {
    var obj=this;
    
	  var invmod = this.loadmodel('unit');
	  invmod.editunit(this.req.postdata,
    function(r){obj.jsonResp(r);} );
    }
  }
  productcatalog.removeunit=function()
  {
     var invmod = this.loadmodel('unit');
     invmod.removeunit(this.req.postdata.ids, function(doc)
     {
       productcatalog.jsonResp(doc);
     });
  }
  productcatalog.instore=function()
  {
    
    var mod = this.loadmodel('inventory');
   
    mod.find({instore:'true'},{},{},true,
    function(doc)
    {
      var decd = mod.decodeallValues(doc);
      
      mod.convertImagesToBase64(decd);
      productcatalog.jsonResp(decd);
    }
    );
  }
  productcatalog.page = function(limit,num)
  {
    

    var mod = this.loadmodel('inventory');
    mod.paginate(parseInt(limit), parseInt(num), {}, function(r){productcatalog.jsonResp(r)});
  }
  
  productcatalog.job=function(data,next)
  {
   /// console.log(this.req.requestdata);
    //console.log(data);
  //  console.log(next);
  }
  productcatalog.updatecart = function()
  { 
   if(this.req.session.get('login')&& this.req.session.get('group')=='user')
   {
    
     this.updatecartdb();
   }
   else
   {
     this.updatecartsession();
   }
  }
  
  productcatalog.updatecartdb = function()
  {
    var event = this.req.postdata.event;
    if(this.req.session.get('login')&& this.req.session.get('group')=='user')
   {
       
         var userid = this.req.session.get('username');
       
         var incomingdata = this.req.postdata.cartdata;
         var mod = this.loadmodel('cart');
        
          mod.findusercart(userid, function(doc)
          {
           
            if(Object.keys(doc).length >0)
            {
             
             mod.updatecart(doc,incomingdata.itemid, event, incomingdata.qty, function(doc1)
             {
               
               productcatalog.jsonResp(doc1);
             });
             
            }
            else
            {
             
              
               incomingdata.userid = userid;
               mod.savecart(incomingdata, function(doc)
                 {
                     productcatalog.jsonResp(doc);
               });
              
            }
            
        
            
          }
          );
        
     }
   
    
  }
  
  productcatalog.getcount = function()
  {
   
    var mod = this.loadmodel('inventory');
    mod.recordcount(function(doc){productcatalog.jsonResp(doc);});
  }
  productcatalog.getcatalogtable = function(limit,num)
  {
     if(testlogin())
     {
     var mod = this.loadmodel('inventory');
      pc = this;
      var common = require('./common');
      common.getstore(this);
      var lan = {}
      lan[this.viewholder.defaultlang]=true;
      
      mod.ptable(parseInt(limit), parseInt(num), lan, function(r){
          var retr = []
          for(doc in r)
          {
              rec = r[doc];
             
              var vals = rec[pc.viewholder.defaultlang]
              if(vals !==undefined)
               retr.push({_id:rec._id, name:vals.name,shortdesc:vals.shortdescription, price:vals.price});
          }
          productcatalog.jsonResp(retr)});
     }
  }
  productcatalog.updatecartsession = function()
  { //fix this
    
   var event = this.req.postdata.event; 
    var cart={};
  
   
      
    
       if(this.req.session.get('cart') !== '')  
          cart = JSON.parse(this.req.session.get('cart'));
          
       var incomingdata = this.req.postdata.cartdata;
       
       var count = 1;
       for(var item in cart.items)
       {
         
         if(cart.items[item] !== null && cart.items[item].itemid === incomingdata.itemid)
         {
           if(this.req.postdata.event == 'A')
            {
     
             count = parseInt(cart.items[item].count)+1;
             cart.items[item].count=count;
             cart.count =parseInt(cart.count)+1;
            }
            if(this.req.postdata.event == 'D')
            {
               cart.count =parseInt(cart.count)-parseInt(cart.items[item].count);
              delete cart.items[item];
             
            }
            if(this.req.postdata.event === 'E')
			      {    var prevcount = cart.count;
			         var mincount = parseInt(prevcount) - parseInt(cart.items[item].count);
               
				       cart.items[item].count =incomingdata.qty;
             
               if(incomingdata.qty === '0' || cart.items[item].count ==='0')
                   delete cart.items[item];
				      cart.count =  mincount +parseInt(incomingdata.qty);
             
			       }
          break;
         }
        
       }
       if(count === 1 && event === 'A')
       {
       incomingdata.count = count;
        
       cart.items.push(incomingdata);
       cart.count+=1
      
       }
      // console.log(cart);
       this.req.session.change("cart", JSON.stringify(cart));
       length = 0;
      
         length+= cart.count;
       
        productcatalog.jsonResp({sucess:true, count:length});
       
     
   
  }
  
  
  productcatalog.getcartitems = function()
  {
   
   if(this.req.session.get('login')&& this.req.session.get('group')=='user')
   {
   
     this.getcartitemsdb(this.req.session.get('username'));
   }
   else
   {
     this.getcartitemssession();
   }
      
  }
  
  productcatalog.getcartitemssession = function()
  {
    
    var length=0;
    if(this.req.session.get('cart') !== '')  
     {
     
      var cart =  JSON.parse(this.req.session.get('cart'));
     
      length = cart.count;
     
     }
     
     productcatalog.jsonResp({sucess:true, count:length});
    
  }
  
  
  productcatalog.getcartitemsdb = function(userid)
  {
      var mod = this.loadmodel('cart');
        
       mod.findusercart(userid, function(doc)
       {
         if(doc.count !== undefined)
          productcatalog.jsonResp({success:true, count:doc.count});
         else
           productcatalog.jsonResp({success:true, count:0});
         
       });
  }
  
  productcatalog.findcartitems = function()
  {
  
        
    var cart;
    var inv = this;
    if(this.req.session.get('login') === 'true')
    {
      var mod = this.loadmodel('cart');
      mod.findusercart(this.req.session.get('username'),function(doc)
      {
       
         
        inv.findcartitemssession(doc);
      }
      );
    }
    else
    {
     cart = JSON.parse(this.req.session.get('cart'));
      this.findcartitemssession(cart);
    }
  }
  
  productcatalog.findcartitemssession = function(cart)
  {
   
   
   /* var arr=[];
    var mod = this.loadmodel('inventory');
    for(var it in cart.items)
    {
     
      var objid = mod.createObjectId(cart.items[it].itemid);
     console.log(objid);
	    arr[it] = objid;
    }
     
    
    mod.find({'_id': {$in:arr}},{name:true, desc:true, image:true,price:true},{sort:'name'},true,function(doc)
    {var decd = mod.decodeallValues(doc);
     
      mod.convertImagesToBase64(decd);
    // decd.count = 
      for(var it in decd)
      {
        decd[it].count = productcatalog.addcartdata(cart,decd[it]._id);
      }
      productcatalog.jsonResp(decd);
    });*/
    
    
    
    
 
    
    
    var itemid;
   
    var docs =[];
   
    var dc;
    var arr=[];
    var mod = this.loadmodel('inventory');
   
    for(var it in cart.items)
    {
      console.log(it);
      if(cart.items[it] !== null)
      {
        var objid = mod.createObjectId(cart.items[it].itemid);
     
	    arr[it] = objid;
      }
    }
   var stop = 1;
  var curr = 0;
  var total = 0.00;
   var async = require('async');
  
   async.whilst(
      function () { return curr < stop;},
     function(callback)
     {
      mod.find({'_id': {$in:arr}},{name:true, desc:true, image:true,uprice:true},{sort:'name'},false,function(doc,count)
      {
         
       
       if(stop === 0)
          stop=count;
      curr ++;
      if(doc._id !== undefined) 
      {
       itemid = doc._id.toString();
      
     
       for(var it in cart.items)
       {
         
         if(cart.items[it] !== null && cart.items[it].itemid === itemid)
         {
           
             doc.count = cart.items[it].count;
           
             break;

             
         }
         
       }
      }
       if(doc.uprice !== '' || doc.uprice !== undefined)
       {
       
        total = total + (parseFloat(doc.uprice) * doc.count);
        //console.log(count);
        
       }
     //  var d = JSON.stringify(doc);
       
       docs.push(doc);
       
      
       if(count === undefined)
       {
         count=0;
         total =0;
         callback(null,total);
       }
       if(curr === count)
       {
         
         callback(null, total);
       }
     
    }); 
   
     
     },
   
   function(err, tot)
     {
      
       if(err)
        console.log(err);
     
      var obj = {}; 
       var decd = mod.decodeallValues(docs);
       mod.convertImagesToBase64(decd);
      
       obj.total = total.toFixed(2);
       obj.items = JSON.stringify(decd);
    //// decd.count = 
      // console.log(JSON.parse(obj));
     
      productcatalog.jsonResp(obj);
     }
   );  

    
   
  }
  productcatalog.showcart = function()
  {
   var common = require('./common');
	
	  common.getheaderdetails(this);
  
    this.loadview('cart','clientlayout');
  }
  productcatalog.addcartdata = function(cart,item)
  {
     for(var it in cart.items)
       {
      
         if(cart.items[it].itemid === item.toString())
         {
           
            return cart.items[it].count;
           
            
         }
       }
       return 0;
       
  }
 
	module.exports = productcatalog;
	