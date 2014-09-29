#Param(
#  [string]$localStorageName,
#  [string]$zipUrl
#)
$localStorageName = "TypeaheadStore"
$zipUrl = "http://test.mystream.com/typeaheadindex.zip"
If ($localStorageName -eq "")
{
    write "localStorageName Missing"
    Exit
}
If ($zipUrl -eq "")
{
    write "zipUrl Missing"
    Exit
}
[void]([System.Reflection.Assembly]::LoadWithPartialName("Microsoft.WindowsAzure.ServiceRuntime"))
$storageDir = ([Microsoft.WindowsAzure.ServiceRuntime.RoleEnvironment]::GetLocalResource($localStorageName)).RootPath.TrimEnd('\\')
$webclient = New-Object System.Net.WebClient
$file = "$storageDir\index.zip"
$webclient.DownloadFile($zipUrl,$file)

function Expand-ZIPFile($file, $destination)
{
	$shell = new-object -com shell.application
	$zip = $shell.NameSpace($file)
	foreach($item in $zip.items())
	{
		$shell.Namespace($destination).copyhere($item)
	}
}
Expand-ZIPFile $file $storageDir