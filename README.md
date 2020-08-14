# mongodb-log-nestjs

## Description
Package for NestJs to log stuff on MongoDb

## Instalation
```npm i --save mongodb-log-nestjs```

## Quick Start

<ol>
  
  <li>Import <b>MongodbLogModule</b> and use <b>forRoot</b> or <b>forRootAsync</b> static methods on your <b>AppModule</b> for initial configuration <i>(see parameters for configuration on <b>MongodbLogConfig</b> and <b>MongodbLogConfigAsync</b> files)</i>. </li>
  <li>Import <b>MongodbLogService</b> on your service or controller and use <b>registerLog</b> method to register log on default log collection, or use <b>registerOn</b> to register log on additional collection defined on MongodbLogModule static method configuration.</li>
</ol>