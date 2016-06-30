var common = function(){}

common.prototype.getheaderdetails = function(obj)
{
	
	obj.req.session.start();
	if(obj.req.session.get('login')=== 'true')
	{
		
		obj.viewholder.user = obj.req.session.get('username');
		obj.viewholder.useraction='<a class="plainlink" href ="/user/logout">Logout</a>';
	}
	else{
	obj.viewholder.user="Guest"
	obj.viewholder.useraction='<a class="plainlink" href ="/user/login">Login</a>';
	}
	
}
common.prototype.getstore = function(obj)
{
    obj.req.session.start();
     
    if(obj.req.session.get('defaultstore') !== '')
    {
      obj.viewholder.defaultstore = obj.req.session.get('defaultstore');
      obj.viewholder.defaultlang =  obj.req.session.get('defaultlocale');
    }
    else 
    {
        var st = obj.loadmodel('store');
        st.find({}, {_id:true,defaultlang:true},{},false, function(s)
        {
            
            obj.req.session.add('defaultstore', s._id.toString());
            obj.req.session.add('defaultlocale', s.defaultlang);
            obj.viewholder.defaultstore = s._id.toString();
            obj.viewholder.defaultlang = s.defaultlang;
        });
        
    }
}
module.exports= new common();

