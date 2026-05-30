@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~nx0)
@SET __MVNW_CMD__=
@SET __MVNW_ERROR__=
@SET __MVNW_SAVE_ERRORLEVEL__=0
@SET __MVNW_SAVE_CD__=%CD%
@CD /D "%~dp0"

@REM Find JAVA_HOME
@IF NOT "%JAVA_HOME%"=="" (
  @SET JAVA_HOME=%JAVA_HOME%
) ELSE (
  @FOR /f "tokens=*" %%i in ('where java 2^>nul') DO @SET JAVA_PATH=%%i
  @FOR %%i IN ("%JAVA_PATH%") DO @SET JAVA_HOME=%%~dpi..
)

@SET JAVA_EXE=%JAVA_HOME%\bin\java.exe

@IF NOT EXIST "%JAVA_EXE%" (
  @SET JAVA_EXE=java.exe
)

@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

@SET DOWNLOAD_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

@FOR /F "usebackq tokens=1,2 delims==" %%A IN (".mvn\wrapper\maven-wrapper.properties") DO (
  @IF "%%A"=="wrapperUrl" SET DOWNLOAD_URL=%%B
)

@SET WRAPPER_JAR="%~dp0\.mvn\wrapper\maven-wrapper.jar"

@IF NOT EXIST %WRAPPER_JAR% (
  @echo Downloading Maven Wrapper...
  @"%JAVA_EXE%" -classpath "%CLASSPATH%" org.apache.maven.wrapper.Downloader "%DOWNLOAD_URL%" %WRAPPER_JAR%
)

@"%JAVA_EXE%" %MAVEN_OPTS% %MAVEN_DEBUG_OPTS% -classpath %WRAPPER_JAR% "-Dmaven.multiModuleProjectDirectory=%~dp0" %WRAPPER_LAUNCHER% %MAVEN_CONFIG% %*

@SET __MVNW_SAVE_ERRORLEVEL__=%ERRORLEVEL%
@CD /D "%__MVNW_SAVE_CD__%"
@SET ERRORLEVEL=%__MVNW_SAVE_ERRORLEVEL__%
@EXIT /B %ERRORLEVEL%
