;(function (){
    'use strict';

    var option = {
        '_dev': {
            url: '',
            data: '',
            method: 'get',
            onBeforeLoad: function (data){
                return data;
            },
            onAfterLoad: function (data){
                return data;
            },
            onFinish: function (){

            }
        }
    }
    var Mileager = function ($target){
        this.version = '0.9.0';
        this.option = option;
        this.$target = $target;
        this.$mask = $('#mileagerMask');
        this.$load = $('#mileagerLoading');
    }

    $.extend(Mileager.prototype, {
        setOption: function (obj){
            $.extend(true, this.option, obj);
        },
        toPage: function (id, _data){
            if (!this.option[id]){
                console.error('id is not exist');
                return;
            }
            var opt = this.option[id];
            var _this = this;
            var url = opt.url;
            var data = $.extend({}, opt.data);

            _this.showLoading();

            var onLoaded = function (data){
                var source = $('#' + id).html();
                var template = Handlebars.compile(source);
                var html = template(data);

                _this.hideLoading();
                _this.$target.empty().append(html);

                if (typeof opt.onFinish === 'function'){
                    opt.onFinish.call(this);
                }
            }

            //ajax here in the future;
            if (url){
                data = $.extend(data, _data);
                if (typeof opt.onBeforeLoad === 'function'){
                    data = opt.onBeforeLoad.call(_this, data);
                }
                console.log(data);
                $.ajax({
                    url: url,
                    type: opt.method || 'get',
                    data: data,
                    success: function (res){
                        res = eval('(' + res + ')');
                        if (typeof opt.onAfterLoad === 'function'){
                            opt.onAfterLoad.call(_this, res);
                        }
                        onLoaded(res);
                    },
                    complete: function (){

                    },
                    error: function (err){
                        console.log('error');
                    }
                });
            } else {
                onLoaded({}); 
            }
        },

        /**
        obj = {
            id:'',
            url:'',
            data: {},
            onAfterLoad: function (data){return data;},
            onFinish: function (html){},
            method:'get',
            isShowLoading: false
        }
        */
        getHTML: function (obj){
            var url = obj.url;
            var data = obj.data;
            var _this = this;

            if (url){
                if (obj.isShowLoading){
                    _this.showLoading();
                }
                $.ajax({
                    url: url,
                    type: obj.method || 'get',
                    data: data,
                    success: function (res){
                        res = eval('(' + res + ')');
                        if (typeof obj.onAfterLoad === 'function'){
                            obj.onAfterLoad.call(_this, res);
                        }
                        var source = $('#' + obj.id).html();
                        var template = Handlebars.compile(source);
                        var html = template(res);
                        _this.hideLoading();

                        if (typeof obj.onFinish === 'function'){
                            console.log(222);
                            obj.onFinish.call(_this, html);
                        }
                    },
                    complete: function (){

                    },
                    error: function (err){
                        console.log(err);
                    }
                });
            } else {
                return;
            }
        },
        showLoading: function (){
            this.$mask.show();
            this.$load.show();
        },
        hideLoading: function (){
            this.$mask.hide();
            this.$load.hide();
        }
    });

    window.Mileager = Mileager;
})(window);