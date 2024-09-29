<?php
// 事件定义文件
return [
    'bind'      => [
		
    ], 

    'listen'    => [
        'AppInit'  => [],
        'HttpRun'  => [],
        'HttpEnd'  => [],
        'LogLevel' => [],
        'LogWrite' => [],
		'ExceptionLog'=>['listen\ExceptionLog'],	//异常日志
		'LoginLog'=>['listen\LoginLog'],	//登录日志
		'DoLog'=>['listen\DoLog'],	//操作日志
    ],

    'subscribe' => [
    ],
]; 
 