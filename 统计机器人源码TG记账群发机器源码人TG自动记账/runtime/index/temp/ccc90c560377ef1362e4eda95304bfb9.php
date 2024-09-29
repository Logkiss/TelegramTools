<?php /*a:1:{s:56:"/www/wwwroot/11.fanlipt.com/app/index/view/order/jr.html";i:1647090844;}*/ ?>
<html><head>
    <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0'>

    <script type='text/javascript' src='//apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js'></script>
    <title>显示完整账单</title>
    <script src='/index/layui.js'></script>
    <link rel='stylesheet' href='/index/layui.css'>
    <style>
        td {
            padding: 1px 8px;
        }

        .layui-table td, .layui-table th {
            padding: 5px;
        }
    </style>

</head>
<body style='margin:20px'>
<div style='margin:20px 0'>
    <?php echo $sj; ?> <a style='color: dodgerblue' href="<?php echo $jrurl; ?>">查看<?php echo $jr=='0' ? '今' : '昨'; ?>日统计</a>
</div>
<div class='layui-row'>
    <div class='layui-col-xs12 layui-col-md9'>
        <table class='layui-table maintable'>
                                    <tbody><tr>
                            <td style='margin:0 20px'>序号</td>
                            <td style='margin:0 20px'>类别</td>
                            <td>正常</td>
                            <td>冻结</td>
 </tr>
 <tr>
                            <td style='margin:0 20px'>0</td>
                            <td style='margin:0 20px'>自动入账</td>
                            <td><b style='color: green'>正常: <?php echo $zdzj; ?> (<?php echo $zdz; ?> 笔)</b> </td>
                            <td><b style='color: red'>冻结: <?php echo $zddj; ?> (<?php echo $zdd; ?>笔) 
</b> </td>
 </tr>                        <tr>
                            <td style='margin:0 20px'>1</td>
                            <td style='margin:0 20px'>手动入账</td>
                            <td><b style='color: green'>正常: <?php echo $sdzj; ?> (<?php echo $sdz; ?>笔)</b> </td>
                            <td><b style='color: red'>冻结:  <?php echo $sddj; ?> (<?php echo $sdd; ?>笔)
</b> </td>
 </tr>
        </tbody></table>

        用户汇总 <br>
        <table class='layui-table maintable hz'><tbody>
                            <tr>
                            <td style='margin:0 20px'>序号</td>
                            <td style='margin:0 20px'>姓名(uid)</td>
                            <td>成功</td>
                            <td>冻结</td>
                            </tr> 
                        <?php foreach($usera as $v): ?>
                             <tr>
                                <td class='id' style='margin:0 20px'><?php echo $v['id']; ?></td>
                                <td class='name' style='margin:0 20px'><?php echo $v['name']; ?></td>
                                <td><b class='cg' style='color: green'><?php echo $v['zc']; ?></b></td>
                                <td><b class='dj' style='color: red'><?php echo $v['dj']; ?></b> </td>
                            </tr>
                        <?php endforeach; ?>
        </tbody></table>

        明细<br>
        <table class='layui-table maintable'>
                                    <tbody><tr>
                            <td style='margin:0 20px'>序号</td>
                            <td style='margin:0 20px'>群名称</td>
                            <td style='margin:0 20px'>姓名(uid)</td>
                            <td>类型</td>
                            <td>名字</td>
                            <td>金额</td>
                            <td>状态</td>
                            <td>查询时间</td>
 </tr> 
 <?php foreach($mx as $v): ?>
 <tr>
                            <td style='margin:0 20px'><?php echo $v['id']; ?></td>
                            <td style='margin:0 20px'><?php echo $v['group_name']; ?></td>
                            <td style='margin:0 20px'><?php echo $v['tgname'].'--'.$v['tgid']; ?></td>
                            <td><b style='color: blue'><?php echo $v['zd']==0 ? '自动入账' : '手动入帐'; ?></b></td>
                            <td><b style='color: red'><?php echo $v['accname']; ?></b> </td>
                            <td><b style='color: red'><?php echo $v['amount']; ?></b> </td>
                            <td><b style='color: green'><?php echo $v['dj']==0 ? '正常' : '冻结'; ?></b> </td>
                            <td><b style='color: red'><?php echo date('Y-m-d H:i:s',!is_numeric($v['rltime'])? strtotime($v['rltime']) : $v['rltime']); ?></b> </td>
 </tr>
 <?php endforeach; ?>
        </tbody></table>

    </div>
</div>
<script type='text/javascript'>
      console.log($usera);
       
</script>

</body></html>