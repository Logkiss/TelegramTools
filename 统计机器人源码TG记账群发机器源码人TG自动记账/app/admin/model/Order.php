<?php 
/*
 module:		账单列表控制器
 create_time:	2022-03-13 14:10:25
 author:		
 contact:		
*/

namespace app\admin\model;
use think\Model;

class Order extends Model {


	protected $connection = 'mysql';

 	protected $pk = 'id';

 	protected $name = 'order';


	function group(){
		return $this->hasOne(\app\admin\model\Group::class,'tg_groupid','group_id');
	}



}

