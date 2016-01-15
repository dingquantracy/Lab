;(function(){
    
    var exports = this;  //兼容服务端

    var indexOf = Array.prototype.indexOf || function(obj){
	    for (var i=0, len=this.length; i<len; ++i){
	        if (this[i] === obj) return i;
	    }
	    return -1;
	};

	var id = 0;

    function Asy(){
        this.map = {};
        this.signsMap = {};
    }

    Asy.prototype = {
        constructor: Asy,
        when: function (signs, callback, target){
            var map = this.map;
            var signsMap = this.signsMap;
            if (typeof signs === 'string') {
                signs = [signs];
            }
            
            map[++id] = {
                signs: signs.slice(0),
                callback: callback,
                target: target || exports
            };
            
            for (var i = 0, len = signs.length; i < len; i++) {
            	var sign = signs[i];
            	if (!signsMap[sign]) {
            		signsMap[sign] = [];
            	}
            	signsMap[sign].push(id);
            }

            return this;
        },
        resolve: function (signs){
            var map = this.map;

            if (typeof signs === 'string') {
                signs = [signs];
            }

            for (var i = 0, len = signs.length; i < len; i++) {
                var sign = signs[i];
                if (!sign) continue;
                this._exec(sign);
            }

            return this;
        },
        _exec: function (sign){
            var map = this.map;
            var signsMap = this.signsMap;
            var list = signsMap[sign];

            for (var i = 0, len = list.length; i < len; i++) {
            	var id = list[i];
            	var signs = map[id].signs;
            	var index = indexOf.call(signs, id);
            	signs.splice(index, 1);

            	if (signs.length <= 0) {
            		setTimeout(function(){
				        map[id].callback.call(map[id].callback.target);
				    }, 0);
            	}
            }
            delete signsMap[sign];

            return this;
        }
    };


    exports.Asy = Asy;

}).call(this);

