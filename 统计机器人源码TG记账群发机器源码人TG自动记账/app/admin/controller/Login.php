<?php

namespace app\admin\controller;
use think\exception\ValidateException;
use think\facade\Db;
use app\admin\model\Role as RoleModel;

class Login extends Admin{
	
	
	
	//用户登录 
    public function index(){
		if(!$this->request->isPost()) {
			return view('index');
		}else{
			$postField = 'username,password,verify,key';
			$data = $this->request->only(explode(',',$postField),'post',null);
			
			$this->validate($data,\app\admin\validate\Login::class);
			
			if($this->checkLogin($data)){
				return json(['status'=>200]);
			}
		}
    }
	
	
    //验证登录
    private function checkLogin($data){	
		$where['a.user'] = trim($data['username']);
		$where['a.pwd']  = md5(trim($data['password']).config('my.password_secrect'));
		
		$info = Db::name('admin_user')->alias('a')->join('role b', 'a.role_id in(b.role_id)')->field('a.user_id,a.name,a.user as username,a.status,a.role_id as user_role_ids,b.role_id,b.name as role_name,b.status as role_status,b.access')->where($where)->find();
		
		if(!$info){
			throw new ValidateException("请检查用户名或者密码");
		}
		if(!($info['status']) || !($info['role_status'])){
			throw new ValidateException("该账户被禁用");
		}
		
		$info['access'] = explode(',',$info['access']);
		
		session('admin', $info);
		session('admin_sign', data_auth_sign($info));
        
		event('LoginLog',$data['username']);	//写入登录日志
		
        return $info;
    }
	
	
	//验证码
	public function verify(){
		$data['data'] = captcha();
		$data['verify_status'] = config('my.verify_status',true);	//验证码开关
		$data['status'] = 200;
	    return json($data);
	}
	

	//退出
    public function logout(){
        session('admin', null);
		session('admin_sign', null);
	    return json(['status'=>200]);
    }
	

}
