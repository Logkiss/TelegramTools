<?php 
/*
 module:		机器人设置控制器
 create_time:	2022-03-11 19:32:50
 author:		
 contact:		
*/

namespace app\admin\controller;
use think\exception\ValidateException;
use app\admin\model\Robotconfig as RobotconfigModel;
use think\facade\Db;

class Robotconfig extends Admin {


	/*
 	* @Description  机器人设置
 	*/
	public function index(){
		if (!$this->request->isPost()){
			return view('index');
		}else{
			$data = $this->request->post();
			$this->validate($data,\app\admin\validate\Robotconfig::class);
	

			$info = RobotconfigModel::column('data','name');
			foreach ($data as $key => $value) {
				if(array_key_exists($key,$info)){
					RobotconfigModel::field('data')->where(['name'=>$key])->update(['data'=>$value]);
				}else{
					RobotconfigModel::create(['name'=>$key,'data'=>$value]);
				}
			}
			return json(['status'=>200,'msg'=>'操作成功']);
		}
	}


	/*
 	* @Description  修改信息之前查询信息的 勿要删除
 	*/
	function getInfo(){
		$res = RobotconfigModel::column('data','name');

		$data['status'] = 200;
		$data['data'] = $res;
		return json($data);
	}




}

