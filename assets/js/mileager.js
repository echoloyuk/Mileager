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
        toPage: function (id){
            if (!this.option[id]){
                console.error('id is not exist');
                return;
            }
            var opt = this.option[id];
            var _this = this;
            var url = opt.url;
            var data = opt.data;

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
            console.log(opt.url);
            if (url){
                if (typeof opt.onBeforeLoad === 'function'){
                    data = opt.onBeforeLoad.call(_this, data);
                }
                $.ajax({
                    url: url,
                    type: opt.method || 'get',
                    data: data,
                    success: function (res){
                        res = eval('(' + res + ')');
                        if (typeof opt.onAfterLoad === 'function'){
                            res = opt.onAfterLoad.call(_this, res);
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