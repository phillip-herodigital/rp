using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Data.Items;

namespace StreamEnergy.MyStream.Utility
{
    public static class SitecoreItemExtensions
    {
        public static IEnumerable<Item> GetAncestors(this Item item)
        {
            while (item.Parent != null)
            {
                item = item.Parent;
                yield return item;
            }
        }

        public static IEnumerable<Item> GetAncestorsAndSelf(this Item item)
        {
            yield return item;
            foreach (var ancestorItem in GetAncestors(item))
                yield return ancestorItem;
        }

        public static IEnumerable<Item> GetDescendantsAndSelf(this Item item)
        {
            var items = new Stack<Item>();
            items.Push(item);
            do
            {
                var currentItem = items.Pop();
                yield return currentItem;
                foreach (Item childItem in currentItem.Children)
                    items.Push(childItem);
            } while (items.Count > 0);
        }
    }
}