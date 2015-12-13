var simple = require('simple');
var taxes = new simple.simplecontroler();
taxes.save = function()
{
	var mod = this.loadmodel('tax');
	console.log('christmass');
	mod.savetax(this.req.postdata,function(doc)
	{
		console.log(doc);
		taxes.jsonResp(doc);
	});
	
}
taxes.remove = function()
{
	var mod = this.loadmodel('tax');
	mod.delete(this.req.postdata.ids, function(doc){
	this.jsonResp(doc);	
	});
}
taxes.index = function()
{
	
	this.loadview('taxes');
}
taxes.getall = function()
{
	var mod = this.loadmodel('tax');
	mod.gettaxes(function(doc)
	{
		taxes.jsonResp(doc);
	});
}
taxes.taxdef = function()
{
	this.loadview('taxdef');
}
taxes.addglobal = function()
{
	var mod = this.loadmodel('taxdef');
	mod.global(this.req.postdata, function(doc)
	{
		taxes.jsonResp(doc);
	});
}
taxes.getdefinitions = function()
{
	var mod = this.loadmodel('taxdef');
	mod.findall(function(doc)
	{
		taxes.jsonResp(doc);
	},true);
}
module.exports = taxes;

