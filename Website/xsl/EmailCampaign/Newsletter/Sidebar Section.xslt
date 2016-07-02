<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sc="http://www.sitecore.net/sc"
  xmlns:dot="http://www.sitecore.net/dot"
  xmlns:sql="http://www.sitecore.net/sql"
  exclude-result-prefixes="dot sc sql">

  <!-- output directives -->
  <xsl:output method="xml" indent="no" encoding="UTF-8"  />

  <!-- sitecore parameters -->
  <xsl:param name="lang" select="'en'"/>
  <xsl:param name="id" select="''"/>
  <xsl:param name="sc_item"/>
  <xsl:param name="sc_currentitem"/>

  <xsl:variable name="fontFamily" select="'arial,helvetica,sans-serif'" />
  <xsl:variable name="fontSize" select="'11px'" />
  <xsl:variable name="linkStyle" select="'color: black; text-decoration: underline;'" />

  <xsl:variable name="linkTid" select="'{4DF80BE6-AE83-40E4-81B4-480F7B60AE15}'"/>

  <xsl:variable name="bg" select="'~/media/Images/Newsletter/Common/bg_side.ashx'" />
  <xsl:variable name="blue" select="'~/media/Images/Newsletter/Common/blue.ashx'" />

  <xsl:variable name="colorBlue" select="'#517ACC'" />

  <!-- entry point -->
  <xsl:template match="*">
    <xsl:call-template name="showSidebarSection" />
  </xsl:template>

  <xsl:template name="showSidebarSection">
    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="font-family: {$fontFamily}; font-size: {$fontSize};">
      <tr valign="top">
        <!--<xsl:choose>
        <xsl:when test="position()=1">
          <td width="3"><img height="3" width="3" border="0" style="border-color: transparent; display: block;" alt="" src="~/media/Images/Newsletter/Common/blue_left.ashx" /></td>
        </xsl:when>
        <xsl:otherwise>-->
        <td width="3">
          <img height="3" width="3" border="0" style="border-color: transparent; display: block;" alt="" src="{$blue}" />
        </td>
        <!--</xsl:otherwise>
      </xsl:choose>-->

        <td colspan="3" bgcolor="{$colorBlue}" style="font-size: 1px;">&#32;</td>
        <td width="3">
          <img height="3" width="3" border="0" style="border-color: transparent; display: block;" alt="" src="~/media/Images/Newsletter/Common/blue_right.ashx" />
        </td>
      </tr>

      <tr>
        <td colspan="5" bgcolor="{$colorBlue}" height="10">
          <div style="height: 10px; font-size: 1px;">&#32;</div>
        </td>
      </tr>
      <tr>
        <td colspan="2" bgcolor="{$colorBlue}" style="font-size: 1px;">&#32;</td>
        <td bgcolor="{$colorBlue}" style="color: white; font-size: 15px;">
          <sc:text field="Category Title"/>
        </td>
        <td colspan="2" bgcolor="{$colorBlue}" style="font-size: 1px;">&#32;</td>
      </tr>
      <tr>
        <td colspan="5" bgcolor="{$colorBlue}" height="10">
          <div style="height: 10px; font-size: 1px;">&#32;</div>
        </td>
      </tr>
      <tr>
        <td colspan="5" height="10">
          <div style="height: 10px; font-size: 1px;">&#32;</div>
        </td>
      </tr>
      <tr valign="top">
        <td style="font-size: 1px;">&#32;</td>
        <td width="7"><img height="2" width="7" border="0" style="border-color: transparent;" alt="" src="{$bg}" /></td>
        <td>
          <div>
            <sc:text field="Text"/>
          </div>

          <table cellspacing="0" cellpadding="0" border="0" width="100%" style="font-family: {$fontFamily}; font-size: {$fontSize};">
            <xsl:for-each select="./item[@tid=$linkTid]">
              <xsl:if test="position()>1">
                <tr>
                  <td colspan="2">
                    <img height="2" width="169" border="0" style="border-color: transparent; display: block;" alt="" src="~/media/Images/Newsletter/Common/split_hor.ashx" />
                  </td>
                </tr>
              </xsl:if>
              <tr>
                <td colspan="2" height="9">
                  <div style="height: 9px; font-size: 1px;">&#32;</div>
                </td>
              </tr>
              <tr valign="top">
                <td width="10" nowrap="nowrap">
                  <img height="5" width="5" border="0" style="border-color: transparent;" alt="" src="~/media/Images/Newsletter/Common/bullet_blue.ashx" />
                  <img height="9" width="2" border="0" style="border-color: transparent;" alt="" src="{$bg}" />
                </td>
                <td width="160">
                  <sc:link field="Destination" style="{$linkStyle}" >
                    <sc:text field="Text"/>
                  </sc:link>
                </td>
              </tr>
              <tr>
                <td colspan="2" height="9">
                  <div style="height: 9px; font-size: 1px;">&#32;</div>
                </td>
              </tr>
            </xsl:for-each>

            <tr>
              <td colspan="2" height="12">
                <div style="height: 12px; font-size: 1px;">&#32;</div>
              </td>
            </tr>
          </table>
        </td>
        <td width="7"><img height="2" width="7" border="0" style="border-color: transparent;" alt="" src="{$bg}" /></td>
        <td style="font-size: 1px;">&#32;</td>
      </tr>
    </table>
  </xsl:template>

</xsl:stylesheet>