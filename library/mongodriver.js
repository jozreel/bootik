
var DB = require('mongodb').Db;

var mongodriver =function()
{
 
 this.MongoClient = require('mongodb').MongoClient;
 this.Server =  require('mongodb').Server;
 this.assert = require('assert');
 this.db = 'mongosb';
 this.connectionString = 'mongodb://dbuser:passwd@10.0.3.159:27017/bootik'; //abuild from config;
}
  mongodriver.prototype.crudConnet = function(){ 
	var db =new DB('bootik', new Server('localhost', 27017));
  // Establish connection to db
  db.open(function(err, db) {
    assert.equal(null, err);

    // Add a user to the database
    db.addUser('jozreel', 'pass', {roles:[
         { role: "readWrite", db: "bootik" },
         { role: "read", db: "products" },
         { role: "read", db: "sales" },
         { role: "readWrite", db: "accounts" }]},function(err, result) {
      assert.equal(null, err);

      // Authenticate
      db.authenticate('jozreel', 'pass', function(err, result) {
        assert.equal(true, result);

        // Logout the db
        db.logout(function(err, result) {
          assert.equal(true, result);

          // Remove the user
          db.removeUser('jozreel', function(err, result) {
            assert.equal(true, result);

            db.close();
          });
        });
      });
    });
  });
}

//b = new Mongo().getDB("myDatabase");
mongodriver.prototype.connect =function(){
  var obj = this;
  var db =new DB('bootik', new this.Server('10.0.3.159', 27017));
  db.open(function(err,db)
  {
    if(err)
      console.log(err);
  });
  
  
/*MongoClient.connect("mongodb://dbuser:passwd@localhost:27017/bootik", function(err,db)
{
	if(err)
	   console.log(err);
  obj.db=db;

	var collection = db.collection('test');
	 var user1 = {name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']};
   // var user2 = {name: 'modulus user', age: 22, roles: ['user']};
   // var user3 = {name: 'modulus super admin', age: 92, roles: ['super-admin', 'admin', 'moderator', 'user']};
   collection.insert([user1], function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
      }
	   db.close();
   });
      //Close connection
     // db.close();
     
}
);	*/
}



mongodriver.prototype.removeone = function(cat, callback)
{
  var res = {};
  res.success=true;
  var obj1 = this;
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
   if(err)
       throw err;
    var collection = db.collection(obj1.modelname);
    collection.deleteOne(
      cat,
      function(err, results) {
        try{
        if(err)
        {
           console.log(err)
           res.error = err;
           res.success = false;
        }
         console.log(results);
         res.results = results;
         callback(res);
        }
        catch(error){console.log(error);}
      }
   );
  }
  );
  
}

mongodriver.prototype.insert = function(obj,callback)
{
  //console.log(typeof callback);
  var obj1 = this;
  //console.log(this.MongoClient);
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
    var res ={};
    res.success = true;
    if(err)
      console.log(err)
      //console.log(obj);
      var collection = db.collection(obj1.modelname);
      collection.insertOne(obj,{w:1}, function(err, result){
        
        if(err)
        {
           res.success = false;
           res.error=err;
        }
         db.close();
         if (callback && typeof(callback) == "function")  
              callback(res);
           
      });
    
  }
  );
}

mongodriver.prototype.createObjectId =function(id)
{
  var Objectid = require('mongodb').ObjectID;
  var id = new Objectid(id);
  return id;
}

mongodriver.prototype.updateOne =function(cat, vals, callback)
{var obj1 =this;

  var res = {};
  res.success=true;
 //console.log(cat);
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
    if(err)
    {
      console.log(err);
      res.error=err;
      res.success=false;
    }
       
      var collection = db.collection(obj1.modelname);
      console.log(obj1.modelname);
     // console.log(vals);
      collection.updateOne(cat, {$set: vals, $currentDate: { "lastModified": true }},{w:1}, function(err,result)
      {
        if(err)
          console.log(err);
          db.close();
          if (callback && typeof(callback) == "function")  
              callback(res);
      }
      );
  });
}


mongodriver.prototype.updateMany =function(cat, vals)
{var obj1 =this;
 //console.log(cat);
   this.MongoClient.connect(this.connectionString, function(err, db)
  {
    if(err)
      console.log(err)
      //console.log(obj);
      var collection = db.collection(obj1.modelname);
      collection.updateMany(cat, {$set: vals, $currentDate: { "lastModified": true }},{w:1}, function(err,result)
      {
        if(err)
          console.log(err);
          db.close();
      }
      );
  });
}
mongodriver.prototype.replace=function(id, rep)
{
  var obj1 = this;
  this.mongoClient.connect(this.connectionString, function(err, db)
  {
    if(err)
        throw err;
     var collection = db.collection(obj1.modelname);
     collection.replaceOne({'_id':id}, rep,{w:1}, function(err ,result) {
       if(err)
         console.log(err);
         db.close();
     })
  });
  
}


mongodriver.prototype.savetogrid = function(filebuff,fdata,callback)
{
  //console.log(callback);
  var Buffer = require('buffer');
  var gd = require('mongodb').Grid;
  //console.log(gd);
  var obj1=this;
  //this.MongoClient
 
 var Grid = require('mongodb').GridStore
 //console.log(Grid);
 this.MongoClient.connect(this.connectionString, function(err, db)
  {
    
    //console.log(Buffer);
    if(err)
        throw err;
    var ObjectId = require('mongodb').ObjectID;
    var fileId = new ObjectId();
   // console.log(fileId);
  ///  console.log(fdata);
    //var grid = new Grid(db,fileId,'w',{root:'fs'});
    var grid = new Grid(db,fileId,fdata.filename,'w',{root:'fs', content_type:fdata.type, metadata:fdata});
    grid.chunkSize = 1024 * 256;
   // console.log(grid);
    grid.open(function(err, grid) {
     var Step = require('step');
     Step(
       
       function writeData() {
         var group = this.group();
      var length = filebuff.length;
     // console.log(filebuff);
    //var buff = new Buffer(length);
    // buff.write(filebuff,0);
    // for(var i = 0; i < length; i += ) {
       grid.write(filebuff, group());
    // }
   },

   function doneWithWrite(vdd) {
    // var res={};
    // res.sucess= true;
   // console.log(vdd);
     grid.close(function(err, result) {
       if(err)
       {
         var res={};
         res.sucess= false;
         res.error = err;
          callback(res);
          db.close();
       }
       else
       {
       console.log("File has been written to GridFS",result);
       // db.close();
        //var collection = db.collection(obj1.modelname);
        fdata.gridid = result._id;
        
        obj1.insert(fdata,callback);
       // console.log(fdata);
        db.close();
       }
        
        
        
     });
     
   }
 )
});
  });
}

mongodriver.prototype.streamfromgrid =function(fileid, callback, bulk)
{
 var Buffer = require('buffer');
  
  var obj1=this;
  //this.MongoClient
 
 var Grid = require('mongodb').GridStore
  var ObjectId = require('mongodb').ObjectID;
   // var fid =
   
 //console.log(Grid);
 this.MongoClient.connect(this.connectionString, function(err, db)
  {
   if(err)
   {
     console.log(err);
   }
   else{
   var grid = new Grid(db, new ObjectId(fileid),'r');
   
    grid.open(function(err,gs)
    {
    if(err)
    {
      console.log(err);
    }
    else
    {
      
      var stream = gs.stream(true);
      //console.log(stream);
      Grid.exist(db, new ObjectId(fileid), function(err, result) {
        if(err)
        {
          console.log(err,'');
        }
        else
        {
        // console.log(result,'exist');
        stream.on("data", function(chunk){
         //console.log('jojo');
          //console.log(chunk.toString());
          callback(chunk,false,false);
        });
     
      stream.on('end', function()
      {
       console.log('end');
        callback(null, true,false)
      });
       stream.on('close', function(data)
      {
        console.log('closed');
         callback(null, true,true)
        db.close();
       
      });
        
      }
      });
      }

      
    }
    );
    }
  }
  );

}


mongodriver.prototype.pipefromgrid =function(fileid, res)
{
 
  console.log('piping');
 var Grid = require('mongodb').GridStore
  var ObjectId = require('mongodb').ObjectID;
 
 this.MongoClient.connect(this.connectionString, function(err, db)
  {
   if(err)
   {
     console.log(err);
   }
   else{
   var grid = new Grid(db, new ObjectId(fileid),'r');
   
    grid.open(function(err,gs)
    {
    if(err)
    {
      console.log(err);
    }
    else
    {
      
      var stream = gs.stream(true);
      //.log(res);
      Grid.exist(db, new ObjectId(fileid), function(err, result) {
        if(err)
        {
          console.log(err,'');
        }
        else
        {
         
          decodeURI(stream.pipe(res));
         // res.end();
        }
        });

      
    }
    });
  }
  }
 );
}

mongodriver.prototype.streamt=function(fileid)
{
 
  var Buffer = require('buffer');
  
  var obj1=this;
  //this.MongoClient
 
 var Grid = require('mongodb').GridStore
  var ObjectId = require('mongodb').ObjectID;
   // var fid =
   
 //console.log(Grid);
 this.MongoClient.connect(this.connectionString, function(err, db)
  {
   if(err)
    console.log(err);
   else
   {

      //var gridStore = new GridStore(db, new ObjectId(fileid), "w");
       Grid.read(db, new ObjectId(fileid), function(err, fileData) {
         // assert.equal(data.length, fileData.length);
         if(err)
         {
           console.log(err);
         }
         else{
         console.log(fileData.toString());
          db.close();
         }
        });
   }
  }
 );
  
}


mongodriver.prototype.getfromgrid = function(fileid, callback)
{
  var Grid = require('mongodb').Grid;
   var grid = new Grid(db, 'fs');
    
    grid.get(fileid, function(err, data) {
     callback(decodeURI(data));
  });
}



mongodriver.prototype.find = function(cond,opt, coll,callback)
{
  //console.log(cond);
  var obj = this;
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
   if(err)
       throw err;
   // console.log(opt);
    var collection = db.collection(obj.modelname);
    if(opt!==null)
    {
        collection.find(cond,opt).count(function(err,count){ 
          if(err)
            {
              throw err;
              console.log(err);
            }
          if(count >0){
             var cursor = collection.find(cond,opt);  
            // db.close();
             obj.traverseCursor(cursor,db, callback,count,coll);
             } 
             else
             {   db.close();
                 callback({});
             }
        });
    }
     else if(opt===null)
     {
        collection.find(cond).count(function(err,count){ 
          if(count >0){
            
            var cursor = collection.find(cond);  obj.traverseCursor(cursor,db, callback,count,coll);
            }
             else 
             { 
               callback({});
              }
         });
     }
  }
  );
  
}



mongodriver.prototype.findall = function(callback,coll)
{
  
  var obj = this;
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
    
    if(err)
    {
      
      console.log(err);
      callback([{success:false, error:err}]);
    }
    var collection = db.collection(obj.modelname);
    collection.find().count(function(err,count){
      if(err)
      {
       
        throw err;
        console.log(err);
      }
      if(count > 0)
      {
       var cussor = collection.find();
       
       
       obj.traverseCursor(cussor,db, callback,count,coll);
      }
      else
      {    
      callback([{success:false, error:'Empty set'}]);
      }
     
    });
  //  this.assert.equal(err,null)
   // obj.traverseCursor(cussor,db, callback);
    //callback(cussor);
    
  }
  );
  
}


mongodriver.prototype.test = function()
{
    
}
//mongoDbDriver.prototype.save(obj)

mongodriver.prototype.getDb = function()
{
  //console.log(this.db);
  return this.db;
}
mongodriver.prototype.close = function()
{
  this.db.close();
}



mongodriver.prototype.traverseCursor =function(cursor,db, callback,count,coll)
 {
	 var obj=this;
   var itter = 0;
  var tmparr =[];
  if(count===0)
  {
    callback({error:true,message:"empty"});
  }
  else{
	 cursor.each(function(err, doc) {
      obj.assert.equal(err, null);
	  if(doc!==null)
	  {
    
       itter++;
       if(coll === true)
       {
         //console.log(doc);
         
         tmparr.push(doc);
         if(itter == count)
         {
            db.close();  
            
            callback(tmparr);
            
         }
       
       }
       else
       {
        callback(doc,count,itter);
       }
    // 
		 
	  }
	 }
  
	 );
  }
   if(itter == count)
      db.close();
    //console.log('door');
     
 }
 
 mongodriver.prototype.searchword =function(needle, callback, batch)
{
   var res = Array();
   var ids = Array();
  // var itter = 0;
   var obj = this;
   
   if(needle !== undefined)
   {
   this.findall(function(doc, count,itter){
     try{
      for(var indx in doc)
      {
         
         if(typeof doc[indx] === 'string')
           {
              if(doc[indx].toLowerCase().match(new RegExp(needle.toLowerCase()),"i") !==null)
              {
                
            
                if(batch)
                {
                if(ids.lastIndexOf(doc['_id']) === -1)
                   {
                      
                     // console.log((doc[indx].search(new RegExp(needle,"i"))),doc[indx]);
                       res.push(doc);
                       ids.push(doc['_id']);
                       //console.log(res);
                       break;
                   }
                }
                else
                {
                  callback(doc);
                  break;
                }
              }
           }
        
      }
      if(batch && itter === count)
      {
       
         callback(res);
      }
     }
     catch(err)
     {
       if(err)
         console.log(err);
     }
   },false);
   }
   else{
    this.findall(callback, true)
   }
}
mongodriver.prototype.findandupdate  =function(lookup, obj,callback)
{
  var res = {};
  res.success=true;
   this.MongoClient.connect(this.connectionString, function(err, db)
  {
    if(err)
     {
      console.log(err);
      res.success=false;
      res.error = err;
     }
    try{

     var collection = db.collection('counters');
     collection.findAndModify(
       
       {_id:lookup},
       [['_id','asc']],
       {$set:obj},
       {new:true},
       function(err, object){
         try{
           console.log(err);
           callback(object.value, res);
         }
         catch(error)
         {
           console.log(error);
           res.success=false;
           res.error = err;
         }
         
         }
     );
     // console.log(ret.seq);
     
    }
    catch(err){
      console.log(err);
      res.success=false;
      res.error = err;
    }
  });
}
mongodriver.prototype.generateNextSequence = function(lookup, callback)
{
  var obj = this;
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
    if(err)
      console.log(err);
    try{

     var collection = db.collection('counters');
     collection.findAndModify(
       
       {_id:lookup},
       [['_id','asc']],
       {$inc:{seq:1}},
       {new:true},
       function(err, object){
         try{
           if(err)
            console.log(err);
           callback(object.value.seq);
         }
         catch(error)
         {
           console.log(error);
         }
         
         }
     );
     // console.log(ret.seq);
     
    }
    catch(err){
      console.log(err);
    }
  });
}

mongodriver.prototype.insertcounters=function(counterid)
{
  this.MongoClient.connect(this.connectionString, function(err, db)
  {
     try{
    if(err)
     console.log(err);
     var collection = db.collection('counters');
       collection.insert({_id:counterid, seq:0});
     }
     catch(err)
     {
       console.log(err);
     }
  }
  );
  
}
mongodriver.prototype.getMappedObject = function(obj)
{
   var temp = {};
   for(var key in obj)
   {
      temp.key = o= obj[key];
      
   }
   return temp;
}
 


module.exports =  mongodriver;

