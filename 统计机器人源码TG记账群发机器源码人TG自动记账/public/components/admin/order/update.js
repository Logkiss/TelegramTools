Vue.component('Update', {
	template: `
		<el-dialog title="修改" width="600px" class="icon-dialog" :visible.sync="show" @open="open" :before-close="closeForm" append-to-body>
			<el-form :size="size" ref="form" :model="form" :rules="rules" :label-width=" ismobile()?'90px':'16%'">
				<el-row >
					<el-col :span="24">
						<el-form-item label="分类" prop="fl">
							<el-input  v-model="form.fl" autoComplete="off" clearable  placeholder="请输入分类"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="24">
						<el-form-item label="银行信息" prop="bank">
							<el-input  v-model="form.bank" autoComplete="off" clearable  placeholder="请输入银行信息"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="24">
						<el-form-item label="交易时间" prop="jytime">
							<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="datetime" v-model="form.jytime" clearable placeholder="请输入交易时间"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="24">
						<el-form-item label="交易金额" prop="amount">
							<el-input  v-model="form.amount" autoComplete="off" clearable  placeholder="请输入交易金额"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="24">
						<el-form-item label="对方户名" prop="accname">
							<el-input  v-model="form.accname" autoComplete="off" clearable  placeholder="请输入对方户名"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="24">
						<el-form-item label="冻结状态" prop="dj">
							<el-switch :active-value="1" :inactive-value="0" v-model="form.dj"></el-switch>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="24">
						<el-form-item label="认领状态" prop="type">
							<el-select style="width:100%" v-model="form.rl" filterable clearable placeholder="请选择认领状态">
								<el-option key="0" label="正常" :value="1"></el-option>
								<el-option key="1" label="未认领" :value="0"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="24">
						<el-form-item label="用户id" prop="tgid">
							<el-input  v-model="form.tgid" autoComplete="off" clearable  placeholder="请输入用户id"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="24">
						<el-form-item label="用户名" prop="tgname">
							<el-input  v-model="form.tgname" autoComplete="off" clearable  placeholder="请输入用户名"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="24">
						<el-form-item label="群id" prop="type">
							<el-select  style="width:100%" v-model="form.group_id" filterable clearable placeholder="请选择群id">
								<el-option v-for="(item,i) in group_ids" :key="i" :label="item.key" :value="item.val"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="24">
						<el-form-item label="认领时间" prop="rltime">
							<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" type="datetime" v-model="form.rltime" clearable placeholder="请输入认领时间"></el-date-picker>
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
		info: {
			type: Object,
		},
	},
	data(){
		return {
			form: {
				fl:'',
				bank:'',
				jytime:'',
				amount:'',
				accname:'',
				dj:0,
				rl:0,
				tgid:'',
				tgname:'',
				group_id:'',
				rltime:'',
			},
			group_ids:[],
			loading:false,
			rules: {
				amount:[
					{pattern:/(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/, message: '交易金额格式错误'}
				],
			}
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
			this.form = this.info
			this.form.jytime = parseTime(this.form.jytime)
			this.form.rltime = parseTime(this.form.rltime)
		},
		submit(){
			this.$refs['form'].validate(valid => {
				if(valid) {
					this.loading = true
					axios.post(base_url + '/Order/update',this.form).then(res => {
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
