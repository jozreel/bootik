var simple = require('simple');
var user = new simple.simplecontroler();
user.login = function()
{
	if(!this.isencrypted())
	  {
		 
	   this.req.redirect.redirect('https://'+this.req.hostname+':4433/user/login');
	  }
	this.viewholder.title="user login";
	var v = this.loadview('login');
}

user.logout = function()
{
	this.req.session.end();
	this.req.redirect.redirect('https://'+this.req.hostname+':4433/user/login');
}

user.add = function()
{
	

	
	if(this.req.session.get('login'))
	{
	
	if(!this.isencrypted())
	  {
		 
	   this.req.redirect.redirect('https://'+this.req.hostname+':4433/user/add');
	  }
	this.viewholder.title="user registration";
	var v = this.loadview('add');
	}
	else{
		
		this.req.redirect.redirect('https://'+this.req.hostname+':4433/user/login');
	}
}

user.passdata = function()
{
	if(!this.isencrypted())
	  {
	    console.log('redir');
	   this.req.redirect.redirect('https://'+this.req.hostname+':4433/user/passdata');
	  }
	  else{
   
	if(this.req.postdata.password === this.req.postdata.passwordr)
	{
	var md= this.loadmodel('siteuser');
	this.req.postdata.password = this.req.secure.encrypt(this.req.postdata.password);
	this.req.postdata.passwordr = this.req.secure.encrypt(this.req.postdata.passwordr)
   
	md.sendtodb(this.req.postdata, function(r){console.log(r);  user.jsonResp(r)})
	   }
	   else
	   {
		   this.jsonResp({success:false, error:'password not match'});
	   }
	  }
}

user.auth=function()
{


var usr= this;	
 var pass = this.req.secure.encrypt(this.req.postdata.password);
 var md= this.loadmodel('siteuser');
 this.req.postdata.password = pass;

 md.finduser(this.req.postdata, function(res)
 { 	 var iusr = (res[0]);
	 
	 if(iusr !== undefined && iusr.userid !== undefined)
	 {
		  usr.req.session.expmins = 20;
		  usr.req.session.set('login', 'true');
		  usr.req.session.set('username', iusr.username);
		  if(iusr.group!==undefined)
		   usr.req.session.set('group',iusr.group);
		  if(iusr.group	 === "user")
		    usr.req.session.set('cart', '[]');
		   usr.req.session.create();
		  usr.req.redirect.redirect('http://'+usr.req.hostname+':1337/admin');
		  
	 }
	 else
	 {
		console.log('error');
		usr.jsonResp({sucess:false, error:'Sign in error check your credentials'});
	 }
 });

	
}

user.landingpage = function()
{
	
}
user.userdetails = function()
{
	if(this.req.session.get('login') ==='true')
	{
		console.log('req');
		user.jsonResp({user:this.req.session.get('username'), action:'<a class="plainlink" href ="/user/logout">Logout</a>'});
	}
	else
	{
		console.log('guest');
	   user.jsonResp({user:'Guest', action:'<a class="plainlink" href ="/user/login">Login</a>'});
	}
}

module.exports = user;
