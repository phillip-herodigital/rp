REM   Attempt to set the execution policy by using PowerShell version 2.0 syntax.
PowerShell -ExecutionPolicy Unrestricted .\updateDataFolderPath.ps1 >> "%TEMP%\StartupLog.txt" 2>&1

IF %ERRORLEVEL% EQU -393216 (
   REM   PowerShell version 2.0 isn't available. Set the execution policy by using the PowerShell version 1.0 calling method.

   PowerShell -Command "Set-ExecutionPolicy Unrestricted" >> "%TEMP%\StartupLog.txt" 2>&1
   PowerShell .\updateTypeaheadIndex.ps1 >> "%TEMP%\StartupLog.txt" 2>&1
)

REM   If an error occurred, return the errorlevel.
EXIT /B %errorlevel%