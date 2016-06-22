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

            var onLoaded = function (data){
                var source = $('#' + id).html();
                var template = Handlebars.compile(source);
                var html = template(data);
                
                _this.$target.empty().append(html);

                if (typeof opt.onFinish === 'function'){
                    opt.onFinish.call(this);
                }
            }

            //ajax here in the future;
            setTimeout(function (){
                onLoaded({});
            }, 1);
        }
    });

    window.Mileager = Mileager;
})(window);