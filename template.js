const fs = require('fs'),
	path = require('path');
//项目地址
var projectAddr="/Users/zhangshouxin/Documents/HBuilderProjects/dragAppViewN/";
//uni-app 动态页面修改地址
var uniAppUrl = projectAddr+"/pages/zyPages/centerPage/centerPage.vue";
//新增页面保存地址
var uniAppUrl_save = projectAddr+"/pages/newPage/";
//可拖动组件集合地址
var unit_data = projectAddr+"/static/uView/data.js";
//page.json 配置地址
var pages_json = projectAddr+"/pages.json";

//删除已生成的页面
function delAlaPage(param, callback) {
	var _uuid = param.param.uuid;
	var _href=param.param.href;
	var _pageAddr=projectAddr+param.param.href+".vue";//用于删除文件
	var _del_fileName=uniAppUrl_save+_href.split("/")[_href.split("/").length-2];//删除文件后在删除对应的文件夹
	
	//读取data.js文件
	fs.readFile(unit_data, {
		flag: 'r+',
		encoding: 'utf8'
	}, function(err, dataJS) {
		if (err) {
			console.error(err);
			callback(false, "读取data.js文件失败");
		} else {
			
			let _new_dataJS = dataJS;
			var _start = "/*"+_uuid+"开始*/";
			var _end = "/*"+_uuid+"结束*/";
			var rel = _new_dataJS.split(_start)[1].split(_end)[0];
			_new_dataJS = _new_dataJS.replace(rel, "").replace(_start, "").replace(_end, "");
		
			//修改data.js文件
			fs.writeFile(unit_data, _new_dataJS, 'utf8', (err) => {
				if (err) {
					console.log(err);
					callback(false, "修改data.js文件失败");
				} else {
					//读取pages.json文件
					fs.readFile(pages_json, {
						flag: 'r+',
						encoding: 'utf8'
					}, function(err, pagesJSON) {
						if (err) {
							console.error(err);
							callback(false, "读取pages.json文件失败");
						} else {
							let _newPagesJson = pagesJSON;
							var _start = "/*"+_uuid+"开始*/";
							var _end = "/*"+_uuid+"结束*/";
							var rel = _newPagesJson.split(_start)[1].split(_end)[0];
							_newPagesJson = _newPagesJson.replace(rel, "").replace(_start, "").replace(_end, "");
							//写入pages.json文件
							fs.writeFile(pages_json, _newPagesJson, 'utf8', (err) => {
								if (err) {
									console.log(err);
									callback(false, "修改pages.json文件失败");
								} else {
									
									console.log("删除文件的地址"+_pageAddr);
									try{
										//删除已生成的文件
										fs.unlink(_pageAddr, function(err) {
										   if (err) {
										      callback(false, "删除已生成的文件失败1");
										   }
										   else{
											   console.log("删除文件夹的地址"+_del_fileName);
											   fs.rmdir(_del_fileName, function(err) {
											      if (err) {
											         callback(false, "删除已生成的文件夹失败");
											      }
												  else{
													     callback(true, "删除页面成功");
												  }
												  });
											
										   }
										   
										});
									}catch(e){
										 callback(false, "删除已生成的文件失败2");
									}
									
									
								}
							});

						}
					});
				}
			});
		}
	});

}
//保存当前页面
function savePage(param, callback) {
	var allUnitArry = param.param.allUnitArry;
	var newPageName = param.param.newPageName;
	var newPageTitle = param.param.newPageTitle;
	var activeTopMenu =param.param.activeTopMenu;
	var activeSecondMenu=param.param.activeSecondMenu;
	console.log("顶级菜单"+activeTopMenu);
	console.log("二级菜单"+activeSecondMenu)
	var _dataJS_uuid = uuid();
	if(activeTopMenu=="模板"){
		//拷贝模板页面
		let _list=[{"name":"登录","href":"/pages/zyPages/template/login/index"},
				{"name":"个人中心","href":"/pages/zyPages/template/wxCenter/index"},
				{"name":"自定义键盘支付","href":"/pages/zyPages/template/keyboardPay/index"},
				{"name":"垂直分类(左右独立)","href":"/pages/zyPages/template/mallMenu/index1"},
				{"name":"垂直分类(左右联动)","href":"/pages/zyPages/template/mallMenu/index2"},
				{"name":"提交订单栏","href":"/pages/zyPages/template/submitBar/index"},
				{"name":"评论列表","href":"/pages/zyPages/template/comment/index"},
				{"name":"订单列表","href":"/pages/zyPages/template/order/index"},
				{"name":"收货地址","href":"/pages/zyPages/template/address/index"},
				{"name":"城市选择","href":"/pages/zyPages/template/citySelect/index"},
				{"name":"优惠券","href":"/pages/zyPages/template/coupon/index"}]; 
        let _h="";
		for(let  _l of _list){
			if(_l["name"]==activeSecondMenu){
				_h=projectAddr+_l["href"]+".vue";
				uniAppUrl=_h;
				break;
			}
		}
	}
	//else{
	fs.readFile(uniAppUrl, {
		flag: 'r+',
		encoding: 'utf8'
	}, function(err, data) {
		if (err) {
			console.error(err);
			callback(false, "读取页面失败");
		} else {
			var _newReplaceContent=data;
			if(activeTopMenu!="模板"){
			//固定删除区域
			 _newReplaceContent = data.replace("test(){},", "").replace("//每次生成、修改组件时都重新生成每个组件双向绑定的值", "")
				.replace("//提交事件", "").replace("aha:true,", "").replace("//每次生成、修改组件时都重新生成每个组件的事件", "").replace(
					"//该方法暂时用于设置表单参数设置的初始化", "").replace("//参数验证区域", "").replace("aha:true,", "").replace(
					"<!--组件插入开始-->", "").replace("<!--组件插入结束-->", "").replace("/*方法生成区域开始*/", "").replace(
					"/*方法生成区域结束*/", "").replace("/*组件初始化值区域开始*/", "").replace("/*组件初始化值区域结束*/", "").replace(
					"/*表单参数验证初始化开始*/", "").replace("/*表单参数验证初始化结束*/", "").replace("/*表单提交事件初始化开始*/", "")
				.replace("/*表单提交事件初始化结束*/", "")
			//获取所有组件ID，删除对应的标记的地方（动态）
			allUnitArry.forEach(function(e) {
				let t1 = "<!--" + e + "开始-->";
				let t2 = "<!--" + e + "结束-->";
				let t3 = "<!--" + e + "-->";
				let t4 = "onclick=\"getUnitDesc('" + e + "',event)\"";
				let t5 = "@dragover.prevent";
				let t6 = "@drop=\"colDrop('" + e + "')\"";
				let t7 = "/*" + e + "初始化值开始*/";
				let t8 = "/*" + e + "初始化值结束*/";
				let t9 = "/*" + e + "事件开始*/";
				let t10 = "/*" + e + "事件结束*/";
				_newReplaceContent = _newReplaceContent.replace(t1, "").replace(t2, "").replace(t3, "")
					.replace(t4, "").replace(t5, "").replace(t6, "").replace(t7, "").replace(t8, "")
					.replace(t9, "").replace(t10, "");
			})

			var _start = "/*删除1开始*/";
			var _end = "/*删除1结束*/";
			var rel = _newReplaceContent.split(_start)[1].split(_end)[0];
			_newReplaceContent = _newReplaceContent.replace(rel, "").replace(_start, "").replace(_end, "");

			_start = "/*删除2开始*/";
			_end = "/*删除2结束*/";
			rel = _newReplaceContent.split(_start)[1].split(_end)[0];
			_newReplaceContent = _newReplaceContent.replace(rel, "").replace(_start, "").replace(_end, "");

			_start = "/*删除3开始*/";
			_end = "/*删除3结束*/";
			rel = _newReplaceContent.split(_start)[1].split(_end)[0];
			_newReplaceContent = _newReplaceContent.replace(rel, "").replace(_start, "").replace(_end, "");

			_start = "/*删除4开始*/";
			_end = "/*删除4结束*/";
			rel = _newReplaceContent.split(_start)[1].split(_end)[0];
			_newReplaceContent = _newReplaceContent.replace(rel, "").replace(_start, "").replace(_end, "");

			_start = "/*删除5开始*/";
			_end = "/*删除5结束*/";
			rel = _newReplaceContent.split(_start)[1].split(_end)[0];
			_newReplaceContent = _newReplaceContent.replace(rel, "").replace(_start, "").replace(_end, "");

			_start = "/*删除6开始*/";
			_end = "/*删除6结束*/";
			rel = _newReplaceContent.split(_start)[1].split(_end)[0];
			_newReplaceContent = _newReplaceContent.replace(rel, "").replace(_start, "").replace(_end, "");

			try {
				_start = "<!--单元格组保存页面删除开始-->";
				_end = "<!--单元格组保存页面删除结束-->";
				rel = _newReplaceContent.split(_start)[1].split(_end)[0];
				_newReplaceContent = _newReplaceContent.replace(rel, "").replace(_start, "").replace(_end, "");

			} catch (e) {
				//TODO handle the exception
			}

			try {
				_start = "<!--表单保存页面删除开始-->";
				_end = "<!--表单保存页面删除结束-->";
				rel = _newReplaceContent.split(_start)[1].split(_end)[0];
				_newReplaceContent = _newReplaceContent.replace(rel, "").replace(_start, "").replace(_end, "");

			} catch (e) {
				//TODO handle the exception
			}
			// _start = "<!--页面保存确认输入开始-->";
			// _end = "<!--页面保存确认输入结束-->";
			// rel = _newReplaceContent.split(_start)[1].split(_end)[0];
			// _newReplaceContent = _newReplaceContent.replace(rel, "").replace(_start, "").replace(_end, "");

			// _start = "/*页面保存确认输入开始*/";
			// _end = "/*页面保存确认输入结束*/";
			// rel = _newReplaceContent.split(_start)[1].split(_end)[0];
			// _newReplaceContent = _newReplaceContent.replace(rel, "").replace(_start, "").replace(_end, "");

           }
		   
			let _newFile = uniAppUrl_save + newPageName + "/";

			fs.mkdir(_newFile, function(err) {
				if (err) {
					callback(false, "创建" + _newFile + "文件夹失败");
				} else {
					fs.writeFile(_newFile + newPageName + ".vue", _newReplaceContent, 'utf8', (err) => {
						if (err) {
							console.log(err);
							callback(false, "保存页面失败");
						} else {
							//读取data.js文件
							fs.readFile(unit_data, {
								flag: 'r+',
								encoding: 'utf8'
							}, function(err, dataJS) {
								if (err) {
									console.error(err);
									callback(false, "读取data.js文件失败");
								} else {
									
									let _new_dataJS = dataJS;
									let _addCon = "/*" + _dataJS_uuid +
										"开始*/{\"name\":\"" + newPageTitle +
										"\",\"href\":\"/pages/newPage/" + newPageName +
										"/" + newPageName + "\",\"id\":\"" +
										_dataJS_uuid + "\"},/*" + _dataJS_uuid +
										"结束*/\n//新增页面追加\n";
									let _addContentArea = _new_dataJS.replace(
										"//新增页面追加", _addCon)
									//写入data.js文件
									fs.writeFile(unit_data, _addContentArea, 'utf8', (
										err) => {
										if (err) {
											console.log(err);
											callback(false, "写入data.js文件失败");
										} else {
											//读取pages.json文件
											fs.readFile(pages_json, {
												flag: 'r+',
												encoding: 'utf8'
											}, function(err,
											pagesJSON) {
												if (err) {
													console.error(err);
													callback(false,
														"读取pages.json文件失败"
														);
												} else {
													let _pagesJSON_uuid =_dataJS_uuid;
													let _newPagesJson =
														pagesJSON;
													let _addCon = "/*" +
														_pagesJSON_uuid +
														"开始*/,{\"path\": \"pages/newPage/" +
														newPageName +
														"/" +
														newPageName +
														"\",\"style\": {\"navigationBarTitleText\": \"" +
														newPageTitle +
														"\"},\"id\":\"" +
														_pagesJSON_uuid +
														"\"}/*" +
														_pagesJSON_uuid +
														"结束*/\n//新增页面追加\n";
													let _addContentArea =
														_newPagesJson
														.replace(
															"//新增页面追加",
															_addCon)
													//写入pages.json文件
													fs.writeFile(
														pages_json,
														_addContentArea,
														'utf8', (
															err) => {
															if (
																err) {
																console
																	.log(
																		err
																		);
																callback
																	(false,
																		"写入pages.json文件失败"
																		);
															} else {
																callback
																	(true,
																		"保存页面成功"
																		);
															}
														});

												}
											});
										}
									});
								}
							});

						}

					});
				}

			});


		}
	})
	//}
}
//清空页面的所有组件
function clearPage(param, callback) {
	fs.readFile(uniAppUrl, {
		flag: 'r+',
		encoding: 'utf8'
	}, function(err, data) {
		if (err) {
			console.error(err);
			callback(false, "读取页面失败");
		} else {
			var _startUUID = "<!--组件插入开始-->";
			var _endUUID = "<!--组件插入结束-->";
			var replaceContent = data.split(_startUUID)[1].split(_endUUID)[0];
			var _newReplaceContent = data.replace(replaceContent, "");
			//删除所有已生成的事件
			var _startUUID2 = "/*方法生成区域开始*/";
			var _endUUID2 = "/*方法生成区域结束*/";
			var replaceContent2 = _newReplaceContent.split(_startUUID2)[1].split(_endUUID2)[0];
			var _newReplaceContent3 = _newReplaceContent.replace(replaceContent2, "test(){},");
			//删除所有已双向绑定的值
			var _startUUID3 = "/*组件初始化值区域开始*/";
			var _endUUID3 = "/*组件初始化值区域结束*/";
			var replaceContent4 = _newReplaceContent3.split(_startUUID3)[1].split(_endUUID3)[0];
			var _newReplaceContent5 = _newReplaceContent3.replace(replaceContent4, "aha:true,");



			var _form1 = "/*表单参数验证初始化开始*/";
			var _form2 = "/*表单参数验证初始化结束*/";
			var repl2 = _newReplaceContent5.split(_form1)[1].split(_form2)[0];
			_newReplaceContent5 = _newReplaceContent5.replace(repl2, "\n//参数验证区域\n");

			var _form3 = "/*表单提交事件初始化开始*/";
			var _form4 = "/*表单提交事件初始化结束*/";
			var repl3 = _newReplaceContent5.split(_form3)[1].split(_form4)[0];
			_newReplaceContent5 = _newReplaceContent5.replace(repl3, "\n//提交事件\n");


			fs.writeFile(uniAppUrl, _newReplaceContent5, 'utf8', (err) => {
				if (err) {
					callback(false, "清空页面组件失败");
				} else {
					callback(true, "success");
				}

			});
		}
	})
}
//删除已生成的控件
function delPage(param, callback) {
	var uuid = param.param.uuid;
	//删除所有该组件的痕迹
	fs.readFile(uniAppUrl, {
		flag: 'r+',
		encoding: 'utf8'
	}, function(err, data) {
		if (err) {
			console.error(err);
			callback(false, "读取页面失败");
		} else {
			var _startUUID = "<!--" + uuid + "开始-->";
			var _endUUID = "<!--" + uuid + "结束-->";
			var replaceContent = data.split(_startUUID)[1].split(_endUUID)[0];
			var _newReplaceContent = data.replace(replaceContent, "").replace(_startUUID, "").replace(_endUUID,
				"");

			//删除当前组件的初始化值得区域
			let _new_vmodel_start = "\n/*" + uuid + "初始化值开始*/\n";
			let _new_vmodel_end = "\n/*" + uuid + "初始化值结束*/\n";
			//当前组件是否有初始化值
			if (_newReplaceContent.indexOf(_new_vmodel_start) >= 0) {
				var repl = _newReplaceContent.split(_new_vmodel_start)[1].split(_new_vmodel_end)[0];
				_newReplaceContent = _newReplaceContent.replace(repl, "").replace(_new_vmodel_start, "")
					.replace(_new_vmodel_end, "");;
			}

			//删除当前组件的事件区域 

			let _new_event_start = "\n/*" + uuid + "事件开始*/\n";
			let _new_event_end = "\n/*" + uuid + "事件结束*/\n";
			//当前组件是否有初始化值
			if (_newReplaceContent.indexOf(_new_event_start) >= 0) {
				var repl = _newReplaceContent.split(_new_event_start)[1].split(_new_event_end)[0];
				_newReplaceContent = _newReplaceContent.replace(repl, "").replace(_new_event_start, "").replace(
					_new_event_end, "");;
			}

			fs.writeFile(uniAppUrl, _newReplaceContent, 'utf8', (err) => {
				if (err) {
					callback(false, "删除组件失败");
				} else {
					callback(true, "success");
				}

			});



		}
	})
}
//修改已生成的控件
function updatePage(param, callback) {
	var temp = param.param.template;
	var _event = param.param.event;
	var _vmodel = param.param.vmodel;
	var _input_mount_unit_id = param.param.input_mount_unit_id;
	fs.readFile(uniAppUrl, {
		flag: 'r+',
		encoding: 'utf8'
	}, function(err, data) {
		if (err) {
			console.error(err);
			callback(false, "读取页面失败");
		} else {
			//组件页面生成
			var _startUUID = "<!--" + param.param.uuid + "开始-->";
			var _endUUID = "<!--" + param.param.uuid + "结束-->";
			var replaceContent = data.split(_startUUID)[1].split(_endUUID)[0];
			var _newReplaceContent = data.replace(replaceContent, temp);

			//组件事件每次重新生成(以前)
			var _newReplaceContent2 = "";
			if (null != _event && _event != "null" && _event != "") {
				var _startUUID2 = "/*方法生成区域开始*/";
				var _endUUID2 = "/*方法生成区域结束*/";
				var replaceContent2 = _newReplaceContent.split(_startUUID2)[1].split(_endUUID2)[0];
				//以前是替换整个事件区域
				//_newReplaceContent2=_newReplaceContent.replace(replaceContent2,_event);
				//现在改为只修改当前组件的事件区域
				let _event_id_c = "";
				if (null != _input_mount_unit_id && _input_mount_unit_id != "") {
					_event_id_c = _input_mount_unit_id;
				} else {
					_event_id_c = param.param.uuid;
				}
				let _new_event_start = "\n/*" + _event_id_c + "事件开始*/\n";
				let _new_event_end = "\n/*" + _event_id_c + "事件结束*/\n";
				//当前组件是否已生成组件
				if (replaceContent2.indexOf(_new_event_start) >= 0) {
					let repl = replaceContent2.split(_new_event_start)[1].split(_new_event_end)[0];
					_newReplaceContent2 = _newReplaceContent.replace(repl, _event);
				}
				//当前组件还未生成事件
				else {
					_event = _new_event_start + _event + _new_event_end;
					_newReplaceContent2 = _newReplaceContent.replace(replaceContent2, replaceContent2 + "\n" +
						_event);
				}
			} else {
				_newReplaceContent2 = _newReplaceContent;
			}

			//所有组件的v-model 双向绑定事件重新
			if (null != _vmodel && _vmodel != "null" && _vmodel != "") {

				//原来是直接替换整个初始化值区域
				// var _startUUID2_v="/*组件初始化值区域开始*/";
				// var _endUUID2_V="/*组件初始化值区域结束*/";
				// var repl=_newReplaceContent2.split(_startUUID2_v)[1].split(_endUUID2_V)[0];
				//    _newReplaceContent2=_newReplaceContent2.replace(repl,_vmodel);
				// }

				//现在改为替换当前修改的
				//当前组件是否已经生成初始化值得区域
				let _new_vmodel_start = "\n/*" + param.param.uuid + "初始化值开始*/\n";
				let _new_vmodel_end = "\n/*" + param.param.uuid + "初始化值结束*/\n";
				//当前组件已初始化值得区域
				if (_newReplaceContent2.indexOf(_new_vmodel_start) >= 0) {
					var repl = _newReplaceContent2.split(_new_vmodel_start)[1].split(_new_vmodel_end)[0];
					_newReplaceContent2 = _newReplaceContent2.replace(repl, _vmodel);
				}
				//当前组件没有初始化值得区域
				else {
					_vmodel = _new_vmodel_start + _vmodel + _new_vmodel_end;
					var _startUUID2_v = "/*组件初始化值区域开始*/";
					var _endUUID2_V = "/*组件初始化值区域结束*/";
					var repl = _newReplaceContent2.split(_startUUID2_v)[1].split(_endUUID2_V)[0];
					_newReplaceContent2 = _newReplaceContent2.replace(repl, repl + "\n" + _vmodel);
				}
			}

			var _is_form_param = param.param.is_form_param;
			//当前是否为表单组件，
			if (null != _is_form_param && _is_form_param != "") {
				var _form1 = "/*表单参数验证初始化开始*/";
				var _form2 = "/*表单参数验证初始化结束*/";
				var repl2 = _newReplaceContent2.split(_form1)[1].split(_form2)[0];
				let _ref = "this.$refs." + _is_form_param.ref + ".setRules(this." + _is_form_param.rules + ");"
				_newReplaceContent2 = _newReplaceContent2.replace(repl2, _ref);

				var _form3 = "/*表单提交事件初始化开始*/";
				var _form4 = "/*表单提交事件初始化结束*/";
				var repl3 = _newReplaceContent2.split(_form3)[1].split(_form4)[0];
				let _sub_event = "submit() {this.$refs." + _is_form_param.ref +
					".validate(valid => {if (valid) {alert('验证通过')} else {alert('验证失败')}});},";
				_newReplaceContent2 = _newReplaceContent2.replace(repl3, _sub_event);
			}

			fs.writeFile(uniAppUrl, _newReplaceContent2, 'utf8', (err) => {
				if (err) {
					callback(false, "修改文件失败");
				} else {
					callback(true, "success");
				}

			});



		}
	})
}

/**
 * @param {Object} param 模板需要修改的参数
 * @param {Object} callback
 * flag: 'r+' 读写
 * flag: 'w+' 读写，文件不存在则创建
 */
function createPage(param, callback) {
	var temp = param.param.template;
	var parentID = param.param.parentID;
	var _event = param.param.event;
	var _vmodel = param.param.vmodel;


	var location_update_unit = "<!--" + param.param.uuid + "开始-->" + temp + "<!--" + param.param.uuid + "结束-->";
	fs.readFile(uniAppUrl, {
		flag: 'r+',
		encoding: 'utf8'
	}, function(err, data) {
		if (err) {
			console.error(err);
			callback(false, "读取页面失败");
		} else {
			var newContent = null;
			//直接放入主页面
			if (typeof(parentID) == "undefined" || null == parentID) {
				//console.log("组件没有父ID");
				let _default = "\n<!--组件插入结束-->";
				newContent = data.replace(/<!--组件插入结束-->/gm, "\n" + location_update_unit + _default);

			}
			//放入父组件中
			else {
				//console.log("组件的父ID为:"+parentID);
				let _default = "\n<!--" + parentID + "-->";
				newContent = data.replace("<!--" + parentID + "-->", "\n" + location_update_unit + _default);
			}

			//组件事件每次重新生成
			var _newReplaceContent2 = "";
			if (null != _event && _event != "null" && _event != "") {
				var _startUUID2 = "/*方法生成区域开始*/";
				var _endUUID2 = "/*方法生成区域结束*/";
				var replaceContent2 = newContent.split(_startUUID2)[1].split(_endUUID2)[0];
				//以前是替换所有已生成的事件
				//_newReplaceContent2=newContent.replace(replaceContent2,_event);
				//现在改为在后面追加
				let _new_event_start = "\n/*" + param.param.uuid + "事件开始*/\n";
				let _new_event_end = "\n/*" + param.param.uuid + "事件结束*/\n";
				_event = _new_event_start + _event + _new_event_end;
				_newReplaceContent2 = newContent.replace(replaceContent2, replaceContent2 + "\n" + _event);
			} else {
				_newReplaceContent2 = newContent;
			}

			//所有组件的v-model 双向绑定事件重新
			if (null != _vmodel && _vmodel != "null" && _vmodel != "") {
				var _startUUID2_v = "/*组件初始化值区域开始*/";
				var _endUUID2_V = "/*组件初始化值区域结束*/";
				var repl = _newReplaceContent2.split(_startUUID2_v)[1].split(_endUUID2_V)[0];
				let _new_vmodel_start = "\n/*" + param.param.uuid + "初始化值开始*/\n";
				let _new_vmodel_end = "\n/*" + param.param.uuid + "初始化值结束*/\n";
				_vmodel = _new_vmodel_start + _vmodel + _new_vmodel_end;
				//原来是替换所有
				//_newReplaceContent2=_newReplaceContent2.replace(repl,_vmodel);
				//现在改为在后面追加
				_newReplaceContent2 = _newReplaceContent2.replace(repl, repl + "\n" + _vmodel);
			}
			var _is_form_param = param.param.is_form_param;
			//当前是否为表单组件，
			if (null != _is_form_param && _is_form_param != "") {
				var _form1 = "/*表单参数验证初始化开始*/";
				var _form2 = "/*表单参数验证初始化结束*/";
				var repl2 = _newReplaceContent2.split(_form1)[1].split(_form2)[0];
				let _ref = "this.$refs." + _is_form_param.ref + ".setRules(this." + _is_form_param.rules + ");"
				_newReplaceContent2 = _newReplaceContent2.replace(repl2, _ref);

				var _form3 = "/*表单提交事件初始化开始*/";
				var _form4 = "/*表单提交事件初始化结束*/";
				var repl3 = _newReplaceContent2.split(_form3)[1].split(_form4)[0];
				let _sub_event = "submit() {this.$refs." + _is_form_param.ref +
					".validate(valid => {if (valid) {alert('验证通过')} else {alert('验证失败')}});},";
				_newReplaceContent2 = _newReplaceContent2.replace(repl3, _sub_event);
			}

			fs.writeFile(uniAppUrl, _newReplaceContent2, 'utf8', (err) => {
				if (err) {
					callback(false, "修改文件失败");
				} else {
					callback(true, "success");
				}

			});



		}
	})
}

function uuid() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");
	return uuid;
}
module.exports = {
	createPage: createPage,
	updatePage: updatePage,
	delPage: delPage,
	clearPage: clearPage,
	savePage: savePage,
	delAlaPage: delAlaPage
}
