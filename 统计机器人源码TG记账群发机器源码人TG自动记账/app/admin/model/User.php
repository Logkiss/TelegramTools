<?php 
/*
 module:		用户列表控制器
 create_time:	2022-03-12 12:53:52
 author:		
 contact:		
*/

namespace app\admin\model;
use think\Model;

class User extends Model {


	protected $connection = 'mysql';

 	protected $pk = 'id';

 	protected $name = 'user';




}

