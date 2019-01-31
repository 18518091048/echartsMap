//地图容器
var chart = echarts.init(document.getElementById('container_four'));
var provinces = {
    //23个省
    "台湾": "taiwan",
    "河北": "hebei",
    "山西": "shanxi",
    "辽宁": "liaoning",
    "吉林": "jilin",
    "黑龙江": "heilongjiang",
    "江苏": "jiangsu",
    "浙江": "zhejiang",
    "安徽": "anhui",
    "福建": "fujian",
    "江西": "jiangxi",
    "山东": "shandong",
    "河南": "henan",
    "湖北": "hubei",
    "湖南": "hunan",
    "广东": "guangdong",
    "海南": "hainan",
    "四川": "sichuan",
    "贵州": "guizhou",
    "云南": "yunnan",
    "陕西": "shanxi1",
    "甘肃": "gansu",
    "青海": "qinghai",
    //5个自治区
    "新疆": "xinjiang",
    "广西": "guangxi",
    "内蒙古": "neimenggu",
    "宁夏": "ningxia",
    "西藏": "xizang",
    //4个直辖市
    "北京": "beijing",
    "天津": "tianjin",
    "上海": "shanghai",
    "重庆": "chongqing",
    //2个特别行政区
    "香港": "xianggang",
    "澳门": "aomen"
};

//直辖市和特别行政区-只有二级地图，没有三级地图
var special = ["北京","天津","上海","重庆","香港","澳门"];
var mapdata = [];
//绘制全国地图
$.getJSON('plugins/map/china.json', function(data){
	d = [];
	for( var i=0;i<data.features.length;i++ ){
		d.push({
			name:data.features[i].properties.name,
		})
	}
	mapdata = d;
	//注册地图
	echarts.registerMap('china', data);
	//绘制地图
	renderMap('china',d);
});

//地图点击事件
var arrs = []
chart.on('click', function (params) {
	// console.log( params );
	if( params.name in provinces ){
        bjs = 1
		//如果点击的是34个省、市、自治区，绘制选中地区的二级地图
		$.getJSON('plugins/map/province/'+ provinces[params.name] +'.json', function(data){
			echarts.registerMap( params.name, data);
			var d = [];
			for( var i=0;i<data.features.length;i++ ){
                console.log(data.features[i].properties.name)
				d.push({
					name:data.features[i].properties.name,
				})
            }
            arrs = d
            country = params.name
			renderMap(params.name,d);
		});
	}else if( params.seriesName in provinces ){
        bjs = 2
		//如果是【直辖市/特别行政区】只有二级下钻
		if(  special.indexOf( params.seriesName ) >=0  ){
			renderMap('china',mapdata);
		}else{
            bjs = 2
			//显示县级地图
			$.getJSON('plugins/map/city/'+ cityMap[params.name] +'.json', function(data){
				echarts.registerMap( params.name, data);
				var d = [];
				for( var i=0;i<data.features.length;i++ ){
					d.push({
						name:data.features[i].properties.name,
					})
				}
				renderMap(params.name,d);
			});	
		}	
	}else{
        location.href="./index.html"
	}
});

//初始化绘制全国地图配置
var option = {
	backgroundColor: '#000',
    title : {
        left: 'center',
        textStyle:{
            color: '#fff',
            fontSize:16,
            fontWeight:'normal',
            fontFamily:"Microsoft YaHei"
        },
        subtextStyle:{
        	color: '#ccc',
            fontSize:16,
            fontWeight:'600',
            fontFamily:"Microsoft YaHei"
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: function (params) {
            console.log(params)
            return params.name
        }
    },
    toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: { 
            // 三个功能键
            // dataView: {readOnly: false},
            // restore: {},
            // saveAsImage: {}
        },
        iconStyle:{
        	normal:{
        		color:'#fff'
        	}
        }
    },
    animationDuration:1000,
	animationEasing:'cubicOut',
	animationDurationUpdate:1000
     
};
function renderMap(map,data){
    // console.log(data,'-----')
	option.title.subtext = map == 'china'? '中国':map
    option.series = [ 
		{
            name: map,
            type: 'map',
            mapType: map,
            zoom: 1.2,
            roam: false,
            nameMap:{
			    'china':'中国'
			},
            label: {
	            normal:{
					show:true,
					textStyle:{
						color:'#43cefd',
                        fontSize:11
					},
                        formatter: function (data) {
                            if(data.name === ''){
                                data.value = ''
                            }
                            return data.name 
                        }
	            },
	            emphasis: {
	                show: true,
	                textStyle:{
						color:'#fff',
						fontSize:13,
					}
	            }
	        },
	        itemStyle: {
	            normal: {
	                areaColor: '#212237',
                    borderColor: '#335db1',
                    borderWidth:'2'
	            },
	            emphasis: {
                    areaColor: 'darkorange',
	            }
	        },
            data:data
        }	
    ];
    //渲染地图
    chart.setOption(option);
}

