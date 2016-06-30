var simple = require('simple');
var store = new simple.simplemodel();
store.modelname = 'store';

store.main = function(obj, callback)
{ 
	delete this._id;
	if(obj.event == 'E')
	   this._id=obj._id;
	this.storename = obj.storename;
	this.maincurrency = obj.maincurrency;
	if(obj.event == 'A')
	 this.locations=[];
	this.save(callback, obj.event);
}
store.setdefault = function(obj,callback)
{   var sid = this.createObjectId(obj._id);
  
    this.updateOne({_id:sid},{defaultsite:obj.defaultsite,defaultlang:obj.defaultlang},function(doc)
    {
        callback(doc);
    },false
    );
}
store.savelocation= function(obj,callback)
{
	
	var st = {};
	var temp = [];
	    st.locationname = obj.locationname;
		st.currency = obj.currency;
		st.originbased= obj.originbased;
		st.country= obj.country;
		st.zipost = obj.zippost;
		st.state = obj.state;
		st.town = obj.town;
		st.street1 = obj.street1;
		st.street2 = obj.street2;
        st.rootcategory = obj.rootcategory;
	if(obj.event=== 'A')
	{
		
		this.insertcounters('locationid');
        var loc = this;
	 
	 this.generateNextSequence('locationid', function(next){
	  st.locationid=next.toString();
	  temp.push(st);
	  
	  var stid = loc.createObjectId(obj._id);
	   loc.pushtoarray({'_id':stid}, temp,'locations',callback);
	 });
	}
	if(obj.event === 'E')
	{  
		delete st.id;
		
		var stid = this.createObjectId(obj._id);
		st.locationid = obj.locationid;
		this.updateinarray({_id:stid, "locations.locationid":obj.locationid},{ "locations.$" : st} , callback);
	}
	
}


module.exports = store;