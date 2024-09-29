<?php 
/*
 module:		角色管理控制器
 create_time:	2022-02-25 17:10:39
 author:		
 contact:		
*/

namespace app\admin\controller;
use think\exception\ValidateException;
use app\admin\model\Role as RoleModel;
use think\facade\Db;

class Role extends Admin {


	/*
 	* @Description  数据列表
 	*/
	function index(){
		if (!$this->request->isPost()){
			return view('index');
		}else{
			$limit  = $this->request->post('limit', 20, 'intval');
			$page = $this->request->post('page', 1, 'intval');

			$where = [];
			$where['role_id'] = $this->request->post('role_id', '', 'serach_in');
			$where['name'] = $this->request->post('name', '', 'serach_in');
			$where['status'] = $this->request->post('status', '', 'serach_in');

			$field = 'role_id,name,status,description';

			$order  = $this->request->post('order', '', 'serach_in');	//排序字段
			$sort  = $this->request->post('sort', '', 'serach_in');		//排序方式

			$orderby = ($sort && $order) ? $sort.' '.$order : 'role_id desc';

			$res = RoleModel::where(formatWhere($where))->field($field)->order($orderby)->paginate(['list_rows'=>$limit,'page'=>$page])->toArray();

			$data['status'] = 200;
			$data['data'] = $res;
			return json($data);
		}
	}


	/*
 	* @Description  修改排序开关
 	*/
	function updateExt(){
		$postField = 'role_id,status';
		$data = $this->request->only(explode(',',$postField),'post',null);
		if(!$data['role_id']) throw new ValidateException ('参数错误');
		RoleModel::update($data);
		return json(['status'=>200,'msg'=>'操作成功']);
	}

	/*start*/
	/*
 	* @Description  添加
 	*/
	public function add(){
		$postField = 'name,status,description,access';
		$data = $this->request->only(explode(',',$postField),'post',null);

		$this->validate($data,\app\admin\validate\Role::class);
		
		if(!in_array('Home',$data['access'])){
			array_push($data['access'],'Home');
		}
		
		$data['access'] = implode(',',$data['access']);

		$res = RoleModel::create($data);
		return json(['status'=>200,'data'=>$res->role_id,'msg'=>'添加成功']);
	}
	/*end*/

	/*start*/
	/*
 	* @Description  修改
 	*/
	public function update(){
		$postField = 'role_id,name,status,description,access';
		$data = $this->request->only(explode(',',$postField),'post',null);

		$this->validate($data,\app\admin\validate\Role::class);
		
		if(!in_array('Home',$data['access'])){
			array_push($data['access'],'Home');
		}
		
		$data['access'] = implode(',',$data['access']);

		RoleModel::update($data);
		return json(['status'=>200,'msg'=>'修改成功']);
	}
	
	/*
 	* @Description  修改信息之前查询信息的 勿要删除
 	*/
	function getUpdateInfo(){
		$id =  $this->request->post('role_id', '', 'serach_in');
		if(!$id) $this->error('参数错误');
		$field = 'role_id,name,status,description,access';
		$res = RoleModel::field($field)->find($id);
		$res['access'] = explode(',',$res['access']);
		return json(['status'=>200,'data'=>$res]);
	}
	/*end*/

	/*start*/
	/*
 	* @Description  删除
 	*/
	function delete(){
		$idx =  $this->request->post('role_id', '', 'serach_in');
		if(!$idx) throw new ValidateException ('参数错误');
		if(in_array(1,explode(',',$idx))){
			$this->error('超级管理员分组禁止删除');
		}
		RoleModel::destroy(['role_id'=>explode(',',$idx)],true);
		return json(['status'=>200,'msg'=>'操作成功']);
	}
	/*end*/



}

