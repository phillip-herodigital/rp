<%@ Page Language="C#" AutoEventWireup="true" MasterPageFile="Popup.Master" %>

<%@ Register TagPrefix="sc" Namespace="Sitecore.Web.UI.WebControls" Assembly="Sitecore.Client.Extensions" %>


    <asp:Content ID="title" ContentPlaceHolderID="title" runat="server">
        
        {{if title}}${title}{{else}}<span class="ui-dialog-title">&nbsp;</span>{{/if}}
    </asp:Content>
    <asp:Content ID="content" ContentPlaceHolderID="content" runat="server">
        {{if details}}
            <div class="ui-dialog-main-content">
                <div>
                    {{if icon}}<img src="${icon}" class="confirmation-icon" />{{/if}}
                
                        <div class="confirmation-content">
                            <div class="confirmation-details">
                                {{html details}}
                            </div>
                        </div>
                 </div>
            </div>
        {{/if}}
    </asp:Content>
    <asp:Content ID="buttons" ContentPlaceHolderID="buttons" runat="server">
        {{if yes}}<input type="button" class="sc-button sc-button-important" value="${yes}" id="yes" name="yes" onclick="__doPostBack('yes','');return false;" data-event-ajax="true" />{{/if}}
        {{if no}}<input type="button" class="sc-button" value="${no}" id="no" name="no" onclick="__doPostBack('no','');return false;" data-event-ajax="true" />{{/if}}
        {{if cancel}}<input type="button" class="sc-button" id="cancel" value="${cancel}" onclick="__doPostBack('cancel','');return false;" name="cancel" data-event-ajax="true" />{{/if}}
    </asp:Content>
