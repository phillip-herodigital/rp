
		function Toggle(node)
		{
		   if(!node.nextSibling || !node.nextSibling.children[1])
		   {
		     return;
		   }
		   
		   var section = node.nextSibling.children[1];
		   if(section == null)
		   {
		      return;
		   }
		   
		   var img = null;
		   if( node.children[0] && 
		       node.children[0].children[0] && 
		       node.children[0].children[0].tagName == 'IMG')
		   {
		      img = node.children[0].children[0];
		   }
		   
		   if( section.style.display == 'none')
		   {
		      if( img != null)
		      {
		         img.src = '/sitecore/shell/themes/standard/images/collapse15x15.gif';
		      }
		      section.style.display = '';
		   }
		   else
		   {   
		      if(img != null)
		      {
		         img.src = '/sitecore/shell/themes/standard/images/expand15x15.gif';
		      }
		      section.style.display = 'none';   
		   }
		}

