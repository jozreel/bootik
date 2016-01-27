//function to enable disabled form fields in tabled forms
  
   function enableedit(event,callback)
    {
      
         var parent = event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
       
        togleForms();
      
       parent.querySelector('.save').disabled = false;
      
       sajax().disableFields(false,  parent.querySelector('.formsr'));
        
       var cl =parent.querySelector('.save').classList;
       cl.remove('disabled');
       if(typeof callback === 'function')
        callback(event);
       return false;
       
          
    }
    
    function togleForms()
    {
      var ele = document.querySelector('.pmaterial');
    
       var forms =  ele.querySelectorAll('.formsr');
     for(var form in forms)
             {
              
              if(forms[form].className = 'formsr');
               sajax().disableFields(true,forms[form]);
             }
    }
    
    
    //function to save changes in table forms
   
     function edititem(event,callback)
    {
       var parent = event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
      
        
         
        var mod = parent.querySelector('form').serialize();
        
        callback('E', mod);
         
          return false;
    }

  function generalFormSave(model,ev, ajpid,formid, url,callback)
  {
   
      //document.querySelector('#spin').active=true;
       var mod ={}
      
       if(model === '')
        {
            mod= document.getElementById(formid).serialize();
        }
        else
        {
           mod = model;
        }
         
        document.getElementById(ajpid).submit=false;
        mod.event = ev;
        
        document.getElementById(ajpid).jsonurl = url;
        document.getElementById(ajpid).jsonstring = JSON.stringify(mod);
        document.getElementById(ajpid).respfunc= callback
       
         document.getElementById(ajpid).submit=true;
       return false;
    
  }

//functions for rendering shipping destination page


 function enableCountry()
 {
    document.getElementById('clist').disabled =false;
 }
function setCountry(event)
{
  var parent = event.target.parentNode.parentNode.parentNode.parentNode;
   document.getElementById('clist').selectedName =parent.querySelector('.dc').value;
   document.getElementById('clist').disabled =true;
}
  
 
  function makeTaxable(event)
  {
    var parentDiv=  event.target.parentNode;
    console.log(parentDiv);
    if(event.target.checked)
    {
      
      parentDiv.querySelector('input[name="destinationtax"]').disabled= false;
    }
    else
       parentDiv.querySelector('input[name="destinationtax"]').disabled= true;
  }
  
    
  
   function getDestinations()
   {
     document.querySelector('#spin').style.display="block";
      document.querySelector('#spin').active=true;
     document.querySelector('#regs').respfunc= function(doc)
     {
        document.getElementById('hidentable').innerHTML="";
        var countrylist = [];
        for(var dest in doc)
        {
          countrylist.push(doc[dest].country);
          
          // dv.innerHTML
          
             
            for(var de in doc[dest].destinations)
            {
               var dv = document.createElement('div');
               dv.className ="tbl4";
             var d = doc[dest].destinations[de];
            dv.innerHTML = '<form  is="iron-form" method="post" class="formsr" action="#"><div> <input class="longtext" required name="destinationname" type="text" value="'+d.destinationname+'" /> </div>'+
            '<div><input required name="destinationrate" type="number" class="shortcode" value="'+d.shippingrate+'" /><input  name="_id" type="hidden" value="'+doc[dest]._id+'" /> </div>'+
            '<div> <input  name="destinationtax" type="number" class="shortcode" step="0.01" min="0" max="1" value="'+d.destinationtax+'" /><input  name="destinationid" type="hidden" value="'+d.destinationid+'" /> </div>'+ 
             '<input  class="dc" type="hidden" value="'+doc[dest].country.code+'" />'+
             '<div> <input required name="estimateddelivery" type="number"  class="shortcode" value="'+d.estimateddelivery+'" />'+
             '<span class="right">'+
             '<button disabled class="disabled save" title="Save Region" onclick="return savechanges(event)" ><img src="/image/save.png" /> </button>'+
             '<button title="Delete Country" onclick="return deleteDest(event)"><img src="/image/trash.png" /></button>'+
              '<button title="Edit Item" onclick="return enableedit(event,setCountry)" class="edit"><img src="/image/edit.png"/></button></span></div> </form>';
             document.getElementById('hidentable').appendChild(dv);
            }
            
         
        } 
        var ele = document.querySelector('.pmaterial');
        var forms =  ele.querySelectorAll('.formsr');
             for(var form in forms)
             {
              
              if(forms[form].className = 'formsr');
               sajax().disableFields(true,forms[form]);
             }
             
        
         document.querySelector('#clist').menuItems = countrylist; 
         document.querySelector('.pmaterial').style.opacity=0.9;
        document.querySelector('#spin').active=false;
        document.querySelector('#spin').style.display="none";
         
     }
  
     document.querySelector('#regs').dataurl = "";
     document.querySelector('#regs').dataurl = "/shipping/getdestinations";  
    
   }
   
  function  savechanges(event)
  {
    edititem(event, function(ev, model)
    {
      
       saveDestination(ev,model)
    }
    );
    return false;
  }
   
   
   
   function saveDestination(ev,model,parent)
   {
  //   console.log(document.querySelector('#clist').selectedValue ===);
    if(document.querySelector('#clist').selectedValue === undefined)
    {   document.getElementById('error').innerHTML="Missing fields please filll all required fields";
         document.getElementById('error').style.opacity= '0.7';
       //document.querySelector('#clist').style.border ="1px solid red";
       return;
    }
    document.querySelector('#clist').style.border='none';
      var mod ={}
            if(ev ==='A')
            {
                  mod= document.getElementById("rform").serialize();
                  var v = document.getElementById("rform").validate();
                 if(!v)
                 {
                    document.getElementById('error').innerHTML="Missing fields please filll all required fields";
                     document.getElementById('error').style.opacity= '0.7';
                    return;
                 }
            }
            if(ev ==='E')
                mod= model;
        
        
        document.getElementById('rac').submit=false;
        if(document.querySelector('#clist').selectedValue !==null)
           mod.countrycode =document.querySelector('#clist').selectedValue.code;
           mod.event = ev;
        document.getElementById('rac').jsonurl = "/shipping/adddestination";
        document.getElementById('rac').jsonstring = JSON.stringify(mod);
       
        document.querySelector('#rac').respfunc=function(doc) {
         getDestinations();
       
           resp(doc,document.getElementById("ptoast")); 
        };
      
     //  document.getElementById('rac').submit=true;
       return false;
   }
   
   function deleteDest(event)
   {
     document.getElementById('pd').open();
     document.getElementById('deleteAccept').onclick = function()
     {
       document.getElementById('rac').submit=false;
     var parent = event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
      var obj = {};
      obj.id= parent.querySelector('input[name="_id"]').value;
      obj.did= parent.querySelector('input[name="destinationid"]').value;
         document.getElementById('rac').jsonurl = "/shipping/removedestination";
        document.getElementById('rac').jsonstring = JSON.stringify(obj);
       
        document.querySelector('#rac').respfunc=function(doc) {
         // populatezones();
            getDestinations();
           resp(doc,document.getElementById("ptoast")); 
           
        };
       
       document.getElementById('rac').submit=true;
       
     }
     return false;
   }
   
   //end Destintion functions
   
   
   //shipping zones functions
   
    function callsaveZone(event)
    {
       return generalFormSave('','A','rac','rform','/shipping/savezone',function(doc)
       {
           populatezones();
         
          
           resp(doc,document.getElementById("ptoast")); 
       });
    }
    
     function populatezones()
   {
    
      document.querySelector('#regs').respfunc = function(doc)
        { 
          
          
         document.getElementById('hidentable').innerHTML = '';
         
           if(doc[0].success == false)
           {
              document.querySelector('.pmaterial').style.opacity=0.9;  
             document.querySelector('#spin').active=false;
              return;
           }
            for(var item in doc)
            {
           
             var dv = document.createElement('div');
             dv.className ="tbl2";
            
            dv.innerHTML = '<form  is="iron-form" method="post" class="formsr" action="#">'+
            '<div> <input class="longtext" name="zonename" value="'+doc[item].zonename+'" /> <input type="hidden"  name="_id" value="'+doc[item]._id+'" />'+
            '</div>'+ 
              
              '<div><input class="longtext"  name="zonedescription" value="'+doc[item].zonedescription+'" />'+
               '<span class="right"><button disabled class="disabled save" title="Save Zone" onclick="return saveZoneChanges(event)" ><img src="/image/save.png" /> <button title="Delete Zone" onclick="return deleteZone(event)"><img src="/image/trash.png" /></button>'+
              '<button title="Edit Item" onclick="return enableedit(event)" class="edit"><img src="/image/edit.png"/></button></span></div></form>';
             //console.log(dv.querySelector('.loc'));       
             document.getElementById('hidentable').appendChild(dv);
            
             
            }
             var ele = document.querySelector('.pmaterial');
             var forms =  ele.querySelectorAll('.formsr');
             for(var form in forms)
             {
              
              if(forms[form].className = 'formsr');
               sajax().disableFields(true,forms[form]);
             }
             
             
             document.querySelector('.pmaterial').style.opacity=0.9;  
             document.querySelector('#spin').active=false;
          
            
        }
         document.querySelector('#regs').dataurl = "";
        document.querySelector('#regs').dataurl = "/shipping/findzones";
      
   
        
    }
    
    function saveZoneChanges(event)
    {
       edititem(event, function(ev, model)
        {
      
          generalFormSave(model,ev,'rac','rform','/shipping/savezone',function(doc)
          {
            populatezones();
            resp(doc,document.getElementById("ptoast"));
            
          });
        }
       );
       return false;
    }
    
     function deleteZone(event)
    { var obj ={};
       document.getElementById('pd').open();
       document.getElementById('deleteAccept').onclick = function()
       {
          var parent = event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
         obj.id= parent.querySelector('input[name="_id"]').value;
         document.getElementById('rac').jsonstring = JSON.stringify(obj);
         document.getElementById('rac').jsonurl = "/shipping/removezone";
        document.querySelector('#rac').respfunc=function(doc) {
          populatezones(); 
          resp(doc,document.getElementById("ptoast")); 
           
        };
       
       document.getElementById('rac').submit=true;
       
        
       }
      gevent = event;
      return false;

       
    }
    
    