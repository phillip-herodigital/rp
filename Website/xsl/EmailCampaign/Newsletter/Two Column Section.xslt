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
  <xsl:variable name="linkStyle" select="'color: black; font-wight: bold; text-decoration: none;'" />

  <xsl:variable name="leftColumnTid" select="'{E993C33E-06A9-4172-88D8-D694AEF4E6D4}'"/>
  <xsl:variable name="rightColumnTid" select="'{BF8B7B37-1E90-401A-A360-58119C0780B5}'"/>
  <xsl:variable name="linkTid" select="'{4DF80BE6-AE83-40E4-81B4-480F7B60AE15}'"/>

  <xsl:variable name="bg" select="'~/media/Images/Newsletter/Common/bg_white.ashx'" />
  <xsl:variable name="bgSection" select="'~/media/Images/Newsletter/Common/bg_section.ashx'" />
  
  <xsl:variable name="colorGrey" select="'#99A3B7'" />
  <xsl:variable name="colorSilver" select="'#ECEFF4'" />
  
  <!-- entry point -->
  <xsl:template match="*">
    <xsl:call-template name="showTwoColumnSection"/>
  </xsl:template>

  <xsl:template name="showTwoColumnSection">
    <table cellspacing="0" cellpadding="0" border="0" width="100%" style="font-family: {$fontFamily}; font-size: {$fontSize};">
      <tr valign="top">
        <td bgcolor="{$colorSilver}">
          <xsl:for-each select="./item[@tid=$leftColumnTid][1]">
            <xsl:call-template name="showColumn"/>
          </xsl:for-each>
        </td>
        <td width="10">
          <img height="2" width="10" border="0" style="border-color: transparent; display: block;" alt="" src="{$bg}" />
        </td>
        <td bgcolor="{$colorSilver}">
          <xsl:for-each select="./item[@tid=$rightColumnTid][1]">
            <xsl:call-template name="showColumn"/>
          </xsl:for-each>
        </td>
      </tr>
      <tr>
        <td colspan="3" height="18"><div style="height: 18px; font-size: 1px;">&#32;</div></td>
      </tr>
    </table>
  </xsl:template>

  <xsl:template name="showColumn">
    <sc:editFrame Title="Column" Buttons="/sitecore/content/Applications/WebEdit/Edit Frame Buttons/Newsletter/Column">
      <a name="{sc:Replace(@key,' ','')}"></a>
      <table cellspacing="0" cellpadding="0" border="0" width="100%" bgcolor="{$colorSilver}" style="font-family: {$fontFamily}; font-size: {$fontSize};">
        <tr>
          <td bgcolor="white" style="font-size: 1px;">&#32;</td>
          <td width="7" bgcolor="white">
            <img height="2" width="7" border="0" style="border-color: transparent;" alt="" src="{$bg}" />
          </td>
          <td bgcolor="white">
            <img height="2" width="170" border="0" style="border-color: transparent; display: block;" alt="" src="~/media/Images/Newsletter/Common/white_line.ashx" />
          </td>
          <td width="7" bgcolor="white">
            <img height="2" width="7" border="0" style="border-color: transparent;" alt="" src="{$bg}" />
          </td>
          <td bgcolor="white" style="font-size: 1px;">&#32;</td>
        </tr>
        <xsl:call-template name="showSectionHeader"/>
        <tr>
          <td colspan="5" height="14">
            <div style="height: 14px; font-size: 1px;">&#32;</div>
          </td>
        </tr>
        <tr valign="top">
          <td colspan="2" style="font-size: 1px;">&#32;</td>
          <td>
            <table cellspacing="0" cellpadding="0" border="0" width="100%" bgcolor="{$colorSilver}" style="font-family: {$fontFamily}; font-size: {$fontSize};">
              <tr valign="top">
                <td>
                  <div>
                    <sc:image field="Image" border="0" style="display: block;" />
                  </div>
                </td>
                <xsl:choose>
                  <xsl:when test="sc:pageMode()/pageEditor/edit=false() and sc:pageMode()/pageEditor/navigate = false() and sc:fld('Image',.)=''">
                    <td width="1" style="font-size: 1px;">&#32;</td>
                  </xsl:when>
                  <xsl:otherwise>
                    <td width="10">
                      <img height="2" width="10" border="0" style="border-color: transparent; display: block;" alt="" src="{$bgSection}" />
                    </td>
                  </xsl:otherwise>
                </xsl:choose>
                <td width="100%">
                  <div style="font-size: 14px; color: #CC0000;">
                    <sc:text field="Title"/>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="3">
                  <div>
                    <sc:text field="Text"/>
                  </div>
                  <xsl:call-template name="showLinks">
                    <xsl:with-param name="bgSrc" select="$bgSection"/>
                  </xsl:call-template>
                </td>
              </tr>
            </table>
          </td>
          <td colspan="2" style="font-size: 1px;">&#32;</td>
        </tr>
        <tr>
          <td colspan="5" height="14">
            <div style="height: 14px; font-size: 1px;">&#32;</div>
          </td>
        </tr>
      </table>
    </sc:editFrame>
  </xsl:template>

  <xsl:template name="showSectionHeader">
    <tr valign="top">
      <td width="3"><img height="3" width="3" border="0" style="border-color: transparent; display: block;" alt="" src="~/media/Images/Newsletter/Common/grey_left.ashx" /></td>
      <td colspan="3" bgcolor="{$colorGrey}" style="font-size: 1px;">&#32;</td>
      <td width="3"><img height="3" width="3" border="0" style="border-color: transparent; display: block;" alt="" src="~/media/Images/Newsletter/Common/grey_right.ashx" /></td>
    </tr>
    <tr>
      <td colspan="5" bgcolor="{$colorGrey}" height="10"><div style="height: 10px; font-size: 1px;">&#32;</div></td>
    </tr>
    <tr>
      <td colspan="2" bgcolor="{$colorGrey}" style="font-size: 1px;">&#32;</td>
      <td bgcolor="{$colorGrey}" style="color: white; font-size: 15px;"><sc:text field="Category Title"/></td>
      <td colspan="2" bgcolor="{$colorGrey}" style="font-size: 1px;">&#32;</td>
    </tr>
    <tr>
      <td colspan="5" bgcolor="{$colorGrey}" height="10"><div style="height: 10px; font-size: 1px;">&#32;</div></td>
    </tr>    
  </xsl:template>

  <xsl:template name="showLinks">
    <xsl:param name="bgSrc" select="''"/>

    <table cellspacing="2" cellpadding="0" border="0" style="font-family: {$fontFamily}; font-size: {$fontSize};">
      <xsl:for-each select="./item[@tid = $linkTid]">
        <tr valign="top">
          <td>
            <xsl:choose>
              <xsl:when test="sc:pageMode()/pageEditor/edit=false()">
                <sc:link field="Destination" style="{$linkStyle}" >
                  <b style="color: #CC0000; font-size: 12px;">></b>
                </sc:link>
              </xsl:when>
              <xsl:otherwise>
                <b style="color: #CC0000; font-size: 12px;">></b>
              </xsl:otherwise>
            </xsl:choose>
          </td>
          <td>
            <sc:link field="Destination" style="{$linkStyle}" >
              <span style="text-decoration:underline;">
                <b>
                  <sc:text field="Text"/>
                </b>
              </span>
            </sc:link>
          </td>
        </tr>
      </xsl:for-each>
    </table>
  </xsl:template>

</xsl:stylesheet>