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

$webConfig = 'E:\sitesroot\0\App_Config\Sitecore.config'
$doc = (Get-Content $webConfig) -as [Xml]
$obj = $doc.sitecore.GetElementsByTagName('sc.variable') | where {$_.Name -eq 'dataFolder'}
$obj.value = $storageDir
$obj2 = $doc.sitecore.GetElementsByTagName('sc.variable') | where {$_.Name -eq 'tempFolder'}
$obj2.value = $storageDir + '\temp'

$doc.Save($webConfig)