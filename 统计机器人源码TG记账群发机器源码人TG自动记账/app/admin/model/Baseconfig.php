<?php 
/*
 module:		基本配置控制器
 create_time:	2022-02-25 17:26:30
 author:		
 contact:		
*/

namespace app\admin\model;
use think\Model;

class Baseconfig extends Model {


	protected $connection = 'mysql';

 	protected $pk = 'id';

 	protected $name = 'base_config';




}

