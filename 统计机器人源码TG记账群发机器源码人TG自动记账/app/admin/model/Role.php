<?php 
/*
 module:		角色管理控制器
 create_time:	2022-02-25 17:10:39
 author:		
 contact:		
*/

namespace app\admin\model;
use think\Model;

class Role extends Model {


	protected $connection = 'mysql';

 	protected $pk = 'role_id';

 	protected $name = 'role';




}

