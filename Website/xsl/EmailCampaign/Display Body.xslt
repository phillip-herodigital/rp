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

  <xsl:variable name="contentTid" select="'{197C8A18-C17D-46CB-838D-61E88D7D78FA}'"/>

  <!-- entry point -->
  <xsl:template match="*">
    <xsl:for-each select="./item[@tid=$contentTid][1]">
      <sc:text field="Body"/>
    </xsl:for-each>
  </xsl:template>

</xsl:stylesheet>
