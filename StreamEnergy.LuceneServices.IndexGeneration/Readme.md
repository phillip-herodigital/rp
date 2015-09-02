# Address Lookup Index Generator

The Address Lookup Index Generator (StreamEnergy.LuceneServices.IndexGeneration.exe) is a command-line utility designed to generate a Lucene index for the address lookup service based on ERCOT files. 

It is intended to run as TWO separate Windows Scheduled Tasks (but can be called directly from the command line).

## TL;DR

If you want to test locally but don't want to read the entire document:

* `StreamEnergy.LuceneServices.IndexGeneration.exe -d` to download the ERCOT sda.
* `StreamEnergy.LuceneServices.IndexGeneration.exe -g` to generate the index and zip it up.

## Further Details

1. Check the App.config and salt to taste.  Make sure you declare folders that exist and can be written to.
  - You will need to get the Georgia data csv file 'Meters At Active Premises.csv' and put it somewhere the process can access.  This file's location is declared in the config as 'MetersAtActivePremisesCsv'.  This file is used in the AGLC process.
2. Download the AGLC Self-Decrypting Archive via: `StreamEnergy.LuceneServices.IndexGeneration.exe -d`.  The destination is declared in config as 'AglcArchiveDownloadPath'.  This will only download the archive it will not decrypt it.
3. Manually decrypt the file where it lies (click on the .exe and enter the pgp passphrase when prompted). 
4. Create the index via: `StreamEnergy.LuceneServices.IndexGeneration.exe -g".  This will download all the ERCOT _FUL files for each TDU and then generate the index for BOTH ERCOT and AGLC.  It will then zip up the Lucene index files to a place of your choosing.
5. The executable running in either mode (-d or -g) will create a log called Indexer.log.  Check there for errors or progress.

## Before you run the Index Generator

### Processing Power
Running only ERCOT files currently takes 5-10 minutes on a 4-processor VM with 8-GiB of RAM and a SSD. Both CPU and disk usage maxed out at various points in the process, but RAM usage did not go over 100 MB.

### ERCOT Reports
You will need to download the [ERCOT Esi Id Reports](http://mis.ercot.com/misapp/GetReports.do?reportTypeId=203) for the dates for which you are wanting to update the index. 

* \_DAILY.zip - a daily zip containing the changes for a TDU for that day only
* \_FUL.zip - a monthly zip containing all addresses for a TDU at that time. This appears to be generated the first Monday of every month.

If you just want to test out the address lookup locally, you only need one of the _FUL files - but you'll want one that's large enough for a demo. "Sharyland Utilities" is barely over 1 MB as of 5/5/2014, and should have enough for you to test out.

If you need to build the index from scratch to a current state, you will need all "\_DAILY.zip" files up to the most recent "\_FUL.zip" files. It does not hurt to have additional files in the directory, as the index generator understands the "\_DAILY.zip" and "\_FUL.zip" files.  

If you have a current index, you only need the "\_DAILY.zip" files since your last update.

Eventually, there are plans to automate downloading the zips. 

### Other Reports

At this time, non-ERCOT report formats are not supported.

## Details

The following is the help-screen output by the program itself.

    StreamEnergy.LuceneServices 1.0.0.0
    Copyright ©  2014
    
      -d, --download-aglc   Download the AGLC Self-Decrypting archive.
    
      -g, --generate-index  Generate the index for both ERCOT and AGLC and zip up the files.
    
      --help                Display this help screen.