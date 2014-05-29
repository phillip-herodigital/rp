# Address Lookup Index Generator

The Address Lookup Index Generator (StreamEnergy.LuceneServices.IndexGeneration.exe) is a command-line utility designed to generate a Lucene index for the address lookup service based on ERCOT files. 

## TL;DR

If you want to test locally but don't want to read the entire document:

1. Find the "SHARYLAND\_UTLIITIES\_FUL.zip" [on this page](http://mis.ercot.com/misapp/GetReports.do?reportTypeId=203) and download it to an empty directory.
2. Run `StreamEnergy.LuceneServices.IndexGeneration.exe -d "{Website/Data/typeahead}" -s "{where you put the zip from step 1}" -f`
3. Wait until it completes, then run your website.

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

## Running the Index Generator

After you have all the reports downloaded, there are two primary ways to build a new index.

### Build a new Index

    StreamEnergy.LuceneServices.IndexGeneration.exe -d .\typeahead -s ".\reports" -f

### Update the Index

    StreamEnergy.LuceneServices.IndexGeneration.exe -d .\typeahead -s ".\reports" --mindate 5/20/2014

In this example, "5/20/2014" is the last date for which you want updates to apply.

## Details

The following is the help-screen output by the program itself.

    StreamEnergy.LuceneServices 1.0.0.0
    Copyright ©  2014
    
      -d, --dest            Required. The destination folder for the Lucene index.
    
      -s, --source          Required. The source folder for the data files.
    
      --mindate             The earliest date to process updates for - should be
                            the last date that updates were provided.
    
      -f, --force-create    Forces a fresh index
    
      --help                Display this help screen.

### -d, --dest

The Destination folder for the Lucene index. This is a required parameter. This should either be a previous index or a blank folder.

### -s, --source

The source folder containing the data files. This is a required parameter. The index generator searches the folder for the report files and uses the format of the names as downloaded from the report site(s); this should be a directory that only includes the reports to reduce errors.

### --mindate

The minimum date of the data file to process. If not provided, the index generator will run all of the reports up to the full reports.

### -f, --force-create

This will force the indexer to create a new index. This is useful if you know that all the full reports are within the minimum date you have specified, as it drops certain requirements on the indexer and runs faster.