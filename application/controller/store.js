var simple = require('simple');
var store = new simple.simplecontroler();
store.index = function()
{
	this.loadview('setup')
}
store.savemain= function()
{
	var mod = this.loadmodel('store');
	mod.main(this.req.postdata , function(doc)
	{
		store.jsonResp(doc);
	});
}
store.getmain = function()
{
	var mod = this.loadmodel('store');
	mod.findall(function(doc){store.jsonResp(doc)});
}
store.locations = function(storeid)
{
	this.viewholder.storeid = storeid;
	this.loadview('locations')
}
store.savelocation = function()
{
	
	var mod = this.loadmodel('store');
	mod.savelocation(this.req.postdata, function(doc){store.jsonResp(doc);});
}

store.getlocations= function()
{
	var mod = this.loadmodel('store');
	mod.findall(function(doc){store.jsonResp(doc.locations);});
}

store.addsroreview =function()
{
  var storedata  = this.req.postdata;
  var model = this.loadmodel('store');
  model.addStoreView(storedata,function(doc){store.jsonResp(doc);})
}
store.addsite = function()
{
    this.loadview('addsite');
}
store.getlocale = function()
{
   // console.log(this.req.headers['accept-language']);
    var st = this;
    var fs = require('fs');
    var cfg = simple.config;
    
    var locale = cfg.publicpath+'/static/locale.json';
   // console.log(locale);
    //var fdata = fs.readFileSync(locale,'utf-8');
    //this.res.end(fdata.toString());
   fs.readFile(locale,'utf-8', function(er,file)
    {
       // console.log(JSON.stringify(file.toString('ascii'),null,0));
        var str = file.toString();
        var obj = JSON.parse(str);
        var arr =[];
        for(var it in obj)
        {
          
          arr.push({code:it, name:obj[it]});
        }
        //st.res.end(file.toString());
       store.jsonResp(arr);
    }
    )
}
store.sitesave = function()
{
    var sitemod = this.loadmodel('sites');
    sitemod.add(this.req.postdata, function (doc) {
        store.jsonResp(doc);
    });
}
store.getstorelocales =function() {
    var sitemod = this.loadmodel('sites');
    sitemod.findall(function(doc)
    {
        store.jsonResp(doc);
    },true
    );
}
store.setdefaultsite = function()
{
    var mod = this.loadmodel('store');
    mod.setdefault(this.req.postdata, function(doc)
    {
       store.jsonResp(doc); 
    });
}
module.exports = store;