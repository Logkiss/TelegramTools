<?php

//登录日志写入数据库

namespace listen;
use app\admin\model\Log as LogModel;

class LoginLog
{
	
    public function handle($user){
        $data['application_name'] = app('http')->getName();
		$data['username'] = $user;
		$data['url'] = request()->url(true);
		$data['ip'] = request()->ip();
		$data['useragent'] = request()->server('HTTP_USER_AGENT');
		$data['create_time'] = time();
		$data['type'] = 1;
		
		LogModel::insert($data);
    }
}