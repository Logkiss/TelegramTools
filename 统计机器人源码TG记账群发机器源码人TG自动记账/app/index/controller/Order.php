<?php 

namespace app\index\controller;
use think\facade\Db;
use think\facade\Log;
use think\facade\View;


class Order{
    public function jr(){
        //查询本群今日所有人汇总
        $groupid = request()->param('groupid');
	    //自动正常
	    $zdz=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('zd',0)->where('dj',0)->where('rl',1)->count();
	    $zdzj=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('zd',0)->where('dj',0)->where('rl',1)->sum('amount');
	    //自动冻结
	    $zdd=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('zd',0)->where('dj',1)->where('rl',1)->count();
	    $zddj=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('zd',0)->where('dj',1)->where('rl',1)->sum('amount');
	    //手动正常
	    $sdz=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('zd',1)->where('dj',0)->where('rl',1)->count();
	    $sdzj=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('zd',1)->where('dj',0)->where('rl',1)->sum('amount');
	    //手动冻结
	    $sdd=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('zd',1)->where('dj',1)->where('rl',1)->count();
	    $sddj=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('zd',1)->where('dj',1)->where('rl',1)->sum('amount');
	    //群明细
	    $mx=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('rl',1)->select();
	    //查询所有用户
	    $userdata=Db::name('user')->select();
	    $usera=[];
	    if(!empty($userdata)&&$zdz>0){
	         foreach ($userdata as $key => $i) {
		        $zcje=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('tgid',$i['tguid'])->where('rl',1)->where('dj',0)->sum('amount');
		        $djje=Db::name('order')->whereDay('rltime')->where('group_id',$groupid)->where('tgid',$i['tguid'])->where('rl',1)->where('dj',1)->sum('amount');
		       if($zcje!=0||$djje!=0){
    		        $datas['id']=$key;
    		        $datas['name']=$i['tgname'];
    		        $datas['zc']=$zcje;
    		        $datas['dj']=$djje;
    		        array_push($usera,$datas);
		       }
		    }
	    }else{
	        $usera=[];
	    }
	    $jr=1;
	    $jrurl='/index/order/zr?groupid='.$groupid;
	    View::assign([
            'sj'  => date('Y-m-d'),
            'zdzj' => $zdzj,
            'zdz' => $zdz,
            'zddj' => $zddj,
            'zdd' => $zdd,
            'sdz' =>$sdz,
            'sdzj' =>$sdzj,
            'sdd' =>$sdd,
            'sddj' =>$sddj,
            'usera' => $usera,
            'mx' => $mx,
            'jrurl' =>$jrurl,
            'jr' =>$jr
        ]);
	    return view('jr');
    }
    public function zr(){
        //查询本群昨日所有人汇总
        $groupid = request()->param('groupid');
	    //自动正常
	    $zdz=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('zd',0)->where('dj',0)->where('rl',1)->count();
	    $zdzj=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('zd',0)->where('dj',0)->where('rl',1)->sum('amount');
	    //自动冻结
	    $zdd=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('zd',0)->where('dj',1)->where('rl',1)->count();
	    $zddj=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('zd',0)->where('dj',1)->where('rl',1)->sum('amount');
	    //手动正常
	    $sdz=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('zd',1)->where('dj',0)->where('rl',1)->count();
	    $sdzj=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('zd',1)->where('dj',0)->where('rl',1)->sum('amount');
	    //手动冻结
	    $sdd=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('zd',1)->where('dj',1)->where('rl',1)->count();
	    $sddj=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('zd',1)->where('dj',1)->where('rl',1)->sum('amount');
	    //群明细
	    $mx=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('rl',1)->select();
	    //查询所有用户
	    $userdata=Db::name('user')->select();
	    $usera=[];
	    if(!empty($userdata)&&$zdz>0){
	         foreach ($userdata as $key => $i) {
		        $zcje=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('tgid',$i['tguid'])->where('rl',1)->where('dj',0)->sum('amount');
		        $djje=Db::name('order')->whereDay('rltime', 'yesterday')->where('group_id',$groupid)->where('tgid',$i['tguid'])->where('rl',1)->where('dj',1)->sum('amount');
		         if($zcje!=0||$djje!=0){
    		        $datas['id']=$key;
    		        $datas['name']=$i['tgname'];
    		        $datas['zc']=$zcje;
    		        $datas['dj']=$djje;
    		        array_push($usera,$datas);
		         }
		    }
	    }else{
	        $usera=[];
	    }
	    $jr=0;
	    $jrurl='/index/order/jr?groupid='.$groupid;
	    View::assign([
            'sj'  => date('Y-m-d',strtotime('-1 day')),
            'zdzj' => $zdzj,
            'zdz' => $zdz,
            'zddj' => $zddj,
            'zdd' => $zdd,
            'sdz' =>$sdz,
            'sdzj' =>$sdzj,
            'sdd' =>$sdd,
            'sddj' =>$sddj,
            'usera' => $usera,
            'mx' => $mx,
            'jrurl' =>$jrurl,
            'jr' =>$jr
        ]);
	    return view('jr');
    }
}