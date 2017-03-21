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
   * jsonPromise 主体函数
   * @param {String} url -> 请求地址
   * @param {Object} config -> 用于覆盖默认配置的配置信息
   * @return {Promise} 返回一个 Promise 对象
   */
  function jsonPromise (url, config) {
    // 把两个揉在一起, 后覆盖前
    var _config = Object.assign(defaultConfig, config);

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
