@echo off


cd E:\Tomcat6\webapps\ROOT\geoviewer\lib\ExtJs\builder
REM -- build testing ----
sencha app build -e testing
copy E:\Tomcat6\webapps\ROOT\geoviewer\lib\ExtJs\build\testing\builder\app.js E:\Tomcat6\webapps\ROOT\geoviewer\lib\ExtJs\ext-debug.js
copy E:\Tomcat6\webapps\ROOT\geoviewer\lib\ExtJs\build\testing\builder\app.js I:\webapps\ROOT\geoviewer\lib\ExtJs\ext-debug.js


REM -- build produzione ----
sencha app build
copy E:\Tomcat6\webapps\ROOT\geoviewer\lib\ExtJs\build\production\builder\app.js E:\Tomcat6\webapps\ROOT\geoviewer\lib\ExtJs\ext.js
copy E:\Tomcat6\webapps\ROOT\geoviewer\lib\ExtJs\build\production\builder\app.js I:\webapps\ROOT\geoviewer\lib\ExtJs\ext.js

cd..




