<?php

namespace app\admin\controller;
use think\exception\FuncNotFoundException;
use think\exception\ValidateException;
use app\BaseController;
use think\facade\Db;


class Admin extends BaseController
{
	
	
	protected function initialize(){
		$controller = $this->request->controller();
		$action = $this->request->action();
		$app = app('http')->getName();
				
		$admin = session('admin');
        $userid = session('admin_sign') == data_auth_sign($admin) ? $admin['user_id'] : 0;
		
        if( !$userid && ( $app <> 'admin' || $controller <> 'Login' )){
			echo '<script type="text/javascript">top.parent.frames.location.href="'.url('admin/Login/index').'";</script>';exit();
        }
						
		if(session('admin.access')){
			foreach(session('admin.access') as $key=>$val){
				$newnodes[] = parse_url($val)['path'];
			}
		}

		$url =  "/{$app}/{$controller}/{$action}.html";
		if(session('admin.role_id') <> 1 && !in_array($url,config('my.nocheck'))  && !in_array($action,['getExtends','getInfo','getFieldList'])){	
			if(!in_array($url,$newnodes)){
				throw new ValidateException ('你没操作权限');
			}	
		}
		
		event('DoLog',session('admin.username'));	//写入操作日志
		
		$list = Db::name('base_config')->cache(true,60)->select()->column('data','name');
		config($list,'base_config');
	}
	
	
	//返回当前应用的菜单列表
	protected function getBaseMenus(){
		$appname = app('http')->getName();
		$field = 'menu_id,pid,title,controller_name,status,icon,sortid,url';
		$list = db("menu")->field($field)->where(['status'=>1,'app_id'=>1])->order('sortid asc')->select()->toArray();
		if($list){
			foreach($list as $key=>$val){
				$menus[$key]['pid'] = $val['pid'];
				$menus[$key]['menu_id'] = $val['menu_id'];
				$menus[$key]['title'] = $val['title'];
				$menus[$key]['sortid'] = $val['sortid'];
				$menus[$key]['icon'] = $val['icon'] ? $val['icon'] : 'el-icon-menu';
				$menus[$key]['url'] = $this->getUrl($val,$appname);
				$menus[$key]['access'] = $val['url'] ? $val['url'] : $appname.'/'.$val['controller_name'];
			}
			return _generateListTree($menus,0,['menu_id','pid']);
		}
	}
	
	//获取url
	private function getUrl($val,$appname){
		if($val['url']){
			if(strpos($val['url'], '://')){
				$url = $val['url'];
			}else{
				$url = (string)url(ltrim(str_replace('.html','',$val['url']),'/'));
			}
		}else{
			$url = (string)url($appname.'/'.str_replace('/','.',$val['controller_name']).'/index');
		}
		return $url;
	}
	
	
	//验证器 并且抛出异常
	protected function validate($data,$validate){
		try{
			validate($validate)->scene($this->request->action())->check($data);
		}catch(ValidateException $e){
			throw new ValidateException ($e->getError());
		}
		return true;
	}
	
	//格式化sql字段查询 转化为 key=>val 结构
	protected function query($sql,$connect='mysql'){
		preg_match_all('/select(.*)from/iUs',$sql,$all);
		if(!empty($all[1][0])){
			$sqlvalue = explode(',',trim($all[1][0]));
		}
		if(strpos($sql,'tkey') !== false){
			$sqlvalue[1] = 'tkey';
		}
		
		if(strpos($sql,'tval') !== false){
			$sqlvalue[0] = 'tval';
		}
		$sql = str_replace('pre_',config('database.connections.'.$connect.'.prefix'),$sql);
		$list = Db::connect($connect)->query($sql);
		$array = [];
		foreach($list as $k=>$v){
			$array[$k]['key'] = $v[$sqlvalue[1]];
			$array[$k]['val'] = $v[$sqlvalue[0]];
			if($sqlvalue[2]){
				$array[$k]['pid'] = $v[$sqlvalue[2]];
			}
		}
		return $array;
	}
	
	
	//将带有下拉分页的格式化为前端匹配的数据格式
	protected function getSelectPageData($sql,$where,$limit,$connect='mysql'){
		preg_match_all('/select(.*)from/iUs',$sql,$all);
		if(!empty($all[1][0])){
			$sqlvalue = explode(',',trim($all[1][0]));
		}
		
		$res = loadList($sql,$where,$limit,'',$connect);
		
		if(strpos($sql,'tkey') !== false){
			$sqlvalue[1] = 'tkey';
		}
		
		if(strpos($sql,'tval') !== false){
			$sqlvalue[0] = 'tval';
		}
		
		$array = [];
		foreach($res['data'] as $k=>$v){
			$array[$k]['key'] = $v[$sqlvalue[1]];
			$array[$k]['val'] = $v[$sqlvalue[0]];
		}
		
		$data['data'] = $array;
		$data['total'] = $res['total'];
		
		return $data;
	}
	
	
	public function __call($method, $args){
        throw new FuncNotFoundException('方法不存在',$method);
    }
	
	
	
}
