var simple = require('simple');
var journal = new simple.simplecontroler();

journal.addentry= function()
{
	var obj = this.req.postdata;
	if(obj!==null || obj !=undefined)
	{
		var mod= this.loadloadmodel('journal');
		mod.save(obj, function(r){
			journal.jsonResp(r);
		});
	}
}
module.exports = journal;