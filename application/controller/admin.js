var simple = require('simple');
var admin= new simple.simplecontroler();

  admin.index =function()
	{	

	  this.loadview('admin');
	  
	}
	
module.exports = admin;