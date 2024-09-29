
// 日期格式化
function parseTime(time, pattern) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		} else if (typeof time === 'string') {
			time = time.replace(new RegExp(/-/gm), '/');
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}

function curentTime(){ 
	var now = new Date();
	var year = now.getFullYear();       //年
	var month = now.getMonth() + 1;     //月
	var day = now.getDate();            //日
	var hh = now.getHours();            //时
	var mm = now.getMinutes();          //分
	var clock = year + "-";
   
	if(month < 10)
		clock += "0";
   
	clock += month + "-";
   
	if(day < 10)
		clock += "0";
	   
	clock += day + " ";
   
	if(hh < 10)
		clock += "0";
	   
	clock += hh + ":";
	if (mm < 10) clock += '0'; 
	clock += mm; 
	return(clock); 
}


//获取复选框 下拉多选的键名 根据值
function formatStr(val,data){
	if(val){
		const fieldConfig = typeof(data)=='string' ? JSON.parse(data) : data
		let str = ''
		val.split(",").forEach(item => {
			fieldConfig.forEach(vo=>{
				if(item == vo.val){
					str += ',' +vo.key
				}
			})
		})
		return str.substr(1)
	}
}

//json对象转为url参数
function param(json) {
	if (!json) return ''
	return cleanArray(
	  Object.keys(json).map(key => {
		if (json[key] === undefined) return ''
		return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
	  })
	).join('&')
}

function cleanArray(actual) {
	const newArray = []
	for (let i = 0; i < actual.length; i++) {
	  if (actual[i]) {
		newArray.push(actual[i])
	  }
	}
	return newArray
}

function param2Obj(url) {
	const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
	if (!search) {
	  return {}
	}
	const obj = {}
	const searchArr = search.split('&')
	searchArr.forEach(v => {
	  const index = v.indexOf('=')
	  if (index !== -1) {
		const name = v.substring(0, index)
		const val = v.substring(index + 1, v.length)
		obj[name] = val
	  }
	})
	return obj
}

function checkPermission(url,access,role_id,role_ids){
	if(role_ids.includes(parseInt(role_id)) || access.split(',').includes(url)){
		return true
	}
}

function ismobile() {
    let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
    return flag;
}

const myURL = new URL(window.location.href)
const urlobj = param2Obj(myURL.href)


Vue.prototype.curentTime = curentTime
Vue.prototype.parseTime = parseTime
Vue.prototype.confirm = confirm
Vue.prototype.formatStr = formatStr
Vue.prototype.checkPermission = checkPermission

Vue.prototype.urlobj = urlobj
Vue.prototype.ismobile = ismobile