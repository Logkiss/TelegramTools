Vue.component('Pladd', {
	template: `
		<el-dialog title="批量添加" width="600px" class="icon-dialog" :visible.sync="show" @open="open" :before-close="closeForm" append-to-body>
			<el-form :size="size" ref="form" :model="form" :label-width=" ismobile()?'90px':'16%'">
			    <el-row >
					<el-col :span="24">
						<el-form-item label=分类 prop="fl">
							<el-input  v-model="form.fl" autoComplete="off" clearable  placeholder="请输入分类名称"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="24">
						<el-form-item label="内容" prop="date">
							<textarea style="height: 500px;width:400px;" v-model="form.date" autoComplete="off" clearable  placeholder="姓名+金额一行一个"></textarea>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button :size="size" :loading="loading" type="primary" @click="submit" >
					<span v-if="!loading">确 定</span>
					<span v-else>提 交 中...</span>
				</el-button>
				<el-button :size="size" @click="closeForm">取 消</el-button>
			</div>
		</el-dialog>
	`
	,
	components:{
	},
	props: {
		show: {
			type: Boolean,
			default: false
		},
		size: {
			type: String,
			default: 'small'
		},
	},
	data(){
		return {
			form: {
				date:'',
				fl:''
			},
			group_ids:[],
			loading:false,
		}
	},
	watch:{
		show(val){
			if(val){
				axios.post(base_url + '/Order/getFieldList').then(res => {
					if(res.data.status == 200){
						this.group_ids = res.data.data.group_ids
					}
				})
			}
		}
	},
	methods: {
		open(){
		},
		submit(){
			this.$refs['form'].validate(valid => {
				if(valid) {
					this.loading = true
					axios.post(base_url + '/Order/pladd',this.form).then(res => {
						if(res.data.status == 200){
							this.$message({message: res.data.msg, type: 'success'})
							this.$emit('refesh_list')
							this.closeForm()
						}else{
							this.loading = false
							this.$message.error(res.data.msg)
						}
					}).catch(()=>{
						this.loading = false
					})
				}
			})
		},
		closeForm(){
			this.$emit('update:show', false)
			this.loading = false
			if (this.$refs['form']!==undefined) {
				this.$refs['form'].resetFields()
			}
		},
	}
})
