<?php

//异常日志写入数据库

namespace listen;
use app\admin\model\Log as LogModel;


class ExceptionLog
{
	
    public function handle($event){
		$content = request()->except(['s', '_pjax']);
		if ($content) {
            foreach ($content as $k => $v) {
                if (is_string($v) && strlen($v) > 200 || stripos($k, 'password') !== false) {
                    unset($content[$k]);
                }
            }
        }
		
        $data['application_name'] = app('http')->getName();
		//$data['username'] = $event;
		$data['url'] = request()->url(true);
		$data['ip'] = request()->ip();
		$data['useragent'] = request()->server('HTTP_USER_AGENT');
		$data['content'] = json_encode($content);
		$data['errmsg'] = $event;
		$data['create_time'] = time();
		$data['type'] = 3;
		
		LogModel::insert($data);
    }
	
}