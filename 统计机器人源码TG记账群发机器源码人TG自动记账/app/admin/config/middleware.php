<?php

return [
	'alias' => [
        'createTable' => app\admin\controller\Sys\middleware\createTable::class,
		'updateTable' => app\admin\controller\Sys\middleware\updateTable::class,
		'deleteTable' => app\admin\controller\Sys\middleware\deleteTable::class,
		'createField' => app\admin\controller\Sys\middleware\createField::class,
		'updateField' => app\admin\controller\Sys\middleware\updateField::class,
		'deleteField' => app\admin\controller\Sys\middleware\deleteField::class,
		
		'deleteApplication' => app\admin\controller\Sys\middleware\deleteApplication::class,	//删除菜单文件
    ],
];
