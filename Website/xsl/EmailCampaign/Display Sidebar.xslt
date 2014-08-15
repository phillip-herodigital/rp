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

  <xsl:variable name="sidebarTid" select="'{05BBC0AA-69C3-4838-94B2-6A1D38961406}'"/>

  <!-- entry point -->
  <xsl:template match="*">
    <xsl:for-each select="./item[@tid=$sidebarTid][1]">
      <sc:text field="Sidebar"/>
    </xsl:for-each>
  </xsl:template>

</xsl:stylesheet>
