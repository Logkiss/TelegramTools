Vue.component('Detail', {
	template: `
		<el-dialog title="查看详情" width="600px" @open="open" class="icon-dialog" :visible.sync="show" :before-close="closeForm" append-to-body>
			<table cellpadding="0" cellspacing="0" class="table table-bordered" align="center" width="100%" style="word-break:break-all; margin-bottom:50px;  font-size:13px;">
				<tbody>
					<tr>
						<td class="title" width="100">分类：</td>
						<td>
							{{form.fl}}
						</td>
					</tr>
					<tr>
						<td class="title" width="100">银行信息：</td>
						<td>
							{{form.bank}}
						</td>
					</tr>
					<tr>
						<td class="title" width="100">交易时间：</td>
						<td>
							{{parseTime(form.jytime)}}
						</td>
					</tr>
					<tr>
						<td class="title" width="100">交易金额：</td>
						<td>
							{{form.amount}}
						</td>
					</tr>
					<tr>
						<td class="title" width="100">对方户名：</td>
						<td>
							{{form.accname}}
						</td>
					</tr>
					<tr>
						<td class="title" width="100">冻结状态：</td>
						<td>
							<span v-if="form.dj == '1'">冻结</span>
							<span v-if="form.dj == '0'">正常</span>
						</td>
					</tr>
					<tr>
						<td class="title" width="100">认领状态：</td>
						<td>
							<span v-if="form.rl == '1'">正常</span>
							<span v-if="form.rl == '0'">未认领</span>
						</td>
					</tr>
					<tr>
						<td class="title" width="100">用户id：</td>
						<td>
							{{form.tgid}}
						</td>
					</tr>
					<tr>
						<td class="title" width="100">用户名：</td>
						<td>
							{{form.tgname}}
						</td>
					</tr>
					<tr>
						<td class="title" width="100">群id：</td>
						<td>
							{{form.group_id}}
						</td>
					</tr>
					<tr>
						<td class="title" width="100">群名称：</td>
						<td>
							{{form.name}}
						</td>
					</tr>
					<tr>
						<td class="title" width="100">认领时间：</td>
						<td>
							{{parseTime(form.rltime)}}
						</td>
					</tr>
				</tbody>
			</table>
		</el-dialog>
	`
	,
	props: {
		show: {
			type: Boolean,
			default: true
		},
		size: {
			type: String,
			default: 'mini'
		},
		info: {
			type: Object,
		},
	},
	data() {
		return {
			form:{
			},
		}
	},
	methods: {
		open(){
			axios.post(base_url+'/Order/detail',this.info).then(res => {
				this.form = res.data.data
			})
		},
		closeForm(){
			this.$emit('update:show', false)
		}
	}
})
