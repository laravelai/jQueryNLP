/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./resources/js/jquery-trans.js":
/*!**************************************!*\
  !*** ./resources/js/jquery-trans.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Collect all jQuery objects
var transObjects = $("[id^='trans']");
var text_array = new Array(transObjects.length);
var i = 0;
var start_no = 0;
var srcText = "";
var temp_array = [];
var processed = false;

while (i < transObjects.length) {
  text_array[i] = new Array();
  getNodeText(transObjects[i], text_array[i]);
  text_array[i] = text_array[i].join("\n");

  if ((i > 0 || start_no > 0) && (temp_array.join('\n\n\n') + text_array[i]).length > max_length) {
    var _transData = {
      'source': source_lang,
      'target': target_lang,
      'text': temp_array.join('\n\n\n'),
      'engine': engine
    };
    updateTransObj(_transData, start_no);
    start_no = i;
    temp_array = [];
    processed = true;
  } else {
    temp_array.push(text_array[i]);
    processed = false;
    i++;
  }
}

if (!processed) {
  transData = {
    'source': source_lang,
    'target': target_lang,
    'text': temp_array.join('\n\n\n'),
    'engine': engine
  };
  updateTransObj(transData, start_no);
} //Use Ajax to get translated text via Tencent AI Platform


function updateTransObj(transData, start_no) {
  if (transData.text.length > 1) {
    var getTrans = $.ajax({
      type: 'POST',
      url: '/api/nlp',
      data: transData,
      success: function success(data) {
        //error handling, do nothing
        if (data.ret !== 0 || data.target_text === "") {
          console.log(data.msg);
          return; //do nothing;
        } //split into contents for div


        var responseText = data.target_text;
        text_array = responseText.split('\n\n\n'); //Processing each div

        for (var _i = 0; _i < text_array.length; _i++) {
          //split translated text into different jQuery childNodes
          text_array[_i] = text_array[_i].split('\n');
          updateNodeText(transObjects[_i + start_no], text_array[_i]);
        }
      },
      dataType: 'json'
    });
  }
} //Covert all jQuery childNodes' text to array


function getNodeText(TransObj, text_array) {
  for (var _i2 = 0; _i2 < TransObj.childNodes.length; _i2++) {
    if (TransObj.childNodes[_i2].childNodes.length > 0) {
      getNodeText(TransObj.childNodes[_i2], text_array);
    } else {
      if (TransObj.childNodes[_i2].nodeName === "#text") {
        var parsedText = delExtraSpaces(delExtraTabs(delNewlines(TransObj.childNodes[_i2].data))).trim();

        if (parsedText !== "") {
          text_array.push(delNewlines(parsedText));
        }
      }
    }
  }
} //Update jQuery childNodes with translated text


function updateNodeText(TransObj, text_array) {
  for (var _i3 = 0; _i3 < TransObj.childNodes.length; _i3++) {
    if (TransObj.childNodes[_i3].childNodes.length > 0) {
      updateNodeText(TransObj.childNodes[_i3], text_array);
    } else {
      if (TransObj.childNodes[_i3].nodeName === "#text") {
        var parsedText = delExtraSpaces(delExtraTabs(delNewlines(TransObj.childNodes[_i3].data))).trim();
        var sentenseEnd = ['.', '。', '?', '!'];

        if (parsedText !== "") {
          if (text_array[0] !== undefined) {
            //check the last character of string, remove the . introduced by new line
            if (!sentenseEnd.includes(parsedText.charAt(parsedText.length - 1)) && sentenseEnd.includes(text_array[0].charAt(text_array[0].length - 1))) {
              text_array[0] = " " + text_array[0].substring(0, text_array[0].length - 2) + parsedText.charAt(parsedText.length - 1) + " ";
            }

            TransObj.childNodes[_i3].data = " " + text_array[0];
          }

          text_array.shift();
        }
      }
    }
  }
} //Remove all new line breaks


function delNewlines(nodeText) {
  if (nodeText.includes('\n')) {
    return delNewlines(nodeText.replace('\n', ''));
  }

  return nodeText;
} //Remove extra white spaces


function delExtraSpaces(nodeText) {
  if (nodeText.includes('  ')) {
    return delExtraSpaces(nodeText.replace('  ', ' '));
  }

  return nodeText;
} //Remove extra white tab


function delExtraTabs(nodeText) {
  nodeText = nodeText.replace(/\t/g, '');
  nodeText = nodeText.replace(/&nbsp;/g, '');
  return nodeText;
}

/***/ }),

/***/ 1:
/*!********************************************!*\
  !*** multi ./resources/js/jquery-trans.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! E:\Web\jQueryNLP\resources\js\jquery-trans.js */"./resources/js/jquery-trans.js");


/***/ })

/******/ });