<?php
namespace app\admin\controller\Sys\middleware;
use app\admin\controller\Sys\model\Menu;
use think\exception\ValidateException;
use app\admin\controller\Admin;
use think\facade\Db;


class createField extends Admin
{
	
    public function handle($request, \Closure $next)
    {	
		$data = $request->param();
		
		$this->validate($data,\app\admin\controller\Sys\validate\Field::class);
		
		$menuInfo = Menu::find($data['menu_id']);
		$connect = $menuInfo['connect'] ? $menuInfo['connect'] : config('database.default');
		$prefix = config('database.connections.'.$connect.'.prefix');
		
		if(config('database.connections.'.$connect.'.type') <> 'mysql'){
			return $next($request);	
		}

		if($data['create_table_field']){
			if($menuInfo['page_type'] == 1){
				if((!empty($data['default_value']))){
					if($data['type'] == 13){
						$data['default_value'] = '0';
					}
					$default = "DEFAULT '".$data['default_value']."'";
				}else{
					$default = 'DEFAULT NULL';
				}
				
				if(in_array($data['datatype'],['datetime','longtext'])){
					$data['length'] = ' null';
				}else{
					$data['length'] = "({$data['length']})";
				}
				
				$sql="ALTER TABLE ".$prefix."{$menuInfo['table_name']} ADD {$data['field']} {$data['datatype']}{$data['length']} COMMENT '{$data['title']}' {$default}";
				
				Db::connect($connect)->execute($sql);
				
				if(!empty($data['indexdata'])){
					Db::connect($connect)->execute("ALTER TABLE ".$prefix."{$menuInfo['table_name']} ADD ".$data['indexdata']." (  `".$data['field']."` )");
				}
			}
			if($menuInfo['page_type'] == 2 && $data['type'] == 30){
				Db::connect($connect)->execute("ALTER TABLE `".$prefix.$menuInfo['table_name']."` ADD {$data['field']} VARCHAR( 50 )");
			}
		}
		
		return $next($request);
    }
}