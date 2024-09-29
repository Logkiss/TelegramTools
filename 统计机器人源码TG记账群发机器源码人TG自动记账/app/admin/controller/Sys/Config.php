<?php
namespace app\admin\controller\Sys;

class Config
{
	
	//字段列表
	public static function fieldList(){
		$list=[
			[
				'name'=>'文本框',
				'type'=>1,
				'property'=>1,
				'mongoProperty'=>1,
				'search'=>true,
			],
			[
				'name'=>'下拉框',
				'type'=>2,
				'property'=>3,
				'mongoProperty'=>2,
				'item'=>true,
				'search'=>true,
			],
			[
				'name'=>'下拉框(多选)',
				'type'=>3,
				'property'=>1,
				'mongoProperty'=>1,
				'item'=>true,
				'search'=>true,
			],
			[
				'name'=>'下拉框(带分页)',
				'type'=>35,
				'property'=>3,
				'mongoProperty'=>2,
				'item'=>true,
				'search'=>true,
			],
			[
				'name'=>'单选框',
				'type'=>4,
				'property'=>3,
				'mongoProperty'=>2,
				'item'=>true,
				'search'=>true,
			],
			[
				'name'=>'多选框',
				'type'=>5,
				'property'=>1,
				'mongoProperty'=>1,
				'item'=>true,
				'search'=>true,
			],
			[
				'name'=>'开关按钮',
				'type'=>6,
				'property'=>6,
				'mongoProperty'=>2,
				'item'=>true,
				'search'=>true,
			],
			[
				'name'=>'密码框',
				'type'=>7,
				'property'=>1,
				'mongoProperty'=>1,
				'search'=>false,
			],
			[
				'name'=>'文本域',
				'type'=>8,
				'property'=>4,
				'mongoProperty'=>1,
				'search'=>true,
			],
			[
				'name'=>'日期框',
				'type'=>9,
				'property'=>2,
				'mongoProperty'=>2,
				'search'=>false,
			],
			[
				'name'=>'日期范围',
				'type'=>10,
				'property'=>1,
				'mongoProperty'=>1,
				'search'=>false,
			],
			[
				'name'=>'创建时间(后端自动)',
				'type'=>11,
				'property'=>2,
				'mongoProperty'=>2,
				'search'=>false,
			],
			[
				'name'=>'修改时间(后端自动)',
				'type'=>12,
				'property'=>2,
				'mongoProperty'=>2,
				'search'=>false,
			],
			[
				'name'=>'单图上传',
				'type'=>13,
				'property'=>1,
				'mongoProperty'=>1,
				'search'=>false,
			],
			[
				'name'=>'多图上传',
				'type'=>14,
				'property'=>4,
				'mongoProperty'=>1,
				'search'=>false,
			],
			[
				'name'=>'单文件上传',
				'type'=>15,
				'property'=>1,
				'mongoProperty'=>1,
				'search'=>false,
			],
			[
				'name'=>'多文件上传',
				'type'=>16,
				'property'=>4,
				'mongoProperty'=>1,
				'search'=>false,
			],
			[
				'name'=>'计数器',
				'type'=>17,
				'property'=>5,
				'mongoProperty'=>2,
				'search'=>false,
			],
			[
				'name'=>'标签',
				'type'=>18,
				'property'=>1,
				'mongoProperty'=>1,
				'search'=>true,
			],
			[
				'name'=>'滑块',
				'type'=>19,
				'property'=>3,
				'mongoProperty'=>2,
				'search'=>false,
			],
			[
				'name'=>'颜色选择器',
				'type'=>20,
				'property'=>1,
				'mongoProperty'=>1,
				'search'=>false,
			],
			[
				'name'=>'键值对',
				'type'=>21,
				'property'=>4,
				'mongoProperty'=>1,
				'search'=>false,
			],
			[
				'name'=>'省市区联动',
				'type'=>22,
				'property'=>1,
				'mongoProperty'=>1,
				'search'=>false,
			],
			[
				'name'=>'百度地图坐标选择器',
				'type'=>23,
				'property'=>4,
				'mongoProperty'=>1,
				'search'=>false,
			],
			[
				'name'=>'高德地图坐标选择器',
				'type'=>24,
				'property'=>4,
				'mongoProperty'=>1,
				'search'=>false,
			],
			[
				'name'=>'腾讯地图坐标选择器',
				'type'=>28,
				'property'=>4,
				'mongoProperty'=>1,
				'search'=>false,
			],
			[
				'name'=>'编辑器(wangeditor)',
				'type'=>25,
				'property'=>4,
				'mongoProperty'=>1,
				'search'=>false,
			],
			[
				'name'=>'编辑器(tinymce)',
				'type'=>26,
				'property'=>8,
				'mongoProperty'=>1,
				'search'=>false,
			],
			[
				'name'=>'markdown编辑器(mdeditor)',
				'type'=>27,
				'property'=>4,
				'mongoProperty'=>1,
				'search'=>false,
			],
			[
				'name'=>'评分',
				'type'=>37,
				'property'=>3,
				'mongoProperty'=>2,
				'search'=>false,
			],
			[
				'name'=>'排序号',
				'type'=>29,
				'property'=>2,
				'mongoProperty'=>2,
				'search'=>false,
			],
			[
				'name'=>'session值',
				'type'=>30,
				'property'=>2,
				'mongoProperty'=>1,
				'search'=>true,
			],
			[
				'name'=>'随机数',
				'type'=>31,
				'property'=>1,
				'mongoProperty'=>1,
				'search'=>false,
			],
			[
				'name'=>'订单号',
				'type'=>32,
				'property'=>1,
				'mongoProperty'=>1,
				'search'=>false,
			],
			[
				'name'=>'隐藏域',
				'type'=>33,
				'property'=>1,
				'mongoProperty'=>1,
				'search'=>false,
			],
			[
				'name'=>'请求ip',
				'type'=>34,
				'property'=>1,
				'mongoProperty'=>1,
				'search'=>false,
			],
			[
				'name'=>'url',
				'type'=>36,
				'property'=>4,
				'mongoProperty'=>1,
				'search'=>false,
			],
		];
        return $list;
	}
	
	/*
	name 方法名
	type 方法类型
	dialog 是否弹窗
	button 是否按钮
	view  是否生成视图文件
	*/
	public static function actionList(){
		$list=[
			[
				'name'=>'数据列表',
				'type'=>1,
				'dialog'=>false,
				'button'=>false,
				'view'=>true,
				'action_name'=>'index',
				'pagesize'=>20,
				'group_button_status'=>false,
				'sortid'=>1,
				'default_create'=>true,
				'show_admin'=>true,
				'show_api'=>true
			],
			[
				'name'=>'修改排序开关',
				'type'=>12,
				'dialog'=>false,
				'button'=>false,
				'view'=>false,
				'action_name'=>'updateExt',
				'group_button_status'=>false,
				'sortid'=>2,
				'default_create'=>true,
				'show_admin'=>true,
			],
			[
				'name'=>'添加',
				'type'=>2,
				'dialog'=>true,
				'button'=>true,
				'view'=>true,
				'icon'=>'el-icon-plus',
				'button_color' => 'success',
				'name'=>'添加',
				'action_name'=>'add',
				'group_button_status'=>true,
				'sortid'=>3,
				'default_create'=>true,
				'dialog_size'=>'600px',
				'show_admin'=>true,
				'show_api'=>true
			],
			[
				'name'=>'修改',
				'type'=>3,
				'dialog'=>true,
				'button'=>true,
				'view'=>true,
				'icon'=>'el-icon-edit',
				'button_color' => 'primary',
				'action_name'=>'update',
				'group_button_status'=>true,
				'list_button_status'=>true,
				'sortid'=>4,
				'default_create'=>true,
				'dialog_size'=>'600px',
				'show_admin'=>true,
				'show_api'=>true
			],
			[
				'name'=>'删除',
				'type'=>4,
				'dialog'=>false,
				'button'=>true,
				'view'=>false,
				'icon'=>'el-icon-delete',
				'button_color' => 'danger',
				'action_name'=>'delete',
				'group_button_status'=>true,
				'list_button_status'=>true,
				'sortid'=>5,
				'default_create'=>true,
				'show_admin'=>true,
				'show_api'=>true
				
			],
			[
				'name'=>'软删除',
				'type'=>20,
				'dialog'=>false,
				'button'=>true,
				'view'=>false,
				'icon'=>'el-icon-delete',
				'button_color' => 'danger',
				'action_name'=>'softdelete',
				'group_button_status'=>true,
				'list_button_status'=>true,
				'sortid'=>50,
				'default_create'=>false,
				'show_admin'=>true,
				'show_api'=>true
				
			],
			[
				'name'=>'查看详情',
				'type'=>5,
				'dialog'=>true,
				'button'=>true,
				'view'=>true,
				'icon'=>'el-icon-view',
				'button_color' => 'info',
				'action_name'=>'detail',
				'group_button_status'=>true,
				'sortid'=>6,
				'default_create'=>true,
				'dialog_size'=>'600px',
				'show_admin'=>true,
				'show_api'=>true
			],
			[
				'name'=>'重置密码',
				'type'=>6,
				'dialog'=>true,
				'button'=>true,
				'view'=>true,
				'icon'=>'el-icon-lock',
				'button_color' => 'primary',
				'action_name'=>'resetPwd',
				'group_button_status'=>true,
				'sortid'=>7,
				'dialog_size'=>'500px',
				'show_admin'=>true,
				'show_api'=>true
			],
			[
				'name'=>'设置指定值 如修改状态',
				'type'=>7,
				'dialog'=>true,
				'button'=>true,
				'icon'=>'el-icon-edit-outline',
				'button_color' => 'primary',
				'group_button_status'=>true,
				'sortid'=>8,
				'show_admin'=>true,
				'show_api'=>true
			],
			[
				'name'=>'数值加',
				'type'=>8,
				'dialog'=>true,
				'button'=>true,
				'view'=>true,
				'icon'=>'el-icon-plus',
				'button_color' => 'primary',
				'action_name' => 'jia',
				'group_button_status'=>true,
				'sortid'=>9,
				'dialog_size'=>'500px',
				'show_admin'=>true,
				'show_api'=>true
			],
			[
				'name'=>'数值减',
				'type'=>9,
				'dialog'=>true,
				'button'=>true,
				'view'=>true,
				'icon'=>'el-icon-plus',
				'button_color' => 'primary',
				'action_name'=>'jian',
				'group_button_status'=>true,
				'sortid'=>10,
				'dialog_size'=>'500px',
				'show_admin'=>true,
				'show_api'=>true
			],
			[
				'name'=>'导入',
				'type'=>10,
				'dialog'=>true,
				'button'=>true,
				'view'=>true,
				'icon'=>'el-icon-upload',
				'button_color' => 'warning',
				'action_name'=>'importData',
				'group_button_status'=>true,
				'sortid'=>11,
				'default_create'=>true,
				'show_admin'=>true,
				'dialog_size'=>'600px',
			],
			[
				'name'=>'导出',
				'type'=>11,
				'dialog'=>true,
				'button'=>true,
				'view'=>false,
				'icon'=>'el-icon-download',
				'button_color' => 'warning',
				'action_name'=>'dumpdata',
				'group_button_status'=>true,
				'sortid'=>12,
				'default_create'=>true,
				'show_admin'=>true,
			],
			[
				'name'=>'配置表单',
				'type'=>14,
				'dialog'=>false,
				'button'=>false,
				'view'=>false,
				'action_name'=>'index',
				'sortid'=>14,
				'show_admin'=>true,
			],
			[
				'name'=>'跳转链接',
				'type'=>15,
				'dialog'=>true,
				'button'=>true,
				'view'=>false,
				'icon'=>'el-icon-plus',
				'button_color' => 'warning',
				'action_name'=>'jumpUrl',
				'group_button_status'=>true,
				'sortid'=>15,
				'show_admin'=>true,
			],
			[
				'name'=>'弹窗连接',
				'type'=>16,
				'dialog'=>true,
				'button'=>true,
				'view'=>false,
				'icon'=>'el-icon-plus',
				'button_color' => 'warning',
				'group_button_status'=>true,
				'action_name'=>'dialogUrl',
				'sortid'=>16,
				'show_admin'=>true,
			],
			[
				'name'=>'批量添加',
				'type'=>17,
				'dialog'=>false,
				'button'=>true,
				'view'=>false,
				'icon'=>'el-icon-plus',
				'button_color' => 'success',
				'action_name'=>'batchAdd',
				'group_button_status'=>true,
				'list_button_status'=>false,
				'sortid'=>18,
				'default_create'=>false,
				'show_admin'=>true,
				'show_api'=>false
				
			],
			[
				'name'=>'批量修改',
				'type'=>18,
				'dialog'=>false,
				'button'=>true,
				'view'=>false,
				'icon'=>'el-icon-edit',
				'button_color' => 'primary',
				'action_name'=>'batchUpdate',
				'group_button_status'=>true,
				'list_button_status'=>false,
				'sortid'=>17,
				'default_create'=>false,
				'show_admin'=>true,
				'show_api'=>false
			],
			[
				'name'=>'批量修改2(弹窗修改成同一数据)',
				'type'=>19,
				'dialog'=>true,
				'button'=>true,
				'view'=>true,
				'icon'=>'el-icon-edit',
				'button_color' => 'primary',
				'action_name'=>'batupdate',
				'group_button_status'=>true,
				'list_button_status'=>false,
				'sortid'=>19,
				'default_create'=>false,
				'dialog_size'=>'600px',
				'show_admin'=>true,
			],
			[
				'name'=>'用户登录',
				'type'=>50,
				'sortid'=>50,
				'action_name'=>'login',
				'dialog'=>true,
				'show_api'=>true,
			],
			[
				'name'=>'发送验证码',
				'type'=>51,
				'sortid'=>51,
				'action_name'=>'sendSms',
				'dialog'=>false,
				'show_api'=>true,
			],
		];
        return $list;
	}
	
	
	//mysql字段的数据结构
    public static function propertyField(){
        $list= [
            ['type'=>1,'name'=>'varchar','maxlen'=>250,'decimal'=>0],
            ['type'=>2,'name'=>'int','maxlen'=>11,'decimal'=>0],
			['type'=>3,'name'=>'smallint','maxlen'=>6,'decimal'=>0],
            ['type'=>4,'name'=>'text','maxlen'=>0,'decimal'=>0],
			['type'=>8,'name'=>'longtext','maxlen'=>0,'decimal'=>0],
            ['type'=>5,'name'=>'decimal','maxlen'=>10,'decimal'=>2],
			['type'=>6,'name'=>'tinyint','maxlen'=>4,'decimal'=>0],
			['type'=>7,'name'=>'datetime','maxlen'=>0,'decimal'=>0],
        ];
        return $list;
    }
	
	//mongo字段的数据结构
	public static function propertyMongoField(){
        $list= [
            ['type'=>1,'name'=>'string'],
            ['type'=>2,'name'=>'int'],
        ];
        return $list;
    }
	
	public static function itemList(){
		$list = [
			[
				'name'=>'性别',
				'item'=>[
					['key'=>'男','val'=>'1','label_color'=>'primary'],
					['key'=>'女','val'=>'2','label_color'=>'warning'],
				]
			],
			[
				'name'=>'状态',
				'item'=>[
					['key'=>'正常','val'=>'1','label_color'=>'primary'],
					['key'=>'禁用','val'=>'0','label_color'=>'danger'],
				]
			],
			[
				'name'=>'开关',
				'item'=>[
					['key'=>'开启','val'=>'1'],
					['key'=>'关闭','val'=>'0'],
				]
			]
		];
		
		return $list;
	}
	
	//字段验证规则列表
	public static function ruleList(){
		$list = [
			'邮箱'	=> '/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/',
			'网址'	=> '/^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/',
			'货币'	=> '/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/',
			'数字'	=> '/^[0-9]*$/',
			'手机号'=> '/^1[3456789]\d{9}$/',
			'身份证'=> '/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/',
		];
		return $list;
	}
	
	
	//菜单页面显示结构
	public static function page_type_list(){
		$list = [
			['name'=>'table表格列表','type'=>1],
			['name'=>'form表单','type'=>2],
		];
		return $list;
	}
	
	
	//内置的短信平台
	public static function sms_list(){
		$list = [
			['name'=>'阿里','type'=>'Ali'],
			['name'=>'聚合','type'=>'Juhe'],
			['name'=>'极速','type'=>'Jisu'],
		];
		return $list;
	}
	
	
	//默认创建的字段
	public static function defaultFields(){
		$list = [
			['title'=>'编号','type'=>1,'datatype'=>'int','length'=>11,'list_show'=>2,'create_table_field'=>1,'sortid'=>1,'primary'=>true,'width'=>70],
			['title'=>'标题','field'=>'title','list_show'=>4,'type'=>1,'search_type'=>1],
		];
		
		return $list;
	}
	

}
