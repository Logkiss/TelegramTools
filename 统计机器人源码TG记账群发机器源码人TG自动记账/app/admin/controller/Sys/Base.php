<?php 
namespace app\admin\controller\Sys;

use think\exception\ValidateException;
use app\admin\controller\Sys\build;
use app\admin\controller\Sys\model\Application;
use app\admin\controller\Sys\model\Field;
use app\admin\controller\Sys\model\Menu;
use app\admin\controller\Sys\model\Action;
use app\admin\controller\Admin;
use think\facade\Db;

class Base extends Admin{
	
	private $url = 'http://vuebuild.whpj.vip';
	
	public function initialize(){
		parent::initialize();
		config(['view_path'=>app_path()],'view');
	}
	
	//应用列表
	public function applicationList(){
		if (!$this->request->isPost()){
			return view('controller/Sys/view/application');
		}else{
			$limit  = $this->request->post('limit', 20, 'intval');
			$page   = $this->request->post('page', 1, 'intval');
			
			$res = Application::order('app_id asc')->paginate(['list_rows'=>$limit,'page'=>$page]);
			$data['data'] = $res;
			$data['status'] = 200;
			return json($data);
		}
	}
	
	//创建应用
	public function createApplication(){
		$data = $this->request->post();
		try{
			$res = Application::create($data);
			if($data['app_type'] == 1){
				Menu::create(['app_id'=>$res->app_id,'title'=>'首页','sortid'=>1,'create_code'=>0,'icon'=>'el-icon-s-home','url'=>(string)url($data['app_dir'].'/Index/main')]);
			}
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		return json(['status'=>200]);
	}
	
	//修改应用
	public function updateApplication(){
		$data = $this->request->post();
		try{
			Application::update($data);
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		return json(['status'=>200]);
	}
	
	//获取应用
	public function getApplicationInfo(){
		$data = $this->request->post('app_id');
		try{
			$res = Application::find($data);
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		return json(['status'=>200,'data'=>$res]);
	}
	
	/*
 	* @Description  秘钥管理
 	*/
	public function secrect(){
		if (!$this->request->isPost()){
			return view('controller/Sys/view/secrect');
		}else{
			$data = $this->request->post();	
			$info = db('secrect')->column('data','name');
			foreach ($data as $key => $value) {
				if(array_key_exists($key,$info)){
					db('secrect')->field('data')->where(['name'=>$key])->update(['data'=>$value]);
				}else{
					db('secrect')->create(['name'=>$key,'data'=>$value]);
				}
			}
			return json(['status'=>200,'msg'=>'操作成功']);
		}
	}


	/*
 	* @Description  修改信息之前查询信息的 勿要删除
 	*/
	function getSecrectInfo(){
		$res = db('secrect')->column('data','name');
		$data['status'] = 200;
		$data['data'] = $res;
		return json($data);
	}
	
	//获取主键ID
	public function getPk(){
		$data = $this->request->post('tablename');
		try{
			$res = Db::name($data)->getPk();
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		return json(['status'=>200,'data'=>$res]);
	}
	
	//生成应用
	public function buildApplication(){
		$data = $this->request->post('app_id');
		
		$info = Application::find($data);
		
		if(!$info['status']){
			throw new ValidateException('该应用禁止生成');
		}
		
		$rootPath = app()->getRootPath();
		
		$secrect = $this->getSecrect();
		
		if(empty($secrect['appid']) || empty($secrect['secrect'])){
			$this->error('appid或者秘钥不能为空');
		}
		
		$info['secrect'] = $secrect;
		$info['timestmp'] = time();
		
		$info['sign'] = md5(md5(json_encode($info,JSON_UNESCAPED_UNICODE).$secrect['secrect']));
		
		$res = $this->go_curl($this->url.'/index/Index/createApp','post',json_encode($info));

		$res = json_decode($res,true);

		if($res['status'] == 411){
			throw new ValidateException($res['msg']);
		}
		
		foreach($res as $k=>$v){
			if(strpos($k,'index.html') > 0 && file_get_contents($rootPath.$k) && file_get_contents($rootPath.$k) <> '欢迎使用xhadmin'){
				filePutContents(file_get_contents($rootPath.$k),$rootPath.$k,$type=2);
			}else{
				filePutContents($v,$rootPath.$k,2);
			}
		}
		
		if($info['app_type'] == 3){
			$list = Db::query('show tables');
			foreach($list as $k=>$v){
				$array[] = $v['Tables_in_'.config('database.connections.mysql.database')];
			}
			if(!in_array(config('database.connections.mysql.prefix').'catagory',$array)){
				$file = $rootPath.'app/admin/controller/Cms/cms.sql';
				$gz   = fopen($file, 'r');
				for($i = 0; $i < 1000; $i++){
					$sql .= str_replace('cd_',config('database.connections.mysql.prefix'),fgets($gz));
					if(preg_match('/.*;$/', trim($sql))){
						if(false !== Db::query($sql)){
							$start += strlen($sql);
						} else {
							return false;
						}
						$sql = '';
					} 
				}
			}
		}
		
		return json(['status'=>200]);
		
	}
	
	//删除应用
	public function deleteApplication(){
		$data = $this->request->post();
		try{
			Application::destroy($data);
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		return json(['status'=>200]);
	}
	
	private function getTpl($appid,$menu){
		$info = Application::find($appid);
		switch($info['app_type']){
			case 1:
				$tpl = $menu.'/admin';
			break;
			
			case 2:
				$tpl = $menu.'/api';
			break;
			
			case 3:
				$tpl = $menu.'/cms';
			break;
		}
		return $tpl;
	}
	
	//菜单列表
	function menu(){
		if (!$this->request->isPost()){
			$appid = $this->request->get('appid',1,'intval');
			$tpl = $this->getTpl($appid,'menu');
			$this->view->assign('appid',$appid);
			return view('controller/Sys/view/'.$tpl);
		}else{
			$app_id = $this->request->post('app_id',1,'intval');
			foreach(config('database.connections') as $k =>$v){
				$connects[] = $k;
			}
			$data['status'] = 200;
			$data['list'] = $this->getMenu($app_id,0);
			$data['defaultConnect'] = config('database.default');
			$data['connects'] = $connects;
			$data['tableList'] = $this->getTableList(config('database.default'));
			$data['app_list'] = Application::field('app_id,app_type,application_name')->select()->toArray();
			
			foreach($data['app_list'] as $k=>$v){
				$data['app_list'][$k]['url'] = (string)url('admin/Menu/index',['app_id'=>$v['app_id'],'app_type'=>$v['app_type']]);
			}
			
			$data['page_type_list'] = Config::page_type_list();
			return json($data);
		}
	}
	
	//创建菜单
	public function createMenu(){
		$data = $this->request->post();
		$data['controller_name'] = $this->setControllerName($data['controller_name']);
		$res = Menu::create($data);
		if($res->menu_id && $data['table_name'] && $data['pk'] && $data['create_code'] && $data['status']){
			foreach((Config::actionList()) as $key=>$val){
				$val['menu_id'] = $res->menu_id;
				if($val['default_create']  && $data['page_type'] == 1 && !in_array($val['type'],[10,11])){
					Action::create($val);
				}
			}
			foreach((Config::defaultFields()) as $key=>$val){
				$val['menu_id'] = $res->menu_id;
				$val['field'] = $data['pk'];
				if(config('database.connections.'.$data['connect'].'.type') == 'mongo'){
					$val['width'] = 220;
					$val['datatype'] = 'string';
					$val['length'] = '';
				}
				if($val['primary'] && $data['page_type'] == 1){
					Field::create($val);
				}
			}
			if($data['page_type'] == 2){
				Action::create(['name'=>$data['title'],'menu_id'=>$res->menu_id,'action_name'=>'index','type'=>14]);
			}
		}
		Menu::update(['menu_id'=>$res->menu_id,'sortid'=>$res->menu_id]);
		return json(['status'=>200]);
	}
	
	//更新菜单
	public function updateMenu(){
		$data = $this->request->post();
		$data['controller_name'] = $this->setControllerName($data['controller_name']);
		
		if(!isset($data['pid'])){
			$data['pid'] = '0';
		}
		
		try{
			$res = Menu::update($data);
			if($res){
				if($data['page_type'] == 2){
					Action::where('type','<>',14)->where('menu_id',$data['menu_id'])->delete();
					$configAction = Action::where('type',14)->where('menu_id',$data['menu_id'])->count();
					if(!$configAction){
						Action::create(['name'=>$data['title'],'menu_id'=>$data['menu_id'],'action_name'=>'index','type'=>14]);
					}
				}
			}
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		return json(['status'=>200]);
	}
	
	//方法列表直接修改操作
	public function updateMenuExt(){
		$data = $this->request->post();
		try{
			$res = Menu::update($data);
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		return json(['status'=>200]);
	}
	
	
	//获取菜单信息
	public function getMenuInfo(){
		$data = $this->request->post('menu_id');
		try{
			$res = menu::find($data);
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		return json(['status'=>200,'data'=>$res]);
	}
	
	//删除菜单
	public function deleteMenu(){
		$data = $this->request->post();
		try{
			$res = Menu::destroy($data);
			if($res){
				Field::where($data)->delete();
				Action::where($data)->delete();
			}
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		return json(['status'=>200]);
	}
	
	
	//复制菜单
	public function copyMenu(){
		$data = $this->request->post();
		if(empty($data['appid']) || empty($data['menu_id'])){
			$this->error('参数错误');
		}
		
		$menuInfo = Menu::where('menu_id',$data['menu_id'])->find()->toArray();
		
		$application =Application::find($data['appid']);
		
		$menuInfo['create_table'] = 0;
		$menuInfo['pid'] = 0;
		$menuInfo['app_id'] = $data['appid'];
		unset($menuInfo['menu_id']);
		
		
		try{
			$res = Menu::create($menuInfo);
			$fieldList = Field::where(['menu_id'=>$data['menu_id']])->select()->toArray();
			if($fieldList){
				foreach($fieldList as $key=>$val){
					unset($val['id']);
					$val['create_table_field'] = 0;
					if(in_array($val['list_show'],[0,1]) && $application['app_type'] == 2){
						$val['list_show'] = 0;
					}
					if(in_array($val['list_show'],[2,3,4]) && $application['app_type'] == 2){
						$val['list_show'] = 1;
					}
					$val['menu_id'] = $res->menu_id;
					Field::create($val);
				}
			}
			
			$actionList = Action::where(['menu_id'=>$data['menu_id']])->select()->toArray();
			if($actionList){
				foreach($actionList as $key=>$val){
					if(in_array($val['type'],[1,2,3,4,5,6,7,8,9,20])){
						unset($val['id']);
						$val['menu_id'] = $res->menu_id;
						Action::create($val);
					}
				}
			}
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		
		return json(['status'=>200]);
		
	}
	
	//菜单字段列表
	public function fieldList(){
		if (!$this->request->isPost()){
			$appid = $this->request->get('appid',1,'intval');
			$menu_id = $this->request->get('menu_id','','intval');
			$tpl = $this->getTpl($appid,'field');
			$this->view->assign('appid',$appid);
			$this->view->assign('menu_id',$menu_id);
			return view('controller/Sys/view/'.$tpl);
		}else{
			$limit  = $this->request->post('limit', 20, 'intval');
			$page   = $this->request->post('page', 1, 'intval');
			$menu_id = $this->request->post('menu_id','','intval');
			
			$res = Field::where(['menu_id'=>$menu_id])->order('sortid asc')->paginate(['list_rows'=>$limit,'page'=>$page]);
			
			$data['status'] = 200;
			$data['data'] = $res;
			$data['typeField']  = Config::fieldList();
			$data['itemList']  = Config::itemList();
			$data['menu_title'] = Menu::where('menu_id',$menu_id)->value('title');
			return json($data);
		}
		
	}
	
	//创建字段
	public function createField(){
		$data = $this->request->post();
		
		$this->validate($data,\app\admin\controller\Sys\validate\Field::class);
		
		$data['item_config'] = getItemData($data['item_config']);
		$data['other_config'] = json_encode($data['other_config']);
		$data['validate'] = implode(',',$data['validate']);
		
		foreach(Config::fieldList() as $v){
			if($v['type'] == $data['type'] && empty($data['belong_table'])){
				$search_status = $v['search'];
			}
		}

		$data['search_type'] = $search_status;
		try{
			$res = Field::create($data);
			if($res->id){
				Field::update(['id'=>$res->id,'sortid'=>$res->id]);
			}
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		return json(['status'=>200]);
	}
	
	//更新字段
	public function updateField(){
		$data = $this->request->post();
		
		if($data['field_type']){
			$param['id'] = $data['id'];
			$param['field'] = $data['field'];
		}else{
			$this->validate($data,\app\admin\controller\Sys\validate\Field::class);
			
			$data['item_config'] = getItemData($data['item_config']);
			$data['other_config'] = json_encode($data['other_config']);
			$data['validate'] = implode(',',$data['validate']);
			
			foreach(Config::fieldList() as $v){
				if($v['type'] == $data['type'] && empty($data['belong_table'])){
					$search_status = $v['search'];
				}
			}

			//$data['search_type'] = $search_status;
			
			$param = $data;
		}
				
		try{
			Field::update($param);
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		return json(['status'=>200]);
	}
	
	//方法列表直接修改操作
	public function updateFieldExt(){
		$data = $this->request->post();
		try{
			$res = Field::update($data);
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		return json(['status'=>200]);
	}
	
	//获取字段信息
	public function getFieldInfo(){
		$data = $this->request->post();
		try{
			$res = Field::where($data)->find();
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		$res['validate'] = explode(',',$res['validate']);
		$res['item_config'] = json_decode($res['item_config'],true);
		return json(['status'=>200,'data'=>$res]);
	}
	
	//删除字段
	public function deleteField(){
		$data = $this->request->post();
		$menuInfo = Menu::find($data['menu_id']);
		$pk = Db::connect($menuInfo['connect'])->name($menuInfo['table_name'])->getPk();
		$fieldList = Field::field('id,field')->where($data)->select()->toArray();
		$ids = [];
		foreach($fieldList as $v){
			if($pk <> $v['field']){
				array_push($ids,$v['id']);
			}else{
				$pk_status = true;
			}
		}
		try{
			Field::where('id','in',$ids)->delete();
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		return json(['status'=>200,'pk_status'=>$pk_status]);
	}
	
	//方法列表
	public function actionList(){
		if (!$this->request->isPost()){
			$appid = $this->request->get('appid',1,'intval');
			$menu_id = $this->request->get('menu_id','','intval');
			$tpl = $this->getTpl($appid,'action');
			$this->view->assign('appid',$appid);
			$this->view->assign('menu_id',$menu_id);
			return view('controller/Sys/view/'.$tpl);
		}else{
			$limit  = $this->request->post('limit', 20, 'intval');
			$page   = $this->request->post('page', 1, 'intval');
			$menu_id = $this->request->post('menu_id','','intval');
			
			$res = Action::where(['menu_id'=>$menu_id])->order('sortid asc')->paginate(['list_rows'=>$limit,'page'=>$page]);
			$data['data'] = $res;
			$data['status'] = 200;
			$data['actionList'] = Config::actionList();
			$data['menu_title'] = Menu::where('menu_id',$menu_id)->value('title');
			return json($data);
		}
	}
	
	//获取提交字段
	public function getPostField(){
		$menu_id = $this->request->post('menu_id');
		
		$menuInfo = Menu::find($menu_id);
		
		$list = Field::field('type,field,title')->where('menu_id',$menu_id)->where('post_status',1)->order('sortid asc')->select()->toArray();
		
		$pk = Db::connect($menuInfo['connect'])->name($menuInfo['table_name'])->getPk();
		
		$model_fields = array_merge([['field'=>$pk,'title'=>'编号']],$list);
		
		$tableList = Menu::where('table_name','<>','')->where('app_id',$menuInfo['app_id'])->field('controller_name')->select()->toArray();
		
		$with_join = [];
		$actionList = Action::where('menu_id',$menu_id)->select();
		foreach($actionList as $v){
			if($v['with_join'] && in_array($v['type'],[2,3])){
				foreach(json_decode($v['with_join'],true) as $n){
					$n['fields'] = $this->getExtendFields($n);
					foreach($n['fields'] as $m){
						array_push($with_join, $m);
					}
				}
			}
		}
		
		$newWith = [];
		foreach ($with_join as $key=>$v) {
			if(isset($newWith[$v['field']]) == false){
				$newWith[$v['field']] = $v;
			}
		}
		
		foreach($newWith as $k=>$v){
			unset($newWith[$k]['belong_table']);
			unset($newWith[$k]['table_name']);
		}
		
		$connect = $menuInfo['connect'] ? $menuInfo['connect'] : config('database.default');
		$dbtype = config('database.connections.'.$connect.'.type');
		
		$tab_fields = array_merge($list,$newWith);
		return json(['status'=>200,'dbtype'=>$dbtype,'data'=>$list,'model_fields'=>$model_fields,'tab_fields'=>$tab_fields,'tableList'=>$tableList,'sms_list'=>Config::sms_list()]);
	}
	
	//创建方法
	public function createAction(){
		$data = $this->request->post();
		
		$this->validate($data,\app\admin\controller\Sys\validate\Action::class);
		
		if($data['with_join']){
			foreach($data['with_join'] as $k=>$v){
				$menuInfo = Menu::field('connect,table_name')->where('controller_name',$v['relative_table'])->find();
				$data['with_join'][$k]['table_name'] = $menuInfo['table_name'];
				$data['with_join'][$k]['connect'] = $menuInfo['connect'];
			}
		}
		
		$data['list_filter'] = getItemData($data['list_filter']);
		$data['tab_config'] = getItemData($data['tab_config']);
		$data['with_join'] = getItemData($data['with_join']);
		$data['other_config'] = json_encode($data['other_config']);
		
		$data['fields'] = implode(',',$data['fields']);
		

		if(in_array($data['type'],[2,3,4,5,6,7,8,9,10,11,15,16,17,18,19,20])){
			$data['group_button_status'] = 1;
		}
		
		if(in_array($data['type'],[2,3])){
			$data['dialog_size'] = '600px';
		}
		
		if(in_array($data['type'],[3,4])){
			$data['list_button_status'] = 1;
		}
		
		try{
			$count = Action::where('menu_id',$data['menu_id'])->where('action_name',$data['action_name'])->count();
			if($count >0){
				throw new ValidateException ('方法名已经存在');
			}
			$res = Action::create($data);
			if($res->id){
				Action::update(['id'=>$res->id,'sortid'=>$res->id]);
				
				if($data['type'] == 20){
					$menuInfo = db("menu")->where('menu_id',$data['menu_id'])->find();
					$connect = $menuInfo['connect'] ? $menuInfo['connect'] : config('database.default');
					
					$fieldlist = Db::connect($menuInfo['connect'])->query('show full columns from '.config('database.connections.'.$menuInfo['connect'].'.prefix').$menuInfo['table_name']);
					foreach($fieldlist as $v){
						$arr[] = $v['Field'];
					}
					$delete_field = !is_null(config('my.delete_field')) ? config('my.delete_field') : 'delete_time';
					if(!in_array($delete_field,$arr)){
						$sql="ALTER TABLE ".config('database.connections.'.$connect.'.prefix')."{$menuInfo['table_name']} ADD {$delete_field} int(10) COMMENT '软删除标记' DEFAULT null";
						Db::connect($connect)->execute($sql);
					}
				}
			}
			
			
			
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		return json(['status'=>200]);
	}
	
	//快速创建方法
	public function quckCreateAction(){
		$data = $this->request->post('actions');
		$menu_id = $this->request->post('menu_id');
		foreach($data as $key=>$val){
			foreach((Config::actionList()) as $k=>$v){
				if($val == $v['type']){
					$v['menu_id'] = $menu_id;
					if(!in_array($v['action_name'],Action::where('menu_id',$menu_id)->column('action_name'))){
						Action::create($v);
					}else{
						$exits_status = true;
					}
				}
			}
		}	
		return json(['status'=>200,'exits_status'=>true]);
	}
	
	//更新方法
	public function updateAction(){
		$data = $this->request->post();
		
		$this->validate($data,\app\admin\controller\Sys\validate\Action::class);
		
		if($data['with_join']){
			foreach($data['with_join'] as $k=>$v){
				$menuInfo = Menu::field('connect,table_name')->where('controller_name',$v['relative_table'])->find();
				$data['with_join'][$k]['table_name'] = $menuInfo['table_name'];
				$data['with_join'][$k]['connect'] = $menuInfo['connect'];
			}
		}
		
		$data['list_filter'] = getItemData($data['list_filter']);
		$data['tab_config'] = getItemData($data['tab_config']);
		$data['with_join'] = getItemData($data['with_join']);
		$data['fields'] = $data['fields'] ? implode(',',$data['fields']) : '';
		$data['other_config'] = json_encode($data['other_config']);
		
		try{
			$res = Action::update($data);
			if($data['type'] == 20){
				$actionInfo = db("action")->where('id',$data['id'])->find();
				$menuInfo = db("menu")->where('menu_id',$actionInfo['menu_id'])->find();
				$connect = $menuInfo['connect'] ? $menuInfo['connect'] : config('database.default');
				$delete_field = !is_null(config('my.delete_field')) ? config('my.delete_field') : 'delete_time';
				$deleteFieldStatus = $this->getFieldStatus(config('database.connections.'.$connect.'.prefix').$menuInfo['table_name'],$delete_field,$connect);
				if(!$deleteFieldStatus){
					$sql="ALTER TABLE ".config('database.connections.'.$connect.'.prefix')."{$menuInfo['table_name']} ADD {$delete_field} int(10) COMMENT '软删除标记' DEFAULT null";
					Db::connect($connect)->execute($sql);
				}
			}
			
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		return json(['status'=>200]);
	}
	
	//方法列表直接修改操作
	public function updateActionExt(){
		$data = $this->request->post();
		try{
			$res = Action::update($data);
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		return json(['status'=>200]);
	}
	
	//获取方法信息
	public function getActionInfo(){
		$data = $this->request->post();
		try{
			$res = Action::where($data)->find();
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		if($res['list_filter']){
			$res['list_filter'] = json_decode($res['list_filter'],true);
		}
		if($res['tab_config']){
			$res['tab_config'] = json_decode($res['tab_config'],true);
		}
		
		if($res['with_join']){
			$res['with_join'] = json_decode($res['with_join'],true);
		}
		
		$other_config = json_decode($res['other_config'],true);
		if(substr_count($other_config['show_list_button'],'=') !== 2){
			$res['other_config'] = json_encode(['show_list_button'=>'']);
		}
		
		$list = Field::where('menu_id',$data['menu_id'])->where('post_status',1)->column('field');
		
		$fields = explode(',',$res['fields']);
		foreach($fields as $key=>$val){
			if(!in_array($val,$list)){
				unset($fields[$key]);
			}
		}
		$res['fields'] = array_values($fields);
		
		return json(['status'=>200,'data'=>$res]);
	}
	
	
	//删除方法
	public function deleteAction(){
		$data = $this->request->post();
		
		$list = Action::where($data)->field('action_name')->select()->toArray();
		
		$rootPath = app()->getRootPath();
		
		$menu = Menu::find($data['menu_id']);
		$application = Application::find($menu['app_id']);
		
		foreach($list as $v){
			if($menu['controller_name'] && $v['action_name']){
				@unlink($rootPath.'/ui/src/views/'.$application['app_dir'].'/'.strtolower($menu['controller_name']).'/'.$v['action_name'].'.vue');
			}
		}
		$info = db("action")->where($data)->select()->toArray();
		try{
			foreach($info as $v){
				$res = Action::where('id',$v['id'])->delete();
				if($res && $v['type'] == 20){
					$delete_field = !is_null(config('my.delete_field')) ? config('my.delete_field') : 'delete_time'; 
					$connect = $menu['connect'] ? $menu['connect'] : config('database.default');
					if($this->getFieldStatus(config('database.connections.'.$connect.'.prefix').$menu['table_name'],$delete_field,$connect)){
						$sql = 'ALTER TABLE '.config('database.connections.'.$connect.'.prefix').$menu['table_name'].' DROP '.$delete_field;
						Db::connect($connect)->execute($sql);
					}	
				}
			}
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		return json(['status'=>200]);
	}
	
	//拖动排序
	public function updateFieldSort(){
		$postField = 'currentId,preId,nextId,menu_id';
		$data = $this->request->only(explode(',',$postField),'post',null);
		
		if(!empty($data['preId'])){
			$pre = Field::where('id',$data['preId'])->where('menu_id',$data['menu_id'])->value('sortid');
		}
		if(!empty($data['nextId'])){
			$next = Field::where('id',$data['nextId'])->where('menu_id',$data['menu_id'])->value('sortid');
		}
		
		$current = Field::where('id',$data['currentId'])->where('menu_id',$data['menu_id'])->value('sortid');
		
		if($current > $pre){
			$sortid = $next;
		}else{
			$sortid = $pre;
		}
		
		if(empty($pre)){
			$pre = $next - 1;
			$sortid = $next;
		}
		if(empty($next)){
			$next = $pre + 1;
			$sortid = $pre;
		}
		try{
			if($current > $pre){
				Field::field('sortid')->where('sortid','between',[$pre+1,$current-1])->where('menu_id',$data['menu_id'])->inc('sortid',1)->update();
			}
			if($current < $pre){
				Field::field('sortid')->where('sortid','between',[$current+1,$next-1])->where('menu_id',$data['menu_id'])->dec('sortid',1)->update();
			}
			Field::field('sortid')->where('id',$data['currentId'])->where('menu_id',$data['menu_id'])->update(['sortid'=>$sortid]);
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		return json(['status'=>200,'pre'=>$pre]);
	}
	
	//拖动排序
	public function updateActionSort(){
		$postField = 'currentId,preId,nextId,menu_id';
		$data = $this->request->only(explode(',',$postField),'post',null);
		
		if(!empty($data['preId'])){
			$pre = Action::where('id',$data['preId'])->where('menu_id',$data['menu_id'])->value('sortid');
		}
		if(!empty($data['nextId'])){
			$next = Action::where('id',$data['nextId'])->where('menu_id',$data['menu_id'])->value('sortid');
		}
		
		$current = Action::where('id',$data['currentId'])->where('menu_id',$data['menu_id'])->value('sortid');
		
		if($current > $pre){
			$sortid = $next;
		}else{
			$sortid = $pre;
		}
		
		if(empty($pre)){
			$pre = $next - 1;
			$sortid = $next;
		}
		if(empty($next)){
			$next = $pre + 1;
			$sortid = $pre;
		}
		try{
			if($current > $pre){
				Action::where('sortid','between',[$pre+1,$current-1])->where('menu_id',$data['menu_id'])->inc('sortid',1)->update();
			}
			if($current < $pre){
				Action::field('sortid')->where('sortid','between',[$current+1,$next-1])->where('menu_id',$data['menu_id'])->dec('sortid',1)->update();
			}
			Action::field('sortid')->where('id',$data['currentId'])->where('menu_id',$data['menu_id'])->update(['sortid'=>$sortid]);
		}catch(\Exception $e){
			abort(501,$e->getMessage());
		}
		return json(['status'=>200,'pre'=>$pre]);
	}
	
	//字段选项配置，验证规则配置
	public function configList(){
		$menu_id = $this->request->post('menu_id');
		
		$menuInfo = Menu::find($menu_id);		
		$connect = $menuInfo['connect'] ? $menuInfo['connect'] : config('database.default');
		$dbtype = config('database.connections.'.$connect.'.type');
		
		$ruleList = Config::ruleList();
		if($dbtype <> 'mongo'){
			$propertyField = Config::propertyField();
		}else{
			$propertyField = Config::propertyMongoField();
		}
		
		return json(['status'=>200,'ruleList'=>$ruleList,'propertyField'=>$propertyField,'dbtype'=>$dbtype]);
	}
	
	
	//数据库table列表
	public function getTables(){
		$connect = $this->request->post('connect',config('database.default'),'strval');
		return json(['status'=>200,'data'=>$this->getTableList($connect)]);
	}
	
	//用过菜单id获取所有数据表
	public function getTablesByMenuId(){
		$menu_id = $this->request->post('menu_id');
		if(!$menu_id){
			$this->error('菜单ID不能为空');
		}
		$app_id = Menu::where('menu_id',$menu_id)->value('app_id');
		$tableList = Menu::where('app_id',$app_id)->where('table_name','<>','')->field('table_name,title')->select();
		return json(['status'=>200,'data'=>$tableList]);
	}
	
	//数据库table列表
	private function getTableList($connect){
		$list = Db::connect($connect)->query('show tables');
		foreach($list as $k=>$v){
			$tableList[] = str_replace(config('database.connections.'.$connect.'.prefix'),'',$v['Tables_in_'.config('database.connections.'.$connect.'.database')]);
		}
		$no_show_table = ['menu','application','admin_user','action','log','field'];
		foreach($tableList as $key=>$val){
			if(in_array($val,$no_show_table)){
				unset($tableList[$key]);
			}
		}
		return array_values($tableList);
	}
	
	//根据表名获取字段列表
	public function getTableFields(){
		$controller_name = $this->request->post('controller_name');
		if(!$controller_name){
			$this->error('数据表不能为空');
		}
		
		$menuInfo = Menu::where('controller_name',$controller_name)->find();
				
		$connect = $menuInfo['connect'] ? $menuInfo['connect'] : config('database.default');
		$dbtype = config('database.connections.'.$connect.'.type');
		if($dbtype == 'mongo'){
			$list = db("field")->field("field as Field,title as Comment")->where('menu_id',$menuInfo['menu_id'])->order('sortid asc')->select();
		}else{
			$list = Db::connect($menuInfo['connect'])->query('show full columns from '.config('database.connections.'.$menuInfo['connect'].'.prefix').$menuInfo['table_name']);
		}
		
		return json(['status'=>200,'filedList'=>$list]);
	}
	
	
	//获取菜单列表
	private function getMenu($app_id){
		$field = 'menu_id,pid,title,controller_name,create_code,create_table,table_name,status,sortid';
		$list = Menu::field($field)->where(['app_id'=>$app_id])->order('sortid asc')->select()->toArray();
		return _generateListTree($list,0,['menu_id','pid']);
	}
	
	
	//获取上传配置列表
	public function getUploadList(){
		$appid = $this->request->post('app_id');
		$app_type = Application::where('app_id',$appid)->value('app_type');
		$list =	Db::name('upload_config')->field('id,title')->select()->toArray();
		return json(['status'=>200,'data'=>$list,'app_type'=>$app_type]);
	}
	
	
	//生成
	public function create(){
		$menu_id = $this->request->post('menu_id');
		if($this->createCode($menu_id)){
			return json(['status'=>200]);
		}
	}
	
	//生成
	private function createCode($menu_id){
		$menuInfo = Menu::find($menu_id)->toArray();
		
		if(!$menuInfo['create_code']){
			$this->error('该菜单禁止生成');
		}
		
		$fieldList = Field::where('menu_id',$menu_id)->order('sortid asc')->select()->toArray();
		$actionList = Action::where('menu_id',$menu_id)->order('sortid asc')->select()->toArray();
		
		$application = Application::where('app_id',$menuInfo['app_id'])->find()->toArray();
		
		$pk = Db::connect($menuInfo['connect'])->name($menuInfo['table_name'])->getPk();
		
		$data['fieldList'] = $fieldList;
		$data['actionList'] = $actionList;
		$data['application'] = $application;
		$data['pk'] = $pk;
		$data['menuInfo'] = $menuInfo;
		$data['actions'] = Config::actionList();
		$data['extend'] = $this->getExtend($actionList);
		$data['comment'] = config('my.comment');
		$data['dbtype'] = config('database.connections.'.$menuInfo['connect'].'.type');
		
		$secrect = $this->getSecrect();
		
		if(empty($secrect['appid']) || empty($secrect['secrect'])){
			$this->error('appid或者秘钥不能为空');
		}
		
		$data['secrect'] = $secrect;
		$data['timestmp'] = time();
		
		$data['sign'] = md5(md5(json_encode($data,JSON_UNESCAPED_UNICODE).$secrect['secrect']));

		$res = $this->go_curl($this->url.'/index','post',json_encode($data));
				
		$ret = $res;
		
		$res = json_decode($res,true);
						
		if($res['status'] == 411){
			throw new ValidateException($res['msg']);
		}

		if(!is_array($res['model'])){
			halt($ret);
		}

		$rootPath = app()->getRootPath();
		
		
		try{
			foreach($res as $key=>$val){
				if($key == 'view'){
					foreach($val as $v){
						filePutContents($v['content'],$rootPath.'/'.$v['path'],2);
					}
				}else if($key == 'jscomponent'){
					foreach($val as $v){
						filePutContents($v['content'],$rootPath.'/public/components/'.$v['path'],2);
					}
				}else if($key == 'route'){
					$val['content'] && filePutContents($val['content'],$rootPath.'/'.$val['path'],3);
				}else{
					filePutContents($val['content'],$rootPath.'/'.$val['path'],1);
				}
			}
		}catch(\Exception $e){
			throw new ValidateException($e->getMessage());
		} 

		return true;
	}
	
	//根据表生成
	public function createByTable(){
		$data = $this->request->post();
		$connect = $data['connect'];
		$prefix = config('database.connections.'.$connect.'.prefix');
		
		$pk = Db::connect($connect)->name($data['table_name'])->getPk();
		
		$list = Db::connect($connect)->query('show full columns from '.$prefix.$data['table_name']);

		if($pk){
			$menuInfo = [
				'controller_name' => $this->setControllerName($data['table_name']),
				'title' => $data['table_name'],
				'pk'=>$pk,
				'table_name'=>$data['table_name'],
				'create_code'=>1,
				'status'=>1,
				'create_table'=>0,
				'app_id'=>$data['app_id'],
				'connect'=>$connect,
				'page_type'=>1
			];
			
			try{
				Db::startTrans();
				
				$res = Menu::create($menuInfo);
				
				Menu::update(['menu_id'=>$res->menu_id,'sortid'=>$res->menu_id]);
			
				$actionInfo = Config::actionList();
				foreach($actionInfo as $key=>$val){
					if($val['default_create'] && !in_array($val['type'],[10,11])){
						$actionInfo[$key]['menu_id'] = $res->menu_id;
						$actionInfo[$key]['sortid'] = $key+1;
					}else{
						unset($actionInfo[$key]);
					}
					if($data['app_type'] == 2 && $val['type'] == 12){
						unset($actionInfo[$key]);
					}
				}
				
				(new Action)->saveAll($actionInfo);
				
				$fieldInfo = [];
				foreach($list as $k=>$v){
					$fieldInfo[$k]['menu_id'] = $res->menu_id;
					$fieldInfo[$k]['title'] = $v['Comment'] ? $v['Comment'] : $v['Field'];
					$fieldInfo[$k]['field'] = $v['Field'];
					$fieldInfo[$k]['type'] = 1;
					$fieldInfo[$k]['list_type'] = 1;
					$fieldInfo[$k]['list_show'] = 2;
					$fieldInfo[$k]['search_type'] = 0;
					$fieldInfo[$k]['post_status'] = 1;
					$fieldInfo[$k]['create_table_field'] = 0;
					$fieldInfo[$k]['sortid'] = $k+1;
					$fieldInfo[$k]['datatype'] = preg_split("/\(.*\)+/", $v['Type'])[0];
					preg_match_all("/\((.*)\)/", $v['Type'],$all);
					$fieldInfo[$k]['length'] = $all[1][0];
					if($v['Field'] == $pk){
						$fieldInfo[$k]['width'] = 70;
						$fieldInfo[$k]['post_status'] = 0;
					}
				}
				
				(new Field)->saveAll($fieldInfo);
				
				Db::commit();
			}catch(\Exception $e){
				Db::rollback();
				throw new ValidateException ($e->getMessage()); 
			}
			if($this->createCode($res->menu_id)){
				return json(['status'=>200]);
			}
		}else{
			throw new ValidateException ('数据表主键不能为空'); 
		}
	}
	
	//获取关联表信息
	private function getExtend($actionList){
		$with_join = [];
		foreach($actionList as $v){
			if($v['with_join'] && in_array($v['type'],[2,3,5,11])){
				foreach(json_decode($v['with_join'],true) as $n){
					$n['action_type'] = $v['type'];
					$n['fields'] = $this->getExtendFields($n);
					array_push($with_join, $n);
				}
			}
		}

		return $with_join;
	}
	
	
	private function getExtendFields($val){
		$menuInfo = Menu::field('menu_id,table_name')->where('controller_name',$val['relative_table'])->find();
		$fieldList = Field::where('menu_id',$menuInfo['menu_id'])->order('sortid asc')->select()->toArray();
		foreach($fieldList as $k=>$v){
			$fieldList[$k]['belong_table'] = $val['relative_table'];
			$fieldList[$k]['table_name'] = $menuInfo['table_name'];
			if(!in_array($v['field'],$val['fields'])){
				unset($fieldList[$k]);
			}
		}
		return $fieldList;
	}
	
	
	//检测cms模型字段
	public function checkCmsField(){
		$field = $this->request->post('field');
		$list = Db::query('show full columns from '.config('database.connections.mysql.prefix').'content');
		foreach($list as $v){
			$arr[] = $v['Field'];
		}
		if(in_array($field,$arr)){
			throw new ValidateException('主表该字段已存在，请更换字段');
		}
		
		return json(['status'=>200]);
	}
	
	//获取控制器名称
	public function setControllerName($controller_name){
		if(strpos($controller_name,'/') > 0){
			$arr = explode('/',$controller_name);
			$controller_name = ucfirst($arr[0]).'/'.ucfirst($arr[1]);
		}else{
			$controller_name = ucfirst($controller_name);
		}
		
		return str_replace('_','',$controller_name);
	}
	
	//获取应用名 以及数据表名称
	public function getAppInfo(){
		$controller_name = $this->request->post('controller_name');
		$data['table_name'] = $this->getTableName($controller_name);
		$data['pk'] =  $data['table_name'] ? $data['table_name'].'_id' : '';
		$data['app_name'] = app('http')->getName();
		$data['status'] = 200;
		return json($data);
	}
	
	
	//获取应用名 以及数据表名称
	public function getAppType(){
		$appid = $this->request->post('app_id');
		$data['status'] = 200;
		$data['data'] = Application::where('app_id',$appid)->value('app_type');
		return json($data);
	}
	
	//获取应用名 以及数据表名称
	public function getDbType(){
		$dbname = $this->request->post('dbname');
		$dbtype = config('database.connections.'.$dbname.'.type');
		$data['status'] = 200;
		$data['data'] = $dbtype;
		return json($data);
	}
	
	private function getTableName($controller_name){
		if($controller_name && strpos($controller_name,'/') > 0){
			$controller_name = explode('/',$controller_name)[1];
		}
		return $controller_name;
	}
	
	
	//获取秘钥信息
	private function getSecrect(){
		$info = Db::name('secrect')->select()->column('data','name');
		return $info;
	}
	
	public static function getFieldStatus($tablename,$field,$connect){
		$list = Db::connect($connect)->query('show columns from '.$tablename);
		foreach($list as $v){
			$arr[] = $v['Field'];
		}
		if(in_array($field,$arr)){
			return true;
		}
	}
	
		//curl请求方法
	private function go_curl($url, $type, $data = false, &$err_msg = null, $timeout = 20, $cert_info = array()){
		$type = strtoupper($type);
		if ($type == 'GET' && is_array($data)) {
			$data = http_build_query($data);
		}
		$option = array();
		if ( $type == 'POST' ) {
			$option[CURLOPT_POST] = 1;
		}
		if ($data) {
			if ($type == 'POST') {
				$option[CURLOPT_POSTFIELDS] = $data;
			} elseif ($type == 'GET') {
				$url = strpos($url, '?') !== false ? $url.'&'.$data :  $url.'?'.$data;
			}
		}
		$option[CURLOPT_URL]            = $url;
		$option[CURLOPT_FOLLOWLOCATION] = TRUE;
		$option[CURLOPT_MAXREDIRS]      = 4;
		$option[CURLOPT_RETURNTRANSFER] = TRUE;
		$option[CURLOPT_TIMEOUT]        = $timeout;
		//设置证书信息
		if(!empty($cert_info) && !empty($cert_info['cert_file'])) {
			$option[CURLOPT_SSLCERT]       = $cert_info['cert_file'];
			$option[CURLOPT_SSLCERTPASSWD] = $cert_info['cert_pass'];
			$option[CURLOPT_SSLCERTTYPE]   = $cert_info['cert_type'];
		}
		//设置CA
		if(!empty($cert_info['ca_file'])) {
			// 对认证证书来源的检查，0表示阻止对证书的合法性的检查。1需要设置CURLOPT_CAINFO
			$option[CURLOPT_SSL_VERIFYPEER] = 1;
			$option[CURLOPT_CAINFO] = $cert_info['ca_file'];
		} else {
			// 对认证证书来源的检查，0表示阻止对证书的合法性的检查。1需要设置CURLOPT_CAINFO
			$option[CURLOPT_SSL_VERIFYPEER] = 0;
		}
		$ch = curl_init();
		curl_setopt_array($ch, $option);
		$response = curl_exec($ch);
		$curl_no  = curl_errno($ch);
		$curl_err = curl_error($ch);
		curl_close($ch);
		// error_log
		if($curl_no > 0) {
			if($err_msg !== null) {
				$err_msg = '('.$curl_no.')'.$curl_err;
			}
		}
		return $response;
	}

	
	
}

