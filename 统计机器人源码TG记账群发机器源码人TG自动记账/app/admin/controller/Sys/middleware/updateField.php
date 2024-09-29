<?php
namespace app\admin\controller\Sys\middleware;
use think\exception\ValidateException;
use app\admin\controller\Sys\model\Menu;
use app\admin\controller\Sys\model\Field; 
use app\admin\controller\Admin;
use think\facade\Db;

class updateField extends Admin
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
			
		if($data['create_table_field']){
			if($menuInfo['page_type'] == 1 || ($menuInfo['page_type'] == 2 && $data['type'] == 30)){
				if(!empty($data['default_value'])){
					if($data['type'] == 13){
						$data['default_value'] = '0';
					}
					$default = "DEFAULT '".$data['default_value']."'";
				}else{
					$default = 'DEFAULT NULL';
				}
				
				$fieldInfo = Field::find($data['id']);
				
				$pk_id = Db::connect($connect)->name($menuInfo['table_name'])->getPk();

				if($fieldInfo['field'] == $pk_id){
					$auto = 'AUTO_INCREMENT';
					$maxlen = !empty($data['length']) ? $data['length'] : 11;
					$datatype = !empty($data['datatype']) ? $data['datatype'] : 'int';
					$default = 'NOT NULL';
					$primary_key = 'PRIMARY KEY';
					
					Menu::field('pk')->where('menu_id',$fieldInfo['menu_id'])->update(['pk'=>$data['field']]);
					
				}else{
					$auto = '';
				}
				
				if(in_array($data['datatype'],['datetime','longtext'])){
					$data['length'] = ' null';
				}else{
					$data['length'] = "({$data['length']})";
				}

				$fields = self::getFieldS($prefix.$menuInfo['table_name'],$data['field'],$connect);
				
				if(in_array($fieldInfo['field'],$fields)){
					$sql="ALTER TABLE ".$prefix."{$menuInfo['table_name']} CHANGE {$fieldInfo['field']} {$data['field']} {$data['datatype']}{$data['length']} COMMENT '{$data['title']}' {$default} {$auto}";
				}else{
					$sql="ALTER TABLE ".$prefix."{$menuInfo['table_name']} ADD {$data['field']} {$data['datatype']}{$data['length']} COMMENT '{$data['title']}' {$default} {$auto} {$primary_key}";
				}
	
				Db::connect($connect)->execute($sql);
				
				//判断是否存在索引  不存在则创建
				if($data['indexdata']){
					if(!self::getTableIndex($prefix.$menuInfo['table_name'],$data['field'],$connect)){
						Db::connect($connect)->execute("ALTER TABLE ".$prefix."{$menuInfo['table_name']} ADD ".$data['indexdata']." (  `".$data['field']."` )");
					}
				}
			}
		}
		
		return $next($request);
    }
	
	//判断数据表字段是否存在
	public static function getFieldS($tablename,$field,$connect){
		$list = Db::connect($connect)->query('show columns from '.$tablename);
		foreach($list as $v){
			$arr[] = $v['Field'];
		}
		return $arr;
	}
	
	
	//查看索引是否存在
	public static function getTableIndex($tablename,$indexName,$connect){
		$list = Db::connect($connect)->query('show index from '.$tablename);
		foreach($list as $k=>$v){
			if($v['Column_name'] == $indexName){
				$status = true;
			}
		}
		return $status;
	}
	
}