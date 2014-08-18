﻿<?xml version="1.0" encoding="UTF-8"?>
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
      <xsl:when test="$sc_currentitem[@tid='{3F12D78C-B7B7-4157-98FC-DA3322EE1A5B}']">
        <xsl:comment>TargetItem:<xsl:value-of select="$sc_currentitem/@id" /></xsl:comment>
      </xsl:when>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>