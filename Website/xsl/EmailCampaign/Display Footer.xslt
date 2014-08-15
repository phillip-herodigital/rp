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

  <xsl:variable name="footerTid" select="'{A5B51631-4357-45EE-B2B8-99502F351324}'"/>

  <!-- entry point -->
  <xsl:template match="*">
    <xsl:if test="ecm:IsFullMessage()">
     <hr color="#e0e0e0" />
     <sc:text field="Footer" select="./item[@tid=$footerTid][1]"/>
     <hr color="#e0e0e0" />
    </xsl:if>
  </xsl:template>

</xsl:stylesheet>
