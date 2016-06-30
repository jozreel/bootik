var simple = require('simple');
var account = new simple.simplemodel();
account.modelname = 'account';

account.add = function(obj,callback)
{
	//console.log(obj);
	this.accountname= obj.accname; 
	this.accountno = obj.accno;
	this.accountdesc = obj.accdesc;
	this.accountcategory = obj.cat;
	this.master = obj.master;
	this.accounttype=obj.acctype;
	this.ismaster =obj.ismaster;
	if(obj.atype !== undefined)
	   this.accounttype =obj.atype;
	if(obj.ismaster === "false")
	   this.master =obj.master; 
	if(obj.event ==="A")
	   this.save(callback,'A');
	else if(obj.event ==="E")
	 this.modify(callback,'E');
	   
	console.log(obj);
}

account.debit =function(amount)
{
	try{
	if(this.accounttype === '1')
	{
		this.ballance = this.ballance +amount;
	}
	if(this.master !=null)
	{
		this.master.ballance  = this.master.ballance + amount;
	}
	}
     catch (error) {
		console.log(error);
	}
}

account.credit =function(amount)
{
	
	try
		{
	if(this.accounttype === '2')
	{
		
		this.ballance = this.ballance - amount;
		
	}
	if(this.master !=null)
	{
		this.master.ballance  = this.master.ballance + amount;
	}
	}
		catch(ex)
		{
			console.log(ex);
		}
}
account.findmaster = function(callback)
{
	try{
		console.log('callfind');
		
		this.find({ismaster:'true'},{},{},true,callback)
	}
	catch(exp)
	{
		console.log(exp);
	}
}

account.findaccount = function(callback)
{
	try{
		console.log('callfind');
		
		this.find({ismaster:'false'},{},{},true,callback);
	}
	catch(exp)
	{
		console.log(exp);
	}
}




module.exports = account;