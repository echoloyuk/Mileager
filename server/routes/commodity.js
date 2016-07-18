var express = require('express');
var commodity = express.Router();

var http = require('http');

/* load commodity with ca */
var _ca = require('../data/ca-data');
var data = [];

//deal with data
_ca.ProductsAllInfo.map(function (item, index){
    data.push({
        commodity_id: parseInt(item.Pid),
        commodity_name: item.Title,
        company_id: 1,
        company_name: '凤凰知音',
        commodity_content_pic: item.Pic_url,
        commodity_mile: parseInt(item.Price),
        commodity_values: Math.floor(Math.random() * 10000),
        commodity_collection: Math.floor(Math.random() * 5000),
        cid : parseInt(item.Cid)
    });
});

console.log('CA products total counts: ' + data.length);

commodity.use(function (req, res, next){
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, identifyCode');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Max-Age', '3600');
    next();
});

/* GET users listing. */
commodity.get('/', function(req, res, next) {
    //res.send('Hello!!!!!!');
});

commodity.get('/GetAllHotCommodity', function (req, res, next){
    var temp = data.slice(0);
    var hotNum = 5;
    for (var i = 0; i < hotNum; i++){
        for (var j = i + 1, count = temp.length; j < count; j++){
            if (temp[j].commodity_values > temp[i].commodity_values){
                var t = temp[j];
                temp[j] = temp[i];
                temp[i] = t;
            }
        }
    }
    var result = {
        commodityItem: temp.slice(0, hotNum)
    }
    res.send(JSON.stringify(result));
});

//获得所有商品，包含keywords和page
commodity.get('/GetAllCommodity', function (req, res, next){
    var page = req.query.Page_num;
    var key = req.query.keywords;     
    var countPerPage = 10;
    var result = [];
    var cid = req.query.cid || null;
    var min = req.query.min || 0;
    var max = req.query.max || 10000000; //一般不会超过1千万了吧
    var order = req.query.order || null;
    var turn = req.query.turn || null;

    if (!page || page < 1){
        page = 1;
    }

    //key
    if (key){
        data.map(function (item, index){
            if (item.commodity_name.indexOf(key) > -1){
                result.push(item);
            } else if (item.commodity_name.indexOf(key.toUpperCase()) > -1){
                result.push(item);
            } else if (item.commodity_name.indexOf(key.toLowerCase()) > -1){
                result.push(item);
            }
        });
    } else {
        result = data.slice(0);
    }

    //cate
    if (cid){
        cid = cid.split(',');
        var _temp = result.slice(0);
        result = [];
        _temp.map(function (item, index){
            cid.map(function (val){
                if (val == item.cid){
                    result.push(item);
                }
            });
        });
    }

    //min and max
    var _temp = result.slice(0);
    result = [];
    _temp.map(function (item, index){
        if (item.commodity_mile > min && item.commodity_mile < max){
            result.push(item);
        }
    });

    //sort
    if (order && result.length && order in result[0]){
        if (turn != 'inc'){
            turn = 'desc';
        }
        for (var i = 0, count = result.length; i < count; i++){
            for (var j = i; j < count; j++){
                var flag = false;
                if (turn == 'inc'){
                    if (result[i][order] > result[j][order]){
                        flag =true;
                    }
                } else {
                    if (result[i][order] < result[j][order]){
                        flag =true;
                    }
                }
                if (flag){
                    var _t = result[i];
                    result[i] = result[j];
                    result[j] = _t;
                }
            }
        }
    }

    console.log('search: key=' + key + ', category=' + cid + ', min=' + min + ', max=' + max + ', order=' + order + ', turn=' + turn + '. has ' + result.length + ' result. page = ' + page);
    result = result.slice((page - 1) * countPerPage, page * countPerPage);
    res.send(JSON.stringify({
        commodityItem:result
    }));
});

//http://127.0.0.1:3000/commodity/GetCommodityDetail?commodity_id=2075
commodity.get('/GetCommodityDetail', function (req, res, next){
    var commodity_id = parseInt(req.query.commodity_id);
    var result;
    if (!commodity_id){
        return {
            commodityItem: {}
        }
    }
    var commodity;
    data.map(function (item, index){
        if (item.commodity_id == commodity_id){
            commodity = item;
        }
    });

    var defaultOpt = {
        host: '172.17.18.80',
        port: 8080,
        method: 'GET',
    }
    defaultOpt.path = 'http://eshop.airchina.com.cn/Pro/Product_Info.aspx?pid=' + commodity_id;

    var html = '';
    var detailUrl = '';
    var request = http.request(defaultOpt, function (_res){
        _res.on('data', function (data){
            html += data;
        });
        _res.on('end', function (){
            var temp = html.substring(html.indexOf('<!--商品详情 开始-->'), html.indexOf('<!--商品详情 结束-->'));

            var reg = /src="(.*?)"/g;
            detailUrl = reg.exec(temp);
            if (detailUrl){
                detailUrl = detailUrl[1];
                console.log('find detail: ' + detailUrl);

                commodity.detail_url = detailUrl;
                res.send(JSON.stringify({
                    commodityItem:commodity
                }));
            } else {
                console.log('----------- reg cannot match the detail url :');
                console.log('src = ' + temp);
                console.log('-----------');
            }

        });
    }).on('error', function (err){
        console.log(err)
    });
    request.end();
});

commodity.get('/love66', function (req, res, next){
    res.send('66 is the best girl I have ever met');
});

module.exports = commodity;
