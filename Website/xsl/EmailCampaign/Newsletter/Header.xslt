<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sc="http://www.sitecore.net/sc"
  xmlns:dot="http://www.sitecore.net/dot"
  xmlns:sql="http://www.sitecore.net/sql"
  xmlns:ecm="http://www.sitecore.net/ecm"
  exclude-result-prefixes="dot sc sql ecm">

  <!-- output directives -->
  <xsl:output method="html" indent="no" encoding="UTF-8"  />

  <!-- sitecore parameters -->
  <xsl:param name="lang" select="'en'"/>
  <xsl:param name="id" select="''"/>
  <xsl:param name="sc_item"/>
  <xsl:param name="sc_currentitem"/>

  <xsl:variable name="linkStyle" select="'color: #C73318; text-decoration:underline;'" />

  <!-- entry point -->
  <xsl:template match="*">
    <xsl:choose>
      <xsl:when test="ecm:IsFullMessage() and $sc_currentitem[@tid='{3F12D78C-B7B7-4157-98FC-DA3322EE1A5B}']">
        <div>
          <sc:text field="Text"/>
          <xsl:text>&#32;</xsl:text>
          <xsl:choose>
            <xsl:when test="sc:pageMode()/pageEditor/edit">
              <xsl:choose>
                <xsl:when test="sc:fld('Link to Self',.)='1'">
                  <span style="{$linkStyle}">
                    <sc:text field="Link Text"/>
                  </span>
                </xsl:when>

                <xsl:otherwise>
                  <sc:link field="Destination" style="{$linkStyle}">
                    <sc:text field="Link Text"/>
                  </sc:link>
                </xsl:otherwise>
              </xsl:choose>
            </xsl:when>

            <xsl:otherwise>
              <xsl:choose>
                <xsl:when test="sc:fld('Link to Self',.)='1'">
                  <a href="/?sc_itemid={../@id}&amp;sc_lang={$lang}&amp;sc_pd_view=1" style="{$linkStyle}">
                    <sc:text field="Link Text" style="{$linkStyle}"/>
                  </a>
                </xsl:when>

                <xsl:otherwise>
                  <a href="/?sc_itemid={sc:fld('Destination',.,'id')}" >
                    <sc:text field="Link Text" style="{$linkStyle}"/>
                  </a>
                </xsl:otherwise>
              </xsl:choose>
            </xsl:otherwise>
          </xsl:choose>
        </div>
      </xsl:when>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>