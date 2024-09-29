<?php 
/*
 module:		账单列表控制器
 create_time:	2022-03-13 14:10:25
 author:		
 contact:		
*/

namespace app\admin\validate;
use think\validate;

class Order extends validate {


	protected $rule = [
		'amount'=>['regex'=>'/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/'],
	];

	protected $message = [
		'amount.regex'=>'交易金额格式错误',
	];

	protected $scene  = [
		'add'=>['amount'],
		'update'=>['amount'],
		'pladd'=>['amount'],
	];



}

