var simple = require('simple');
var category = new simple.simplemodel();
category.modelname = "category";

category.getbyroot = function(id,lan,callback)
{
    var rootid = this.createObjectId(id);
    this.find({rootcategory:rootid, 'formfields.language':lan},{formfields:{$elemMatch:{language:lan}},children:1,enabled:1},{},true,function(doc){
        callback(doc);
    });
}
category.add = function(obj,callback)
{ var md = this;
    var cobj = {};
    
    var objid;
  ;
    cobj.rootcategory = this.createObjectId(obj.rootcategory);
    cobj.enabled = obj.enabled!== undefined ? true :false;
    if(obj._id !== undefined)
    {
       objid = this.createObjectId(obj._id);
       
       
        
        
    }
    else
    {
      objid = md.createObjectId();
      
      
      
      cobj.children=[];
      
      cobj.formfields=[];
      
      cobj.formfields.push({language:obj.locale, name:obj.name, description:obj.description});
      //cobj.description.push(langu) = obj.description;
    }
    console.log(cobj, 'id',objid);
    this.updateOne({_id:objid},cobj,function(doc)
    {   
        if(obj._id!==undefined)
        { var tmpff ={language:obj.locale, name:obj.name, description:obj.description};
           
            
            md.find({_id:objid, "formfields.language":obj.locale},{_id:true},{},false,function(fa){
                
                if(Object.keys(fa).length >0)
                {
           
                  md.updateinarray({_id:objid, "formfields.language":obj.locale},{ "formfields.$" : tmpff} , function(rd){
                    if(obj.parentid !=='none')
                     {
                       var tmp=[];
                        tmp.push(objid);
                          var objectid = md.createObjectId(obj.parentid);
                           md.removefromarray({}, {children:objid},true,function(doc)
                           {
                                md.addtoarray({'_id':objectid}, tmp,'children',callback);
                           });
                          
        
       
                          }
                           else
                          {
                                callback(doc);
                          } 
                
                
                         });
                       }
                       else{
                           var tar = [];
                           tar.push(tmpff);
                           md.addtoarray({'_id':objid}, tar,'formfields',callback);}
                     });
            }
        else
        {      
        if(obj.parentid !=='none')
        {
        console.log(obj.parentid);
        var tmp=[];
        tmp.push(objid);
        var objectid = md.createObjectId(obj.parentid);
        
        md.addtoarray({'_id':objectid}, tmp,'children',callback);
        
       
        }
        else
        {
            callback(doc);
        }
        }
    },true);
}
module.exports = category;