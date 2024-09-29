<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2018 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------
use think\facade\Route;

Route::post('Sys.Base/createMenu', 'Sys.Base/createMenu')->middleware('createTable');	//创建数据表
Route::post('Sys.Base/updateMenu', 'Sys.Base/updateMenu')->middleware('updateTable');	//更新数据表
Route::post('Sys.Base/deleteMenu', 'Sys.Base/deleteMenu')->middleware('deleteTable');	//删除菜单
Route::post('Sys.Base/createField', 'Sys.Base/createField')->middleware('createField');	//创建字段
Route::post('Sys.Base/updateField', 'Sys.Base/updateField')->middleware('updateField');	//修改字段
Route::post('Sys.Base/updateFieldExt', 'Sys.Base/updateFieldExt')->middleware('updateField');	//修改字段
Route::post('Sys.Base/deleteField', 'Sys.Base/deleteField')->middleware('deleteField');	//删除字段

Route::post('Sys.Base/deleteApplication', 'Sys.Base/deleteApplication')->middleware('deleteApplication');	//删除应用
