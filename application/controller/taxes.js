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
module.exports = taxes;
