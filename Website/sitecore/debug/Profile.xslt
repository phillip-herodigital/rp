<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<!-- output directives -->
<xsl:output method="html" indent="no" encoding="UTF-8"  />

<!-- entry point -->
<xsl:template match="*">
  <style>
    #SitecoreProfile td {
      font:8pt tahoma;
    }
  </style>

  <xsl:variable name="total" select="sum(/profile/operation/@total)"/>

  <div id="SitecoreProfile" style="font:8pt tahoma; background:white; text-align:left">

    <div style="background:#C7C5B2; color:black; padding:2px; margin:16px 0px 8px 0px; font:10pt verdana">
      Hot Spots
    </div>

    <div style="padding:0px 0px 4px 0px">
      <span style="background:#6487DC; padding:2px 8px 2px 8px; color:white">
        <b>Most Time Taken:</b>
      </span>
    </div>

    <table border="0" cellpadding="4" cellspacing="0" style="font:8pt tahoma">
    
      <xsl:for-each select="//operation">
        <xsl:sort select="@own" order="descending" data-type="number"/>
        
        <xsl:if test="position() &lt; 4">
          <tr>
            <td>
              <div style="border:1px solid black; height:10px; width:50px; font:1px tahoma">
                <div style="background:#8CAAE6; height:100%; width:{round((number(@own) div number($total)) * 100)}%">
                </div>
              </div>
            </td>
            <td style="font-weight:bold;color:#6487DC" align="right"><xsl:value-of select="format-number((number(@own) div number($total)) * 100, '#,##0.0')"/>%</td>
            <td align="right">
              <xsl:value-of select="format-number(number(@own) div 1000, '#,##0.000')"/>
              ms
            </td>
            <td style="font-weight:bold">
              <xsl:value-of select="@name"/>
            </td>
          </tr>
        </xsl:if>
        
      </xsl:for-each>
      
    </table>

    <div style="padding:16px 0px 4px 0px">
      <span style="background:#6487DC; padding:2px 8px 2px 8px; color:white">
        <b>Most Items Read:</b>
      </span>
    </div>

    <table border="0" cellpadding="4" cellspacing="0" style="font:8pt tahoma">

      <xsl:for-each select="//operation">
        <xsl:sort select="@itemsread" order="descending" data-type="number"/>

        <xsl:if test="position() &lt; 4">
          <tr>
            <td style="font-weight:bold;color:#6487DC" align="right">
              <xsl:value-of select="format-number(number(@itemsread), '#,##0')"/>
            </td>
            <td style="font-weight:bold">
              <xsl:value-of select="@name"/>
            </td>
          </tr>
        </xsl:if>

      </xsl:for-each>

    </table>


    <div style="background:#C7C5B2 ; color:black; padding:2px; margin:16px 0px 8px 0px; font:10pt verdana">
      Profile
    </div>
    
    <table border="0" cellpadding="4" cellspacing="0" style="font:8pt tahoma">
      <col />
      <col />
      <col />
      <col />

      <col align="right"/>
      <col align="right" />
      <col align="right" />
      <col align="right" />
      <tr style="background:#6487DC; color:white; font-weight:bold">
        <td colspan="2">Time</td>
        <td>Action</td>
        <td align="center">Total</td>
        <td align="center">Own</td>
        <td align="center">Items Read</td>
        <td align="center">Data Cache Misses</td>
        <td align="center">Data Cache Hits</td>
        <td align="center">Physical Reads</td>
      </tr>
      <xsl:apply-templates select="/profile/node()" mode="line">
        <xsl:with-param name="indent" select="0"/>
        <xsl:with-param name="total" select="$total"/>
      </xsl:apply-templates>

      <tr>
        <td colspan="2"></td>
        <td>
          <b>Total (including debug collection)</b>
        </td>
        <td align="right">
          <xsl:value-of select="format-number(number($total) div 1000, '#,##0.000')"/>
          ms
        </td>
        <td align="center"></td>
        <td align="center"></td>
        <td align="center"></td>
        <td align="center"></td>
        <td align="center"></td>
      </tr>
    </table>

  </div>
  
</xsl:template>

<xsl:template match="*" mode="line">
  <xsl:param name="indent" select="0"/>
  <xsl:param name="total" select="1"/>

  <tr>
    <td style="border-bottom:1px solid #e9e9e9">
      <div style="border:1px solid black; height:10px; width:50px; font:1px tahoma">
        <div style="background:#8CAAE6; height:100%; width:{round((number(@own) div number($total)) * 100)}%">
        </div>
      </div>
    </td>
    <td style="font-weight:bold;color:#6487DC;border-bottom:1px solid #e9e9e9" align="right"><xsl:value-of select="format-number((number(@own) div number($total)) * 100, '#,##0.0')"/>%</td>
    <td style="font-weight:bold;border-bottom:1px solid #e9e9e9;padding:0px 0px 0px {number($indent) * 16}px"><xsl:value-of select="@name"/></td>
    <td align="right" style="border-bottom:1px solid #e9e9e9; padding:4px 4px 4px 16px"><xsl:value-of select="format-number(number(@total) div 1000, '#,##0.000')"/>
      ms</td>
    <td align="right" style="border-bottom:1px solid #e9e9e9; padding:4px 4px 4px 16px"><xsl:value-of select="format-number(number(@own) div 1000, '#,##0.000')"/>
      ms</td>
    <td align="right" style="border-bottom:1px solid #e9e9e9">
      <xsl:value-of select="format-number(number(@itemsread), '#,##0')"/>
    </td>
    <td align="right" style="border-bottom:1px solid #e9e9e9">
      <xsl:value-of select="format-number(number(@datacachemisses), '#,##0')"/>
    </td>
    <td align="right" style="border-bottom:1px solid #e9e9e9">
      <xsl:value-of select="format-number(number(@datacachehits), '#,##0')"/>
    </td>
    <td align="right" style="border-bottom:1px solid #e9e9e9">
      <xsl:value-of select="format-number(number(@physicalReads), '#,##0')"/>
    </td>
  </tr>
  
  <xsl:apply-templates select="node()" mode="line">
    <xsl:with-param name="indent" select="$indent + 1"/>
    <xsl:with-param name="total" select="$total"/>
  </xsl:apply-templates>

</xsl:template>

</xsl:stylesheet>

