<?php
namespace app\admin\controller\Sys\middleware;
use app\admin\controller\Sys\model\Menu;
use app\admin\controller\Sys\model\Application;
use app\admin\controller\Sys\model\Field;
use app\admin\controller\Sys\model\Action;
use think\exception\ValidateException;
use app\admin\controller\Admin;
use think\facade\Db;


class deleteApplication extends Admin
{
	
    public function handle($request, \Closure $next)
    {	
		$data = $request->param();
		
		$applicationInfo = Application::find($data['app_id']);
		
		$rootPath = app()->getRootPath();
		
		if($applicationInfo['app_type'] == 3){
			if($applicationInfo['app_dir']){
				deldir($rootPath.'/app/'.$applicationInfo['app_dir']); //删除前端应用
			}
			
			$cmsCount = Application::where(['app_type'=>3])->count();
			if($cmsCount <= 1){
				deldir($rootPath.'/app/admin/controller/Cms'); //删除控制器
				deldir($rootPath.'/app/admin/model/Cms'); //删除模型
				deldir($rootPath.'/app/admin/validate/Cms'); //删除验证器
				deldir($rootPath.'/app/admin/view/Cms'); //删除验证器
				deldir($rootPath.'/public/components/admin/cms'); //删除验证器
				
				Db::execute('DROP TABLE IF EXISTS '.config('database.connections.mysql.prefix').'content');
				Db::execute('DROP TABLE IF EXISTS '.config('database.connections.mysql.prefix').'catagory');
				Db::execute('DROP TABLE IF EXISTS '.config('database.connections.mysql.prefix').'frament');
				Db::execute('DROP TABLE IF EXISTS '.config('database.connections.mysql.prefix').'position');
			
				$extendList = Menu::where(['app_id'=>$data['app_id']])->select();
				
				if($extendList){
					foreach($extendList as $key=>$val){
						Field::where(['menu_id'=>$val['menu_id']])->delete();
						Menu::where(['menu_id'=>$val['menu_id']])->delete();
						Db::execute('DROP TABLE IF EXISTS '.config('database.connections.mysql.prefix').$val['table_name']);
					}
				}
			}
		}else{
			if($applicationInfo['app_dir']){
				deldir($rootPath.'/app/'.$applicationInfo['app_dir']); //删除应用
				deldir($rootPath.'/public/components/'.$applicationInfo['app_dir']); //删除应用
			}
			$where['menu_id'] = Menu::where(['app_id'=>$data['app_id']])->column('menu_id');
			
			Menu::where(['app_id'=>$data['app_id']])->delete();
			Field::where($where)->delete();
			Action::where($where)->delete();
		}	
		
		return $next($request);
		
		
    }
}