@echo off
set ADBDir="D:\Projects\Dev-Editor\adb\adb.exe"
set ModPath="D:\Projects"
set ModPathPC="D:\Projects\Dev-Editor"
set PushJSPath="D:\Projects\Dev-Editor\dev"
set PushAssetsPath="D:\Projects\Dev-Editor\res"
set ModsDir="/sdcard/Android/data/io.spck/files"
set ModPathDevice="/sdcard/Android/data/io.spck/files/Dev-Editor"
set DeviceJSDir="/sdcard/Android/data/io.spck/files/Dev-Editor/dev"
set DeviceAssetsDir="/sdcard/Android/data/io.spck/files/Dev-Editor/res"
set DeviceMainJSDir="/sdcard/Android/data/io.spck/files/Dev-Editor/main.js"
set DeviceAutoLaunchFile="/sdcard/games/horizon/.flag_auto_launch"
cls & title ADB Mod Pusher/Puller & @Color 0F

set EmulatorAddress=127.0.0.1:62001
set lastUpdate=13.09.2020 12:39
set version=2.0 beta

:: Used for reset resources & reconnect
:: (use pusher.bat reload)
:reload
cls & echo.Currently Path: %CD% & echo.Reloading

echo.Projects Path:       %ModPath%
echo.Mod Path:            %ModPathPC%
echo.Mod/Sources Path:    %PushJSPath%
echo.Mod/Assets Path:     %PushAssetsPath%
echo.Horizon Pack Mods:   %ModsDir%
echo.Horizon Mod:         %ModPathDevice%
echo.Horizon Mod Sources: %DeviceJSDir%
echo.Horizon Mod Assets:  %DeviceAssetsDir%
echo.Horizon Mod Build:   %DeviceMainJSDir%
echo.

%ADBDir% connect %EmulatorAddress% > nul & if errorlevel 1 (
    echo.Found new emulator
) else (
    echo.No emulators found at %EmulatorAddress%
)
@%ADBDir% start-server > nul & if errorlevel 1 (
    echo.Starting new ADB server failed
) else (
    echo.Started ADB server & echo.Successfully Reloaded
)
timeout 2 > nul & cls & goto main

:: Index batch page, do not reconfigure it
:main
echo.Serial or IP    Status
%ADBDir% devices -l | find "device product:" > nul & if errorlevel 1 (
    echo.    Not connected!
) else (
    %ADBDir% devices | findstr "\<device\>"
)

echo.ADB
echo. 1 - Push
echo. 2 - Pull
echo. 3 - Stop Horizon
echo. 4 - Restart Horizon
echo.Other
echo.  L - Crash Logs
echo.  R - Reload configs
echo.  I - Info

if not [%1] == [] (
    set mainInput=%1
) else (
    set mainInput=x
    set /p mainInput="Input: "
)

cls
if /i %mainInput%==1 goto push
if /i %mainInput%==push goto push
if /i %mainInput%==2 goto pull
if /i %mainInput%==pull goto pull
if /i %mainInput%==3 (
    %ABDir% shell am force-stop com.zheka.horizon
    :: %ADBDir% shell rm %DeviceAutoLaunchFile%
    exit 0
)
if /i %mainInput%==stop-horizon (
    %ABDir% shell am force-stop com.zheka.horizon
    :: %ADBDir% shell rm %DeviceAutoLaunchFile%
    exit 0
)
if /i %mainInput%==4 (
    %ADBDir% shell am force-stop com.zheka.horizon
    echo.Starting Horizon and Launching Game
    %ADBDir% shell monkey -p com.zheka.horizon 1
    %ADBDir% shell touch %DeviceAutoLaunchFile%
    exit 0
)
if /i %mainInput%==restart-horizon (
    %ADBDir% shell am force-stop com.zheka.horizon
    echo.Starting Horizon and Launching Game
    %ADBDir% shell monkey -p com.zheka.horizon 1
    %ADBDir% shell touch %DeviceAutoLaunchFile%
    exit 0
)
if /i %mainInput%==L goto log
if /i %mainInput%==log goto log
if /i %mainInput%==R goto reload
if /i %mainInput%==reload goto reload
if /i %mainInput%==I goto info
if /i %mainInput%==help goto info
echo.Can't find your selected option
timeout 2 > nul & exit 1

:: Crash logs of connected device
:: (use pusher.bat log)
:log
cls
echo.You can't leave from this. Restart if you need...
%ADBDir% logcat -b crash | findstr AndroidRuntime
timeout 2 > nul pause & cls & goto info

:: Push changes to connected device
:: (use pusher.bat push)
:push
cls
echo.Pushing:
echo.  1 - Sources and run
echo.  2 - Assets and run
echo.  3 - All and run
echo.  4 - Sources
echo.  5 - Assets
echo.  6 - All
echo. Enter - Exit

if not [%2] == [] (
    set pushing=%2
) else (
    set pushing=x
    set /p pushing="Input: "
)

cls
if /i %pushing%==1 (
    %ADBDir% push %PushJSPath% %ModPathDevice%
    %ADBDir% shell am force-stop com.zheka.horizon
    echo.Starting Horizon and Launching Game
    %ADBDir% shell monkey -p com.zheka.horizon 1
    %ADBDir% shell touch %DeviceAutoLaunchFile%
    exit 0
)
if /i %pushing%==sources-run (
    %ADBDir% push %PushJSPath% %ModPathDevice%
    %ADBDir% shell am force-stop com.zheka.horizon
    echo.Starting Horizon and Launching Game
    %ADBDir% shell monkey -p com.zheka.horizon 1
    %ADBDir% shell touch %DeviceAutoLaunchFile%
    exit 0
)
if /i %pushing%==2 (
    %ADBDir% push %PushAssetsPath% %ModPathDevice%
    %ADBDir% shell am force-stop com.zheka.horizon
    echo.Starting Horizon and Launching Game
    %ADBDir% shell monkey -p com.zheka.horizon 1
    %ADBDir% shell touch %DeviceAutoLaunchFile%
    exit 0
)
if /i %pushing%==assets-run (
    %ADBDir% push %PushAssetsPath% %ModPathDevice%
    %ADBDir% shell am force-stop com.zheka.horizon
    echo.Starting Horizon and Launching Game
    %ADBDir% shell monkey -p com.zheka.horizon 1
    %ADBDir% shell touch %DeviceAutoLaunchFile%
    exit 0
)
if /i %pushing%==3 (
    %ADBDir% push %ModPathPC% %ModPathDevice%
    %ADBDir% shell am force-stop com.zheka.horizon
    echo.Starting Horizon and Launching Game
    %ADBDir% shell monkey -p com.zheka.horizon 1
    %ADBDir% shell touch %DeviceAutoLaunchFile%
    exit 0
)
if /i %pushing%==all-run (
    %ADBDir% push %ModPathPC% %ModPathDevice%
    %ADBDir% shell am force-stop com.zheka.horizon
    echo.Starting Horizon and Launching Game
    %ADBDir% shell monkey -p com.zheka.horizon 1
    %ADBDir% shell touch %DeviceAutoLaunchFile%
    exit 0
)
if /i %pushing%==4 (
    %ADBDir% push %PushJSPath% %ModPathDevice%
    exit 0
)
if /i %pushing%==sources (
    %ADBDir% push %PushJSPath% %ModPathDevice%
    exit 0
)
if /i %pushing%==5 (
    %ADBDir% push %PushAssetsPath% %ModPathDevice%
    exit 0
)
if /i %pushing%==assets (
    %ADBDir% push %PushAssetsPath% %ModPathDevice%
    exit 0
)
if /i %pushing%==6 (
    %ADBDir% push %ModPathPC% %ModPathDevice%
    exit 0
)
if /i %pushing%==all (
    %ADBDir% push %ModPathPC% %ModPathDevice%
    exit 0
)
echo.Can't find your selected option
timeout 2 > nul & exit 1

:: Pulling changes from connected device
:: (use pusher.bat pull)
:pull
cls
echo.Pulling: 
echo.  1 - Sources
echo.  2 - Assets
echo.  3 - All
echo.  4 - Build
echo. Enter - Exit

if not [%2] == [] (
    set pulling=%2
) else (
    set pulling=x
    set /p pulling="Input: "
)

rem cls
if /i %pulling%==1 (
    %ADBDir% pull %DeviceJSDir% %ModPathPC%
    exit 0
)
if /i %pulling%==sources (
    %ADBDir% pull %DeviceJSDir% %ModPathPC%
    exit 0
)
if /i %pulling%==2 (
    %ADBDir% pull %DeviceAssetsDir% %ModPathPC%
    exit 0
)
if /i %pulling%==assets (
    %ADBDir% pull %DeviceAssetsDir% %ModPathPC%
    exit 0
)
if /i %pulling%==3 (
    %ADBDir% pull %ModPathDevice% %ModPath%
    exit 0
)
if %pulling%==all (
    %ADBDir% pull %ModPathDevice% %ModPath%
    exit 0
)
if /i %pulling%==4 (
    %ADBDir% pull %DeviceMainJSDir% %ModPathPC%
    exit 0
)
if %pulling%==build (
    %ADBDir% pull %DeviceMainJSDir% %ModPathPC%
    exit 0
)
echo.Can't find your selected option
timeout 2 > nul & exit 1

:: Visualize information batch
:: (use pusher.bat help)
:info
echo.ADB Mod Pusher/Puller
echo. Created at:     10.04.2020
echo. Version:        %version%
echo. Last Updated:   %lastUpdate%
echo. Developed by:   TMM Corporation
>nul pause & exit 0