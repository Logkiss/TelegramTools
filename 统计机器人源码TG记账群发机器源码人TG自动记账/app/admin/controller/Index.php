<?php
namespace app\admin\controller;
use think\facade\Db;


class Index extends Admin {
	
	
	public function index(){
		return view('index');
	}
	
	
	//后台首页主体内容
	public function main(){
		if(!$this->request->isPost()){
			return view('main');
		}else{		
			//折线图数据
			$echat_data['day_count'] = [
				'title'=>'当月业绩折线图',
				'day'=>[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],	//每月天数
				'data'=>[0,0,0,0,0,126,246,452,45,36,479,588,434,9,18,27,18,88,45,0,0,0,0,0,0,0,0,0,0,0]	//每天数据
			];
			
			if(config('my.show_home_chats',true)){
				$data['echat_data'] = $echat_data;
			}
			$data['card_data'] = $this->getCardData();
			$data['menus'] = $this->getMenuLink();
			$data['status'] = 200;
			return json($data);
		}
	}
	
	
	//头部提示消息
	function getNotice(){
		$data = [
			[
				'num'=>5,
				'title'=>'条评论待回复',
				'url'=>(string)url('admin/Membe/index'),
			],
			[
				'num'=>12,
				'title'=>'条订单待处理',
				'url'=>(string)url('admin/Map/index'),
			],
			[
				'num'=>50,
				'title'=>'条私信待处理',
				'url'=>(string)url('admin/Membe/index'),
			],
		];
		
		return json(['status'=>200,'data'=>$data]);
	}
	
	//首页统计数据
	private function getCardData(){
	    $zong=Db::name('order')->sum('amount');
	    $rl=Db::name('order')->where('rl',0)->sum('amount');
	    $wrl=Db::name('order')->where('rl',1)->sum('amount');
		$card_data = [	//头部统计数据
			[
			  'title_icon'=>"el-icon-user",
			  'card_title'=> "总金额",
			  'card_cycle'=> "",
			  'vist_num'=> $zong,
			  'vist_all_icon'=> "el-icon-trophy",
			],
			[
			  'title_icon'=>"el-icon-user",
			  'card_title'=> "认领金额",
			  'card_cycle'=> "",
			  'vist_num'=> $rl,
			  'vist_all_icon'=> "el-icon-trophy",
			],
			[
			  'title_icon'=>"el-icon-user",
			  'card_title'=> "未认领金额",
			  'card_cycle'=> "",
			  'vist_num'=> $wrl,
			  'vist_all_icon'=> "el-icon-trophy",
			],
		];
		
		return $card_data;
	}
	
	
	//获取首页快捷导航
	private function getMenuLink(){
		if(config('my.show_home_menu',true)){
			$data = Db::name('menu')->field('title,menu_pic,controller_name,url')->where('app_id',1)->where('home_show',1)->limit(8)->select()->toArray();
			foreach($data as $k=>$v){
				if(!$v['url']){
					$data[$k]['url'] = (string)url('admin/'.str_replace('/','.',$v['controller_name']).'/index');
				}else{
					$data[$k]['url'] = $v['url'];
				}
			}
			return $data;
		}
	}
	
	
	
}