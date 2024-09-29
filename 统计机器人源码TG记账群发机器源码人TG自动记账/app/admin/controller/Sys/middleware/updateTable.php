<?php
namespace app\admin\controller\Sys\middleware;
use think\exception\ValidateException;
use app\admin\controller\Admin;
use app\admin\controller\Sys\model\Field;
use app\admin\controller\Sys\model\Menu;
use think\facade\Db;


class updateTable extends Admin
{
	
    public function handle($request, \Closure $next)
    {	
		$data = $request->param();
		
		$this->validate($data,\app\admin\controller\Sys\validate\Menu::class);
		
		$menuInfo = Menu::find($data['menu_id']);
			
		$connect = $menuInfo['connect'] ? $menuInfo['connect'] : config('database.default');
		$prefix = config('database.connections.'.$connect.'.prefix');
		
		if(config('database.connections.'.$connect.'.type') <> 'mysql'){
			return $next($request);	
		}
		
		if($data['create_table'] && $data['table_name'] && $data['pk']){
			$table_name = strtolower(trim($data['table_name']));
			$pk = strtolower(trim($data['pk']));
			
			if(self::getTable($menuInfo['table_name'],$connect)){				
				$sqlTable = "ALTER TABLE ".$prefix."".$menuInfo['table_name']." CHANGE ".$menuInfo['pk']." ".$pk." INT( 11 ) COMMENT '编号' NOT NULL AUTO_INCREMENT;";
				$sqlField = "ALTER TABLE ".$prefix."".$menuInfo['table_name']." RENAME TO ".$prefix."".$table_name;
				
				$pk_id = Db::connect($connect)->name($menuInfo['table_name'])->getPk();
				
				if($pk_id <> $data['pk']){
					Field::field('field')->where('menu_id',$data['menu_id'])->where('field',$pk_id)->update(['field'=>$data['pk']]);
				}
				
				Db::connect($connect)->execute($sqlTable);
				Db::connect($connect)->execute($sqlField);
				
				if($data['page_type'] == 2){
					$fields = self::getFieldList($prefix.$menuInfo['table_name'],$conenct);
					if(!in_array('name',$fields)){
						Db::connect($connect)->execute("ALTER TABLE `".$prefix.$data['table_name']."` ADD `name` VARCHAR( 50 ) NOT NULL ");
					}
					
					if(!in_array('data',$fields)){
						Db::connect($connect)->execute("ALTER TABLE `".$prefix.$data['table_name']."` ADD `data` TEXT NOT NULL AFTER `name`");
					}
				}
			}else{
				$sql=" CREATE TABLE IF NOT EXISTS `".$prefix."".$table_name."` ( ";
				$sql .= '
					`'.$pk.'` int(10) NOT NULL AUTO_INCREMENT ,
					PRIMARY KEY (`'.$pk.'`)
					) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;
				';
				Db::connect($connect)->execute($sql);
			}
			
		}
		return $next($request);
    }
	
	
	//查看数据表是否存在
	public static function getTable($tableName,$connect){
		$list = Db::connect($connect)->query('show tables');
		foreach($list as $k=>$v){
			$array[] = $v['Tables_in_'.config('database.connections.'.$connect.'.database')];
		}
		if(in_array(config('database.connections.'.$connect.'.prefix').$tableName,$array)){
			return true;
		}
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