<?php
namespace app\admin\controller\Sys\middleware;
use think\exception\ValidateException;
use app\admin\controller\Sys\model\Menu;
use app\admin\controller\Sys\model\Application;
use app\admin\controller\Admin;
use app\admin\controller\Sys\model\Field;
use app\admin\controller\Sys\model\Action;
use think\facade\Db;
use think\helper\Str;

class deleteTable extends Admin
{
	
    public function handle($request, \Closure $next)
    {	
		$data = $request->param();
		$menuInfo = Menu::find($data['menu_id']);
		$applicationInfo = Application::find($menuInfo['app_id']);

		$connect = $menuInfo['connect'] ? $menuInfo['connect'] : config('database.default');
		$prefix = config('database.connections.'.$connect.'.prefix');
		
		if(config('database.connections.'.$connect.'.type') <> 'mysql'){
			return $next($request);	
		}
		
		if($menuInfo['table_name'] && $menuInfo['create_table']){
			Db::connect($connect)->execute('DROP TABLE if exists '.$prefix.$menuInfo['table_name']);
		}
		
		try{
			//开始删除相关文件
			if(!empty($menuInfo['controller_name'])){
				$rootPath = app()->getRootPath();
				@unlink($rootPath.'/app/'.$applicationInfo['app_dir'].'/controller/'.$menuInfo['controller_name'].'.php');
				if($this->getSubFiles($rootPath.'/app/'.$applicationInfo['app_dir'].'/controller/'.explode('/',$menuInfo['controller_name'])[0])){
					deldir($rootPath.'/app/'.$applicationInfo['app_dir'].'/controller/'.explode('/',$menuInfo['controller_name'])[0]);
				}
				
				deldir($rootPath.'/app/'.$applicationInfo['app_dir'].'/view/'.$this->getViewName($menuInfo['controller_name']));  //删除视图
				if($this->getSubFiles($rootPath.'/app/'.$applicationInfo['app_dir'].'/view/'.explode('/',$menuInfo['controller_name'])[0])){
					deldir($rootPath.'/app/'.$applicationInfo['app_dir'].'/view/'.explode('/',$menuInfo['controller_name'])[0]);
				}
				
				@unlink($rootPath.'/app/'.$applicationInfo['app_dir'].'/model/'.$menuInfo['controller_name'].'.php');
				if($this->getSubFiles($rootPath.'/app/'.$applicationInfo['app_dir'].'/model/'.explode('/',$menuInfo['controller_name'])[0])){
					deldir($rootPath.'/app/'.$applicationInfo['app_dir'].'/model/'.explode('/',$menuInfo['controller_name'])[0]);
				}
				
				@unlink($rootPath.'/app/'.$applicationInfo['app_dir'].'/validate/'.$menuInfo['controller_name'].'.php');
				if($this->getSubFiles($rootPath.'/app/'.$applicationInfo['app_dir'].'/validate/'.explode('/',$menuInfo['controller_name'])[0])){
					deldir($rootPath.'/app/'.$applicationInfo['app_dir'].'/validate/'.explode('/',$menuInfo['controller_name'])[0]);
				}
				
				@unlink($rootPath.'/app/'.$applicationInfo['app_dir'].'/route/'.$this->getControllerName(strtolower($menuInfo['controller_name'])).'.php'); 
				
				deldir($rootPath.'/public/components/'.$applicationInfo['app_dir'].'/'.$menuInfo['controller_name']);
				if($this->getSubFiles($rootPath.'/public/components/'.$applicationInfo['app_dir'].'/'.explode('/',$menuInfo['controller_name'])[0])){
					deldir($rootPath.'/public/components/'.$applicationInfo['app_dir'].'/'.explode('/',$menuInfo['controller_name'])[0]);
				}
			}
		}catch(\Exception $e){
			throw new ValidateException($e->getMessage());
		}

		return $next($request);	
    }
	
	//判断当前目录有没有其他文件
	private function getSubFiles($filepath){
		$res = scandir($filepath);
		if(count($res) == 2){
			return true;
		}
	}
	
		//多级控制器获取视图名称
	private function getViewName($controller_name){
		if($controller_name && strpos($controller_name,'/') > 0){
			$arr = explode('/',$controller_name);
			$controller_name = ucfirst($arr[0]).'/'.Str::snake($arr[1]);
		}else{
			$controller_name = Str::snake($controller_name);
		}
		return $controller_name;
	}
	
	//多级控制器 获取控制其名称
	private function getControllerName($controller_name){
		if($controller_name && strpos($controller_name,'/') > 0){
			$controller_name = explode('/',$controller_name)[1];
		}
		return $controller_name;
	}
}