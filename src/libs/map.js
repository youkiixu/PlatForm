/*
 * MAP对象，实现MAP功能
 *
 * 接口：
 * size()     获取MAP元素个数
 * isEmpty()    判断MAP是否为空
 * clear()     删除MAP所有元素
 * put(key, value)   向MAP中增加元素（key, value) -->youki,解决已存在key不会覆盖的bug;
 * remove(key)    删除指定KEY的元素，成功返回True，失败返回False
 * get(key)    获取指定KEY的元素值VALUE，失败返回NULL
 * element(index)   获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
 * containsKey(key)  判断MAP中是否含有指定KEY的元素
 * containsValue(value) 判断MAP中是否含有指定VALUE的元素
 * values()    获取MAP中所有VALUE的数组（ARRAY）
 * keys()     获取MAP中所有KEY的数组（ARRAY）
 *
 *
 */
 var newVal;
 function Map () {
 	this.elements = new Array();

	// 获取MAP元素个数
   this.size = function () {
       return this.elements.length;
   };

	// 判断MAP是否为空
   this.isEmpty = function () {
       return (this.elements.length < 1);
   };

	// 删除MAP所有元素
   this.clear = function () {
       this.elements = new Array();
   };

	/**
	 * 向MAP中增加元素（key, value);
	 *尝试判断是否已存在key，有则替换；
	 * */
	 this.put = function (_key, _value) {
	 	if (this.containsKey(_key))	 	{
	 		this.remove(_key);
	 	}

	 	this.elements.push({
	 		key: _key,
	 		value: _value
	 	});
	 };

	// 删除指定KEY的元素，成功返回True，失败返回False
   this.remove = function (_key) {
       var bln = false;
       try {
           for (i = 0; i < this.elements.length; i++) {
               if (this.elements[i].key == _key) {
                   this.elements.splice(i, 1);
                   return true;
               }
           }
       } catch (e) {
           bln = false;
       }
       return bln;
   };

	// 获取指定KEY的元素值VALUE，失败返回NULL
   this.get = function (_key) {
       try {
           var oldArr = this.elements;
           oldArr.map((item) => {
               if (item.key == _key) {
                   newVal = item.value;
                   return item.value;
               }
           });
			// for (i = 0; i < this.elements.length; i++) {
			// 	if (this.elements[i].key == _key) {
			// 		return this.elements[i].value;
			// 	}
			// }
       } catch (e) {
           return null;
       }
   };

	// 获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
   this.element = function (_index) {
       if (_index < 0 || _index >= this.elements.length) {
           return null;
       }
       return this.elements[_index];
   };

	// 判断MAP中是否含有指定KEY的元素
   this.containsKey = function (_key) {
       var bln = false;
       try {
           for (i = 0; i < this.elements.length; i++) {
               if (this.elements[i].key == _key) {
                   bln = true;
               }
           }
       } catch (e) {
           bln = false;
       }
       return bln;
   };

	// 判断MAP中是否含有指定VALUE的元素
   this.containsValue = function (_value) {
       var bln = false;
       try {
           for (i = 0; i < this.elements.length; i++) {
               if (this.elements[i].value == _value) {
                   bln = true;
               }
           }
       } catch (e) {
           bln = false;
       }
       return bln;
   };

	// 获取MAP中所有VALUE的数组（ARRAY）
   this.values = function () {
       var arr = new Array();
       for (i = 0; i < this.elements.length; i++) {
           arr.push(this.elements[i].value);
       }
       return arr;
   };

	// 获取MAP中所有KEY的数组（ARRAY）
   this.keys = function () {
       var arr = new Array();
       var len = this.elements.length;
       var oldArr = this.elements;
       oldArr((item) => {
           arr.push(item.key);
       });
       return arr;
   };
}

const toolMap = {};

function getParJSONByMap (parMap) {
   var par = '{';
   var keyArray = parMap.keys();
   keyArray((item, index) => {
       var value = parMap.get(item);
       if (index > 0) {
           par += ',';
       }
       par += getMapRecursion(item, newVal);
   });

	// for(var i = 0; i < keyArray.length; i++) {
	// 	var value = parMap.get(keyArray[i]);
	// 	{
	// 		if (i > 0) {
	// 			par += ",";
	// 		}
	//
	// 		par += getMapRecursion(keyArray[i], value);

	// 	}

	// }
   par += '}';

   return par;
}

	/**
	 * 对map/array进行递归转换；目前支持的类型有：array/map，其它值类型将作为值注入；2014-07-28，youki；
	 * */
	 function getMapRecursion (key, value) {
	 	var par = '';
	    // get type'
	    var t_ = myTypeof(value);
	    if (key != '') {
	    	par = '"' + key + '":';
	    }
	    if (t_ == 'Map') {
	    	par += '{';
	    	var keyArray = value.keys();
	    	keyArray((item, index) => {
				// var value = parMap.get(item)
                if (index > 0) {
                    par += ',';
                }
                var key = value.get(item);
                par += getMapRecursion(item, newVal);
            });
	  //   	for(var i = 0; i < keyArray.length; i++) {
	  //   		if(i > 0) {
	  //   			par += ",";
	  //   		}
			// 	//loop check;
			// 	par += getMapRecursion(keyArray[i], value.get(keyArray[i]));
			// }
            par += '}';
        } else if (t_ == 'Array') {
            par += '[';
            for (var i = 0; i < value.length; i++) {
                if (i > 0) {
                    par += ',';
                }
				// loop check;
                par += getMapRecursion('', value[i]);
            }
            par += ']';
        } else if (t_ == 'Object') {
			// 数据
            par += JSON.stringify(value);
        } else {
            par += '"' + value + '"';
        }

        return par;
    }

    function myTypeof (objClass) {
       if (objClass && objClass.constructor) {
           var strFun = objClass.constructor.toString();
           var className = strFun.substr(0, strFun.indexOf('('));
           className = className.replace('function', '');
           return className.replace(/(^\s*)|(\s*$)/ig, '');
       }
       return typeof (objClass);
   }

   function statusColor(str) {
    var color = ''
    switch(str)
    {
        case '配送完成':
            color = 'green'
        break;
        case '异常':
            color = 'red'
        break;
        case '待配送':
            color = 'yellow'
        break;
        case '已下单':
            color = 'default'
        break;
        default:
        color = 'blue'
    }
    return color;

}

toolMap.Map = Map;

toolMap.getParJSONByMap = getParJSONByMap;

toolMap.statusColor = statusColor;

export default toolMap;
