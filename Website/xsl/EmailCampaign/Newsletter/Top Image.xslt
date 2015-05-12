<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sc="http://www.sitecore.net/sc"
  xmlns:dot="http://www.sitecore.net/dot"
  xmlns:sql="http://www.sitecore.net/sql"
  exclude-result-prefixes="dot sc sql">

  <!-- output directives -->
  <xsl:output method="html" indent="no" encoding="UTF-8"  />

  <!-- sitecore parameters -->
  <xsl:param name="lang" select="'en'"/>
  <xsl:param name="id" select="''"/>
  <xsl:param name="sc_item"/>
  <xsl:param name="sc_currentitem"/>

  <!-- entry point -->
  <xsl:template match="*">
    <xsl:choose>
      <xsl:when test="sc:fld('Image',.) = ''">
        <div style="height:108px; background: #2f9bce;">
          <sc:image field="Image" style="display:block;"/>
          <xsl:if test="sc:pageMode()/pageEditor/edit = false() and sc:pageMode()/pageEditor/navigate = false()">
            <div align="left" style="height:40px; font-size:13px; color: #EFEFEF; padding: 45px 0px 0px 6px;">[Add an image here]</div>
          </xsl:if>
        </div>
      </xsl:when>
      <xsl:otherwise>
        <div>
          <sc:image field="Image" style="display:block;"/>
        </div>
      </xsl:otherwise>
    </xsl:choose>      
  </xsl:template>

</xsl:stylesheet>