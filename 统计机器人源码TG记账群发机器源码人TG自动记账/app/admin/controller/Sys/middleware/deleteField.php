<?php
namespace app\admin\controller\Sys\middleware;
use app\admin\controller\Sys\model\Menu;
use app\admin\controller\Sys\model\Application;
use app\admin\controller\Sys\model\Field;
use think\exception\ValidateException;
use app\admin\controller\Admin;
use think\facade\Db;

class deleteField extends Admin
{
	
    public function handle($request, \Closure $next)
    {	
		$data = $request->param();
		
		$menuInfo = Menu::find($data['menu_id']);		
		$connect = $menuInfo['connect'] ? $menuInfo['connect'] : config('database.default');
		$prefix = config('database.connections.'.$connect.'.prefix');
		
		if(config('database.connections.'.$connect.'.type') <> 'mysql'){
			return $next($request);	
		}
		
		$fieldList = Field::field('create_table_field,field,type')->where($data)->select()->toArray();
				
		if($menuInfo['page_type'] == 1){
			$fields = self::getFieldList($prefix.$menuInfo['table_name'],$connect);
			$drop = '';
			$pk = Db::connect($connect)->name($menuInfo['table_name'])->getPk();
						
			foreach($fieldList as $val){
				if($val['create_table_field'] == 1 && in_array($val['field'],$fields) && $val['field'] <> $pk){			
					$drop .= ' DROP '.$val['field'].' ,';
				}
			}
			$sql = 'ALTER TABLE '.$prefix.$menuInfo['table_name'].rtrim($drop,',');
			Db::connect($connect)->execute($sql);
		}else{
			foreach($fieldList as $val){
				if($val['type'] == 30){
					$sql = 'ALTER TABLE '.$prefix.$menuInfo['table_name'].' DROP '.$val['field'];
					Db::connect($connect)->execute($sql);
				}
				Db::connect($connect)->name($menuInfo['table_name'])->where('name',$val['field'])->delete();
			}
		}
		
		return $next($request);		
    }
	
	//获取表的所有字段
	public static function getFieldList($tablename,$connect){
		$list = Db::connect($connect)->query('show columns from '.$tablename);
		foreach($list as $v){
			$arr[] = $v['Field'];
		}
		return $arr;
	}
}