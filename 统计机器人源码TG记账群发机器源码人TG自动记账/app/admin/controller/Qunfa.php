<?php 
/*
 module:		群发公告控制器
 create_time:	2022-03-11 17:21:18
 author:		
 contact:		
*/

namespace app\admin\controller;
use think\exception\ValidateException;
use app\admin\model\Qunfa as QunfaModel;
use think\facade\Db;

class Qunfa extends Admin {


	/*
 	* @Description  群发公告
 	*/
	public function index(){
		if (!$this->request->isPost()){
			return view('index');
		}else{
			$data = $this->request->post();
	
		$data['group'] = implode(',',$data['group']);
		$data['fenlei'] = implode(',',$data['fenlei']);
		$qun = explode(",", $data['group']);
		$fl =  explode(",", $data['fenlei']);
		$img=$data['img'];
		$msg=$data['msg'];
		if(!empty($qun)){
		    foreach ($qun as $v) {
		        $qun=Db::name('group')->where('id',$v)->find();
		        if(!empty($qun)){
		           sendgg($qun['tg_groupid'],$img,$msg); 
		        }
		    }
		    return json(['status'=>200,'msg'=>'发送成功']);
		}
		if(!empty($fl)){
		    foreach ($qun as $v) {
		        $qunfl=Db::name('groupclass')->where('id',$v)->find();
		        if(!empty($qunfl)){
		            $qun = explode(",", $qunfl['coen']);
		            foreach ($qun as $va) {
        		        $quns=Db::name('group')->where('id',$va)->find();
        		        if(!empty($quns)){
        		           sendgg($quns['tg_groupid'],$img,$msg); 
        		        }
        		    }
		        }
		    }
		    return json(['status'=>200,'msg'=>'发送成功']);
		}
			return json(['status'=>-200,'msg'=>'发送失败']);
		}
	}


	/*
 	* @Description  修改信息之前查询信息的 勿要删除
 	*/
	function getInfo(){
		//$res = QunfaModel::column('data','name');
// 		$res['group'] = explode(',',$res['group']);
// 		$res['fenlei'] = explode(',',$res['fenlei']);
        $res['group'] = '';
		$res['fenlei'] = '';
		$res['img'] = '';
		$res['msg'] = '';
		$data['status'] = 200;
		$data['data'] = $res;
		$data['sql_field_data'] = $this->getSqlField('group,fenlei');
		return json($data);
	}


	/*
 	* @Description  获取定义sql语句的字段信息
 	*/
	function getFieldList(){
		return json(['status'=>200,'data'=>$this->getSqlField('group,fenlei')]);
	}

	/*
 	* @Description  获取定义sql语句的字段信息
 	*/
	private function getSqlField($list){
		$data = [];
		if(in_array('group',explode(',',$list))){
			$data['groups'] = $this->query('select id,name from cd_group','mysql');
		}
		if(in_array('fenlei',explode(',',$list))){
			$data['fenleis'] = $this->query('select id,name from cd_groupclass','mysql');
		}
		return $data;
	}



}

