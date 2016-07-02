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

  <xsl:variable name="contentSectionsTid" select="'{050C8A20-E616-47A1-85D1-B11A0025F869}'"/>
  <xsl:variable name="categorySectionTid" select="'{45FEE688-EB4E-4F42-92B3-374062DE5F3E}'"/>  
  <xsl:variable name="twoColumnSectionTid" select="'{6D150B82-2E53-45CB-A63F-CD97E55CF9FC}'"/>  
  <xsl:variable name="autoOverviewTid" select="'{D8A016F6-E604-4CA1-BC26-A575AE563141}'"/>

  <xsl:variable name="bg" select="'~/media/Images/Newsletter/Common/bg_side.ashx'" />
  <xsl:variable name="bgRed" select="'~/media/Images/Newsletter/Common/bg_red.ashx'" />
  
  <xsl:variable name="colorRed" select="'#CC0000'" />

  <!-- entry point -->
  <xsl:template match="*">
    <xsl:call-template name="showAutoOverview" />
  </xsl:template>

  <xsl:template name="showAutoOverview">
    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="font-family: {$fontFamily}; font-size: {$fontSize};">
      <tr valign="top">
        <td width="3"><img height="3" width="3" border="0" style="border-color: transparent; display: block;" alt="" src="~/media/Images/Newsletter/Common/red_left.ashx" /></td>
        <td width="7" bgcolor="{$colorRed}"><img height="2" width="7" border="0" style="border-color: transparent; display: block;" alt="" src="{$bgRed}" /></td>
        <td bgcolor="{$colorRed}" style="font-size: 1px;">&#32;</td>
        <td width="7" bgcolor="{$colorRed}"><img height="2" width="7" border="0" style="border-color: transparent; display: block;" alt="" src="{$bgRed}" /></td>
        <td width="3"><img height="3" width="3" border="0" style="border-color: transparent; display: block;" alt="" src="~/media/Images/Newsletter/Common/red_right.ashx" /></td>
      </tr>
      <tr>
        <td colspan="5" bgcolor="{$colorRed}" height="10">
          <div style="height: 10px; font-size: 1px;">&#32;</div>
        </td>
      </tr>
      <tr>
        <td colspan="2" bgcolor="{$colorRed}" style="font-size: 1px;">&#32;</td>
        <td bgcolor="{$colorRed}" style="color: white; font-size: 15px;">
          <sc:text field="Category Title"/>
        </td>
        <td colspan="2" bgcolor="{$colorRed}" style="font-size: 1px;">&#32;</td>
      </tr>
      <tr>
        <td colspan="5" bgcolor="{$colorRed}" height="10">
          <div style="height: 10px; font-size: 1px;">&#32;</div>
        </td>
      </tr>
      <tr>
        <td colspan="5" align="right">
          <img height="12" width="33" border="0" style="border-color: transparent; display: block;" alt="" src="~/media/Images/Newsletter/Common/top_side.ashx" />
        </td>
      </tr>
      <tr>
        <td colspan="5" height="10">
          <div style="height: 10px; font-size: 1px;">&#32;</div>
        </td>
      </tr>
      <tr valign="top">
        <td colspan="2" style="font-size: 1px;">&#32;</td>
        <td>
          <div style="font-size: 12px;">
            <b>
              <sc:text field="Title"/>
            </b>
          </div>
          <div>
            <sc:text field="Text"/>
          </div>

          <table cellspacing="0" cellpadding="0" border="0" width="100%" style="font-family: {$fontFamily}; font-size: {$fontSize};">
            <tr>
              <td colspan="2" height="4">
                <div style="height: 4px; font-size: 1px;">&#32;</div>
              </td>
            </tr>

            <xsl:for-each select="../../item[@tid=$contentSectionsTid][1]/item[@tid!=$autoOverviewTid]">
              <xsl:choose>
                <xsl:when test="@tid=$twoColumnSectionTid or @tid=$categorySectionTid">
                  <xsl:for-each select="./item">
                    <xsl:call-template name="showTopicLink" />
                  </xsl:for-each>
                </xsl:when>
                <xsl:otherwise>
                  <xsl:call-template name="showTopicLink" />
                </xsl:otherwise>
              </xsl:choose>
            </xsl:for-each>

            <tr>
              <td colspan="2" height="12"><div style="height: 12px; font-size: 1px;">&#32;</div></td>
            </tr>
          </table>
        </td>
        <td colspan="2" style="font-size: 1px;">&#32;</td>
      </tr>
    </table>
  </xsl:template>

  <xsl:template name="showTopicLink">
    <tr valign="top">
      <td width="10" nowrap="nowrap">
        <img height="5" width="5" border="0" style="border-color: transparent;" alt="" src="~/media/Images/Newsletter/Common/bullet_red.ashx" />
        <img height="9" width="2" border="0" style="border-color: transparent;" alt="" src="{$bg}" />
      </td>
      <td width="160">
        <a style="{$linkStyle}" href="#{sc:Replace(@key,' ','')}" target="_self">
          <xsl:value-of select="sc:field('Title',.)" disable-output-escaping="yes"/>
        </a>
      </td>
    </tr>
    <tr>
      <td colspan="2" height="8"><div style="height: 8px; font-size: 1px;">&#32;</div></td>
    </tr>
  </xsl:template>  

</xsl:stylesheet>