define([], function () {
  var action = function (context, args) {
    var targetDisplayTextID = context.app[args.targetDisplayTextID],
      targetAnchorID = context.app[args.targetAnchorID],
      targetAltTextID = context.app[args.targetAltTextID],
      targetStyleID = context.app[args.targetStyleID],
      targetWindowID = context.app[args.targetWindowID],
      template = "<link text='<%=text%>' linktype='anchor' anchor='<%=anchor%>' title='<%=alternateText %>' class='<%=style%>' />",
      targetWindowValue, hyperLink,
      emptyOptionID = "{A3C9DB39-1D1B-4AA1-8C68-7B9674D055EE}";

    hyperLink = _.template(template, {
      text: targetDisplayTextID.get("text"),
      style: targetStyleID.get("text"),
      alternateText: targetAltTextID.get("text"),
      anchor: targetAnchorID.get("text")
    });

    context.app.closeDialog(hyperLink);
  };

  return action;
});
