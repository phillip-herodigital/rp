/*************************************************
* Draggable: represents draggable copy of event
**************************************************/
function Draggable()
{
   this.Init(null, null);
}

Draggable.prototype.Dispose = function()
{
   this.element = null;
   this.phantom = null;
}

Draggable.prototype.Init = function(element, phantom)
{
   this.element = element;
   this.phantom = phantom;
}

Draggable.prototype.IsDragging = function()
{
   return this.phantom != null;
}

