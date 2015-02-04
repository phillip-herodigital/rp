#Param(
#  [string]$localStorageName,
#  [string]$zipUrl
#)
$localStorageName = "DataFolderStore"
If ($localStorageName -eq "")
{
    write "localStorageName Missing"
    Exit
}
[void]([System.Reflection.Assembly]::LoadWithPartialName("Microsoft.WindowsAzure.ServiceRuntime"))
$storageDir = ([Microsoft.WindowsAzure.ServiceRuntime.RoleEnvironment]::GetLocalResource($localStorageName)).RootPath.TrimEnd('\\')

$webConfig = 'E:\sitesroot\0\Web.config'
$doc = (Get-Content $webConfig) -as [Xml]
$obj = $doc.configuration.sitecore['sc.variable'] | where {$_.Name -eq 'dataFolder'}
$obj.value = $storageDir

$doc.Save($webConfig)