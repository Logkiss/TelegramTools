<?php 

namespace app\admin\controller\Sys\validate;
use think\validate;

class Menu extends validate {


	protected $rule = [
		'title'=>['require'],
		'create_table'=> 'checkTable',
		'create_code'=> 'checkCode',
		'component_path'=>'checkComponents'
	];
	

	protected $message = [
		'title.require'=>'菜单名不能为空',
	];
	
	//创建数据表检测
    protected function checkTable($value, $rule, $data=[]){
		if($data['create_table']){
		    if(empty($data['pk'])){
			   $msg = '数据表主键不能为空';
			}
		   
			if(empty($data['table_name'])){
			   $msg = '数据表名称不能为空';
			}
			
			return $msg ? $msg : true;
		}else{
			return true;
		}
    }
	
	//创建数据表检测
    protected function checkCode($value, $rule, $data=[]){
		if($data['create_table']){
		    if(empty($data['pk'])){
			   $msg = '数据表主键不能为空';
			}
		   
			if(empty($data['table_name'])){
			   $msg = '数据表名称不能为空';
			}
			$app_type = db('application')->where('app_id',$data['app_id'])->value('app_type');
			if(empty($data['controller_name']) && $app_type == 1){
			   $msg = '访问路径名称不能为空';
			}
			
			return $msg ? $msg : true;
		}else{
			return true;
		}
    }
	
	
	//检测组件命名是否正确
	protected function checkComponents($value, $rule, $data=[]){
		$app_type = db('application')->where('app_id',$data['app_id'])->value('app_type');
		if($data['component_path'] && $app_type == 1){
			if(strpos(strtolower($data['component_path']),strtolower($data['controller_name'])) == false){
				$msg = '组件路径跟控制器名不匹配，请重新输入';
			}
			return $msg ? $msg : true;
		}else{
			return true;
		}
	}



}

