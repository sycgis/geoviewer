@echo off

REM build a partire dalla versione 2.12
cd E:\Tomcat6\webapps\ROOT\geoviewer\lib\OpenLayers\build\OpenLayers.2.12\build

REM build versione debug
build.py E:\Tomcat6\webapps\ROOT\geoviewer\lib\OpenLayers\build\custom.cfg -c none
copy OpenLayers.js E:\Tomcat6\webapps\ROOT\geoviewer\lib\OpenLayers\OpenLayers.2.12.js
copy OpenLayers.js H:\webapps\ROOT\geoviewer\lib\OpenLayers\OpenLayers.2.12.js

REM build versione esercizio
build.py E:\progetti\CartoWebNet2\lib\OL\build\custom.cfg
copy OpenLayers.js I:\webapps\ROOT\geoviewer\lib\OpenLayers\OpenLayers.2.12.js



