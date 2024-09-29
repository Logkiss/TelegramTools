<?php 

namespace app\admin\controller\Sys\validate;
use think\validate;

class Field extends validate {


	protected $rule = [
		'title'=>['require'],
		'field'=>['require'],
		'type'=>'checkType',
	];
	

	protected $message = [
		'title.require'=>'字段中文名不能为空',
		'field.require'=>'字段英文名不能为空',
		'type.require'=>'字段类型不能为空',
	];

	
	//检测字段类型
    protected function checkType($value, $rule, $data=[])
    {
		if(in_array($data['type'],[2,3,4,5,6])){
			if(empty($data['item_config']) && empty($data['sql'])){
				$msg = '请配置选项选项';
			}else{
				foreach($data['item_config'] as $v){
					if(empty($v['val']) && $v['val'] <> '0'){
						$msg = '选项值有空值';
					}
				}
			}
			return $msg ? $msg : true;
		}else if($data['type'] == 31){
			if(empty($data['other_config']['rand_length'])){
				$msg = '请配置随机数长度';
			}
			return $msg ? $msg : true;
		}else{
			return true;
		}
    }
	
	protected $scene  = [
		'createField'=>['title','field','type'],
		'updateField'=>['name','field','type'],
	];
	
	
	

}

