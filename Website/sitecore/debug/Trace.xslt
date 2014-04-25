<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <!-- output directives -->
  <xsl:output method="html" indent="no" encoding="UTF-8"  />

  <!-- entry point -->
  <xsl:template match="*">
    <style>
      #SitecoreTrace td {
      font:8pt tahoma;
      }
    </style>

    <xsl:variable name="total" select="sum(/trace/*/@elapsed)"/>
    <xsl:variable name="processingtotal" select="sum(/trace/*[local-name()!='debuginfo' and message!='Profile rendered to output.' and message!='Profile saved.']/@elapsed)"/>
    <xsl:variable name="debugtotal" select="sum(/trace/*[local-name()='debuginfo']/@elapsed)"/>

    <div id="SitecoreTrace" style="font:8pt tahoma; background:white; text-align:left">

      <table border="0" cellpadding="4" cellspacing="0" style="font:8pt tahoma">
        <tr style="background:#6487DC; color:white; font-weight:bold">
          <td>Type</td>
          <td>Action</td>
          <td>Elapsed since last entry</td>
          <td>Elapsed since start</td>
        </tr>

        <xsl:apply-templates select="/trace/*" mode="line" />

        <tr>
          <td style="border-top:1px solid #666666"></td>
          <td>
            <b>Total</b>
          </td>
          <td align="right">
            <b>
              <xsl:value-of select="format-number(number($total) div 1000, '#,##0.00')"/>
              ms
            </b>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <b>Total (without debug and profile information)</b>
          </td>
          <td align="right">
            <b>
              <xsl:value-of select="format-number(number($processingtotal) div 1000, '#,##0.00')"/>
              ms
            </b>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <b>Debug collection time</b>
          </td>
          <td align="right">
            <b>
              <xsl:value-of select="format-number(number($debugtotal) div 1000, '#,##0.00')"/>
              ms
            </b>
          </td>
        </tr>
      </table>

    </div>
  </xsl:template>

  <xsl:template match="*" mode="line">
    <tr>
      <xsl:if test="position() mod 2 = 1">
        <xsl:attribute name="style">background:#EDF2FC</xsl:attribute>
      </xsl:if>

      <td valign="top">
        <xsl:if test="local-name() = 'error'">
          <font color="red">
            <b>Error</b>
          </font>
        </xsl:if>
        <xsl:if test="local-name() = 'warning'">
          <font color="gold">
            <b>Warning</b>
        </font>
        </xsl:if>
      </td>
      
      <td style="padding:4px 4px 4px {number(@indent) * 16}px" valign="top">
        <div>
          <b>
            <xsl:value-of select="message" disable-output-escaping="yes"/>
          </b>
        </div>
        <xsl:if test="details">
          <div style="padding:2px 0px 2px 16px; color:#666666">
            <xsl:value-of select="details" disable-output-escaping="yes"/>
          </div>
        </xsl:if>
      </td>

      <td align="right" valign="top" style="color:#666666">
        <xsl:value-of select="format-number(number(@elapsed) div 1000, '#,##0.00')"/>
        ms
      </td>

      <td align="right" valign="top" style="color:#666666">
        <xsl:value-of select="format-number(number(@sincestart) div 1000, '#,##0.00')"/>
        ms
      </td>
    </tr>

  </xsl:template>

</xsl:stylesheet>

