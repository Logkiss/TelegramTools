<?php 
/*
 module:		登录控制器
 create_time:	2021-06-25 23:49:13
 author:		
 contact:		
*/

namespace app\admin\validate;
use think\validate;

class Login extends validate {


	protected $rule = [
		'username'=>['require'],
		'password'=>['require'],
		'verify'=> 'checkverify'
	];

	protected $message = [
		'username.require'=>'用户名不能为空',
		'password.require'=>'密码不能为空',
	];
	
	
	protected $scene  = [
		'index'=>['username','password','verify'],
	];
	
	
	protected function checkverify($value, $rule, $data=[]){
		if(config('my.verify_status',true)){
			if(empty($data['key'])){
				$msg = '验证码key不能为空';
			}
			
			if(!captcha_check($data['key'],$data['verify'])){
				$msg = '验证码错误';
			}
			
			return $msg ? $msg : true;
		}else{
			return true;
		}
    }



}

