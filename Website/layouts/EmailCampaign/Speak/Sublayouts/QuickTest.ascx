<%@ Control Language="c#" AutoEventWireup="true" CodeBehind="QuickTest.ascx.cs" Inherits="Sitecore.Modules.EmailCampaign.Speak.Sublayouts.QuickTest" %>
<%@ Import Namespace="Sitecore.Modules.EmailCampaign.Core" %>
<%@ Import Namespace="Sitecore.Modules.EmailCampaign.Speak.Web.Core" %>
<%@ Register TagPrefix="sc" Namespace="Sitecore.Modules.EmailCampaign.Speak.Web.UI.WebControls" Assembly="Sitecore.EmailCampaign.App" %>

<script type="text/javascript">
    function ecmQuickTestSelectAllVariants() {
        var selectVariantGroup = $('#quickTestTopPanel').find('.select-variant-group');
        if (selectVariantGroup == null) {
            return;
        }
        selectVariantGroup.find('.abn-button').addClass('abn-button-active');

        var value = '';

        selectVariantGroup.find('.abn-button-active').each(function () { value += (value.length === 0 ? '' : ',') + $(this).index(); });
        selectVariantGroup.find('input:first').val(value);
    };


    function ecmQuickTestUpdateSelectedVariant(sender) {
        var parent = sender == null ? $('#quickTestTopPanel').find('.abn-button:first').parent() : $(sender).parent();

        var variantToTest = $('#variantToTest');
        var preview = variantToTest.children('div:first');
        preview.empty();
        parent.children('.abn-button-active').each(function () { preview.append($(this).html()); });
        if (preview.is(':empty')) {
            variantToTest.children('span:first').hide();
        } else {
            variantToTest.children('span:first').show();
        }
    };

    $(document).ready(function () {
        ecmQuickTestSelectAllVariants();
        ecmQuickTestUpdateSelectedVariant(null);

        $('#<%= this.TestAddress.ClientID %>').live("keydown", function (e) {
            if (e.keyCode == '13') {
                $('#<%= this.SendTest.ClientID %>').click();
                return false;
            }

            return true;
        });
    });

    
</script>
<asp:UpdatePanel ID="QuickTestUpdatePanel" UpdateMode="Conditional" runat="server">
    <ContentTemplate>
        <div id="quickTestTopPanel" class="review-top-panel">
            <sc:SelectVariantGroup ID="VariantsList" OnClientClick="ecmQuickTestUpdateSelectedVariant(this);"
                CssClass="select-variant-group" runat="server" />
            <asp:Panel ID="PreviewPanel" runat="server" class="preview-panel">
                <div>
                    <span><%=EcmTexts.Localize(EcmSpeakTexts.EnterEmailsSeparatedByComma)%></span>
                    <br/>
                    <asp:TextBox ID="TestAddress" CssClass="test-address" Style="width: 450px; margin-top: 1px;" runat="server" />
                    <asp:Button ID="SendTest" CssClass="sc-button sc-button-important" Text="Send" UseSubmitBehavior="false"
                        OnClientClick="$(this).attr('disabled','disabled').next().show();" OnClick="SendTestClick"
                        Style="margin-left: 8px;" Enabled="True" runat="server" />
                    <div style="float: right; display: none; margin-top: 4px; margin-right: 4px;">
                        <img src="/sitecore/apps/img/sc-spinner16.gif" height="16" width="16" style="vertical-align: bottom;" />
                        <span>
                            <%=EcmTexts.Localize(EcmSpeakTexts.Sending)%></span>
                    </div>
                </div>
                <div id="variantToTest" class="selcted-variant">
                    <span style="display: none;">
                        <%=EcmTexts.Localize(EcmSpeakTexts.SendVariants)%></span>
                    <div style="display: inline;">
                    </div>
                </div>
            </asp:Panel>
        </div>
    </ContentTemplate>
</asp:UpdatePanel>
