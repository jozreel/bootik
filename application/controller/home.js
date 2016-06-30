var simple = require('simple');
var home = new simple.simplecontroler();

home.index = function()
{
	var common = require('./common');
	
	common.getheaderdetails(this);
	if(! this.req.session.get('login')===true)
	{
     
	this.req.session.set('user','guest');
	 this.req.session.expmins=20;
     this.req.session.set('cart', '{"count":0 ,"items":[]}');
    if(!this.req.session.isset)
	   this.req.session.create();
	}
	//this.loadviewpart('header');
	//this.loadviewpart('footer');
	//this.showviews({dyn:'', title:"lang patat"}, this.res);
	
	this.loadview('home', 'clientlayout');
}

home.test = function()
{
    this.loadview('mlab');
}

home.ts = function()
{
    console.log(this.req.postdata);
}

module.exports = home;