var simple = require('simple');
var accounts = new simple.simplecontroler();
var paypal = require('paypal-rest-sdk');
accounts.add = function()
{
	var v = this.loadview('accounts',{title:"Accounts"}, this.res);
}

accounts.passdata = function()
{
	console.log('popo');
	var mod = this.loadmodel('account');
	mod.add(this.req.postdata, function(r){
	  accounts.jsonResp(r);
	});
}

accounts.master = function()
{
	var v = this.loadview('master',{title:"Master Accounts"}, this.res);
}

accounts.category = function()
{
	var v = this.loadview('category',{title:"Account categories"}, this.res);
}

accounts.addcategory = function()
{
	
	var mod = this.loadmodel('accountcategory');
	mod.add(this.req.postdata, function(r){
		 accounts.res.writeHead(200, {'Content-Type':'text/json'});
	   var jsn = JSON.stringify(r);
	  // console.log(jsn);
	   accounts.res.end(jsn);
	});
}

accounts.categories = function() {
	
	var mod = this.loadmodel('accountcategory');
	mod.findcat(function(arr){
		accounts.jsonResp(arr);
	},true)
}
accounts.masteraccounts = function()
{
	
	var mod = this.loadmodel('account');
	mod.findmaster(function(arr){
		//console.log(arr);
		accounts.jsonResp(arr);
	},true)
}

accounts.accounts = function()
{
	
	var mod = this.loadmodel('account');
	mod.findaccount(function(arr){
		//console.log(arr);
		accounts.jsonResp(arr);
	},true)
}
accounts.index = function()
{
	this.req.session.refresh();
	var v = this.loadview('accountslanding',{title:"Account categories"}, this.res);
}

accounts.checkout = function()
{
    var common = require('./common');
    common.getheaderdetails(this);
	this.loadview('checkout','clientlayout');
}

accounts.configurepaypal = function()
{
	paypal.configure({
  'mode': 'sandbox', //sandbox or live this will come from config
  'client_id': 'EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM',
  'client_secret': 'EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM'
     });
}

accounts.paypalcreatecard = function()
{
	
	
	 
	 
	 var card_data = {
  "type": "visa",
  "number": "4417119669820331",
  "expire_month": "11",
  "expire_year": "2018",
  "cvv2": "123",
  "first_name": "Joe",
  "last_name": "Shopper"
   };

}

accounts.paypalcardpayment = function(obj)
{
    var cartinfo = this.getcartinfo(true);
	var reqobj = this.req.postdata;
	var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "credit_card",
        "funding_instruments": [{
            "credit_card": {
                "type": reqobj.cardtype,
                "number": reqobj.ccnumber,
                "expire_month": reqobj.expdate.split('/')[0],
                "expire_year": reqobj.expdate.split('/')[1],
                "cvv2": reqobj.ccv,
                "first_name": reqobj.firstname,
                "last_name": reqobj.lastname,
                "billing_address": {
                    "line1": reqobj.billingaddressline1,
                    "city": reqobj.billingcity,
                    "state": reqobj.billingstate,
                    "postal_code": reqobj.billingpostalcode,
                    "country_code": reqobj.billingcountry
                }
            }
        }]
    },
    "transactions": [{
        "amount": {
            "total": cartinfo.total,
            "currency": "USD",
            "details": {
                "subtotal": cartinfo.subtotal,
                "tax": cartinfo.tax,
                "shipping": cartinfo.shipping,
            }
        },
        "description": reqobj.transactiondesc
    }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        console.log("Create Payment Response");
        console.log(payment);
    }
});
}

accounts.getcartinfo = function(ret)
{ 
    if(this.req.session.get('login') =='true')
    {
        var mod = this.loadmodel('cart');
        mod.findusercart(this.req.session.get('username'),function(doc)
      {
       
            accounts.orderinfo(doc,ret);
      }
      );
    }
    else
    {
        
       var cart = JSON.parse(this.req.session.get('cart'));
     ;
      this.orderinfo(cart,ret);
    }
    
}
 accounts.orderinfo = function(cart,ret)
 {   console.log(ret);
     if(ret === undefined)
        ret = false;
     if(cart.count !== 0)
     {
     var curr=0;
     var stop = 1;
     var async = require('async');
     var itemid;
     var arr=[];
     var total =0.00;
     var docs=[];
     var mod = this.loadmodel('inventory');
     for(var item in cart.items)
     {
         arr[item] = mod.createObjectId(cart.items[item].itemid);
     }
    
     async.whilst(
     function () { return curr < stop;},
     function(callback)
     {
      mod.find({'_id': {$in:arr}},{name:true, desc:true, image:true,uprice:true},{sort:'name'},false,function(doc,count)
      {
       
       if(stop === 0)
          stop=count;
      curr ++; 
      if(doc._id !==undefined)
        itemid = doc._id.toString();
      
      for(var it in cart.items)
       {
      
         if(cart.items[it].itemid === itemid)
         {
           
             doc.count = cart.items[it].count;
             
             break;

             
         }
         
       }
    
      
       if(doc.uprice !== '')
       {
        
        total = total + (parseFloat(doc.uprice) * doc.count);
        
         
       }
     //  var d = JSON.stringify(doc);
       
     //  docs.push(doc);
       
       
       
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
       //var decd = mod.decodeallValues(docs);
       //mod.convertImagesToBase64(decd);
     
       obj.total = total.toFixed(2);
       //obj.items = JSON.stringify(decd);
    //// decd.count = 
      // console.log(JSON.parse(obj));
     if(ret===false)
      accounts.jsonResp(obj);
     else
     {
       
      ret(obj);
     }
     }
   );  
     }
     else{
         if(ret ===false)
         accounts.jsonResp({total:0.00});
         else
         {
           ret({total:0.00});
         }
     }
}

accounts.finalizeorder=function(country,zippost)
{
 
  var async = require('async');
  var accobj = this;
    if(this.req.session.get('login') =='true')
    {
        var mod = this.loadmodel('cart');
        mod.findusercart(this.req.session.get('username'),function(doc)
      {
          accounts.orderinfo(doc,function(dc)
          {
              console.log(dc);
          }
          );
           //accounts.finalcart(doc);
      }
      );
    }
    else
    {
       var cart = JSON.parse(this.req.session.get('cart'));
        accounts.orderinfo(cart,function(dc)
          {
            var shiprate =0.00;
            async.auto({
              shipping:function(callbackship)
              {
                var modcountry = accobj.loadmodel('shipping');
                 modcountry.find({'destinationcountry.code':country},{},{},true,function(shipc)
                 {
                  var country = shipc[0];
                   if(country.singledest === true)
                   {
                    shiprate= country.countryrate;
                 
                     }
                     else 
                     {
                     async.auto({
                     getdestrate:function(callback)
                     {
                      async.map(country.destinations,
                       function(dest, callbackdest)
                        {
                         if(dest.zippost === zippost)
                           callbackdest(null, dest)
                        },
                       function(err, destfind)
                       {
                         callback(null,destfind);
                       }
                       );
                    
                      }
                     },
                     function(err, rs)
                     {
                      
                       callbackship(null, rs. getdestrate[0])
                     }
                     );
                     }
                    }
                   );
                  },
               taxes:function(callbacktax)
               {
                callbacktax(null,{l:'ip'});
               }
            },
            function(err,resmain)
            {
                 console.log(resmain);
            });
             
             
            
             
          }
          );
       
    }
}
accounts.finalcart = function()
{
    
}

module.exports = accounts;