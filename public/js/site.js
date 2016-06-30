//function to enable disabled form fields in tabled forms
  
   function enableedit(event,callback)
    {
      
        // var parent = event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
          var form= sajax(event.target).closest('form');
       
        togleForms();
      
       form.querySelector('.save').disabled = false;
      
       sajax().disableFields(false,  form);
        
       var cl =form.querySelector('.save').classList;
       
       cl.remove('disabled');
       console.log(cl);
       if(typeof callback === 'function')
        callback(event);
       return false;
       
          
    }
    
    //enable edit for normal forms
    
     function enableeditForm(event,callback)
    {
        var parent;
        if(event.target.tagName == "IRON-ICON")
        {
           parent = event.target.parentNode.parentNode.parentNode;
        }
        else if(event.target.tagName=== "PAPER-FAB")
        {
          parent = event.target.parentNode.parentNode;
        }
    
       
      ///  togleForms();
      
      // parent.querySelector('.save').disabled = false;
     
      sajax('#fldset').disableFields(false);
        
      
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
             
              if(forms[form].className === 'formsr' && forms[form].tagName ==='FORM'){
                 
               sajax().disableFields(true,forms[form]);
               var cl =forms[form].querySelector('.save').classList;
       
               cl.add('disabled');
              }
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
            dv.innerHTML = '<form  is="iron-form" method="post" class="formsr" action="#">'+
            '<div> <input class="longtext" required name="destinationname" type="text" value="'+d.destinationname+'" /> </div>'+
            '<div><input required name="zippost" type="text" class="shortcode" value="'+d.zippost+'" /> </div>'+
            '<div><input required name="destinationrate" type="number" class="shortcode" value="'+d.shippingrate+'" /><input  name="_id" type="hidden" value="'+doc[dest]._id+'" /> <input  name="destinationid" type="hidden" value="'+d.destinationid+'" />'+
            /*'<div> <input  name="destinationtax" type="number" class="shortcode" step="0.01" min="0" max="1" value="'+d.destinationtax+'" />'+ */
             '<input  class="dc" type="hidden" value="'+doc[dest].country.code+'" /></div>'+
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
      
       document.getElementById('rac').submit=true;
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
          
           document.querySelector('.spinner').style.display='inline-block';
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
              document.querySelector('.spinner').style.display='none';
          
            
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
    
    
    
  // functios for inventory mnagement
  
  function initializeStockPage()
  {
    
     document.getElementById('getcat').respfunc=popcat; 
     
    disablebuttons();
   
  }
   function popcat(rs)
     {
       document.getElementById('cat').menuItems = rs; 
       document.getElementById('getunit').respfunc = units;
      document.getElementById('getunit').dataurl="/productcatalog/getunits/";
   }
  
function units(rs)
{
  
  document.getElementById('unit').menuItems=rs;
  
  document.getElementById('idd').dataUrl="/productcatalog/viewall" 
  document.getElementById('spinprog').active=false;
}
//create a table passing an array of objects, the table html object, the onclick event for the rows and a boolean on weather or nit to show extra elemens
function createatable(doc,tbl,onclick, showextra)
{
  
    var table = document.getElementById(tbl);
     table.querySelector('thead').innerHTML = "";
      table.querySelector('tbody').innerHTML = "";
    for(var item in doc)
    {
       var row = document.createElement('tr');
      
         row.className ="prow";
         
         
         if(showextra)
         {
           if(item==='0')
           {
            var thsa = document.createElement('th');
            thsa.innerHTML = 'Select All';
            table.querySelector('thead').appendChild(thsa);  
           }
           var td =  document.createElement('td');
           td.innerHTML = '<p><input type="checkbox" /></p>';
           row.appendChild(td);
         }
         var cnt = 0;
         
        
         for(var it in doc[item])
         {
           if(it === '_id')
             continue;
          if(item ==='0')
          {
            var th = document.createElement('th');
            th.innerHTML = it;
            table.querySelector('thead').appendChild(th);  
            
          }
           var tdo =  document.createElement('td');
            tdo.onclick =function(event){onclick(event)};
           if(cnt === 0)
           {
             tdo.innerHTML= '<p><input type=hidden name="recordid" value="'+doc[item]._id+'" />'+doc[item][it]+'</p>';
           }
           else
             tdo.innerHTML= '<p>'+doc[item][it]+'</p>';
             row.appendChild(tdo);
           cnt++;
           
         }
         if(showextra)
         {
           if(item==='0')
           {
            var thed = document.createElement('th');
            thed.innerHTML = 'Edit';
            table.querySelector('thead').appendChild(thed);  
           }
           var tdl =  document.createElement('td');
           tdl.innerHTML = '<p><a href="#">Edit</a></p>';
           row.appendChild(tdl);
         }
       table.querySelector('tbody').appendChild(row);  
    }
  
}
var lastsearch;
function initcatalog()
{
  lastsearch = 0;
}

function tablebar(count, addlocation)
{
    document.getElementById('count').value=count;
   
    var totalpages = count / parseInt(document.getElementById('numitems').value);
    if(totalpages > 1) 
      document.getElementById('pages').value= totalpages;
    else
    {
    document.getElementById('pages').value = '1';
   
    
    }
     document.getElementById('pageleft').onclick = function()
     {
       changePage('d');
     }
  
  document.getElementById('pageright').onclick = function()
  {
    changePage('i');
  }
  document.getElementById('addbutton').onclick = function()
  {
    window.location = addlocation;
  }
  
}

function populateCatalog()
{
  
  document.getElementById('getall').respfunc =  function(count)
  {
   tablebar(count, '/productcatalog/add');
  var dispq = document.getElementById('numitems').value;
  
  document.getElementById('getall').respfunc=function(doc)
  {
   
    createatable(doc,'ptable',gotoprodpage,true)
    
  }
  document.getElementById('getall').dataurl="/productcatalog/getcatalogtable/"+dispq+"/0";
  document.getElementById('searchinput').onkeydown = function(event)
  {
  
     var e = event || window.event;
        if (e.keyCode == 13)
        {
          lastsearch = 0;
          var val= e.target.value;
          document.getElementById('getall').dataurl="/productcatalog/searchfortable/"+val+'/'+dispq+'/0';
          console.log(document.getElementById('getall').dataurl);
         
        }
    
  }
  
  }

  document.getElementById('getall').dataurl = "/productcatalog/getcount";
  

}
function gotoaddgroup(event)
{
     var  id = event.target.querySelector('input[name="recordid"]').value; 
   window.location = "/productfields/createfieldset/"+id;
}
function gotoaddfield(event)
{
     var  id = event.target.querySelector('input[name="recordid"]').value; 
   window.location = "/productfields/add/"+id;
}
//create table for gield groupings

function 	initiategrouppage()
{
  
  console.log(document.getElementById('ajgrp'));
  document.getElementById('ajgrp').respfunc =  function(count)
  {
   tablebar(count);
    var dispq = document.getElementById('numitems').value;
  document.getElementById('ajgrp').respfunc=function(doc)
  {
    
    createatable(doc,'grouptable',gotoaddgroup,false);
    console.log(document.getElementById('grouptable').querySelector('thead').firstChild.innerHTML, 'thead');
    document.getElementById('grouptable').querySelector('thead').firstChild.innerHTML="Field Group Name";
    
  }
  document.getElementById('ajgrp').dataurl = "/productfields/getgrouptable";
  
  }
  document.getElementById('ajgrp').dataurl = "/productfields/getgroupcount";
  
  //getcatalogtable
}


//create the field table
function 	initiatefieldpage()
{
  
 
  document.getElementById('getfields').respfunc =  function(count)
  {
   tablebar(count);
    //var dispq = document.getElementById('numitems').value;
  document.getElementById('getfields').respfunc=function(doc)
  {
    
    createatable(doc,'fieldtabe',gotoaddfield,false);
   
    
  }
  document.getElementById('getfields').dataurl = "/productfields/getfieldtable";
  
  }
  document.getElementById('getfields').dataurl = "/productfields/getgroupcount";
  
  //getcatalogtable
}


function changePage(ac)
{
  
  var pg = document.getElementById('curpage');
  var count = parseInt(document.getElementById('pages').value);
  var val = parseInt(pg.value);
  if(ac==='d' && val !==1)
    val-=1;
  if(ac ==='i' && val !== count)
    val +=1;
  pg.value = val;
    
}
function pagesearch()
{
    var dispq = document.getElementById('numitems').value;
          if(lastsearch+parseInt(dispq) < count)
            lastsearch +=parseInt(dispq);
          else
            lastsearch = count;
         
          console.log(lastsearch,dispq);
}
//select tab and initiate neon animation
function seltab(num)
{
  
  document.getElementById('anim').selected = num;
}
//function to create left bar on pages with dynamic fields

function getfieldgroups()
{
    document.getElementById('lbar').respfunc = function(gn)
    {
        
        for(name in gn)
        {   nopt = document.createElement('option');
            nopt.value = gn[name].fieldgroupname;
            nopt.text = gn[name].fieldgroupname;
            document.getElementById('fgroup').appendChild(nopt);
        }
        
        document.getElementById('lbar').respfunc = function(loc)
        {   
             document.getElementById('locale').innerHTML ="";
            for(l in loc)
            {
                opt = document.createElement('option');
                opt.value = loc[l].locale.code;
                opt.text = loc[l].locale.name;
                document.getElementById('locale').appendChild(opt);
            }
          var id = document.getElementById('_id').value;  
       //   console.log(id);
          if(id !== '')
            populateproduct(true);
          
          
        }
        document.getElementById('lbar').dataurl = '/store/getstorelocales';
    }
    document.getElementById('lbar').dataurl = '/productfields/groupnames';
    document.getElementById('prodsave').onclick = function(){createproduct();}
}

function createlbar()
{
    var grp = document.getElementById('fgroup').value;
    var loc = document.getElementById('locale').value;
    var deflocale = document.getElementById('deflocale').value;
    var sv = '0';
    if(loc !== deflocale)
       sv = '1'; 
  var url = "/productfields/findgroupbyname/"+grp+'/'+sv;
  createattrfromelements('#lbar', '#lefttab','#na' ,url);
}
function gotoprodpage(vent)
{
    id =sajax(vent.target).closest('tr');
    val =id.querySelector('input[name="recordid"]').value;
  window.location = "/productcatalog/edit/"+val;
  
    
}
function showsearch()
{
  document.getElementById('sinpt').style.width = "250px";
   document.getElementById('searchinput').style.opacity = "0.9";
  
}


//get product fields create object for saving

function createproduct()
{
   
   var form = document.getElementById('pform');
   var obj= form.serialize();
   var pobj ={}
   var loc = document.getElementById('locale').value;
   var fieldgroup = document.getElementById('fgroup').value;
   var instore = document.getElementById('instore').value;
   pobj[loc]=obj;
   pobj.instore = instore;
   pobj.fieldgroup = fieldgroup;
   var id = document.getElementById('_id').value;
   if(id !== '')
     pobj._id=id;
   document.getElementById('ajp').jsonstring = JSON.stringify(pobj);
   document.getElementById('ajp').respfunc = function(doc){
       resp(doc, document.getElementById('ptoast'));
   }
    document.getElementById('ajp').jsonurl = '/productcatalog/passdata';
   document.getElementById('ajp').submit=false;
 
  // document.getElementById('ajp').submit=true;
   console.log(pobj);
}

function populateproduct(callc)
{
 
   loc = document.getElementById('locale').value;
   id = document.getElementById('_id').value;
    console.log(loc,id);
   document.getElementById('lbar').respfunc = function(doc)
   {
       console.log(doc);
       updateFormValues(document.getElementById('pform'), doc);
      
       if(callc)
       {
          document.getElementById('fgroup').value = doc.fieldgroup;
          document.getElementById('instore').value = doc.instore;
        document.getElementById('fgroup').onchange();
        
       }
     //  console.log(doc.fieldgroup);
       //createlbar();
   } 
   document.getElementById('lbar').dataurl="";
   document.getElementById('lbar').dataurl ="/productcatalog/findbyid/"+id+"/"+loc;
}

//fields and fieldgroups
var fieldsel=[];
var groupfields = {};

// dynamicaly create input for option values for different languages
function initiateFieldPage()
{
 
   createLabelVals();
   popForFields();
 // createoptvals();
}
function createLabelVals()
{
   var languages = ['english', 'spanish', 'french'];
  var osr='<div class="labelvals">';
  for(var lang in languages)
    osr+='<div class="inline-block"><p>'+languages[lang]+'</p><input type="text"; name="'+languages[lang]+'" id="'+languages[lang]+'" /></div> ';
   osr+='</div>';
   document.getElementById('lbls').innerHTML+=osr;
}
function createoptvals()
{
  var dv = document.createElement('div');
  var osr = '<div class="optvals"><div class="inline-block"><p>Value</p><input type="text" name="optionvalue" id="optionvalue" /> </div>';
  var languages = ['english', 'spanish', 'french'];
  for(var lang in languages)
    osr+='<div class="inline-block langs"><p>'+languages[lang]+'</p><input type="text"; name="'+languages[lang]+'" id="'+languages[lang]+'" /></div> ';
   osr+='<div class="inline-block"><paper-icon-button class="greenbutton" icon="remove" onclick="removeOption(event)"></paper-icon-button></div></div> ';
   dv.innerHTML = osr;
   document.getElementById('opts').appendChild(dv);
   return dv;
}

function checktype(event)
{
  console.log(event.target.value);
  if(event.target.value==="drodown" || event.target.value==="multiselect")
    document.getElementById('addopt').disabled=false;
  else
   document.getElementById('addopt').disabled=true;
    
}
function savefieldgroup()
{
  
   var ajfg = document.getElementById('ajfg');
  ajfg.submit = false;
 

 ajfg.jsonstring = document.getElementById('gform').serialize();
 ajfg.jsonurl= '/productfields/addgroup';
 ajfg.respfunc = function(doc)
 {
   resp(doc,document.getElementById('ptoast'));
 }
 ajfg.submit = true;
}
// disable fields when specific set selected
function disablefields()
{
  var chkbx = document.querySelector('.fieldview').querySelectorAll('input[type="checkbox"]');
  for(var ckb in chkbx)
    chkbx[ckb].checked = false;
  if(Object.keys(groupfields).length === 0)
     document.querySelector('.fieldview').disabled=false;
  else{
    for(var item in groupfields)
    {
      for(var ids in groupfields[item])
      {
        var str = 'input[value="'+groupfields[item][ids]+'"]';
       
        document.querySelector(str).disabled=true;
      }
    }
  }
}
//check field when set selected
function checkFields(gname)
{
   document.querySelector('.fieldview').disabled=false; 
  for(var ids in groupfields[gname])
      {
        var str = 'input[value="'+groupfields[gname][ids]+'"]';
         console.log(document.querySelector(str));
        document.querySelector(str).disabled=false;
        document.querySelector(str).checked=true;
      }
      
}
function updatesel(event)
{
  disablefields();
  checkFields(event.target.value);

}

function updselarr(event)
{ 

   var currset = document.getElementById('gname').value;
  if(event.target.checked)
  {
    if(typeof groupfields[currset] !== 'object')
    groupfields[currset]=[];
    groupfields[currset].push(event.target.value);
   
       
  }
  else
  {
    if(typeof groupfields[currset] === 'object')
    {
    var ind =groupfields[currset].indexOf(event.target.value); 
    if(ind >=0)
      groupfields[currset].splice(ind,1);
    }
  }
  
  
 
}

function makeOptions()
{
  var inpts = document.querySelectorAll('.optvals');
  console.log(inpts);
  var options = [];
  console.log(inpts.length);
  for(var i =0; i<inpts.length; i++)
  {  var putsdv = inpts[i];
     
     var ipts = putsdv.querySelectorAll('input');
     if(putsdv.querySelector('input[name="optionvalue"]') !=null)
      var optionvalue = putsdv.querySelector('input[name="optionvalue"]').value;
     var obj={}
     var languages = [];
     obj.optionvalue =optionvalue;
     for( var j=0; j<ipts.length; j++)
     {
       if(ipts[j].name !== 'optionvalue')
       {
         languages.push({language:ipts[j].name, labelvalue:ipts[j].value});
       }
       
     
     }
     obj.languages=languages;
     options.push(obj);
     
  }
  return options;
}

function removeOption(event)
{
  var el = sajax(event.target).closest('div').parentElement;
  var root = el.parentNode;
  root.removeChild(el);
}

function makeLabels()
{
 
  var lbv = document.querySelector('.labelvals');
  var inpts = lbv.querySelectorAll('input');
  var labels=[];
  for(var i=0; i<inpts.length; i++)
  {
    labels.push({language:inpts[i].name, labelvalue:inpts[i].value});
  }
  return labels;
  
}

function savefield()
{
  var id = document.getElementById('fieldid').value;
  
  var fieldvalue = document.getElementById('fieldform').serialize();
  var opts= makeOptions();
  console.log(opts);
  if(opts.length >0)
   fieldvalue.options = opts;
 fieldvalue.labels = makeLabels();
 var ajp  = document.getElementById('fajp');
 if(id !=="")
  fieldvalue._id=id;
 ajp.jsonstring = fieldvalue;
 ajp.respfunc=function(doc){resp(doc,document.getElementById('ptoast'))}
 ajp.jsonurl="/productfields/addfield";
 ajp.submit=false;
 //console.log(fieldvalue);
 ajp.submit=true;
  
}
function enableaddsetname()
{
   document.getElementById('setname').classList.remove('transorev');
    document.getElementById('setname').classList.remove('transhrev');
  
  
   document.getElementById('setname').classList.add('transo');
   document.querySelector('.sname').classList.add('transh');
  document.querySelector('.sname').style.height='40px';
  document.getElementById('setname').style.opacity='0.9';
  document.getElementById('addset').disabled=false;
  
 
}

function popForFields()
{
  var id= document.getElementById('fieldid').value;
  var arq = document.getElementById('ajfld');
  var form = document.getElementById('fieldform');
 
  arq.respfunc = function(doc)
  {
    
    updateFormValues(form, doc);
    var labels = doc.labels;
    if(labels !== undefined && labels.length > 0)
    {
    for(var label in labels)
    {
    
       var elem =  document.getElementById(labels[label].language);
       elem.value = labels[label].labelvalue;
        
    }
    }
    var options = doc.options;
    if(options != undefined && options.length >0)
    {
        document.getElementById('addopt').disabled = false;
        for(option in options)
        {
            var languages =options[option].languages;
           var div =createoptvals();
          
            for(var lang in languages)
            {
              var inptstr = 'input[name="'+languages[lang].language+'"]';
              div.querySelector(inptstr).value = languages[lang].labelvalue;
            }
           div.querySelector('input[name="optionvalue"]').value= options[option].optionvalue;
        }
        
    }
  }
  arq.dataurl="/productfields/fieldbyid/"+id;
}

//this function creats aa set of fields for a defined group
function addsetname()
{
  var options = document.getElementById('gname').options;
   var setname= document.getElementById('setname').value;
  for(var option in options)
  {
    if(options[option].value==setname)
    {
      alert('name already exist');
      return;
    }
  }
  
  var opt = document.createElement('option');
  opt.value = setname;
 // opt.selected=true;

  opt.innerHTML=setname;
  document.getElementById('gname').appendChild(opt);
  document.getElementById('gname').value=setname;
   console.log(document.getElementById('gname').value);
 // document.getElementById('gname').selectedIndex =opt.index;
  document.getElementById('setname').classList.remove('transo');
    document.getElementById('setname').classList.remove('transh');
  document.getElementById('setname').classList.add('transorev')
   document.querySelector('.sname').classList.add('transhrev')
  document.querySelector('.sname').style.height='0px';
  document.getElementById('setname').style.opacity='0';
  
  disablefields();
  groupfields[setname]=[];
}

//function to save fieldset
function savegroup()
{
   document.getElementById('saveset').jsonurl = "/productfields/addset";
   document.getElementById('saveset').respfunc = function(doc)
   {
     resp(doc, document.getElementById('ptoast'));
   }
   var obj ={};
   var grid = document.getElementById('groupid').value;
   obj._id = grid;
   obj.fieldsets = groupfields
   console.log(JSON.stringify(obj));
   document.getElementById('saveset').jsonstring = JSON.stringify(obj);
   document.getElementById('saveset').submit=true;
   
}

//function to get fields from server
function getfields()
{
  var flds = document.getElementById('getfields');
  var id = document.getElementById('groupid').value;
  flds.respfunc = function(group)
  {
   
  if(typeof group.fieldsets !=='object' || group.fieldsets.length ===0)
  {
    groupfields={};
  }
  else
  {
    groupfields = group.fieldsets;
    for( var gp in group.fieldsets)
    {
      document.getElementById('gname').innerHTML+='<option value="'+gp+'">'+gp+'</option>';
    }
  }
  document.getElementById('groupname').value = group.fieldgroupname;
  
  flds.respfunc=function(doc)
  {
    for(var item in doc)
    {
      var sp= document.createElement('span');
      var opt = document.createElement('input');
      opt.type="checkbox";
        opt.value=doc[item]._id;
       sp.innerHTML=doc[item].fieldname;
       sp.appendChild(opt);
       opt.onclick= function(event){updselarr(event);}
       document.querySelector('.fieldview').appendChild(sp);
       
       
       //get group info
       
         flds.dataurl = '/productfields/findgroups';
         flds.respfunc=function(doc){
           
         }
    }
  }
  flds.dataurl = '/productfields/findfields';
  }
  
  flds.dataurl="/productfields/findgroupbyid/"+id;
}


function funct(obj)
    {
      
        var theval =  sajax('#form').serializeForm(true);   
         var tv = JSON.parse(theval);
        tv.image =  obj;
        
       var fsl= document.getElementById("fimg");
       tv.image.type = fsl.files[0].type;
       tv.image.size = fsl.files[0].size;
        tv.image.filename = fsl.files[0].name;
        fsl.clear();
       parseData(document.getElementById('ajp'), JSON.stringify(tv));
      
    }
    
     function parseData(apaser,str)
   {
            // iaj.body = str;
        
       // iaj.generateRequest();
         obj = JSON.parse(str);
         console.log(str);
         obj.cat = document.getElementById('cat').selectedValue.name;
         obj.unit = document.getElementById('unit').selectedValue.name;
       
         str = JSON.stringify(obj);
         document.querySelector('#ajp').jsonstring ="";
         document.querySelector('#ajp').jsonstring = str;
         document.querySelector('#ajp').rspelement  = document.getElementById("ptoast");
         
         document.querySelector('#ajp').respfunc=function(doc)
         {
            resp(doc,document.getElementById("ptoast")); 
             document.getElementById('idd').dataUrl="" 
             document.getElementById('idd').dataUrl="/productcatalog/viewall" 
         }
         
          
          document.querySelector('#ajp').submit=false;
          document.querySelector('#ajp').submit=true;
        
         
        // alert(str);
       // apaser.jsonstring = str;
       // apaser.submit = true;
   }
  
  function populate()
   {
    
    // var fdata = new FormData(form);
   // enableedit(false);
      //console.log(obj.model);
      
      var si =document.getElementById('idd').selectedItem;
      var obj;
      if(typeof si.length === 'undefined')
         obj= si;
       else if(si.length >0)
       {
         
       obj = si[si.length - 1];
       }
     // console.log(obj);
      if(obj !== undefined)
      {
      document.getElementById("desc").value =obj.desc;
       document.getElementById("longdesc").value =obj.longdesc;
       document.getElementById("name").value =obj.name;
       document.getElementById("serial").value =obj.serial;
        document.getElementById("model").value =obj.model;
       document.getElementById("manu").value =obj.manu;
       if(obj.instore == 'true')
         document.getElementById("instore").checked=true;
       else
          document.getElementById("instore").checked=false;
        
      document.getElementById("sku").value =obj.sku; 
       document.getElementById("uprice").value = obj.uprice;
       // document.getElementById("unit").selectedIndex=-1;
        document.getElementById("unit").selectedName = obj.unit;
        document.getElementById("cat").selectedName = obj.cat;
        
         document.getElementById("_id").value = obj._id;
         console.log(obj.image);
         if(obj.image)
         {
            document.getElementById("fimg").value = obj.image.filename;
         }
         //alert(obj._id);
      //  enableedit(true);
      sajax('#mod').disable(false);
      sajax('#del').disable(false);
       }
       else{
         clearAllInv();
       }
       

       
   }
   function clearAllInv()
   {
     sajax('#form').clearForm();
   }
   
function deleteinventory()
{       
       document.getElementById('pd').open();
       document.getElementById('deleteAccept').onclick = function()
       {
       
        document.getElementById('ajpdel').jsonstring = '{"_id":"'+document.getElementById('_id').value+'"}';
        document.getElementById('ajpdel').respfunc=function(doc)
        {
           document.getElementById('idd').dataUrl="" 
          document.getElementById('idd').dataUrl="/productcatalog/viewall" 
          resp(doc, document.getElementById('ptoast')); 
        }
         document.getElementById('ajpdel').submit=false;
        document.getElementById('ajpdel').submit=true;
       // deleteobj(document.getElementById('ajpdel'));  
       
        
       }

       
}

 function dosearch(e)
 {
   url= "/productcatalog/search/";
     search(e,url);
 }
 
 //ad this to own file
 
 function wview(event,elem)
 {
 
   
   
    document.getElementById('idd').selectedPage = 0;
   
 }
 function aview(event,elem)
 {
 
    document.getElementById('idd').selectedPage =1;
 }
 
 function savestock()
 {
   var selcat =document.querySelector('#cat').selectedValue;
     var selunit = document.querySelector('#unit').selectedValue
      
       if(typeof selcat !== 'object')
       {
         document.getElementById('cat').style.border="1px solid red";
         
         return;
         
       }
       document.getElementById('cat').style.border="none";
       if(typeof selunit !== 'object')
       {
         document.getElementById('unit').style.border="1px solid red";
         
         return;
         
       }
       document.getElementById('unit').style.border="none";
       if(document.getElementById('form').validate())
       {
         if(document.getElementById("fimg").files.length === 0)
         {
          
          parseData(document.getElementById('ajp'), sajax('#form').serializeForm(true));
         }
         else
         {
           
           sajax().loadImage(document.getElementById("fimg"),'An Image', funct,true);
         }
       }
       
 }
 
 //category management
 
   
   function saveCatForm(event, eve)
   {
      document.getElementById('error').style.opacity='0';
       document.getElementById('error').innerHTML="";
    
      var frm;
      var parent;
      if(eve ==='E')
      {
         //parent = event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
         
        frm = sajax(event.target).closest('form');// parent.querySelector('.formsr');
        //console.log(frm);
      }
      else if(eve ==='A')
        frm = document.querySelector('#form');
      if(frm.validate())
		   { 
			    document.querySelector('#iaj').jsonurl='';
				  document.querySelector('#iaj').submit=false;
				  document.querySelector('#iaj').respfunc=function(doc)
          {
             getCategories();
             console.log(doc);
             resp(doc,document.getElementById("ptoast"));
          }
			
				  if(eve==='A')
				  {
					document.querySelector('#iaj').jsonstring=JSON.stringify(document.querySelector('#form').serialize());
			        document.querySelector('#iaj').jsonurl='/productcatalog/addrootcategory';
					document.querySelector('#iaj').submit=true;
				  }
				 if(eve==='E')
				 {
          
			  //parent.querySelector('.formsr')
					var catobj =frm.serialize();
					 
					 
           console.log(catobj);            
					 document.querySelector('#iaj').jsonstring=JSON.stringify(catobj);
					
				    document.querySelector('#iaj').jsonurl='/productcatalog/editrootcategory';
					document.querySelector('#iaj').submit=true;
				 }
        
		   }
       else{
          document.getElementById('error').style.opacity='0.9';
         document.getElementById('error').innerHTML="Please fill in all fields"
       }
       return false;
   }
   
   
    function getCategories()
   {
  
     document.querySelector('#spin').style.display="block";
      document.querySelector('#spin').active=true;
     document.querySelector('#regs').respfunc= function(doc)
     {
        document.getElementById('hidentable').innerHTML="";
    
        for(var catg in doc)
        {
              var d = doc[catg];
              
               var dv = document.createElement('div');
               dv.className ="tbl2";
            
            dv.innerHTML = '<form  is="iron-form" method="post" class="formsr" action="#"><div> <input class="longtext" required name="name" type="text" value="'+d.name+'" />'+
             '<a href="/productcatalog/categories/'+d._id+'">Categories</a></div>'+
            '<div><input required name="description" type="text" class="longtext" value="'+d.description+'" /><input  name="_id" type="hidden" value="'+d._id+'" />'+
             '<span class="right">'+
             '<button disabled class="disabled save" title="Save Region" onclick="return saveCatForm(event,\'E\')" ><img src="/image/save.png" /> </button>'+
             '<button title="Delete Country" onclick="return deleteCat(event)"><img src="/image/trash.png" /></button>'+
              '<button title="Edit Item" onclick="return enableedit(event)" class="edit"><img src="/image/edit.png"/></button></span></div> </form>';
             document.getElementById('hidentable').appendChild(dv);
            
            
         
        } 
        var ele = document.querySelector('.pmaterial');
        var forms =  ele.querySelectorAll('.formsr');
             for(var form in forms)
             {
              
              if(forms[form].className =='formsr');
               sajax().disableFields(true,forms[form]);
             }
             
        
        
         document.querySelector('.pmaterial').style.opacity=0.9;
        document.querySelector('#spin').active=false;
        document.querySelector('#spin').style.display="none";
         
     }
  
     document.querySelector('#regs').dataurl = "";
     document.querySelector('#regs').dataurl = "/productcatalog/getrootcategory";  
    
   }
   
   
   function nestedmenu(doc,ul,onclick,catid)
   {
       // var catid = document.getElementById('_id').value;
        
        var select = ul;
       // ul.innerHTML="";
        
        for(var itm in doc)
        {  console.log(doc[itm]);
            var ele= document.getElementById(doc[itm]._id);
            
            
            if(ele !== null && doc[itm].children.length ===0)
            {
              if(catid !== doc[itm]._id)
                  ele.querySelector('div').onclick = onclick
              ele.querySelector('div').innerHTML = '<input type="hidden" value="'+doc[itm]._id+'" />'+ doc[itm].name;
              continue;
            }
            else if(doc[itm].children.length >0 && ele === null)
            {  
               
               var optgp = document.createElement('li');
               var roote = document.createElement('ul');
               var div = document.createElement('div');
              // div.onclick=onclick;
               div.innerHTML = '<input type="hidden" value="'+doc[itm]._id+'" />'+ doc[itm].name;
               optgp.id = doc[itm]._id;
               optgp.appendChild(div);
               if(catid !== doc[itm]._id)
                  div.onclick = onclick
                else div.onclick= function(){return false;}
                //innerHTML ='<div onclick="getcatvals(event)"><input type="hidden" value="'+doc[itm]._id+'" />'+ doc[itm].name+'</div>';
               //else
                 // optgp.innerHTML ='<div><input type="hidden" value="'+doc[itm]._id+'" />'+ doc[itm].name+'</div>';
               optgp.appendChild(roote);
               
               /*if(!optgp.style.paddingLeft)
                  optgp.style.paddingLeft='15px';
                var ind =optgp.style.paddingLeft.indexOf('px');
                sp=optgp.style.paddingLeft.substring(0,ind);
                var pp = parseInt(sp)+15;*/
               for(var chld in doc[itm].children)
               {
                   var c = doc[itm].children[chld];
                   
                   var childel = document.getElementById(c.toString());
                   if(childel !==null)
                    {  
                       // console.log('pop', childel.innerHTML);  
                         //console.log(div.onclick);
                       childel.querySelector('div').onclick = div.onclick;
                       setclick(childel,div.onclick);
                       roote.appendChild(childel);
                      continue;
                    }
                     var str='';
                   var name = getname(doc,c.toString());
                   
                    var cdiv = document.createElement('div');
                    cdiv.innerHTML = '<input type="hidden" value="'+c+'" />'+name;
                    if(catid !== doc[itm]._id)
                       cdiv.onclick = onclick;
                     //str='<div><input type="hidden" value="'+c+'" />'+name+'</div>';
                    //else
                   //   str ='<div onclick="getcatvals(event)"><input type="hidden" value="'+c+'" />'+name+'</div>';
                   
                 //  var txtnode = document.createTextNode(name);
                   var opt1 = document.createElement('LI');
                  //  opt1.innerHTML = str;
                   opt1.appendChild(cdiv);
                   //opt1.appendChild(txtnode);
                   opt1.id=c;
                
                     //opt.style.paddingLeft = pp.toString()+'px';
                    var n = roote.appendChild(opt1);
                   
                   
               } 
               
               optgp.appendChild(roote);
               
               select.appendChild(optgp);
               
               continue;
              
            }
            else if(doc[itm].children.length >0 && ele !== null)
            {  

                console.log(ele,'ba');
                 var roote1 = document.createElement('ul');
                //ele.tagName = 'ul';
               
               // ele.innerHTML = doc[itm].name;
               ele.querySelector('div').innerHTML = '<input type="hidden" value="'+doc[itm]._id+'" />'+ doc[itm].name;
               if(ele.id === catid)
               {
                 ele.querySelector('div').onclick=function(){return false;}
                 
             
                 //disablechildren(ele);
               }
               for(var chld in doc[itm].children)
               {
                   var c = doc[itm].children[chld];
                   var childel = document.getElementById(c.toString());
                   if(childel !==null)
                    {
                       console.log('pop')
                      childel.querySelector('div').onclick = ele.querySelector('div').onclick;
                       setclick(childel,ele.querySelector('div').onclick);
                      roote1.appendChild(childel);
                      continue;
                    }
                   var name = getname(doc,c.toString());
                   
                   var opt = document.createElement('li');
                   opt.id=c;
                   var eldiv = document.createElement('div');
                   eldiv.innerHTML = '<input type="hidden" value="'+c+'" />'+name;
                  
                    /*if(catid === doc[itm]._id)
                       opt.innerHTML ='<div><input type="hidden" value="'+c+'" />'+name+'</div>';
                    else*/
                        //opt.innerHTML ='<div onclick="getcatvals(event)"><input type="hidden" value="'+c+'" />'+name+'</div>';
                        eldiv.onclick = ele.querySelector('div').onclick;
                        opt.appendChild(eldiv);
                   roote1.appendChild(opt);
                   //console.log(roote1);
                  
               }
            
               ele.appendChild(roote1);
               //select.appendChild(ele);
               
               continue;
            }
            else if(doc[itm].children.length ===0 && ele===null){
                   
                   var opt = document.createElement('li');
                   var fdiv = document.createElement('div');
                   fdiv.innerHTML ='<input type="hidden" value="'+doc[itm]._id+'" />'+ doc[itm].name;
                   opt.id=doc[itm]._id;
                    if(catid !== doc[itm]._id)
                       fdiv.onclick=onclick;
                      // opt.innerHTML ='<div onclick="getcatvals(event)"><input type="hidden" value="'+doc[itm]._id+'" />'+ doc[itm].name+'</div>';
                //    else
                    //  opt.innerHTML ='<div><input type="hidden" value="'+doc[itm]._id+'" />'+ doc[itm].name+'</div>';
                   opt.appendChild(fdiv);    
                   select.appendChild(opt);
                   continue;
            }
           
             
            
        }
     
   }
   
 function setclick(item,fnc)
 { //alert('pp');
     var children = item.children;
     console.log('disabling childr  en');
     for(child in children)
     {  
         if(children[child] !== null && (typeof children[child] === 'object') && children[child].querySelector('div') !==null && children[child].tagName.toUpperCase()=='LI')
         {
          
           children[child].querySelector('div').onclick=fnc;
         }
         if((typeof children[child] ==='object') && children[child].children.length>0)
           setclick(children[child],fnc);
     }
 }
   
 function getcats()
 {   
     var rootid = document.getElementById('rootcat').value;
     document.querySelector('#catreq').respfunc= function(doc){
          nestedmenu(doc, document.getElementById('cats'),getcatvals,document.getElementById('_id').value);
        document.getElementById('spin').active="false";
        document.getElementById('spin').style.display ="none";  
        document.querySelector('.pmaterial').style.opacity = 0.9;
     }
     lan = document.getElementById('language').value;
   
     document.querySelector('#catreq').dataurl = "/productcatalog/getcategories/"+rootid+"/"+lan;
 }
 function localedd()
 {
       document.getElementById('spin').style.display ="block";
     document.querySelector('#catreq').respfunc= function(doc)
     {
       
         var sel =document.getElementById('language');
         for(var l in doc)
         {
             lan = doc[l];
             console.log(lan.locale.name);
             opt = document.createElement('option');
             opt.value = lan.locale.code;
             opt.text = lan.locale.name;
             sel.appendChild(opt);
         }
         
         getcatinfo(document.getElementById('defaultsite').value);
     }
     
      document.querySelector('#catreq').dataurl = "/store/getstorelocales";
 }
 
 function getcatinfo(locale)
 {
     var catid = document.getElementById('_id').value;
     document.querySelector('#catreq').respfunc= function(doc)
     { 
         
        form = document.getElementById('catform');
        updateFormValues(form, doc);
        console.log(doc);
         //  document.getElementById('enabled')=checked;
        getcats();
     }
     
       document.querySelector('#catreq').dataurl= "/productcatalog/getcatbyid/"+catid+"/"+locale;
     
 }
 
 function reloadlocale()
 {
     lan = document.getElementById('language').value;
     
     getcatinfo(lan);
 }
 
 function getcatvals(event)
 {
     var li = sajax(event.target).closest('li');
     var inpt = li.querySelector('input');
     var cat = inpt.value;
     var text = event.target.textContent;
     if(typeof text ==='udefined')
       text = event.target.innerTex;
     document.getElementById('parentname').value = text;
     document.getElementById('parentid').value = cat;
 }
 
 function catpage()
 {
  document.getElementById('getcats').respfunc =  function(count)
  {
   tablebar(count, '/productcatalog/addcategory');
  var dispq = document.getElementById('numitems').value;
  
  document.getElementById('getcats').respfunc=function(doc)
  {
   
    createatable(doc,'cattable',gotocatpage,true)
    
  }
  var rid = document.getElementById('rootcat').value;
  var defst = document.getElementById('defaultsite').value;
  document.getElementById('getcats').dataurl="/productcatalog/getcattable/"+rid+"/"+dispq+"/0/"+defst;
  document.getElementById('searchinput').onkeydown = function(event)
  {
  
     var e = event || window.event;
        if (e.keyCode == 13)
        {
          lastsearch = 0;
          var val= e.target.value;
          document.getElementById('getcats').dataurl="/productcatalog/searchforcat/"+val+'/'+dispq+'/0/'+defst;
          console.log(document.getElementById('getcats').dataurl);
         
        }
    
  }
 }
 document.getElementById('getcats').dataurl = "/productcatalog/getcatcount";
  
 }
 
 function gotocatpage(event)
 {
     var tr = sajax(event.target).closest('tr');
      var rid = document.getElementById('rootcat').value;
       var lan = document.getElementById('defaultsite').value;
      
     var idval = tr.querySelector('input[name="recordid"]').value;
     console.log(idval);
      window.location ="/productcatalog/categoryadd/"+rid+"/"+lan+"/"+idval;
     //document.getElementById()
 }
 function getname(dc,id)
 {
     for( var d in dc)
     {
         
         if(dc[d]._id === id)
           return dc[d].name;
         
     }
     return '';
 }
 
 function saveCats()
 {
     var aps = document.getElementById('catparser');
     var cobj = document.getElementById('catform').serialize();
     if(document.getElementById("_id").value.length !== 0)
        cobj._id=document.getElementById("_id").value;
     cobj.rootcategory = document.getElementById('rootcat').value;
     aps.jsonstring= cobj;
     if(typeof(cobj._id) !== 'string')
      aps.jsonurl = "/productcatalog/addcategory";
     else
        aps.jsonurl = "/productcatalog/editcategory"
     // var idd = document.getElementById("_id").value;
     // console.log(cobj._id,aps.jsonurl,typeof cobj._id);
    ;
     aps.respfunc = function(doc){resp(doc,document.getElementById('ptoast'));}
     aps.submit=false;
     aps.submit=true;
 }
function deleteCat(event)
{     var frm = sajax(event.target).closest('form');
       document.getElementById('pd').open();
       document.getElementById('deleteAccept').onclick = function()
       {
         var ids = [];
         ids.push(frm.querySelector('input[name="_id"]').value);
         console.log({ids:ids});
        document.getElementById('iaj').jsonstring = JSON.stringify({ids:ids});// '{"_id":"'+document.getElementById('_id').value+'"}';
        document.getElementById('iaj').respfunc=function(doc)
        {
          
          getCategories();
          resp(doc, document.getElementById('ptoast')); 
        }
         document.getElementById('iaj').jsonurl = "/productcatalog/removerootcategory";
         document.getElementById('iaj').submit=false;
        document.getElementById('iaj').submit=true;
       // deleteobj(document.getElementById('ajpdel'));  
       
        
       }

       
}
 
 //end of inv management


//units management


     
   function getUnits()
   {
  
     document.querySelector('#spin').style.display="block";
      document.querySelector('#spin').active=true;
     document.querySelector('#regs').respfunc= function(doc)
     {
        document.getElementById('hidentable').innerHTML="";
    
        for(var catg in doc)
        {
              var d = doc[catg];
              
               var dv = document.createElement('div');
               dv.className ="tbl2";
            
            dv.innerHTML = '<form  is="iron-form" method="post" class="formsr" action="#"><div> <input class="longtext" required name="name" type="text" value="'+d.name+'" /> </div>'+
            '<div><input required name="description" type="text" class="longtext" value="'+d.description+'" /><input  name="_id" type="hidden" value="'+d._id+'" />'+
             '<span class="right">'+
             '<button disabled class="disabled save" title="Save Region" onclick="return saveUnitForm(event,\'E\')" ><img src="/image/save.png" /> </button>'+
             '<button title="Delete Country" onclick="return deleteUnit(event)"><img src="/image/trash.png" /></button>'+
              '<button title="Edit Item" onclick="return enableedit(event)" class="edit"><img src="/image/edit.png"/></button></span></div> </form>';
             document.getElementById('hidentable').appendChild(dv);
            
            
         
        } 
        var ele = document.querySelector('.pmaterial');
        var forms =  ele.querySelectorAll('.formsr');
             for(var form in forms)
             {
              
              if(forms[form].className =='formsr');
               sajax().disableFields(true,forms[form]);
             }
             
        
        
         document.querySelector('.pmaterial').style.opacity=0.9;
        document.querySelector('#spin').active=false;
        document.querySelector('#spin').style.display="none";
         
     }
  
     document.querySelector('#regs').dataurl = "";
     document.querySelector('#regs').dataurl = "/productcatalog/getunits";  
    
   }
   
   
   function saveUnitForm(event, eve)
   {
    
      var frm;
      var parent;
      if(eve ==='E')
      {
         //parent = event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
         
        frm = sajax(event.target).closest('form');// parent.querySelector('.formsr');
        //console.log(frm);
      }
      else if(eve ==='A')
        frm = document.querySelector('#form');
      if(frm.validate())
		   { 
			    document.querySelector('#iaj').jsonurl='';
				  document.querySelector('#iaj').submit=false;
				  document.querySelector('#iaj').respfunc=function(doc)
          {
             getUnits();
             console.log(doc);
             resp(doc,document.getElementById("ptoast"));
          }
			
				  if(eve==='A')
				  {
					document.querySelector('#iaj').jsonstring=JSON.stringify(document.querySelector('#form').serialize());
			        document.querySelector('#iaj').jsonurl='/productcatalog/addunit';
					document.querySelector('#iaj').submit=true;
				  }
				 if(eve==='E')
				 {
        
					var catobj =frm.serialize();
					 document.querySelector('#iaj').jsonstring=JSON.stringify(catobj);
					
				    document.querySelector('#iaj').jsonurl='/productcatalog/editunit';
					document.querySelector('#iaj').submit=true;
				 }
        
		   }
       return false;
   }
   
function deleteUnit(event)
{     var frm = sajax(event.target).closest('form');
       document.getElementById('pd').open();
       document.getElementById('deleteAccept').onclick = function()
       {
         var ids = [];
         ids.push(frm.querySelector('input[name="_id"]').value);
         
        document.getElementById('iaj').jsonstring = JSON.stringify({ids:ids});// '{"_id":"'+document.getElementById('_id').value+'"}';
        document.getElementById('iaj').respfunc=function(doc)
        {
          
          getUnits();
          resp(doc, document.getElementById('ptoast')); 
        }
         document.getElementById('iaj').jsonurl = "/productcatalog/removeunit";
         document.getElementById('iaj').submit=false;
        document.getElementById('iaj').submit=true;
       // deleteobj(document.getElementById('ajpdel'));  
       
        
       }

       
}
   
// cart stuff
var itemcount;
function initiateCart()
{
 
  document.getElementById('getcart').respfunc= function(doc){
     updatebadge(doc);
    
        //document.getElementById('cartdata').listHeaders='{"0":"name","1":"desc"}'
       document.getElementById('cartdata').dataurl="";
      document.getElementById('cartdata').dataurl="/productcatalog/findcartitems";
       document.getElementById('cartdata').respfunc = createcart;
      
    
    }
    document.getElementById('getcart').dataurl="";
	  document.getElementById('getcart').dataurl = '/productcatalog/getcartitems';
  }
    // document.getElementById('getcart').respfunc= updatebadge;
    
    function createcart(doc)
    {
      
       document.getElementById('count').innerHTML = itemcount+ " Item(s) ";
       document.querySelector('#spin').active=true
       
      document.getElementById('subtotal').innerHTML = "$"+ doc.total;
      document.getElementById('cart').innerHTML ='';
      var dc  = JSON.parse(doc.items);
      
     console.log(Object.keys(dc[0]));
     if(dc.length===1 && Object.keys(dc[0]).length=== 0)
     {
       document.querySelector('#spin').active=false;
       return;
     }
      for (var item in dc)
      {
      
      var ele = document.createElement('div');
      ele.className = "cartitem";
      var htm =  '<img height="40" src="data:'+dc[item].image.type+';base64,'+dc[item].image.imagedata+'" /> <input type="hidden" name ="_id" id ="_id" value="'+dc[item]._id+'" />'+
      '<span class="itemName"> &nbsp;'+dc[item].name+'</span>'+
     
      '<div class="shortdesc"><p>'+dc[item].desc+'</p></div>'+
      '<div class="price"><div style="width:150px; padding-right:10px; padding-top:10px; display:inline-block;">Price: $ '+dc[item].uprice+'</div>'+
       '<div style="margin-left:0px;  display:block;" ><span>QTY: <paper-input onchange="updatecart(event,\'E\')" class="short" name="qty" no-label-float value="'+dc[item].count+'" type="number"></paper-input> </span>'+
       '<paper-icon-button icon="delete" class="deletebtn" onclick="updatecart(event, \'D\')"></paper-icon-button> </div>'+
      
      '<div class="sep"></div>';
      ele.innerHTML = htm;
      document.getElementById('cart').appendChild(ele);
     
      
      }
       document.querySelector('#spin').active=false;
      
      updateuserinfo();
    }
    function gotocheckout()
    {
      document.location.href="/accounts/checkout";
    }
    
    
  function updatecart(event, ev)
  {
   var ell;
     document.querySelector('#updatecart').submit=false;
   if(ev === 'D')
   {
     var tell = sajax(event.target).closest('div');
     ell = tell.parentNode.querySelector('#_id');
   }
    if(ev ==='A')
     ell = document.getElementById('_itmid');
 
  
    if(ev ==='E')
    {
      ell = event.target.value;
     var it = sajax(event.target).closest('span');
     var cit = it.parentNode.parentNode.parentNode;
      var itmid = cit.querySelector('#_id').value;
      
      document.querySelector('#updatecart').jsonstring = '{"event":"'+ev+'", "cartdata":{"itemid":"'+itmid+'", "qty":"'+ ell+'"}}';
    }
    else
      document.querySelector('#updatecart').jsonstring = '{"event":"'+ev+'", "cartdata":{"itemid":"'+ ell.value+'"}}';
      
      document.querySelector('#updatecart').respfunc = function(doc){updatebadge(doc); if(ev === 'E' || ev === 'D') initiateCart()}
    document.querySelector('#updatecart').jsonurl="/productcatalog/updatecart/";
    document.querySelector('#updatecart').submit=true;
    
    
  }
  
  function updatebadge(doc)
  {
    itemcount = doc.count;
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
      
    } 
    else
    {
    console.log(document.querySelector('#logonindicator').value);
    }
    
}

function updateuserinfo()
{
  
   document.getElementById('dheader').dataurl="";
  document.getElementById('dheader').dataurl = '/user/userdetails'
  document.getElementById('dheader').respfunc=function(doc)
  {
    
    document.getElementById('userlink').innerHTML = doc.user;
     document.getElementById('useraction').innerHTML = doc.action;
     document.getElementById('logonindicator').innerHTML = doc.user;
     
  }
}
//end of cart stuff


//store setup stuff
 function getmain()
  {
    var ajr = document.getElementById('ajreq');
    ajr.respfunc =function(doc)
    {
      
      var frm = document.getElementById('storeform');
     if(typeof doc._id !== 'undefined') 
     {
         
         frm.querySelector('#id').value = doc._id;
     }
      frm.querySelector('#sname').value=doc.storename;
      frm.querySelector('#curr').value = doc.maincurrency;
      frm.querySelector('#loclink').href = "/store/locations/"+doc._id
    } 
    ajr.dataurl = "";
    ajr.dataurl = '/store/getmain';
    
  }
  function savemain(event)
  {
    var form = sajax(event.target).closest('form');
    if(form.validate())
    {
      var id = form.querySelector('#id');
      console.log(id.value);
       var mod = form.serialize();
      if(id.value === "")
      {
        delete mod._id;
        mod.event = 'A';
      }
      else{
        console.log('lplp');
        mod.event = "E";
      }
     console.log(mod);
      var ajp = document.getElementById('ajpaser');
      ajp.jsonurl = "/store/savemain"
      ajp.jsonstring= JSON.stringify(mod);
      ajp.respfunc = function(doc)
      {
        resp( doc,document.getElementById('ptoast'));
         getmain();
      }
       ajp.submit = false;
      ajp.submit = true;
     
    }
    return false;
  }
  
  function getlocations()
  {
    
    getcountries();
  }
  
  function getcountries()
  {
   var rq = document.getElementById('regs');
   rq.respfunc= function(doc)
   {
     document.getElementById('country').menuItems = doc;
     rq.dataurl="/store/getlocations";
     rq.respfunc=function(doc)
     {
        document.getElementById('loc').innerHTML="";
       for(var item in doc)
            {
             
             var dv = document.createElement('div');
             dv.className ="countrybox";
            
            dv.innerHTML = '<div onclick=editloc(event)>'+
            '<input type="hidden" value="'+doc[item].town+'" name="town" />'+
             '<input type="hidden" value="'+doc[item].street1+'" name="street1" />'+
              '<input type="hidden" value="'+doc[item].street2+'" name="street2" />'+
               '<input type="hidden" value="'+doc[item].street2+'" name="street2" />'+
                '<input type="hidden" value="'+doc[item].locationname+'" name="locationname" />'+
            '<input type="hidden" value="'+doc[item].locationid+'" name="locationid" />'+
            '<input type="hidden" value="'+doc[item].currency+'" name="currency" /> <input type="hidden" value="'+doc[item].originbased+'" name="originbased" />  <input type="hidden" value="'+doc[item].country+'" name="scountry" />'
            +'<input type="hidden" value="'+doc[item].zipost+'" name="zippost" /> <input type="hidden" value="'+doc[item].state+'" name="state" /><button>'+doc[item].locationname+'</button> <img src="/image/trash.png" /></div>';
            
             //console.log(dv.querySelector('.loc'));       
             document.getElementById('loc').appendChild(dv);
            
             
            }
            document.querySelector('.pmaterial').style.opacity=0.9;
            document.querySelector('#spin').active=false;
     }
     
   }
   rq.dataurl="/static/countries.json"
  }
  
  function savelocation(event)
  {
    var form =sajax(event.target).closest('form');
    if(form.validate())
    {
    var mod = form.serialize();
    if(form.querySelector('#locationid').value ==="")
    {
      mod.event = 'A';
      delete mod.locationid;
    }
    else
    {
      mod.event='E';
    }
    var country ;
    if(typeof form.querySelector('#country').selectedValue === 'object')
    {
         country = form.querySelector('#country').selectedValue.code;
         form.querySelector('#country').style.border="none";
    }      
    else 
    {
      form.querySelector('#country').style.border="red 1px solid";
     return false;
    }
    mod.country = country;
    if(form.querySelector('#originbased').checked !== true)
    {
      mod.originbased = false;
    }
    var ap = document.getElementById('lc');
    ap.jsonurl = '/store/savelocation';
    ap.respfunc = function(doc){resp(doc, document.getElementById('ptoast'));  getlocations();}
    ap.jsonstring = JSON.stringify(mod);
    ap.submit=false;
    console.log(mod);
    ap.submit=true;
    }
    return false;
  }
  function editloc(event)
  {
    
    var dv = sajax(event.target).closest('div');
   var chk =dv.querySelector('input[name="originbased"]').value;
   console.log(chk);
    //chk = JSON.parse('true');
    var ct = dv.querySelector('input[name="scountry"]').value;
   
    document.getElementById('locationid').value = dv.querySelector('input[name="locationid"]').value;
    document.getElementById('locationname').value = dv.querySelector('input[name="locationname"]').value;
    if(chk !=='null' && chk!=='undefined')  document.getElementById('originbased').checked = JSON.parse(chk);
     document.getElementById('currency').value = dv.querySelector('input[name="currency"]').value;
      document.getElementById('street1').value = dv.querySelector('input[name="street1"]').value;
     document.getElementById('street2').value = dv.querySelector('input[name="street2"]').value;
     document.getElementById('zippost').value = dv.querySelector('input[name="zippost"]').value;
     document.getElementById('town').value = dv.querySelector('input[name="town"]').value;
     document.getElementById('state').value = dv.querySelector('input[name="state"]').value;
      document.getElementById('country').selectedName = ct;
      console.log(ct);
  }
  
  function addLoc(event)
  {
     var f = sajax(event.target).closest('form');
    
     sajax(f).clearForm();
     f.querySelector('#locationid').value =""
  }
  
  //get info to add site to store
  function addsitepage()
  {
     var areq = document.getElementById('areq');
     areq.respfunc = function(doc)
     {
         
           
         var str = JSON.stringify(doc);
        
         var arr = str.split(',');
         
         
         document.getElementById('locales').menuItems = doc;
         areq.dataurl = '/store/getmain';
         areq.respfunc = function(sd)
         {
             document.getElementById('storeid').value = sd._id;
         }
     }
     areq.dataurl = "/store/getlocale";
  }
  
  function saveSite()
  {
      document.getElementById('addsite').jsonurl = '/store/sitesave';
      var sobj =document.getElementById('siteform').serialize();
      sobj.locale = document.getElementById('locales').selectedValue;
      
      document.getElementById('addsite').jsonstring = sobj;
      
      document.getElementById('addsite').respfunc=function(doc){
       if(document.getElementById('defaultsite').checked)
       {  
           document.getElementById('addsite').jsonurl = '/store/setdefaultsite';
           document.getElementById('addsite').jsonstring = {_id:document.getElementById('storeid').value, defaultsite:sobj.siteid, defaultlang:sobj.locale.code}
           document.getElementById('addsite').submit=false;
           document.getElementById('addsite').submit=true;
           document.getElementById('addsite').respfunc = function(doc){resp(doc,document.getElementById('ptoast'));}
       }
       else
         resp(doc,document.getElementById('ptoast'));
       }
      document.getElementById('addsite').submit=false;
      document.getElementById('addsite').submit=true;
  }