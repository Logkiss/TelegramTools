Vue.component('Detail', {
	template: `
		<el-dialog title="查看详情" width="600px" @open="open" class="icon-dialog" :visible.sync="show" :before-close="closeForm" append-to-body>
			<table cellpadding="0" cellspacing="0" class="table table-bordered" align="center" width="100%" style="word-break:break-all; margin-bottom:50px;  font-size:13px;">
				<tbody>
					<tr>
						<td class="title" width="100">应用名：</td>
						<td>
							{{form.application_name}}
						</td>
					</tr>
					<tr>
						<td class="title" width="100">用户名：</td>
						<td>
							{{form.username}}
						</td>
					</tr>
					<tr>
						<td class="title" width="100">请求url：</td>
						<td>
							{{form.url}}
						</td>
					</tr>
					<tr>
						<td class="title" width="100">客户端ip：</td>
						<td>
							{{form.ip}}
						</td>
					</tr>
					<tr>
						<td class="title" width="100">浏览器信息：</td>
						<td>
							{{form.useragent}}
						</td>
					</tr>
					<tr>
						<td class="title" width="100">请求内容：</td>
						<td>
							{{form.content}}
						</td>
					</tr>
					<tr>
						<td class="title" width="100">异常信息：</td>
						<td>
							{{form.errmsg}}
						</td>
					</tr>
					<tr>
						<td class="title" width="100">创建时间：</td>
						<td>
							{{parseTime(form.create_time)}}
						</td>
					</tr>
					<tr>
						<td class="title" width="100">类型：</td>
						<td>
							<span v-if="form.type == '1'">登录日志</span>
							<span v-if="form.type == '2'">操作日志</span>
							<span v-if="form.type == '3'">异常日志</span>
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
			axios.post(base_url+'/Log/detail',this.info).then(res => {
				this.form = res.data.data
			})
		},
		closeForm(){
			this.$emit('update:show', false)
		}
	}
})
