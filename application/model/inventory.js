var simple = require('simple');
var inventory = new simple.simplemodel();
inventory.modelname= 'inventory';
inventory.add = function(obj,callback)
{
 
  inventory.name= obj.name;
  inventory.sku=obj.sku;
 
  inventory.desc=obj.desc;
  inventory.cat=obj.cat;
  
  inventory.manu=obj.manu;
  inventory.model=obj.model;
  inventory.unit =obj.unit;
  inventory.uprice=obj.uprice;
  inventory.serial=obj.serial;
  inventory.instore= obj.instore
  if(obj.taxdef !== undefined)
  {
    inventory.taxdef = obj.taxdef;
  }
  if(obj.image !== undefined && this.checksendtogrid(obj.image.size))
  {
   
     inventory.image = {};
     inventory.image.type= obj.image.type;
     inventory.image.size= obj.image.size;
     inventory.image.alt= obj.image.alt;
     inventory.image.filename = obj.image.fiilename;
     this.gridsave(obj.image.imagedata, inventory,callback,'A');
  }
  else
  {
   if(obj.image !== undefined)
   {
    var img = inventory.checkencoded(obj.image.imagedata);
    
     console.log('jbjkbjk');
   
      obj.image.imagedata = img;
      inventory.image = obj.image;
   }
   this.save(callback,'A');
  }
   
  

}
inventory.modify = function(obj,callback)
{
 
  inventory._id="";
  if(obj.image === undefined && inventory.image !== undefined)
  {
    delete inventory.image;
  }
  inventory.name= obj.name;
  inventory._id = obj._id;
  inventory.sku=obj.sku;
   inventory.cat=obj.cat;
   inventory.unit =obj.unit;
  //console.log('image',obj.image );
 // if(obj.image !==undefined)
   //  inventory.image= obj.image;
  //console.log(decodeURIComponent(obj.desc));
  inventory.desc=obj.desc;
  inventory.longdesc= obj.longdesc;
  inventory.manu=obj.manu;
  inventory.model=obj.model;
  inventory.uprice=obj.uprice;
  inventory.serial=obj.serial;
  inventory.instore= obj.instore
  if(obj.taxdef !== undefined)
  {
    inventory.taxdef = obj.taxdef;
  }
  
  if(obj.image !== undefined && this.checksendtogrid(obj.image.size))
  {
     inventory.image = {};
     inventory.image.type= obj.image.type;
     inventory.image.size= obj.image.size;
     inventory.image.alt= obj.image.alt;
     inventory.image.filename = obj.image.fiilename;
     this.gridsave(obj.image.imagedata, inventory,callback,'A');
  }
  else
  {
   if(obj.image !== undefined)
   {
    var img = inventory.checkencoded(obj.image.imagedata);
    
   
   
      obj.image.imagedata = img;
      inventory.image = obj.image;
   }
      //console.log(inventory.image);
      this.save(callback, 'E');
  }
}
inventory.convertImagesToBase64 = function(doc1)
{
   for(var docs in doc1)
  {
    
    if(doc1[docs].image !== undefined)
    {
      
       doc1[docs].image.imagedata =inventory.convertobase64(doc1[docs].image.imagedata);
    
    }
  }
}
inventory.getAll = function(callback)
{
 // console.log('hi');
 this.findall(function(doc)
 {
   
  var doc1 = inventory.decodeallValues(doc);

    inventory.convertImagesToBase64(doc1);
   callback(doc1);
 },true);
}

inventory.search=function(txt, callback)
{

  this.searchword(txt,
  function(docs){
   var doc1 = inventory.decodeallValues(docs);
  inventory.convertImagesToBase64(doc1);

  callback(doc1);
  },true)
}
inventory.removeinv = function(obj, callback)
{
  this._id = obj._id;
  this.deleteone(callback);
}
inventory.paginate = function(limit,last,fields,callback)
{
  

  var options = {"limit":limit, "skip":last};
 
  this.find({instore:'true'},fields,options,true,function(doc)
  {
     
     var decd = inventory.decodeallValues(doc);
      
      inventory.convertImagesToBase64(decd);
      callback(decd);
      
  });
}
 
 inventory.ptable = function(limit,last,fields,callback)
{
  

  var options = {"limit":limit, "skip":last};
 
  this.find({},fields,options,true,function(doc)
  {
     
     var decd = inventory.decodeallValues(doc);
      
      inventory.convertImagesToBase64(decd);
      callback(decd);
      
  });
  
  
}
module.exports= inventory;