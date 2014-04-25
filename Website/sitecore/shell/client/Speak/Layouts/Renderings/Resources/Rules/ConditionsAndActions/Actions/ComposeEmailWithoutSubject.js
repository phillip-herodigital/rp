define([], function () {
  var action = function (context, args) {
   var targetDisplayTextID = context.app[args.targetDisplayTextID],
	   targetAdressID = context.app[args.targetAdressID], 
	   targetSubjectID = context.app[args.targetSubjectID], 
	   targetStyleID = context.app[args.targetStyleID],
	   templateWithoutSubject = "<link text='<%=displayText%>' linktype='mailto' style='<%=style%>' url='mailto:<%=emailAddress%>'  title='' />"; 
	   
	   
   if (!targetDisplayTextID || !targetAdressID || !targetStyleID) {
		console.log("Some of the target controls were not found");
		return false;
	}  
	
	var mailLink = _.template(templateWithoutSubject,{
                    displayText: targetDisplayTextID.get("text"),
                    emailAddress: targetAdressID.get("text"),
                    style: targetStyleID.get("text")
                });
				
    context.app.closeDialog(mailLink);
  };

  return action;
});
