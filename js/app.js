// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18  


//API地址常量
var API_ADDRESS = 'http://202.120.117.54:8080/pushApi/'; //定义了常量


Date.prototype.Format = function(fmt) { //author: meizz   
		var o = {
			"M+": this.getMonth() + 1, //月份   
			"d+": this.getDate(), //日   
			"h+": this.getHours(), //小时   
			"m+": this.getMinutes(), //分   
			"s+": this.getSeconds(), //秒   
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度   
			"S": this.getMilliseconds() //毫秒   
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}
	//根据病人名字和时间显示通知详情ajax
function info(name, time) {
	plus.nativeUI.showWaiting("正在加载");
	console.log(name);
	console.log(time);
	mui.ajax(API_ADDRESS + 'report/reportResult.do', {
		data: {
			//						pname: "张三",
			//						ptime: "2016-03-08 13:49:25"
			pname: name,
			ptime: time
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 5000, //超时时间设置为10秒；
		success: function(data) {
			//服务器返回响应，根据响应结果，分析是否登录成功；
			plus.nativeUI.closeWaiting();
			console.log("success");
			console.log(data.result);
			mui.openWindow({
				url: 'index.html',
				id: 'index.html',
				extras: {
					send: data.result,
					ptime: time
				}
			});
		},
		error: function(xhr, type, errorThrown) { //异常处理；
			plus.nativeUI.closeWaiting();
			mui.alert('数据服务器链接失败', '错误', function() {

			});
		}
	});
}

//ios用户启动将token上传服务器
function tokenUpload(token) {
	mui.ajax(API_ADDRESS + 'deviceTokenAction/updateDeviceToken.do', {
		data: {
			deviceToken: token
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 5000, //超时时间设置为10秒；
		success: function(data) {
			localStorage.setItem("runFirst", "Yes");
			console.log("设置后" + localStorage.getItem("runFirst"));

		},
		error: function(xhr, type, errorThrown) { //异常处理；
			mui.alert('数据服务器链接失败', '错误', function() {

			});
		}
	});
}

//ios用户启动将token上传服务器
function pageJump(page) {
	mui.openWindow({
		url: page,
		id: page,
		waiting: {
			autoShow: false //自动显示等待框，默认为true
		}
	});
}