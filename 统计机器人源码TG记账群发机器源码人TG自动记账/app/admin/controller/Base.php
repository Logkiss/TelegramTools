<?php 
namespace app\admin\controller;
use think\exception\ValidateException;
use app\admin\model\Files as FileModel;
use app\admin\model\Adminuser as AdminuserModel;
use think\facade\Db;

class Base extends Admin {

	
	/*
 	* @Description 定义二开的方法加入权限系统
 	*/
	public function getBaseFuns(){
		$config = [[
			'title' => '基础操作',
			'access' => 'admin/Base',
			'sortid'=>1,
			'children'=>[
				[
					'title'	=> '重置密码',
					'access'	=> (string)url('admin/Base/resetPwd'),
				],
			],
		]];
		
		return $config;
		
	}
	
	/*
 	* @Description 左侧菜单
 	*/
	public function getMenu(){
		$menu =  $this->getBaseMenus();
		$cmsMenu = include app()->getRootPath().'/app/admin/controller/Cms/config.php';	//cms菜单配置
		if($cmsMenu){
			$menu = array_merge($cmsMenu,$menu);	//合并cms菜单
		}
		$order_array = array_column($menu, 'sortid');			//数组排序 根据sortid 正序
		array_multisort($order_array,SORT_ASC,$menu );
				
		$mymenu = $this->getMyMenus(session('admin'),$menu);
		return json(['status'=>200,'data'=>$mymenu]);
	}
	
	
	//获取当前角色的菜单
	private function getMyMenus($roleInfo,$totalMenus){
		if($roleInfo['role_id'] == 1){
			return $totalMenus;
		}
		foreach($totalMenus as $key=>$val){
			if(in_array($val['access'],$roleInfo['access'])){
				$tree[] = array_merge($val,['children'=>$this->getMyMenus($roleInfo,$val['children'])]);
			}
		}
		return array_values($tree);
	}
	
	/*
 	* @Description 图片管理列表
 	*/
	function fileList(){
		$limit  = $this->request->post('limit', 20, 'intval');
		$page = $this->request->post('page', 1, 'intval');

		$where = [];

		$field = 'id,filepath,hash,create_time';

		$res = FileModel::where(formatWhere($where))->field($field)->order('id desc')->paginate(['list_rows'=>$limit,'page'=>$page])->toArray();

		$data['status'] = 200;
		$data['data'] = $res;
		return json($data);
	}


	/*
 	* @Description  删除图片
 	*/
	function deleteFile(){
		$filepath =  $this->request->post('filepath', '', 'serach_in');
		if(!$filepath) $this->error('请选择图片');
		
		FileModel::where('filepath','in',$filepath)->delete();
		
		return json(['status'=>200,'msg'=>'操作成功']);
	}
	
	/*
 	* @Description  重置密码
 	*/
	public function resetPwd(){
		$password = $this->request->post('password');
		
		if(empty($password)) $this->error('密码不能为空');
		
		$data['user_id'] = session('admin.user_id');
		$data['pwd'] = md5($password.config('my.password_secrect'));
		
		$res = AdminuserModel::update($data);
		
		return json(['status'=>200,'msg'=>'操作成功']);
	}
	
	
	/*
 	* @Description  清除缓存
 	*/
	public function clearCache(){
		$appname = app('http')->getName();
		try{
			deldir(app()->getRootPath().'runtime/cache');
		}catch(\Exception $e){
			abort(config('my.error_log_code'),$e->getMessage());
		}
		return json(['status'=>200,'msg'=>'操作成功']);
	}
	
	
	public function getRoleMenus(){
		$appname = app('http')->getName();
		$menu = $this->getNodeMenus(1,0,$appname);
		$cmsMenu = include app()->getRootPath().'/app/admin/controller/Cms/access.php';	//cms菜单配置
		if($cmsMenu){
			$menu = array_merge($cmsMenu,$menu);	//合并cms菜单
		}
		
		$baseFuns = $this->getBaseFuns();
		if($baseFuns){
			$menu = array_merge($baseFuns,$menu);	//合并cms菜单
		}
		
		$order_array = array_column($menu, 'sortid');			//数组排序 根据sortid 正序
		array_multisort($order_array,SORT_ASC,$menu );

		return json(['status'=>200,'menus'=>$menu]);
	}
	
	
	//权限系统获取菜单
	private function getNodeMenus($app_id,$pid,$appname){
		$field = 'menu_id,title,controller_name,status,icon,sortid,url';
		$list = Db::name('menu')->field($field)->where(['app_id'=>$app_id,'pid'=>$pid])->order('sortid asc')->select()->toArray();
		if($list){
			foreach($list as $key=>$val){
				$menus[$key]['sortid'] = $val['sortid'];
				$menus[$key]['access'] = $val['url'] ? $val['url'] : $appname.'/'.$val['controller_name'];
				$menus[$key]['title'] = $val['url'] ? $val['title'].'('.$val['url'].')' : $val['title'].' '.'(/'.$appname.'/'.$val['controller_name'].')';
				$sublist = Db::name('menu')->field($field)->where(['app_id'=>$app_id,'pid'=>$val['menu_id']])->order('sortid asc')->select()->toArray();
				if($sublist){
					if($this->getFuns($val,$appname)){
						$menus[$key]['children'] = array_merge($this->getFuns($val,$appname),$this->getNodeMenus($app_id,$val['menu_id'],$appname));
					}else{
						$menus[$key]['children'] = $this->getNodeMenus($app_id,$val['menu_id'],$appname);
					}
				}else{
					$funs = $this->getFuns($val,$appname);
					$funs && $menus[$key]['children'] = $funs;
				}
			}
			return array_values($menus);
		}
	}
	
	//获取菜单方法
	private function getFuns($info,$appname){
		$list = Db::name('action')->field('name,action_name,type')->where('menu_id',$info['menu_id'])->order('sortid asc')->select()->toArray();
		
		$array = [];
		foreach($list as $k=>$v){
			if($v['type'] == 3){
				array_push($list,['name'=>$v['name'].'详情','action_name'=>'get'.ucfirst($v['action_name']).'Info']);
			}
		}
		
		if($list){
			foreach($list as $key=>$val){
				$funs[$key]['title'] = $val['name'].' '.(string)url('admin/'.$info['controller_name'].'/'.$val['action_name']);
				$funs[$key]['access'] = '/'.$appname.'/'.str_replace('/','.',$info['controller_name']).'/'.$val['action_name'].'.html';
			}
			return array_values($funs);
		}
	}



}

