(function (window, undefined) {
  'use strict';

  // 默认配置
  var defaultConfig = {
    /**
     * 最大连接时间
     */
    timeout : 8000,
    /**
     * 函数头字段
     */
    jsonpcallback : 'jsonpcallback',
    /**
     * jsonp 函数命名空间
     */
    callbackFunc : null
  };

  // 成功和失败的 state
  var STATE_SUCCESS = 1;
  var STATE_FAIL = -1;

  /**
   * 清除函数的命名空间
   * @param  {String} name 函数名
   * @return {undefined}      重视过程而非返回值
   */
  function clearFuncNamespace (name) {
    try {
      delete window[name];
    } catch (e) {
      window[name] = null;
    }
  }

  /**
   * 清除插入到页面内的 script 标签
   * @param  {String} id 用于选定 script 标签的 id
   * @return {Undefined}    重视过程而非返回值
   */
  function clearScriptById (id) {
    var _script = document.getElementById(id);
    window.document.head.removeChild(_script);
  }

  /**
   * jsonPromise 主体函数
   * @param {String} url -> 请求地址
   * @param {Object} config -> 用于覆盖默认配置的配置信息
   * @return {Promise} 返回一个 Promise 对象
   */
  function jsonPromise (url, config) {
    // 把两个揉在一起, 后覆盖前
    // 如果直接 Object.assign(defaultConfig, config) 的话, 会改变 defaultConfig 的取值
    // 所以这里修改为新的空对象承载
    var _config = Object.assign({}, defaultConfig, config);
    // 最大延时时间
    var timeout = _config.timeout;
    // jsonpcallback 的名字
    var jsonpcallback = _config.jsonpcallback;
    var timeoutTag;

    return new Promise(function (resolve, reject) {
      // 确定 callbackFunc 的名字
      var callbackFunc = _config.callbackFunc
        ? _config.callbackFunc
        : `${String(Math.random())}${Date.now()}`.replace(/\d\.\d{6}/, 'jsonp_');
      // 确定 script 标签的 id
      var scriptId = `${_config.jsonpcallback}_${callbackFunc}`;

      window[callbackFunc] = function (response) {
        resolve({
          state : STATE_SUCCESS,
          data : response
        });

        // 成功调用的话, 就把延时队列里面那个 reject 清除掉
        if (timeoutTag) {
          clearTimeout(timeoutTag);
        }

        // 移除 script 标签
        clearScriptById(scriptId);

        // 移除全局方法
        clearFuncNamespace(callbackFunc);
      };

      // 给 url 添加 jsonpcallback 参数
      url += (url.indexOf('?') === -1) ? '?' : '&';

      // 创建 script 标签
      var jsonpScriptTag = document.createElement('script');
      // 设置 src 属性, 并把 callbackFunc 和 jsonpcallback 拼上去
      jsonpScriptTag.setAttribute('src', `${url}${jsonpcallback}=${callbackFunc}`);
      // 设置 id
      jsonpScriptTag.setAttribute('id', scriptId);
      // 插入 dom
      document.head.appendChild(jsonpScriptTag);

      timeoutTag = setTimeout(function () {
        reject({
          state : STATE_FAIL,
          msg : `JSONP request timeout`
        });
        // 移除 script 标签
        clearScriptById(scriptId);

        // 移除全局方法
        clearFuncNamespace(callbackFunc);
      }, timeout);
    });
  }


  // 命名空间
  umd('jsonPromise', jsonPromise);
  function umd (name, component) {
    if (typeof module === 'object' && !!module.exports) {
      module.exports = component;
    } else {
      window[name] = component;
    }
  }
})(window, void 0);
