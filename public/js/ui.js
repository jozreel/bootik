//create elements dynamically based on fields created via frontend
function createElements(elcol)
{
	
}

function createattrfromelements(req,lbar,cont, url)
{
	var cont = document.querySelector(cont);
	document.querySelector('.sp').style.display='block';
    document.querySelector('.sp').active=true;
	document.querySelector(req).respfunc = function(doc)
	{
    if(doc.length >0)
    {
    var lbare = document.querySelector(lbar);
	lbare.innerHTML ="";
	 for(var it in doc)
	 {
         document.querySelector('#page'+it).innerHTML="";
		 var str ="";
		
		 var dd= doc[it];
		
		var fsets = dd.fields;
		lbare.innerHTML +='<li onclick="seltab('+it+')"><p>'+dd.setname+'</p></li>';
		for(var st in fsets)
		{
		  var ele = fsets[st];
		  str+=createpaperelements(ele);
		
		}
        document.querySelector('#page'+it).innerHTML = str;
		
	
	 
	// cont.innerHTML+=str; 
	 }
     id = document.getElementById('_id').value;
     
     if(id.value !== '')
             populateproduct(false);
     }
	 document.querySelector('.sp').active=false;
     document.querySelector('.sp').style.display='none';
    // document.querySelector('.invisible').style.opacity='1';
    document.getElementById('pg').classList.remove('invisible');
     document.getElementById('pg').style.opacity = 0.9;
     
	}
	document.querySelector(req).dataurl = url;
}

function createpaperelements(ele)
{
	var str='<div class="dels">';
	      if(ele.fiedtype==='text')
		   {
			   str +='<paper-input name="'+ele.fieldname+'" id="'+ele.fieldname+'" value="'+ele.Default+'" required ="'+ele.required+'" label="'+ele.label+'"></paper-input>';
		   }
		  else if(ele.fiedtype==='textarea')
		   {
			    str +='<paper-textarea name="'+ele.fieldname+'" id="'+ele.fieldname+'" value="'+ele.Default+'" required ="'+ele.required+'" label="'+ele.label+'"></paper-textarea>';
		   }
		   else if(ele.fiedtype==='date')
		   {
			   str +='<p>'+ele.label+': </p><paper-input name="'+ele.fieldname+'" id="'+ele.fieldname+'" value="'+ele.Default+'" required ="'+ele.required+'"  type="date"></paper-input>';
		   }
		  else  if(ele.fiedtype==='number')
		   {
			   str +='<paper-input name="'+ele.fieldname+'" id="'+ele.fieldname+'" value="'+ele.Default+'" required ="'+ele.required+'" label="'+ele.label+'" type="number"></paper-input>';
		   }
		   else if(ele.fiedtype==='drodown')
		   {
              
			   str +='<p>'+ele.labels[0].labelvalue+'</p><select name="'+ele.fieldname+'" id="'+ele.fieldname+'" required ="'+ele.required+'">';
			    for(var opt in ele.options)
                {
                    
			     str +='<option value="'+ele.options[opt].optionvalue+'"  >'+ele.options[opt].languages[0].labelvalue+'</option>';
                }
			str+='</select>'
		   }
           else if(ele.fiedtype==='multiselect')
		   {
               
			   str +='<p>'+ele.labels[0].labelvalue+'</p><select class="multiple" name="'+ele.fieldname+'" size="4" multiple id="'+ele.fieldname+'" required ="'+ele.required+'">';
			    for(var opt in ele.options)
                {
                    
			     str +='<option value="'+ele.options[opt].optionvalue+'"  >'+ele.options[opt].languages[0].labelvalue+'</option>';
                }
                str+='</select>'
           }
           else if(ele.fiedtype==='boolean')
		   {
                  str +='<p>'+ele.labels[0].labelvalue+'</p><select  name="'+ele.fieldname+'" id="'+ele.fieldname+'" required ="'+ele.required+'"><option value="true">Yes</option><option value="false">No</option>';
                  str +='</select>';
          }
           else if(ele.fiedtype==='email')
		   {
              
              str +='<gold-email-input name="'+ele.fieldname+'" id="'+ele.fieldname+'" value="'+ele.Default+'" required ="'+ele.required+'" label="'+ele.label+'" ></gold-email-input>';   
           }
           else if(ele.fiedtype==='file')
		   {
               str+='<file-select multi></file-select>';
           }
		   return str; 
	
}
