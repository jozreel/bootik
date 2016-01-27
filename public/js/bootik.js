function disableForm(fid, boolval)
{
  var elms =['paper-radio-group','fieldset','div'];
  if(typeof fid ==='string')
     var fm = document.getElementById(fid);
  else fm=fid;
  fm.disabled = boolval;
 
  var arch = fm.childNodes;
 // console.log(arch);
 var i=1;
  for(var it in arch)
   {
     
     if(arch[it].tagName !== undefined)
     {
     if(elms.indexOf(arch[it].tagName.toLowerCase()) != -1)
        {
          
          disableForm(arch[it])
        }
      console.log(arch[it].tagName)
      arch[it].disabled=boolval;
        
   }
   }
}


function resp(str,elem)
{
   
   if(str.success===true)
       elem.innerHTML ='<p style="color:green;">Sucess item added</p>';
     else
       elem.innerHTML =str.message;
       elem.style.color = "red";
   elem.show();
   sajax('form').clearForm();
}

function setEvent(ev)
{
  document.getElementById('ev').value=ev;
  disableForm('form', false);
}

function deleteobj(apaser)
{
  
    //apaser.jsonstring = jstring;
        apaser.rspelement  = document.getElementById("ptoast");
        
         apaser.respfunc=resp;
         apaser.submit=true;
        // console.log(apaser.jsonstring);
  //apaser.
}
 function toHTML(txt)
 {
  return txt.replace(/<([^<>]+\/?)>/g,'<br />&lt;$1&gt;<br />').
         replace(/<(\/[a-zA-Z]+(\-?[a-zA-Z]+)?)>/g,'<br />&lt;$1&gt;').
         replace(/"/g,'&quot;');
 }
 
 function rplacetags(str)
 {
   str.replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
 }
 function removetags(str)
 {
   return str.replace(/(<[^<>]+>)/g,'')
 }
 
 
 function search(e,url)
   {
   
       e = e || window.event;
        if (e.keyCode == 13)
        {
          
           var val = encodeURI(document.querySelector('#search').value);
          
          
           var lst = document.getElementById('idd');
       
           
           
             lst.dataUrl =  url+val;
           
           
           
          
         //  return false;
        }
       // return true;
   }
  function displaySearch()
   {
     var search = document.getElementById("search");
     search.style.display = "inline-block";
   }
 
 
   function scrollHandler(element,functionCall)
   {
     
      element.onscroll =function(event){
     var scroller = event.target;
     
    if (scroller.clientHeight + scroller.scrollTop  === scroller.scrollHeight)
    {     //alert('lplpl')
          //element.scroller.style.overflow = "hidden";
          
          functionCall();
    }
           
     
    
   
    // console.log(document.documentElement.clientHeight);
    
    }
   }
 
 
 
 
 //// shopping cart functions
 
 
   function updatecart(event)
  {
     document.querySelector('#updatecart').submit=false;
    document.querySelector('#updatecart').respfunc = updatebadge;
    document.querySelector('#updatecart').jsonstring = '{"event":"A", "cartdata":{"itemid":"'+ document.querySelector('#_id').value+'"}}';
    document.querySelector('#updatecart').jsonurl="/inventory/updatecart/";
    document.querySelector('#updatecart').submit=true;
    
  }
  
  function updatebadge(doc)
  {
    console.log(doc);
    document.querySelector('#badge').label= doc.count;
  }
  
  
  function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
  
  
  function checkCookie() {
    var session = getCookie("sessionid");
    if (session == "" && (document.querySelector('#logonindicator').value !== 'Guest' && document.querySelector('#logonindicator').value !== '')) {
       window.location.href = '/user/login';
       console.log(document.querySelector('#logonindicator').value);
       alert('expired');
    } 
    else
    {
     console.log(document.querySelector('#logonindicator').value);
    }
    
}

function updateuserinfo()
{
  console.log('koko');
   document.getElementById('dheader').dataurl="";
  document.getElementById('dheader').dataurl = '/user/userdetails'
  document.getElementById('dheader').respfunc=function(doc)
  {
    console.log(doc);
    document.getElementById('userlink').innerHTML = doc.user;
     document.getElementById('useraction').innerHTML = doc.action;
     document.getElementById('logonindicator').innerHTML = doc.user;
  }
}

function updateFormValues(form, model)
{
  for(var item in model)
  {
    var elename = form.querySelector('#'+item);
    if(elename !== undefined && elename !==null)
    {
      
      switch(elename.tagName)
      {
         case 'drop-down':
          elename.selectedvalue = model[item];
         default:
          elename.value = model[item];
         
      }
    } 
  }
}

setInterval(function(){checkCookie()},20000);
 
function getparents(node)
{
  var p =[];
  var no = node.parentNode;
  while(no)
  {
    p.push(no);
    no = no.parentNode;
  }
  console.log(p);
  return p;
}

function getParentsById(node)
{
  var p =[];
  var no = node.parentNode;
  while(no)
  {
    p.push(no.id);
    no = no.parentNode;
  }
 
  return p;
}
 


////
//taxes functions

////
 var taxDefArray = {};
function allTaxes()
{

  document.getElementById('taxes').respfunc = function(doc)
  {
    
   console.log(doc);
    for(var tax in doc)
    {
      
      if(Object.keys(doc[tax]).length >0)
      {

      var taxname = doc[tax].name;
      var percent = doc[tax].percent;
      var pit = document.createElement('div');
      pit.style.width = "200px";
       pit.className= "lit";
       pit.innerHTML = '<paper-checkbox onchange="taxarray(event)">'+taxname+' '+percent+' &#37; </paper-checkbox> <paper-input value="0" disabled type="number" name="weight" label="weight" min="0" class="wght"></paper-input>'+  
        '<input type="hidden" name="taxname" value="'+taxname+'" /> <input type="hidden" name="_id" value="'+doc[tax]._id+'" /> <input type="hidden" name="percent" value="'+percent+'" />';
      pit.style.marginBottom = "10px";
     
       document.querySelector('#btax').appendChild(pit);
      }
     
      
    }
    
     document.getElementById('taxes').dataurl="/taxes/getdefinitions";
      document.getElementById('taxes').respfunc = function(doc)
      {
         var defs = doc[0].definitions;
        for(var d in defs)
        {
         taxDefArray[defs[d].taxid] = {taxid:defs[d].taxid, weight:defs[d].weight, percent:defs[d].percent,taxname:defs[d].taxname };
         var ele= document.querySelector('input[value="'+defs[d].taxid+'"]');
         
         ele.parentElement.querySelector('paper-checkbox').checked=true;
        }
      }
  
   // console.log(ele.items);
   
  }
}
	 function taxarray(event)
   {
    var par = event.target.parentElement;
    par.querySelector('.wght').disabled=false;
   var id=  par.querySelector('input[name="_id"]').value;
     var wt=  par.querySelector('input[name="weight"]').value;
       var name=  par.querySelector('input[name="taxname"]').value;
         var pct=  par.querySelector('input[name="percent"]').value;
      
   //if(taxDefArray[id] !== undefined)
   //{
    
     if(event.target.checked === true)
         taxDefArray[id] = {taxid:id, weight:wt, percent:pct,taxname:name};
     else
     {
       delete  taxDefArray[id];
       /// taxDefArray[id] = {taxid:id, weight:wt, percent:pct,taxname:name};
     }
    
   //}
   console.log(taxDefArray);
  
   }
   
   function savedef()
   {
      
     document.getElementById('defsave').respfunc=resp;
     
     document.getElementById('defsave').jsonstring=JSON.stringify(taxDefArray);
      document.getElementById('defsave').jsonurl="/taxes/addglobal" 
       document.getElementById('defsave').rspelement  = document.getElementById("ptoast");
     document.getElementById('defsave').submit=true;
     
   }
   
  
   //end of taxes functions 
   ///
   //
  
  
  