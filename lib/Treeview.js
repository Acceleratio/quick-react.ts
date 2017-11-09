webpackJsonp([38],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	/* tslint:disable:no-console */
	__webpack_require__(1);
	__webpack_require__(327);
	var React = __webpack_require__(328);
	var ReactDOM = __webpack_require__(358);
	var Treeview_1 = __webpack_require__(1120);
	var treeviewElements_1 = __webpack_require__(1125);
	var autobind_1 = __webpack_require__(546);
	var Index = /** @class */function (_super) {
	    __extends(Index, _super);
	    function Index() {
	        var _this = _super.call(this) || this;
	        _this.state = {
	            treeviewElements: treeviewElements_1.elements
	        };
	        return _this;
	    }
	    Index.prototype.render = function () {
	        return React.createElement("div", null, React.createElement(Treeview_1.Treeview, { onExpand: this._onExpand, onSelect: this._onCheckboxListChange, showCheckbox: false, items: this.state.treeviewElements, recursive: true }), React.createElement("br", null), React.createElement("br", null), React.createElement(Treeview_1.Treeview, { onSelect: this._onTreeviewItemClick.bind(this), showCheckbox: true, items: this.state.treeviewElements, recursive: true }), React.createElement("br", null));
	    };
	    Index.prototype._onExpand = function (itemId, expanded) {
	        var treeviewElements = this.state.treeviewElements;
	        var changedElements = treeviewElements.map(function (element, index) {
	            if (element.id === itemId) {
	                console.log('found changed: ', element);
	                var el = __assign({}, element, { isOpen: expanded });
	                console.log(el === element);
	                return el;
	            }
	            return element;
	        });
	        this.setState({
	            treeviewElements: changedElements
	        });
	    };
	    Index.prototype._onTreeviewItemClick = function (ev, itemId, checked) {
	        console.log('checking : ', itemId, checked);
	        this.setState({
	            treeviewElements: this.state.treeviewElements.map(function (item) {
	                if (itemId.indexOf(item.id) > -1) {
	                    return { id: item.id, text: item.text, parentId: item.parentId, checked: checked };
	                } else {
	                    return item;
	                }
	            })
	        });
	    };
	    Index.prototype._onCheckboxListChange = function (ev, itemId, checked) {
	        console.log('checking : ', itemId, checked);
	    };
	    __decorate([autobind_1.autobind, __metadata("design:type", Function), __metadata("design:paramtypes", [String, Boolean]), __metadata("design:returntype", void 0)], Index.prototype, "_onExpand", null);
	    return Index;
	}(React.Component);
	exports.Index = Index;
	ReactDOM.render(React.createElement(Index, null), document.getElementById('root'));

/***/ },

/***/ 510:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var object_1 = __webpack_require__(511);
	exports.baseElementEvents = ['onCopy', 'onCut', 'onPaste', 'onCompositionEnd', 'onCompositionStart', 'onCompositionUpdate', 'onFocus', 'onFocusCapture', 'onBlur', 'onBlurCapture', 'onChange', 'onInput', 'onSubmit', 'onLoad', 'onError', 'onKeyDown', 'onKeyDownCapture', 'onKeyPress', 'onKeyUp', 'onAbort', 'onCanPlay', 'onCanPlayThrough', 'onDurationChange', 'onEmptied', 'onEncrypted', 'onEnded', 'onLoadedData', 'onLoadedMetadata', 'onLoadStart', 'onPause', 'onPlay', 'onPlaying', 'onProgress', 'onRateChange', 'onSeeked', 'onSeeking', 'onStalled', 'onSuspend', 'onTimeUpdate', 'onVolumeChange', 'onWaiting', 'onClick', 'onClickCapture', 'onContextMenu', 'onDoubleClick', 'onDrag', 'onDragEnd', 'onDragEnter', 'onDragExit', 'onDragLeave', 'onDragOver', 'onDragStart', 'onDrop', 'onMouseDown', 'onMouseDownCapture', 'onMouseEnter', 'onMouseLeave', 'onMouseMove', 'onMouseOut', 'onMouseOver', 'onMouseUp', 'onMouseUpCapture', 'onSelect', 'onTouchCancel', 'onTouchEnd', 'onTouchMove', 'onTouchStart', 'onScroll', 'onWheel'];
	exports.baseElementAttributes = ['defaultChecked', 'defaultValue', 'accept', 'acceptCharset', 'accessKey', 'action', 'allowFullScreen', 'allowTransparency', 'alt', 'async', 'autoComplete', 'autoFocus', 'autoPlay', 'capture', 'cellPadding', 'cellSpacing', 'charSet', 'challenge', 'checked', 'children', 'classID', 'className', 'cols', 'colSpan', 'content', 'contentEditable', 'contextMenu', 'controls', 'coords', 'crossOrigin', 'data', 'dateTime', 'default', 'defer', 'dir', 'download', 'draggable', 'encType', 'form', 'formAction', 'formEncType', 'formMethod', 'formNoValidate', 'formTarget', 'frameBorder', 'headers', 'height', 'hidden', 'high', 'hrefLang', 'htmlFor', 'httpEquiv', 'icon', 'id', 'inputMode', 'integrity', 'is', 'keyParams', 'keyType', 'kind', 'label', 'lang', 'list', 'loop', 'low', 'manifest', 'marginHeight', 'marginWidth', 'max', 'maxLength', 'media', 'mediaGroup', 'method', 'min', 'minLength', 'multiple', 'muted', 'name', 'noValidate', 'open', 'optimum', 'pattern', 'placeholder', 'poster', 'preload', 'radioGroup', 'readOnly', 'rel', 'required', 'role', 'rows', 'rowSpan', 'sandbox', 'scope', 'scoped', 'scrolling', 'seamless', 'selected', 'shape', 'size', 'sizes', 'span', 'spellCheck', 'src', 'srcDoc', 'srcLang', 'srcSet', 'start', 'step', 'style', 'summary', 'tabIndex', 'title', 'type', 'useMap', 'value', 'width', 'wmode', 'wrap'];
	exports.htmlElementAttributes = exports.baseElementAttributes.concat(exports.baseElementEvents);
	exports.anchorAttributes = exports.htmlElementAttributes.concat(['href', 'target']);
	exports.buttonAttributes = exports.htmlElementAttributes.concat(['disabled']);
	exports.divAttributes = exports.htmlElementAttributes.concat(['align', 'noWrap']);
	exports.inputAttributes = exports.buttonAttributes;
	exports.textAreaAttributes = exports.buttonAttributes;
	exports.imageAttributes = exports.divAttributes;
	function getNativeAttributes(Attributes, allowedAttributeNames, excludedAttributeNames) {
	    return object_1.filteredAssign(function (attributeName) {
	        return (!excludedAttributeNames || excludedAttributeNames.indexOf(attributeName) < 0) && (attributeName.indexOf('data-') === 0 || attributeName.indexOf('aria-') === 0 || allowedAttributeNames.indexOf(attributeName) >= 0);
	    }, {}, Attributes);
	}
	exports.getNativeAttributes = getNativeAttributes;

/***/ },

/***/ 511:
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	function assign(target) {
	    var args = [];
	    for (var _i = 1; _i < arguments.length; _i++) {
	        args[_i - 1] = arguments[_i];
	    }
	    return filteredAssign.apply(this, [null, target].concat(args));
	}
	exports.assign = assign;
	function filteredAssign(isAllowed, target) {
	    var args = [];
	    for (var _i = 2; _i < arguments.length; _i++) {
	        args[_i - 2] = arguments[_i];
	    }
	    target = target || {};
	    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
	        var sourceObject = args_1[_a];
	        if (sourceObject) {
	            for (var attributeName in sourceObject) {
	                if (sourceObject.hasOwnProperty(attributeName) && !isAllowed || isAllowed(attributeName)) {
	                    target[attributeName] = sourceObject[attributeName];
	                }
	            }
	        }
	    }
	    return target;
	}
	exports.filteredAssign = filteredAssign;

/***/ },

/***/ 518:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var React = __webpack_require__(328);
	var classNames = __webpack_require__(497);
	var attributes_1 = __webpack_require__(510);
	__webpack_require__(519);
	exports.Icon = function (props) {
	    var customIcon = props.iconName === '';
	    var iconClassName = classNames(['icon'], (_a = {}, _a[props.iconName] = !customIcon, _a), [props.className]);
	    return React.createElement("i", __assign({}, attributes_1.getNativeAttributes(props, attributes_1.htmlElementAttributes), { className: iconClassName }));
	    var _a;
	};

/***/ },

/***/ 519:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(520);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(504)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/index.js?outputStyle=expanded!./Icon.scss", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/index.js?outputStyle=expanded!./Icon.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 520:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(503)();
	// imports
	
	
	// module
	exports.push([module.id, "* {\n  font-family: 'Segoe UI';\n  font-size: 14px;\n  color: #4D4D4F;\n}\n\n::-webkit-scrollbar {\n  width: 8px;\n  height: 8px;\n}\n\n/* Track */\n::-webkit-scrollbar-track {\n  border-radius: 10px;\n  background: #DADADB;\n  border: 2px solid transparent;\n  background-clip: content-box;\n}\n\n/* Handle */\n::-webkit-scrollbar-thumb {\n  border-radius: 10px;\n  background: #AEAEAF;\n}\n\n::-webkit-scrollbar-thumb:hover {\n  background: #4D4D4F;\n}\n\n.ReactVirtualized__Grid:focus, .ReactVirtualized__Collection:focus {\n  outline: none !important;\n}\n\n@font-face {\n  font-family: 'icomoon';\n  src: url(\"/fonts/icomoon.eot\");\n  src: url(\"/fonts/icomoon.eot?#iefix\") format(\"embedded-opentype\"), url(\"/fonts/icomoon.woff\") format(\"woff\"), url(\"/fonts/icomoon.ttf\") format(\"truetype\"), url(\"/fonts/icomoon.svg?#icomoon\") format(\"svg\");\n  font-weight: normal;\n  font-style: normal;\n}\n\n.icon {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  display: inline-block;\n  font-family: icomoon;\n  font-style: normal;\n  margin-right: 5px;\n}\n\n.icon-disk:before {\n  content: \"\\E900\";\n}\n\n.icon-account:before {\n  content: \"\\E901\";\n}\n\n.icon-add:before {\n  content: \"\\E902\";\n}\n\n.icon-add_to_group:before {\n  content: \"\\E903\";\n}\n\n.icon-alert:before {\n  content: \"\\E904\";\n}\n\n.icon-alert1:before {\n  content: \"\\E905\";\n}\n\n.icon-all_users:before {\n  content: \"\\E906\";\n}\n\n.icon-arrow_down:before {\n  content: \"\\E907\";\n}\n\n.icon-arrow_down_right:before {\n  content: \"\\E908\";\n}\n\n.icon-arrow_L:before {\n  content: \"\\E909\";\n}\n\n.icon-arrow_R:before {\n  content: \"\\E90A\";\n}\n\n.icon-arrow_right:before {\n  content: \"\\E90B\";\n}\n\n.icon-Arrow_up:before {\n  content: \"\\E90C\";\n}\n\n.icon-arrow-down:before {\n  content: \"\\E90D\";\n}\n\n.icon-arrow-left:before {\n  content: \"\\E90E\";\n}\n\n.icon-arrow-right:before {\n  content: \"\\E90F\";\n}\n\n.icon-arrows:before {\n  content: \"\\E910\";\n}\n\n.icon-arrow-up:before {\n  content: \"\\E911\";\n}\n\n.icon-barChart:before {\n  content: \"\\E912\";\n}\n\n.icon-barChart2:before {\n  content: \"\\E913\";\n}\n\n.icon-break:before {\n  content: \"\\E914\";\n}\n\n.icon-buy:before {\n  content: \"\\E915\";\n}\n\n.icon-buy2:before {\n  content: \"\\E916\";\n}\n\n.icon-camera:before {\n  content: \"\\E917\";\n}\n\n.icon-checkbox:before {\n  content: \"\\E918\";\n}\n\n.icon-checkmark:before {\n  content: \"\\E919\";\n}\n\n.icon-ck_kit:before {\n  content: \"\\E91A\";\n}\n\n.icon-ClodKit365:before {\n  content: \"\\E91B\";\n}\n\n.icon-clone_user:before {\n  content: \"\\E91C\";\n}\n\n.icon-cloud:before {\n  content: \"\\E91D\";\n}\n\n.icon-collapseAll:before {\n  content: \"\\E91E\";\n}\n\n.icon-Column_chooser:before {\n  content: \"\\E91F\";\n}\n\n.icon-compare:before {\n  content: \"\\E920\";\n}\n\n.icon-copy_to_group:before {\n  content: \"\\E921\";\n}\n\n.icon-create_group:before {\n  content: \"\\E922\";\n}\n\n.icon-curentjobs:before {\n  content: \"\\E923\";\n}\n\n.icon-custom_pack:before {\n  content: \"\\E924\";\n}\n\n.icon-dashboard1:before {\n  content: \"\\E925\";\n}\n\n.icon-dashboard2:before {\n  content: \"\\E926\";\n}\n\n.icon-delete:before {\n  content: \"\\E927\";\n}\n\n.icon-delete_group:before {\n  content: \"\\E928\";\n}\n\n.icon-delete_user:before {\n  content: \"\\E929\";\n}\n\n.icon-details:before {\n  content: \"\\E92A\";\n}\n\n.icon-disabledUser:before {\n  content: \"\\E92B\";\n}\n\n.icon-document:before {\n  content: \"\\E92C\";\n}\n\n.icon-docx:before {\n  content: \"\\E92D\";\n}\n\n.icon-edit:before {\n  content: \"\\E92E\";\n}\n\n.icon-edit_email:before {\n  content: \"\\E92F\";\n}\n\n.icon-edit_phone:before {\n  content: \"\\E930\";\n}\n\n.icon-edit_user:before {\n  content: \"\\E931\";\n}\n\n.icon-equal:before {\n  content: \"\\E932\";\n}\n\n.icon-error:before {\n  content: \"\\E933\";\n}\n\n.icon-event_viewer:before {\n  content: \"\\E934\";\n}\n\n.icon-excel:before {\n  content: \"\\E935\";\n}\n\n.icon-Exchange:before {\n  content: \"\\E936\";\n}\n\n.icon-expand_collapse:before {\n  content: \"\\E937\";\n}\n\n.icon-expandAll:before {\n  content: \"\\E938\";\n}\n\n.icon-export:before {\n  content: \"\\E939\";\n}\n\n.icon-feedback:before {\n  content: \"\\E93A\";\n}\n\n.icon-filter:before {\n  content: \"\\E93B\";\n}\n\n.icon-filter2:before {\n  content: \"\\E93C\";\n}\n\n.icon-flag:before {\n  content: \"\\E93D\";\n}\n\n.icon-folder:before {\n  content: \"\\E93E\";\n}\n\n.icon-full_size:before {\n  content: \"\\E93F\";\n}\n\n.icon-gen_word:before {\n  content: \"\\E940\";\n}\n\n.icon-gen_word1:before {\n  content: \"\\E941\";\n}\n\n.icon-generate:before {\n  content: \"\\E942\";\n}\n\n.icon-ghost:before {\n  content: \"\\E943\";\n}\n\n.icon-grant_permissions:before {\n  content: \"\\E944\";\n}\n\n.icon-group:before {\n  content: \"\\E945\";\n}\n\n.icon-help:before {\n  content: \"\\E946\";\n}\n\n.icon-history:before {\n  content: \"\\E947\";\n}\n\n.icon-hitory_back:before {\n  content: \"\\E948\";\n}\n\n.icon-home:before {\n  content: \"\\E949\";\n}\n\n.icon-in_progress:before {\n  content: \"\\E94A\";\n}\n\n.icon-Info_krug:before {\n  content: \"\\E94B\";\n}\n\n.icon-inProgress:before {\n  content: \"\\E94C\";\n}\n\n.icon-internalLink:before {\n  content: \"\\E94D\";\n}\n\n.icon-item:before {\n  content: \"\\E94E\";\n}\n\n.icon-key:before {\n  content: \"\\E94F\";\n}\n\n.icon-link:before {\n  content: \"\\E950\";\n}\n\n.icon-list:before {\n  content: \"\\E951\";\n}\n\n.icon-load:before {\n  content: \"\\E952\";\n}\n\n.icon-load_info:before {\n  content: \"\\E953\";\n}\n\n.icon-load_job_tasks:before {\n  content: \"\\E954\";\n}\n\n.icon-load_witherrors:before {\n  content: \"\\E955\";\n}\n\n.icon-load_witherrors1:before {\n  content: \"\\E956\";\n}\n\n.icon-logo:before {\n  content: \"\\E957\";\n}\n\n.icon-logo_partner:before {\n  content: \"\\E958\";\n}\n\n.icon-logo_partner2:before {\n  content: \"\\E959\";\n}\n\n.icon-logOut:before {\n  content: \"\\E95A\";\n}\n\n.icon-move_to_group:before {\n  content: \"\\E95B\";\n}\n\n.icon-MyAccount:before {\n  content: \"\\E95C\";\n}\n\n.icon-news:before {\n  content: \"\\E95D\";\n}\n\n.icon-normal_size:before {\n  content: \"\\E95E\";\n}\n\n.icon-not_equal:before {\n  content: \"\\E95F\";\n}\n\n.icon-office:before {\n  content: \"\\E960\";\n}\n\n.icon-office_manage:before {\n  content: \"\\E961\";\n}\n\n.icon-Office365:before {\n  content: \"\\E962\";\n}\n\n.icon-onedrive:before {\n  content: \"\\E963\";\n}\n\n.icon-open:before {\n  content: \"\\E964\";\n}\n\n.icon-pdf:before {\n  content: \"\\E965\";\n}\n\n.icon-pending:before {\n  content: \"\\E966\";\n}\n\n.icon-permission_date:before {\n  content: \"\\E967\";\n}\n\n.icon-permission_level:before {\n  content: \"\\E968\";\n}\n\n.icon-permission_level2:before {\n  content: \"\\E969\";\n}\n\n.icon-permissions_explorer:before {\n  content: \"\\E96A\";\n}\n\n.icon-phone:before {\n  content: \"\\E96B\";\n}\n\n.icon-power:before {\n  content: \"\\E96C\";\n}\n\n.icon-premium_subs:before {\n  content: \"\\E96D\";\n}\n\n.icon-principal_status:before {\n  content: \"\\E96E\";\n}\n\n.icon-principal_type:before {\n  content: \"\\E96F\";\n}\n\n.icon-print:before {\n  content: \"\\E970\";\n}\n\n.icon-que:before {\n  content: \"\\E971\";\n}\n\n.icon-Quote:before {\n  content: \"\\E972\";\n}\n\n.icon-Quote2:before {\n  content: \"\\E973\";\n}\n\n.icon-Quote22:before {\n  content: \"\\E974\";\n}\n\n.icon-recent_jobs:before {\n  content: \"\\E975\";\n}\n\n.icon-refresh:before {\n  content: \"\\E976\";\n}\n\n.icon-reload:before {\n  content: \"\\E977\";\n}\n\n.icon-remove_user:before {\n  content: \"\\E978\";\n}\n\n.icon-remove_users_from_group:before {\n  content: \"\\E979\";\n}\n\n.icon-reset:before {\n  content: \"\\E97A\";\n}\n\n.icon-reset_jobs:before {\n  content: \"\\E97B\";\n}\n\n.icon-restore:before {\n  content: \"\\E97C\";\n}\n\n.icon-save:before {\n  content: \"\\E97D\";\n}\n\n.icon-schedule:before {\n  content: \"\\E97E\";\n}\n\n.icon-search:before {\n  content: \"\\E97F\";\n}\n\n.icon-security_group:before {\n  content: \"\\E980\";\n}\n\n.icon-settings:before {\n  content: \"\\E981\";\n}\n\n.icon-shared_folder:before {\n  content: \"\\E982\";\n}\n\n.icon-SharePoint:before {\n  content: \"\\E983\";\n}\n\n.icon-site:before {\n  content: \"\\E984\";\n}\n\n.icon-site_collection:before {\n  content: \"\\E985\";\n}\n\n.icon-site2:before {\n  content: \"\\E986\";\n}\n\n.icon-Snapshot:before {\n  content: \"\\E987\";\n}\n\n.icon-SP_report:before {\n  content: \"\\E988\";\n}\n\n.icon-database:before {\n  content: \"\\E989\";\n}\n\n.icon-starter-subs:before {\n  content: \"\\E98A\";\n}\n\n.icon-subscription:before {\n  content: \"\\E98B\";\n}\n\n.icon-subsite:before {\n  content: \"\\E98C\";\n}\n\n.icon-summary:before {\n  content: \"\\E98D\";\n}\n\n.icon-superAdmin:before {\n  content: \"\\E98E\";\n}\n\n.icon-switchView:before {\n  content: \"\\E98F\";\n}\n\n.icon-TakeSnapshot:before {\n  content: \"\\E990\";\n}\n\n.icon-transfer_user:before {\n  content: \"\\E991\";\n}\n\n.icon-trash:before {\n  content: \"\\E992\";\n}\n\n.icon-user:before {\n  content: \"\\E993\";\n}\n\n.icon-user_management:before {\n  content: \"\\E994\";\n}\n\n.icon-Users_quote:before {\n  content: \"\\E995\";\n}\n\n.icon-usklicnik:before {\n  content: \"\\E996\";\n}\n\n.icon-verson_update:before {\n  content: \"\\E997\";\n}\n\n.icon-viewType:before {\n  content: \"\\E998\";\n}\n\n.icon-warning:before {\n  content: \"\\E999\";\n}\n\n.icon-world:before {\n  content: \"\\E99A\";\n}\n", ""]);
	
	// exports


/***/ },

/***/ 536:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var React = __webpack_require__(328);
	var EventGroup_1 = __webpack_require__(537);
	var Async_1 = __webpack_require__(538);
	var CommonComponent = /** @class */function (_super) {
	    __extends(CommonComponent, _super);
	    function CommonComponent() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    Object.defineProperty(CommonComponent.prototype, "_async", {
	        get: function () {
	            if (!this.__async) {
	                this.__async = new Async_1.Async(this);
	                this._disposables.push(this.__async);
	            }
	            return this.__async;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(CommonComponent.prototype, "_events", {
	        get: function () {
	            if (!this.__events) {
	                this.__events = new EventGroup_1.EventGroup(this);
	                this._disposables.push(this.__events);
	            }
	            return this.__events;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(CommonComponent.prototype, "_disposables", {
	        get: function () {
	            if (!this.__disposables) {
	                this.__disposables = [];
	            }
	            return this.__disposables;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    CommonComponent.prototype._resolveRef = function (refName) {
	        var _this = this;
	        if (!this.__resolves) {
	            this.__resolves = {};
	        }
	        if (!this.__resolves[refName]) {
	            this.__resolves[refName] = function (ref) {
	                return _this[refName] = ref;
	            };
	        }
	        return this.__resolves[refName];
	    };
	    return CommonComponent;
	}(React.PureComponent);
	exports.CommonComponent = CommonComponent;

/***/ },

/***/ 537:
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var EventGroup = /** @class */function () {
	    function EventGroup(parent) {
	        this._id = EventGroup._uniqueId++;
	        this._parent = parent;
	        this._eventRecords = [];
	    }
	    EventGroup.raise = function (target, eventName, eventArgs, bubbleEvent) {
	        var retVal;
	        if (EventGroup._isElement(target)) {
	            if (document.createEvent) {
	                var ev = document.createEvent('HTMLEvents');
	                ev.initEvent(eventName, bubbleEvent, true);
	                /* tslint:disable */
	                ev['args'] = eventArgs;
	                retVal = target.dispatchEvent(ev);
	            } else if (document['createEventObject']) {
	                var evObj = document['createEventObject'](eventArgs);
	                /* tslint:enable */
	                target.fireEvent('on' + eventName, evObj);
	            }
	        } else {
	            while (target && retVal !== false) {
	                var events = target.__events__;
	                var eventRecords = events ? events[eventName] : null;
	                for (var id in eventRecords) {
	                    if (eventRecords.hasOwnProperty(id)) {
	                        var eventRecordList = eventRecords[id];
	                        for (var listIndex = 0; retVal !== false && listIndex < eventRecordList.length; listIndex++) {
	                            var record = eventRecordList[listIndex];
	                            if (record.objectCallback) {
	                                retVal = record.objectCallback.call(record.parent, eventArgs);
	                            }
	                        }
	                    }
	                }
	                target = bubbleEvent ? target.parent : null;
	            }
	        }
	        return retVal;
	    };
	    EventGroup.isObserved = function (target, eventName) {
	        var events = target && target.__events__;
	        return !!events && !!events[eventName];
	    };
	    EventGroup.isDeclared = function (target, eventName) {
	        var declaredEvents = target && target.__declaredEvents;
	        return !!declaredEvents && !!declaredEvents[eventName];
	    };
	    EventGroup.stopPropagation = function (event) {
	        if (event.stopPropagation) {
	            event.stopPropagation();
	        } else {
	            event.cancelBubble = true;
	        }
	    };
	    EventGroup._isElement = function (target) {
	        return !!target && (target.addEventListener || target instanceof HTMLElement);
	    };
	    EventGroup.prototype.dispose = function () {
	        if (!this._isDisposed) {
	            this._isDisposed = true;
	            this.off();
	            this._parent = null;
	        }
	    };
	    EventGroup.prototype.onAll = function (target, events, useCapture) {
	        for (var eventName in events) {
	            if (events.hasOwnProperty(eventName)) {
	                this.on(target, eventName, events[eventName], useCapture);
	            }
	        }
	    };
	    EventGroup.prototype.on = function (target, eventName, callback, useCapture) {
	        var _this = this;
	        if (eventName.indexOf(',') > -1) {
	            var events = eventName.split(/[ ,]+/);
	            for (var i = 0; i < events.length; i++) {
	                this.on(target, events[i], callback, useCapture);
	            }
	        } else {
	            var parent_1 = this._parent;
	            var eventRecord = {
	                target: target,
	                eventName: eventName,
	                parent: parent_1,
	                callback: callback,
	                objectCallback: null,
	                elementCallback: null,
	                useCapture: useCapture
	            };
	            var events = target.__events__ = target.__events__ || {};
	            events[eventName] = events[eventName] || {
	                count: 0
	            };
	            events[eventName][this._id] = events[eventName][this._id] || [];
	            events[eventName][this._id].push(eventRecord);
	            events[eventName].count++;
	            if (EventGroup._isElement(target)) {
	                var processElementEvent = function () {
	                    var args = [];
	                    for (var _i = 0; _i < arguments.length; _i++) {
	                        args[_i] = arguments[_i];
	                    }
	                    if (_this._isDisposed) {
	                        return;
	                    }
	                    var result;
	                    try {
	                        result = callback.apply(parent_1, args);
	                        if (result === false && args[0]) {
	                            var e = args[0];
	                            if (e.preventDefault) {
	                                e.preventDefault();
	                            }
	                            if (e.stopPropagation) {
	                                e.stopPropagation();
	                            }
	                            e.cancelBubble = true;
	                        }
	                    } catch (e) {
	                        /* ErrorHelper.log(e); */
	                    }
	                    return result;
	                };
	                eventRecord.elementCallback = processElementEvent;
	                if (target.addEventListener) {
	                    target.addEventListener(eventName, processElementEvent, useCapture);
	                } else if (target.attachEvent) {
	                    target.attachEvent('on' + eventName, processElementEvent);
	                }
	            } else {
	                var processObjectEvent = function () {
	                    var args = [];
	                    for (var _i = 0; _i < arguments.length; _i++) {
	                        args[_i] = arguments[_i];
	                    }
	                    if (_this._isDisposed) {
	                        return;
	                    }
	                    return callback.apply(parent_1, args);
	                };
	                eventRecord.objectCallback = processObjectEvent;
	            }
	            this._eventRecords.push(eventRecord);
	        }
	    };
	    EventGroup.prototype.off = function (target, eventName, callback, useCapture) {
	        for (var i = 0; i < this._eventRecords.length; i++) {
	            var eventRecord = this._eventRecords[i];
	            if ((!target || target === eventRecord.target) && (!eventName || eventName === eventRecord.eventName) && (!callback || callback === eventRecord.callback) && (typeof useCapture !== 'boolean' || useCapture === eventRecord.useCapture)) {
	                var events = eventRecord.target.__events__;
	                var targetArrayLookup = events[eventRecord.eventName];
	                var targetArray = targetArrayLookup ? targetArrayLookup[this._id] : null;
	                if (targetArray) {
	                    if (targetArray.length === 1 || !callback) {
	                        targetArrayLookup.count -= targetArray.length;
	                        delete events[eventRecord.eventName][this._id];
	                    } else {
	                        targetArrayLookup.count--;
	                        targetArray.splice(targetArray.indexOf(eventRecord), 1);
	                    }
	                    if (!targetArrayLookup.count) {
	                        delete events[eventRecord.eventName];
	                    }
	                }
	                if (eventRecord.elementCallback) {
	                    if (eventRecord.target.removeEventListener) {
	                        eventRecord.target.removeEventListener(eventRecord.eventName, eventRecord.elementCallback, eventRecord.useCapture);
	                    } else if (eventRecord.target.detachEvent) {
	                        eventRecord.target.detachEvent('on' + eventRecord.eventName, eventRecord.elementCallback);
	                    }
	                }
	                this._eventRecords.splice(i--, 1);
	            }
	        }
	    };
	    EventGroup.prototype.raise = function (eventName, eventArgs, bubbleEvent) {
	        return EventGroup.raise(this._parent, eventName, eventArgs, bubbleEvent);
	    };
	    EventGroup.prototype.declare = function (event) {
	        var declaredEvents = this._parent.__declaredEvents = this._parent.__declaredEvents || {};
	        if (typeof event === 'string') {
	            declaredEvents[event] = true;
	        } else {
	            for (var i = 0; i < event.length; i++) {
	                declaredEvents[event[i]] = true;
	            }
	        }
	    };
	    EventGroup._uniqueId = 0;
	    return EventGroup;
	}();
	exports.EventGroup = EventGroup;

/***/ },

/***/ 538:
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var Async = /** @class */function () {
	    function Async(parent, onError) {
	        this._timeoutIds = null;
	        this._immediateIds = null;
	        this._intervalIds = null;
	        this._animationFrameIds = null;
	        this._isDisposed = false;
	        this._parent = parent || null;
	        this._onErrorHandler = onError;
	        this._noop = function () {};
	    }
	    Async.prototype.dispose = function () {
	        var id;
	        this._isDisposed = true;
	        this._parent = null;
	        if (this._timeoutIds) {
	            for (id in this._timeoutIds) {
	                if (this._timeoutIds.hasOwnProperty(id)) {
	                    this.clearTimeout(id);
	                }
	            }
	            this._timeoutIds = null;
	        }
	        if (this._immediateIds) {
	            for (id in this._immediateIds) {
	                if (this._immediateIds.hasOwnProperty(id)) {
	                    this.clearImmediate(id);
	                }
	            }
	            this._immediateIds = null;
	        }
	        if (this._intervalIds) {
	            for (id in this._intervalIds) {
	                if (this._intervalIds.hasOwnProperty(id)) {
	                    this.clearInterval(id);
	                }
	            }
	            this._intervalIds = null;
	        }
	        if (this._animationFrameIds) {
	            for (id in this._animationFrameIds) {
	                if (this._animationFrameIds.hasOwnProperty(id)) {
	                    this.cancelAnimationFrame(id);
	                }
	            }
	            this._animationFrameIds = null;
	        }
	    };
	    Async.prototype.setTimeout = function (callback, duration) {
	        var _this = this;
	        var timeoutId = 0;
	        if (!this._isDisposed) {
	            if (!this._timeoutIds) {
	                this._timeoutIds = {};
	            }
	            timeoutId = setTimeout(function () {
	                try {
	                    delete _this._timeoutIds[timeoutId];
	                    callback.apply(_this._parent);
	                } catch (e) {
	                    if (_this._onErrorHandler) {
	                        _this._onErrorHandler(e);
	                    }
	                }
	            }, duration);
	            this._timeoutIds[timeoutId] = true;
	        }
	        return timeoutId;
	    };
	    Async.prototype.clearTimeout = function (id) {
	        if (this._timeoutIds && this._timeoutIds[id]) {
	            clearTimeout(id);
	            delete this._timeoutIds[id];
	        }
	    };
	    Async.prototype.setImmediate = function (callback) {
	        var _this = this;
	        var immediateId = 0;
	        if (!this._isDisposed) {
	            if (!this._immediateIds) {
	                this._immediateIds = {};
	            }
	            var setImmediateCallback = function () {
	                try {
	                    delete _this._immediateIds[immediateId];
	                    callback.apply(_this._parent);
	                } catch (e) {
	                    _this._logError(e);
	                }
	            };
	            immediateId = window.setImmediate ? window.setImmediate(setImmediateCallback) : window.setTimeout(setImmediateCallback, 0);
	            this._immediateIds[immediateId] = true;
	        }
	        return immediateId;
	    };
	    Async.prototype.clearImmediate = function (id) {
	        if (this._immediateIds && this._immediateIds[id]) {
	            window.clearImmediate ? window.clearImmediate(id) : window.clearTimeout(id);
	            delete this._immediateIds[id];
	        }
	    };
	    Async.prototype.setInterval = function (callback, duration) {
	        var _this = this;
	        var intervalId = 0;
	        if (!this._isDisposed) {
	            if (!this._intervalIds) {
	                this._intervalIds = {};
	            }
	            intervalId = setInterval(function () {
	                try {
	                    callback.apply(_this._parent);
	                } catch (e) {
	                    _this._logError(e);
	                }
	            }, duration);
	            this._intervalIds[intervalId] = true;
	        }
	        return intervalId;
	    };
	    Async.prototype.clearInterval = function (id) {
	        if (this._intervalIds && this._intervalIds[id]) {
	            clearInterval(id);
	            delete this._intervalIds[id];
	        }
	    };
	    Async.prototype.throttle = function (func, wait, options) {
	        var _this = this;
	        if (this._isDisposed) {
	            return this._noop;
	        }
	        var waitMS = wait || 0;
	        var leading = true;
	        var trailing = true;
	        var lastExecuteTime = 0;
	        var lastResult;
	        var lastArgs;
	        var timeoutId = null;
	        if (options && typeof options.leading === 'boolean') {
	            leading = options.leading;
	        }
	        if (options && typeof options.trailing === 'boolean') {
	            trailing = options.trailing;
	        }
	        var callback = function (userCall) {
	            var now = new Date().getTime();
	            var delta = now - lastExecuteTime;
	            var waitLength = leading ? waitMS - delta : waitMS;
	            if (delta >= waitMS && (!userCall || leading)) {
	                lastExecuteTime = now;
	                if (timeoutId) {
	                    _this.clearTimeout(timeoutId);
	                    timeoutId = null;
	                }
	                lastResult = func.apply(_this._parent, lastArgs);
	            } else if (timeoutId === null && trailing) {
	                timeoutId = _this.setTimeout(callback, waitLength);
	            }
	            return lastResult;
	        };
	        var resultFunction = function () {
	            var args = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                args[_i] = arguments[_i];
	            }
	            lastArgs = args;
	            return callback(true);
	        };
	        return resultFunction;
	    };
	    Async.prototype.debounce = function (func, wait, options) {
	        var _this = this;
	        if (this._isDisposed) {
	            return this._noop;
	        }
	        var waitMS = wait || 0;
	        var leading = false;
	        var trailing = true;
	        var maxWait = null;
	        var lastCallTime = 0;
	        var lastExecuteTime = new Date().getTime();
	        var lastResult;
	        var lastArgs;
	        var timeoutId = null;
	        if (options && typeof options.leading === 'boolean') {
	            leading = options.leading;
	        }
	        if (options && typeof options.trailing === 'boolean') {
	            trailing = options.trailing;
	        }
	        if (options && typeof options.maxWait === 'number' && !isNaN(options.maxWait)) {
	            maxWait = options.maxWait;
	        }
	        var callback = function (userCall) {
	            var now = new Date().getTime();
	            var executeImmediately = false;
	            if (userCall) {
	                if (leading && now - lastCallTime >= waitMS) {
	                    executeImmediately = true;
	                }
	                lastCallTime = now;
	            }
	            var delta = now - lastCallTime;
	            var waitLength = waitMS - delta;
	            var maxWaitDelta = now - lastExecuteTime;
	            var maxWaitExpired = false;
	            if (maxWait !== null) {
	                if (maxWaitDelta >= maxWait && timeoutId) {
	                    maxWaitExpired = true;
	                } else {
	                    waitLength = Math.min(waitLength, maxWait - maxWaitDelta);
	                }
	            }
	            if (delta >= waitMS || maxWaitExpired || executeImmediately) {
	                if (timeoutId) {
	                    _this.clearTimeout(timeoutId);
	                    timeoutId = null;
	                }
	                lastExecuteTime = now;
	                lastResult = func.apply(_this._parent, lastArgs);
	            } else if ((timeoutId === null || !userCall) && trailing) {
	                timeoutId = _this.setTimeout(callback, waitLength);
	            }
	            return lastResult;
	        };
	        var resultFunction = function () {
	            var args = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                args[_i] = arguments[_i];
	            }
	            lastArgs = args;
	            return callback(true);
	        };
	        return resultFunction;
	    };
	    Async.prototype.requestAnimationFrame = function (callback) {
	        var _this = this;
	        var animationFrameId = 0;
	        if (!this._isDisposed) {
	            if (!this._animationFrameIds) {
	                this._animationFrameIds = {};
	            }
	            var animationFrameCallback = function () {
	                try {
	                    delete _this._animationFrameIds[animationFrameId];
	                    callback.apply(_this._parent);
	                } catch (e) {
	                    _this._logError(e);
	                }
	            };
	            animationFrameId = window.requestAnimationFrame ? window.requestAnimationFrame(animationFrameCallback) : window.setTimeout(animationFrameCallback, 0);
	            this._animationFrameIds[animationFrameId] = true;
	        }
	        return animationFrameId;
	    };
	    Async.prototype.cancelAnimationFrame = function (id) {
	        if (this._animationFrameIds && this._animationFrameIds[id]) {
	            window.cancelAnimationFrame ? window.cancelAnimationFrame(id) : window.clearTimeout(id);
	            delete this._animationFrameIds[id];
	        }
	    };
	    Async.prototype._logError = function (e) {
	        if (this._onErrorHandler) {
	            this._onErrorHandler(e);
	        }
	    };
	    return Async;
	}();
	exports.Async = Async;

/***/ },

/***/ 546:
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	function autobind(target, key, descriptor) {
	    var fn = descriptor.value;
	    if (typeof fn !== 'function') {
	        throw new Error("@autobind decorator can only be applied to methods");
	    }
	    // avoid recursion in IE11
	    var definingProperty = false;
	    return {
	        configurable: true,
	        get: function () {
	            if (definingProperty || this === target.prototype || this.hasOwnProperty(key)) {
	                return fn;
	            }
	            var bound = fn.bind(this);
	            definingProperty = true;
	            Object.defineProperty(this, key, {
	                value: bound,
	                configurable: true,
	                writable: true
	            });
	            definingProperty = false;
	            return bound;
	        }
	    };
	}
	exports.autobind = autobind;

/***/ },

/***/ 551:
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	// Initialize global window id.
	var CURRENT_ID_PROPERTY = '__currentId__';
	var _global = typeof window !== 'undefined' && window || process;
	if (_global[CURRENT_ID_PROPERTY] === undefined) {
	    _global[CURRENT_ID_PROPERTY] = 0;
	}
	function getId(prefix) {
	    var index = _global[CURRENT_ID_PROPERTY]++;
	    return (prefix || '') + index;
	}
	exports.getId = getId;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(323)))

/***/ },

/***/ 560:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var React = __webpack_require__(328);
	var classNames = __webpack_require__(497);
	var autobind_1 = __webpack_require__(546);
	var getId_1 = __webpack_require__(551);
	var Common_1 = __webpack_require__(536);
	var Icon_1 = __webpack_require__(518);
	__webpack_require__(561);
	var Checkbox = /** @class */function (_super) {
	    __extends(Checkbox, _super);
	    function Checkbox(props) {
	        var _this = _super.call(this, props) || this;
	        _this.id = getId_1.getId('checkbox-');
	        _this.state = {
	            isFocused: false,
	            isChecked: props.defaultChecked || false
	        };
	        return _this;
	    }
	    Checkbox.prototype.shouldComponentUpdate = function (nextProps, nextState) {
	        return !(this.props.checked === nextProps.checked && this.props.className === nextProps.className && this.props.label === nextProps.label && this.props.disabled === nextProps.disabled && this.props.itemID === nextProps.itemId);
	    };
	    Checkbox.prototype.render = function () {
	        var _a = this.props,
	            checked = _a.checked,
	            defaultChecked = _a.defaultChecked,
	            disabled = _a.disabled,
	            inputProps = _a.inputProps,
	            label = _a.label,
	            id = _a.id,
	            iconClassName = _a.iconClassName;
	        var isFocused = this.state.isFocused;
	        var isChecked = checked === undefined ? this.state.isChecked : checked;
	        var className = classNames({
	            'checkbox': true,
	            'checked': isChecked
	        }, [this.props.className]);
	        var labelClassName = classNames({
	            'checkbox-label': true,
	            'is-checked': isChecked,
	            'is-disabled': disabled
	        });
	        var innerLabelClassName = classNames({
	            'label-with-icon': iconClassName !== undefined,
	            'label': iconClassName === undefined
	        });
	        return React.createElement("div", { className: className }, React.createElement("input", __assign({}, inputProps, checked !== undefined && { checked: checked }, defaultChecked !== undefined && { defaultChecked: defaultChecked }, { disabled: disabled, ref: this._resolveRef('_checkBox'), className: 'checkbox-input', id: this.id, name: this.id, type: "checkbox", onChange: this._onChange, onFocus: this._onFocus, onBlur: this._onBlur })), React.createElement("label", { htmlFor: this.id, className: labelClassName }, isChecked && React.createElement(Icon_1.Icon, { htmlFor: this.id, className: 'checkboxCheckmark', iconName: 'icon-checkmark' }), iconClassName && React.createElement(Icon_1.Icon, { htmlFor: this.id, iconName: iconClassName, className: 'label-icon' }), label && React.createElement("span", { className: innerLabelClassName }, label)));
	    };
	    Object.defineProperty(Checkbox.prototype, "checked", {
	        get: function () {
	            return this._checkBox ? this._checkBox.checked : false;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Checkbox.prototype.focus = function () {
	        if (this._checkBox) {
	            this._checkBox.focus();
	        }
	    };
	    Checkbox.prototype._onFocus = function (ev) {
	        var inputProps = this.props.inputProps;
	        if (inputProps && inputProps.onFocus) {
	            inputProps.onFocus(ev);
	        }
	        this.setState({ isFocused: true });
	    };
	    Checkbox.prototype._onBlur = function (ev) {
	        var inputProps = this.props.inputProps;
	        if (inputProps && inputProps.onBlur) {
	            inputProps.onBlur(ev);
	        }
	        this.setState({ isFocused: false });
	    };
	    Checkbox.prototype._onChange = function (ev) {
	        var _a = this.props,
	            onChange = _a.onChange,
	            itemId = _a.itemId;
	        var isChecked = ev.target.checked;
	        if (onChange) {
	            onChange(ev, itemId, isChecked);
	        }
	        if (this.props.checked === undefined) {
	            this.setState({ isChecked: isChecked });
	        }
	    };
	    Checkbox.defaultProps = {};
	    __decorate([autobind_1.autobind, __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", void 0)], Checkbox.prototype, "_onFocus", null);
	    __decorate([autobind_1.autobind, __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", void 0)], Checkbox.prototype, "_onBlur", null);
	    __decorate([autobind_1.autobind, __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", void 0)], Checkbox.prototype, "_onChange", null);
	    return Checkbox;
	}(Common_1.CommonComponent);
	exports.Checkbox = Checkbox;

/***/ },

/***/ 561:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(562);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(504)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/index.js?outputStyle=expanded!./Checkbox.scss", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/index.js?outputStyle=expanded!./Checkbox.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 562:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(503)();
	// imports
	
	
	// module
	exports.push([module.id, "* {\n  font-family: 'Segoe UI';\n  font-size: 14px;\n  color: #4D4D4F;\n}\n\n::-webkit-scrollbar {\n  width: 8px;\n  height: 8px;\n}\n\n/* Track */\n::-webkit-scrollbar-track {\n  border-radius: 10px;\n  background: #DADADB;\n  border: 2px solid transparent;\n  background-clip: content-box;\n}\n\n/* Handle */\n::-webkit-scrollbar-thumb {\n  border-radius: 10px;\n  background: #AEAEAF;\n}\n\n::-webkit-scrollbar-thumb:hover {\n  background: #4D4D4F;\n}\n\n.ReactVirtualized__Grid:focus, .ReactVirtualized__Collection:focus {\n  outline: none !important;\n}\n\n.checkbox {\n  box-sizing: border-box;\n  height: 28px;\n}\n\n.checkbox .checkbox-input {\n  position: absolute;\n  opacity: 0;\n}\n\n.checkbox .checkbox-label {\n  display: inline-block;\n  cursor: pointer;\n  margin-top: 5px;\n  line-height: 16px;\n  user-select: none;\n  position: relative;\n}\n\n.checkbox .checkbox-label::before {\n  content: '';\n  border: 2px solid #4D4D4F;\n  border-radius: 4px;\n  width: 16px;\n  height: 16px;\n  position: absolute;\n  box-sizing: border-box;\n  transition-property: background, border, border-color;\n  transition-duration: 300ms;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.23, 1);\n}\n\n.checkbox .checkbox-label.is-disabled {\n  cursor: default;\n}\n\n.checkbox .checkbox-label.is-disabled::before {\n  background-color: #ffffff;\n  border-color: #AEAEAF;\n}\n\n.checkbox .checkbox-label.is-disabled .label {\n  color: #AEAEAF;\n}\n\n.checkbox .checkbox-label.is-checked.is-disabled::before {\n  background-color: #FAC992;\n  border-color: #FAC992;\n}\n\n.checkbox .checkbox-label.is-checked.is-disabled .label {\n  color: #AEAEAF;\n}\n\n.checkbox .label {\n  padding: 0 0 0 25px;\n}\n\n.checkbox.checked .checkbox-label::before {\n  border-color: #F79428;\n  background-color: #F79428;\n}\n\n.checkbox.checked .checkboxCheckmark {\n  position: absolute;\n  color: #ffffff;\n  z-index: 100;\n  font-size: 10px;\n  margin-left: 3px;\n}\n\n.checkbox .label-icon {\n  padding-left: 25px;\n}\n\n.checkbox.checkbox-white .checkbox-label:before {\n  border: 2px solid #ffffff;\n}\n\n.checkbox.checkbox-white .checkbox-label .label {\n  color: #ffffff;\n}\n\n.checkbox.checkbox-white .checkbox-label.is-disabled::before {\n  background-color: #AEAEAF;\n  border-color: #AEAEAF;\n}\n\n.checkbox.checkbox-white .checkbox-label.is-disabled .label {\n  color: #AEAEAF;\n}\n\n.checkbox.checkbox-white .checkbox-label.is-checked.is-disabled::before {\n  background-color: #AEAEAF;\n  border-color: #AEAEAF;\n}\n\n.checkbox.checkbox-white.checked .checkbox-label::before {\n  border-color: #ffffff;\n  background-color: #ffffff;\n}\n\n.checkbox.checkbox-white.checked .checkboxCheckmark {\n  position: absolute;\n  color: #4D4D4F;\n  z-index: 100;\n  font-size: 10px;\n  margin-left: 3px;\n}\n", ""]);
	
	// exports


/***/ },

/***/ 1120:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var React = __webpack_require__(328);
	var classNames = __webpack_require__(497);
	var TreeviewItem_1 = __webpack_require__(1121);
	__webpack_require__(1122);
	var Treeview = /** @class */function (_super) {
	    __extends(Treeview, _super);
	    function Treeview() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    Treeview.prototype.render = function () {
	        var _this = this;
	        var _a = this.props,
	            label = _a.label,
	            items = _a.items,
	            onSelect = _a.onSelect,
	            showCheckbox = _a.showCheckbox,
	            recursive = _a.recursive,
	            onExpand = _a.onExpand;
	        var className = classNames('treeview', [this.props.className], {
	            'treeview-with-checkbox': showCheckbox
	        });
	        var parent = items.map(function (element) {
	            element.children = _this._setElementChildren(element, items);
	            return element;
	        });
	        return React.createElement("div", null, parent.map(function (item, index) {
	            return !item.parentId && React.createElement("div", { key: index, className: className }, React.createElement(TreeviewItem_1.TreeviewItem, { item: item, onChange: onSelect, showCheckbox: showCheckbox, children: item.children, recursive: recursive, className: item.className, onExpand: onExpand }));
	        }));
	    };
	    Treeview.prototype._setElementChildren = function (currentItem, allItems) {
	        var _this = this;
	        var children = allItems.filter(function (element) {
	            return element.parentId === currentItem.id;
	        });
	        children.forEach(function (element) {
	            var grandChildren = _this._setElementChildren(element, allItems);
	            element.children = grandChildren;
	        });
	        return children;
	    };
	    return Treeview;
	}(React.PureComponent);
	exports.Treeview = Treeview;

/***/ },

/***/ 1121:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var React = __webpack_require__(328);
	var classNames = __webpack_require__(497);
	var Icon_1 = __webpack_require__(518);
	var Checkbox_1 = __webpack_require__(560);
	var Common_1 = __webpack_require__(536);
	var autobind_1 = __webpack_require__(546);
	__webpack_require__(1122);
	var treeviewItemHoverBtn_1 = __webpack_require__(1124);
	var expandedIcon = 'icon-arrow_down_right';
	var collapsedIcon = 'icon-arrow_right';
	var TreeviewItem = /** @class */function (_super) {
	    __extends(TreeviewItem, _super);
	    function TreeviewItem(props) {
	        var _this = _super.call(this, props) || this;
	        _this.onItemClick = function (event) {
	            _this._onItemSelect(event, '', true);
	        };
	        var isItemOpened = props.item.isOpen;
	        var isOpenInitially;
	        if (props.onExpand === undefined) {
	            isOpenInitially = isItemOpened !== undefined ? isItemOpened : false;
	        } else {
	            isOpenInitially = undefined;
	        }
	        _this.state = {
	            hover: false,
	            isOpen: isOpenInitially
	        };
	        return _this;
	    }
	    TreeviewItem.prototype.render = function () {
	        var _this = this;
	        var _a = this.props,
	            item = _a.item,
	            onChange = _a.onChange,
	            showCheckbox = _a.showCheckbox,
	            children = _a.children,
	            recursive = _a.recursive,
	            onExpand = _a.onExpand;
	        var checkedStatus = this._getChildrenChecked(item, item.checked, recursive);
	        var checked = checkedStatus.isChecked;
	        this.onExpandCore = onExpand !== undefined ? onExpand : this._changeInternalIsOpenState;
	        var isOpen = this._getIsOpen();
	        var arrowIcon = isOpen ? expandedIcon : collapsedIcon;
	        var itemClassName = isOpen ? 'expanded' : 'collapsed';
	        var parentItemClassName = item.children.length > 0 ? 'treeveiw-parent-item' : '';
	        var treeveiwItemClassName = 'treeveiw-content';
	        var selectedClassName = recursive && checkedStatus.hasCheckedChild && !checked ? 'partial-selected' : '';
	        return React.createElement("div", { onMouseEnter: this._onItemHover, onMouseLeave: this._onItemLeaveHover, className: parentItemClassName }, React.createElement("div", { className: classNames('treeview-item', item.className) }, item.children.length > 0 && React.createElement(Icon_1.Icon, { iconName: arrowIcon, className: "arrow-icon", onClick: this._onExpand }), React.createElement("div", { className: treeveiwItemClassName }, showCheckbox && React.createElement(Checkbox_1.Checkbox, { label: item.text, onChange: this._onItemSelect, checked: checked, className: selectedClassName }), !showCheckbox && React.createElement("span", { onClick: this.onItemClick, title: item.title }, item.text), this.props.item.hoverOverBtn && this.state.hover && React.createElement("div", { className: "treeview-item__icons-container" }, this.props.item.hoverOverBtn.map(function (btn, key) {
	            return React.createElement(treeviewItemHoverBtn_1.TreeviewItemHoverBtn, { key: key, id: _this.props.item.id, iconName: btn.iconName, onClick: btn.callback, className: "treeview-item__icon" });
	        })))), item.children.length > 0 && isOpen && React.createElement("div", { className: itemClassName }, item.children.map(function (child, index) {
	            return React.createElement(TreeviewItem, { item: child, onChange: onChange, key: index, showCheckbox: showCheckbox, children: child.children, recursive: recursive, className: child.className, onExpand: onExpand });
	        })));
	    };
	    TreeviewItem.prototype._changeInternalIsOpenState = function () {
	        var isOpen = this.state.isOpen;
	        this.setState({
	            isOpen: !isOpen
	        });
	    };
	    TreeviewItem.prototype._getIsOpen = function () {
	        if (this.props.onExpand === undefined) {
	            return this.state.isOpen;
	        } else {
	            return this.props.item.isOpen !== undefined ? this.props.item.isOpen : false;
	        }
	    };
	    TreeviewItem.prototype._onItemHover = function () {
	        this.setState({
	            hover: true
	        });
	    };
	    TreeviewItem.prototype._onItemLeaveHover = function () {
	        this.setState({
	            hover: false
	        });
	    };
	    TreeviewItem.prototype._onItemSelect = function (event, itemId, checked) {
	        var item = this.props.item;
	        if (this.props.showCheckbox) {
	            var items = [];
	            items.push(item.id);
	            if (this.props.recursive) {
	                items = items.concat(this._getChildrenId(this.props.children));
	            }
	            this.props.onChange(event, items, checked);
	        } else {
	            this.props.onChange(event, [item.id], checked);
	        }
	    };
	    TreeviewItem.prototype._onExpand = function (ev) {
	        var item = this.props.item;
	        ev.stopPropagation();
	        ev.preventDefault();
	        this.onExpandCore(item.id, !item.isOpen);
	    };
	    TreeviewItem.prototype._getChildrenId = function (children) {
	        var _this = this;
	        var result = [];
	        children.forEach(function (item) {
	            result.push(item.id);
	            if (item.children.length > 0) {
	                result = result.concat(_this._getChildrenId(item.children));
	            }
	        });
	        return result;
	    };
	    TreeviewItem.prototype._getChildrenChecked = function (item, checked, recursive) {
	        var _this = this;
	        var result = { isChecked: true, hasCheckedChild: false };
	        if (item.children.length === 0 || !recursive) {
	            result.isChecked = checked === undefined ? false : checked;
	        } else {
	            item.children.forEach(function (element) {
	                if (element.checked) {
	                    result.hasCheckedChild = true;
	                }
	                var childStatus = _this._getChildrenChecked(element, element.checked, recursive);
	                result.isChecked = result.isChecked && childStatus.isChecked;
	                if (childStatus.hasCheckedChild) {
	                    result.hasCheckedChild = true;
	                }
	            });
	        }
	        return result;
	    };
	    TreeviewItem.defaultProps = {
	        isOpen: false
	    };
	    __decorate([autobind_1.autobind, __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], TreeviewItem.prototype, "_onItemHover", null);
	    __decorate([autobind_1.autobind, __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], TreeviewItem.prototype, "_onItemLeaveHover", null);
	    __decorate([autobind_1.autobind, __metadata("design:type", Function), __metadata("design:paramtypes", [Object, String, Boolean]), __metadata("design:returntype", void 0)], TreeviewItem.prototype, "_onItemSelect", null);
	    __decorate([autobind_1.autobind, __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", void 0)], TreeviewItem.prototype, "_onExpand", null);
	    __decorate([autobind_1.autobind, __metadata("design:type", Function), __metadata("design:paramtypes", [Object]), __metadata("design:returntype", void 0)], TreeviewItem.prototype, "_getChildrenId", null);
	    __decorate([autobind_1.autobind, __metadata("design:type", Function), __metadata("design:paramtypes", [Object, Boolean, Boolean]), __metadata("design:returntype", void 0)], TreeviewItem.prototype, "_getChildrenChecked", null);
	    return TreeviewItem;
	}(Common_1.CommonComponent);
	exports.TreeviewItem = TreeviewItem;

/***/ },

/***/ 1122:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(1123);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(504)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/index.js?outputStyle=expanded!./Treeview.scss", function() {
				var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/sass-loader/index.js?outputStyle=expanded!./Treeview.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 1123:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(503)();
	// imports
	
	
	// module
	exports.push([module.id, "* {\n  font-family: 'Segoe UI';\n  font-size: 14px;\n  color: #4D4D4F;\n}\n\n::-webkit-scrollbar {\n  width: 8px;\n  height: 8px;\n}\n\n/* Track */\n::-webkit-scrollbar-track {\n  border-radius: 10px;\n  background: #DADADB;\n  border: 2px solid transparent;\n  background-clip: content-box;\n}\n\n/* Handle */\n::-webkit-scrollbar-thumb {\n  border-radius: 10px;\n  background: #AEAEAF;\n}\n\n::-webkit-scrollbar-thumb:hover {\n  background: #4D4D4F;\n}\n\n.ReactVirtualized__Grid:focus, .ReactVirtualized__Collection:focus {\n  outline: none !important;\n}\n\n.treeview {\n  user-select: none;\n}\n\n.treeview .treeview-item {\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  height: 28px;\n}\n\n.treeview .treeview-item.selected {\n  color: orange;\n}\n\n.treeview .treeview-item .arrow-icon {\n  font-size: 12px;\n  margin-right: 2px;\n}\n\n.treeview .treeview-item .treeveiw-content {\n  padding: 2px 0;\n  display: flex;\n  align-items: center;\n}\n\n.treeview .treeview-item .treeveiw-content .checkbox {\n  height: 20px;\n}\n\n.treeview .treeview-item .treeveiw-content .checkbox .checkbox-label {\n  margin: 0;\n}\n\n.treeview .treeview-item .treeveiw-content .checkbox.partial-selected label:after {\n  content: '\\25FC';\n  color: #F79428;\n  font-size: 14px;\n  position: absolute;\n  left: 2px;\n  top: 0px;\n}\n\n.treeview .treeview-item .treeveiw-content .treeview-item__icons-container {\n  display: flex;\n  align-items: center;\n  margin-left: 20px;\n}\n\n.treeview .treeview-item .treeveiw-content .treeview-item__icons-container .treeview-item__icon {\n  margin-right: 8px;\n}\n\n.treeview .treeview-item .treeveiw-content .treeview-item__icons-container .treeview-item__icon .icon:hover {\n  color: #F79428;\n}\n\n.treeview .collapsed {\n  display: none;\n}\n\n.treeview .expanded {\n  display: block;\n  margin-left: 15px;\n}\n\n.treeview.treeview-with-checkbox .expanded {\n  margin-left: 20px;\n}\n\n.treeview.treeview-with-checkbox .treeview-item .arrow-icon {\n  margin-right: 3px;\n}\n\n.treeview.treeview-with-checkbox .treeview-item .treeveiw-content {\n  padding: 2px 2px;\n}\n\n.treeview.treeview-with-checkbox .treeview-item .treeveiw-content .checkbox .label {\n  padding: 0 0 0 20px;\n}\n", ""]);
	
	// exports


/***/ },

/***/ 1124:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	var React = __webpack_require__(328);
	var Icon_1 = __webpack_require__(518);
	var autobind_1 = __webpack_require__(546);
	var TreeviewItemHoverBtn = /** @class */function (_super) {
	    __extends(TreeviewItemHoverBtn, _super);
	    function TreeviewItemHoverBtn() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    TreeviewItemHoverBtn.prototype._onClick = function () {
	        this.props.onClick(this.props.id);
	    };
	    TreeviewItemHoverBtn.prototype.render = function () {
	        return React.createElement("div", { className: this.props.className }, React.createElement(Icon_1.Icon, { iconName: this.props.iconName, onClick: this._onClick }));
	    };
	    __decorate([autobind_1.autobind, __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], TreeviewItemHoverBtn.prototype, "_onClick", null);
	    return TreeviewItemHoverBtn;
	}(React.PureComponent);
	exports.TreeviewItemHoverBtn = TreeviewItemHoverBtn;

/***/ },

/***/ 1125:
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.elements = [{
	    id: 'A1', text: 'Option A1', hoverOverBtn: [{
	        iconName: 'icon-edit',
	        // tslint:disable-next-line:no-console
	        callback: function (id) {
	            return console.log(id);
	        }
	    }, {
	        iconName: 'icon-trash',
	        // tslint:disable-next-line:no-console
	        callback: function (id) {
	            return console.log(id);
	        }
	    }],
	    isOpen: true, checked: true, className: 'selected'
	}, { id: 'A2', text: 'Option A2' }, { id: 'A3', text: 'Option A3' }, { id: 'A4', text: 'Option A4' }, { id: 'B1', text: 'Option B1', parentId: 'A1', className: 'selected' }, { id: 'B2', text: 'Option B2', parentId: 'A1' }, { id: 'B3', text: 'Option B3', parentId: 'A1', checked: true }, { id: 'B4', text: 'Option B4', parentId: 'A1' }, { id: 'C1', text: 'Option C1', parentId: 'B1' }, { id: 'C2', text: 'Option C2', parentId: 'B1' }, { id: 'C3', text: 'Option C3', parentId: 'B1' }, { id: 'C4', text: 'Option C4', parentId: 'B1' }, { id: 'C5', text: 'Option C5', parentId: 'B1' }, { id: 'C6', text: 'Option C6', parentId: 'B1' }, { id: 'D1', text: 'Option D1', parentId: 'C1', isOpen: true }, { id: 'D2', text: 'Option D2', parentId: 'C1' }, { id: 'D3', text: 'Option D3', parentId: 'C1' }, { id: 'D4', text: 'Option D4', parentId: 'C1' }, { id: 'D5', text: 'Option D5', parentId: 'C1' }, { id: 'D6', text: 'Option D6', parentId: 'C1' }, { id: 'D7', text: 'Option D7', parentId: 'C1' }, { id: 'B11', text: 'Option B1', parentId: 'A2', checked: true }, { id: 'B21', text: 'Option B2', parentId: 'A2', checked: true }, { id: 'B31', text: 'Option B3', parentId: 'A2', checked: true }, { id: 'B41', text: 'Option B4', parentId: 'A2', checked: true }, { id: 'C11', text: 'Option C1', parentId: 'B2' }, { id: 'C21', text: 'Option C2', parentId: 'B2' }, { id: 'C31', text: 'Option C3', parentId: 'B2' }, { id: 'C41', text: 'Option C4', parentId: 'B2' }, { id: 'C51', text: 'Option C5', parentId: 'B2' }, { id: 'C61', text: 'Option C6', parentId: 'B2' }, { id: 'D11', text: 'Option D1', parentId: 'C2' }, { id: 'D21', text: 'Option D2', parentId: 'C2' }, { id: 'D31', text: 'Option D3', parentId: 'C2' }, { id: 'D41', text: 'Option D4', parentId: 'C2' }, { id: 'D51', text: 'Option D5', parentId: 'C2' }, { id: 'D61', text: 'Option D6', parentId: 'C2' }, { id: 'D71', text: 'Option D7', parentId: 'C2' }, { id: 'E1', text: 'Option E1', parentId: 'D1' }, { id: 'E2', text: 'Option E2', parentId: 'D1' }, { id: 'E3', text: 'Option E3', parentId: 'D1' }, { id: 'E4', text: 'Option E4', parentId: 'D1' }, { id: 'E5', text: 'Option E5', parentId: 'D1' }, { id: 'E6', text: 'Option E6', parentId: 'D1' }, { id: 'F1', text: 'Option F1', parentId: 'E1' }, { id: 'F2', text: 'Option F2', parentId: 'E1' }, { id: 'F3', text: 'Option F3', parentId: 'E1' }, { id: 'F4', text: 'Option F4', parentId: 'E1' }, { id: 'F5', text: 'Option F5', parentId: 'E1' }, { id: 'F6', text: 'Option F6', parentId: 'E1' }, { id: 'G1', text: 'Option G1', parentId: 'F1' }, { id: 'G2', text: 'Option G2', parentId: 'F1' }, { id: 'G3', text: 'Option G3', parentId: 'F1' }, { id: 'G4', text: 'Option G4', parentId: 'F1' }, { id: 'G5', text: 'Option G5', parentId: 'F1' }, { id: 'G6', text: 'Option G6', parentId: 'F1' }, { id: 'G7', text: 'Option G7', parentId: 'F1' }, { id: 'H1', text: 'Option H1', parentId: 'G1' }, { id: 'H2', text: 'Option H2', parentId: 'G1' }, { id: 'H3', text: 'Option H3', parentId: 'G1' }, { id: 'H4', text: 'Option H4', parentId: 'G1' }, { id: 'H5', text: 'Option H5', parentId: 'G1' }, { id: 'H6', text: 'Option H6', parentId: 'G1' }, { id: 'H7', text: 'Option H7', parentId: 'G1' }, { id: 'H8', text: 'Option H8', parentId: 'G1' }, { id: 'H11', text: 'Option H1', parentId: 'G2' }, { id: 'H21', text: 'Option H2', parentId: 'G2' }, { id: 'H31', text: 'Option H3', parentId: 'G2' }, { id: 'H41', text: 'Option H4', parentId: 'G2' }, { id: 'H51', text: 'Option H5', parentId: 'G2' }, { id: 'H61', text: 'Option H6', parentId: 'G2' }, { id: 'H71', text: 'Option H7', parentId: 'G2' }, { id: 'H81', text: 'Option H8', parentId: 'G2' }, { id: 'E11', text: 'Option E1', parentId: 'D21' }, { id: 'E21', text: 'Option E2', parentId: 'D21' }, { id: 'E31', text: 'Option E3', parentId: 'D21' }, { id: 'E41', text: 'Option E4', parentId: 'D21' }, { id: 'E51', text: 'Option E5', parentId: 'D21' }, { id: 'E61', text: 'Option E6', parentId: 'D21' }, { id: 'F11', text: 'Option F1', parentId: 'E21' }, { id: 'F21', text: 'Option F2', parentId: 'E21' }, { id: 'F31', text: 'Option F3', parentId: 'E21' }, { id: 'F41', text: 'Option F4', parentId: 'E21' }, { id: 'F51', text: 'Option F5', parentId: 'E21' }, { id: 'F61', text: 'Option F6', parentId: 'E21' }, { id: 'G11', text: 'Option G1', parentId: 'F21' }, { id: 'G21', text: 'Option G2', parentId: 'F21' }, { id: 'G31', text: 'Option G3', parentId: 'F21' }, { id: 'G41', text: 'Option G4', parentId: 'F21' }, { id: 'G51', text: 'Option G5', parentId: 'F2' }, { id: 'G61', text: 'Option G6', parentId: 'F2' }, { id: 'G71', text: 'Option G7', parentId: 'F2' }];

/***/ }

});
//# sourceMappingURL=Treeview.b3d14060d786be20b6e9.js.map