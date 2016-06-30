var simple = require('simple');
var productfields = new simple.simplecontroler();

productfields.addfield = function()
{

   var mod = this.loadmodel('fields');
   var pf = this;
       mod.find({fieldname:this.req.postdata.fieldname},{_id:true,fieldname:true},{},false,function(fld){
          
           if(fld._id === undefined && pf.req.postdata._id == undefined){
           mod.addoredit(pf.req.postdata,function(doc)
           {
            
            
            productfields.jsonResp(doc);
            });
           }
           else if((pf.req.postdata._id !== undefined && fld._id === undefined) || (pf.req.postdata._id !== undefined && fld._id.toString() === pf.req.postdata._id))
           {
           mod.addoredit(pf.req.postdata,function(doc)
           {
            
            productfields.jsonResp(doc);
            });
           }
           else
             productfields.jsonResp({success:false, error:'DUPLICATE', message:'duplicate entry; already exist'});
           
       });
   
   
   
}

productfields.addgroup = function()
{
   var pfg = this; 
   var mod = this.loadmodel('fieldgroups');
   var regex = new RegExp(this.req.postdata.fieldgroupname,'i');
   mod.find({fieldgroupname:{$regex:regex}},{},{},false,function(doc)
   {
         
       if(doc.fieldgroupname === undefined)
        {
               mod.addgroup(pfg.req.postdata,function(doc)
              {
                productfields.jsonResp(doc);
              });
        }
        else{
              productfields.jsonResp({success:false, message:'DUPLICATE ENTRY', error:'DUPLICATE'});
        }
   }
   );
  
   
}

productfields.groupnames=function()
{
    var mod = this.loadmodel('fieldgroups');
    mod.findnames(function(doc){productfields.jsonResp(doc);});
}

productfields.addset = function()
{
  var mod = this.loadmodel('fieldgroups');
  mod.addfieldsets(this.req.postdata,function(res, doc){productfields.jsonResp(doc);})
  
}

productfields.findgroups = function()
{
      
   var mod = this.loadmodel('fieldgroups');
   mod.findall(function(doc)
   {
      productfields.jsonResp(doc);
   },true);
   
}

productfields.groupadd = function()
{
      
  this.loadview('addgroup');
   
}

productfields.findfields = function()
{
      
   var mod = this.loadmodel('fields');
   mod.findall(function(doc)
   {
      productfields.jsonResp(doc);
   },true);
   
}


productfields.index =  function()
{
      this.loadview('fields');
}
productfields.add =  function(id)
{
  
      if(id !== undefined)
      this.viewholder.id = id;
      this.loadview('addfields');
}

productfields.fieldgroups =  function()
{
      this.loadview('fieldgroups');
}
productfields.createfieldset =  function(id)
{     
      this.viewholder.groupid = id;
      
      this.loadview('fieldsets');
}

productfields.findgroupbyid= function(id)
{
  var groupmod =  this.loadmodel('fieldgroups');
  var gid =  groupmod.createObjectId(id); 
       
        groupmod.find({_id:gid},{},{},false,function(doc){
        productfields.jsonResp(doc);  
        
      });
}

productfields.findgroupbyname= function(name,nodef)
{
   var async = require('async');
       var groupmod =  this.loadmodel('fieldgroups');
       var fieldmod = this.loadmodel('fields');
        
        if(nodef === undefined)
          nodef ='0';
         
          var fldar= [];
          async.auto({
            group:function(callback)
            {  
              var docr=[];
               groupmod.find({fieldgroupname:name},{},{},false,function(doc){
                
                 for(var fset in doc.fieldsets){
                  
                   fldar.push(fset);
                 }
                 async.map(fldar, function(stname,cb)
                 {
                   var gpobj={};
                 async.map(doc.fieldsets[stname],
                 function(fieldid, callback)
                 {   
                    var id = fieldmod.createObjectId(fieldid);
                    callback(null,id);
                 },
                 function(err, fres)
                 {
                     
                     
                      var cat = {_id:{$in:fres}}
                      if(nodef === '1')
                        cat = {_id:{$in:fres}, scope:'website'}
                  
                     fieldmod.find(cat,{},{},true,function(flds){
                     gpobj.setname = stname;
                     gpobj.fields =flds;
                     cb(null,gpobj);
                    
                   });
                   
                 });
                 },
                 function(err,callbk)
                 {
                   callback(null,  callbk)
                 }
                 );
              
                 
               });
              
            
            }
          },
          
          function(err,res) 
          {
            productfields.jsonResp(res.group);
          }
          
          );
          
        
}

productfields.fieldbyid  = function(id)
{
   var fm =  this.loadmodel('fields');
  var fid =  fm.createObjectId(id); 
        
        fm.find({_id:fid},{},{},false,function(doc){
        productfields.jsonResp(doc);  
       
      });
}

productfields.getgroupcount = function()
  {
   
    var mod = this.loadmodel('fieldgroups');
    mod.recordcount(function(doc){productfields.jsonResp(doc);});
  }
  productfields.getgrouptable= function(limit,num)
  {
     var mod = this.loadmodel('fieldgroups');
     
      mod.page({},parseInt(limit), parseInt(num), {fieldgroupname:true}, function(r){productfields.jsonResp(r)});
  }
   productfields.getfieldtable= function(limit,num)
  {
     var mod = this.loadmodel('fields');
     
      mod.page({},parseInt(limit), parseInt(num), {fieldname:true, scope:true, fiedtype:true,}, function(r){productfields.jsonResp(r)});
  }
module.exports = productfields;