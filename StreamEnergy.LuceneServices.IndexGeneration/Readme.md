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
This version of the indexer will downlaod the _FUL ERCOT files. There is no support for the _DAILY files anymore.

### Other Reports

At this time, non-ERCOT report formats are not supported.

## Details

The following is the help-screen output by the program itself.

    StreamEnergy.LuceneServices 1.0.0.0
    Copyright ©  2014
    
      -d, --download-aglc   Download the AGLC Self-Decrypting archive.
    
      -g, --generate-index  Generate the index for both ERCOT and AGLC and zip up the files.
    
      --help                Display this help screen.