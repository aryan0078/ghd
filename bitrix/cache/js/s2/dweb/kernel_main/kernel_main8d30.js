; /* /bitrix/js/main/session.js?15048772383642*/
; /* /bitrix/js/main/session.js?15048772383642*/
; /* /bitrix/js/main/session.js?15048772383642*/
; /* /bitrix/js/main/session.js?15048772383642*/
; /* /bitrix/js/main/session.js?15048772383642*/
; /* /bitrix/js/main/session.js?15048772383642*/
; /* /bitrix/js/main/session.js?15048772383642*/
; /* /bitrix/js/main/session.js?15048772383642*/
; /* /bitrix/js/main/json/json2.min.js?15048772383467*/
; /* /bitrix/js/main/core/core_ls.js?150487723810430*/
; /* /bitrix/js/main/core/core_fx.js?150487723816888*/
; /* /bitrix/js/main/core/core_popup.js?150488080459295*/
; /* /bitrix/js/main/core/core_date.js?150488080453956*/
; /* /bitrix/js/main/core/core.js?1504880804121473*/
; /* /bitrix/js/main/core/core_ajax.js?150487723836424*/

; /* Start:"a:4:{s:4:"full";s:45:"/bitrix/js/main/core/core.js?1504880804121473";s:6:"source";s:28:"/bitrix/js/main/core/core.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
/**********************************************************************/
/*********** Bitrix JS Core library ver 0.9.0 beta ********************/
/**********************************************************************/

;(function(window){

if (!!window.BX && !!window.BX.extend)
	return;

var _bxtmp;
if (!!window.BX)
{
	_bxtmp = window.BX;
}

window.BX = function(node, bCache)
{
	if (BX.type.isNotEmptyString(node))
	{
		var ob;

		if (!!bCache && null != NODECACHE[node])
			ob = NODECACHE[node];
		ob = ob || document.getElementById(node);
		if (!!bCache)
			NODECACHE[node] = ob;

		return ob;
	}
	else if (BX.type.isDomNode(node))
		return node;
	else if (BX.type.isFunction(node))
		return BX.ready(node);

	return null;
};

BX.debugEnableFlag = true;

// language utility
BX.message = function(mess)
{
	if (BX.type.isString(mess))
	{
		if (typeof BX.message[mess] == "undefined")
		{
			BX.onCustomEvent("onBXMessageNotFound", [mess]);
			if (typeof BX.message[mess] == "undefined")
			{
				BX.debug("message undefined: " + mess);
				BX.message[mess] = "";
			}

		}

		return BX.message[mess];
	}
	else
	{
		for (var i in mess)
		{
			if (mess.hasOwnProperty(i))
			{
				BX.message[i] = mess[i];
			}
		}
		return true;
	}
};

if(!!_bxtmp)
{
	for(var i in _bxtmp)
	{
		if(_bxtmp.hasOwnProperty(i))
		{
			if(!BX[i])
			{
				BX[i]=_bxtmp[i];
			}
			else if(i=='message')
			{
				for(var j in _bxtmp[i])
				{
					if(_bxtmp[i].hasOwnProperty(j))
					{
						BX.message[j]=_bxtmp[i][j];
					}
				}
			}
		}
	}

	_bxtmp = null;
}

var

/* ready */
__readyHandler = null,
readyBound = false,
readyList = [],

/* list of registered proxy functions */
proxySalt = Math.random(),
proxyId = 1,
proxyList = [],

/* getElementById cache */
NODECACHE = {},

/* List of denied event handlers */
deniedEvents = [],

/* list of registered event handlers */
eventsList = [],

/* list of registered custom events */
customEvents = {},

/* list of external garbage collectors */
garbageCollectors = [],

/* list of loaded CSS files */
cssList = [],
cssInit = false,

/* list of loaded JS files */
jsList = [],
jsInit = false,


/* browser detection */
bSafari = navigator.userAgent.toLowerCase().indexOf('webkit') != -1,
bOpera = navigator.userAgent.toLowerCase().indexOf('opera') != -1,
bFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') != -1,
bChrome = navigator.userAgent.toLowerCase().indexOf('chrome') != -1,
bIE = document.attachEvent && !bOpera,

/* regexps */
r = {
	script: /<script([^>]*)>/ig,
	script_end: /<\/script>/ig,
	script_src: /src=["\']([^"\']+)["\']/i,
	script_type: /type=["\']([^"\']+)["\']/i,
	space: /\s+/,
	ltrim: /^[\s\r\n]+/g,
	rtrim: /[\s\r\n]+$/g,
	style: /<link.*?(rel="stylesheet"|type="text\/css")[^>]*>/i,
	style_href: /href=["\']([^"\']+)["\']/i
},

eventTypes = {
	click: 'MouseEvent',
	dblclick: 'MouseEvent',
	mousedown: 'MouseEvent',
	mousemove: 'MouseEvent',
	mouseout: 'MouseEvent',
	mouseover: 'MouseEvent',
	mouseup: 'MouseEvent',
	focus: 'MouseEvent',
	blur: 'MouseEvent'
},

lastWait = [],

CHECK_FORM_ELEMENTS = {tagName: /^INPUT|SELECT|TEXTAREA|BUTTON$/i},

PRELOADING = 1, PRELOADED = 2, LOADING = 3, LOADED = 4,
assets = {},
isAsync = null;

BX.MSLEFT = 1;
BX.MSMIDDLE = 2;
BX.MSRIGHT = 4;

BX.ext = function(ob)
{
	for (var i in ob)
	{
		if(ob.hasOwnProperty(i))
		{
			this[i] = ob[i];
		}
	}
};

/* OO emulation utility */
BX.extend = function(child, parent)
{
	var f = function() {};
	f.prototype = parent.prototype;

	child.prototype = new f();
	child.prototype.constructor = child;

	child.superclass = parent.prototype;
	if(parent.prototype.constructor == Object.prototype.constructor)
	{
		parent.prototype.constructor = parent;
	}
};

BX.namespace = function(namespace)
{
	var parts = namespace.split(".");
	var parent = BX;

	if (parts[0] === "BX")
	{
		parts = parts.slice(1);
	}

	for (var i = 0; i < parts.length; i++) {

		if (typeof parent[parts[i]] === "undefined")
		{
			parent[parts[i]] = {};
		}
		parent = parent[parts[i]];
	}

	return parent;
};

BX.debug = function()
{
	if (BX.debugStatus())
	{
		if (window.console && window.console.log)
			window.console.log('BX.debug: ', arguments.length > 0 ? arguments : arguments[0]);
		if (window.console && window.console.trace)
			console.trace();
	}
};

BX.debugEnable = function(flag)
{
	flag = typeof (flag) == 'boolean'? flag: true;
	BX.debugEnableFlag = flag;
};

BX.debugStatus = function()
{
	return BX.debugEnableFlag || true;
};

BX.is_subclass_of = function(ob, parent_class)
{
	if (ob instanceof parent_class)
		return true;

	if (parent_class.superclass)
		return BX.is_subclass_of(ob, parent_class.superclass);

	return false;
};

BX.clearNodeCache = function()
{
	NODECACHE = {};
	return false;
};

BX.bitrix_sessid = function() {return BX.message("bitrix_sessid"); };

/* DOM manipulation */
/**
 * Creates the specified HTML element
 * @param {String} tag
 * @param {Object} [data]
 * @param {Document} [context]
 * @returns {Element}
 */
BX.create = function(tag, data, context)
{
	context = context || document;

	if (null == data && typeof tag == 'object' && tag.constructor !== String)
	{
		data = tag; tag = tag.tag;
	}

	var elem;
	if (BX.browser.IsIE() && !BX.browser.IsIE9() && null != data && null != data.props && (data.props.name || data.props.id))
	{
		elem = context.createElement('<' + tag + (data.props.name ? ' name="' + data.props.name + '"' : '') + (data.props.id ? ' id="' + data.props.id + '"' : '') + '>');
	}
	else
	{
		elem = context.createElement(tag);
	}

	return data ? BX.adjust(elem, data) : elem;
};

BX.adjust = function(elem, data)
{
	var j,len;

	if (!elem.nodeType)
		return null;

	if (elem.nodeType == 9)
		elem = elem.body;

	if (data.attrs)
	{
		for (j in data.attrs)
		{
			if(data.attrs.hasOwnProperty(j))
			{
				if (j == 'class' || j == 'className')
					elem.className = data.attrs[j];
				else if (j == 'for')
					elem.htmlFor = data.attrs[j];
				else if(data.attrs[j] == "")
					elem.removeAttribute(j);
				else
					elem.setAttribute(j, data.attrs[j]);
			}
		}
	}

	if (data.style)
	{
		for (j in data.style)
		{
			if(data.style.hasOwnProperty(j))
			{
				elem.style[j] = data.style[j];
			}
		}
	}

	if (data.props)
	{
		for (j in data.props)
		{
			if(data.props.hasOwnProperty(j))
			{
				elem[j] = data.props[j];
			}
		}
	}

	if (data.events)
	{
		for (j in data.events)
		{
			if(data.events.hasOwnProperty(j))
			{
				BX.bind(elem, j, data.events[j]);
			}
		}
	}

	if (data.dataset)
	{
		for (j in data.dataset)
		{
			if(data.dataset.hasOwnProperty(j))
			{
				elem.dataset[j] = data.dataset[j]
			}
		}
	}

	if (data.children && data.children.length > 0)
	{
		for (j=0,len=data.children.length; j<len; j++)
		{
			if (BX.type.isNotEmptyString(data.children[j]))
				elem.innerHTML += data.children[j];
			else if (BX.type.isElementNode(data.children[j]))
				elem.appendChild(data.children[j]);
		}
	}
	else if (data.text)
	{
		BX.cleanNode(elem);
		elem.appendChild((elem.ownerDocument || document).createTextNode(data.text));
	}
	else if (typeof data.html !== 'undefined')
	{
		elem.innerHTML = data.html;
	}

	return elem;
};

BX.remove = function(ob)
{
	if (ob && null != ob.parentNode)
		ob.parentNode.removeChild(ob);
	ob = null;
	return null;
};

BX.cleanNode = function(node, bSuicide)
{
	node = BX(node);
	bSuicide = !!bSuicide;

	if (node && node.childNodes)
	{
		while(node.childNodes.length > 0)
			node.removeChild(node.firstChild);
	}

	if (node && bSuicide)
	{
		node = BX.remove(node);
	}

	return node;
};

BX.html = function(node, html, parameters)
{
	if(typeof html == 'undefined')
		return node.innerHTML;

	if(typeof parameters == 'undefined')
		parameters = {};

	html = BX.processHTML(html.toString());

	var assets = [];
	var inlineJS = [];

	if(typeof html.STYLE != 'undefined' && html.STYLE.length > 0)
	{
		for(var k in html.STYLE)
			assets.push(html.STYLE[k]);
	}

	if(typeof html.SCRIPT != 'undefined' && html.SCRIPT.length > 0)
	{
		for(var k in html.SCRIPT)
		{
			if(html.SCRIPT[k].isInternal)
				inlineJS.push(html.SCRIPT[k].JS);
			else
				assets.push(html.SCRIPT[k].JS);
		}
	}

	if(parameters.htmlFirst && typeof html.HTML != 'undefined' && node)
	{
		node.innerHTML = html.HTML;
	}

	var p = new BX.Promise();

	var afterAsstes = function(){
		if(!parameters.htmlFirst && typeof html.HTML != 'undefined' && node)
		{
			node.innerHTML = html.HTML;
		}

		for(var k in inlineJS)
		{
			BX.evalGlobal(inlineJS[k]);
		}

		if(BX.type.isFunction(parameters.callback))
		{
			parameters.callback();
		}

		p.fulfill();
	};

	if(assets.length > 0)
	{
		BX.load(assets, afterAsstes);
	}
	else
	{
		afterAsstes();
	}

	return p;
};

BX.insertAfter = function(node, dstNode)
{
	dstNode.parentNode.insertBefore(node, dstNode.nextSibling);
};

BX.prepend = function(node, dstNode)
{
	dstNode.insertBefore(node, dstNode.firstChild);
};

BX.append = function(node, dstNode)
{
	dstNode.appendChild(node);
};

BX.addClass = function(ob, value)
{
	var classNames;
	ob = BX(ob);

	value = BX.util.trim(value);
	if (value == '')
		return ob;

	if (ob)
	{
		if (!ob.className)
		{
			ob.className = value
		}
		else if (!!ob.classList && value.indexOf(' ') < 0)
		{
			ob.classList.add(value);
		}
		else
		{
			classNames = (value || "").split(r.space);

			var className = " " + ob.className + " ";
			for (var j = 0, cl = classNames.length; j < cl; j++)
			{
				if (className.indexOf(" " + classNames[j] + " ") < 0)
				{
					ob.className += " " + classNames[j];
				}
			}
		}
	}

	return ob;
};

BX.removeClass = function(ob, value)
{
	ob = BX(ob);
	if (ob)
	{
		if (ob.className && !!value)
		{
			if (BX.type.isString(value))
			{
				if (!!ob.classList && value.indexOf(' ') < 0)
				{
					ob.classList.remove(value);
				}
				else
				{
					var classNames = value.split(r.space), className = " " + ob.className + " ";
					for (var j = 0, cl = classNames.length; j < cl; j++)
					{
						className = className.replace(" " + classNames[j] + " ", " ");
					}

					ob.className = BX.util.trim(className);
				}
			}
			else
			{
				ob.className = "";
			}
		}
	}

	return ob;
};

BX.toggleClass = function(ob, value)
{
	var className;
	ob = BX(ob);

	if (BX.type.isArray(value))
	{
		className = ' ' + ob.className + ' ';
		for (var j = 0, len = value.length; j < len; j++)
		{
			if (BX.hasClass(ob, value[j]))
			{
				className = (' ' + className + ' ').replace(' ' + value[j] + ' ', ' ');
				className += ' ' + value[j >= len-1 ? 0 : j+1];

				j--;
				break;
			}
		}

		if (j == len)
			ob.className += ' ' + value[0];
		else
			ob.className = className;

		ob.className = BX.util.trim(ob.className);
	}
	else if (BX.type.isNotEmptyString(value))
	{
		if (!!ob.classList)
		{
			ob.classList.toggle(value);
		}
		else
		{
			className = ob.className;
			if (BX.hasClass(ob, value))
			{
				className = (' ' + className + ' ').replace(' ' + value + ' ', ' ');
			}
			else
			{
				className += ' ' + value;
			}

			ob.className = BX.util.trim(className);
		}
	}

	return ob;
};

BX.hasClass = function(el, className)
{
	el = BX(el);
	if (!el || !BX.type.isDomNode(el))
	{
		BX.debug(el);
		return false;
	}

	if (!el.className || !className)
	{
		return false;
	}

	if (!!el.classList && !!className && className.indexOf(' ') < 0)
	{
		return el.classList.contains(BX.util.trim(className));
	}
	else
		return ((" " + el.className + " ").indexOf(" " + className + " ")) >= 0;
};

BX.setOpacity = function(ob, percentage)
{
	if (ob.style.filter != null)
	{
		//IE
		ob.style.zoom = "100%";

		if (percentage == 100)
		{
			ob.style.filter = "";
		}
		else
		{
			ob.style.filter = 'alpha(opacity=' + percentage.toString() + ')';
		}
	}
	else if (ob.style.opacity != null)
	{
		// W3C
		ob.style.opacity = (percentage / 100).toString();
	}
	else if (ob.style.MozOpacity != null)
	{
		// Mozilla
		ob.style.MozOpacity = (percentage / 100).toString();
	}
};

BX.hoverEvents = function(el)
{
	if (el)
		return BX.adjust(el, {events: BX.hoverEvents()});
	else
		return {mouseover: BX.hoverEventsHover, mouseout: BX.hoverEventsHout};
};

BX.hoverEventsHover = function(){BX.addClass(this,'bx-hover');this.BXHOVER=true;};
BX.hoverEventsHout = function(){BX.removeClass(this,'bx-hover');this.BXHOVER=false;};

BX.focusEvents = function(el)
{
	if (el)
		return BX.adjust(el, {events: BX.focusEvents()});
	else
		return {mouseover: BX.focusEventsFocus, mouseout: BX.focusEventsBlur};
};

BX.focusEventsFocus = function(){BX.addClass(this,'bx-focus');this.BXFOCUS=true;};
BX.focusEventsBlur = function(){BX.removeClass(this,'bx-focus');this.BXFOCUS=false;};

BX.setUnselectable = function(node)
{
	node.style.userSelect = node.style.MozUserSelect = node.style.WebkitUserSelect = node.style.KhtmlUserSelect = node.style = 'none';
	node.setAttribute('unSelectable', 'on');
};

BX.setSelectable = function(node)
{
	node.style.userSelect = node.style.MozUserSelect = node.style.WebkitUserSelect = node.style.KhtmlUserSelect = node.style = '';
	node.removeAttribute('unSelectable');
};

BX.styleIEPropertyName = function(name)
{
	if (name == 'float')
		name = BX.browser.IsIE() ? 'styleFloat' : 'cssFloat';
	else
	{
		var res = BX.browser.isPropertySupported(name);
		if (res)
		{
			name = res;
		}
		else
		{
			var reg = /(\-([a-z]){1})/g;
			if (reg.test(name))
			{
				name = name.replace(reg, function () {return arguments[2].toUpperCase();});
			}
		}
	}
	return name;
};

/* CSS-notation should be used here */
BX.style = function(el, property, value)
{
	if (!BX.type.isElementNode(el))
		return null;

	if (value == null)
	{
		var res;

		if(el.currentStyle)
			res = el.currentStyle[BX.styleIEPropertyName(property)];
		else if(window.getComputedStyle)
		{
			var q = BX.browser.isPropertySupported(property, true);
			if (!!q)
				property = q;

			res = BX.GetContext(el).getComputedStyle(el, null).getPropertyValue(property);
		}

		if(!res)
			res = '';
		return res;
	}
	else
	{
		el.style[BX.styleIEPropertyName(property)] = value;
		return el;
	}
};

BX.focus = function(el)
{
	try
	{
		el.focus();
		return true;
	}
	catch (e)
	{
		return false;
	}
};

BX.firstChild = function(el)
{
	var e = el.firstChild;
	while (e && !BX.type.isElementNode(e))
	{
		e = e.nextSibling;
	}

	return e;
};

BX.lastChild = function(el)
{
	var e = el.lastChild;
	while (e && !BX.type.isElementNode(e))
	{
		e = e.previousSibling;
	}

	return e;
};

BX.previousSibling = function(el)
{
	var e = el.previousSibling;
	while (e && !BX.type.isElementNode(e))
	{
		e = e.previousSibling;
	}

	return e;
};

BX.nextSibling = function(el)
{
	var e = el.nextSibling;
	while (e && !BX.type.isElementNode(e))
	{
		e = e.nextSibling;
	}

	return e;
};

/*
	params: {
		obj : html node
		className : className value
		recursive : used only for older browsers to optimize the tree traversal, in new browsers the search is always recursively, default - true
	}

	Search all nodes with className
*/
BX.findChildrenByClassName = function(obj, className, recursive)
{
	if(!obj || !obj.childNodes) return null;

	var result = [];
	if (typeof(obj.getElementsByClassName) == 'undefined')
	{
		recursive = recursive !== false;
		result = BX.findChildren(obj, {className : className}, recursive);
	}
	else
	{
		var col = obj.getElementsByClassName(className);
		for (i=0,l=col.length;i<l;i++)
		{
			result[i] = col[i];
		}
	}
	return result;
};

/*
	params: {
		obj : html node
		className : className value
		recursive : used only for older browsers to optimize the tree traversal, in new browsers the search is always recursively, default - true
	}

	Search first node with className
*/
BX.findChildByClassName = function(obj, className, recursive)
{
	if(!obj || !obj.childNodes) return null;

	var result = null;
	if (typeof(obj.getElementsByClassName) == 'undefined')
	{
		recursive = recursive !== false;
		result = BX.findChild(obj, {className : className}, recursive);
	}
	else
	{
		var col = obj.getElementsByClassName(className);
		if (col && typeof(col[0]) != 'undefined')
		{
			result = col[0];
		}
		else
		{
			result = null;
		}
	}
	return result;
};

/*
	params: {
		tagName|tag : 'tagName',
		className|class : 'className',
		attribute : {attribute : value, attribute : value} | attribute | [attribute, attribute....],
		property : {prop: value, prop: value} | prop | [prop, prop]
	}

	all values can be RegExps or strings
*/
BX.findChildren = function(obj, params, recursive)
{
	return BX.findChild(obj, params, recursive, true);
};

BX.findChild = function(obj, params, recursive, get_all)
{
	if(!obj || !obj.childNodes) return null;

	recursive = !!recursive; get_all = !!get_all;

	var n = obj.childNodes.length, result = [];

	for (var j=0; j<n; j++)
	{
		var child = obj.childNodes[j];

		if (_checkNode(child, params))
		{
			if (get_all)
				result.push(child);
			else
				return child;
		}

		if(recursive == true)
		{
			var res = BX.findChild(child, params, recursive, get_all);
			if (res)
			{
				if (get_all)
					result = BX.util.array_merge(result, res);
				else
					return res;
			}
		}
	}

	if (get_all || result.length > 0)
		return result;
	else
		return null;
};

BX.findParent = function(obj, params, maxParent)
{
	if(!obj)
		return null;

	var o = obj;
	while(o.parentNode)
	{
		var parent = o.parentNode;

		if (_checkNode(parent, params))
			return parent;

		o = parent;

		if (!!maxParent &&
			(BX.type.isFunction(maxParent)
				|| typeof maxParent == 'object'))
		{
			if (BX.type.isElementNode(maxParent))
			{
				if (o == maxParent)
					break;
			}
			else
			{
				if (_checkNode(o, maxParent))
					break;
			}
		}
	}
	return null;
};

BX.findNextSibling = function(obj, params)
{
	if(!obj)
		return null;
	var o = obj;
	while(o.nextSibling)
	{
		var sibling = o.nextSibling;
		if (_checkNode(sibling, params))
			return sibling;
		o = sibling;
	}
	return null;
};

BX.findPreviousSibling = function(obj, params)
{
	if(!obj)
		return null;

	var o = obj;
	while(o.previousSibling)
	{
		var sibling = o.previousSibling;
		if(_checkNode(sibling, params))
			return sibling;
		o = sibling;
	}
	return null;
};

BX.checkNode = function(obj, params)
{
	return _checkNode(obj, params);
};

BX.findFormElements = function(form)
{
	if (BX.type.isString(form))
		form = document.forms[form]||BX(form);

	var res = [];

	if (BX.type.isElementNode(form))
	{
		if (form.tagName.toUpperCase() == 'FORM')
		{
			res = form.elements;
		}
		else
		{
			res = BX.findChildren(form, CHECK_FORM_ELEMENTS, true);
		}
	}

	return res;
};

BX.isParentForNode = function(whichNode, forNode)
{

	if(!BX.type.isDomNode(whichNode) || !BX.type.isDomNode(forNode))
		return false;

	while(true){

		if(whichNode == forNode)
			return true;

		if(forNode && forNode.parentNode)
			forNode = forNode.parentNode;
		else
			break;
	}

	return false;
};

BX.clone = function(obj, bCopyObj)
{
	var _obj, i, l;
	if (bCopyObj !== false)
		bCopyObj = true;

	if (obj === null)
		return null;

	if (BX.type.isDomNode(obj))
	{
		_obj = obj.cloneNode(bCopyObj);
	}
	else if (typeof obj == 'object')
	{
		if (BX.type.isArray(obj))
		{
			_obj = [];
			for (i=0,l=obj.length;i<l;i++)
			{
				if (typeof obj[i] == "object" && bCopyObj)
					_obj[i] = BX.clone(obj[i], bCopyObj);
				else
					_obj[i] = obj[i];
			}
		}
		else
		{
			_obj =  {};
			if (obj.constructor)
			{
				if (BX.type.isDate(obj))
					_obj = new Date(obj);
				else
					_obj = new obj.constructor();
			}

			for (i in obj)
			{
				if (typeof obj[i] == "object" && bCopyObj)
					_obj[i] = BX.clone(obj[i], bCopyObj);
				else
					_obj[i] = obj[i];
			}
		}

	}
	else
	{
		_obj = obj;
	}

	return _obj;
};

BX.getCaretPosition = function(node)
{
	var pos = 0;

	if(node.selectionStart || node.selectionStart == 0)
	{
		pos = node.selectionStart;
	}
	else if(document.selection)
	{
		node.focus();
		var selection = document.selection.createRange();
		selection.moveStart('character', -node.value.length);
		pos = selection.text.length;
	}

	return (pos);
};

BX.setCaretPosition = function(node, pos)
{
	if(node.setSelectionRange)
	{
		node.focus();
		node.setSelectionRange(pos, pos);
	}
	else if(node.createTextRange)
	{
		var range = node.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
};

// access private. use BX.mergeEx instead.
// todo: refactor BX.merge, make it work through BX.mergeEx
BX.merge = function(){
	var arg = Array.prototype.slice.call(arguments);

	if(arg.length < 2)
		return {};

	var result = arg.shift();

	for(var i = 0; i < arg.length; i++)
	{
		for(var k in arg[i]){

			if(typeof arg[i] == 'undefined' || arg[i] == null)
				continue;

			if(arg[i].hasOwnProperty(k)){

				if(typeof arg[i][k] == 'undefined' || arg[i][k] == null)
					continue;

				if(typeof arg[i][k] == 'object' && !BX.type.isDomNode(arg[i][k]) && (typeof arg[i][k]['isUIWidget'] == 'undefined')){

					// go deeper

					var isArray = 'length' in arg[i][k];

					if(typeof result[k] != 'object')
						result[k] = isArray ? [] : {};

					if(isArray)
						BX.util.array_merge(result[k], arg[i][k]);
					else
						BX.merge(result[k], arg[i][k]);

				}else
					result[k] = arg[i][k];
			}
		}
	}

	return result;
};

BX.mergeEx = function()
{
	var arg = Array.prototype.slice.call(arguments);
	if(arg.length < 2)
	{
		return {};
	}

	var result = arg.shift();
	for (var i = 0; i < arg.length; i++)
	{
		for (var k in arg[i])
		{
			if (typeof arg[i] == "undefined" || arg[i] == null || !arg[i].hasOwnProperty(k))
			{
				continue;
			}

			if (BX.type.isPlainObject(arg[i][k]) && BX.type.isPlainObject(result[k]))
			{
				BX.mergeEx(result[k], arg[i][k]);
			}
			else
			{
				result[k] = BX.type.isPlainObject(arg[i][k]) ? BX.clone(arg[i][k]) : arg[i][k];
			}
		}
	}

	return result;
};

/* events */
BX.bind = function(el, evname, func)
{
	if (!el)
	{
		return;
	}

	if (evname === 'mousewheel')
	{
		BX.bind(el, 'DOMMouseScroll', func);
	}
	else if (evname === 'transitionend')
	{
		BX.bind(el, 'webkitTransitionEnd', func);
		BX.bind(el, 'msTransitionEnd', func);
		BX.bind(el, 'oTransitionEnd', func);
		// IE8-9 doesn't support this feature!
	}
	else if (evname === 'bxchange')
	{
		BX.bind(el, "change", func);
		BX.bind(el, "cut", func);
		BX.bind(el, "paste", func);
		BX.bind(el, "drop", func);
		BX.bind(el, "keyup", func);

		return;
	}
	else if (evname === 'fullscreenchange')
	{
		if (document.cancelFullScreen)
			BX.bind(el, "fullscreenchange", func);
		else if (document.mozCancelFullScreen)
			BX.bind(el, "mozfullscreenchange", func);
		else if (document.webkitCancelFullScreen)
			BX.bind(el, "webkitfullscreenchange", func);
	}

	if (el.addEventListener) // Gecko / W3C
	{
		el.addEventListener(evname, func, false);
	}
	else if (el.attachEvent) // IE
	{
		el.attachEvent("on" + evname, BX.proxy(func, el));
	}
	else
	{
		try
		{
			el["on" + evname] = func;
		}
		catch(e)
		{
			BX.debug(e)
		}
	}

	eventsList[eventsList.length] = {'element': el, 'event': evname, 'fn': func};
};

BX.unbind = function(el, evname, func)
{
	if (!el)
	{
		return;
	}

	if (evname === 'mousewheel')
	{
		BX.unbind(el, 'DOMMouseScroll', func);
	}
	else if (evname === 'transitionend')
	{
		BX.unbind(el, 'webkitTransitionEnd', func);
		BX.unbind(el, 'msTransitionEnd', func);
		BX.unbind(el, 'oTransitionEnd', func);
	}
	else if (evname === 'bxchange')
	{
		BX.unbind(el, "change", func);
		BX.unbind(el, "cut", func);
		BX.unbind(el, "paste", func);
		BX.unbind(el, "drop", func);
		BX.unbind(el, "keyup", func);

		return;
	}

	if(el.removeEventListener) // Gecko / W3C
	{
		el.removeEventListener(evname, func, false);
	}
	else if(el.detachEvent) // IE
	{
		el.detachEvent("on" + evname, BX.proxy(func, el));
	}
	else
	{
		el["on" + evname] = null;
	}
};

BX.getEventButton = function(e)
{
	e = e || window.event;

	var flags = 0;

	if (typeof e.which != 'undefined')
	{
		switch (e.which)
		{
			case 1: flags = flags|BX.MSLEFT; break;
			case 2: flags = flags|BX.MSMIDDLE; break;
			case 3: flags = flags|BX.MSRIGHT; break;
		}
	}
	else if (typeof e.button != 'undefined')
	{
		flags = event.button;
	}

	return flags || BX.MSLEFT;
};

BX.unbindAll = function(el)
{
	if (!el)
		return;

	for (var i=0,len=eventsList.length; i<len; i++)
	{
		try
		{
			if (eventsList[i] && (null==el || el==eventsList[i].element))
			{
				BX.unbind(eventsList[i].element, eventsList[i].event, eventsList[i].fn);
				eventsList[i] = null;
			}
		}
		catch(e){}
	}

	if (null==el)
	{
		eventsList = [];
	}
};

var captured_events = null, _bind = null;
BX.CaptureEvents = function(el_c, evname_c)
{
	if (_bind)
		return;

	_bind = BX.bind;
	captured_events = [];

	BX.bind = function(el, evname, func)
	{
		if (el === el_c && evname === evname_c)
			captured_events.push(func);

		_bind.apply(this, arguments);
	}
};

BX.CaptureEventsGet = function()
{
	if (_bind)
	{
		BX.bind = _bind;

		var captured = captured_events;

		_bind = null;
		captured_events = null;
		return captured;
	}
	return null;
};

// Don't even try to use it for submit event!
BX.fireEvent = function(ob,ev)
{
	var result = false, e = null;
	if (BX.type.isDomNode(ob))
	{
		result = true;
		if (document.createEventObject)
		{
			// IE
			if (eventTypes[ev] != 'MouseEvent')
			{
				e = document.createEventObject();
				e.type = ev;
				result = ob.fireEvent('on' + ev, e);
			}

			if (ob[ev])
			{
				ob[ev]();
			}
		}
		else
		{
			// non-IE
			e = null;

			switch (eventTypes[ev])
			{
				case 'MouseEvent':
					e = document.createEvent('MouseEvent');
					try
					{
						e.initMouseEvent(ev, true, true, top, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, null);
					}
					catch (initException)
					{
						e.initMouseEvent(ev, true, true, window, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, null);
					}

				break;
				default:
					e = document.createEvent('Event');
					e.initEvent(ev, true, true);
			}

			result = ob.dispatchEvent(e);
		}
	}

	return result;
};

BX.getWheelData = function(e)
{
	e = e || window.event;
	e.wheelData = e.detail ? e.detail * -1 : e.wheelDelta / 40;
	return e.wheelData;
};

BX.proxy_context = null;

BX.delegate = function (func, thisObject)
{
	if (!func || !thisObject)
		return func;

	return function() {
		var cur = BX.proxy_context;
		BX.proxy_context = this;
		var res = func.apply(thisObject, arguments);
		BX.proxy_context = cur;
		return res;
	}
};

BX.delegateLater = function (func_name, thisObject, contextObject)
{
	return function()
	{
		if (thisObject[func_name])
		{
			var cur = BX.proxy_context;
			BX.proxy_context = this;
			var res = thisObject[func_name].apply(contextObject||thisObject, arguments);
			BX.proxy_context = cur;
			return res;
		}
		return null;
	}
};

BX._initObjectProxy = function(thisObject)
{
	if (typeof thisObject['__proxy_id_' + proxySalt] == 'undefined')
	{
		thisObject['__proxy_id_' + proxySalt] = proxyList.length;
		proxyList[thisObject['__proxy_id_' + proxySalt]] = {};
	}
};

BX.proxy = function(func, thisObject)
{
	if (!func || !thisObject)
		return func;

	BX._initObjectProxy(thisObject);

	if (typeof func['__proxy_id_' + proxySalt] == 'undefined')
		func['__proxy_id_' + proxySalt] = proxyId++;

	if (!proxyList[thisObject['__proxy_id_' + proxySalt]][func['__proxy_id_' + proxySalt]])
		proxyList[thisObject['__proxy_id_' + proxySalt]][func['__proxy_id_' + proxySalt]] = BX.delegate(func, thisObject);

	return proxyList[thisObject['__proxy_id_' + proxySalt]][func['__proxy_id_' + proxySalt]];
};

BX.defer = function(func, thisObject)
{
	if (!!thisObject)
		return BX.defer_proxy(func, thisObject);
	else
		return function() {
			var arg = arguments;
			setTimeout(function(){func.apply(this,arg)}, 10);
		};
};

BX.defer_proxy = function(func, thisObject)
{
	if (!func || !thisObject)
		return func;

	BX.proxy(func, thisObject);

	this._initObjectProxy(thisObject);

	if (typeof func['__defer_id_' + proxySalt] == 'undefined')
		func['__defer_id_' + proxySalt] = proxyId++;

	if (!proxyList[thisObject['__proxy_id_' + proxySalt]][func['__defer_id_' + proxySalt]])
	{
		proxyList[thisObject['__proxy_id_' + proxySalt]][func['__defer_id_' + proxySalt]] = BX.defer(BX.delegate(func, thisObject));
	}

	return proxyList[thisObject['__proxy_id_' + proxySalt]][func['__defer_id_' + proxySalt]];
};

BX.once = function(el, evname, func)
{
	if (typeof func['__once_id_' + evname + '_' + proxySalt] == 'undefined')
	{
		func['__once_id_' + evname + '_' + proxySalt] = proxyId++;
	}

	this._initObjectProxy(el);

	if (!proxyList[el['__proxy_id_' + proxySalt]][func['__once_id_' + evname + '_' + proxySalt]])
	{
		var g = function()
		{
			BX.unbind(el, evname, g);
			func.apply(this, arguments);
		};

		proxyList[el['__proxy_id_' + proxySalt]][func['__once_id_' + evname + '_' + proxySalt]] = g;
	}

	return proxyList[el['__proxy_id_' + proxySalt]][func['__once_id_' + evname + '_' + proxySalt]];
};

BX.bindDelegate = function (elem, eventName, isTarget, handler)
{
	var h = BX.delegateEvent(isTarget, handler);
	BX.bind(elem, eventName, h);
	return h;
};

BX.delegateEvent = function(isTarget, handler)
{
	return function(e)
	{
		e = e || window.event;
		var target = e.target || e.srcElement;

		while (target != this)
		{
			if (_checkNode(target, isTarget))
			{
				return handler.call(target, e);
			}
			if (target && target.parentNode)
				target = target.parentNode;
			else
				break;
		}
		return null;
	}
};

BX.False = function() {return false;};
BX.DoNothing = function() {};

// TODO: also check event handlers set via BX.bind()
BX.denyEvent = function(el, ev)
{
	deniedEvents.push([el, ev, el['on' + ev]]);
	el['on' + ev] = BX.DoNothing;
};

BX.allowEvent = function(el, ev)
{
	for(var i=0, len=deniedEvents.length; i<len; i++)
	{
		if (deniedEvents[i][0] == el && deniedEvents[i][1] == ev)
		{
			el['on' + ev] = deniedEvents[i][2];
			BX.util.deleteFromArray(deniedEvents, i);
			return;
		}
	}
};

BX.fixEventPageXY = function(event)
{
	BX.fixEventPageX(event);
	BX.fixEventPageY(event);
	return event;
};

BX.fixEventPageX = function(event)
{
	if (event.pageX == null && event.clientX != null)
	{
		event.pageX =
			event.clientX +
			(document.documentElement && document.documentElement.scrollLeft || document.body && document.body.scrollLeft || 0) -
			(document.documentElement.clientLeft || 0);
	}

	return event;
};

BX.fixEventPageY = function(event)
{
	if (event.pageY == null && event.clientY != null)
	{
		event.pageY =
			event.clientY +
			(document.documentElement && document.documentElement.scrollTop || document.body && document.body.scrollTop || 0) -
			(document.documentElement.clientTop || 0);
	}

	return event;
};

/**
 * @deprecated
 * @see e.preventDefault()
 */
BX.PreventDefault = function(e)
{
	if(!e) e = window.event;
	if(e.stopPropagation)
	{
		e.preventDefault();
		e.stopPropagation();
	}
	else
	{
		e.cancelBubble = true;
		e.returnValue = false;
	}
	return false;
};

BX.eventReturnFalse = function(e)
{
	e=e||window.event;
	if (e && e.preventDefault) e.preventDefault();
	else e.returnValue = false;
	return false;
};

BX.eventCancelBubble = function(e)
{
	e=e||window.event;
	if(e && e.stopPropagation)
		e.stopPropagation();
	else
		e.cancelBubble = true;
};

/* custom events */
/*
	BX.addCustomEvent(eventObject, eventName, eventHandler) - set custom event handler for particular object
	BX.addCustomEvent(eventName, eventHandler) - set custom event handler for all objects
*/
BX.addCustomEvent = function(eventObject, eventName, eventHandler)
{
	/* shift parameters for short version */
	if (BX.type.isString(eventObject))
	{
		eventHandler = eventName;
		eventName = eventObject;
		eventObject = window;
	}

	eventName = eventName.toUpperCase();

	if (!customEvents[eventName])
		customEvents[eventName] = [];

	customEvents[eventName].push(
		{
			handler: eventHandler,
			obj: eventObject
		}
	);
};

BX.removeCustomEvent = function(eventObject, eventName, eventHandler)
{
	/* shift parameters for short version */
	if (BX.type.isString(eventObject))
	{
		eventHandler = eventName;
		eventName = eventObject;
		eventObject = window;
	}

	eventName = eventName.toUpperCase();

	if (!customEvents[eventName])
		return;

	for (var i = 0, l = customEvents[eventName].length; i < l; i++)
	{
		if (!customEvents[eventName][i])
			continue;
		if (customEvents[eventName][i].handler == eventHandler && customEvents[eventName][i].obj == eventObject)
		{
			delete customEvents[eventName][i];
			return;
		}
	}
};

// Warning! Don't use secureParams with DOM nodes in arEventParams
BX.onCustomEvent = function(eventObject, eventName, arEventParams, secureParams)
{
	/* shift parameters for short version */
	if (BX.type.isString(eventObject))
	{
		secureParams = arEventParams;
		arEventParams = eventName;
		eventName = eventObject;
		eventObject = window;
	}

	eventName = eventName.toUpperCase();

	if (!customEvents[eventName])
		return;

	if (!arEventParams)
		arEventParams = [];

	var h;
	for (var i = 0, l = customEvents[eventName].length; i < l; i++)
	{
		h = customEvents[eventName][i];
		if (!h || !h.handler)
			continue;

		if (h.obj == window || /*eventObject == window || */h.obj == eventObject) //- only global event handlers will be called
		{
			h.handler.apply(eventObject, !!secureParams ? BX.clone(arEventParams) : arEventParams);
		}
	}
};

BX.bindDebouncedChange = function(node, fn, fnInstant, timeout, ctx)
{
	ctx = ctx || window;
	timeout = timeout || 300;

	var dataTag = 'bx-dc-previous-value';
	BX.data(node, dataTag, node.value);

	var act = function(fn, val){

		var pVal = BX.data(node, dataTag);

		if(typeof pVal == 'undefined' || pVal != val){
			if(typeof ctx != 'object')
				fn(val);
			else
				fn.apply(ctx, [val]);
		}
	};

	var actD = BX.debounce(function(){
		var val = node.value;
		act(fn, val);
		BX.data(node, dataTag, val);
	}, timeout);

	BX.bind(node, 'keyup', actD);
	BX.bind(node, 'change', actD);
	BX.bind(node, 'input', actD);

	if(BX.type.isFunction(fnInstant)){

		var actI = function(){
			act(fnInstant, node.value);
		};

		BX.bind(node, 'keyup', actI);
		BX.bind(node, 'change', actI);
		BX.bind(node, 'input', actI);
	}
};

BX.parseJSON = function(data, context)
{
	var result = null;
	if (BX.type.isString(data))
	{
		try {
			if (data.indexOf("\n") >= 0)
				eval('result = ' + data);
			else
				result = (new Function("return " + data))();
		} catch(e) {
			BX.onCustomEvent(context, 'onParseJSONFailure', [data, context])
		}
	}
	else if(BX.type.isPlainObject(data))
	{
		return data;
	}

	return result;
};

/* ready */
BX.isReady = false;
BX.ready = function(handler)
{
	bindReady();

	if (!BX.type.isFunction(handler))
	{
		BX.debug('READY: not a function! ', handler);
	}
	else
	{
		if (BX.isReady)
			handler.call(document);
		else if (readyList)
			readyList.push(handler);
	}
};

BX.submit = function(obForm, action_name, action_value, onAfterSubmit)
{
	action_name = action_name || 'save';
	if (!obForm['BXFormSubmit_' + action_name])
	{
		obForm['BXFormSubmit_' + action_name] = obForm.appendChild(BX.create('INPUT', {
			'props': {
				'type': 'submit',
				'name': action_name,
				'value': action_value || 'Y'
			},
			'style': {
				'display': 'none'
			}
		}));
	}

	if (obForm.sessid)
		obForm.sessid.value = BX.bitrix_sessid();

	setTimeout(BX.delegate(function() {BX.fireEvent(this, 'click'); if (onAfterSubmit) onAfterSubmit();}, obForm['BXFormSubmit_' + action_name]), 10);
};

// returns function which runs fn in timeout ms after returned function is finished being called
BX.debounce = function(fn, timeout, ctx)
{
	var timer = 0;

	return function()
	{
		ctx = ctx || this;
		var args = arguments;

		clearTimeout(timer);

		timer = setTimeout(function()
		{
			fn.apply(ctx, args);
		}, timeout);
	}
};

// returns function which runs fn and repeats every timeout ms while returned function is being called
BX.throttle = function(fn, timeout, ctx)
{

	var timer = 0,
		args = null,
		invoke;

	return function()
	{
		ctx = ctx || this;
		args = arguments;
		invoke = true;

		if(!timer)
		{
			var q = function()
			{
				if(invoke)
				{
					fn.apply(ctx, args);
					invoke = false;
					timer = setTimeout(q, timeout);
				}
				else
				{
					timer = null;
				}
			};
			q();
		}
	};
};

/* browser detection */
BX.browser = {

	IsIE: function()
	{
		return bIE;
	},

	IsIE6: function()
	{
		return (/MSIE 6/i.test(navigator.userAgent));
	},

	IsIE7: function()
	{
		return (/MSIE 7/i.test(navigator.userAgent));
	},

	IsIE8: function()
	{
		return (/MSIE 8/i.test(navigator.userAgent));
	},

	IsIE9: function()
	{
		return !!document.documentMode && document.documentMode >= 9;
	},

	IsIE10: function()
	{
		return !!document.documentMode && document.documentMode >= 10;
	},

	IsIE11: function()
	{
		return BX.browser.DetectIeVersion() >= 11;
	},

	IsOpera: function()
	{
		return bOpera;
	},

	IsSafari: function()
	{
		return bSafari;
	},

	IsFirefox: function()
	{
		return bFirefox;
	},

	IsChrome: function()
	{
		return bChrome;
	},

	IsMac: function()
	{
		return (/Macintosh/i.test(navigator.userAgent));
	},

	IsAndroid: function()
	{
		return (/Android/i.test(navigator.userAgent));
	},

	IsIOS: function()
	{
		return (/(iPad;)|(iPhone;)/i.test(navigator.userAgent));
	},

	IsMobile: function()
	{
		return (/(ipad|iphone|android|mobile|touch)/i.test(navigator.userAgent));
	},

	DetectIeVersion: function()
	{
		if(BX.browser.IsOpera() || BX.browser.IsSafari() || BX.browser.IsFirefox() || BX.browser.IsChrome())
		{
			return -1;
		}

		var rv = -1;
		if (!!(window.MSStream) && !(window.ActiveXObject) && ("ActiveXObject" in window))
		{
			//Primary check for IE 11 based on ActiveXObject behaviour (please see http://msdn.microsoft.com/en-us/library/ie/dn423948%28v=vs.85%29.aspx)
			rv = 11;
		}
		else if (BX.browser.IsIE10())
		{
			rv = 10;
		}
		else if (BX.browser.IsIE9())
		{
			rv = 9;
		}
		else if (BX.browser.IsIE())
		{
			rv = 8;
		}

		if (rv == -1 || rv == 8)
		{
			var re;
			if (navigator.appName == "Microsoft Internet Explorer")
			{
				re = new RegExp("MSIE ([0-9]+[\.0-9]*)");
				if (re.exec(navigator.userAgent) != null)
					rv = parseFloat( RegExp.$1 );
			}
			else if (navigator.appName == "Netscape")
			{
				//Alternative check for IE 11
				rv = 11;
				re = new RegExp("Trident/.*rv:([0-9]+[\.0-9]*)");
				if (re.exec(navigator.userAgent) != null)
					rv = parseFloat( RegExp.$1 );
			}
		}

		return rv;
	},

	IsDoctype: function(pDoc)
	{
		pDoc = pDoc || document;

		if (pDoc.compatMode)
			return (pDoc.compatMode == "CSS1Compat");

		return (pDoc.documentElement && pDoc.documentElement.clientHeight);
	},

	SupportLocalStorage: function()
	{
		return !!BX.localStorage && !!BX.localStorage.checkBrowser()
	},

	addGlobalClass: function() {

		var globalClass = "bx-core";
		if (BX.hasClass(document.documentElement, globalClass))
		{
			return;
		}

		//Mobile
		if (BX.browser.IsIOS())
		{
			globalClass += " bx-ios";
		}
		else if (BX.browser.IsMac())
		{
			globalClass += " bx-mac";
		}
		else if (BX.browser.IsAndroid())
		{
			globalClass += " bx-android";
		}

		globalClass += (BX.browser.IsMobile() ? " bx-touch" : " bx-no-touch");
		globalClass += (BX.browser.isRetina() ? " bx-retina" : " bx-no-retina");

		//Desktop
		var ieVersion = -1;
		if (/AppleWebKit/.test(navigator.userAgent))
		{
			globalClass += " bx-chrome";
		}
		else if ((ieVersion = BX.browser.DetectIeVersion()) > 0)
		{
			globalClass += " bx-ie bx-ie" + ieVersion;
			if (ieVersion > 7 && ieVersion < 10 && !BX.browser.IsDoctype())
			{
				// it seems IE10 doesn't have any specific bugs like others event in quirks mode
				globalClass += " bx-quirks";
			}
		}
		else if (/Opera/.test(navigator.userAgent))
		{
			globalClass += " bx-opera";
		}
		else if (/Gecko/.test(navigator.userAgent))
		{
			globalClass += " bx-firefox";
		}

		BX.addClass(document.documentElement, globalClass);
	},

	isPropertySupported: function(jsProperty, bReturnCSSName)
	{
		if (!BX.type.isNotEmptyString(jsProperty))
			return false;

		var property = jsProperty.indexOf("-") > -1 ? getJsName(jsProperty) : jsProperty;
		bReturnCSSName = !!bReturnCSSName;

		var ucProperty = property.charAt(0).toUpperCase() + property.slice(1);
		var properties = (property + ' ' + ["Webkit", "Moz", "O", "ms"].join(ucProperty + " ") + ucProperty).split(" ");
		var obj = document.body || document.documentElement;

		for (var i = 0; i < properties.length; i++)
		{
			var prop = properties[i];
			if (obj.style[prop] !== undefined)
			{
				var prefix = prop == property
							? ""
							: "-" + prop.substr(0, prop.length - property.length).toLowerCase() + "-";
				return bReturnCSSName ? prefix + getCssName(property) : prop;
			}
		}

		function getCssName(propertyName)
		{
			return propertyName.replace(/([A-Z])/g, function() { return "-" + arguments[1].toLowerCase(); } )
		}

		function getJsName(cssName)
		{
			var reg = /(\-([a-z]){1})/g;
			if (reg.test(cssName))
				return cssName.replace(reg, function () {return arguments[2].toUpperCase();});
			else
				return cssName;
		}

		return false;
	},

	addGlobalFeatures : function(features, prefix)
	{
		if (!BX.type.isArray(features))
			return;

		var classNames = [];
		for (var i = 0; i < features.length; i++)
		{
			var support = !!BX.browser.isPropertySupported(features[i]);
			classNames.push( "bx-" + (support ? "" : "no-") + features[i].toLowerCase());
		}
		BX.addClass(document.documentElement, classNames.join(" "));
	},

	isRetina : function()
	{
		return window.devicePixelRatio && window.devicePixelRatio >= 2;
	}
};

/* low-level fx funcitons*/
BX.show = function(ob, displayType)
{
	if (ob.BXDISPLAY || !_checkDisplay(ob, displayType))
	{
		ob.style.display = ob.BXDISPLAY;
	}
};

BX.hide = function(ob, displayType)
{
	if (!ob.BXDISPLAY)
		_checkDisplay(ob, displayType);

	ob.style.display = 'none';
};

BX.toggle = function(ob, values)
{
	if (!values && BX.type.isElementNode(ob))
	{
		var bShow = true;
		if (ob.BXDISPLAY)
			bShow = !_checkDisplay(ob);
		else
			bShow = ob.style.display == 'none';

		if (bShow)
			BX.show(ob);
		else
			BX.hide(ob);
	}
	else if (BX.type.isArray(values))
	{
		for (var i=0,len=values.length; i<len; i++)
		{
			if (ob == values[i])
			{
				ob = values[i==len-1 ? 0 : i+1];
				break;
			}
		}
		if (i==len)
			ob = values[0];
	}

	return ob;
};

/* some useful util functions */

BX.util = {
	array_values: function(ar)
	{
		if (!BX.type.isArray(ar))
			return BX.util._array_values_ob(ar);
		var arv = [];
		for(var i=0,l=ar.length;i<l;i++)
			if (ar[i] !== null && typeof ar[i] != 'undefined')
				arv.push(ar[i]);
		return arv;
	},

	_array_values_ob: function(ar)
	{
		var arv = [];
		for(var i in ar)
			if (ar[i] !== null && typeof ar[i] != 'undefined')
				arv.push(ar[i]);
		return arv;
	},

	array_keys: function(ar)
	{
		if (!BX.type.isArray(ar))
			return BX.util._array_keys_ob(ar);
		var arv = [];
		for(var i=0,l=ar.length;i<l;i++)
			if (ar[i] !== null && typeof ar[i] != 'undefined')
				arv.push(i);
		return arv;
	},

	_array_keys_ob: function(ar)
	{
		var arv = [];
		for(var i in ar)
			if (ar[i] !== null && typeof ar[i] != 'undefined')
				arv.push(i);
		return arv;
	},

	object_keys: function(obj)
	{
		var arv = [];
		for(var k in obj)
		{
			if(obj.hasOwnProperty(k))
			{
				arv.push(k);
			}
		}
		return arv;
	},

	array_merge: function(first, second)
	{
		if (!BX.type.isArray(first)) first = [];
		if (!BX.type.isArray(second)) second = [];

		var i = first.length, j = 0;

		if (typeof second.length === "number")
		{
			for (var l = second.length; j < l; j++)
			{
				first[i++] = second[j];
			}
		}
		else
		{
			while (second[j] !== undefined)
			{
				first[i++] = second[j++];
			}
		}

		first.length = i;

		return first;
	},

	array_flip: function ( object )
	{
	    var newObject = {};

	    for (var key in object)
		{
	        newObject[object[key]] = key;
	    }

	    return newObject;
	},

	array_diff: function(ar1, ar2, hash)
	{
		hash = BX.type.isFunction(hash) ? hash : null;
		var i, length, v, h, map = {}, result = [];
		for(i = 0, length = ar2.length; i < length; i++)
		{
			v = ar2[i];
			h = hash ? hash(v) : v;
			map[h] = true;
		}

		for(i = 0, length = ar1.length; i < length; i++)
		{
			v = ar1[i];
			h = hash ? hash(v) : v;
			if(typeof(map[h]) === "undefined")
			{
				result.push(v);
			}
		}
		return result;
	},

	array_unique: function(ar)
	{
		var i=0,j,len=ar.length;
		if(len<2) return ar;

		for (; i<len-1;i++)
		{
			for (j=i+1; j<len;j++)
			{
				if (ar[i]==ar[j])
				{
					ar.splice(j--,1); len--;
				}
			}
		}

		return ar;
	},

	in_array: function(needle, haystack)
	{
		for(var i=0; i<haystack.length; i++)
		{
			if(haystack[i] == needle)
				return true;
		}
		return false;
	},

	array_search: function(needle, haystack)
	{
		for(var i=0; i<haystack.length; i++)
		{
			if(haystack[i] == needle)
				return i;
		}
		return -1;
	},

	object_search_key: function(needle, haystack)
	{
		if (typeof haystack[needle] != 'undefined')
			return haystack[needle];

		for(var i in haystack)
		{
			if (typeof haystack[i] == "object")
			{
				var result = BX.util.object_search_key(needle, haystack[i]);
				if (result !== false)
					return result;
			}
		}
		return false;
	},

	trim: function(s)
	{
		if (BX.type.isString(s))
			return s.replace(r.ltrim, '').replace(r.rtrim, '');
		else
			return s;
	},

	urlencode: function(s){return encodeURIComponent(s);},

	// it may also be useful. via sVD.
	deleteFromArray: function(ar, ind) {return ar.slice(0, ind).concat(ar.slice(ind + 1));},
	insertIntoArray: function(ar, ind, el) {return ar.slice(0, ind).concat([el]).concat(ar.slice(ind));},

	htmlspecialchars: function(str)
	{
		if(!str.replace) return str;

		return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	},

	htmlspecialcharsback: function(str)
	{
		if(!str.replace) return str;

		return str.replace(/\&quot;/g, '"').replace(/&#39;/g, "'").replace(/\&lt;/g, '<').replace(/\&gt;/g, '>').replace(/\&amp;/g, '&');
	},

	// Quote regular expression characters plus an optional character
	preg_quote: function(str, delimiter)
	{
		if(!str.replace)
			return str;
		return str.replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
	},

	jsencode: function(str)
	{
		if (!str || !str.replace)
			return str;

		var escapes =
		[
			{ c: "\\\\", r: "\\\\" }, // should be first
			{ c: "\\t", r: "\\t" },
			{ c: "\\n", r: "\\n" },
			{ c: "\\r", r: "\\r" },
			{ c: "\"", r: "\\\"" },
			{ c: "'", r: "\\'" },
			{ c: "<", r: "\\x3C" },
			{ c: ">", r: "\\x3E" },
			{ c: "\\u2028", r: "\\u2028" },
			{ c: "\\u2029", r: "\\u2029" }
		];
		for (var i = 0; i < escapes.length; i++)
			str = str.replace(new RegExp(escapes[i].c, 'g'), escapes[i].r);
		return str;
	},

	nl2br: function(str)
	{
		if (!str || !str.replace)
			return str;

		return str.replace(/([^>])\n/g, '$1<br/>');
	},

	str_pad: function(input, pad_length, pad_string, pad_type)
	{
		pad_string = pad_string || ' ';
		pad_type = pad_type || 'right';
		input = input.toString();

		if (pad_type == 'left')
			return BX.util.str_pad_left(input, pad_length, pad_string);
		else
			return BX.util.str_pad_right(input, pad_length, pad_string);

	},

	str_pad_left: function(input, pad_length, pad_string)
	{
		var i = input.length, q=pad_string.length;
		if (i >= pad_length) return input;

		for(;i<pad_length;i+=q)
			input = pad_string + input;

		return input;
	},

	str_pad_right: function(input, pad_length, pad_string)
	{
		var i = input.length, q=pad_string.length;
		if (i >= pad_length) return input;

		for(;i<pad_length;i+=q)
			input += pad_string;

		return input;
	},

	strip_tags: function(str)
	{
		return str.split(/<[^>]+>/g).join('');
	},

	strip_php_tags: function(str)
	{
		return str.replace(/<\?(.|[\r\n])*?\?>/g, '');
	},

	popup: function(url, width, height)
	{
		var w, h;
		if(BX.browser.IsOpera())
		{
			w = document.body.offsetWidth;
			h = document.body.offsetHeight;
		}
		else
		{
			w = screen.width;
			h = screen.height;
		}
		return window.open(url, '', 'status=no,scrollbars=yes,resizable=yes,width='+width+',height='+height+',top='+Math.floor((h - height)/2-14)+',left='+Math.floor((w - width)/2-5));
	},

	shuffle: function(array)
	{
		var temporaryValue, randomIndex;
		var currentIndex = array.length;

		while (0 !== currentIndex)
		{
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	},

	// BX.util.objectSort(object, sortBy, sortDir) - Sort object by property
	// function params: 1 - object for sort, 2 - sort by property, 3 - sort direction (asc/desc)
	// return: sort array [[objectElement], [objectElement]] in sortDir direction

	// example: BX.util.objectSort({'L1': {'name': 'Last'}, 'F1': {'name': 'First'}}, 'name', 'asc');
	// return: [{'name' : 'First'}, {'name' : 'Last'}]
	objectSort: function(object, sortBy, sortDir)
	{
		sortDir = sortDir == 'asc'? 'asc': 'desc';

		var arItems = [], i;
		for (i in object)
		{
			if (object.hasOwnProperty(i) && object[i][sortBy])
			{
				arItems.push([i, object[i][sortBy]]);
			}
		}

		if (sortDir == 'asc')
		{
			arItems.sort(function(i, ii) {
				var s1, s2;
				if (!isNaN(i[1]) && !isNaN(ii[1]))
				{
					s1 = parseInt(i[1]);
					s2 = parseInt(ii[1]);
				}
				else
				{
					s1 = i[1].toString().toLowerCase();
					s2 = ii[1].toString().toLowerCase();
				}

				if (s1 > s2)
					return 1;
				else if (s1 < s2)
					return -1;
				else
					return 0;
			});
		}
		else
		{
			arItems.sort(function(i, ii) {
				var s1, s2;
				if (!isNaN(i[1]) && !isNaN(ii[1]))
				{
					s1 = parseInt(i[1]);
					s2 = parseInt(ii[1]);
				}
				else
				{
					s1 = i[1].toString().toLowerCase();
					s2 = ii[1].toString().toLowerCase();
				}
				if (s1 < s2)
					return 1;
				else if (s1 > s2)
					return -1;
				else
					return 0;
			});
		}

		var arReturnArray = Array();
		for (i = 0; i < arItems.length; i++)
		{
			arReturnArray.push(object[arItems[i][0]]);
		}

		return arReturnArray;
	},

	// #fdf9e5 => {r=253, g=249, b=229}
	hex2rgb: function(color)
	{
		var rgb = color.replace(/[# ]/g,"").replace(/^(.)(.)(.)$/,'$1$1$2$2$3$3').match(/.{2}/g);
		for (var i=0;  i<3; i++)
		{
			rgb[i] = parseInt(rgb[i], 16);
		}
		return {'r':rgb[0],'g':rgb[1],'b':rgb[2]};
	},

	remove_url_param: function(url, param)
	{
		if (BX.type.isArray(param))
		{
			for (var i=0; i<param.length; i++)
			{
				url = BX.util.remove_url_param(url, param[i]);
			}
		}
		else
		{
			var pos, params;
			if((pos = url.indexOf('?')) >= 0 && pos != url.length-1)
			{
				params = url.substr(pos + 1);
				url = url.substr(0, pos + 1);

				params = params.replace(new RegExp('(^|&)'+param+'=[^&#]*', 'i'), '');
				params = params.replace(/^&/, '');

				if(BX.type.isNotEmptyString(params))
				{
					url = url + params;
				}
				else
				{
					//remove trailing question character
					url = url.substr(0, url.length - 1);
				}
			}
		}
		return url;
	},

	/*
	{'param1': 'value1', 'param2': 'value2'}
	 */
	add_url_param: function(url, params)
	{
		var param;
		var additional = '';
		var hash = '';
		var pos;

		for(param in params)
		{
			url = this.remove_url_param(url, param);
			additional += (additional != ''? '&':'') + param + '=' + params[param];
		}

		if((pos = url.indexOf('#')) >= 0)
		{
			hash = url.substr(pos);
			url = url.substr(0, pos);
		}

		if((pos = url.indexOf('?')) >= 0)
		{
			url = url + (pos != url.length-1? '&' : '') + additional + hash;
		}
		else
		{
			url = url + '?' + additional + hash;
		}

		return url;
	},

	even: function(digit)
	{
		return (parseInt(digit) % 2 == 0);
	},

	hashCode: function(str)
	{
		if(!BX.type.isNotEmptyString(str))
		{
			return 0;
		}

		var hash = 0;
		for (var i = 0; i < str.length; i++)
		{
			var c = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + c;
			hash = hash & hash;
		}
		return hash;
	},

	getRandomString: function (length)
	{
		var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
		var charQty = chars.length;

		length = parseInt(length);
		if(isNaN(length) || length <= 0)
		{
			length = 8;
		}

		var result = "";
		for (var i = 0; i < length; i++)
		{
			result += chars.charAt(Math.floor(Math.random() * charQty));
		}
		return result;
	},

	number_format: function(number, decimals, dec_point, thousands_sep)
	{
		var i, j, kw, kd, km, sign = '';
		decimals = Math.abs(decimals);
		if (isNaN(decimals) || decimals < 0)
		{
			decimals = 2;
		}
		dec_point = dec_point || ',';
		if (typeof thousands_sep === 'undefined')
			thousands_sep = '.';

		number = (+number || 0).toFixed(decimals);
		if (number < 0)
		{
			sign = '-';
			number = -number;
		}

		i = parseInt(number, 10) + '';
		j = (i.length > 3 ? i.length % 3 : 0);

		km = (j ? i.substr(0, j) + thousands_sep : '');
		kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
		kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, '0').slice(2) : '');

		return sign + km + kw + kd;
	},

	getExtension: function (url)
	{
		url = url || "";
		var items = url.split("?")[0].split(".");
		return items[items.length-1].toLowerCase();
	},
	addObjectToForm: function(object, form, prefix)
	{
		if(!BX.type.isString(prefix))
		{
			prefix = "";
		}

		for(var key in object)
		{
			if(!object.hasOwnProperty(key))
			{
				continue;
			}

			var value = object[key];
			var name = prefix !== "" ? (prefix + "[" + key + "]") : key;
			if(BX.type.isArray(value))
			{
				for(var i = 0; i < value.length; i++)
				{
					BX.util.addObjectToForm(value[i], form, (name + "[" + i.toString() + "]"));
				}
			}
			else if(BX.type.isPlainObject(value))
			{
				BX.util.addObjectToForm(value, form, name);
			}
			else
			{
				value = BX.type.isFunction(value.toString) ? value.toString() : "";
				if(value !== "")
				{
					form.appendChild(BX.create("INPUT", { attrs: { type: "hidden", name: name, value: value } }));
				}
			}
		}
	},

	observe: function(object, enable)
	{
		if (!BX.browser.IsChrome() || typeof(object) != 'object')
			return false;

		enable = enable !== false;

		var observer = function(options)
		{
			options.forEach(function(option){
				var groupName = option.name + ' changed';
				console.groupCollapsed(groupName);
				console.log('Old value: ', option.oldValue);
				console.log('New value: ', option.object[option.name]);
				console.groupEnd(groupName);
			});
		}
		if (enable)
		{
			Object.observe(object, observer);
		}
		else
		{
			Object.unobserve(object, observer);
		}

		return enable;
	},

	escapeRegExp: function(str)
	{
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}
};

BX.type = {
	isString: function(item) {
		return item === '' ? true : (item ? (typeof (item) == "string" || item instanceof String) : false);
	},
	isNotEmptyString: function(item) {
		return BX.type.isString(item) ? item.length > 0 : false;
	},
	isBoolean: function(item) {
		return item === true || item === false;
	},
	isNumber: function(item) {
		return item === 0 ? true : (item ? (typeof (item) == "number" || item instanceof Number) : false);
	},
	isFunction: function(item) {
		return item === null ? false : (typeof (item) == "function" || item instanceof Function);
	},
	isElementNode: function(item) {
		//document.body.ELEMENT_NODE;
		return item && typeof (item) == "object" && "nodeType" in item && item.nodeType == 1 && item.tagName && item.tagName.toUpperCase() != 'SCRIPT' && item.tagName.toUpperCase() != 'STYLE' && item.tagName.toUpperCase() != 'LINK';
	},
	isDomNode: function(item) {
		return item && typeof (item) == "object" && "nodeType" in item;
	},
	isArray: function(item) {
		return item && Object.prototype.toString.call(item) == "[object Array]";
	},
	isDate : function(item) {
		return item && Object.prototype.toString.call(item) == "[object Date]";
	},
	isPlainObject: function(item)
	{
		if(!item || typeof(item) !== "object" || item.nodeType)
		{
			return false;
		}

		var hasProp = Object.prototype.hasOwnProperty;
		try
		{
			if (item.constructor && !hasProp.call(item, "constructor") && !hasProp.call(item.constructor.prototype, "isPrototypeOf") )
			{
				return false;
			}
		}
		catch (e)
		{
			return false;
		}

		var key;
		for (key in item)
		{
		}
		return typeof(key) === "undefined" || hasProp.call(item, key);
	},
	ensureInteger: function(value)
	{
		if(BX.type.isNumber(value))
		{
			return value;
		}

		value = parseInt(value);
		return !isNaN(value) ? value : 0;
	},
	stringToInt: function(s)
	{
		var i = parseInt(s);
		return !isNaN(i) ? i : 0;
	}
};

BX.prop =
{
	get: function(object, key, defaultValue)
	{
		return object && object.hasOwnProperty(key) ? object[key] : defaultValue;
	},
	getObject: function(object, key, defaultValue)
	{
		return object && BX.type.isPlainObject(object[key]) ? object[key] : defaultValue;
	},
	getElementNode: function(object, key, defaultValue)
	{
		return object && BX.type.isElementNode(object[key]) ? object[key] : defaultValue;
	},
	getArray: function(object, key, defaultValue)
	{
		return object && BX.type.isArray(object[key]) ? object[key] : defaultValue;
	},
	getFunction: function(object, key, defaultValue)
	{
		return object && BX.type.isFunction(object[key]) ? object[key] : defaultValue;
	},
	getNumber: function(object, key, defaultValue)
	{
		if(!(object && object.hasOwnProperty(key)))
		{
			return defaultValue;
		}

		var value = object[key];
		if(BX.type.isNumber(value))
		{
			return value;
		}

		value = parseFloat(value);
		return !isNaN(value) ? value : defaultValue;
	},
	getInteger: function(object, key, defaultValue)
	{
		if(!(object && object.hasOwnProperty(key)))
		{
			return defaultValue;
		}

		var value = object[key];
		if(BX.type.isNumber(value))
		{
			return value;
		}

		value = parseInt(value);
		return !isNaN(value) ? value : defaultValue;
	},
	getBoolean: function(object, key, defaultValue)
	{
		if(!(object && object.hasOwnProperty(key)))
		{
			return defaultValue;
		}

		var value = object[key];
		return (BX.type.isBoolean(value)
			? value
			: (BX.type.isString(value) ? (value.toLowerCase() === "true") : !!value)
		);
	},
	getString: function(object, key, defaultValue)
	{
		if(!(object && object.hasOwnProperty(key)))
		{
			return defaultValue;
		}

		var value = object[key];
		return BX.type.isString(value) ? value : value.toString();
	},
	extractDate: function(datetime)
	{
		if(!BX.type.isDate(datetime))
		{
			datetime = new Date();
		}

		datetime.setHours(0);
		datetime.setMinutes(0);
		datetime.setSeconds(0);
		datetime.setMilliseconds(0);

		return datetime;
	}
};

BX.isNodeInDom = function(node, doc)
{
	return node === (doc || document) ? true :
		(node.parentNode ? BX.isNodeInDom(node.parentNode) : false);
};

BX.isNodeHidden = function(node)
{
	if (node === document)
		return false;
	else if (BX.style(node, 'display') == 'none')
		return true;
	else
		return (node.parentNode ? BX.isNodeHidden(node.parentNode) : true);
};

BX.evalPack = function(code)
{
	while (code.length > 0)
	{
		var c = code.shift();

		if (c.TYPE == 'SCRIPT_EXT' || c.TYPE == 'SCRIPT_SRC')
		{
			BX.loadScript(c.DATA, function() {BX.evalPack(code)});
			return;
		}
		else if (c.TYPE == 'SCRIPT')
		{
			BX.evalGlobal(c.DATA);
		}
	}
};

BX.evalGlobal = function(data)
{
	if (data)
	{
		var head = document.getElementsByTagName("head")[0] || document.documentElement,
			script = document.createElement("script");

		script.type = "text/javascript";

		if (!BX.browser.IsIE())
		{
			script.appendChild(document.createTextNode(data));
		}
		else
		{
			script.text = data;
		}

		head.insertBefore(script, head.firstChild);
		head.removeChild(script);
	}
};

BX.processHTML = function(data, scriptsRunFirst)
{
	var matchScript, matchStyle, matchSrc, matchHref, matchType, scripts = [], styles = [];
	var textIndexes = [];
	var lastIndex = r.script.lastIndex = r.script_end.lastIndex = 0;

	while ((matchScript = r.script.exec(data)) !== null)
	{
		r.script_end.lastIndex = r.script.lastIndex;
		var matchScriptEnd = r.script_end.exec(data);
		if (matchScriptEnd === null)
		{
			break;
		}

		// skip script tags of special types
		var skipTag = false;
		if ((matchType = matchScript[1].match(r.script_type)) !== null)
		{
			if(matchType[1] == 'text/html' || matchType[1] == 'text/template')
				skipTag = true;
		}

		if(skipTag)
		{
			textIndexes.push([lastIndex, r.script_end.lastIndex - lastIndex]);
		}
		else
		{
			textIndexes.push([lastIndex, matchScript.index - lastIndex]);

			var bRunFirst = scriptsRunFirst || (matchScript[1].indexOf('bxrunfirst') != '-1');

			if ((matchSrc = matchScript[1].match(r.script_src)) !== null)
			{
				scripts.push({"bRunFirst": bRunFirst, "isInternal": false, "JS": matchSrc[1]});
			}
			else
			{
				var start = matchScript.index + matchScript[0].length;
				var js = data.substr(start, matchScriptEnd.index-start);

				scripts.push({"bRunFirst": bRunFirst, "isInternal": true, "JS": js});
			}
		}

		lastIndex = matchScriptEnd.index + 9;
		r.script.lastIndex = lastIndex;
	}

	textIndexes.push([lastIndex, lastIndex === 0 ? data.length : data.length - lastIndex]);
	var pureData = "";
	for (var i = 0, length = textIndexes.length; i < length; i++)
	{
		pureData += data.substr(textIndexes[i][0], textIndexes[i][1]);
	}

	while ((matchStyle = pureData.match(r.style)) !== null)
	{
		if ((matchHref = matchStyle[0].match(r.style_href)) !== null && matchStyle[0].indexOf('media="') < 0)
		{
			styles.push(matchHref[1]);
		}

		pureData = pureData.replace(matchStyle[0], '');
	}

	return {'HTML': pureData, 'SCRIPT': scripts, 'STYLE': styles};
};

BX.garbage = function(call, thisObject)
{
	garbageCollectors.push({callback: call, context: thisObject});
};

/* window pos functions */

BX.GetDocElement = function (pDoc)
{
	pDoc = pDoc || document;
	return (BX.browser.IsDoctype(pDoc) ? pDoc.documentElement : pDoc.body);
};

BX.GetContext = function(node)
{
	if (BX.type.isElementNode(node))
		return node.ownerDocument.parentWindow || node.ownerDocument.defaultView || window;
	else if (BX.type.isDomNode(node))
		return node.parentWindow || node.defaultView || window;
	else
		return window;
};

BX.GetWindowInnerSize = function(pDoc)
{
	var width, height;

	pDoc = pDoc || document;

	if (window.innerHeight) // all except Explorer
	{
		width = BX.GetContext(pDoc).innerWidth;
		height = BX.GetContext(pDoc).innerHeight;
	}
	else if (pDoc.documentElement && (pDoc.documentElement.clientHeight || pDoc.documentElement.clientWidth)) // Explorer 6 Strict Mode
	{
		width = pDoc.documentElement.clientWidth;
		height = pDoc.documentElement.clientHeight;
	}
	else if (pDoc.body) // other Explorers
	{
		width = pDoc.body.clientWidth;
		height = pDoc.body.clientHeight;
	}
	return {innerWidth : width, innerHeight : height};
};

BX.GetWindowScrollPos = function(pDoc)
{
	var left, top;

	pDoc = pDoc || document;

	if (window.pageYOffset) // all except Explorer
	{
		left = BX.GetContext(pDoc).pageXOffset;
		top = BX.GetContext(pDoc).pageYOffset;
	}
	else if (pDoc.documentElement && (pDoc.documentElement.scrollTop || pDoc.documentElement.scrollLeft)) // Explorer 6 Strict
	{
		left = pDoc.documentElement.scrollLeft;
		top = pDoc.documentElement.scrollTop;
	}
	else if (pDoc.body) // all other Explorers
	{
		left = pDoc.body.scrollLeft;
		top = pDoc.body.scrollTop;
	}
	return {scrollLeft : left, scrollTop : top};
};

BX.GetWindowScrollSize = function(pDoc)
{
	var width, height;
	if (!pDoc)
		pDoc = document;

	if ( (pDoc.compatMode && pDoc.compatMode == "CSS1Compat"))
	{
		width = pDoc.documentElement.scrollWidth;
		height = pDoc.documentElement.scrollHeight;
	}
	else
	{
		if (pDoc.body.scrollHeight > pDoc.body.offsetHeight)
			height = pDoc.body.scrollHeight;
		else
			height = pDoc.body.offsetHeight;

		if (pDoc.body.scrollWidth > pDoc.body.offsetWidth ||
			(pDoc.compatMode && pDoc.compatMode == "BackCompat") ||
			(pDoc.documentElement && !pDoc.documentElement.clientWidth)
		)
			width = pDoc.body.scrollWidth;
		else
			width = pDoc.body.offsetWidth;
	}
	return {scrollWidth : width, scrollHeight : height};
};

BX.GetWindowSize = function(pDoc)
{
	var innerSize = this.GetWindowInnerSize(pDoc);
	var scrollPos = this.GetWindowScrollPos(pDoc);
	var scrollSize = this.GetWindowScrollSize(pDoc);

	return  {
		innerWidth : innerSize.innerWidth, innerHeight : innerSize.innerHeight,
		scrollLeft : scrollPos.scrollLeft, scrollTop : scrollPos.scrollTop,
		scrollWidth : scrollSize.scrollWidth, scrollHeight : scrollSize.scrollHeight
	};
};

BX.scrollTop = function(node, val){
	if(typeof val != 'undefined'){

		if(node == window){
			throw new Error('scrollTop() for window is not implemented');
		}else
			node.scrollTop = parseInt(val);

	}else{

		if(node == window)
			return BX.GetWindowScrollPos().scrollTop;

		return node.scrollTop;
	}
}

BX.scrollLeft = function(node, val){
	if(typeof val != 'undefined'){

		if(node == window){
			throw new Error('scrollLeft() for window is not implemented');
		}else
			node.scrollLeft = parseInt(val);

	}else{

		if(node == window)
			return BX.GetWindowScrollPos().scrollLeft;

		return node.scrollLeft;
	}
}

BX.hide_object = function(ob)
{
	ob = BX(ob);
	ob.style.position = 'absolute';
	ob.style.top = '-1000px';
	ob.style.left = '-1000px';
	ob.style.height = '10px';
	ob.style.width = '10px';
};

BX.is_relative = function(el)
{
	var p = BX.style(el, 'position');
	return p == 'relative' || p == 'absolute';
};

BX.is_float = function(el)
{
	var p = BX.style(el, 'float');
	return p == 'right' || p == 'left';
};

BX.is_fixed = function(el)
{
	var p = BX.style(el, 'position');
	return p == 'fixed';
};

BX.pos = function(el, bRelative)
{
	var r = { top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 };
	bRelative = !!bRelative;
	if (!el)
		return r;
	if (typeof (el.getBoundingClientRect) != "undefined" && el.ownerDocument == document && !bRelative)
	{
		var clientRect = {};

		// getBoundingClientRect can return undefined and generate exception in some cases in IE8.
		try
		{
			clientRect = el.getBoundingClientRect();
		}
		catch(e)
		{
			clientRect =
			{
				top: el.offsetTop,
				left: el.offsetLeft,
				width: el.offsetWidth,
				height: el.offsetHeight,
				right: el.offsetLeft + el.offsetWidth,
				bottom: el.offsetTop + el.offsetHeight
			};
		}

		var root = document.documentElement;
		var body = document.body;

		r.top = clientRect.top + (root.scrollTop || body.scrollTop);
		r.left = clientRect.left + (root.scrollLeft || body.scrollLeft);
		r.width = clientRect.right - clientRect.left;
		r.height = clientRect.bottom - clientRect.top;
		r.right = clientRect.right + (root.scrollLeft || body.scrollLeft);
		r.bottom = clientRect.bottom + (root.scrollTop || body.scrollTop);
	}
	else
	{
		var x = 0, y = 0, w = el.offsetWidth, h = el.offsetHeight;
		var first = true;
		for (; el != null; el = el.offsetParent)
		{
			if (!first && bRelative && BX.is_relative(el))
				break;

			x += el.offsetLeft;
			y += el.offsetTop;
			if (first)
			{
				first = false;
				continue;
			}

			var elBorderLeftWidth = parseInt(BX.style(el, 'border-left-width')),
				elBorderTopWidth = parseInt(BX.style(el, 'border-top-width'));

			if (!isNaN(elBorderLeftWidth) && elBorderLeftWidth > 0)
				x += elBorderLeftWidth;
			if (!isNaN(elBorderTopWidth) && elBorderTopWidth > 0)
				y += elBorderTopWidth;
		}

		r.top = y;
		r.left = x;
		r.width = w;
		r.height = h;
		r.right = r.left + w;
		r.bottom = r.top + h;
	}

	for(var i in r)
	{
		if(r.hasOwnProperty(i))
		{
			r[i] = Math.round(r[i]);
		}
	}

	return r;
};

BX.width = function(node, val){
	if(typeof val != 'undefined')
		BX.style(node, 'width', parseInt(val)+'px');
	else{

		if(node == window)
			return window.innerWidth;

		//return parseInt(BX.style(node, 'width'));
		return BX.pos(node).width;
	}
}

BX.height = function(node, val){
	if(typeof val != 'undefined')
		BX.style(node, 'height', parseInt(val)+'px');
	else{

		if(node == window)
			return window.innerHeight;

		//return parseInt(BX.style(node, 'height'));
		return BX.pos(node).height;
	}
}

BX.align = function(pos, w, h, type)
{
	if (type)
		type = type.toLowerCase();
	else
		type = '';

	var pDoc = document;
	if (BX.type.isElementNode(pos))
	{
		pDoc = pos.ownerDocument;
		pos = BX.pos(pos);
	}

	var x = pos["left"], y = pos["bottom"];

	var scroll = BX.GetWindowScrollPos(pDoc);
	var size = BX.GetWindowInnerSize(pDoc);

	if((size.innerWidth + scroll.scrollLeft) - (pos["left"] + w) < 0)
	{
		if(pos["right"] - w >= 0 )
			x = pos["right"] - w;
		else
			x = scroll.scrollLeft;
	}

	if(((size.innerHeight + scroll.scrollTop) - (pos["bottom"] + h) < 0) || ~type.indexOf('top'))
	{
		if(pos["top"] - h >= 0 || ~type.indexOf('top'))
			y = pos["top"] - h;
		else
			y = scroll.scrollTop;
	}

	return {'left':x, 'top':y};
};

BX.scrollToNode = function(node)
{
	var obNode = BX(node);

	if (obNode.scrollIntoView)
		obNode.scrollIntoView(true);
	else
	{
		var arNodePos = BX.pos(obNode);
		window.scrollTo(arNodePos.left, arNodePos.top);
	}
};

/* non-xhr loadings */
BX.showWait = function(node, msg)
{
	node = BX(node) || document.body || document.documentElement;
	msg = msg || BX.message('JS_CORE_LOADING');

	var container_id = node.id || Math.random();

	var obMsg = node.bxmsg = document.body.appendChild(BX.create('DIV', {
		props: {
			id: 'wait_' + container_id
		},
		style: {
			background: 'url("/bitrix/js/main/core/images/wait.gif") no-repeat scroll 10px center #fcf7d1',
			border: '1px solid #E1B52D',
			color: 'black',
			fontFamily: 'Verdana,Arial,sans-serif',
			fontSize: '11px',
			padding: '10px 30px 10px 37px',
			position: 'absolute',
			zIndex:'10000',
			textAlign:'center'
		},
		text: msg
	}));

	setTimeout(BX.delegate(_adjustWait, node), 10);

	lastWait[lastWait.length] = obMsg;
	return obMsg;
};

BX.closeWait = function(node, obMsg)
{
	if(node && !obMsg)
		obMsg = node.bxmsg;
	if(node && !obMsg && BX.hasClass(node, 'bx-core-waitwindow'))
		obMsg = node;
	if(node && !obMsg)
		obMsg = BX('wait_' + node.id);
	if(!obMsg)
		obMsg = lastWait.pop();

	if (obMsg && obMsg.parentNode)
	{
		for (var i=0,len=lastWait.length;i<len;i++)
		{
			if (obMsg == lastWait[i])
			{
				lastWait = BX.util.deleteFromArray(lastWait, i);
				break;
			}
		}

		obMsg.parentNode.removeChild(obMsg);
		if (node) node.bxmsg = null;
		BX.cleanNode(obMsg, true);
	}
};

BX.setJSList = function(scripts)
{
	if (BX.type.isArray(scripts))
	{
		jsList = scripts;
	}
};

BX.getJSList = function()
{
	initJsList();
	return jsList;
};

BX.setCSSList = function(scripts)
{
	if (BX.type.isArray(scripts))
	{
		cssList = scripts;
	}
};

BX.getCSSList = function()
{
	initCssList();
	return cssList;
};

BX.getJSPath = function(js)
{
	return js.replace(/^(http[s]*:)*\/\/[^\/]+/i, '');
};

BX.getCSSPath = function(css)
{
	return css.replace(/^(http[s]*:)*\/\/[^\/]+/i, '');
};

BX.getCDNPath = function(path)
{
	return path;
};

BX.loadScript = function(script, callback, doc)
{
	if (BX.type.isString(script))
	{
		script = [script];
	}

	return BX.load(script, callback, doc);
};

BX.loadCSS = function(css, doc, win)
{
	if (BX.type.isString(css))
	{
		css = [css];
	}

	if (BX.type.isArray(css))
	{
		css = css.map(function(url) {
			return { url: url, ext: "css" }
		});

		BX.load(css, null, doc);
	}
};

BX.load = function(items, callback, doc)
{
	if (!BX.isReady)
	{
		var _args = arguments;
		BX.ready(function() {
			BX.load.apply(this, _args);
		});
		return null;
	}

	doc = doc || document;
	if (isAsync === null)
	{
		isAsync = "async" in doc.createElement("script") || "MozAppearance" in doc.documentElement.style || window.opera;
	}

	return isAsync ? loadAsync(items, callback, doc) : loadAsyncEmulation(items, callback, doc);
};

BX.convert =
{
	nodeListToArray: function(nodes)
	{
		try
		{
			return (Array.prototype.slice.call(nodes, 0));
		}
		catch (ex)
		{
			var ary = [];
			for(var i = 0, l = nodes.length; i < l; i++)
			{
				ary.push(nodes[i]);
			}
			return ary;
		}
	}
};

function loadAsync(items, callback, doc)
{
	if (!BX.type.isArray(items))
	{
		return;
	}

	function allLoaded(items)
	{
		items = items || assets;
		for (var name in items)
		{
			if (items.hasOwnProperty(name) && items[name].state !== LOADED)
			{
				return false;
			}
		}

		return true;
	}

	if (!BX.type.isFunction(callback))
	{
		callback = null;
	}

	var itemSet = {}, item, i;
	for (i = 0; i < items.length; i++)
	{
		item = items[i];
		item = getAsset(item);
		itemSet[item.name] = item;
	}

	var callbackWasCalled = false;
	for (i = 0; i < items.length; i++)
	{
		item = items[i];
		item = getAsset(item);
		load(item, function () {
			if (allLoaded(itemSet))
			{
				if (!callbackWasCalled)
				{
					callback && callback();
					callbackWasCalled = true;
				}

			}
		}, doc);
	}
}

function loadAsyncEmulation(items, callback, doc)
{
	function onPreload(asset)
	{
		asset.state = PRELOADED;
		if (BX.type.isArray(asset.onpreload) && asset.onpreload)
		{
			for (var i = 0; i < asset.onpreload.length; i++)
			{
				asset.onpreload[i].call();
			}
		}
	}

	function preLoad(asset)
	{
		if (asset.state === undefined)
		{
			asset.state = PRELOADING;
			asset.onpreload = [];

			loadAsset(
				{ url: asset.url, type: "cache", ext: asset.ext},
				function () { onPreload(asset); },
				doc
			);
		}
	}

	if (!BX.type.isArray(items))
	{
		return;
	}

	if (!BX.type.isFunction(callback))
	{
		callback = null;
	}

	var rest = [].slice.call(items, 1);
	for (var i = 0; i < rest.length; i++)
	{
		preLoad(getAsset(rest[i]));
	}

	load(getAsset(items[0]), items.length === 1 ? callback : function () {
		loadAsyncEmulation.apply(null, [rest, callback, doc]);
	}, doc);
}

function load(asset, callback, doc)
{
	callback = callback || BX.DoNothing;

	if (asset.state === LOADED)
	{
		callback();
		return;
	}

	if (asset.state === PRELOADING)
	{
		asset.onpreload.push(function () {
			load(asset, callback, doc);
		});
		return;
	}

	asset.state = LOADING;

	loadAsset(
		asset,
		function () {
			asset.state = LOADED;
			callback();
		},
		doc
	);
}

function loadAsset(asset, callback, doc)
{
	callback = callback || BX.DoNothing;

	function error(event)
	{
		ele.onload = ele.onreadystatechange = ele.onerror = null;
		callback();
	}

	function process(event)
	{
		event = event || window.event;
		if (event.type === "load" || (/loaded|complete/.test(ele.readyState) && (!doc.documentMode || doc.documentMode < 9)))
		{
			window.clearTimeout(asset.errorTimeout);
			window.clearTimeout(asset.cssTimeout);
			ele.onload = ele.onreadystatechange = ele.onerror = null;
			callback();
		}
	}

	function isCssLoaded()
	{
		if (asset.state !== LOADED && asset.cssRetries <= 20)
		{
			for (var i = 0, l = doc.styleSheets.length; i < l; i++)
			{
				if (doc.styleSheets[i].href === ele.href)
				{
					process({"type": "load"});
					return;
				}
			}

			asset.cssRetries++;
			asset.cssTimeout = window.setTimeout(isCssLoaded, 250);
		}
	}

	var ele;
	var ext = BX.type.isNotEmptyString(asset.ext) ? asset.ext : BX.util.getExtension(asset.url);

	if (ext === "css")
	{
		ele = doc.createElement("link");
		ele.type = "text/" + (asset.type || "css");
		ele.rel = "stylesheet";
		ele.href = asset.url;

		asset.cssRetries = 0;
		asset.cssTimeout = window.setTimeout(isCssLoaded, 500);
	}
	else
	{
		ele = doc.createElement("script");
		ele.type = "text/" + (asset.type || "javascript");
		ele.src = asset.url;
	}

	ele.onload = ele.onreadystatechange = process;
	ele.onerror = error;

	ele.async = false;
	ele.defer = false;

	asset.errorTimeout = window.setTimeout(function () {
		error({type: "timeout"});
	}, 7000);

	if (ext === "css")
	{
		cssList.push(normalizeMinUrl(normalizeUrl(asset.url)));
	}
	else
	{
		jsList.push(normalizeMinUrl(normalizeUrl(asset.url)));
	}

	var templateLink = null;
	var head = doc.head || doc.getElementsByTagName("head")[0];
	if (ext === "css" && (templateLink = getTemplateLink(head)) !== null)
	{
		templateLink.parentNode.insertBefore(ele, templateLink);
	}
	else
	{
		head.insertBefore(ele, head.lastChild);
	}
}

function getAsset(item)
{
	var asset = {};
	if (typeof item === "object")
	{
		asset = item;
		asset.name = asset.name ? asset.name : BX.util.hashCode(item.url);
	}
	else
	{
		asset = { name: BX.util.hashCode(item), url : item };
	}

	var ext = BX.type.isNotEmptyString(asset.ext) ? asset.ext : BX.util.getExtension(asset.url);
	if ((ext === "css" && isCssLoaded(asset.url)) || isScriptLoaded(asset.url))
	{
		asset.state = LOADED;
	}

	var existing = assets[asset.name];
	if (existing && existing.url === asset.url)
	{
		return existing;
	}

	assets[asset.name] = asset;
	return asset;
}

function normalizeUrl(url)
{
	if (!BX.type.isNotEmptyString(url))
	{
		return "";
	}

	url = BX.getJSPath(url);
	url = url.replace(/\?[0-9]*$/, "");

	return url;
}

function normalizeMinUrl(url)
{
	if (!BX.type.isNotEmptyString(url))
	{
		return "";
	}

	var minPos = url.indexOf(".min");
	return minPos >= 0 ? url.substr(0, minPos) + url.substr(minPos + 4) : url;
}

function isCssLoaded(fileSrc)
{
	initCssList();

	fileSrc = normalizeUrl(fileSrc);
	var fileSrcMin = normalizeMinUrl(fileSrc);

	return (fileSrc !== fileSrcMin && BX.util.in_array(fileSrcMin, cssList)) || BX.util.in_array(fileSrc, cssList);
}

function initCssList()
{
	if(!cssInit)
	{
		var linksCol = document.getElementsByTagName('link');

		if(!!linksCol && linksCol.length > 0)
		{
			for(var i = 0; i < linksCol.length; i++)
			{
				var href = linksCol[i].getAttribute('href');
				if (BX.type.isNotEmptyString(href))
				{
					href = normalizeMinUrl(normalizeUrl(href));
					cssList.push(href);
				}
			}
		}
		cssInit = true;
	}
}

function getTemplateLink(head)
{
	var findLink = function(tag)
	{
		var links = head.getElementsByTagName(tag);
		for (var i = 0, length = links.length; i < length; i++)
		{
			var templateStyle = links[i].getAttribute("data-template-style");
			if (BX.type.isNotEmptyString(templateStyle) && templateStyle == "true")
			{
				return links[i];
			}
		}

		return null;
	};

	var link = findLink("link");
	if (link === null)
	{
		link = findLink("style");
	}

	return link;
}

function isScriptLoaded(fileSrc)
{
	initJsList();

	fileSrc = normalizeUrl(fileSrc);
	var fileSrcMin = normalizeMinUrl(fileSrc);

	return (fileSrc !== fileSrcMin && BX.util.in_array(fileSrcMin, jsList)) || BX.util.in_array(fileSrc, jsList);
}

function initJsList()
{
	if(!jsInit)
	{
		var scriptCol = document.getElementsByTagName('script');

		if(!!scriptCol && scriptCol.length > 0)
		{
			for(var i=0; i<scriptCol.length; i++)
			{
				var src = scriptCol[i].getAttribute('src');

				if (BX.type.isNotEmptyString(src))
				{
					src = normalizeMinUrl(normalizeUrl(src));
					jsList.push(src);
				}
			}
		}
		jsInit = true;
	}
}

BX.reload = function(back_url, bAddClearCache)
{
	if (back_url === true)
	{
		bAddClearCache = true;
		back_url = null;
	}

	var new_href = back_url || top.location.href;

	var hashpos = new_href.indexOf('#'), hash = '';

	if (hashpos != -1)
	{
		hash = new_href.substr(hashpos);
		new_href = new_href.substr(0, hashpos);
	}

	if (bAddClearCache && new_href.indexOf('clear_cache=Y') < 0)
		new_href += (new_href.indexOf('?') == -1 ? '?' : '&') + 'clear_cache=Y';

	if (hash)
	{
		// hack for clearing cache in ajax mode components with history emulation
		if (bAddClearCache && (hash.substr(0, 5) == 'view/' || hash.substr(0, 6) == '#view/') && hash.indexOf('clear_cache%3DY') < 0)
			hash += (hash.indexOf('%3F') == -1 ? '%3F' : '%26') + 'clear_cache%3DY';

		new_href = new_href.replace(/(\?|\&)_r=[\d]*/, '');
		new_href += (new_href.indexOf('?') == -1 ? '?' : '&') + '_r='+Math.round(Math.random()*10000) + hash;
	}

	top.location.href = new_href;
};

BX.clearCache = function()
{
	BX.showWait();
	BX.reload(true);
};

BX.template = function(tpl, callback, bKillTpl)
{
	BX.ready(function() {
		_processTpl(BX(tpl), callback, bKillTpl);
	});
};

BX.isAmPmMode = function()
{
	return (BX.message('FORMAT_DATETIME').match('T') != null);
};

BX.formatDate = function(date, format)
{
	date = date || new Date();

	var bTime = date.getHours() || date.getMinutes() || date.getSeconds(),
		str = !!format
			? format :
			(bTime ? BX.message('FORMAT_DATETIME') : BX.message('FORMAT_DATE')
		);

	return str.replace(/YYYY/ig, date.getFullYear())
		.replace(/MMMM/ig, BX.util.str_pad_left((date.getMonth()+1).toString(), 2, '0'))
		.replace(/MM/ig, BX.util.str_pad_left((date.getMonth()+1).toString(), 2, '0'))
		.replace(/DD/ig, BX.util.str_pad_left(date.getDate().toString(), 2, '0'))
		.replace(/HH/ig, BX.util.str_pad_left(date.getHours().toString(), 2, '0'))
		.replace(/MI/ig, BX.util.str_pad_left(date.getMinutes().toString(), 2, '0'))
		.replace(/SS/ig, BX.util.str_pad_left(date.getSeconds().toString(), 2, '0'));
};
BX.formatName = function(user, template, login)
{
	user = user || {};
	template = (template || '');
	var replacement = {
		TITLE : (user["TITLE"] || ''),
		NAME : (user["NAME"] || ''),
		LAST_NAME : (user["LAST_NAME"] || ''),
		SECOND_NAME : (user["SECOND_NAME"] || ''),
		LOGIN : (user["LOGIN"] || ''),
		NAME_SHORT : user["NAME"] ? user["NAME"].substr(0, 1) + '.' : '',
		LAST_NAME_SHORT : user["LAST_NAME"] ? user["LAST_NAME"].substr(0, 1) + '.' : '',
		SECOND_NAME_SHORT : user["SECOND_NAME"] ? user["SECOND_NAME"].substr(0, 1) + '.' : '',
		EMAIL : (user["EMAIL"] || ''),
		ID : (user["ID"] || ''),
		NOBR : "",
		'/NOBR' : ""
	}, result = template;
	for (var ii in replacement)
	{
		if (replacement.hasOwnProperty(ii))
		{
			result = result.replace("#" + ii+ "#", replacement[ii])
		}
	}
	result = result.replace(/([\s]+)/gi, " ").trim();
	if (result == "")
	{
		result = (login == "Y" ? replacement["LOGIN"] : "");
		result = (result == "" ? "Noname" : result);
	}
	return result;
};

BX.getNumMonth = function(month)
{
	var wordMonthCut = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
	var wordMonth = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

	var q = month.toUpperCase();
	for (i = 1; i <= 12; i++)
	{
		if (q == BX.message('MON_'+i).toUpperCase() || q == BX.message('MONTH_'+i).toUpperCase() || q == wordMonthCut[i-1].toUpperCase() || q == wordMonth[i-1].toUpperCase())
		{
			return i;
		}
	}
	return month;
};

BX.parseDate = function(str, bUTC, formatDate, formatDatetime)
{
	if (BX.type.isNotEmptyString(str))
	{
		if (!formatDate)
			formatDate = BX.message('FORMAT_DATE');
		if (!formatDatetime)
			formatDatetime = BX.message('FORMAT_DATETIME');

		var regMonths = '';
		for (i = 1; i <= 12; i++)
		{
			regMonths = regMonths + '|' + BX.message('MON_'+i);
		}

		var expr = new RegExp('([0-9]+|[a-z]+' + regMonths + ')', 'ig');
		var aDate = str.match(expr),
			aFormat = formatDate.match(/(DD|MI|MMMM|MM|M|YYYY)/ig),
			i, cnt,
			aDateArgs=[], aFormatArgs=[],
			aResult={};

		if (!aDate)
			return null;

		if(aDate.length > aFormat.length)
		{
			aFormat = formatDatetime.match(/(DD|MI|MMMM|MM|M|YYYY|HH|H|SS|TT|T|GG|G)/ig);
		}

		for(i = 0, cnt = aDate.length; i < cnt; i++)
		{
			if(BX.util.trim(aDate[i]) != '')
			{
				aDateArgs[aDateArgs.length] = aDate[i];
			}
		}

		for(i = 0, cnt = aFormat.length; i < cnt; i++)
		{
			if(BX.util.trim(aFormat[i]) != '')
			{
				aFormatArgs[aFormatArgs.length] = aFormat[i];
			}
		}


		var m = BX.util.array_search('MMMM', aFormatArgs);
		if (m > 0)
		{
			aDateArgs[m] = BX.getNumMonth(aDateArgs[m]);
			aFormatArgs[m] = "MM";
		}
		else
		{
			m = BX.util.array_search('M', aFormatArgs);
			if (m > 0)
			{
				aDateArgs[m] = BX.getNumMonth(aDateArgs[m]);
				aFormatArgs[m] = "MM";
			}
		}

		for(i = 0, cnt = aFormatArgs.length; i < cnt; i++)
		{
			var k = aFormatArgs[i].toUpperCase();
			aResult[k] = k == 'T' || k == 'TT' ? aDateArgs[i] : parseInt(aDateArgs[i], 10);
		}

		if(aResult['DD'] > 0 && aResult['MM'] > 0 && aResult['YYYY'] > 0)
		{
			var d = new Date();

			if(bUTC)
			{
				d.setUTCDate(1);
				d.setUTCFullYear(aResult['YYYY']);
				d.setUTCMonth(aResult['MM'] - 1);
				d.setUTCDate(aResult['DD']);
				d.setUTCHours(0, 0, 0);
			}
			else
			{
				d.setDate(1);
				d.setFullYear(aResult['YYYY']);
				d.setMonth(aResult['MM'] - 1);
				d.setDate(aResult['DD']);
				d.setHours(0, 0, 0);
			}

			if(
				(!isNaN(aResult['HH']) || !isNaN(aResult['GG']) || !isNaN(aResult['H']) || !isNaN(aResult['G']))
					&& !isNaN(aResult['MI'])
			)
			{
				if (!isNaN(aResult['H']) || !isNaN(aResult['G']))
				{
					var bPM = (aResult['T']||aResult['TT']||'am').toUpperCase()=='PM';
					var h = parseInt(aResult['H']||aResult['G']||0, 10);
					if(bPM)
					{
						aResult['HH'] = h + (h == 12 ? 0 : 12);
					}
					else
					{
						aResult['HH'] = h < 12 ? h : 0;
					}
				}
				else
				{
					aResult['HH'] = parseInt(aResult['HH']||aResult['GG']||0, 10);
				}

				if (isNaN(aResult['SS']))
					aResult['SS'] = 0;

				if(bUTC)
				{
					d.setUTCHours(aResult['HH'], aResult['MI'], aResult['SS']);
				}
				else
				{
					d.setHours(aResult['HH'], aResult['MI'], aResult['SS']);
				}
			}

			return d;
		}
	}

	return null;
};

BX.selectUtils =
{
	addNewOption: function(oSelect, opt_value, opt_name, do_sort, check_unique)
	{
		oSelect = BX(oSelect);
		if(oSelect)
		{
			var n = oSelect.length;
			if(check_unique !== false)
			{
				for(var i=0;i<n;i++)
				{
					if(oSelect[i].value==opt_value)
					{
						return;
					}
				}
			}

			oSelect.options[n] = new Option(opt_name, opt_value, false, false);
		}

		if(do_sort === true)
		{
			this.sortSelect(oSelect);
		}
	},

	deleteOption: function(oSelect, opt_value)
	{
		oSelect = BX(oSelect);
		if(oSelect)
		{
			for(var i=0;i<oSelect.length;i++)
			{
				if(oSelect[i].value==opt_value)
				{
					oSelect.remove(i);
					break;
				}
			}
		}
	},

	deleteSelectedOptions: function(oSelect)
	{
		oSelect = BX(oSelect);
		if(oSelect)
		{
			var i=0;
			while(i<oSelect.length)
			{
				if(oSelect[i].selected)
				{
					oSelect[i].selected=false;
					oSelect.remove(i);
				}
				else
				{
					i++;
				}
			}
		}
	},

	deleteAllOptions: function(oSelect)
	{
		oSelect = BX(oSelect);
		if(oSelect)
		{
			for(var i=oSelect.length-1; i>=0; i--)
			{
				oSelect.remove(i);
			}
		}
	},

	optionCompare: function(record1, record2)
	{
		var value1 = record1.optText.toLowerCase();
		var value2 = record2.optText.toLowerCase();
		if (value1 > value2) return(1);
		if (value1 < value2) return(-1);
		return(0);
	},

	sortSelect: function(oSelect)
	{
		oSelect = BX(oSelect);
		if(oSelect)
		{
			var myOptions = [];
			var n = oSelect.options.length;
			var i;
			for (i=0;i<n;i++)
			{
				myOptions[i] = {
					optText:oSelect[i].text,
					optValue:oSelect[i].value
				};
			}
			myOptions.sort(this.optionCompare);
			oSelect.length=0;
			n = myOptions.length;
			for(i=0;i<n;i++)
			{
				oSelect[i] = new Option(myOptions[i].optText, myOptions[i].optValue, false, false);
			}
		}
	},

	selectAllOptions: function(oSelect)
	{
		oSelect = BX(oSelect);
		if(oSelect)
		{
			var n = oSelect.length;
			for(var i=0;i<n;i++)
			{
				oSelect[i].selected=true;
			}
		}
	},

	selectOption: function(oSelect, opt_value)
	{
		oSelect = BX(oSelect);
		if(oSelect)
		{
			var n = oSelect.length;
			for(var i=0;i<n;i++)
			{
				oSelect[i].selected = (oSelect[i].value == opt_value);
			}
		}
	},

	addSelectedOptions: function(oSelect, to_select_id, check_unique, do_sort)
	{
		oSelect = BX(oSelect);
		if(!oSelect)
			return;
		var n = oSelect.length;
		for(var i=0; i<n; i++)
			if(oSelect[i].selected)
				this.addNewOption(to_select_id, oSelect[i].value, oSelect[i].text, do_sort, check_unique);
	},

	moveOptionsUp: function(oSelect)
	{
		oSelect = BX(oSelect);
		if(!oSelect)
			return;
		var n = oSelect.length;
		for(var i=0; i<n; i++)
		{
			if(oSelect[i].selected && i>0 && oSelect[i-1].selected == false)
			{
				var option = new Option(oSelect[i].text, oSelect[i].value);
				oSelect[i] = new Option(oSelect[i-1].text, oSelect[i-1].value);
				oSelect[i].selected = false;
				oSelect[i-1] = option;
				oSelect[i-1].selected = true;
			}
		}
	},

	moveOptionsDown: function(oSelect)
	{
		oSelect = BX(oSelect);
		if(!oSelect)
			return;
		var n = oSelect.length;
		for(var i=n-1; i>=0; i--)
		{
			if(oSelect[i].selected && i<n-1 && oSelect[i+1].selected == false)
			{
				var option = new Option(oSelect[i].text, oSelect[i].value);
				oSelect[i] = new Option(oSelect[i+1].text, oSelect[i+1].value);
				oSelect[i].selected = false;
				oSelect[i+1] = option;
				oSelect[i+1].selected = true;
			}
		}
	}
};

BX.getEventTarget = function(e)
{
	if(e.target)
	{
		return e.target;
	}
	else if(e.srcElement)
	{
		return e.srcElement;
	}
	return null;
};

/******* HINT ***************/
// if function has 2 params - the 2nd one is hint html. otherwise hint_html is third and hint_title - 2nd;
// '<div onmouseover="BX.hint(this, 'This is &lt;b&gt;Hint&lt;/b&gt;')"'>;
// BX.hint(el, 'This is <b>Hint</b>') - this won't work, use constructor
BX.hint = function(el, hint_title, hint_html, hint_id)
{
	if (null == hint_html)
	{
		hint_html = hint_title;
		hint_title = '';
	}

	if (null == el.BXHINT)
	{
		el.BXHINT = new BX.CHint({
			parent: el, hint: hint_html, title: hint_title, id: hint_id
		});
		el.BXHINT.Show();
	}
};

BX.hint_replace = function(el, hint_title, hint_html)
{
	if (null == hint_html)
	{
		hint_html = hint_title;
		hint_title = '';
	}

	if (!el || !el.parentNode || !hint_html)
			return null;

	var obHint = new BX.CHint({
		hint: hint_html,
		title: hint_title
	});

	obHint.CreateParent();

	el.parentNode.insertBefore(obHint.PARENT, el);
	el.parentNode.removeChild(el);

	obHint.PARENT.style.marginLeft = '5px';

	return el;
};

BX.CHint = function(params)
{
	this.PARENT = BX(params.parent);

	this.HINT = params.hint;
	this.HINT_TITLE = params.title;

	this.PARAMS = {};
	for (var i in this.defaultSettings)
	{
		if (null == params[i])
			this.PARAMS[i] = this.defaultSettings[i];
		else
			this.PARAMS[i] = params[i];
	}

	if (null != params.id)
		this.ID = params.id;

	this.timer = null;
	this.bInited = false;
	this.msover = true;

	if (this.PARAMS.showOnce)
	{
		this.__show();
		this.msover = false;
		this.timer = setTimeout(BX.proxy(this.__hide, this), this.PARAMS.hide_timeout);
	}
	else if (this.PARENT)
	{
		BX.bind(this.PARENT, 'mouseover', BX.proxy(this.Show, this));
		BX.bind(this.PARENT, 'mouseout', BX.proxy(this.Hide, this));
	}

	BX.addCustomEvent('onMenuOpen', BX.delegate(this.disable, this));
	BX.addCustomEvent('onMenuClose', BX.delegate(this.enable, this));
};

BX.CHint.prototype.defaultSettings = {
	show_timeout: 1000,
	hide_timeout: 500,
	dx: 2,
	showOnce: false,
	preventHide: true,
	min_width: 250
};

BX.CHint.prototype.CreateParent = function(element, params)
{
	if (this.PARENT)
	{
		BX.unbind(this.PARENT, 'mouseover', BX.proxy(this.Show, this));
		BX.unbind(this.PARENT, 'mouseout', BX.proxy(this.Hide, this));
	}

	if (!params) params = {};
	var type = 'icon';

	if (params.type && (params.type == "link" || params.type == "icon"))
		type = params.type;

	if (element)
		type = "element";

	if (type == "icon")
	{
		element = BX.create('IMG', {
			props: {
				src: params.iconSrc
					? params.iconSrc
					: "/bitrix/js/main/core/images/hint.gif"
			}
		});
	}
	else if (type == "link")
	{
		element = BX.create("A", {
			props: {href: 'javascript:void(0)'},
			html: '[?]'
		});
	}

	this.PARENT = element;

	BX.bind(this.PARENT, 'mouseover', BX.proxy(this.Show, this));
	BX.bind(this.PARENT, 'mouseout', BX.proxy(this.Hide, this));

	return this.PARENT;
};

BX.CHint.prototype.Show = function()
{
	this.msover = true;

	if (null != this.timer)
		clearTimeout(this.timer);

	this.timer = setTimeout(BX.proxy(this.__show, this), this.PARAMS.show_timeout);
};

BX.CHint.prototype.Hide = function()
{
	this.msover = false;

	if (null != this.timer)
		clearTimeout(this.timer);

	this.timer = setTimeout(BX.proxy(this.__hide, this), this.PARAMS.hide_timeout);
};

BX.CHint.prototype.__show = function()
{
	if (!this.msover || this.disabled) return;
	if (!this.bInited) this.Init();

	if (this.prepareAdjustPos())
	{
		this.DIV.style.display = 'block';
		this.adjustPos();

		BX.bind(window, 'scroll', BX.proxy(this.__onscroll, this));

		if (this.PARAMS.showOnce)
		{
			this.timer = setTimeout(BX.proxy(this.__hide, this), this.PARAMS.hide_timeout);
		}
	}
};

BX.CHint.prototype.__onscroll = function()
{
	if (!BX.admin || !BX.admin.panel || !BX.admin.panel.isFixed()) return;

	if (this.scrollTimer) clearTimeout(this.scrollTimer);

	this.DIV.style.display = 'none';
	this.scrollTimer = setTimeout(BX.proxy(this.Reopen, this), this.PARAMS.show_timeout);
};

BX.CHint.prototype.Reopen = function()
{
	if (null != this.timer) clearTimeout(this.timer);
	this.timer = setTimeout(BX.proxy(this.__show, this), 50);
};

BX.CHint.prototype.__hide = function()
{
	if (this.msover) return;
	if (!this.bInited) return;

	BX.unbind(window, 'scroll', BX.proxy(this.Reopen, this));

	if (this.PARAMS.showOnce)
	{
		this.Destroy();
	}
	else
	{
		this.DIV.style.display = 'none';
	}
};

BX.CHint.prototype.__hide_immediately = function()
{
	this.msover = false;
	this.__hide();
};

BX.CHint.prototype.Init = function()
{
	this.DIV = document.body.appendChild(BX.create('DIV', {
		props: {className: 'bx-panel-tooltip'},
		style: {display: 'none'},
		children: [
			BX.create('DIV', {
				props: {className: 'bx-panel-tooltip-top-border'},
				html: '<div class="bx-panel-tooltip-corner bx-panel-tooltip-left-corner"></div><div class="bx-panel-tooltip-border"></div><div class="bx-panel-tooltip-corner bx-panel-tooltip-right-corner"></div>'
			}),
			(this.CONTENT = BX.create('DIV', {
				props: {className: 'bx-panel-tooltip-content'},
				children: [
					BX.create('DIV', {
						props: {className: 'bx-panel-tooltip-underlay'},
						children: [
							BX.create('DIV', {props: {className: 'bx-panel-tooltip-underlay-bg'}})
						]
					})
				]
			})),

			BX.create('DIV', {
				props: {className: 'bx-panel-tooltip-bottom-border'},
				html: '<div class="bx-panel-tooltip-corner bx-panel-tooltip-left-corner"></div><div class="bx-panel-tooltip-border"></div><div class="bx-panel-tooltip-corner bx-panel-tooltip-right-corner"></div>'
			})
		]
	}));

	if (this.ID)
	{
		this.CONTENT.insertBefore(BX.create('A', {
			attrs: {href: 'javascript:void(0)'},
			props: {className: 'bx-panel-tooltip-close'},
			events: {click: BX.delegate(this.Close, this)}
		}), this.CONTENT.firstChild)
	}

	if (this.HINT_TITLE)
	{
		this.CONTENT.appendChild(
			BX.create('DIV', {
				props: {className: 'bx-panel-tooltip-title'},
				text: this.HINT_TITLE
			})
		)
	}

	if (this.HINT)
	{
		this.CONTENT_TEXT = this.CONTENT.appendChild(BX.create('DIV', {props: {className: 'bx-panel-tooltip-text'}})).appendChild(BX.create('SPAN', {html: this.HINT}));
	}

	if (this.PARAMS.preventHide)
	{
		BX.bind(this.DIV, 'mouseout', BX.proxy(this.Hide, this));
		BX.bind(this.DIV, 'mouseover', BX.proxy(this.Show, this));
	}

	this.bInited = true;
};

BX.CHint.prototype.setContent = function(content)
{
	this.HINT = content;

	if (this.CONTENT_TEXT)
		this.CONTENT_TEXT.innerHTML = this.HINT;
	else
		this.CONTENT_TEXT = this.CONTENT.appendChild(BX.create('DIV', {props: {className: 'bx-panel-tooltip-text'}})).appendChild(BX.create('SPAN', {html: this.HINT}));
};

BX.CHint.prototype.prepareAdjustPos = function()
{
	this._wnd = {scrollPos: BX.GetWindowScrollPos(),scrollSize:BX.GetWindowScrollSize()};
	return BX.style(this.PARENT, 'display') != 'none';
};

BX.CHint.prototype.getAdjustPos = function()
{
	var res = {}, pos = BX.pos(this.PARENT), min_top = 0;

	res.top = pos.bottom + this.PARAMS.dx;

	if (BX.admin && BX.admin.panel.DIV)
	{
		min_top = BX.admin.panel.DIV.offsetHeight + this.PARAMS.dx;

		if (BX.admin.panel.isFixed())
		{
			min_top += this._wnd.scrollPos.scrollTop;
		}
	}

	if (res.top < min_top)
		res.top = min_top;
	else
	{
		if (res.top + this.DIV.offsetHeight > this._wnd.scrollSize.scrollHeight)
			res.top = pos.top - this.PARAMS.dx - this.DIV.offsetHeight;
	}

	res.left = pos.left;
	if (pos.left < this.PARAMS.dx)
		pos.left = this.PARAMS.dx;
	else
	{
		var floatWidth = this.DIV.offsetWidth;

		var max_left = this._wnd.scrollSize.scrollWidth - floatWidth - this.PARAMS.dx;

		if (res.left > max_left)
			res.left = max_left;
	}

	return res;
};

BX.CHint.prototype.adjustWidth = function()
{
	if (this.bWidthAdjusted) return;

	var w = this.DIV.offsetWidth, h = this.DIV.offsetHeight;

	if (w > this.PARAMS.min_width)
		w = Math.round(Math.sqrt(1.618*w*h));

	if (w < this.PARAMS.min_width)
		w = this.PARAMS.min_width;

	this.DIV.style.width = w + "px";

	if (this._adjustWidthInt)
		clearInterval(this._adjustWidthInt);
	this._adjustWidthInt = setInterval(BX.delegate(this._adjustWidthInterval, this), 5);

	this.bWidthAdjusted = true;
};

BX.CHint.prototype._adjustWidthInterval = function()
{
	if (!this.DIV || this.DIV.style.display == 'none')
		clearInterval(this._adjustWidthInt);

	var
		dW = 20,
		maxWidth = 1500,
		w = this.DIV.offsetWidth,
		w1 = this.CONTENT_TEXT.offsetWidth;

	if (w > 0 && w1 > 0 && w - w1 < dW && w < maxWidth)
	{
		this.DIV.style.width = (w + dW) + "px";
		return;
	}

	clearInterval(this._adjustWidthInt);
};

BX.CHint.prototype.adjustPos = function()
{
	this.adjustWidth();

	var pos = this.getAdjustPos();

	this.DIV.style.top = pos.top + 'px';
	this.DIV.style.left = pos.left + 'px';
};

BX.CHint.prototype.Close = function()
{
	if (this.ID && BX.WindowManager)
		BX.WindowManager.saveWindowOptions(this.ID, {display: 'off'});
	this.__hide_immediately();
	this.Destroy();
};

BX.CHint.prototype.Destroy = function()
{
	if (this.PARENT)
	{
		BX.unbind(this.PARENT, 'mouseover', BX.proxy(this.Show, this));
		BX.unbind(this.PARENT, 'mouseout', BX.proxy(this.Hide, this));
	}

	if (this.DIV)
	{
		BX.unbind(this.DIV, 'mouseover', BX.proxy(this.Show, this));
		BX.unbind(this.DIV, 'mouseout', BX.proxy(this.Hide, this));

		BX.cleanNode(this.DIV, true);
	}
};

BX.CHint.prototype.enable = function(){this.disabled = false;};
BX.CHint.prototype.disable = function(){this.__hide_immediately(); this.disabled = true;};

/* ready */
if (document.addEventListener)
{
	__readyHandler = function()
	{
		document.removeEventListener("DOMContentLoaded", __readyHandler, false);
		runReady();
	}
}
else if (document.attachEvent)
{
	__readyHandler = function()
	{
		if (document.readyState === "complete")
		{
			document.detachEvent("onreadystatechange", __readyHandler);
			runReady();
		}
	}
}

function bindReady()
{
	if (!readyBound)
	{
		readyBound = true;

		if (document.readyState === "complete")
		{
			return runReady();
		}

		if (document.addEventListener)
		{
			document.addEventListener("DOMContentLoaded", __readyHandler, false);
			window.addEventListener("load", runReady, false);
		}
		else if (document.attachEvent) // IE
		{
			document.attachEvent("onreadystatechange", __readyHandler);
			window.attachEvent("onload", runReady);

			var toplevel = false;
			try {toplevel = (window.frameElement == null);} catch(e) {}

			if (document.documentElement.doScroll && toplevel)
				doScrollCheck();
		}
	}

	return null;
}


function runReady()
{
	if (!BX.isReady)
	{
		if (!document.body)
			return setTimeout(runReady, 15);

		BX.isReady = true;

		if (readyList && readyList.length > 0)
		{
			var fn, i = 0;
			while (readyList && (fn = readyList[i++]))
			{
				try{
					fn.call(document);
				}
				catch(e){
					BX.debug('BX.ready error: ', e);
				}
			}

			readyList = null;
		}

		// TODO: check ready handlers binded some other way;
	}
	return null;
}

// hack for IE
function doScrollCheck()
{
	if (BX.isReady)
		return;

	try {document.documentElement.doScroll("left");} catch( error ) {setTimeout(doScrollCheck, 1); return;}

	runReady();
}
/* \ready */

function _adjustWait()
{
	if (!this.bxmsg) return;

	var arContainerPos = BX.pos(this),
		div_top = arContainerPos.top;

	if (div_top < BX.GetDocElement().scrollTop)
		div_top = BX.GetDocElement().scrollTop + 5;

	this.bxmsg.style.top = (div_top + 5) + 'px';

	if (this == BX.GetDocElement())
	{
		this.bxmsg.style.right = '5px';
	}
	else
	{
		this.bxmsg.style.left = (arContainerPos.right - this.bxmsg.offsetWidth - 5) + 'px';
	}
}

function _checkDisplay(ob, displayType)
{
	if (typeof displayType != 'undefined')
		ob.BXDISPLAY = displayType;

	var d = ob.style.display || BX.style(ob, 'display');
	if (d != 'none')
	{
		ob.BXDISPLAY = ob.BXDISPLAY || d;
		return true;
	}
	else
	{
		ob.BXDISPLAY = ob.BXDISPLAY || 'block';
		return false;
	}
}

function _processTpl(tplNode, cb, bKillTpl)
{
	if (tplNode)
	{
		if (bKillTpl)
			tplNode.parentNode.removeChild(tplNode);

		var res = {}, nodes = BX.findChildren(tplNode, {attribute: 'data-role'}, true);

		for (var i = 0, l = nodes.length; i < l; i++)
		{
			res[nodes[i].getAttribute('data-role')] = nodes[i];
		}

		cb.apply(tplNode, [res]);
	}
}

function _checkNode(obj, params)
{
	params = params || {};

	if (BX.type.isFunction(params))
		return params.call(window, obj);

	if (!params.allowTextNodes && !BX.type.isElementNode(obj))
		return false;
	var i,j,len;
	for (i in params)
	{
		if(params.hasOwnProperty(i))
		{
			switch(i)
			{
				case 'tag':
				case 'tagName':
					if (BX.type.isString(params[i]))
					{
						if (obj.tagName.toUpperCase() != params[i].toUpperCase())
							return false;
					}
					else if (params[i] instanceof RegExp)
					{
						if (!params[i].test(obj.tagName))
							return false;
					}
				break;

				case 'class':
				case 'className':
					if (BX.type.isString(params[i]))
					{
						if (!BX.hasClass(obj, params[i]))
							return false;
					}
					else if (params[i] instanceof RegExp)
					{
						if (!BX.type.isString(obj.className) || !params[i].test(obj.className))
							return false;
					}
				break;

				case 'attr':
				case 'attrs':
				case 'attribute':
					if (BX.type.isString(params[i]))
					{
						if (!obj.getAttribute(params[i]))
							return false;
					}
					else if (BX.type.isArray(params[i]))
					{
						for (j = 0, len = params[i].length; j < len; j++)
						{
							if (params[i] && !obj.getAttribute(params[i]))
								return false;
						}
					}
					else
					{
						for (j in params[i])
						{
							if(params[i].hasOwnProperty(j))
							{
								var q = obj.getAttribute(j);
								if (params[i][j] instanceof RegExp)
								{
									if (!BX.type.isString(q) || !params[i][j].test(q))
									{
										return false;
									}
								}
								else
								{
									if (q != '' + params[i][j])
									{
										return false;
									}
								}
							}
						}
					}
				break;

				case 'property':
				case 'props':
					if (BX.type.isString(params[i]))
					{
						if (!obj[params[i]])
							return false;
					}
					else if (BX.type.isArray(params[i]))
					{
						for (j = 0, len = params[i].length; j < len; j++)
						{
							if (params[i] && !obj[params[i]])
								return false;
						}
					}
					else
					{
						for (j in params[i])
						{
							if (BX.type.isString(params[i][j]))
							{
								if (obj[j] != params[i][j])
									return false;
							}
							else if (params[i][j] instanceof RegExp)
							{
								if (!BX.type.isString(obj[j]) || !params[i][j].test(obj[j]))
									return false;
							}
						}
					}
				break;

				case 'callback':
					return params[i](obj);
			}
		}
	}

	return true;
}

/* garbage collector */
function Trash()
{
	var i,len;

	for (i = 0, len = garbageCollectors.length; i<len; i++)
	{
		try {
			garbageCollectors[i].callback.apply(garbageCollectors[i].context || window);
			delete garbageCollectors[i];
			garbageCollectors[i] = null;
		} catch (e) {}
	}

	try {BX.unbindAll();} catch(e) {}
/*
	for (i = 0, len = proxyList.length; i < len; i++)
	{
		try {
			delete proxyList[i];
			proxyList[i] = null;
		} catch (e) {}
	}
*/
}

if(window.attachEvent) // IE
	window.attachEvent("onunload", Trash);
else if(window.addEventListener) // Gecko / W3C
	window.addEventListener('unload', Trash, false);
else
	window.onunload = Trash;
/* \garbage collector */

// set empty ready handler
BX(BX.DoNothing);
window.BX = BX;
BX.browser.addGlobalClass();

/* data storage */
BX.data = function(node, key, value)
{
	if(typeof node == 'undefined')
		return undefined;

	if(typeof key == 'undefined')
		return undefined;

	if(typeof value != 'undefined')
	{
		// write to manager
		dataStorage.set(node, key, value);
	}
	else
	{
		var data;

		// from manager
		if((data = dataStorage.get(node, key)) != undefined)
		{
			return data;
		}
		else
		{
			// from attribute data-*
			if('getAttribute' in node)
			{
				data = node.getAttribute('data-'+key.toString());
				if(data === null)
				{
					return undefined;
				}
				return data;
			}
		}

		return undefined;
	}
};

BX.DataStorage = function()
{

	this.keyOffset = 1;
	this.data = {};
	this.uniqueTag = 'BX-'+Math.random();

	this.resolve = function(owner, create){
		if(typeof owner[this.uniqueTag] == 'undefined')
			if(create)
			{
				try
				{
					Object.defineProperty(owner, this.uniqueTag, {
						value: this.keyOffset++
					});
				}
				catch(e)
				{
					owner[this.uniqueTag] = this.keyOffset++;
				}
			}
			else
				return undefined;

		return owner[this.uniqueTag];
	};
	this.get = function(owner, key){
		if((owner != document && !BX.type.isElementNode(owner)) || typeof key == 'undefined')
			return undefined;

		owner = this.resolve(owner, false);

		if(typeof owner == 'undefined' || typeof this.data[owner] == 'undefined')
			return undefined;

		return this.data[owner][key];
	};
	this.set = function(owner, key, value){

		if((owner != document && !BX.type.isElementNode(owner)) || typeof value == 'undefined')
			return;

		var o = this.resolve(owner, true);

		if(typeof this.data[o] == 'undefined')
			this.data[o] = {};

		this.data[o][key] = value;
	};
};

// some internal variables for new logic
var dataStorage = new BX.DataStorage();	// manager which BX.data() uses to keep data

BX.LazyLoad = {
	images: [],
	imageStatus: {
		hidden: -2,
		error: -1,
		"undefined": 0,
		inited: 1,
		loaded: 2
	},
	imageTypes: {
		image: 1,
		background: 2
	},

	registerImage: function(id, isImageVisibleCallback)
	{
		if (BX.type.isNotEmptyString(id))
		{
			this.images.push({
				id: id,
				node: null,
				src: null,
				type: null,
				func: BX.type.isFunction(isImageVisibleCallback) ? isImageVisibleCallback : null,
				status: this.imageStatus.undefined
			});
		}
	},

	registerImages: function(ids, isImageVisibleCallback)
	{
		if (BX.type.isArray(ids))
		{
			for (var i = 0, length = ids.length; i < length; i++)
			{
				this.registerImage(ids[i], isImageVisibleCallback);
			}
		}
	},

	showImages: function(checkOwnVisibility)
	{
		var image = null;
		var isImageVisible = false;

		checkOwnVisibility = (checkOwnVisibility !== false);
		for (var i = 0, length = this.images.length; i < length; i++)
		{
			image = this.images[i];

			if (image.status == this.imageStatus.undefined)
			{
				this.initImage(image);
			}

			if (image.status !== this.imageStatus.inited)
			{
				continue;
			}

			if (
				!image.node
				|| !image.node.parentNode
			)
			{
				image.node = null;
				image.status = this.imageStatus.error;
				continue;
			}

			isImageVisible = true;
			if (checkOwnVisibility && image.func)
			{
				isImageVisible = image.func(image);
			}

			if (
				isImageVisible === true
				&& this.isElementVisibleOnScreen(image.node)
			)
			{
				if (image.type == this.imageTypes.image)
				{
					image.node.src = image.src;
				}
				else
				{
					image.node.style.backgroundImage = "url('" + image.src + "')";
				}

				image.node.setAttribute("data-src", "");
				image.status = this.imageStatus.loaded;
			}
		}
	},

	initImage: function(image)
	{
		image.status = this.imageStatus.error;
		var node = BX(image.id);
		if (node)
		{
			var src = node.getAttribute("data-src");
			if (BX.type.isNotEmptyString(src))
			{
				image.node = node;
				image.src = src;
				image.status = this.imageStatus.inited;
				image.type = (image.node.tagName.toLowerCase() == "img"
					? this.imageTypes.image
					: this.imageTypes.background
				);
			}
		}
	},

	isElementVisibleOnScreen: function (element)
	{
		var coords = this.getElementCoords(element);

		var windowTop = window.pageYOffset || document.documentElement.scrollTop;
		var windowBottom = windowTop + document.documentElement.clientHeight;

		coords.bottom = coords.top + element.offsetHeight;

		var topVisible = coords.top > windowTop && coords.top < windowBottom;
		var bottomVisible = coords.bottom < windowBottom && coords.bottom > windowTop;

		return topVisible || bottomVisible;
	},

	isElementVisibleOn2Screens: function(element)
	{
		var coords = this.getElementCoords(element);

		var windowHeight = document.documentElement.clientHeight;
		var windowTop = window.pageYOffset || document.documentElement.scrollTop;
		var windowBottom = windowTop + windowHeight;

		coords.bottom = coords.top + element.offsetHeight;

		windowTop -= windowHeight;
		windowBottom += windowHeight;

		var topVisible = coords.top > windowTop && coords.top < windowBottom;
		var bottomVisible = coords.bottom < windowBottom && coords.bottom > windowTop;

		return topVisible || bottomVisible;
	},

	getElementCoords: function(element)
	{
		var box = element.getBoundingClientRect();

		return {
			originTop: box.top,
			originLeft: box.left,
			top: box.top + window.pageYOffset,
			left: box.left + window.pageXOffset
		};
	},

	onScroll: function()
	{
		BX.LazyLoad.showImages();
	},

	clearImages: function ()
	{
		this.images = [];
	}

};

BX.getCookie = function (name)
{
	var matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));

	return matches ? decodeURIComponent(matches[1]) : undefined;
};

BX.setCookie = function (name, value, options)
{
	options = options || {};

	var expires = options.expires;
	if (typeof(expires) == "number" && expires)
	{
		var currentDate = new Date();
		currentDate.setTime(currentDate.getTime() + expires * 1000);
		expires = options.expires = currentDate;
	}

	if (expires && expires.toUTCString)
	{
		options.expires = expires.toUTCString();
	}

	value = encodeURIComponent(value);

	var updatedCookie = name + "=" + value;

	for (var propertyName in options)
	{
		if (!options.hasOwnProperty(propertyName))
		{
			continue;
		}
		updatedCookie += "; " + propertyName;
		var propertyValue = options[propertyName];
		if (propertyValue !== true)
		{
			updatedCookie += "=" + propertyValue;
		}
	}

	document.cookie = updatedCookie;

	return true;
};

BX.FixFontSize = function(params)
{
	var widthNode, computedStyles, width;

	this.node = null;
	this.prevWindowSize = 0;
	this.prevWrapperSize = 0;
	this.mainWrapper = null;
	this.textWrapper = null;
	this.objList = params.objList;
	this.minFontSizeList = [];
	this.minFontSize = 0;

	if (params.onresize)
	{
		this.prevWindowSize = window.innerWidth || document.documentElement.clientWidth;
		BX.bind(window, 'resize', BX.proxy(BX.throttle(this.onResize, 350),this));
	}

	if (params.onAdaptiveResize)
	{
		widthNode = this.objList[0].scaleBy || this.objList[0].node;
		computedStyles = getComputedStyle(widthNode);
		this.prevWrapperSize = parseInt(computedStyles["width"]) - parseInt(computedStyles["paddingLeft"]) - parseInt(computedStyles["paddingRight"]);
		BX.bind(window, 'resize', BX.proxy(BX.throttle(this.onAdaptiveResize, 350),this));
	}

	this.createTestNodes();
	this.decrease();
};

BX.FixFontSize.prototype =
{
	createTestNodes: function()
	{
		this.textWrapper = BX.create('div',{
			style : {
				display : 'inline-block',
				whiteSpace : 'nowrap'
			}
		});

		this.mainWrapper = BX.create('div',{
			style : {
				height : 0,
				overflow : 'hidden'
			},
			children : [this.textWrapper]
		});

	},
	insertTestNodes: function()
	{
		document.body.appendChild(this.mainWrapper);
	},
	removeTestNodes: function()
	{
		document.body.removeChild(this.mainWrapper);
	},
	decrease: function()
	{
		var width,
			fontSize,
			widthNode,
			computedStyles;

		this.insertTestNodes();

		for(var i=this.objList.length-1; i>=0; i--)
		{
			widthNode = this.objList[i].scaleBy || this.objList[i].node;
			computedStyles = getComputedStyle(widthNode);
			width  = parseInt(computedStyles["width"]) - parseInt(computedStyles["paddingLeft"]) - parseInt(computedStyles["paddingRight"]);
			fontSize = parseInt(getComputedStyle(this.objList[i].node)["font-size"]);

			this.textWrapperSetStyle(this.objList[i].node);

			if(this.textWrapperInsertText(this.objList[i].node))
			{
				while(this.textWrapper.offsetWidth > width && fontSize > 0)
				{
					this.textWrapper.style.fontSize = --fontSize + 'px';
				}

				if(this.objList[i].smallestValue)
				{
					this.minFontSize = this.minFontSize ? Math.min(this.minFontSize, fontSize) : fontSize;

					this.minFontSizeList.push(this.objList[i].node)
				}
				else
				{
					this.objList[i].node.style.fontSize = fontSize + 'px';
				}
			}
		}

		if(this.minFontSizeList.length > 0)
			this.setMinFont();

		this.removeTestNodes();

	},
	increase: function()
	{
		this.insertTestNodes();
		var width,
			fontSize,
			widthNode,
			computedStyles;

		this.insertTestNodes();

		for(var i=this.objList.length-1; i>=0; i--)
		{
			widthNode = this.objList[i].scaleBy || this.objList[i].node;
			computedStyles = getComputedStyle(widthNode);
			width  = parseInt(computedStyles["width"]) - parseInt(computedStyles["paddingLeft"]) - parseInt(computedStyles["paddingRight"]);
			fontSize = parseInt(getComputedStyle(this.objList[i].node)["font-size"]);

			this.textWrapperSetStyle(this.objList[i].node);

			if(this.textWrapperInsertText(this.objList[i].node))
			{
				while(this.textWrapper.offsetWidth < width && fontSize < this.objList[i].maxFontSize)
				{
					this.textWrapper.style.fontSize = ++fontSize + 'px';
				}

				fontSize--;

				if(this.objList[i].smallestValue)
				{
					this.minFontSize = this.minFontSize ? Math.min(this.minFontSize, fontSize) : fontSize;

					this.minFontSizeList.push(this.objList[i].node)
				}
				else
				{
					this.objList[i].node.style.fontSize = fontSize + 'px';
				}
			}
		}

		if(this.minFontSizeList.length > 0)
			this.setMinFont();

		this.removeTestNodes();
	},
	setMinFont : function()
	{
		for(var i = this.minFontSizeList.length-1; i>=0; i--)
		{
			this.minFontSizeList[i].style.fontSize = this.minFontSize + 'px';
		}

		this.minFontSize = 0;
	},
	onResize : function()
	{
		var width = window.innerWidth || document.documentElement.clientWidth;

		if(this.prevWindowSize > width)
			this.decrease();

		else if (this.prevWindowSize < width)
			this.increase();

		this.prevWindowSize = width;
	},
	onAdaptiveResize : function()
	{
		var widthNode = this.objList[0].scaleBy || this.objList[0].node,
			computedStyles = getComputedStyle(widthNode),
			width = parseInt(computedStyles["width"]) - parseInt(computedStyles["paddingLeft"]) - parseInt(computedStyles["paddingRight"]);

		if (this.prevWrapperSize > width)
			this.decrease();
		else if (this.prevWrapperSize < width)
			this.increase();

		this.prevWrapperSize = width;
	},
	textWrapperInsertText : function(node)
	{
		if(node.textContent){
			this.textWrapper.textContent = node.textContent;
			return true;
		}
		else if(node.innerText)
		{
			this.textWrapper.innerText = node.innerText;
			return true;
		}
		else {
			return false;
		}
	},
	textWrapperSetStyle : function(node)
	{
		this.textWrapper.style.fontFamily = getComputedStyle(node)["font-family"];
		this.textWrapper.style.fontSize = getComputedStyle(node)["font-size"];
		this.textWrapper.style.fontStyle = getComputedStyle(node)["font-style"];
		this.textWrapper.style.fontWeight = getComputedStyle(node)["font-weight"];
		this.textWrapper.style.lineHeight = getComputedStyle(node)["line-height"];
	}
};

BX.FixFontSize.init = function(params)
{
	return new BX.FixFontSize(params);
};

if(typeof(BX.ParamBag) === "undefined")
{
	BX.ParamBag = function()
	{
		this._params = {};
	};

	BX.ParamBag.prototype =
	{
		initialize: function(params)
		{
			this._params = params ? params : {};
		},
		getParam: function(name, defaultvalue)
		{
			var p = this._params;
			return typeof(p[name]) != "undefined" ? p[name] : defaultvalue;
		},
		setParam: function(name, value)
		{
			this._params[name] = value;
		},
		clear: function()
		{
			this._params = {};
		}
	};

	BX.ParamBag.create = function(params)
	{
		var self = new BX.ParamBag();
		self.initialize(params);
		return self;
	}
}

if(typeof(BX.Promise) === "undefined")
{
	BX.Promise = function(fn, ctx) // fn is future-reserved
	{
		this.state = null;
		this.value = null;
		this.reason = null;
		this.next = null;
		this.ctx = ctx || this;

		this.onFulfilled = [];
		this.onRejected = [];
	};
	BX.Promise.prototype.fulfill = function(value)
	{
		this.checkState();

		this.value = value;
		this.state = true;
		this.execute();
	};
	BX.Promise.prototype.reject = function(reason)
	{
		this.checkState();

		this.reason = reason;
		this.state = false;
		this.execute();
	};
	BX.Promise.prototype.then = function(onFulfilled, onRejected)
	{
		if(BX.type.isFunction(onFulfilled))
		{
			this.onFulfilled.push(onFulfilled);
		}
		if(BX.type.isFunction(onRejected))
		{
			this.onRejected.push(onRejected);
		}

		if(this.next === null)
		{
			this.next = new BX.Promise(null, this.ctx);
		}

		if(this.state !== null) // if promise was already resolved, execute immediately
		{
			this.execute();
		}

		return this.next;
	};

	BX.Promise.prototype.catch = function(onRejected)
	{
		if(BX.type.isFunction(onRejected))
		{
			this.onRejected.push(onRejected);
		}

		if(this.next === null)
		{
			this.next = new BX.Promise(null, this.ctx);
		}

		if(this.state !== null) // if promise was already resolved, execute immediately
		{
			this.execute();
		}

		return this.next;
	};

	BX.Promise.prototype.setAutoResolve = function(way, ms)
	{
		this.timer = setTimeout(BX.delegate(function(){
			if(this.state === null)
			{
				this[way ? 'fulfill' : 'reject']();
			}
		}, this), ms || 15);
	};
	BX.Promise.prototype.cancelAutoResolve = function()
	{
		clearTimeout(this.timer);
	};
	/**
	 * Resolve function. This function allows promise chaining, like ..then().then()...
	 * Typical usage:
	 *
	 * var p = new Promise();
	 *
	 * p.then(function(value){
	 *  return someValue; // next promise in the chain will be fulfilled with someValue
	 * }).then(function(value){
	 *
	 *  var p1 = new Promise();
	 *  *** some async code here, that eventually resolves p1 ***
	 *
	 *  return p1; // chain will resume when p1 resolved (fulfilled or rejected)
	 * }).then(function(value){
	 *
	 *  // you can also do
	 *  var e = new Error();
	 *  throw e;
	 *  // it will cause next promise to be rejected with e
	 *
	 *  return someOtherValue;
	 * }).then(function(value){
	 *  ...
	 * }, function(reason){
	 *  // promise was rejected with reason
	 * })...;
	 *
	 * p.fulfill('let`s start this chain');
	 *
	 * @param x
	 */
	BX.Promise.prototype.resolve = function(x)
	{
		var this_ = this;

		if(this === x)
		{
			this.reject(new TypeError('Promise cannot fulfill or reject itself')); // avoid recursion
		}
		// allow "pausing" promise chaining until promise x is fulfilled or rejected
		else if(x instanceof BX.Promise)
		{
			x.then(function(value){
				this_.fulfill(value);
			}, function(reason){
				this_.reject(reason);
			});
		}
		else // auto-fulfill this promise
		{
			this.fulfill(x);
		}
	};
	BX.Promise.prototype.execute = function()
	{
		if(this.state === null)
		{
			//then() must not be called before BX.Promise resolve() happens
			return;
		}

		var value = undefined;
		var reason = undefined;
		var x = undefined;
		var k;
		if(this.state === true) // promise was fulfill()-ed
		{
			if(this.onFulfilled.length)
			{
				try
				{
					for(k = 0; k < this.onFulfilled.length; k++)
					{
						x = this.onFulfilled[k].apply(this.ctx, [this.value]);
						if(typeof x != 'undefined')
						{
							value = x;
						}
					}
				}
				catch(e)
				{
					if('console' in window)
					{
						console.dir(e);
					}
					BX.debug(e);

					reason = e; // reject next
				}
			}
			else
			{
				value = this.value; // resolve next
			}
		}
		else if(this.state === false) // promise was reject()-ed
		{
			if(this.onRejected.length)
			{
				try
				{
					for(k = 0; k < this.onRejected.length; k++)
					{
						x = this.onRejected[k].apply(this.ctx, [this.reason]);
						if(typeof x != 'undefined')
						{
							value = x;
						}
					}
				}
				catch(e)
				{
					if('console' in window)
					{
						console.dir(e);
					}
					BX.debug(e);

					reason = e; // reject next
				}
			}
			else
			{
				reason = this.reason; // reject next
			}
		}

		if(this.next !== null)
		{
			if(typeof reason != 'undefined')
			{
				this.next.reject(reason);
			}
			else if(typeof value != 'undefined')
			{
				this.next.resolve(value);
			}
		}
	};
	BX.Promise.prototype.checkState = function()
	{
		if(this.state !== null)
		{
			throw new Error('You can not do fulfill() or reject() multiple times');
		}
	};
}

})(window);


/* End */
;
; /* Start:"a:4:{s:4:"full";s:49:"/bitrix/js/main/core/core_ajax.js?150487723836424";s:6:"source";s:33:"/bitrix/js/main/core/core_ajax.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
;(function(window){

if (window.BX.ajax)
	return;

var
	BX = window.BX,

	tempDefaultConfig = {},
	defaultConfig = {
		method: 'GET', // request method: GET|POST
		dataType: 'html', // type of data loading: html|json|script
		timeout: 0, // request timeout in seconds. 0 for browser-default
		async: true, // whether request is asynchronous or not
		processData: true, // any data processing is disabled if false, only callback call
		scriptsRunFirst: false, // whether to run _all_ found scripts before onsuccess call. script tag can have an attribute "bxrunfirst" to turn  this flag on only for itself
		emulateOnload: true,
		skipAuthCheck: false, // whether to check authorization failure (SHOUD be set to true for CORS requests)
		start: true, // send request immediately (if false, request can be started manually via XMLHttpRequest object returned)
		cache: true, // whether NOT to add random addition to URL
		preparePost: true, // whether set Content-Type x-www-form-urlencoded in POST
		headers: false, // add additional headers, example: [{'name': 'If-Modified-Since', 'value': 'Wed, 15 Aug 2012 08:59:08 GMT'}, {'name': 'If-None-Match', 'value': '0'}]
		lsTimeout: 30, //local storage data TTL. useless without lsId.
		lsForce: false //wheter to force query instead of using localStorage data. useless without lsId.
/*
other parameters:
	url: url to get/post
	data: data to post
	onsuccess: successful request callback. BX.proxy may be used.
	onfailure: request failure callback. BX.proxy may be used.
	onprogress: request progress callback. BX.proxy may be used.

	lsId: local storage id - for constantly updating queries which can communicate via localStorage. core_ls.js needed

any of the default parameters can be overridden. defaults can be changed by BX.ajax.Setup() - for all further requests!
*/
	},
	ajax_session = null,
	loadedScripts = {},
	loadedScriptsQueue = [],
	r = {
		'url_utf': /[^\034-\254]+/g,
		'script_self': /\/bitrix\/js\/main\/core\/core(_ajax)*.js$/i,
		'script_self_window': /\/bitrix\/js\/main\/core\/core_window.js$/i,
		'script_self_admin': /\/bitrix\/js\/main\/core\/core_admin.js$/i,
		'script_onload': /window.onload/g
	};

// low-level method
BX.ajax = function(config)
{
	var status, data;

	if (!config || !config.url || !BX.type.isString(config.url))
	{
		return false;
	}

	for (var i in tempDefaultConfig)
		if (typeof (config[i]) == "undefined") config[i] = tempDefaultConfig[i];

	tempDefaultConfig = {};

	for (i in defaultConfig)
		if (typeof (config[i]) == "undefined") config[i] = defaultConfig[i];

	config.method = config.method.toUpperCase();

	if (!BX.localStorage)
		config.lsId = null;

	if (BX.browser.IsIE())
	{
		var result = r.url_utf.exec(config.url);
		if (result)
		{
			do
			{
				config.url = config.url.replace(result, BX.util.urlencode(result));
				result = r.url_utf.exec(config.url);
			} while (result);
		}
	}

	if(config.dataType == 'json')
		config.emulateOnload = false;

	if (!config.cache && config.method == 'GET')
		config.url = BX.ajax._uncache(config.url);

	if (config.method == 'POST' && config.preparePost)
	{
		config.data = BX.ajax.prepareData(config.data);
	}

	var bXHR = true;
	if (config.lsId && !config.lsForce)
	{
		var v = BX.localStorage.get('ajax-' + config.lsId);
		if (v !== null)
		{
			bXHR = false;

			var lsHandler = function(lsData) {
				if (lsData.key == 'ajax-' + config.lsId && lsData.value != 'BXAJAXWAIT')
				{
					var data = lsData.value,
						bRemove = !!lsData.oldValue && data == null;
					if (!bRemove)
						BX.ajax.__run(config, data);
					else if (config.onfailure)
						config.onfailure("timeout");

					BX.removeCustomEvent('onLocalStorageChange', lsHandler);
				}
			};

			if (v == 'BXAJAXWAIT')
			{
				BX.addCustomEvent('onLocalStorageChange', lsHandler);
			}
			else
			{
				setTimeout(function() {lsHandler({key: 'ajax-' + config.lsId, value: v})}, 10);
			}
		}
	}

	if (bXHR)
	{
		config.xhr = BX.ajax.xhr();
		if (!config.xhr) return;

		if (config.lsId)
		{
			BX.localStorage.set('ajax-' + config.lsId, 'BXAJAXWAIT', config.lsTimeout);
		}

		config.xhr.open(config.method, config.url, config.async);

		if (!config.skipBxHeader && !BX.ajax.isCrossDomain(config.url))
		{
			config.xhr.setRequestHeader('Bx-ajax', 'true');
		}

		if (config.method == 'POST' && config.preparePost)
		{
			config.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		}
		if (typeof(config.headers) == "object")
		{
			for (i = 0; i < config.headers.length; i++)
				config.xhr.setRequestHeader(config.headers[i].name, config.headers[i].value);
		}

		if(!!config.onprogress)
		{
			BX.bind(config.xhr, 'progress', config.onprogress);
		}

		var bRequestCompleted = false;
		var onreadystatechange = config.xhr.onreadystatechange = function(additional)
		{
			if (bRequestCompleted)
				return;

			if (additional === 'timeout')
			{
				if (config.onfailure)
				{
					config.onfailure("timeout");
				}

				BX.onCustomEvent(config.xhr, 'onAjaxFailure', ['timeout', '', config]);

				config.xhr.onreadystatechange = BX.DoNothing;
				config.xhr.abort();

				if (config.async)
				{
					config.xhr = null;
				}
			}
			else
			{
				if (config.xhr.readyState == 4 || additional == 'run')
				{
					status = BX.ajax.xhrSuccess(config.xhr) ? "success" : "error";
					bRequestCompleted = true;
					config.xhr.onreadystatechange = BX.DoNothing;

					if (status == 'success')
					{
						var authHeader = (!!config.skipAuthCheck || BX.ajax.isCrossDomain(config.url))
							? false
							: config.xhr.getResponseHeader('X-Bitrix-Ajax-Status');

						if(!!authHeader && authHeader == 'Authorize')
						{
							if (config.onfailure)
							{
								config.onfailure("auth", config.xhr.status);
							}

							BX.onCustomEvent(config.xhr, 'onAjaxFailure', ['auth', config.xhr.status, config]);
						}
						else
						{
							var data = config.xhr.responseText;

							if (config.lsId)
							{
								BX.localStorage.set('ajax-' + config.lsId, data, config.lsTimeout);
							}

							BX.ajax.__run(config, data);
						}
					}
					else
					{
						if (config.onfailure)
						{
							config.onfailure("status", config.xhr.status);
						}

						BX.onCustomEvent(config.xhr, 'onAjaxFailure', ['status', config.xhr.status, config]);
					}

					if (config.async)
					{
						config.xhr = null;
					}
				}
			}
		};

		if (config.async && config.timeout > 0)
		{
			setTimeout(function() {
				if (config.xhr && !bRequestCompleted)
				{
					onreadystatechange("timeout");
				}
			}, config.timeout * 1000);
		}

		if (config.start)
		{
			config.xhr.send(config.data);

			if (!config.async)
			{
				onreadystatechange('run');
			}
		}

		return config.xhr;
	}
};

BX.ajax.xhr = function()
{
	if (window.XMLHttpRequest)
	{
		try {return new XMLHttpRequest();} catch(e){}
	}
	else if (window.ActiveXObject)
	{
		try { return new window.ActiveXObject("Msxml2.XMLHTTP.6.0"); }
			catch(e) {}
		try { return new window.ActiveXObject("Msxml2.XMLHTTP.3.0"); }
			catch(e) {}
		try { return new window.ActiveXObject("Msxml2.XMLHTTP"); }
			catch(e) {}
		try { return new window.ActiveXObject("Microsoft.XMLHTTP"); }
			catch(e) {}
		throw new Error("This browser does not support XMLHttpRequest.");
	}

	return null;
};

BX.ajax.isCrossDomain = function(url, location)
{
	location = location || window.location;

	//Relative URL gets a current protocol
	if (url.indexOf("//") === 0)
	{
		url = location.protocol + url;
	}

	//Fast check
	if (url.indexOf("http") !== 0)
	{
		return false;
	}

	var link = window.document.createElement("a");
	link.href = url;

	return  link.protocol !== location.protocol ||
			link.hostname !== location.hostname ||
			BX.ajax.getHostPort(link.protocol, link.host) !== BX.ajax.getHostPort(location.protocol, location.host);
};

BX.ajax.getHostPort = function(protocol, host)
{
	var match = /:(\d+)$/.exec(host);
	if (match)
	{
		return match[1];
	}
	else
	{
		if (protocol === "http:")
		{
			return "80";
		}
		else if (protocol === "https:")
		{
			return "443";
		}
	}

	return "";
};

BX.ajax.__prepareOnload = function(scripts)
{
	if (scripts.length > 0)
	{
		BX.ajax['onload_' + ajax_session] = null;

		for (var i=0,len=scripts.length;i<len;i++)
		{
			if (scripts[i].isInternal)
			{
				scripts[i].JS = scripts[i].JS.replace(r.script_onload, 'BX.ajax.onload_' + ajax_session);
			}
		}
	}

	BX.CaptureEventsGet();
	BX.CaptureEvents(window, 'load');
};

BX.ajax.__runOnload = function()
{
	if (null != BX.ajax['onload_' + ajax_session])
	{
		BX.ajax['onload_' + ajax_session].apply(window);
		BX.ajax['onload_' + ajax_session] = null;
	}

	var h = BX.CaptureEventsGet();

	if (h)
	{
		for (var i=0; i<h.length; i++)
			h[i].apply(window);
	}
};

BX.ajax.__run = function(config, data)
{
	if (!config.processData)
	{
		if (config.onsuccess)
		{
			config.onsuccess(data);
		}

		BX.onCustomEvent(config.xhr, 'onAjaxSuccess', [data, config]);
	}
	else
	{
		data = BX.ajax.processRequestData(data, config);
	}
};


BX.ajax._onParseJSONFailure = function(data)
{
	this.jsonFailure = true;
	this.jsonResponse = data;
	this.jsonProactive = /^\[WAF\]/.test(data);
};

BX.ajax.processRequestData = function(data, config)
{
	var result, scripts = [], styles = [];
	switch (config.dataType.toUpperCase())
	{
		case 'JSON':

			BX.addCustomEvent(config.xhr, 'onParseJSONFailure', BX.proxy(BX.ajax._onParseJSONFailure, config));
			result = BX.parseJSON(data, config.xhr);
			BX.removeCustomEvent(config.xhr, 'onParseJSONFailure', BX.proxy(BX.ajax._onParseJSONFailure, config));

			if(!!result && BX.type.isArray(result['bxjs']))
			{
				for(var i = 0; i < result['bxjs'].length; i++)
				{
					if(BX.type.isNotEmptyString(result['bxjs'][i]))
					{
						scripts.push({
							"isInternal": false,
							"JS": result['bxjs'][i],
							"bRunFirst": config.scriptsRunFirst
						});
					}
					else
					{
						scripts.push(result['bxjs'][i])
					}
				}
			}

			if(!!result && BX.type.isArray(result['bxcss']))
			{
				styles = result['bxcss'];
			}

		break;
		case 'SCRIPT':
			scripts.push({"isInternal": true, "JS": data, "bRunFirst": config.scriptsRunFirst});
			result = data;
		break;

		default: // HTML
			var ob = BX.processHTML(data, config.scriptsRunFirst);
			result = ob.HTML; scripts = ob.SCRIPT; styles = ob.STYLE;
		break;
	}

	var bSessionCreated = false;
	if (null == ajax_session)
	{
		ajax_session = parseInt(Math.random() * 1000000);
		bSessionCreated = true;
	}

	if (styles.length > 0)
		BX.loadCSS(styles);

	if (config.emulateOnload)
			BX.ajax.__prepareOnload(scripts);

	var cb = BX.DoNothing;
	if(config.emulateOnload || bSessionCreated)
	{
		cb = BX.defer(function()
		{
			if (config.emulateOnload)
				BX.ajax.__runOnload();
			if (bSessionCreated)
				ajax_session = null;
			BX.onCustomEvent(config.xhr, 'onAjaxSuccessFinish', [config]);
		});
	}

	try
	{
		if (!!config.jsonFailure)
		{
			throw {type: 'json_failure', data: config.jsonResponse, bProactive: config.jsonProactive};
		}

		config.scripts = scripts;

		BX.ajax.processScripts(config.scripts, true);

		if (config.onsuccess)
		{
			config.onsuccess(result);
		}

		BX.onCustomEvent(config.xhr, 'onAjaxSuccess', [result, config]);

		BX.ajax.processScripts(config.scripts, false, cb);
	}
	catch (e)
	{
		if (config.onfailure)
			config.onfailure("processing", e);
		BX.onCustomEvent(config.xhr, 'onAjaxFailure', ['processing', e, config]);
	}
};

BX.ajax.processScripts = function(scripts, bRunFirst, cb)
{
	var scriptsExt = [], scriptsInt = '';

	cb = cb || BX.DoNothing;

	for (var i = 0, length = scripts.length; i < length; i++)
	{
		if (typeof bRunFirst != 'undefined' && bRunFirst != !!scripts[i].bRunFirst)
			continue;

		if (scripts[i].isInternal)
			scriptsInt += ';' + scripts[i].JS;
		else
			scriptsExt.push(scripts[i].JS);
	}

	scriptsExt = BX.util.array_unique(scriptsExt);
	var inlineScripts = scriptsInt.length > 0 ? function() { BX.evalGlobal(scriptsInt); } : BX.DoNothing;

	if (scriptsExt.length > 0)
	{
		BX.load(scriptsExt, function() {
			inlineScripts();
			cb();
		});
	}
	else
	{
		inlineScripts();
		cb();
	}
};

// TODO: extend this function to use with any data objects or forms
BX.ajax.prepareData = function(arData, prefix)
{
	var data = '';
	if (BX.type.isString(arData))
		data = arData;
	else if (null != arData)
	{
		for(var i in arData)
		{
			if (arData.hasOwnProperty(i))
			{
				if (data.length > 0)
					data += '&';
				var name = BX.util.urlencode(i);
				if(prefix)
					name = prefix + '[' + name + ']';
				if(typeof arData[i] == 'object')
					data += BX.ajax.prepareData(arData[i], name);
				else
					data += name + '=' + BX.util.urlencode(arData[i]);
			}
		}
	}
	return data;
};

BX.ajax.xhrSuccess = function(xhr)
{
	return (xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || xhr.status === 1223 || xhr.status === 0;
};

BX.ajax.Setup = function(config, bTemp)
{
	bTemp = !!bTemp;

	for (var i in config)
	{
		if (bTemp)
			tempDefaultConfig[i] = config[i];
		else
			defaultConfig[i] = config[i];
	}
};

BX.ajax.replaceLocalStorageValue = function(lsId, data, ttl)
{
	if (!!BX.localStorage)
		BX.localStorage.set('ajax-' + lsId, data, ttl);
};


BX.ajax._uncache = function(url)
{
	return url + ((url.indexOf('?') !== -1 ? "&" : "?") + '_=' + (new Date()).getTime());
};

/* simple interface */
BX.ajax.get = function(url, data, callback)
{
	if (BX.type.isFunction(data))
	{
		callback = data;
		data = '';
	}

	data = BX.ajax.prepareData(data);

	if (data)
	{
		url += (url.indexOf('?') !== -1 ? "&" : "?") + data;
		data = '';
	}

	return BX.ajax({
		'method': 'GET',
		'dataType': 'html',
		'url': url,
		'data':  '',
		'onsuccess': callback
	});
};

BX.ajax.getCaptcha = function(callback)
{
	return BX.ajax.loadJSON('/bitrix/tools/ajax_captcha.php', callback);
};

BX.ajax.insertToNode = function(url, node)
{
	node = BX(node);
	if (!!node)
	{
		var eventArgs = { cancel: false };
		BX.onCustomEvent('onAjaxInsertToNode', [{ url: url, node: node, eventArgs: eventArgs }]);
		if(eventArgs.cancel === true)
		{
			return;
		}

		var show = null;
		if (!tempDefaultConfig.denyShowWait)
		{
			show = BX.showWait(node);
			delete tempDefaultConfig.denyShowWait;
		}

		return BX.ajax.get(url, function(data) {
			node.innerHTML = data;
			BX.closeWait(node, show);
		});
	}
};

BX.ajax.post = function(url, data, callback)
{
	data = BX.ajax.prepareData(data);

	return BX.ajax({
		'method': 'POST',
		'dataType': 'html',
		'url': url,
		'data':  data,
		'onsuccess': callback
	});
};

/**
 * BX.ajax with BX.Promise
 * 
 * @param config
 * @returns {BX.Promise|false}
 */
BX.ajax.promise = function(config)	
{
	var result = new BX.Promise();
	
	config.onsuccess = function(data)
	{
		result.fulfill(data);
	};
	config.onfailure = function(reason, data)
	{
		result.reject({
			reason: reason, 
			data: data
		});
	};
	config.onprogress = function(data) 
	{
		if (data.position == 0 && data.totalSize == 0)
		{
			result.reject({
				reason: 'progress', 
				data: data
			});
		}
	};
	
	var xhr = BX.ajax(config);
	if (!xhr)
	{
		result.reject({
			reason: "init",
			data: false
		});
	}
	
	return result;
};

/* load and execute external file script with onload emulation */
BX.ajax.loadScriptAjax = function(script_src, callback, bPreload)
{
	if (BX.type.isArray(script_src))
	{
		for (var i=0,len=script_src.length;i<len;i++)
		{
			BX.ajax.loadScriptAjax(script_src[i], callback, bPreload);
		}
	}
	else
	{
		var script_src_test = script_src.replace(/\.js\?.*/, '.js');

		if (r.script_self.test(script_src_test)) return;
		if (r.script_self_window.test(script_src_test) && BX.CWindow) return;
		if (r.script_self_admin.test(script_src_test) && BX.admin) return;

		if (typeof loadedScripts[script_src_test] == 'undefined')
		{
			if (!!bPreload)
			{
				loadedScripts[script_src_test] = '';
				return BX.loadScript(script_src);
			}
			else
			{
				return BX.ajax({
					url: script_src,
					method: 'GET',
					dataType: 'script',
					processData: true,
					emulateOnload: false,
					scriptsRunFirst: true,
					async: false,
					start: true,
					onsuccess: function(result) {
						loadedScripts[script_src_test] = result;
						if (callback)
							callback(result);
					}
				});
			}
		}
		else if (callback)
		{
			callback(loadedScripts[script_src_test]);
		}
	}
};

/* non-xhr loadings */
BX.ajax.loadJSON = function(url, data, callback, callback_failure)
{
	if (BX.type.isFunction(data))
	{
		callback_failure = callback;
		callback = data;
		data = '';
	}

	data = BX.ajax.prepareData(data);

	if (data)
	{
		url += (url.indexOf('?') !== -1 ? "&" : "?") + data;
		data = '';
	}

	return BX.ajax({
		'method': 'GET',
		'dataType': 'json',
		'url': url,
		'onsuccess': callback,
		'onfailure': callback_failure
	});
};

/*
arObs = [{
	url: url,
	type: html|script|json|css,
	callback: function
}]
*/
BX.ajax.load = function(arObs, callback)
{
	if (!BX.type.isArray(arObs))
		arObs = [arObs];

	var cnt = 0;

	if (!BX.type.isFunction(callback))
		callback = BX.DoNothing;

	var handler = function(data)
		{
			if (BX.type.isFunction(this.callback))
				this.callback(data);

			if (++cnt >= len)
				callback();
		};

	for (var i = 0, len = arObs.length; i<len; i++)
	{
		switch(arObs[i].type.toUpperCase())
		{
			case 'SCRIPT':
				BX.loadScript([arObs[i].url], BX.proxy(handler, arObs[i]));
			break;
			case 'CSS':
				BX.loadCSS([arObs[i].url]);

				if (++cnt >= len)
					callback();
			break;
			case 'JSON':
				BX.ajax.loadJSON(arObs[i].url, BX.proxy(handler, arObs[i]));
			break;

			default:
				BX.ajax.get(arObs[i].url, '', BX.proxy(handler, arObs[i]));
			break;
		}
	}
};

/* ajax form sending */
BX.ajax.submit = function(obForm, callback)
{
	if (!obForm.target)
	{
		if (null == obForm.BXFormTarget)
		{
			var frame_name = 'formTarget_' + Math.random();
			obForm.BXFormTarget = document.body.appendChild(BX.create('IFRAME', {
				props: {
					name: frame_name,
					id: frame_name,
					src: 'javascript:void(0)'
				},
				style: {
					display: 'none'
				}
			}));
		}

		obForm.target = obForm.BXFormTarget.name;
	}

	obForm.BXFormCallback = callback;
	BX.bind(obForm.BXFormTarget, 'load', BX.proxy(BX.ajax._submit_callback, obForm));

	BX.submit(obForm);

	return false;
};

BX.ajax.submitComponentForm = function(obForm, container, bWait)
{
	if (!obForm.target)
	{
		if (null == obForm.BXFormTarget)
		{
			var frame_name = 'formTarget_' + Math.random();
			obForm.BXFormTarget = document.body.appendChild(BX.create('IFRAME', {
				props: {
					name: frame_name,
					id: frame_name,
					src: 'javascript:void(0)'
				},
				style: {
					display: 'none'
				}
			}));
		}

		obForm.target = obForm.BXFormTarget.name;
	}

	if (!!bWait)
		var w = BX.showWait(container);

	obForm.BXFormCallback = function(d) {
		if (!!bWait)
			BX.closeWait(w);

		var callOnload = function(){
			if(!!window.bxcompajaxframeonload)
			{
				setTimeout(function(){window.bxcompajaxframeonload();window.bxcompajaxframeonload=null;}, 10);
			}
		};

		BX(container).innerHTML = d;
		BX.onCustomEvent('onAjaxSuccess', [null,null,callOnload]);
	};

	BX.bind(obForm.BXFormTarget, 'load', BX.proxy(BX.ajax._submit_callback, obForm));

	return true;
};

// func will be executed in form context
BX.ajax._submit_callback = function()
{
	//opera and IE8 triggers onload event even on empty iframe
	try
	{
		if(this.BXFormTarget.contentWindow.location.href.indexOf('http') != 0)
			return;
	} catch (e) {
		return;
	}

	if (this.BXFormCallback)
		this.BXFormCallback.apply(this, [this.BXFormTarget.contentWindow.document.body.innerHTML]);

	BX.unbindAll(this.BXFormTarget);
};

BX.ajax.prepareForm = function(obForm, data)
{
	data = (!!data ? data : {});
	var i, ii, el,
		_data = [],
		n = obForm.elements.length,
		files = 0, length = 0;
	if(!!obForm)
	{
		for (i = 0; i < n; i++)
		{
			el = obForm.elements[i];
			if (el.disabled)
				continue;

			if(!el.type)
				continue;

			switch(el.type.toLowerCase())
			{
				case 'text':
				case 'textarea':
				case 'password':
				case 'number':
				case 'hidden':
				case 'select-one':
					_data.push({name: el.name, value: el.value});
					length += (el.name.length + el.value.length);
					break;
				case 'file':
					if (!!el.files)
					{
						for (ii = 0; ii < el.files.length; ii++)
						{
							files++;
							_data.push({name: el.name, value: el.files[ii], file : true});
							length += el.files[ii].size;
						}
					}
					break;
				case 'radio':
				case 'checkbox':
					if(el.checked)
					{
						_data.push({name: el.name, value: el.value});
						length += (el.name.length + el.value.length);
					}
					break;
				case 'select-multiple':
					for (var j = 0; j < el.options.length; j++)
					{
						if (el.options[j].selected)
						{
							_data.push({name : el.name, value : el.options[j].value});
							length += (el.name.length + el.options[j].length);
						}
					}
					break;
				default:
					break;
			}
		}

		i = 0; length = 0;
		var current = data, name, rest, pp;

		while(i < _data.length)
		{
			var p = _data[i].name.indexOf('[');
			if (p == -1) {
				current[_data[i].name] = _data[i].value;
				current = data;
				i++;
			}
			else
			{
				name = _data[i].name.substring(0, p);
				rest = _data[i].name.substring(p+1);
				pp = rest.indexOf(']');

				if(pp == -1)
				{
					if (!current[name])
						current[name] = [];
					current = data;
					i++;
				}
				else if(pp == 0)
				{
					if (!current[name])
						current[name] = [];
					//No index specified - so take the next integer
					current = current[name];
					_data[i].name = '' + current.length;
				}
				else
				{
					if (!current[name])
						current[name] = {};
					//Now index name becomes and name and we go deeper into the array
					current = current[name];
					_data[i].name = rest.substring(0, pp) + rest.substring(pp+1);
				}
			}
		}
	}
	return {data : data, filesCount : files, roughSize : length};
};
BX.ajax.submitAjax = function(obForm, config)
{
	config = (config !== null && typeof config == "object" ? config : {});
	config.url = (config["url"] || obForm.getAttribute("action"));

	var additionalData = (config["data"] || {});
	config.data = BX.ajax.prepareForm(obForm).data;
	for (var ii in additionalData)
	{
		if (additionalData.hasOwnProperty(ii))
		{
			config.data[ii] = additionalData[ii];
		}
	}

	if (!window["FormData"])
	{
		BX.ajax(config);
	}
	else
	{
		var isFile = function(item)
		{
			var res = Object.prototype.toString.call(item);
			return (res == '[object File]' || res == '[object Blob]');
		},
		appendToForm = function(fd, key, val)
		{
			if (!!val && typeof val == "object" && !isFile(val))
			{
				for (var ii in val)
				{
					if (val.hasOwnProperty(ii))
					{
						appendToForm(fd, (key == '' ? ii : key + '[' + ii + ']'), val[ii]);
					}
				}
			}
			else
				fd.append(key, (!!val ? val : ''));
		},
		prepareData = function(arData)
		{
			var data = {};
			if (null != arData)
			{
				if(typeof arData == 'object')
				{
					for(var i in arData)
					{
						if (arData.hasOwnProperty(i))
						{
							var name = BX.util.urlencode(i);
							if(typeof arData[i] == 'object' && arData[i]["file"] !== true)
								data[name] = prepareData(arData[i]);
							else if (arData[i]["file"] === true)
								data[name] = arData[i]["value"];
							else
								data[name] = BX.util.urlencode(arData[i]);
						}
					}
				}
				else
					data = BX.util.urlencode(arData);
			}
			return data;
		},
		fd = new window.FormData();

		if (config.method !== 'POST')
		{
			config.data = BX.ajax.prepareData(config.data);
			if (config.data)
			{
				config.url += (config.url.indexOf('?') !== -1 ? "&" : "?") + config.data;
				config.data = '';
			}
		}
		else
		{
			if (config.preparePost === true)
				config.data = prepareData(config.data);
			appendToForm(fd, '', config.data);
			config.data = fd;
		}

		config.preparePost = false;
		config.start = false;

		var xhr = BX.ajax(config);
		if (!!config["onprogress"])
			xhr.upload.addEventListener(
				'progress',
				function(e){
					var percent = null;
					if(e.lengthComputable && (e.total || e["totalSize"])) {
						percent = e.loaded * 100 / (e.total || e["totalSize"]);
					}
					config["onprogress"](e, percent);
				}
			);
		xhr.send(fd);
	}
};

BX.ajax.UpdatePageData = function (arData)
{
	if (arData.TITLE)
		BX.ajax.UpdatePageTitle(arData.TITLE);
	if (arData.WINDOW_TITLE || arData.TITLE)
		BX.ajax.UpdateWindowTitle(arData.WINDOW_TITLE || arData.TITLE);
	if (arData.NAV_CHAIN)
		BX.ajax.UpdatePageNavChain(arData.NAV_CHAIN);
	if (arData.CSS && arData.CSS.length > 0)
		BX.loadCSS(arData.CSS);
	if (arData.SCRIPTS && arData.SCRIPTS.length > 0)
	{
		var f = function(result,config,cb){

			if(!!config && BX.type.isArray(config.scripts))
			{
				for(var i=0,l=arData.SCRIPTS.length;i<l;i++)
				{
					config.scripts.push({isInternal:false,JS:arData.SCRIPTS[i]});
				}
			}
			else
			{
				BX.loadScript(arData.SCRIPTS,cb);
			}

			BX.removeCustomEvent('onAjaxSuccess',f);
		};
		BX.addCustomEvent('onAjaxSuccess',f);
	}
	else
	{
		var f1 = function(result,config,cb){
			if(BX.type.isFunction(cb))
			{
				cb();
			}
			BX.removeCustomEvent('onAjaxSuccess',f1);
		};
		BX.addCustomEvent('onAjaxSuccess', f1);
	}
};

BX.ajax.UpdatePageTitle = function(title)
{
	var obTitle = BX('pagetitle');
	if (obTitle)
	{
		obTitle.removeChild(obTitle.firstChild);
		if (!obTitle.firstChild)
			obTitle.appendChild(document.createTextNode(title));
		else
			obTitle.insertBefore(document.createTextNode(title), obTitle.firstChild);
	}
};

BX.ajax.UpdateWindowTitle = function(title)
{
	document.title = title;
};

BX.ajax.UpdatePageNavChain = function(nav_chain)
{
	var obNavChain = BX('navigation');
	if (obNavChain)
	{
		obNavChain.innerHTML = nav_chain;
	}
};

/* user options handling */
BX.userOptions = {
	options: null,
	bSend: false,
	delay: 5000,
	path: '/bitrix/admin/user_options.php?'
};

BX.userOptions.setAjaxPath = function(url)
{
	BX.userOptions.path = url.indexOf('?') == -1? url+'?': url+'&';
}
BX.userOptions.save = function(sCategory, sName, sValName, sVal, bCommon)
{
	if (null == BX.userOptions.options)
		BX.userOptions.options = {};

	bCommon = !!bCommon;
	BX.userOptions.options[sCategory+'.'+sName+'.'+sValName] = [sCategory, sName, sValName, sVal, bCommon];

	var sParam = BX.userOptions.__get();
	if (sParam != '')
		document.cookie = BX.message('COOKIE_PREFIX')+"_LAST_SETTINGS=" + encodeURIComponent(sParam) + "&sessid="+BX.bitrix_sessid()+"; expires=Thu, 31 Dec 2020 23:59:59 GMT; path=/;";

	if(!BX.userOptions.bSend)
	{
		BX.userOptions.bSend = true;
		setTimeout(function(){BX.userOptions.send(null)}, BX.userOptions.delay);
	}
};

BX.userOptions.send = function(callback)
{
	var sParam = BX.userOptions.__get();
	BX.userOptions.options = null;
	BX.userOptions.bSend = false;

	if (sParam != '')
	{
		document.cookie = BX.message('COOKIE_PREFIX') + "_LAST_SETTINGS=; path=/;";
		BX.ajax({
			'method': 'GET',
			'dataType': 'html',
			'processData': false,
			'cache': false,
			'url': BX.userOptions.path+sParam+'&sessid='+BX.bitrix_sessid(),
			'onsuccess': callback
		});
	}
};

BX.userOptions.del = function(sCategory, sName, bCommon, callback)
{
	BX.ajax.get(BX.userOptions.path+'action=delete&c='+sCategory+'&n='+sName+(bCommon == true? '&common=Y':'')+'&sessid='+BX.bitrix_sessid(), callback);
};

BX.userOptions.__get = function()
{
	if (!BX.userOptions.options) return '';

	var sParam = '', n = -1, prevParam = '', aOpt, i;

	for (i in BX.userOptions.options)
	{
		if(BX.userOptions.options.hasOwnProperty(i))
		{
			aOpt = BX.userOptions.options[i];

			if (prevParam != aOpt[0]+'.'+aOpt[1])
			{
				n++;
				sParam += '&p['+n+'][c]='+BX.util.urlencode(aOpt[0]);
				sParam += '&p['+n+'][n]='+BX.util.urlencode(aOpt[1]);
				if (aOpt[4] == true)
					sParam += '&p['+n+'][d]=Y';
				prevParam = aOpt[0]+'.'+aOpt[1];
			}

			sParam += '&p['+n+'][v]['+BX.util.urlencode(aOpt[2])+']='+BX.util.urlencode(aOpt[3]);
		}
	}

	return sParam.substr(1);
};

BX.ajax.history = {
	expected_hash: '',

	obParams: null,

	obFrame: null,
	obImage: null,

	obTimer: null,

	bInited: false,
	bHashCollision: false,
	bPushState: !!(history.pushState && BX.type.isFunction(history.pushState)),

	startState: null,

	init: function(obParams)
	{
		if (BX.ajax.history.bInited)
			return;

		this.obParams = obParams;
		var obCurrentState = this.obParams.getState();

		if (BX.ajax.history.bPushState)
		{
			BX.ajax.history.expected_hash = window.location.pathname;
			if (window.location.search)
				BX.ajax.history.expected_hash += window.location.search;

			BX.ajax.history.put(obCurrentState, BX.ajax.history.expected_hash, '', true);
			// due to some strange thing, chrome calls popstate event on page start. so we should delay it
			setTimeout(function(){BX.bind(window, 'popstate', BX.ajax.history.__hashListener);}, 500);
		}
		else
		{
			BX.ajax.history.expected_hash = window.location.hash;

			if (!BX.ajax.history.expected_hash || BX.ajax.history.expected_hash == '#')
				BX.ajax.history.expected_hash = '__bx_no_hash__';

			jsAjaxHistoryContainer.put(BX.ajax.history.expected_hash, obCurrentState);
			BX.ajax.history.obTimer = setTimeout(BX.ajax.history.__hashListener, 500);

			if (BX.browser.IsIE())
			{
				BX.ajax.history.obFrame = document.createElement('IFRAME');
				BX.hide_object(BX.ajax.history.obFrame);

				document.body.appendChild(BX.ajax.history.obFrame);

				BX.ajax.history.obFrame.contentWindow.document.open();
				BX.ajax.history.obFrame.contentWindow.document.write(BX.ajax.history.expected_hash);
				BX.ajax.history.obFrame.contentWindow.document.close();
			}
			else if (BX.browser.IsOpera())
			{
				BX.ajax.history.obImage = document.createElement('IMG');
				BX.hide_object(BX.ajax.history.obImage);

				document.body.appendChild(BX.ajax.history.obImage);

				BX.ajax.history.obImage.setAttribute('src', 'javascript:location.href = \'javascript:BX.ajax.history.__hashListener();\';');
			}
		}

		BX.ajax.history.bInited = true;
	},

	__hashListener: function(e)
	{
		e = e || window.event || {state:false};

		if (BX.ajax.history.bPushState)
		{
			BX.ajax.history.obParams.setState(e.state||BX.ajax.history.startState);
		}
		else
		{
			if (BX.ajax.history.obTimer)
			{
				window.clearTimeout(BX.ajax.history.obTimer);
				BX.ajax.history.obTimer = null;
			}

			var current_hash;
			if (null != BX.ajax.history.obFrame)
				current_hash = BX.ajax.history.obFrame.contentWindow.document.body.innerText;
			else
				current_hash = window.location.hash;

			if (!current_hash || current_hash == '#')
				current_hash = '__bx_no_hash__';

			if (current_hash.indexOf('#') == 0)
				current_hash = current_hash.substring(1);

			if (current_hash != BX.ajax.history.expected_hash)
			{
				var state = jsAjaxHistoryContainer.get(current_hash);
				if (state)
				{
					BX.ajax.history.obParams.setState(state);

					BX.ajax.history.expected_hash = current_hash;
					if (null != BX.ajax.history.obFrame)
					{
						var __hash = current_hash == '__bx_no_hash__' ? '' : current_hash;
						if (window.location.hash != __hash && window.location.hash != '#' + __hash)
							window.location.hash = __hash;
					}
				}
			}

			BX.ajax.history.obTimer = setTimeout(BX.ajax.history.__hashListener, 500);
		}
	},

	put: function(state, new_hash, new_hash1, bStartState)
	{
		if (this.bPushState)
		{
			if(!bStartState)
			{
				history.pushState(state, '', new_hash);
			}
			else
			{
				BX.ajax.history.startState = state;
			}
		}
		else
		{
			if (typeof new_hash1 != 'undefined')
				new_hash = new_hash1;
			else
				new_hash = 'view' + new_hash;

			jsAjaxHistoryContainer.put(new_hash, state);
			BX.ajax.history.expected_hash = new_hash;

			window.location.hash = BX.util.urlencode(new_hash);

			if (null != BX.ajax.history.obFrame)
			{
				BX.ajax.history.obFrame.contentWindow.document.open();
				BX.ajax.history.obFrame.contentWindow.document.write(new_hash);
				BX.ajax.history.obFrame.contentWindow.document.close();
			}
		}
	},

	checkRedirectStart: function(param_name, param_value)
	{
		var current_hash = window.location.hash;
		if (current_hash.substring(0, 1) == '#') current_hash = current_hash.substring(1);

		var test = current_hash.substring(0, 5);
		if (test == 'view/' || test == 'view%')
		{
			BX.ajax.history.bHashCollision = true;
			document.write('<' + 'div id="__ajax_hash_collision_' + param_value + '" style="display: none;">');
		}
	},

	checkRedirectFinish: function(param_name, param_value)
	{
		document.write('</div>');

		var current_hash = window.location.hash;
		if (current_hash.substring(0, 1) == '#') current_hash = current_hash.substring(1);

		BX.ready(function ()
		{
			var test = current_hash.substring(0, 5);
			if (test == 'view/' || test == 'view%')
			{
				var obColNode = BX('__ajax_hash_collision_' + param_value);
				var obNode = obColNode.firstChild;
				BX.cleanNode(obNode);
				obColNode.style.display = 'block';

				// IE, Opera and Chrome automatically modifies hash with urlencode, but FF doesn't ;-(
				if (test != 'view%')
					current_hash = BX.util.urlencode(current_hash);

				current_hash += (current_hash.indexOf('%3F') == -1 ? '%3F' : '%26') + param_name + '=' + param_value;

				var url = '/bitrix/tools/ajax_redirector.php?hash=' + current_hash;

				BX.ajax.insertToNode(url, obNode);
			}
		});
	}
};

BX.ajax.component = function(node)
{
	this.node = node;
};

BX.ajax.component.prototype.getState = function()
{
	var state = {
		'node': this.node,
		'title': window.document.title,
		'data': BX(this.node).innerHTML
	};

	var obNavChain = BX('navigation');
	if (null != obNavChain)
		state.nav_chain = obNavChain.innerHTML;

	BX.onCustomEvent(BX(state.node), "onComponentAjaxHistoryGetState", [state]);

	return state;
};

BX.ajax.component.prototype.setState = function(state)
{
	BX(state.node).innerHTML = state.data;
	BX.ajax.UpdatePageTitle(state.title);

	if (state.nav_chain)
	{
		BX.ajax.UpdatePageNavChain(state.nav_chain);
	}

	BX.onCustomEvent(BX(state.node), "onComponentAjaxHistorySetState", [state]);
};

var jsAjaxHistoryContainer = {
	arHistory: {},

	put: function(hash, state)
	{
		this.arHistory[hash] = state;
	},

	get: function(hash)
	{
		return this.arHistory[hash];
	}
};


BX.ajax.FormData = function()
{
	this.elements = [];
	this.files = [];
	this.features = {};
	this.isSupported();
	this.log('BX FormData init');
};

BX.ajax.FormData.isSupported = function()
{
	var f = new BX.ajax.FormData();
	var result = f.features.supported;
	f = null;
	return result;
};

BX.ajax.FormData.prototype.log = function(o)
{
	if (false) {
		try {
			if (BX.browser.IsIE()) o = JSON.stringify(o);
			console.log(o);
		} catch(e) {}
	}
};

BX.ajax.FormData.prototype.isSupported = function()
{
	var f = {};
	f.fileReader = (window.FileReader && window.FileReader.prototype.readAsBinaryString);
	f.readFormData = f.sendFormData = !!(window.FormData);
	f.supported = !!(f.readFormData && f.sendFormData);
	this.features = f;
	this.log('features:');
	this.log(f);

	return f.supported;
};

BX.ajax.FormData.prototype.append = function(name, value)
{
	if (typeof(value) === 'object') { // seems to be files element
		this.files.push({'name': name, 'value':value});
	} else {
		this.elements.push({'name': name, 'value':value});
	}
};

BX.ajax.FormData.prototype.send = function(url, callbackOk, callbackProgress, callbackError)
{
	this.log('FD send');
	this.xhr = BX.ajax({
			'method': 'POST',
			'dataType': 'html',
			'url': url,
			'onsuccess': callbackOk,
			'onfailure': callbackError,
			'start': false,
			'preparePost':false
		});

	if (callbackProgress)
	{
		this.xhr.upload.addEventListener(
			'progress',
			function(e) {
				if (e.lengthComputable)
					callbackProgress(e.loaded / (e.total || e.totalSize));
			},
			false
		);
	}

	if (this.features.readFormData && this.features.sendFormData)
	{
		var fd = new FormData();
		this.log('use browser formdata');
		for (var i in this.elements)
		{
			if(this.elements.hasOwnProperty(i))
				fd.append(this.elements[i].name,this.elements[i].value);
		}
		for (i in this.files)
		{
			if(this.files.hasOwnProperty(i))
				fd.append(this.files[i].name, this.files[i].value);
		}
		this.xhr.send(fd);
	}

	return this.xhr;
};

BX.addCustomEvent('onAjaxFailure', BX.debug);
})(window);


/* End */
;
; /* Start:"a:4:{s:4:"full";s:50:"/bitrix/js/main/core/core_popup.js?150488080459295";s:6:"source";s:34:"/bitrix/js/main/core/core_popup.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
;(function(window) {

"use strict";

if (BX.PopupWindowManager)
{
	return;
}

BX.PopupWindowManager =
{
	_popups : [],
	_currentPopup : null,

	create : function(uniquePopupId, bindElement, params)
	{
		var index = -1;
		if ((index = this._getPopupIndex(uniquePopupId)) !== -1)
		{
			return this._popups[index];
		}

		var popupWindow = new BX.PopupWindow(uniquePopupId, bindElement, params);
		BX.addCustomEvent(popupWindow, "onPopupShow", BX.delegate(this.onPopupShow, this));
		BX.addCustomEvent(popupWindow, "onPopupClose", BX.delegate(this.onPopupClose, this));

		return popupWindow;
	},

	onPopupWindowIsInitialized : function(uniquePopupId, popupWindow)
	{
		BX.addCustomEvent(popupWindow, "onPopupDestroy", BX.delegate(this.onPopupDestroy, this));
		this._popups.push(popupWindow);
	},

	onPopupShow : function(popupWindow)
	{
		if (this._currentPopup !== null)
		{
			this._currentPopup.close();
		}

		this._currentPopup = popupWindow;
	},

	onPopupClose : function(popupWindow)
	{
		this._currentPopup = null;
	},

	onPopupDestroy : function(popupWindow)
	{
		var index;
		if ((index = this._getPopupIndex(popupWindow.uniquePopupId)) !== -1)
		{
			this._popups = BX.util.deleteFromArray(this._popups, index);
		}
	},

	getCurrentPopup : function()
	{
		return this._currentPopup;
	},

	isPopupExists : function(uniquePopupId)
	{
		return this._getPopupIndex(uniquePopupId) !== -1
	},

	_getPopupIndex : function(uniquePopupId)
	{
		var index = -1;

		for (var i = 0; i < this._popups.length; i++)
		{
			if (this._popups[i].uniquePopupId === uniquePopupId)
			{
				return i;
			}
		}

		return index;
	},

	getMaxZIndex : function()
	{
		var zIndex = 0, ii;
		for (ii = 0; ii < this._popups.length; ii++)
		{
			zIndex = Math.max(zIndex, this._popups[ii].params.zIndex);
		}
		return zIndex;
	}
};
BX.addCustomEvent("onPopupWindowIsInitialized", BX.proxy(BX.PopupWindowManager.onPopupWindowIsInitialized, BX.PopupWindowManager));
/**
 *
 * @param {string} uniquePopupId
 * @param {Element|object|null} bindElement
 * @param params
 * @constructor
 */
BX.PopupWindow = function(uniquePopupId, bindElement, params)
{
	params = params || {};
	this.params = params;

	BX.onCustomEvent("onPopupWindowInit", [uniquePopupId, bindElement, params]);

	this.uniquePopupId = uniquePopupId;

	this.params.zIndex = parseInt(params.zIndex);
	this.params.zIndex = isNaN(params.zIndex) ? 0 : params.zIndex;
	this.buttons = params.buttons && BX.type.isArray(params.buttons) ? params.buttons : [];
	this.offsetTop = BX.PopupWindow.getOption("offsetTop");
	this.offsetLeft = BX.PopupWindow.getOption("offsetLeft");
	this.firstShow = false;
	this.bordersWidth = 20;
	this.bindElementPos = null;
	this.closeIcon = null;
	this.resizeIcon = null;
	this.angle = null;
	this.overlay = null;
	this.titleBar = null;
	this.bindOptions = typeof(params.bindOptions) === "object" ? params.bindOptions : {};
	this.autoHide = params.autoHide === true;
	this.isAutoHideBinded = false;
	this.closeByEsc = params.closeByEsc === true;
	this.isCloseByEscBinded = false;

	this.width = null;
	this.height = null;
	this.minWidth = 0;
	this.minHeight = 0;

	if (params.parentPopup instanceof BX.PopupWindow)
	{
		this.parentPopup = params.parentPopup;
		this.appendContainer = params.parentPopup.contentContainer;

		params.offsetTop = (params.offsetTop? params.offsetTop: 0) - (BX.PopupWindow.fullscreenStatus? 0: this.parentPopup.popupContainer.offsetTop);
		params.offsetLeft = (params.offsetLeft? params.offsetLeft: 0) - (BX.PopupWindow.fullscreenStatus? 0: this.parentPopup.popupContainer.offsetLeft);
	}
	else
	{
		this.parentPopup = null;
		this.appendContainer = document.body;
	}

	this.dragOptions = {
		cursor: "",
		callback: BX.DoNothing,
		eventName: ""
	};
	this.dragged = false;
	this.dragPageX = 0;
	this.dragPageY = 0;

	if (params.events)
	{
		for (var eventName in params.events)
		{
			BX.addCustomEvent(this, eventName, params.events[eventName]);
		}
	}

	var popupClassName = "popup-window";

	/*if (params.lightShadow)
		popupClassName += " popup-window-light";*/

	if (params.contentColor && BX.type.isNotEmptyString(params.contentColor))
	{
		popupClassName += " popup-window-content-" + params.contentColor;
	}

	if (params.contentNoPaddings)
	{
		popupClassName += " popup-window-content-no-paddings";
	}

	if (params.noAllPaddings)
	{
		popupClassName += " popup-window-no-paddings";
	}

	if (params.titleBar)
	{
		popupClassName += " popup-window-with-titlebar";
	}

	if (params.className && BX.type.isNotEmptyString(params.className))
	{
		popupClassName += " " + params.className;
	}

	if (params.darkMode)
	{
		popupClassName += ' popup-window-dark';
	}

	this.popupContainer = document.createElement("div");
	var titleBarID = "popup-window-titlebar-" + uniquePopupId;

	if(params.titleBar)
	{
		this.titleBar = BX.create("div", {
			props : {
				className: "popup-window-titlebar",
				id: titleBarID
			}
		});
	}

	if (params.closeIcon)
	{
		this.closeIcon = BX.create("span", {
			props : { className: "popup-window-close-icon" + (params.titleBar ? " popup-window-titlebar-close-icon" : "") },
			style : (typeof(params.closeIcon) === "object" ? params.closeIcon : {} ),
			events : { click : BX.proxy(this._onCloseIconClick, this) }
		});

		if (BX.browser.IsIE())
		{
			BX.adjust(this.closeIcon, { attrs: { hidefocus: "true" } });
		}
	}

	this.contentContainer = BX.create("div",{
		props:{
			id: "popup-window-content-" +  uniquePopupId,
			className: "popup-window-content"
		}
	});

	BX.adjust(this.popupContainer, {
		props : {
			id : uniquePopupId,
			className : popupClassName
		},
		style : {
			zIndex: this.getZindex(),
			position: "absolute",
			display: "none",
			top: "0px",
			left: "0px"
		},
		children : [this.titleBar, this.contentContainer, this.closeIcon]
	});

	this.appendContainer.appendChild(this.popupContainer);

	this.buttonsContainer = null;

	if (params.angle)
	{
		this.setAngle(params.angle);
	}

	if (params.overlay)
	{
		this.setOverlay(params.overlay);
	}

	this.setOffset(params);
	this.setBindElement(bindElement);
	this.setTitleBar(params.titleBar);
	this.setContent(params.content);
	this.setButtons(params.buttons);
	this.setWidth(params.width);
	this.setHeight(params.height);
	this.setResizeMode(params.resizable);

	if (params.bindOnResize !== false)
	{
		BX.bind(window, "resize", BX.proxy(this._onResizeWindow, this));
	}
	BX.onCustomEvent("onPopupWindowIsInitialized", [uniquePopupId, this]);
};

/**
 *
 * @param {Element|string} content
 */
BX.PopupWindow.prototype.setContent = function(content)
{
	if (!this.contentContainer || !content)
	{
		return;
	}

	if (BX.type.isElementNode(content))
	{
		BX.cleanNode(this.contentContainer);
		this.contentContainer.appendChild(content.parentNode ? content.parentNode.removeChild(content) : content );
		content.style.display = "block";
	}
	else if (BX.type.isString(content))
	{
		this.contentContainer.innerHTML = content;
	}
	else
	{
		this.contentContainer.innerHTML = "&nbsp;";
	}
};

/**
 *
 * @param {BX.PopupWindowButton[]} buttons
 */
BX.PopupWindow.prototype.setButtons = function(buttons)
{
	this.buttons = buttons && BX.type.isArray(buttons) ? buttons : [];

	if (this.buttonsContainer)
	{
		BX.remove(this.buttonsContainer);
	}

	if (this.buttons.length > 0 && this.contentContainer)
	{
		var newButtons = [];
		for (var i = 0; i < this.buttons.length; i++)
		{
			var button = this.buttons[i];
			if (button === null || !BX.is_subclass_of(button, BX.PopupWindowButton))
			{
				continue;
			}

			button.popupWindow = this;
			newButtons.push(button.render());
		}

		this.buttonsContainer = this.contentContainer.parentNode.appendChild(
			BX.create("div",{
				props : { className : "popup-window-buttons" },
				children : newButtons
			})
		);
	}
};

/**
 *
 * @returns {BX.PopupWindowButton[]}
 */
BX.PopupWindow.prototype.getButtons = function()
{
	return this.buttons;
};

/**
 *
 * @param {string} id
 * @returns {BX.PopupWindowButton}
 */
BX.PopupWindow.prototype.getButton = function(id)
{
	for (var i = 0; i < this.buttons.length; i++)
	{
		var button = this.buttons[i];
		if (button.getId() === id)
		{
			return button;
		}
	}

	return null;
};

/**
 *
 * @param {Element|Event|object} bindElement
 */
BX.PopupWindow.prototype.setBindElement = function(bindElement)
{
	if (!bindElement || typeof(bindElement) !== "object")
	{
		return;
	}

	if (BX.type.isDomNode(bindElement) || (BX.type.isNumber(bindElement.top) && BX.type.isNumber(bindElement.left)))
	{
		this.bindElement = bindElement;
	}
	else if (BX.type.isNumber(bindElement.clientX) && BX.type.isNumber(bindElement.clientY))
	{
		BX.fixEventPageXY(bindElement);
		this.bindElement = { left : bindElement.pageX, top : bindElement.pageY, bottom : bindElement.pageY };
	}
};

/**
 *
 * @param bindElement
 * @returns {object} position
 */
BX.PopupWindow.prototype.getBindElementPos = function(bindElement)
{
	if (BX.type.isDomNode(bindElement))
	{
		return BX.pos(bindElement, false);
	}
	else if (bindElement && typeof(bindElement) === "object")
	{
		if (!BX.type.isNumber(bindElement.bottom))
		{
			bindElement.bottom = bindElement.top;
		}

		return bindElement;
	}
	else
	{
		var windowSize =  BX.GetWindowInnerSize();
		var windowScroll = BX.GetWindowScrollPos();
		var popupWidth = this.popupContainer.offsetWidth;
		var popupHeight = this.popupContainer.offsetHeight;

		this.bindOptions.forceTop = true;

		return {
			left : windowSize.innerWidth/2 - popupWidth/2 + windowScroll.scrollLeft,
			top : windowSize.innerHeight/2 - popupHeight/2 + windowScroll.scrollTop,
			bottom : windowSize.innerHeight/2 - popupHeight/2 + windowScroll.scrollTop,

			//for optimisation purposes
			windowSize : windowSize,
			windowScroll : windowScroll,
			popupWidth : popupWidth,
			popupHeight : popupHeight
		};
	}
};

/**
 *
 * @param {Object|bool} params
 * @param {number} [params.offset = 0]
 * @param {string} [params.position = "top"]
 */
BX.PopupWindow.prototype.setAngle = function(params)
{
	if (params === false && this.angle !== null)
	{
		BX.remove(this.angle.element);
		this.angle = null;
		return;
	}

	var className = "popup-window-angly";
	if (this.angle === null)
	{
		var position = this.bindOptions.position && this.bindOptions.position === "top" ? "bottom" : "top";
		var angleMinLeft = BX.PopupWindow.getOption(position === "top" ? "angleMinTop" : "angleMinBottom");
		var defaultOffset = BX.type.isNumber(params.offset) ? params.offset : 0;

		var angleLeftOffset = BX.PopupWindow.getOption("angleLeftOffset", null);
		if (defaultOffset > 0 && BX.type.isNumber(angleLeftOffset))
		{
			defaultOffset += angleLeftOffset - BX.PopupWindow.defaultOptions.angleLeftOffset;
		}

		this.angle = {
			element : BX.create("div", { props : { className: className + " " + className +"-" + position }}),
			position : position,
			offset : 0,
			defaultOffset : Math.max(defaultOffset, angleMinLeft)
			//Math.max(BX.type.isNumber(params.offset) ? params.offset : 0, angleMinLeft)
		};

		this.popupContainer.appendChild(this.angle.element);
	}

	if (typeof(params) === "object" && params.position && BX.util.in_array(params.position, ["top", "right", "bottom", "left", "hide"]))
	{
		BX.removeClass(this.angle.element, className + "-" +  this.angle.position);
		BX.addClass(this.angle.element, className + "-" +  params.position);
		this.angle.position = params.position;
	}

	if (typeof(params) === "object" && BX.type.isNumber(params.offset))
	{
		var offset = params.offset;
		var minOffset, maxOffset;
		if (this.angle.position === "top")
		{
			minOffset = BX.PopupWindow.getOption("angleMinTop");
			maxOffset = this.popupContainer.offsetWidth - BX.PopupWindow.getOption("angleMaxTop");
			maxOffset = maxOffset < minOffset ? Math.max(minOffset, offset) : maxOffset;

			this.angle.offset = Math.min(Math.max(minOffset, offset), maxOffset);
			this.angle.element.style.left = this.angle.offset + "px";
			this.angle.element.style.marginLeft = 0;
		}
		else if (this.angle.position === "bottom")
		{
			minOffset = BX.PopupWindow.getOption("angleMinBottom");
			maxOffset = this.popupContainer.offsetWidth - BX.PopupWindow.getOption("angleMaxBottom");
			maxOffset = maxOffset < minOffset ? Math.max(minOffset, offset) : maxOffset;

			this.angle.offset = Math.min(Math.max(minOffset, offset), maxOffset);
			this.angle.element.style.marginLeft = this.angle.offset + "px";
			this.angle.element.style.left = 0;
		}
		else if (this.angle.position === "right")
		{
			minOffset = BX.PopupWindow.getOption("angleMinRight");
			maxOffset = this.popupContainer.offsetHeight - BX.PopupWindow.getOption("angleMaxRight");
			maxOffset = maxOffset < minOffset ? Math.max(minOffset, offset) : maxOffset;

			this.angle.offset = Math.min(Math.max(minOffset, offset), maxOffset);
			this.angle.element.style.top = this.angle.offset + "px";
		}
		else if (this.angle.position === "left")
		{
			minOffset = BX.PopupWindow.getOption("angleMinLeft");
			maxOffset = this.popupContainer.offsetHeight - BX.PopupWindow.getOption("angleMaxLeft");
			maxOffset = maxOffset < minOffset ? Math.max(minOffset, offset) : maxOffset;

			this.angle.offset = Math.min(Math.max(minOffset, offset), maxOffset);
			this.angle.element.style.top = this.angle.offset + "px";
		}
	}
};

/**
 *
 * @param {number} width
 */
BX.PopupWindow.prototype.setWidth = function(width)
{
	if (BX.type.isNumber(width) && width >= 0)
	{
		this.width = width;
		this.contentContainer.style.width = width + "px";
		this.contentContainer.style.overflowX = "auto";
		if (this.titleBar)
		{
			this.titleBar.style.width = width + "px";
		}
	}
	else if (width === false)
	{
		this.width = null;
		this.contentContainer.style.removeProperty("width");
		this.contentContainer.style.removeProperty("overflowX");
		if (this.titleBar)
		{
			this.titleBar.style.removeProperty("width");
		}
	}
};

/**
 *
 * @param {number} height
 */
BX.PopupWindow.prototype.setHeight = function(height)
{
	if (BX.type.isNumber(height) && height >= 0)
	{
		this.height = height;
		this.contentContainer.style.height = height + "px";
		this.contentContainer.style.overflowY = "auto";
	}
	else if (height === false)
	{
		this.height = null;
		this.contentContainer.style.removeProperty("height");
		this.contentContainer.style.removeProperty("overflowY");
	}
};

/**
 *
 * @param {object} options
 * @param {number} [options.minWidth = 0]
 * @param {number} [options.minHeight = 0]
 * @param {bool} [options.restrict = true]
 *
 */
BX.PopupWindow.prototype.setResizeMode = function(options)
{
	if (options === true || BX.type.isPlainObject(options))
	{
		if (!this.resizeIcon)
		{
			this.resizeIcon = BX.create("div", {
				props: {
					className: "popup-window-resize"
				},
				events: {
					mousedown: BX.proxy(this.onResizeMouseDown, this)
				}
			});

			this.popupContainer.appendChild(this.resizeIcon);
		}

		if (BX.type.isNumber(options.minWidth) && options.minWidth > 0)
		{
			this.minWidth = options.minWidth;
		}

		if (BX.type.isNumber(options.minHeight) && options.minHeight > 0)
		{
			this.minHeight = options.minHeight;
		}
	}
	else if (options === false && this.resizeIcon)
	{
		BX.remove(this.resizeIcon);
		this.resizeIcon = null;
	}
};

/**
 *
 * @returns {number|null}
 */
BX.PopupWindow.prototype.getWidth = function()
{
	return this.width;
};

/**
 *
 * @returns {number|null}
 */
BX.PopupWindow.prototype.getHeight = function()
{
	return this.height;
};

BX.PopupWindow.prototype.onTitleMouseDown = function(event)
{
	this._startDrag(
		event,
		{
			cursor: "move",
			callback: BX.proxy(this.move, this),
			eventName: "Drag"
		}
	);
};

BX.PopupWindow.prototype.onResizeMouseDown = function(event)
{
	this._startDrag(
		event,
		{
			cursor: "nwse-resize",
			eventName: "Resize",
			callback: BX.proxy(this._resize, this)
		}
	);

	this.resizeContentPos = BX.pos(this.contentContainer);
	this.resizeContentOffset = this.resizeContentPos.left - BX.pos(this.popupContainer).left;
};

BX.PopupWindow.prototype._resize = function(offsetX, offsetY, pageX, pageY)
{
	var width = pageX - this.resizeContentPos.left;
	var height = pageY - this.resizeContentPos.top;

	var scrollWidth = BX.GetWindowScrollSize().scrollWidth;
	if (this.resizeContentPos.left + width + this.resizeContentOffset >= scrollWidth)
	{
		width = scrollWidth - this.resizeContentPos.left - this.resizeContentOffset;
	}

	this.setWidth(Math.max(width, this.minWidth));
	this.setHeight(Math.max(height, this.minHeight));
};

BX.PopupWindow.prototype.isTopAngle = function()
{
	return this.angle !== null && this.angle.position === "top";
};

BX.PopupWindow.prototype.isBottomAngle = function()
{
	return this.angle !== null && this.angle.position === "bottom";
};

BX.PopupWindow.prototype.isTopOrBottomAngle = function()
{
	return this.angle !== null && BX.util.in_array(this.angle.position, ["top", "bottom"]);
};

BX.PopupWindow.prototype.getAngleHeight = function()
{
	return (this.isTopOrBottomAngle() ? BX.PopupWindow.getOption("angleTopOffset") : 0);
};

/**
 *
 * @param {object} params
 * @param {number} [params.offsetLeft]
 * @param {number} [params.offsetTop]
 */
BX.PopupWindow.prototype.setOffset = function(params)
{
	if (!BX.type.isPlainObject(params))
	{
		return;
	}

	if (params.offsetLeft && BX.type.isNumber(params.offsetLeft))
	{
		this.offsetLeft = params.offsetLeft + BX.PopupWindow.getOption("offsetLeft");
	}

	if (params.offsetTop && BX.type.isNumber(params.offsetTop))
	{
		this.offsetTop = params.offsetTop + BX.PopupWindow.getOption("offsetTop");
	}
};

/**
 *
 * @param {object|string} params
 * @param {Element} [params.content]
 */
BX.PopupWindow.prototype.setTitleBar = function(params)
{
	if (!this.titleBar)
	{
		return;
	}

	if (typeof(params) === "object" && BX.type.isDomNode(params.content))
	{
		this.titleBar.innerHTML = "";
		this.titleBar.appendChild(params.content);
	}
	else if (typeof(params) === "string")
	{
		this.titleBar.innerHTML = "";
		this.titleBar.appendChild(
			BX.create("span", {
				props : {
					className: "popup-window-titlebar-text"
				},
				text : params
			})
		);
	}

	if (this.params.draggable)
	{
		this.titleBar.style.cursor = "move";
		BX.bind(this.titleBar, "mousedown", BX.proxy(this.onTitleMouseDown, this));
	}
};

/**
 *
 * @param {bool} enable
 */
BX.PopupWindow.prototype.setClosingByEsc = function(enable)
{
	enable = BX.type.isBoolean(enable) ? enable : true;
	if (enable)
	{
		this.closeByEsc = true;
		if (!this.isCloseByEscBinded)
		{
			BX.bind(document, "keyup", BX.proxy(this._onKeyUp, this));
			this.isCloseByEscBinded = true;
		}
	}
	else
	{
		this.closeByEsc = false;
		if (this.isCloseByEscBinded)
		{
			BX.unbind(document, "keyup", BX.proxy(this._onKeyUp, this));
			this.isCloseByEscBinded = false;
		}
	}
};

/**
 *
 * @param {bool} enable
 */
BX.PopupWindow.prototype.setAutoHide = function(enable)
{
	enable = BX.type.isBoolean(enable) ? enable : true;
	if (enable)
	{
		this.autoHide = true;
		if (this.isShown())
		{
			this.bindAutoHide();
		}
	}
	else
	{
		this.autoHide = false;
		this.unbindAutoHide();
	}
};

BX.PopupWindow.prototype.bindAutoHide = function()
{
	if (!this.isAutoHideBinded)
	{
		this.isAutoHideBinded = true;
		BX.bind(this.popupContainer, "click", this.cancelBubble);
		if(this.overlay && this.overlay.element)
			BX.bind(this.overlay.element, "click", BX.proxy(this.close, this));
		else
			BX.bind(document, "click", BX.proxy(this.close, this));
	}
};

BX.PopupWindow.prototype.unbindAutoHide = function()
{
	if (this.isAutoHideBinded)
	{
		this.isAutoHideBinded = false;
		BX.unbind(this.popupContainer, "click", this.cancelBubble);
		if(this.overlay && this.overlay.element)
			BX.unbind(this.overlay.element, "click", BX.proxy(this.close, this));
		else
			BX.unbind(document, "click", BX.proxy(this.close, this));
	}
};

/**
 *
 * @param {object} params
 * @param {number} [params.opacity]
 * @param {string} [params.backgroundColor]
 */
BX.PopupWindow.prototype.setOverlay = function(params)
{
	if (this.overlay === null)
	{
		this.overlay = {
			element : BX.create("div", {
				props : {
					className: "popup-window-overlay", id : "popup-window-overlay-" + this.uniquePopupId
				}
			})
		};

		this.adjustOverlayZindex();
		this.resizeOverlay();

		this.appendContainer.appendChild(this.overlay.element);
	}

	if (params && params.hasOwnProperty('opacity') && BX.type.isNumber(params.opacity) && params.opacity >= 0 && params.opacity <= 100)
	{
		if (BX.browser.IsIE() && !BX.browser.IsIE9())
		{
			this.overlay.element.style.filter =  "alpha(opacity=" + params.opacity +")";
		}
		else
		{
			this.overlay.element.style.filter = "none";
			this.overlay.element.style.opacity = parseFloat(params.opacity/100).toPrecision(3);
		}
	}

	if (params && params.backgroundColor)
	{
		this.overlay.element.style.backgroundColor = params.backgroundColor;
	}
};

BX.PopupWindow.prototype.removeOverlay = function()
{
	if (this.overlay !== null && this.overlay.element !== null)
	{
		BX.remove(this.overlay.element);
	}

	if (this.overlayTimeout)
	{
		clearInterval(this.overlayTimeout);
		this.overlayTimeout = null;
	}

	this.overlay = null;
};

BX.PopupWindow.prototype.hideOverlay = function()
{
	if (this.overlay !== null && this.overlay.element !== null)
	{
		if (this.overlayTimeout)
		{
			clearInterval(this.overlayTimeout);
			this.overlayTimeout = null;
		}

		this.overlay.element.style.display = "none";
	}
};

BX.PopupWindow.prototype.showOverlay = function()
{
	if (this.overlay !== null && this.overlay.element !== null)
	{
		this.overlay.element.style.display = "block";

		var popupHeight = this.popupContainer.offsetHeight;
		this.overlayTimeout = setInterval(function() {
			if (popupHeight !== this.popupContainer.offsetHeight)
			{
				this.resizeOverlay();
				popupHeight = this.popupContainer.offsetHeight;
			}

		}.bind(this), 1000);
	}
};

BX.PopupWindow.prototype.resizeOverlay = function()
{
	if (this.overlay !== null && this.overlay.element !== null)
	{
		if (this.parentPopup)
		{
			this.overlay.element.style.width = this.parentPopup.popupContainer.offsetWidth + "px";
			this.overlay.element.style.height = this.parentPopup.popupContainer.offsetHeight + "px";
		}
		else
		{
			var windowSize = BX.GetWindowScrollSize();
			var scrollHeight = Math.max(
				document.body.scrollHeight, document.documentElement.scrollHeight,
				document.body.offsetHeight, document.documentElement.offsetHeight,
				document.body.clientHeight, document.documentElement.clientHeight
			);

			this.overlay.element.style.width = windowSize.scrollWidth + "px";
			this.overlay.element.style.height = scrollHeight + "px";
		}
	}
};

BX.PopupWindow.prototype.getZindex = function()
{
	if (this.overlay !== null)
	{
		return BX.PopupWindow.getOption("popupOverlayZindex") + this.params.zIndex;
	}
	else
	{
		return BX.PopupWindow.getOption("popupZindex") + this.params.zIndex;
	}
};

BX.PopupWindow.prototype.adjustOverlayZindex = function()
{
	if (this.overlay !== null && this.overlay.element !== null)
	{
		this.overlay.element.style.zIndex = parseInt(this.popupContainer.style.zIndex) - 1;
	}
};

BX.PopupWindow.prototype.show = function()
{
	if (!this.firstShow)
	{
		BX.onCustomEvent(this, "onPopupFirstShow", [this]);
		this.firstShow = true;
	}
	BX.onCustomEvent(this, "onPopupShow", [this]);

	this.showOverlay();
	this.popupContainer.style.display = "block";

	this.adjustPosition();

	BX.onCustomEvent(this, "onAfterPopupShow", [this]);

	if (this.closeByEsc && !this.isCloseByEscBinded)
	{
		BX.bind(document, "keyup", BX.proxy(this._onKeyUp, this));
		this.isCloseByEscBinded = true;
	}

	if (this.autoHide && !this.isAutoHideBinded)
	{
		setTimeout(
			BX.proxy(function() {
				if (this.isShown())
				{
					this.bindAutoHide();
				}
			}, this), 100
		);
	}
};

BX.PopupWindow.prototype.isShown = function()
{
   return this.popupContainer.style.display === "block";
};

BX.PopupWindow.prototype.cancelBubble = function(event)
{
	event = event || window.event;

	if (event.stopPropagation)
	{
		event.stopPropagation();
	}
	else
	{
		event.cancelBubble = true;
	}
};

BX.PopupWindow.prototype.close = function(event)
{
	if (!this.isShown())
	{
		return;
	}

	if (event && !(BX.getEventButton(event) & BX.MSLEFT))
	{
		return true;
	}

	BX.onCustomEvent(this, "onPopupClose", [this, event]);

	this.hideOverlay();
	this.popupContainer.style.display = "none";

	if (this.isCloseByEscBinded)
	{
		BX.unbind(document, "keyup", BX.proxy(this._onKeyUp, this));
		this.isCloseByEscBinded = false;
	}

	setTimeout(BX.proxy(this._close, this), 0);
};

BX.PopupWindow.prototype._close = function()
{
	if (this.autoHide)
	{
		this.unbindAutoHide();
	}
};

BX.PopupWindow.prototype._onCloseIconClick = function(event)
{
	event = event || window.event;
	this.close(event);
	BX.PreventDefault(event);
};

BX.PopupWindow.prototype._onKeyUp = function(event)
{
	event = event || window.event;
	if (event.keyCode === 27)
	{
		_checkEscPressed(this.getZindex(), BX.proxy(this.close, this));
	}
};

BX.PopupWindow.prototype.destroy = function()
{
	BX.onCustomEvent(this, "onPopupDestroy", [this]);
	BX.unbindAll(this);
	BX.unbind(document, "keyup", BX.proxy(this._onKeyUp, this));
	BX.unbind(document, "click", BX.proxy(this.close, this));
	BX.unbind(document, "mousemove", BX.proxy(this._moveDrag, this));
	BX.unbind(document, "mouseup", BX.proxy(this._stopDrag, this));
	BX.unbind(window, "resize", BX.proxy(this._onResizeWindow, this));
	BX.remove(this.popupContainer);
	this.removeOverlay();
};

BX.PopupWindow.prototype.enterFullScreen = function()
{
	if (BX.PopupWindow.fullscreenStatus)
	{
		if (document.cancelFullScreen)
		{
			document.cancelFullScreen();
		}
		else if (document.mozCancelFullScreen)
		{
			document.mozCancelFullScreen();
		}
		else if (document.webkitCancelFullScreen)
		{
			document.webkitCancelFullScreen();
		}
	}
	else
	{
		if (BX.browser.IsChrome() || BX.browser.IsSafari())
		{
			this.contentContainer.webkitRequestFullScreen(this.contentContainer.ALLOW_KEYBOARD_INPUT);
			BX.bind(window, "webkitfullscreenchange", this.fullscreenBind = BX.proxy(this.eventFullScreen, this));
		}
		else if (BX.browser.IsFirefox())
		{
			this.contentContainer.mozRequestFullScreen(this.contentContainer.ALLOW_KEYBOARD_INPUT);
			BX.bind(window, "mozfullscreenchange", this.fullscreenBind = BX.proxy(this.eventFullScreen, this));
		}
	}
};

BX.PopupWindow.prototype.eventFullScreen = function(event)
{
	if (BX.PopupWindow.fullscreenStatus)
	{
		if (BX.browser.IsChrome() || BX.browser.IsSafari())
		{
			BX.unbind(window, "webkitfullscreenchange", this.fullscreenBind);
		}
		else if (BX.browser.IsFirefox())
		{
			BX.unbind(window, "mozfullscreenchange", this.fullscreenBind);
		}

		BX.removeClass(this.contentContainer, "popup-window-fullscreen", [this.contentContainer]);

		BX.PopupWindow.fullscreenStatus = false;
		BX.onCustomEvent(this, "onPopupFullscreenLeave");
		this.adjustPosition();
	}
	else
	{
		BX.addClass(this.contentContainer, "popup-window-fullscreen");
		BX.PopupWindow.fullscreenStatus = true;
		BX.onCustomEvent(this, "onPopupFullscreenEnter", [this.contentContainer]);
		this.adjustPosition();
	}
};

/**
 *
 * @param {object} bindOptions
 * @param {bool} [bindOptions.forceBindPosition]
 * @param {bool} [bindOptions.forceLeft]
 * @param {bool} [bindOptions.forceTop]
 * @param {string} [bindOptions.position = "bottom"]
 */
BX.PopupWindow.prototype.adjustPosition = function(bindOptions)
{
	if (bindOptions && typeof(bindOptions) === "object")
	{
		this.bindOptions = bindOptions;
	}

	var bindElementPos = this.getBindElementPos(this.bindElement);

	if (
		!this.bindOptions.forceBindPosition &&
		this.bindElementPos !== null &&
		bindElementPos.top === this.bindElementPos.top &&
		bindElementPos.left === this.bindElementPos.left
	)
	{
		return;
	}

	this.bindElementPos = bindElementPos;

	var windowSize = bindElementPos.windowSize ? bindElementPos.windowSize : BX.GetWindowInnerSize();
	var windowScroll = bindElementPos.windowScroll ? bindElementPos.windowScroll : BX.GetWindowScrollPos();
	var popupWidth = bindElementPos.popupWidth ? bindElementPos.popupWidth : this.popupContainer.offsetWidth;
	var popupHeight = bindElementPos.popupHeight ? bindElementPos.popupHeight : this.popupContainer.offsetHeight;

	var angleTopOffset = BX.PopupWindow.getOption("angleTopOffset");

	var left = this.bindElementPos.left + this.offsetLeft -
				(this.isTopOrBottomAngle() ? BX.PopupWindow.getOption("angleLeftOffset") : 0);

	if (
		!this.bindOptions.forceLeft &&
		(left + popupWidth + this.bordersWidth) >= (windowSize.innerWidth + windowScroll.scrollLeft) &&
		(windowSize.innerWidth + windowScroll.scrollLeft - popupWidth - this.bordersWidth) > 0)
	{
		var bindLeft = left;
		left = windowSize.innerWidth + windowScroll.scrollLeft - popupWidth - this.bordersWidth;
		if (this.isTopOrBottomAngle())
		{
			this.setAngle({ offset : bindLeft - left + this.angle.defaultOffset});
		}
	}
	else if (this.isTopOrBottomAngle())
	{
		this.setAngle({ offset : this.angle.defaultOffset + (left < 0 ? left : 0) });
	}

	if (left < 0)
	{
		left = 0;
	}

	var top = 0;

	if (this.bindOptions.position && this.bindOptions.position === "top")
	{

		top = this.bindElementPos.top - popupHeight - this.offsetTop - (this.isBottomAngle() ? angleTopOffset : 0);
		if (top < 0 || (!this.bindOptions.forceTop && top < windowScroll.scrollTop))
		{
			top = this.bindElementPos.bottom + this.offsetTop;
			if (this.angle !== null)
			{
				top += angleTopOffset;
				this.setAngle({ position: "top"});
			}
		}
		else if (this.isTopAngle())
		{
			top = top - angleTopOffset + BX.PopupWindow.getOption("positionTopXOffset");
			this.setAngle({ position: "bottom"});
		}
		else
		{
			top += BX.PopupWindow.getOption("positionTopXOffset");
		}
	}
	else
	{

		top = this.bindElementPos.bottom + this.offsetTop + this.getAngleHeight();

		if (
			!this.bindOptions.forceTop &&
			(top + popupHeight) > (windowSize.innerHeight + windowScroll.scrollTop) &&
			(this.bindElementPos.top - popupHeight - this.getAngleHeight()) >= 0) //Can we place the PopupWindow above the bindElement?
		{
			//The PopupWindow doesn't place below the bindElement. We should place it above.
			top = this.bindElementPos.top - popupHeight;

			if (this.isTopOrBottomAngle())
			{
				top -= angleTopOffset;
				this.setAngle({ position: "bottom"});
			}

			top += BX.PopupWindow.getOption("positionTopXOffset");

		}
		else if (this.isBottomAngle())
		{
			top += angleTopOffset;
			this.setAngle({ position: "top"});
		}
	}

	if (!this.parentPopup && top < 0)
	{
		top = 0;
	}

	BX.adjust(this.popupContainer, { style: {
		top: top + "px",
		left: left + "px",
		zIndex: this.getZindex()
	}});

	this.adjustOverlayZindex();
};

BX.PopupWindow.prototype._onResizeWindow = function(event)
{
	if (this.isShown())
	{
		this.adjustPosition();
		if (this.overlay !== null)
		{
			this.resizeOverlay();
		}
	}
};

BX.PopupWindow.prototype.move = function(offsetX, offsetY, pageX, pageY)
{
	var left = parseInt(this.popupContainer.style.left) + offsetX;
	var top = parseInt(this.popupContainer.style.top) + offsetY;

	if (typeof(this.params.draggable) === "object" && this.params.draggable.restrict)
	{
		//Left side
		if (!this.parentPopup && left < 0)
		{
			left = 0;
		}

		//Right side
		var scrollSize = BX.GetWindowScrollSize();
		var floatWidth = this.popupContainer.offsetWidth;
		var floatHeight = this.popupContainer.offsetHeight;

		if (left > (scrollSize.scrollWidth - floatWidth))
		{
			left = scrollSize.scrollWidth - floatWidth;
		}

		if (top > (scrollSize.scrollHeight - floatHeight))
		{
			top = scrollSize.scrollHeight - floatHeight;
		}

		//Top side
		if (!this.parentPopup && top < 0)
		{
			top = 0;
		}
	}

	this.popupContainer.style.left = left + "px";
	this.popupContainer.style.top = top + "px";
};

BX.PopupWindow.prototype._startDrag = function(event, options)
{
	event = event || window.event;
	BX.fixEventPageXY(event);

	options = options || {};
	if (BX.type.isNotEmptyString(options.cursor))
	{
		this.dragOptions.cursor = options.cursor;
	}

	if (BX.type.isNotEmptyString(options.eventName))
	{
		this.dragOptions.eventName = options.eventName;
	}

	if (BX.type.isFunction(options.callback))
	{
		this.dragOptions.callback = options.callback;
	}

	this.dragPageX = event.pageX;
	this.dragPageY = event.pageY;
	this.dragged = false;

	BX.bind(document, "mousemove", BX.proxy(this._moveDrag, this));
	BX.bind(document, "mouseup", BX.proxy(this._stopDrag, this));

	if (document.body.setCapture)
	{
		document.body.setCapture();
	}

	document.body.ondrag = BX.False;
	document.body.onselectstart = BX.False;
	document.body.style.cursor = this.dragOptions.cursor;
	document.body.style.MozUserSelect = "none";
	this.popupContainer.style.MozUserSelect = "none";

	return BX.PreventDefault(event);
};

BX.PopupWindow.prototype._moveDrag = function(event)
{
	event = event || window.event;
	BX.fixEventPageXY(event);

	if (this.dragPageX === event.pageX && this.dragPageY === event.pageY)
	{
		return;
	}

	this.dragOptions.callback(
		event.pageX - this.dragPageX,
		event.pageY - this.dragPageY,
		event.pageX,
		event.pageY
	);

	this.dragPageX = event.pageX;
	this.dragPageY = event.pageY;

	if (!this.dragged)
	{
		BX.onCustomEvent(this, "onPopup" + this.dragOptions.eventName + "Start", [this]);
		this.dragged = true;
	}

	BX.onCustomEvent(this, "onPopup" + this.dragOptions.eventName, [this]);
};

BX.PopupWindow.prototype._stopDrag = function(event)
{
	if(document.body.releaseCapture)
	{
		document.body.releaseCapture();
	}

	BX.unbind(document, "mousemove", BX.proxy(this._moveDrag, this));
	BX.unbind(document, "mouseup", BX.proxy(this._stopDrag, this));

	//document.onmousedown = null;
	document.body.ondrag = null;
	document.body.onselectstart = null;
	document.body.style.cursor = "";
	document.body.style.MozUserSelect = "";
	this.popupContainer.style.MozUserSelect = "";

	BX.onCustomEvent(this, "onPopup" + this.dragOptions.eventName + "End", [this]);
	this.dragged = false;

	return BX.PreventDefault(event);
};

BX.PopupWindow.options = {};
BX.PopupWindow.defaultOptions = {

	angleLeftOffset : 40, /*left offset for popup about target */

	positionTopXOffset : -11, /* when popup position is 'top' offset distance between popup body and target node */

	angleTopOffset : 10,    /* offset distance between popup body and target node if use angle, sum with positionTopXOffset  */

	popupZindex : 1000,
	popupOverlayZindex : 1100,

	angleMinLeft : 10,
	angleMaxLeft : 10,

	angleMinRight : 10,
	angleMaxRight : 10,

	angleMinBottom : 23, /**/
	angleMaxBottom : 25,

	angleMinTop : 23,
	angleMaxTop : 25,

	offsetLeft : 0,
	offsetTop: 0
};

BX.PopupWindow.setOptions = function(options)
{
	if (!options || typeof(options) !== "object")
	{
		return;
	}

	for (var option in options)
	{
		BX.PopupWindow.options[option] = options[option];
	}
};

BX.PopupWindow.getOption = function(option, defaultValue)
{
	if (typeof(BX.PopupWindow.options[option]) !== "undefined")
	{
		return BX.PopupWindow.options[option];
	}
	else if (typeof(defaultValue) !== "undefined")
	{
		return defaultValue;
	}
	else
	{
		return BX.PopupWindow.defaultOptions[option];
	}
};

/**
 *
 * @param {object} params
 * @param {string} [params.text]
 * @param {string} [params.id]
 * @param {string} [params.className]
 * @param {object} [params.events]
 * @constructor
 */
BX.PopupWindowButton = function(params)
{
	this.popupWindow = null;

	this.params = params || {};

	this.text = this.params.text || "";
	this.id = this.params.id || "";
	this.className = this.params.className || "";
	this.events = this.params.events || {};

	this.contextEvents = {};
	for (var eventName in this.events)
	{
		this.contextEvents[eventName] = BX.proxy(this.events[eventName], this);
	}

	this.buttonNode = BX.create(
		"span",
		{
			props : { className : "popup-window-button" + (this.className.length > 0 ? " " + this.className : ""), id : this.id },
			events : this.contextEvents,
			text : this.text
		}
	);
};

BX.PopupWindowButton.prototype.render = function()
{
	return this.buttonNode;
};

BX.PopupWindowButton.prototype.getId = function()
{
	return this.id;
};

BX.PopupWindowButton.prototype.getName = function()
{
	return this.name;
};

/**
 *
 * @returns {Element}
 */
BX.PopupWindowButton.prototype.getContainer = function()
{
	return this.buttonNode;
};

BX.PopupWindowButton.prototype.setName = function(name)
{
	this.text = name || "";
	if (this.buttonNode)
	{
		BX.cleanNode(this.buttonNode);
		BX.adjust(this.buttonNode, { text : this.text} );
	}
};

BX.PopupWindowButton.prototype.setClassName = function(className)
{
	if (this.buttonNode)
	{
		if (BX.type.isString(this.className) && (this.className !== ""))
		{
			BX.removeClass(this.buttonNode, this.className);
		}

		BX.addClass(this.buttonNode, className)
	}

	this.className = className;
};

BX.PopupWindowButton.prototype.addClassName = function(className)
{
	if (this.buttonNode)
	{
		BX.addClass(this.buttonNode, className);
		this.className = this.buttonNode.className;
	}
};

BX.PopupWindowButton.prototype.removeClassName = function(className)
{
	if (this.buttonNode)
	{
		BX.removeClass(this.buttonNode, className);
		this.className = this.buttonNode.className;
	}
};

BX.PopupWindowButtonLink = function(params)
{
	BX.PopupWindowButtonLink.superclass.constructor.apply(this, arguments);

	this.buttonNode = BX.create(
		"span",
		{
			props : { className : "popup-window-button popup-window-button-link" + (this.className.length > 0 ? " " + this.className : ""), id : this.id },
			text : this.text,
			events : this.contextEvents
		}
	);

};

BX.extend(BX.PopupWindowButtonLink, BX.PopupWindowButton);

BX.PopupWindowCustomButton = function(params)
{
	BX.PopupWindowCustomButton.superclass.constructor.apply(this, arguments);

	this.buttonNode = BX.create(
		"span",
		{
			props : { className :  (this.className.length > 0 ? " " + this.className : ""), id : this.id },
			events : this.contextEvents,
			text : this.text
		}
	);
};

BX.extend(BX.PopupWindowCustomButton, BX.PopupWindowButton);

BX.PopupMenu = {

	Data : {},
	currentItem : null,

	show : function(id, bindElement, menuItems, params)
	{
		if (this.currentItem !== null)
		{
			this.currentItem.popupWindow.close();
		}

		this.currentItem = this.create(id, bindElement, menuItems, params);
		this.currentItem.popupWindow.show();
	},

	create : function(id, bindElement, menuItems, params)
	{
		if (!this.Data[id])
		{
			this.Data[id] = new BX.PopupMenuWindow(id, bindElement, menuItems, params);
		}

		return this.Data[id];
	},

	getCurrentMenu : function()
	{
		return this.currentItem;
	},

	getMenuById : function(id)
	{
		return this.Data[id] ? this.Data[id] : null;
	},

	destroy : function(id)
	{
		var menu = this.getMenuById(id);
		if (menu)
		{
			if (this.currentItem === menu)
			{
				this.currentItem = null;
			}
			menu.popupWindow.destroy();
			delete this.Data[id];
		}
	}
};

BX.PopupMenuWindow = function(id, bindElement, menuItems, params)
{
	this.id = id;
	this.bindElement = bindElement;

	/**
	 *
	 * @type {BX.PopupMenuItem[]}
	 */
	this.menuItems = [];
	this.itemsContainer = null;
	this.params = params && typeof(params) === "object" ? params : {};
	this.parentMenuWindow = null;
	this.parentMenuItem = null;

	if (menuItems && BX.type.isArray(menuItems))
	{
		for (var i = 0; i < menuItems.length; i++)
		{
			this.addMenuItemInternal(menuItems[i], null);
		}
	}

	this.layout = {
		menuContainer: null,
		itemsContainer: null
	};

	this.popupWindow = this.__createPopup();
};

BX.PopupMenuWindow.prototype.__createPopup = function()
{
	var domItems = [];
	for (var i = 0; i < this.menuItems.length; i++)
	{
		var item = this.menuItems[i];
		var itemLayout = item.getLayout();
		domItems.push(itemLayout.item);
	}

	var popupWindow = new BX.PopupWindow("menu-popup-" + this.id, this.bindElement, {
		closeByEsc: typeof(this.params.closeByEsc) !== "undefined" ? this.params.closeByEsc: false,
		bindOptions: typeof(this.params.bindOptions) === "object" ? this.params.bindOptions : {},
		angle: typeof(this.params.angle) !== "undefined" ? this.params.angle : false,
		zIndex: this.params.zIndex ? this.params.zIndex : 0,
		overlay: typeof(this.params.overlay) === "object" ? this.params.overlay : null,
		autoHide: typeof(this.params.autoHide) !== "undefined" ? this.params.autoHide : true,
		offsetTop: this.params.offsetTop ? this.params.offsetTop : 1,
		offsetLeft: this.params.offsetLeft ? this.params.offsetLeft : 0,
		className: BX.type.isNotEmptyString(this.params.className) ? this.params.className : "",
		noAllPaddings: true,
		content : (this.layout.menuContainer = BX.create("div", {
			props : {
				className : "menu-popup"
			},
			children: [
				(this.layout.itemsContainer = this.itemsContainer = BX.create("div", {
					props : {
						className : "menu-popup-items"
					},
					children: domItems
				}))
			]
		})),
		events: {
			onPopupClose: this.onMenuWindowClose.bind(this),
			onPopupDestroy: this.onMenuWindowDestroy.bind(this)
		}
	});

	if (this.params && this.params.events)
	{
		for (var eventName in this.params.events)
		{
			if (this.params.events.hasOwnProperty(eventName))
			{
				BX.addCustomEvent(popupWindow, eventName, this.params.events[eventName]);
			}
		}
	}

	return popupWindow;
};

/**
 *
 * @returns {BX.PopupWindow}
 */
BX.PopupMenuWindow.prototype.getPopupWindow = function()
{
	return this.popupWindow;
};

BX.PopupMenuWindow.prototype.show = function()
{
	this.popupWindow.show();
};

BX.PopupMenuWindow.prototype.close = function()
{
	this.popupWindow.close();
};

BX.PopupMenuWindow.prototype.destroy = function()
{
	this.popupWindow.destroy();
};

BX.PopupMenuWindow.prototype.onMenuWindowClose = function()
{
	for (var i = 0; i < this.menuItems.length; i++)
	{
		var item = this.menuItems[i];
		item.closeSubMenu();
	}
};

BX.PopupMenuWindow.prototype.onMenuWindowDestroy = function()
{
	for (var i = 0; i < this.menuItems.length; i++)
	{
		var item = this.menuItems[i];
		item.destroySubMenu();
	}
};

/**
 *
 * @param {BX.PopupMenuWindow} parentMenuWindow
 */
BX.PopupMenuWindow.prototype.setParentMenuWindow = function(parentMenuWindow)
{
	if (parentMenuWindow instanceof BX.PopupMenuWindow)
	{
		this.parentMenuWindow = parentMenuWindow;
	}
};

/**
 *
 * @returns {BX.PopupMenuWindow|null}
 */
BX.PopupMenuWindow.prototype.getParentMenuWindow = function()
{
	return this.parentMenuWindow;
};

/**
 *
 * @param {BX.PopupMenuItem} parentMenuItem
 */
BX.PopupMenuWindow.prototype.setParentMenuItem = function(parentMenuItem)
{
	if (parentMenuItem instanceof BX.PopupMenuItem)
	{
		this.parentMenuItem = parentMenuItem;
	}
};

/**
 *
 * @returns {BX.PopupMenuItem}
 */
BX.PopupMenuWindow.prototype.getParentMenuItem = function()
{
	return this.parentMenuItem;
};

/**
 *
 * @param menuItemJson
 * @param targetItemId
 * @returns {BX.PopupMenuItem}
 */
BX.PopupMenuWindow.prototype.addMenuItem = function(menuItemJson, targetItemId)
{
	var menuItem = this.addMenuItemInternal(menuItemJson, targetItemId);
	if (!menuItem)
	{
		return null;
	}

	var itemLayout = menuItem.getLayout();
	var targetItem = this.getMenuItem(targetItemId);
	if (targetItem !== null)
	{
		var targetLayout = targetItem.getLayout();
		this.itemsContainer.insertBefore(itemLayout.item, targetLayout.item);
	}
	else
	{
		this.itemsContainer.appendChild(itemLayout.item);
	}

	return menuItem;
};

/**
 *
 * @param menuItemJson
 * @param targetItemId
 * @returns {BX.PopupMenuItem}
 */
BX.PopupMenuWindow.prototype.addMenuItemInternal = function(menuItemJson, targetItemId)
{
	if (
		!menuItemJson ||
		(!menuItemJson.delimiter && !BX.type.isNotEmptyString(menuItemJson.text)) ||
		(menuItemJson.id && this.getMenuItem(menuItemJson.id) !== null)
	)
	{
		return null;
	}

	if (BX.type.isNumber(this.params.menuShowDelay))
	{
		menuItemJson.menuShowDelay = this.params.menuShowDelay;
	}

	var menuItem = new BX.PopupMenuItem(menuItemJson);
	menuItem.setMenuWindow(this);

	var position = this.getMenuItemPosition(targetItemId);
	if (position >= 0)
	{
		this.menuItems = BX.util.insertIntoArray(this.menuItems, position, menuItem);
	}
	else
	{
		this.menuItems.push(menuItem);
	}

	return menuItem;
};

BX.PopupMenuWindow.prototype.removeMenuItem = function(itemId)
{
	var item = this.getMenuItem(itemId);
	if (!item)
	{
		return;
	}

	for (var position = 0; position < this.menuItems.length; position++)
	{
		if (this.menuItems[position] === item)
		{
			item.destroySubMenu();
			this.menuItems = BX.util.deleteFromArray(this.menuItems, position);
			break;
		}
	}

	if (!this.menuItems.length)
	{
		var menuWindow = item.getMenuWindow();
		if (menuWindow)
		{
			var parentMenuItem = menuWindow.getParentMenuItem();
			if (parentMenuItem)
			{
				parentMenuItem.destroySubMenu();
			}
			else
			{
				menuWindow.destroy();
			}
		}
	}

	item.layout.item.parentNode.removeChild(item.layout.item);
	item.layout = {
		item: null,
		text: null
	};
};

/**
 *
 * @param itemId
 * @returns {BX.PopupMenuItem}
 */
BX.PopupMenuWindow.prototype.getMenuItem = function(itemId)
{
	for (var i = 0; i < this.menuItems.length; i++)
	{
		if (this.menuItems[i].id && this.menuItems[i].id === itemId)
		{
			return this.menuItems[i];
		}
	}

	return null;
};

/**
 *
 * @returns {BX.PopupMenuItem[]}
 */
BX.PopupMenuWindow.prototype.getMenuItems = function()
{
	return this.menuItems;
};

/**
 *
 * @param itemId
 * @returns {number}
 */
BX.PopupMenuWindow.prototype.getMenuItemPosition = function(itemId)
{
	if (itemId)
	{
		for (var i = 0; i < this.menuItems.length; i++)
		{
			if (this.menuItems[i].id && this.menuItems[i].id === itemId)
			{
				return i;
			}
		}
	}

	return -1;
};

/**
 *
 * @param {Object} options
 * @param {string} [options.id]
 * @param {string} [options.text]
 * @param {string} [options.title = ""]
 * @param {string} [options.href = null]
 * @param {string} [options.target = null]
 * @param {string} [options.className = null]
 * @param {boolean} [options.delimiter = false]
 * @param {number} [options.menuShowDelay = 300]
 * @param {number} [options.subMenuOffsetX = 4]
 * @param {object} [options.events]
 * @param {function|string} [options.onclick = null]
 * @param {array[]} [options.items = []]
 * @constructor
 */
BX.PopupMenuItem = function(options)
{
	options = options || {};
	this.options = options;

	this.id = options.id || BX.util.getRandomString().toLowerCase();
	this.text = BX.type.isNotEmptyString(options.text) ? options.text : "";
	this.title = BX.type.isNotEmptyString(options.title) ? options.title : "";
	this.delimiter = options.delimiter === true;
	this.href = BX.type.isNotEmptyString(options.href) ? options.href : null;
	this.target = BX.type.isNotEmptyString(options.target) ? options.target : null;
	this.className = BX.type.isNotEmptyString(options.className) ? options.className : null;
	this.menuShowDelay = BX.type.isNumber(options.menuShowDelay) ? options.menuShowDelay : 300;
	this.subMenuOffsetX = BX.type.isNumber(options.subMenuOffsetX) ? options.subMenuOffsetX : 4;
	this._items = BX.type.isArray(options.items) ? options.items : [];

	/**
	 *
	 * @type {function|string}
	 */
	this.onclick =
		BX.type.isNotEmptyString(options.onclick) || BX.type.isFunction(options.onclick)
			? options.onclick
			: null
	;

	if (BX.type.isPlainObject(options.events))
	{
		for (var eventName in options.events)
		{
			BX.addCustomEvent(this, eventName, options.events[eventName]);
		}
	}

	/**
	 *
	 * @type {BX.PopupMenuWindow}
	 */
	this.menuWindow = null;

	/**
	 *
	 * @type {BX.PopupMenuWindow}
	 */
	this.subMenuWindow = null;

	this.layout = {
		item: null,
		text: null
	};

	this.getLayout(); //compatibility

	//compatibility
	//now use this.options
	this.events = {};
	this.items = [];
	for (var property in options)
	{
		if (options.hasOwnProperty(property) && typeof(this[property]) === "undefined")
		{
			this[property] = options[property];
		}
	}
};

BX.PopupMenuItem.prototype = {

	getLayout: function()
	{
		if (this.layout.item)
		{
			return this.layout;
		}

		if (this.delimiter)
		{
			this.layout.item = BX.create("span", {
				props: {
					className: "popup-window-delimiter"
				}
			});
		}
		else
		{
			this.layout.item = BX.create(this.href ? "a" : "span", {
				props : {
					className: [
						"menu-popup-item",
						(this.className ? this.className : "menu-popup-no-icon"),
						(this.hasSubMenu() ? "menu-popup-item-submenu" : "")
					].join(" ")
				},

				attrs : {
					title : this.title,
					onclick: BX.type.isString(this.onclick) ? this.onclick : "", // compatibility
					target : this.target ? this.target : ""
				},

				events :
					BX.type.isFunction(this.onclick)
						? { click : BX.delegate(this.onItemClick, this) }
						: null
				,

				children : [
					BX.create("span", { props : { className: "menu-popup-item-icon"} }),
					(this.layout.text = BX.create("span", {
						props : {
							className: "menu-popup-item-text"
						},
						html : this.text
					}))
				]
			});

			if (this.href)
			{
				this.layout.item.href = this.href;
			}

			BX.bind(this.layout.item, "mouseenter", this.onItemMouseEnter.bind(this));
			BX.bind(this.layout.item, "mouseleave", this.onItemMouseLeave.bind(this));
		}

		return this.layout;
	},

	onItemClick: function(event)
	{
		this.onclick.call(this.menuWindow, event, this); //compatibility
	},

	onItemMouseEnter: function(event)
	{
		BX.onCustomEvent(this, "onMouseEnter");

		if (this.subMenuTimeout)
		{
			clearTimeout(this.subMenuTimeout);
		}

		if (this.hasSubMenu())
		{
			this.subMenuTimeout = setTimeout(function() {
				this.showSubMenu();
			}.bind(this), this.menuShowDelay);
		}
		else
		{
			this.subMenuTimeout = setTimeout(function() {
				this.closeSiblings();
			}.bind(this), this.menuShowDelay);
		}
	},

	onItemMouseLeave: function(event)
	{
		BX.onCustomEvent(this, "onMouseLeave");

		if (this.subMenuTimeout)
		{
			clearTimeout(this.subMenuTimeout);
		}
	},

	hasSubMenu: function()
	{
		return this.subMenuWindow !== null || this._items.length;
	},

	showSubMenu: function()
	{
		this.addSubMenu(this._items);

		if (this.subMenuWindow)
		{
			BX.addClass(this.layout.item, "menu-popup-item-open");

			this.closeSiblings();
			this.closeChildren();

			var popupWindow = this.subMenuWindow.getPopupWindow();
			if (!popupWindow.isShown())
			{
				BX.onCustomEvent(this, "onSubMenuShow");
				popupWindow.show();
			}


			this.adjustSubMenu();
		}
	},

	addSubMenu: function(items)
	{
		if (this.subMenuWindow !== null || !BX.type.isArray(items) || !items.length)
		{
			return;
		}

		this.subMenuWindow = new BX.PopupMenuWindow(
			"popup-submenu-" + this.id,
			null,
			items,
			{
				autoHide: false,
				menuShowDelay: this.menuShowDelay,
				bindOptions: {
					forceTop: true,
					forceLeft: true,
					forceBindPosition: true
				}
			}
		);

		this.subMenuWindow.setParentMenuWindow(this.menuWindow);
		this.subMenuWindow.setParentMenuItem(this);

		BX.addClass(this.layout.item, "menu-popup-item-submenu");
	},

	closeSubMenu: function()
	{
		if (this.subMenuWindow)
		{

			BX.removeClass(this.layout.item, "menu-popup-item-open");

			this.closeChildren();

			var popupWindow = this.subMenuWindow.getPopupWindow();
			if (popupWindow.isShown())
			{
				BX.onCustomEvent(this, "onSubMenuClose");
				popupWindow.close();
			}

			this.subMenuWindow.close();
		}
	},

	closeSiblings: function()
	{
		var siblings = this.menuWindow.getMenuItems();
		for (var i = 0; i < siblings.length; i++)
		{
			if (siblings[i] !== this)
			{
				siblings[i].closeSubMenu();
			}
		}
	},

	closeChildren: function()
	{
		if (this.subMenuWindow)
		{
			var children = this.subMenuWindow.getMenuItems();
			for (var i = 0; i < children.length; i++)
			{
				children[i].closeSubMenu();
			}
		}
	},

	destroySubMenu: function()
	{
		if (this.subMenuWindow)
		{
			BX.removeClass(this.layout.item, "menu-popup-item-open menu-popup-item-submenu");
			this.destroyChildren();
			this.subMenuWindow.destroy();

			this.subMenuWindow = null;
			this._items = [];
		}
	},

	destroyChildren: function()
	{
		if (this.subMenuWindow)
		{
			var children = this.subMenuWindow.getMenuItems();
			for (var i = 0; i < children.length; i++)
			{
				children[i].destroySubMenu();
			}
		}
	},

	adjustSubMenu: function()
	{
		if (!this.subMenuWindow || !this.layout.item)
		{
			return;
		}

		var popupWindow = this.subMenuWindow.getPopupWindow();
		var itemRect = BX.pos(this.layout.item);

		var offsetLeft = itemRect.width + this.subMenuOffsetX;
		var anglePosition = "left";

		var popupWidth = popupWindow.popupContainer.offsetWidth;
		var clientWidth = document.documentElement.clientWidth;
		if ((itemRect.left + offsetLeft + popupWidth) > clientWidth)
		{
			var left = itemRect.left - popupWidth - this.subMenuOffsetX;
			if (left > 0)
			{
				offsetLeft = -popupWidth - this.subMenuOffsetX;
				anglePosition = "right";
			}
		}

		popupWindow.setBindElement(this.layout.item);

		popupWindow.setOffset({
			offsetLeft: offsetLeft,
			offsetTop: -(itemRect.height + this.getPopupPadding())
		});

		popupWindow.setAngle({
			"position": anglePosition,
			"offset": ((itemRect.height / 2) - this.getPopupPadding())
		});

		popupWindow.adjustPosition();
	},

	/**
	 *
	 * @returns {number}
	 */
	getPopupPadding: function() {
		if (!BX.type.isNumber(this.popupPadding))
		{
			if (this.subMenuWindow)
			{
				var menuContainer = this.subMenuWindow.layout.menuContainer;
				this.popupPadding = parseInt(BX.style(menuContainer, "paddingTop"), 10);
			}
			else
			{
				this.popupPadding = 0;
			}
		}

		return this.popupPadding;
	},

	/**
	 *
	 * @returns {BX.PopupMenuWindow|null}
	 */
	getSubMenu: function()
	{
		return this.subMenuWindow;
	},

	getId: function()
	{
		return this.id;
	},

	/**
	 *
	 * @param {BX.PopupMenuWindow} menuWindow
	 */
	setMenuWindow: function(menuWindow)
	{
		this.menuWindow = menuWindow;
	},

	/**
	 *
	 * @returns {BX.PopupMenuWindow}
	 */
	getMenuWindow: function()
	{
		return this.menuWindow;
	},

	getMenuShowDelay: function()
	{
		return this.menuShowDelay;
	}
};

// TODO: copypaste/update/enhance CSS and images from calendar to MAIN CORE
// this.values = [{ID: 1, NAME : '111', DESCRIPTION: '111', URL: 'href://...'}]

window.BXInputPopup = function(params)
{
	this.id = params.id || 'bx-inp-popup-' + Math.round(Math.random() * 1000000);
	this.handler = params.handler || false;
	this.values = params.values || false;
	this.pInput = params.input;
	this.bValues = !!this.values;
	this.defaultValue = params.defaultValue || '';
	this.openTitle = params.openTitle || '';
	this.className = params.className || '';
	this.noMRclassName = params.noMRclassName || 'ec-no-rm';
	this.emptyClassName = params.noMRclassName || 'ec-label';

	var _this = this;
	this.curInd = false;

	if (this.bValues)
	{
		this.pInput.onfocus = this.pInput.onclick = function(e)
		{
			if (this.value == _this.defaultValue)
			{
				this.value = '';
				this.className = _this.className;
			}
			_this.ShowPopup();
			return BX.PreventDefault(e);
		};
		this.pInput.onblur = function()
		{
			if (_this.bShowed)
				setTimeout(function(){_this.ClosePopup(true);}, 200);
			_this.OnChange();
		};
	}
	else
	{
		this.pInput.className = this.noMRclassName;
		this.pInput.onblur = BX.proxy(this.OnChange, this);
	}
}

BXInputPopup.prototype = {
ShowPopup: function()
{
	if (this.bShowed)
		return;

	var _this = this;
	if (!this.oPopup)
	{
		var
			pRow,
			pWnd = BX.create("DIV", {props:{className: "bxecpl-loc-popup " + this.className}});

		for (var i = 0, l = this.values.length; i < l; i++)
		{
			pRow = pWnd.appendChild(BX.create("DIV", {
				props: {id: 'bxecmr_' + i},
				text: this.values[i].NAME,
				events: {
					mouseover: function(){BX.addClass(this, 'bxecplloc-over');},
					mouseout: function(){BX.removeClass(this, 'bxecplloc-over');},
					click: function()
					{
						var ind = this.id.substr('bxecmr_'.length);
						_this.pInput.value = _this.values[ind].NAME;
						_this.curInd = ind;
						_this.OnChange();
						_this.ClosePopup(true);
					}
				}
			}));

			if (this.values[i].DESCRIPTION)
				pRow.title = this.values[i].DESCRIPTION;
			if (this.values[i].CLASS_NAME)
				BX.addClass(pRow, this.values[i].CLASS_NAME);

			if (this.values[i].URL)
				pRow.appendChild(BX.create('A', {props: {href: this.values[i].URL, className: 'bxecplloc-view', target: '_blank', title: this.openTitle}}));
		}

		this.oPopup = new BX.PopupWindow(this.id, this.pInput, {
			autoHide : true,
			offsetTop : 1,
			offsetLeft : 0,
			lightShadow : true,
			closeByEsc : true,
			content : pWnd
		});

		BX.addCustomEvent(this.oPopup, 'onPopupClose', BX.proxy(this.ClosePopup, this));
	}

	this.oPopup.show();
	this.pInput.select();

	this.bShowed = true;
	BX.onCustomEvent(this, 'onInputPopupShow', [this]);
},

ClosePopup: function(bClosePopup)
{
	this.bShowed = false;

	if (this.pInput.value == '')
		this.OnChange();

	BX.onCustomEvent(this, 'onInputPopupClose', [this]);

	if (bClosePopup === true)
		this.oPopup.close();
},

OnChange: function()
{
	var val = this.pInput.value;
	if (this.bValues)
	{
		if (this.pInput.value == '' || this.pInput.value == this.defaultValue)
		{
			this.pInput.value = this.defaultValue;
			this.pInput.className = this.emptyClassName;
			val = '';
		}
		else
		{
			this.pInput.className = '';
		}
	}

	if (isNaN(parseInt(this.curInd)) || this.curInd !==false && val != this.values[this.curInd].NAME)
		this.curInd = false;
	else
		this.curInd = parseInt(this.curInd);

	BX.onCustomEvent(this, 'onInputPopupChanged', [this, this.curInd, val]);
	if (this.handler && typeof this.handler == 'function')
		this.handler({ind: this.curInd, value: val});
},

Set: function(ind, val, bOnChange)
{
	this.curInd = ind;
	if (this.curInd !== false)
		this.pInput.value = this.values[this.curInd].NAME;
	else
		this.pInput.value = val;

	if (bOnChange !== false)
		this.OnChange();
},

Get: function(ind)
{
	var
		id = false;
	if (typeof ind == 'undefined')
		ind = this.curInd;

	if (ind !== false && this.values[ind])
		id = this.values[ind].ID;
	return id;
},

GetIndex: function(id)
{
	for (var i = 0, l = this.values.length; i < l; i++)
		if (this.values[i].ID == id)
			return i;
	return false;
},

Deactivate: function(bDeactivate)
{
	if (this.pInput.value == '' || this.pInput.value == this.defaultValue)
	{
		if (bDeactivate)
		{
			this.pInput.value = '';
			this.pInput.className = this.noMRclassName;
		}
		else if (this.oEC.bUseMR)
		{
			this.pInput.value = this.defaultValue;
			this.pInput.className = this.emptyClassName;
		}
	}
	this.pInput.disabled = bDeactivate;
}
};

/************** utility *************/

var _escCallbackIndex = -1,
	_escCallback = null;

function _checkEscPressed(zIndex, callback)
{
	if(zIndex === false)
	{
		if(_escCallback && _escCallback.length > 0)
		{
			for(var i=0;i<_escCallback.length; i++)
			{
				_escCallback[i]();
			}

			_escCallback = null;
			_escCallbackIndex = -1;
		}
	}
	else
	{
		if(_escCallback === null)
		{
			_escCallback = [];
			_escCallbackIndex = -1;
			BX.defer(_checkEscPressed)(false);
		}

		if(zIndex > _escCallbackIndex)
		{
			_escCallbackIndex = zIndex;
			_escCallback = [callback];
		}
		else if(zIndex == _escCallbackIndex)
		{
			_escCallback.push(callback)
		}
	}
}


})(window);


/* End */
;
; /* Start:"a:4:{s:4:"full";s:49:"/bitrix/js/main/core/core_date.js?150488080453956";s:6:"source";s:33:"/bitrix/js/main/core/core_date.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
;(function(){

if (BX.date)
	return;

BX.date = {};


BX.date.format = function(format, timestamp, now, utc)
{
	/*
	PHP to Javascript:
		time() = new Date()
		mktime(...) = new Date(...)
		gmmktime(...) = new Date(Date.UTC(...))
		mktime(0,0,0, 1, 1, 1970) != 0          new Date(1970,0,1).getTime() != 0
		gmmktime(0,0,0, 1, 1, 1970) == 0        new Date(Date.UTC(1970,0,1)).getTime() == 0
		date("d.m.Y H:i:s") = BX.date.format("d.m.Y H:i:s")
		gmdate("d.m.Y H:i:s") = BX.date.format("d.m.Y H:i:s", null, null, true);
	*/
	var date = BX.type.isDate(timestamp) ? new Date(timestamp.getTime()) : BX.type.isNumber(timestamp) ? new Date(timestamp * 1000) : new Date();
	var nowDate = BX.type.isDate(now) ? new Date(now.getTime()) : BX.type.isNumber(now) ? new Date(now * 1000) : new Date();
	var isUTC = !!utc;

	if (BX.type.isArray(format))
		return _formatDateInterval(format, date, nowDate, isUTC);
	else if (!BX.type.isNotEmptyString(format))
		return "";

	var formatRegex = /\\?(sago|iago|isago|Hago|dago|mago|Yago|sdiff|idiff|Hdiff|ddiff|mdiff|Ydiff|yesterday|today|tommorow|[a-z])/gi;

	var dateFormats = {
		d : function() {
			// Day of the month 01 to 31
			return BX.util.str_pad_left(getDate(date).toString(), 2, "0");
		},

		D : function() {
			//Mon through Sun
			return BX.message("DOW_" + getDay(date));
		},

		j : function() {
			//Day of the month 1 to 31
			return getDate(date);
		},

		l : function() {
			//Sunday through Saturday
			return BX.message("DAY_OF_WEEK_" + getDay(date));
		},

		N : function() {
			//1 (for Monday) through 7 (for Sunday)
			return getDay(date) || 7;
		},

		S : function() {
			//st, nd, rd or th. Works well with j
			if (getDate(date) % 10 == 1 && getDate(date) != 11)
				return "st";
			else if (getDate(date) % 10 == 2 && getDate(date) != 12)
				return "nd";
			else if (getDate(date) % 10 == 3 && getDate(date) != 13)
				return "rd";
			else
				return "th";
		},

		w : function() {
			//0 (for Sunday) through 6 (for Saturday)
			return getDay(date);
		},

		z : function() {
			//0 through 365
			var firstDay = new Date(getFullYear(date), 0, 1);
			var currentDay = new Date(getFullYear(date), getMonth(date), getDate(date));
			return Math.ceil( (currentDay - firstDay) / (24 * 3600 * 1000) );
		},

		W : function() {
			//ISO-8601 week number of year
			var newDate  = new Date(date.getTime());
		    var dayNumber   = (getDay(date) + 6) % 7;
			setDate(newDate, getDate(newDate) - dayNumber + 3);
		    var firstThursday = newDate.getTime();
			setMonth(newDate, 0, 1);
		    if (getDay(newDate) != 4)
				setMonth(newDate, 0, 1 + ((4 - getDay(newDate)) + 7) % 7);
			var weekNumber = 1 + Math.ceil((firstThursday - newDate) / (7 * 24 * 3600 * 1000));
		    return BX.util.str_pad_left(weekNumber.toString(), 2, "0");
		},

		F : function() {
			//January through December
			return BX.message("MONTH_" + (getMonth(date) + 1) + "_S");
		},

		f : function() {
			//January through December
			return BX.message("MONTH_" + (getMonth(date) + 1));
		},

		m : function() {
			//Numeric representation of a month 01 through 12
			return BX.util.str_pad_left((getMonth(date) + 1).toString(), 2, "0");
		},

		M : function() {
			//A short textual representation of a month, three letters Jan through Dec
			return BX.message("MON_" + (getMonth(date) + 1));
		},

		n : function() {
			//Numeric representation of a month 1 through 12
			return getMonth(date) + 1;
		},

		t : function() {
			//Number of days in the given month 28 through 31
			var lastMonthDay = isUTC ? new Date(Date.UTC(getFullYear(date), getMonth(date) + 1, 0)) : new Date(getFullYear(date), getMonth(date) + 1, 0);
			return getDate(lastMonthDay);
		},

		L : function() {
			//1 if it is a leap year, 0 otherwise.
			var year = getFullYear(date);
			return (year % 4 == 0 && year % 100 != 0 || year % 400 == 0 ? 1 : 0);
		},

		o : function() {
			//ISO-8601 year number
			var correctDate  = new Date(date.getTime());
			setDate(correctDate, getDate(correctDate) - ((getDay(date) + 6) % 7) + 3);
   			return getFullYear(correctDate);
		},

		Y : function() {
			//A full numeric representation of a year, 4 digits
			return getFullYear(date);
		},

		y : function() {
			//A two digit representation of a year
			return getFullYear(date).toString().slice(2);
		},

		a : function() {
			//am or pm
			return getHours(date) > 11 ? "pm" : "am";
		},

		A : function() {
			//AM or PM
			return getHours(date) > 11 ? "PM" : "AM";
		},

		B : function() {
			//000 through 999
			var swatch = ((date.getUTCHours() + 1) % 24) + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
			return BX.util.str_pad_left(Math.floor(swatch * 1000 / 24).toString(), 3, "0");
		},

		g : function() {
			//12-hour format of an hour without leading zeros 1 through 12
			return getHours(date) % 12 || 12;
		},

		G : function() {
			//24-hour format of an hour without leading zeros 0 through 23
			return getHours(date);
		},

		h : function() {
			//12-hour format of an hour with leading zeros 01 through 12
			return BX.util.str_pad_left((getHours(date) % 12 || 12).toString(), 2, "0");
		},

		H : function() {
			//24-hour format of an hour with leading zeros 00 through 23
			return BX.util.str_pad_left(getHours(date).toString(), 2, "0");
		},

		i : function() {
			//Minutes with leading zeros 00 to 59
			return BX.util.str_pad_left(getMinutes(date).toString(), 2, "0");
		},

		s : function() {
			//Seconds, with leading zeros 00 through 59
			return BX.util.str_pad_left(getSeconds(date).toString(), 2, "0");
		},

		u : function() {
			//Microseconds
			return BX.util.str_pad_left((getMilliseconds(date) * 1000).toString(), 6, "0");
		},

		e : function() {
			if (isUTC)
				return "UTC";
			return "";
		},

		I : function() {
			if (isUTC)
				return 0;

			//Whether or not the date is in daylight saving time 1 if Daylight Saving Time, 0 otherwise
			var firstJanuary = new Date(getFullYear(date), 0, 1);
			var firstJanuaryUTC = Date.UTC(getFullYear(date), 0, 1);
			var firstJuly = new Date(getFullYear(date), 6, 0);
			var firstJulyUTC = Date.UTC(getFullYear(date), 6, 0);
			return 0 + ((firstJanuary - firstJanuaryUTC) !== (firstJuly - firstJulyUTC));
		},

		O : function() {
			if (isUTC)
				return "+0000";

			//Difference to Greenwich time (GMT) in hours +0200
			var timezoneOffset = date.getTimezoneOffset();
			var timezoneOffsetAbs = Math.abs(timezoneOffset);
			return (timezoneOffset > 0 ? "-" : "+") + BX.util.str_pad_left((Math.floor(timezoneOffsetAbs / 60) * 100 + timezoneOffsetAbs % 60).toString(), 4, "0");
		},

		P : function() {
			if (isUTC)
				return "+00:00";

			//Difference to Greenwich time (GMT) with colon between hours and minutes +02:00
			var difference = this.O();
			return difference.substr(0, 3) + ":" + difference.substr(3);
		},

		Z : function() {
			if (isUTC)
				return 0;
			//Timezone offset in seconds. The offset for timezones west of UTC is always negative,
			//and for those east of UTC is always positive.
			return -date.getTimezoneOffset() * 60;
		},

		c : function() {
			//ISO 8601 date
			return "Y-m-d\\TH:i:sP".replace(formatRegex, _replaceDateFormat);
		},

		r : function() {
			//RFC 2822 formatted date
			return "D, d M Y H:i:s O".replace(formatRegex, _replaceDateFormat);
		},

		U : function() {
			//Seconds since the Unix Epoch
			return Math.floor(date.getTime() / 1000);
		},

		sago : function() {
			return _formatDateMessage(intval((nowDate - date) / 1000), {
				"0" : "FD_SECOND_AGO_0",
				"1" : "FD_SECOND_AGO_1",
				"10_20" : "FD_SECOND_AGO_10_20",
				"MOD_1" : "FD_SECOND_AGO_MOD_1",
				"MOD_2_4" : "FD_SECOND_AGO_MOD_2_4",
				"MOD_OTHER" : "FD_SECOND_AGO_MOD_OTHER"
			});
		},

		sdiff : function() {
			return _formatDateMessage(intval((nowDate - date) / 1000), {
				"0" : "FD_SECOND_DIFF_0",
				"1" : "FD_SECOND_DIFF_1",
				"10_20" : "FD_SECOND_DIFF_10_20",
				"MOD_1" : "FD_SECOND_DIFF_MOD_1",
				"MOD_2_4" : "FD_SECOND_DIFF_MOD_2_4",
				"MOD_OTHER" : "FD_SECOND_DIFF_MOD_OTHER"
			});
		},

		iago : function() {
			return _formatDateMessage(intval((nowDate - date) / 60 / 1000), {
				"0" : "FD_MINUTE_AGO_0",
				"1" : "FD_MINUTE_AGO_1",
				"10_20" : "FD_MINUTE_AGO_10_20",
				"MOD_1" : "FD_MINUTE_AGO_MOD_1",
				"MOD_2_4" : "FD_MINUTE_AGO_MOD_2_4",
				"MOD_OTHER" : "FD_MINUTE_AGO_MOD_OTHER"
			});
		},

		idiff : function() {
			return _formatDateMessage(intval((nowDate - date) / 60 / 1000), {
				"0" : "FD_MINUTE_DIFF_0",
				"1" : "FD_MINUTE_DIFF_1",
				"10_20" : "FD_MINUTE_DIFF_10_20",
				"MOD_1" : "FD_MINUTE_DIFF_MOD_1",
				"MOD_2_4" : "FD_MINUTE_DIFF_MOD_2_4",
				"MOD_OTHER" : "FD_MINUTE_DIFF_MOD_OTHER"
			});
		},

		isago : function() {
			var minutesAgo = intval((nowDate - date) / 60 / 1000);
			var result = _formatDateMessage(minutesAgo, {
				"0" : "FD_MINUTE_0",
				"1" : "FD_MINUTE_1",
				"10_20" : "FD_MINUTE_10_20",
				"MOD_1" : "FD_MINUTE_MOD_1",
				"MOD_2_4" : "FD_MINUTE_MOD_2_4",
				"MOD_OTHER" : "FD_MINUTE_MOD_OTHER"
			});

			result += " ";

			var secondsAgo = intval((nowDate - date) / 1000) - (minutesAgo * 60);
			result += _formatDateMessage(secondsAgo, {
				"0" : "FD_SECOND_AGO_0",
				"1" : "FD_SECOND_AGO_1",
				"10_20" : "FD_SECOND_AGO_10_20",
				"MOD_1" : "FD_SECOND_AGO_MOD_1",
				"MOD_2_4" : "FD_SECOND_AGO_MOD_2_4",
				"MOD_OTHER" : "FD_SECOND_AGO_MOD_OTHER"
			});
			return result;
		},

		Hago : function() {
			return _formatDateMessage(intval((nowDate - date) / 60 / 60 / 1000), {
				"0" : "FD_HOUR_AGO_0",
				"1" : "FD_HOUR_AGO_1",
				"10_20" : "FD_HOUR_AGO_10_20",
				"MOD_1" : "FD_HOUR_AGO_MOD_1",
				"MOD_2_4" : "FD_HOUR_AGO_MOD_2_4",
				"MOD_OTHER" : "FD_HOUR_AGO_MOD_OTHER"
			});
		},

		Hdiff : function() {
			return _formatDateMessage(intval((nowDate - date) / 60 / 60 / 1000), {
				"0" : "FD_HOUR_DIFF_0",
				"1" : "FD_HOUR_DIFF_1",
				"10_20" : "FD_HOUR_DIFF_10_20",
				"MOD_1" : "FD_HOUR_DIFF_MOD_1",
				"MOD_2_4" : "FD_HOUR_DIFF_MOD_2_4",
				"MOD_OTHER" : "FD_HOUR_DIFF_MOD_OTHER"
			});
		},

		yesterday : function() {
			return BX.message("FD_YESTERDAY");
		},

		today : function() {
			return BX.message("FD_TODAY");
		},

		tommorow : function() {
			return BX.message("FD_TOMORROW");
		},

		dago : function() {
			return _formatDateMessage(intval((nowDate - date) / 60 / 60 / 24 / 1000), {
				"0" : "FD_DAY_AGO_0",
				"1" : "FD_DAY_AGO_1",
				"10_20" : "FD_DAY_AGO_10_20",
				"MOD_1" : "FD_DAY_AGO_MOD_1",
				"MOD_2_4" : "FD_DAY_AGO_MOD_2_4",
				"MOD_OTHER" : "FD_DAY_AGO_MOD_OTHER"
			});
		},

		ddiff : function() {
			return _formatDateMessage(intval((nowDate - date) / 60 / 60 / 24 / 1000), {
				"0" : "FD_DAY_DIFF_0",
				"1" : "FD_DAY_DIFF_1",
				"10_20" : "FD_DAY_DIFF_10_20",
				"MOD_1" : "FD_DAY_DIFF_MOD_1",
				"MOD_2_4" : "FD_DAY_DIFF_MOD_2_4",
				"MOD_OTHER" : "FD_DAY_DIFF_MOD_OTHER"
			});
		},

		mago : function() {
			return _formatDateMessage(intval((nowDate - date) / 60 / 60 / 24 / 31 / 1000), {
				"0" : "FD_MONTH_AGO_0",
				"1" : "FD_MONTH_AGO_1",
				"10_20" : "FD_MONTH_AGO_10_20",
				"MOD_1" : "FD_MONTH_AGO_MOD_1",
				"MOD_2_4" : "FD_MONTH_AGO_MOD_2_4",
				"MOD_OTHER" : "FD_MONTH_AGO_MOD_OTHER"
			});
		},

		mdiff : function() {
			return _formatDateMessage(intval((nowDate - date) / 60 / 60 / 24 / 31 / 1000), {
				"0" : "FD_MONTH_DIFF_0",
				"1" : "FD_MONTH_DIFF_1",
				"10_20" : "FD_MONTH_DIFF_10_20",
				"MOD_1" : "FD_MONTH_DIFF_MOD_1",
				"MOD_2_4" : "FD_MONTH_DIFF_MOD_2_4",
				"MOD_OTHER" : "FD_MONTH_DIFF_MOD_OTHER"
			});
		},

		Yago : function() {
			return _formatDateMessage(intval((nowDate - date) / 60 / 60 / 24 / 365 / 1000), {
				"0" : "FD_YEARS_AGO_0",
				"1" : "FD_YEARS_AGO_1",
				"10_20" : "FD_YEARS_AGO_10_20",
				"MOD_1" : "FD_YEARS_AGO_MOD_1",
				"MOD_2_4" : "FD_YEARS_AGO_MOD_2_4",
				"MOD_OTHER" : "FD_YEARS_AGO_MOD_OTHER"
			});
		},

		Ydiff : function() {
			return _formatDateMessage(intval((nowDate - date) / 60 / 60 / 24 / 365 / 1000), {
				"0" : "FD_YEARS_DIFF_0",
				"1" : "FD_YEARS_DIFF_1",
				"10_20" : "FD_YEARS_DIFF_10_20",
				"MOD_1" : "FD_YEARS_DIFF_MOD_1",
				"MOD_2_4" : "FD_YEARS_DIFF_MOD_2_4",
				"MOD_OTHER" : "FD_YEARS_DIFF_MOD_OTHER"
			});
		},

		x : function() {
			return BX.date.format([
				["tommorow", "tommorow, H:i"],
				["-", BX.date.convertBitrixFormat(BX.message("FORMAT_DATETIME")).replace(/:s$/g, "")],
				["s", "sago"],
				["i", "iago"],
				["today", "today, H:i"],
				["yesterday", "yesterday, H:i"],
				["", BX.date.convertBitrixFormat(BX.message("FORMAT_DATETIME")).replace(/:s$/g, "")]
			], date, nowDate, isUTC);
		},

		X : function() {
			var day = BX.date.format([
				["tommorow", "tommorow"],
				["-", BX.date.convertBitrixFormat(BX.message("FORMAT_DATE"))],
				["today", "today"],
				["yesterday", "yesterday"],
				["", BX.date.convertBitrixFormat(BX.message("FORMAT_DATE"))]
			], date, nowDate, isUTC);

			var time = BX.date.format([
				["tommorow", "H:i"],
				["today", "H:i"],
				["yesterday", "H:i"],
				["", ""]
			], date, nowDate, isUTC);

			if (time.length > 0)
				return BX.message("FD_DAY_AT_TIME").replace(/#DAY#/g, day).replace(/#TIME#/g, time);
			else
				return day;
		},

		Q : function() {
			var daysAgo = intval((nowDate - date) / 60 / 60 / 24 / 1000);
			if(daysAgo == 0)
				return BX.message("FD_DAY_DIFF_1").replace(/#VALUE#/g, 1);
			else
				return BX.date.format([ ["d", "ddiff"], ["m", "mdiff"], ["", "Ydiff"] ], date, nowDate);
		}
	};

	var cutZeroTime = false;
	if (format[0] && format[0] == "^")
	{
		cutZeroTime = true;
		format = format.substr(1);
	}

	var result = format.replace(formatRegex, _replaceDateFormat);

	if (cutZeroTime)
	{
		/* 	15.04.12 13:00:00 => 15.04.12 13:00
			00:01:00 => 00:01
			4 may 00:00:00 => 4 may
			01-01-12 00:00 => 01-01-12
		*/

		result = result.replace(/\s*00:00:00\s*/g, "").
						replace(/(\d\d:\d\d)(:00)/g, "$1").
						replace(/(\s*00:00\s*)(?!:)/g, "");
	}

	return result;

	function _formatDateInterval(formats, date, nowDate, isUTC)
	{
		var secondsAgo = intval((nowDate - date) / 1000);
		for (var i = 0; i < formats.length; i++)
		{
			var formatInterval = formats[i][0];
			var formatValue = formats[i][1];
			var match = null;
			if (formatInterval == "s")
			{
				if (secondsAgo < 60)
					return BX.date.format(formatValue, date, nowDate, isUTC);
			}
			else if ((match = /^s(\d+)/.exec(formatInterval)) != null)
			{
				if (secondsAgo < match[1])
					return BX.date.format(formatValue, date, nowDate, isUTC);
			}
			else if (formatInterval == "i")
			{
				if (secondsAgo < 60 * 60)
					return BX.date.format(formatValue, date, nowDate, isUTC);
			}
			else if ((match = /^i(\d+)/.exec(formatInterval)) != null)
			{
				if (secondsAgo < match[1]*60)
					return BX.date.format(formatValue, date, nowDate, isUTC);
			}
			else if (formatInterval == "H")
			{
				if (secondsAgo < 24 * 60 * 60)
					return BX.date.format(formatValue, date, nowDate, isUTC);
			}
			else if ((match = /^H(\d+)/.exec(formatInterval)) != null)
			{
				if (secondsAgo < match[1] * 60 * 60)
					return BX.date.format(formatValue, date, nowDate, isUTC);
			}
			else if (formatInterval == "d")
			{
				if (secondsAgo < 31 *24 * 60 * 60)
					return BX.date.format(formatValue, date, nowDate, isUTC);
			}
			else if ((match = /^d(\d+)/.exec(formatInterval)) != null)
			{
				if (secondsAgo < match[1] * 60 * 60)
					return BX.date.format(formatValue, date, nowDate, isUTC);
			}
			else if (formatInterval == "m")
			{
				if (secondsAgo < 365 * 24 * 60 * 60)
					return BX.date.format(formatValue, date, nowDate, isUTC);
			}
			else if ((match = /^m(\d+)/.exec(formatInterval)) != null)
			{
				if (secondsAgo < match[1] * 31 * 24 * 60 * 60)
					return BX.date.format(formatValue, date, nowDate, isUTC);
			}
			else if (formatInterval == "today")
			{
				var year = getFullYear(nowDate), month = getMonth(nowDate), day = getDate(nowDate);
				var todayStart = isUTC ? new Date(Date.UTC(year, month, day, 0, 0, 0, 0)) : new Date(year, month, day, 0, 0, 0, 0);
				var todayEnd = isUTC ? new Date(Date.UTC(year, month, day+1, 0, 0, 0, 0)) : new Date(year, month, day+1, 0, 0, 0, 0);
				if (date >= todayStart && date < todayEnd)
					return BX.date.format(formatValue, date, nowDate, isUTC);
			}
			else if (formatInterval == "yesterday")
			{
				year = getFullYear(nowDate); month = getMonth(nowDate); day = getDate(nowDate);
				var yesterdayStart = isUTC ? new Date(Date.UTC(year, month, day-1, 0, 0, 0, 0)) : new Date(year, month, day-1, 0, 0, 0, 0);
				var yesterdayEnd = isUTC ? new Date(Date.UTC(year, month, day, 0, 0, 0, 0)) : new Date(year, month, day, 0, 0, 0, 0);
				if (date >= yesterdayStart && date < yesterdayEnd)
					return BX.date.format(formatValue, date, nowDate, isUTC);
			}
			else if (formatInterval == "tommorow")
			{
				year = getFullYear(nowDate); month = getMonth(nowDate); day = getDate(nowDate);
				var tommorowStart = isUTC ? new Date(Date.UTC(year, month, day+1, 0, 0, 0, 0)) : new Date(year, month, day+1, 0, 0, 0, 0);
				var tommorowEnd = isUTC ? new Date(Date.UTC(year, month, day+2, 0, 0, 0, 0)) : new Date(year, month, day+2, 0, 0, 0, 0);
				if (date >= tommorowStart && date < tommorowEnd)
					return BX.date.format(formatValue, date, nowDate, isUTC);
			}
			else if (formatInterval == "-")
			{
				if (secondsAgo < 0)
					return BX.date.format(formatValue, date, nowDate, isUTC);
			}
		}

		//return formats.length > 0 ? BX.date.format(formats.pop()[1], date, nowDate, isUTC) : "";
		return formats.length > 0 ? BX.date.format(formats[formats.length - 1][1], date, nowDate, isUTC) : "";
	}


	function getFullYear(date) { return isUTC ? date.getUTCFullYear() : date.getFullYear(); }
	function getDate(date) { return isUTC ? date.getUTCDate() : date.getDate(); }
	function getMonth(date) { return isUTC ? date.getUTCMonth() : date.getMonth(); }
	function getHours(date) { return isUTC ? date.getUTCHours() : date.getHours(); }
	function getMinutes(date) { return isUTC ? date.getUTCMinutes() : date.getMinutes(); }
	function getSeconds(date) { return isUTC ? date.getUTCSeconds() : date.getSeconds(); }
	function getMilliseconds(date) { return isUTC ? date.getUTCMilliseconds() : date.getMilliseconds(); }
	function getDay(date) { return isUTC ? date.getUTCDay() : date.getDay(); }
	function setDate(date, dayValue) { return isUTC ? date.setUTCDate(dayValue) : date.setDate(dayValue); }
	function setMonth(date, monthValue, dayValue) { return isUTC ? date.setUTCMonth(monthValue, dayValue) : date.setMonth(monthValue, dayValue); }

	function _formatDateMessage(value, messages)
	{
		var val = value < 100 ? Math.abs(value) : Math.abs(value % 100);
		var dec = val % 10;
		var message = "";

		if(val == 0)
			message = BX.message(messages["0"]);
		else if (val == 1)
			message = BX.message(messages["1"]);
		else if (val >= 10 && val <= 20)
			message = BX.message(messages["10_20"]);
		else if (dec == 1)
			message = BX.message(messages["MOD_1"]);
		else if (2 <= dec && dec <= 4)
			message = BX.message(messages["MOD_2_4"]);
		else
			message = BX.message(messages["MOD_OTHER"]);

		return message.replace(/#VALUE#/g, value);
	}

	function _replaceDateFormat(match, matchFull)
	{
		if (dateFormats[match])
			return dateFormats[match]();
		else
			return matchFull;
	}

	function intval(number)
	{
		return number >= 0 ? Math.floor(number) : Math.ceil(number);
	}
};

BX.date.convertBitrixFormat = function(format)
{
	if (!BX.type.isNotEmptyString(format))
		return "";

	return format.replace("YYYY", "Y")	// 1999
				 .replace("MMMM", "F")	// January - December
				 .replace("MM", "m")	// 01 - 12
				 .replace("M", "M")	// Jan - Dec
				 .replace("DD", "d")	// 01 - 31
				 .replace("G", "g")	//  1 - 12
				 .replace(/GG/i, "G")	//  0 - 23
				 .replace("H", "h")	// 01 - 12
				 .replace(/HH/i, "H")	// 00 - 24
				 .replace("MI", "i")	// 00 - 59
				 .replace("SS", "s")	// 00 - 59
				 .replace("TT", "A")	// AM - PM
				 .replace("T", "a");	// am - pm
};

BX.date.convertToUTC = function(date)
{
	if (!BX.type.isDate(date))
		return null;
	return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
};

/*
 function creates and returns Javascript Date() object from server timestamp regardless of local browser (system) timezone.
 For example can be used to convert timestamp from some exact date on server to the JS Date object with the same value.

 params: {
 timestamp: timestamp in seconds
 }
 */
BX.date.getNewDate = function(timestamp)
{
	return new Date(BX.date.getBrowserTimestamp(timestamp));
};

/*
 function transforms server timestamp (in sec) to javascript timestamp (calculated depend on local browser timezone offset). Returns timestamp in milliseconds.
 Also see BX.date.getNewDate description.

 params: {
 timestamp: timestamp in seconds
 }
 */
BX.date.getBrowserTimestamp = function(timestamp)
{
	timestamp = parseInt(timestamp, 10);
	var browserOffset = new Date(timestamp * 1000).getTimezoneOffset() * 60;
	return (parseInt(timestamp, 10) + parseInt(BX.message('SERVER_TZ_OFFSET')) + browserOffset) * 1000;
};

/*
 function transforms local browser timestamp (in ms) to server timestamp (calculated depend on local browser timezone offset). Returns timestamp in seconds.

 params: {
 timestamp: timestamp in milliseconds
 }
 */
BX.date.getServerTimestamp = function(timestamp)
{
	timestamp = parseInt(timestamp, 10);
	var browserOffset = new Date(timestamp).getTimezoneOffset() * 60;
	return Math.round(timestamp / 1000 - (parseInt(BX.message('SERVER_TZ_OFFSET'), 10) + parseInt(browserOffset, 10)));
};

/************************************** calendar class **********************************/

var obCalendarSingleton = null;

/*
params: {
	node: bind element || document.body

	value - start value in site format (using 'field' param if 'value' does not exist)
	callback - date check handler. can return false to prevent calendar closing.
	callback_after - another handler, called after date picking

	field - field to read/write data

	bTime = true - whether to enable time control
	bHideTime = false - whether to hide time control by default

	currentTime - current UTC time()

}
*/


BX.calendar = function(params)
{
	return BX.calendar.get().Show(params);
};

BX.calendar.get = function()
{
	if (!obCalendarSingleton)
		obCalendarSingleton = new BX.JCCalendar();

	return obCalendarSingleton;
};

// simple func for compatibility with the oldies
BX.calendar.InsertDaysBack = function(input, days)
{
	if (days != '')
	{
		var d = new Date();
		if(days > 0)
		{
			d.setTime(d.valueOf() - days*86400000);
		}

		input.value = BX.date.format(BX.date.convertBitrixFormat(BX.message('FORMAT_DATE')), d, null);
	}
	else
	{
		input.value = '';
	}
};

BX.calendar.ValueToString = function(value, bTime, bUTC)
{
	return BX.date.format(
		BX.date.convertBitrixFormat(BX.message(bTime ? 'FORMAT_DATETIME' : 'FORMAT_DATE')),
		value,
		null,
		!!bUTC
	);
};


BX.CalendarPeriod =
{
	Init: function(inputFrom, inputTo, selPeriod)
	{
		if((inputFrom.value != "" || inputTo.value != "") && selPeriod.value == "")
			selPeriod.value = "interval";

		selPeriod.onchange();
	},

	ChangeDirectOpts: function(peroidValue, selPParent) // "week" || "others"
	{
		var selDirect = BX.findChild(selPParent, {'className':'adm-select adm-calendar-direction'}, true);

		if(peroidValue == "week")
		{
			selDirect.options[0].text = BX.message('JSADM_CALEND_PREV_WEEK');
			selDirect.options[1].text = BX.message('JSADM_CALEND_CURR_WEEK');
			selDirect.options[2].text = BX.message('JSADM_CALEND_NEXT_WEEK');
		}
		else
		{
			selDirect.options[0].text = BX.message('JSADM_CALEND_PREV');
			selDirect.options[1].text = BX.message('JSADM_CALEND_CURR');
			selDirect.options[2].text = BX.message('JSADM_CALEND_NEXT');
		}
	},

	SaveAndClearInput: function(oInput)
	{
		if(!window.SavedPeriodValues)
			window.SavedPeriodValues = {};

		window.SavedPeriodValues[oInput.id] = oInput.value;
		oInput.value="";
	},

	RestoreInput: function(oInput)
	{
		if(!window.SavedPeriodValues || !window.SavedPeriodValues[oInput.id])
			return;

		oInput.value = window.SavedPeriodValues[oInput.id];
		delete(window.SavedPeriodValues[oInput.id]);
	},

	OnChangeP: function(sel)
	{
		var selPParent = sel.parentNode.parentNode;
		var bShowFrom, bShowTo, bShowDirect, bShowSeparate;
		bShowFrom = bShowTo = bShowDirect = bShowSeparate = false;

		var inputFromWrap = BX.findChild(selPParent, {'className':'adm-input-wrap adm-calendar-inp adm-calendar-first'});
		var inputToWrap = BX.findChild(selPParent, {'className':'adm-input-wrap adm-calendar-second'});
		var selDirectWrap = BX.findChild(selPParent, {'className':'adm-select-wrap adm-calendar-direction'});
		var separator = BX.findChild(selPParent, {'className':'adm-calendar-separate'});
		var inputFrom = BX.findChild(selPParent, {'className':'adm-input adm-calendar-from'},true);
		var inputTo = BX.findChild(selPParent, {'className':'adm-input adm-calendar-to'},true);

		// define who must be shown
		switch (sel.value)
		{
			case "day":
			case "week":
			case "month":
			case "quarter":
			case "year":
				bShowDirect=true;
				BX.CalendarPeriod.OnChangeD(selDirectWrap.children[0]);
				break;

			case "before":
				bShowTo = true;
				break;

			case "after":
				bShowFrom = true;
				break;

			case "exact":
				bShowFrom= true;
				break;

			case "interval":
				bShowFrom = bShowTo = bShowSeparate = true;
				BX.CalendarPeriod.RestoreInput(inputFrom);
				BX.CalendarPeriod.RestoreInput(inputTo);

				break;

			case "":
				BX.CalendarPeriod.SaveAndClearInput(inputFrom);
				BX.CalendarPeriod.SaveAndClearInput(inputTo);
				break;

			default:
				break;

		}

		BX.CalendarPeriod.ChangeDirectOpts(sel.value, selPParent);

		inputFromWrap.style.display = (bShowFrom? 'inline-block':'none');
		inputToWrap.style.display = (bShowTo? 'inline-block':'none');
		selDirectWrap.style.display = (bShowDirect? 'inline-block':'none');
		separator.style.display = (bShowSeparate? 'inline-block':'none');
	},


	OnChangeD: function(sel)
	{
		var selPParent = sel.parentNode.parentNode;
		var inputFrom = BX.findChild(selPParent, {'className':'adm-input adm-calendar-from'},true);
		var inputTo = BX.findChild(selPParent, {'className':'adm-input adm-calendar-to'},true);
		var selPeriod = BX.findChild(selPParent, {'className':'adm-select adm-calendar-period'},true);

		var offset=0;

		switch (sel.value)
		{
			case "previous":
				offset = -1;
				break;

			case "next":
				offset = 1;
				break;

			case "current":
			default:
				break;

		}

		var from = false;
		var to = false;

		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth();
		var day = today.getDate();
		var dayW = today.getDay();

		if (dayW == 0)
				dayW = 7;

		switch (selPeriod.value)
		{
			case "day":
				from = new Date(year, month, day+offset, 0, 0, 0);
				to = new Date(year, month, day+offset, 23, 59, 59);
				break;

			case "week":
				from = new Date(year, month, day-dayW+1+offset*7, 0, 0, 0);
				to = new Date(year, month, day+(7-dayW)+offset*7, 23, 59, 59);
				break;

			case "month":
				from = new Date(year, month+offset, 1, 0, 0, 0);
				to = new Date(year, month+1+offset, 0, 23, 59, 59);
				break;

			case "quarter":
				var quarterNum = Math.floor((month/3))+offset;
				from = new Date(year, 3*(quarterNum), 1, 0, 0, 0);
				to = new Date(year, 3*(quarterNum+1), 0, 23, 59, 59);
				break;

			case "year":
				from = new Date(year+offset, 0, 1, 0, 0, 0);
				to = new Date(year+1+offset, 0, 0, 23, 59, 59);
				break;

			default:
				break;
		}

		var format = window[inputFrom.name+"_bTime"] ? BX.message('FORMAT_DATETIME') : BX.message('FORMAT_DATE');

		if(from)
		{
			inputFrom.value = BX.formatDate(from, format);
			BX.addClass(inputFrom,"adm-calendar-inp-setted");
		}

		if(to)
		{
			inputTo.value = BX.formatDate(to, format);
			BX.addClass(inputTo,"adm-calendar-inp-setted");
		}
	}
};


BX.JCCalendar = function()
{
	this.params = {};

	this.bAmPm = BX.isAmPmMode();

	this.popup = null;
	this.popup_month = null;
	this.popup_year = null;

	this.value = null;

	this.control_id = Math.random();

	this._layers = {};
	this._current_layer = null;

	this.DIV = null;
	this.PARTS = {};

	this.weekStart = 0;
	this.numRows = 6;

	this._create = function(params)
	{
		this.popup = new BX.PopupWindow('calendar_popup_' + this.control_id, params.node, {
			closeByEsc: true,
			autoHide: false,
			content: this._get_content(),
			zIndex: 3000,
			bindOptions: {forceBindPosition: true}
		});

		BX.bind(this.popup.popupContainer, 'click', this.popup.cancelBubble);
	};

	this._auto_hide_disable = function()
	{
		BX.unbind(document, 'click', BX.proxy(this._auto_hide, this));
	};

	this._auto_hide_enable = function()
	{
		BX.bind(document, 'click', BX.proxy(this._auto_hide, this));
	};

	this._auto_hide = function(e)
	{
		this._auto_hide_disable();
		this.popup.close();
	};

	this._get_content = function()
	{
		var _layer_onclick = BX.delegate(function(e) {
			e = e||window.event;
			this.SetDate(new Date(parseInt(BX.proxy_context.getAttribute('data-date'))), e.type=='dblclick')
		}, this);

		this.DIV = BX.create('DIV', {
			props: {className: 'bx-calendar'},
			children: [
				BX.create('DIV', {
					props: {
						className: 'bx-calendar-header'
					},
					children: [
						BX.create('A', {
							attrs: {href: 'javascript:void(0)'},
							props: {className: 'bx-calendar-left-arrow'},
							events: {click: BX.proxy(this._prev, this)}
						}),

						BX.create('SPAN', {
							props: {className: 'bx-calendar-header-content'},
							children: [
								(this.PARTS.MONTH = BX.create('A', {
									attrs: {href: 'javascript:void(0)'},
									props: {className: 'bx-calendar-top-month'},
									events: {click: BX.proxy(this._menu_month, this)}
								})),

								(this.PARTS.YEAR = BX.create('A', {
									attrs: {href: 'javascript:void(0)'},
									props: {className: 'bx-calendar-top-year'},
									events: {click: BX.proxy(this._menu_year, this)}
								}))
							]
						}),

						BX.create('A', {
							attrs: {href: 'javascript:void(0)'},
							props: {className: 'bx-calendar-right-arrow'},
							events: {click: BX.proxy(this._next, this)}
						})
					]
				}),

				(this.PARTS.WEEK = BX.create('DIV', {
					props: {
						className: 'bx-calendar-name-day-wrap'
					}
				})),

				(this.PARTS.LAYERS = BX.create('DIV', {
					props: {
						className: 'bx-calendar-cell-block'
					},
					events: {
						click: BX.delegateEvent({className: 'bx-calendar-cell'}, _layer_onclick),
						dblclick: BX.delegateEvent({className: 'bx-calendar-cell'}, _layer_onclick)
					}
				})),

				(this.PARTS.TIME = BX.create('DIV', {
					props: {
						className: 'bx-calendar-set-time-wrap'
					},
					events: {
						click: BX.delegateEvent(
							{attr: 'data-action'},
							BX.delegate(this._time_actions, this)
						)
					},
					html: '<a href="javascript:void(0)" data-action="time_show" class="bx-calendar-set-time"><i></i>'+BX.message('CAL_TIME_SET')+'</a><div class="bx-calendar-form-block"><span class="bx-calendar-form-text">'+BX.message('CAL_TIME')+'</span><span class="bx-calendar-form"><input type="text" class="bx-calendar-form-input" maxwidth="2" onkeyup="BX.calendar.get()._check_time()" /><span class="bx-calendar-form-separator"></span><input type="text" class="bx-calendar-form-input" maxwidth="2" onkeyup="BX.calendar.get()._check_time()" />'+(this.bAmPm?'<span class="bx-calendar-AM-PM-block"><span class="bx-calendar-AM-PM-text" data-action="time_ampm"></span><span class="bx-calendar-form-arrow-r"><a href="javascript:void(0)" class="bx-calendar-form-arrow-top" data-action="time_ampm_up"><i></i></a><a href="javascript:void(0)" class="bx-calendar-form-arrow-bottom" data-action="time_ampm_down"><i></i></a></span></span>':'')+'</span><a href="javascript:void(0)" data-action="time_hide" class="bx-calendar-form-close"><i></i></a></div>'
				})),

				BX.create('DIV', {
					props: {className: 'bx-calendar-button-block'},
					events: {
						click: BX.delegateEvent(
							{attr: 'data-action'},
							BX.delegate(this._button_actions, this)
						)
					},
					html: '<a href="javascript:void(0)" class="bx-calendar-button bx-calendar-button-select" data-action="submit"><span class="bx-calendar-button-left"></span><span class="bx-calendar-button-text">'+BX.message('CAL_BUTTON')+'</span><span class="bx-calendar-button-right"></span></a><a href="javascript:void(0)" class="bx-calendar-button bx-calendar-button-cancel" data-action="cancel"><span class="bx-calendar-button-left"></span><span class="bx-calendar-button-text">'+BX.message('JS_CORE_WINDOW_CLOSE')+'</span><span class="bx-calendar-button-right"></span></a>'
				})
			]
		});

		this.PARTS.TIME_INPUT_H = BX.findChild(this.PARTS.TIME, {tag: 'INPUT'}, true);
		this.PARTS.TIME_INPUT_M = this.PARTS.TIME_INPUT_H.nextSibling.nextSibling;

		if (this.bAmPm)
			this.PARTS.TIME_AMPM = this.PARTS.TIME_INPUT_M.nextSibling.firstChild;

		var spinner = (new BX.JCSpinner({
			input: this.PARTS.TIME_INPUT_H,
			callback_change: BX.proxy(this._check_time, this),
			bSaveValue: false
		})).Show();
		spinner.className = 'bx-calendar-form-arrow-l';
		this.PARTS.TIME_INPUT_H.parentNode.insertBefore(spinner, this.PARTS.TIME_INPUT_H);

		spinner = (new BX.JCSpinner({
			input: this.PARTS.TIME_INPUT_M,
			callback_change: BX.proxy(this._check_time, this),
			bSaveValue: true
		})).Show();
		spinner.className = 'bx-calendar-form-arrow-r';
		if (!this.PARTS.TIME_INPUT_M.nextSibling)
			this.PARTS.TIME_INPUT_M.parentNode.appendChild(spinner);
		else
			this.PARTS.TIME_INPUT_M.parentNode.insertBefore(spinner, this.PARTS.TIME_INPUT_M.nextSibling);

		for (var i = 0; i < 7; i++)
		{
			this.PARTS.WEEK.appendChild(BX.create('SPAN', {
				props: {
					className: 'bx-calendar-name-day'
				},
				text: BX.message('DOW_' + ((i + this.weekStart) % 7))
			}));
		}

		return this.DIV;
	};

	this._time_actions = function()
	{
		switch (BX.proxy_context.getAttribute('data-action'))
		{
			case 'time_show':
				BX.addClass(this.PARTS.TIME, 'bx-calendar-set-time-opened');
				this.popup.adjustPosition();
			break;
			case 'time_hide':
				BX.removeClass(this.PARTS.TIME, 'bx-calendar-set-time-opened');
				this.popup.adjustPosition();
			break;
			case 'time_ampm':
				this.PARTS.TIME_AMPM.innerHTML = this.PARTS.TIME_AMPM.innerHTML == 'AM' ? 'PM' : 'AM';
			break;
			case 'time_ampm_up':
				this._check_time({bSaveValue: false}, null, 12);
				return;
			break;
			case 'time_ampm_down':
				this._check_time({bSaveValue: false}, null, -12);
				return;
			break;
		}

		this._check_time();
	};

	this._button_actions = function()
	{
		switch (BX.proxy_context.getAttribute('data-action'))
		{
			case 'submit':
				this.SaveValue();
			break;
			case 'cancel':
				this.Close();
			break;
		}
	};

	this._check_time = function(params, value, direction)
	{
		var h = parseInt(this.PARTS.TIME_INPUT_H.value.substring(0,5),10)||0,
			m = parseInt(this.PARTS.TIME_INPUT_M.value.substring(0,5),10)||0,
			bChanged = false;

		if (!!params && !params.bSaveValue)
		{
			this.value.setUTCHours(this.value.getUTCHours() + direction);
		}
		else if (!isNaN(h))
		{
			if (this.bAmPm)
			{
				if (h != 12 && this.PARTS.TIME_AMPM.innerHTML == 'PM')
				{
					h += 12;
				}
			}

			bChanged = true;
			this.value.setUTCHours(h % 24);
		}

		if (!isNaN(m))
		{
			bChanged = true;
			this.value.setUTCMinutes(m % 60);
		}

		if (bChanged)
		{
			this.SetValue(this.value);
		}
	};

	this._set_layer = function()
	{
		var layerId = parseInt(this.value.getUTCFullYear() + '' + BX.util.str_pad_left(this.value.getUTCMonth()+'', 2, "0"));

		if (!this._layers[layerId])
		{
			this._layers[layerId] = this._create_layer();
			this._layers[layerId].BXLAYERID = layerId;
		}

		if (this._current_layer)
		{
			var v = new Date(this.value.valueOf());
			v.setUTCHours(0); v.setUTCMinutes(0);

			var cur_value = BX.findChild(this._layers[layerId], {
					tag: 'A',
					className: 'bx-calendar-active'
				}, true),
				new_value = BX.findChild(this._layers[layerId], {
					tag: 'A',
					attr: {
						'data-date' : v.valueOf() + ''
					}
				}, true);

			if (cur_value)
			{
				BX.removeClass(cur_value, 'bx-calendar-active');
			}

			if (new_value)
			{
				BX.addClass(new_value, 'bx-calendar-active');
			}

			this._replace_layer(this._current_layer, this._layers[layerId]);
		}
		else
		{
			this.PARTS.LAYERS.appendChild(this._layers[layerId]);
		}

		this._current_layer = this._layers[layerId];
	};

	this._replace_layer = function(old_layer, new_layer)
	{
		if (old_layer != new_layer)
		{
			if (!BX.browser.IsIE() || BX.browser.IsDoctype())
			{
				var dir = old_layer.BXLAYERID > new_layer.BXLAYERID ? 1 : -1;

				var old_top = 0;
				var new_top = -dir * old_layer.offsetHeight;

				old_layer.style.position = 'relative';
				old_layer.style.top = "0px";
				old_layer.style.zIndex = 5;

				new_layer.style.position = 'absolute';
				new_layer.style.top = new_top + 'px';
				new_layer.style.zIndex = 6;

				this.PARTS.LAYERS.appendChild(new_layer);

				var delta = 15;

				var f;
				(f = function() {
					new_top += dir * delta;
					old_top += dir * delta;

					if (dir * new_top < 0)
					{
						old_layer.style.top = old_top + 'px';
						new_layer.style.top = new_top + 'px';
						setTimeout(f, 10);
					}
					else
					{
						old_layer.parentNode.removeChild(old_layer);

						new_layer.style.top = "0px";
						new_layer.style.position = 'static';
						new_layer.style.zIndex = 0;
					}
				})();
			}
			else
			{
				this.PARTS.LAYERS.replaceChild(new_layer, old_layer);
			}
		}
	};

	this._create_layer = function()
	{
		var l = BX.create('DIV', {
			props: {
				className: 'bx-calendar-layer'
			}
		});

		var month_start = new Date(this.value);
		month_start.setUTCHours(0);
		month_start.setUTCMinutes(0);

		month_start.setUTCDate(1);

		if (month_start.getUTCDay() != this.weekStart)
		{
			var d = month_start.getUTCDay() - this.weekStart;
			d += d < 0 ? 7 : 0;
			month_start.setUTCDate(month_start.getUTCDate()-d);
		}

		var cur_month = this.value.getUTCMonth(),
			cur_day = this.value.getUTCDate(),
			s = '';
		for (var i = 0; i < this.numRows; i++)
		{
			s += '<div class="bx-calendar-range'
				+(i == this.numRows-1 ? ' bx-calendar-range-noline' : '')
				+'">';

			for (var j = 0; j < 7; j++)
			{
				d = month_start.getUTCDate();
				var wd = month_start.getUTCDay();
				var className = 'bx-calendar-cell';

				if (cur_month != month_start.getUTCMonth())
					className += ' bx-calendar-date-hidden';
				else if (cur_day == d)
					className += ' bx-calendar-active';


				if (wd == 0 || wd == 6)
					className += ' bx-calendar-weekend';

				s += '<a href="javascript:void(0)" class="'+className+'" data-date="' + month_start.valueOf() + '">' + d + '</a>';

				month_start.setUTCDate(month_start.getUTCDate()+1);
			}
			s += '</div>';
		}

		l.innerHTML = s;

		return l;
	};

	this._prev = function()
	{
		this.SetMonth(this.value.getUTCMonth()-1);
	};

	this._next = function()
	{
		this.SetMonth(this.value.getUTCMonth()+1);
	};

	this._menu_month_content = function()
	{
		var months = '', cur_month = this.value.getMonth(), i;
		for (i=0; i<12; i++)
		{
			months += '<a href="javascript:void(0)" class="bx-calendar-month'+(i == cur_month ? ' bx-calendar-month-active' : '')+'" onclick="BX.calendar.get().SetMonth('+i+')">'+BX.message('MONTH_' + (i+1))+'</a>';
		}

		return '<div class="bx-calendar-month-popup"><div class="bx-calendar-month-title" onclick="BX.calendar.get().popup_month.close();">'+BX.message('MONTH_' + (this.value.getUTCMonth()+1))+'</div><div class="bx-calendar-month-content">'+months+'</div></div>';
	};

	this._menu_month = function()
	{
		if (!this.popup_month)
		{
			this.popup_month = new BX.PopupWindow(
				'calendar_popup_month_' + this.control_id, this.PARTS.MONTH,
				{
					content: this._menu_month_content(),
					zIndex: 3001,
					closeByEsc: true,
					autoHide: true,
					offsetTop: -29,
					offsetLeft: -1,
					events: {
						onPopupShow: BX.delegate(function() {
							if (this.popup_year)
							{
								this.popup_year.close();
							}
						}, this)
					}
				}
			);

			this.popup_month.BXMONTH = this.value.getUTCMonth();
		}
		else if (this.popup_month.BXMONTH != this.value.getUTCMonth())
		{
			this.popup_month.setContent(this._menu_month_content());
			this.popup_month.BXMONTH = this.value.getUTCMonth();
		}

		this.popup_month.show();
	};

	this._menu_year_content = function()
	{
		var s = '<div class="bx-calendar-year-popup"><div class="bx-calendar-year-title" onclick="BX.calendar.get().popup_year.close();">'+this.value.getUTCFullYear()+'</div><div class="bx-calendar-year-content" id="bx-calendar-year-content">';

		for (var i=-3; i <= 3; i++)
		{
			s += '<a href="javascript:void(0)" class="bx-calendar-year-number'+(i==0?' bx-calendar-year-active':'')+'" onclick="BX.calendar.get().SetYear('+(this.value.getUTCFullYear()-i)+')">'+(this.value.getUTCFullYear()-i)+'</a>';
		}

		s += '</div><input type="text" class="bx-calendar-year-input" onkeyup="if(this.value>=1900&&this.value<=2100)BX.calendar.get().SetYear(this.value);" maxlength="4" /></div>';

		return s;
	};

	this._menu_year = function()
	{
		if (!this.popup_year)
		{
			this.popup_year = new BX.PopupWindow(
				'calendar_popup_year_' + this.control_id, this.PARTS.YEAR,
				{
					content: this._menu_year_content(),
					zIndex: 3001,
					closeByEsc: true,
					autoHide: true,
					offsetTop: -29,
					offsetLeft: -1,
					events: {
						onPopupShow: BX.delegate(function() {
							if (this.popup_month)
							{
								this.popup_month.close();
							}
						}, this)
					}
				}
			);

			this.popup_year.BXYEAR = this.value.getUTCFullYear();
		}
		else if (this.popup_year.BXYEAR != this.value.getUTCFullYear())
		{
			this.popup_year.setContent(this._menu_year_content());
			this.popup_year.BXYEAR = this.value.getUTCFullYear();
		}

		this.popup_year.show();
	};

	this._check_date = function(v)
	{
		var res = v;

		if (BX.type.isString(v))
		{
			res = BX.parseDate(v, true);
		}

		if (!BX.type.isDate(res) || isNaN(res.valueOf()))
		{
			res = BX.date.convertToUTC(new Date());
			if (this.params.bHideTime)
			{
				res.setUTCHours(0);
				res.setUTCMinutes(0);
			}
		}

		res.setUTCMilliseconds(0);
		res.setUTCSeconds(0);

		res.BXCHECKED = true;

		return res;
	};
};

BX.JCCalendar.prototype.Show = function(params)
{
	if (!BX.isReady)
	{
		BX.ready(BX.delegate(function() {this.Show(params)}, this));
		return;
	}

	params.node = params.node||document.body;

	if (BX.type.isNotEmptyString(params.node))
	{
		var n = BX(params.node);
		if (!n)
		{
			n = document.getElementsByName(params.node);
			if (n && n.length > 0)
			{
				n = n[0]
			}
		}
		params.node = n;
	}

	if (!params.node)
		return;

	if (!!params.field)
	{
		if (BX.type.isString(params.field))
		{
			n = BX(params.field);
			if (!!n)
			{
				params.field = n;
			}
			else
			{
				if (params.form)
				{
					if (BX.type.isString(params.form))
					{
						params.form = document.forms[params.form];
					}
				}

				if (BX.type.isDomNode(params.form) && !!params.form[params.field])
				{
					params.field = params.form[params.field];
				}
				else
				{
					n = document.getElementsByName(params.field);
					if (n && n.length > 0)
					{
						n = n[0];
						params.field = n;
					}
				}
			}

			if (BX.type.isString(params.field))
			{
				params.field = BX(params.field);
			}
		}
	}

	var bShow = !this.popup || !this.popup.isShown() || this.params.node != params.node;

	this.params = params;

	this.params.bTime = typeof this.params.bTime == 'undefined' ? true : !!this.params.bTime;
	this.params.bHideTime = typeof this.params.bHideTime == 'undefined' ? true : !!this.params.bHideTime;

	this.weekStart = parseInt(this.params.weekStart || this.params.weekStart || BX.message('WEEK_START'));
	if (isNaN(this.weekStart))
		this.weekStart = 1;

	if (!this.popup)
	{
		this._create(this.params);
	}
	else
	{
		this.popup.setBindElement(this.params.node);
	}

	var bHideTime = !!this.params.bHideTime;
	if (this.params.value)
	{
		this.SetValue(this.params.value);
		bHideTime = this.value.getUTCHours() <= 0 && this.value.getUTCMinutes() <= 0;
	}
	else if (this.params.field)
	{
		this.SetValue(this.params.field.value);
		bHideTime = this.value.getUTCHours() <= 0 && this.value.getUTCMinutes() <= 0;
	}
	else if (!!this.params.currentTime)
	{
		this.SetValue(this.params.currentTime);
	}
	else
	{
		this.SetValue();
	}

	if (!!this.params.bTime)
		BX.removeClass(this.DIV, 'bx-calendar-time-disabled');
	else
		BX.addClass(this.DIV, 'bx-calendar-time-disabled');

	if (!!bHideTime)
		BX.removeClass(this.PARTS.TIME, 'bx-calendar-set-time-opened');
	else
		BX.addClass(this.PARTS.TIME, 'bx-calendar-set-time-opened');

	if (bShow)
	{
		this._auto_hide_disable();
		this.popup.show();
		setTimeout(BX.proxy(this._auto_hide_enable, this), 0);
	}

	this.params.bSetFocus = typeof this.params.bSetFocus == 'undefined' ? true : !!this.params.bSetFocus;
	if(this.params.bSetFocus)
	{
		params.node.blur();
	}
	else
	{
		BX.bind(params.node, 'keyup', BX.defer(function(){
			this.SetValue(params.node.value);
			if(!!this.params.bTime)
			{
				if(this.value.getUTCHours() <= 0 && this.value.getUTCMinutes() <= 0)
					BX.removeClass(this.PARTS.TIME, 'bx-calendar-set-time-opened');
				else
					BX.addClass(this.PARTS.TIME, 'bx-calendar-set-time-opened');
			}
		}, this));
	}

	return this;
};

BX.JCCalendar.prototype.SetDay = function(d)
{
	this.value.setUTCDate(d);
	return this.SetValue(this.value);
};

BX.JCCalendar.prototype.SetMonth = function(m)
{
	if (this.popup_month)
		this.popup_month.close();

	this.value.setUTCMonth(m);

	if(m < 0)
		m += 12;
	else if (m >= 12)
		m -= 12;

	while(this.value.getUTCMonth() > m)
	{
		this.value.setUTCDate(this.value.getUTCDate()-1);
	}

	return this.SetValue(this.value);
};

BX.JCCalendar.prototype.SetYear = function(y)
{
	if (this.popup_year)
		this.popup_year.close();
	this.value.setUTCFullYear(y);
	return this.SetValue(this.value);
};

BX.JCCalendar.prototype.SetDate = function(v, bSet)
{
	v = this._check_date(v);
	v.setUTCHours(this.value.getUTCHours());
	v.setUTCMinutes(this.value.getUTCMinutes());
	v.setUTCSeconds(this.value.getUTCSeconds());

	if (this.params.bTime && !bSet)
	{
		return this.SetValue(v);
	}
	else
	{
		this.SetValue(v);
		this.SaveValue();
	}
};

BX.JCCalendar.prototype.SetValue = function(v)
{
	this.value = (v && v.BXCHECKED) ? v : this._check_date(v);

	this.PARTS.MONTH.innerHTML = BX.message('MONTH_' + (this.value.getUTCMonth()+1));
	this.PARTS.YEAR.innerHTML = this.value.getUTCFullYear();

	if (!!this.params.bTime)
	{
		var h = this.value.getUTCHours();
		if (this.bAmPm)
		{
			if (h >= 12)
			{
				this.PARTS.TIME_AMPM.innerHTML = 'PM';

				if (h != 12)
					h -= 12;
			}
			else
			{
				this.PARTS.TIME_AMPM.innerHTML = 'AM';

				if (h == 0)
					h = 12;
			}
		}

		this.PARTS.TIME_INPUT_H.value = BX.util.str_pad_left(h.toString(), 2, "0");
		this.PARTS.TIME_INPUT_M.value = BX.util.str_pad_left(this.value.getUTCMinutes().toString(), 2, "0");
	}

	this._set_layer();

	return this;
};

BX.JCCalendar.prototype.SaveValue = function()
{
	if (this.popup_month)
		this.popup_month.close();
	if (this.popup_year)
		this.popup_year.close();

	var bSetValue = true;
	if (!!this.params.callback)
	{
		var res = this.params.callback.apply(this, [new Date(this.value.valueOf()+this.value.getTimezoneOffset()*60000)]);
		if (res === false)
			bSetValue = false;
	}

	if (bSetValue)
	{
		var bTime = !!this.params.bTime && BX.hasClass(this.PARTS.TIME, 'bx-calendar-set-time-opened');

		if (this.params.field)
		{
			this.params.field.value = BX.calendar.ValueToString(this.value, bTime, true);
			BX.fireEvent(this.params.field, 'change');
		}

		this.popup.close();

		if (!!this.params.callback_after)
		{
			this.params.callback_after.apply(this, [new Date(this.value.valueOf()+this.value.getTimezoneOffset()*60000), bTime]);
		}
	}

	return this;
};

BX.JCCalendar.prototype.Close = function()
{
	if (!!this.popup)
		this.popup.close();

	return this;
};

BX.JCSpinner = function(params)
{
	params = params || {};
	this.params = {
		input: params.input || null,

		delta: params.delta || 1,

		timeout_start: params.timeout_start || 1000,
		timeout_cont: params.timeout_cont || 150,

		callback_start: params.callback_start || null,
		callback_change: params.callback_change || null,
		callback_finish: params.callback_finish || null,

		bSaveValue: typeof params.bSaveValue == 'undefined' ? !!params.input : !!params.bSaveValue
	};

	this.mousedown = false;
	this.direction = 1;
};

BX.JCSpinner.prototype.Show = function()
{
	this.node = BX.create('span', {
		events: {
			mousedown: BX.delegateEvent(
				{attr: 'data-dir'},
				BX.delegate(this.Start, this)
			)
		},
		html: '<a href="javascript:void(0)" class="bx-calendar-form-arrow bx-calendar-form-arrow-top" data-dir="1"><i></i></a><a href="javascript:void(0)" class="bx-calendar-form-arrow bx-calendar-form-arrow-bottom" data-dir="-1"><i></i></a>'
	});
	return this.node;
};

BX.JCSpinner.prototype.Start = function()
{
	this.mousedown = true;
	this.direction = BX.proxy_context.getAttribute('data-dir') > 0 ? 1 : -1;
	BX.bind(document, "mouseup", BX.proxy(this.MouseUp, this));
	this.ChangeValue(true);
};

BX.JCSpinner.prototype.ChangeValue = function(bFirst)
{
	if(!this.mousedown)
		return;

	if (this.params.input)
	{
		var v = parseInt(this.params.input.value, 10) + this.params.delta * this.direction;

		if (this.params.bSaveValue)
			this.params.input.value = v;

		if (!!bFirst && this.params.callback_start)
			this.params.callback_start(this.params, v, this.direction);

		if (this.params.callback_change)
			this.params.callback_change(this.params, v, this.direction);

		setTimeout(
			BX.proxy(this.ChangeValue, this),
			!!bFirst ? this.params.timeout_start : this.params.timeout_cont
		);
	}
};

BX.JCSpinner.prototype.MouseUp = function()
{
	this.mousedown = false;
	BX.unbind(document, "mouseup", BX.proxy(this.MouseUp, this));

	if (this.params.callback_finish)
		this.params.callback_finish(this.params, this.params.input.value);
};

/**************** compatibility hacks ***************************/

window.jsCalendar = {
	Show: function(obj, field, fieldFrom, fieldTo, bTime, serverTime, form_name, bHideTimebar)
	{
		return BX.calendar({
			node: obj, field: field, form: form_name, bTime: !!bTime, currentTime: serverTime, bHideTimebar: !!bHideTimebar
		});
	},

	ValueToString: BX.calendar.ValueToString
};


/************ clock popup transferred from timeman **************/

BX.CClockSelector = function(params)
{
	this.params = params;

	this.params.popup_buttons = this.params.popup_buttons || [
		new BX.PopupWindowButton({
			text : BX.message('CAL_BUTTON'),
			className : "popup-window-button-create",
			events : {click : BX.proxy(this.setValue, this)}
		})
	];

	this.isReady = false;

	this.WND = new BX.PopupWindow(
		this.params.popup_id || 'clock_selector_popup',
		this.params.node,
		this.params.popup_config || {
			titleBar: BX.message('CAL_TIME'),
			offsetLeft: -45,
			offsetTop: -135,
			autoHide: true,
			closeIcon: true,
			closeByEsc: true,
			zIndex: this.params.zIndex
		}
	);

	this.SHOW = false;
	BX.addCustomEvent(this.WND, "onPopupClose", BX.delegate(this.onPopupClose, this));

	this.obClocks = {};
	this.CLOCK_ID = this.params.clock_id || 'clock_selector';
};

BX.CClockSelector.prototype.Show = function()
{
	if (!this.isReady)
	{
		//BX.timeman.showWait(this.parent.DIV);

		BX.addCustomEvent('onClockRegister', BX.proxy(this.onClockRegister, this));
		return BX.ajax.get('/bitrix/tools/clock_selector.php', {start_time: this.params.start_time, clock_id: this.CLOCK_ID, sessid: BX.bitrix_sessid()}, BX.delegate(this.Ready, this));
	}

	this.WND.setButtons(this.params.popup_buttons);
	this.WND.show();

	this.SHOW = true;

	if (window['bxClock_' + this.obClocks[this.CLOCK_ID]])
	{
		setTimeout("window['bxClock_" + this.obClocks[this.CLOCK_ID] + "'].CalculateCoordinates()", 40);
	}

	return true;
};

BX.CClockSelector.prototype.onClockRegister = function(obClocks)
{
	if (obClocks[this.CLOCK_ID])
	{
		this.obClocks[this.CLOCK_ID] = obClocks[this.CLOCK_ID];
		BX.removeCustomEvent('onClockRegister', BX.proxy(this.onClockRegister, this));
	}
};

BX.CClockSelector.prototype.Ready = function(data)
{
	this.content = this.CreateContent(data);
	this.WND.setContent(this.content);

	this.isReady = true;
	//BX.timeman.closeWait();

	setTimeout(BX.proxy(this.Show, this), 30);
};

BX.CClockSelector.prototype.CreateContent = function(data)
{
	return BX.create('DIV', {
		events: {click: BX.PreventDefault},
		html:
			'<div class="bx-tm-popup-clock">' + data + '</div>'
	});
};

BX.CClockSelector.prototype.setValue = function(e)
{
	if (this.params.callback)
	{
		var input = BX.findChild(this.content, {tagName: 'INPUT'}, true);
		this.params.callback.apply(this.params.node, [input.value]);
	}

	return BX.PreventDefault(e);
};

BX.CClockSelector.prototype.closeWnd = function(e)
{
	this.WND.close();
	return (e || window.event) ? BX.PreventDefault(e) : true;
};

BX.CClockSelector.prototype.setNode = function(node)
{
	this.WND.setBindElement(node);
};

BX.CClockSelector.prototype.setTime = function(timestamp)
{
	this.params.start_time = timestamp;
	if (window['bxClock_' + this.obClocks[this.CLOCK_ID]])
	{
		window['bxClock_' +  this.obClocks[this.CLOCK_ID]].SetTime(parseInt(timestamp/3600), parseInt((timestamp%3600)/60));
	}
};

BX.CClockSelector.prototype.setCallback = function(cb)
{
	this.params.callback = cb;
};

BX.CClockSelector.prototype.onPopupClose = function()
{
	this.SHOW = false;
};

})();

/* End */
;
; /* Start:"a:4:{s:4:"full";s:48:"/bitrix/js/main/json/json2.min.js?15048772383467";s:6:"source";s:33:"/bitrix/js/main/json/json2.min.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/

var JSON;if(!JSON){JSON={};}
(function(){'use strict';function f(n){return n<10?'0'+n:n;}
if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
if(typeof rep==='function'){value=rep.call(holder,key,value);}
switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';gap=mind;return v;}
if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==='string'){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
return str('',{'':value});};}
if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}
text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+
('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
throw new SyntaxError('JSON.parse');};}}());
/* End */
;
; /* Start:"a:4:{s:4:"full";s:47:"/bitrix/js/main/core/core_ls.js?150487723810430";s:6:"source";s:31:"/bitrix/js/main/core/core_ls.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
;(function(window){
if (window.BX.localStorage) return;

var
	BX = window.BX,
	localStorageInstance = null,
	_prefix = null,
	_key = '_bxCurrentKey',
	_support = false;

BX.localStorage = function()
{
	this.keyChanges = {}; // flag to skip self changes in IE
	BX.bind(
		(BX.browser.IsIE() && !BX.browser.IsIE9()) ? document : window, // HATE!
		'storage',
		BX.proxy(this._onchange, this)
	);

	setInterval(BX.delegate(this._clear, this), 5000);
};

/* localStorage public interface */

BX.localStorage.checkBrowser = function()
{
	return _support;
};

BX.localStorage.set = function(key, value, ttl)
{
	return BX.localStorage.instance().set(key, value, ttl);
};

BX.localStorage.get = function(key)
{
	return BX.localStorage.instance().get(key);
};

BX.localStorage.remove = function(key)
{
	return BX.localStorage.instance().remove(key);
};

BX.localStorage.instance = function()
{
	if (!localStorageInstance)
	{
		var support = BX.localStorage.checkBrowser();
		if (support == 'native')
			localStorageInstance = new BX.localStorage();
		else if (support == 'ie8')
			localStorageInstance = new BX.localStorageIE8();
		else if (support == 'ie7')
			localStorageInstance = new BX.localStorageIE7();
		else
		{
			localStorageInstance = {
				'set' : BX.DoNothing,
				'get' : function(){return null},
				'remove' : BX.DoNothing
			};
		}
	}
	return localStorageInstance;
};

/* localStorage prototype */
BX.localStorage.prototype.prefix = function()
{
	if (!_prefix)
	{
		_prefix = 'bx' + BX.message('USER_ID') + '-' + (BX.message.SITE_ID? BX.message('SITE_ID'): 'admin') + '-';
	}

	return _prefix;
};

BX.localStorage.prototype._onchange = function(e)
{
	e = e || window.event;

	if (!e.key)
		return;

	if (BX.browser.DetectIeVersion() > 0 && this.keyChanges[e.key])
	{
		this.keyChanges[e.key] = false;
		return;
	}

	if (!!e.key && e.key.substring(0,this.prefix().length) == this.prefix())
	{
		var d = {
			key: e.key.substring(this.prefix().length, e.key.length),
			value: !!e.newValue? this._decode(e.newValue.substring(11, e.newValue.length)): null,
			oldValue: !!e.oldValue? this._decode(e.oldValue.substring(11, e.oldValue.length)): null
		};

		switch(d.key)
		{
			case 'BXGCE': // BX Global Custom Event
				if (d.value)
				{
					BX.onCustomEvent(d.value.e, d.value.p);
				}
			break;
			default:
				// normal event handlers
				if (e.newValue)
					BX.onCustomEvent(window, 'onLocalStorageSet', [d]);
				if (e.oldValue && !e.newValue)
					BX.onCustomEvent(window, 'onLocalStorageRemove', [d]);

				BX.onCustomEvent(window, 'onLocalStorageChange', [d]);
			break;
		}
	}
};

BX.localStorage.prototype._clear = function()
{
	var curDate = +new Date(), key, i;

	for (i=0; i<localStorage.length; i++)
	{
		key = localStorage.key(i);
		if (key.substring(0,2) == 'bx')
		{
			var ttl = localStorage.getItem(key).split(':', 1)*1000;
			if (curDate >= ttl)
				localStorage.removeItem(key);
		}
	}
};

BX.localStorage.prototype._encode = function(value)
{
	if (typeof(value) == 'object')
		value = JSON.stringify(value);
	else
		value = value.toString();
	return value;
};

BX.localStorage.prototype._decode = function(value)
{
	var answer = null;
	if (!!value)
	{
		try {answer = JSON.parse(value);}
		catch(e) { answer = value; }
	}
	return answer;
};

BX.localStorage.prototype._trigger_error = function(e, key, value, ttl)
{
	BX.onCustomEvent(this, 'onLocalStorageError', [e, {key: key, value: value, ttl: ttl}]);
};

BX.localStorage.prototype.set = function(key, value, ttl)
{
	if (!ttl || ttl <= 0)
		ttl = 60;

	if (key == undefined || key == null || value == undefined)
		return false;

	this.keyChanges[this.prefix()+key] = true;
	try
	{
		localStorage.setItem(
			this.prefix()+key,
			(Math.round((+new Date())/1000)+ttl)+':'+this._encode(value)
		);
	}
	catch (e)
	{
		this._trigger_error(e, key, value, ttl);
	}
};

BX.localStorage.prototype.get = function(key)
{
	var storageAnswer = localStorage.getItem(this.prefix()+key);

	if (storageAnswer)
	{
		var ttl = storageAnswer.split(':', 1)*1000;
		if ((+new Date()) <= ttl)
		{
			storageAnswer = storageAnswer.substring(11, storageAnswer.length);
			return this._decode(storageAnswer);
		}
	}

	return null;
};

BX.localStorage.prototype.remove = function(key)
{
	this.keyChanges[this.prefix()+key] = true;
	localStorage.removeItem(this.prefix()+key);
};

/************** IE 7 ******************/

BX.localStorageIE7 = function()
{
	this.NS = 'BXLocalStorage';
	this.__current_state = {};
	this.keyChanges = {};

	BX.ready(BX.delegate(this._Init, this));
};

BX.extend(BX.localStorageIE7, BX.localStorage);

BX.localStorageIE7.prototype._Init = function()
{
	this.storage_element = document.body.appendChild(BX.create('DIV'));
	this.storage_element.addBehavior('#default#userData');
	this.storage_element.load(this.NS);

	var doc = this.storage_element.xmlDocument,
		len = doc.firstChild.attributes.length;

	for (var i = 0; i<len; i++)
	{
		if (!!doc.firstChild.attributes[i])
		{
			var k = doc.firstChild.attributes[i].nodeName;
			if (k.substring(0,this.prefix().length) == this.prefix())
			{
				this.__current_state[k] = doc.firstChild.attributes[i].nodeValue;
			}
		}
	}

	setInterval(BX.delegate(this._Listener, this), 500);
	setInterval(BX.delegate(this._clear, this), 5000);
};

BX.localStorageIE7.prototype._Listener = function(bInit)
{
	this.storage_element.load(this.NS);

	var doc = this.storage_element.xmlDocument,
		len = doc.firstChild.attributes.length,
		i,k,v;

	var new_state = {}, arChanges = [];

	for (i = 0; i<len; i++)
	{
		if (!!doc.firstChild.attributes[i])
		{
			k = doc.firstChild.attributes[i].nodeName;
			if (k.substring(0,this.prefix().length) == this.prefix())
			{
				v = doc.firstChild.attributes[i].nodeValue;

				if (this.__current_state[k] != v)
				{
					arChanges.push({
						key: k, newValue: v, oldValue: this.__current_state[k]
					});
				}

				new_state[k] = v;
				delete this.__current_state[k];
			}
		}
	}

	for (i in this.__current_state)
	{
		if(this.__current_state.hasOwnProperty(i))
		{
			arChanges.push({
				key: i, newValue: undefined, oldValue: this.__current_state[i]
			});
		}
	}

	this.__current_state = new_state;

	for (i=0; i<arChanges.length; i++)
	{
		this._onchange(arChanges[i]);
	}
};

BX.localStorageIE7.prototype._clear = function()
{
	this.storage_element.load(this.NS);

	var doc = this.storage_element.xmlDocument,
		len = doc.firstChild.attributes.length,
		curDate = +new Date(),
		i,k,v,ttl;

	for (i = 0; i<len; i++)
	{
		if (!!doc.firstChild.attributes[i])
		{
			k = doc.firstChild.attributes[i].nodeName;
			if (k.substring(0,2) == 'bx')
			{
				v = doc.firstChild.attributes[i].nodeValue;
				ttl = v.split(':', 1)*1000;
				if (curDate >= ttl)
				{
					doc.firstChild.removeAttribute(k)
				}
			}
		}
	}

	this.storage_element.save(this.NS);
};

BX.localStorageIE7.prototype.set = function(key, value, ttl)
{
	if (!ttl || ttl <= 0)
		ttl = 60;

	try
	{
		this.storage_element.load(this.NS);

		var doc = this.storage_element.xmlDocument;

		this.keyChanges[this.prefix()+key] = true;

		doc.firstChild.setAttribute(
			this.prefix()+key,
			(Math.round((+new Date())/1000)+ttl)+':'+this._encode(value)
		);

		this.storage_element.save(this.NS);
	}
	catch(e)
	{
		this._trigger_error(e, key, value, ttl);
	}
};

BX.localStorageIE7.prototype.get = function(key)
{
	this.storage_element.load(this.NS);
	var doc = this.storage_element.xmlDocument;

	var storageAnswer = doc.firstChild.getAttribute(this.prefix()+key);

	if (storageAnswer)
	{
		var ttl = storageAnswer.split(':', 1)*1000;
		if ((+new Date()) <= ttl)
		{
			storageAnswer = storageAnswer.substring(11, storageAnswer.length);
			return this._decode(storageAnswer);
		}
	}

	return null;
};

BX.localStorageIE7.prototype.remove = function(key)
{
	this.storage_element.load(this.NS);

	var doc = this.storage_element.xmlDocument;
	doc.firstChild.removeAttribute(this.prefix()+key);

	this.keyChanges[this.prefix()+key] = true;
	this.storage_element.save(this.NS);
};

/************** IE 8 & FF 3.6 ***************/

BX.localStorageIE8 = function()
{
	this.key = _key;

	this.currentKey = null;
	this.currentValue = null;

	BX.localStorageIE8.superclass.constructor.apply(this);
};
BX.extend(BX.localStorageIE8, BX.localStorage);

BX.localStorageIE8.prototype._onchange = function(e)
{
	if (null == this.currentKey)
	{
		this.currentKey = localStorage.getItem(this.key);
		if (this.currentKey)
		{
			this.currentValue = localStorage.getItem(this.prefix() + this.currentKey);
		}
	}
	else
	{
		e = {
			key: this.prefix() + this.currentKey,
			newValue: localStorage.getItem(this.prefix() + this.currentKey),
			oldValue: this.currentValue
		};

		this.currentKey = null;
		this.currentValue = null;

		// especially for FF3.6
		if (this.keyChanges[e.key])
		{
			this.keyChanges[e.key] = false;
			return;
		}

		BX.localStorageIE8.superclass._onchange.apply(this, [e]);
	}
};

BX.localStorageIE8.prototype.set = function(key, value, ttl)
{
	this.currentKey = null;
	this.keyChanges[this.prefix()+key] = true;

	try
	{
		localStorage.setItem(this.key, key);
		BX.localStorageIE8.superclass.set.apply(this, arguments);
	}
	catch(e)
	{
		this._trigger_error(e, key, value, ttl);
	}
};

BX.localStorageIE8.prototype.remove = function(key)
{
	this.currentKey = null;
	this.keyChanges[this.prefix()+key] = true;

	localStorage.setItem(this.key, key);
	BX.localStorageIE8.superclass.remove.apply(this, arguments);
};

/* additional functions */

BX.onGlobalCustomEvent = function(eventName, arEventParams, bSkipSelf)
{
	if (!!BX.localStorage.checkBrowser())
		BX.localStorage.set('BXGCE', {e:eventName,p:arEventParams}, 1);

	if (!bSkipSelf)
		BX.onCustomEvent(eventName, arEventParams);
};

/***************** initialize *********************/

try {
	_support = !!localStorage.setItem;
} catch(e) {}

if (_support)
{
	_support = 'native';

	// hack to check FF3.6 && IE8
	var _target = (BX.browser.IsIE() && !BX.browser.IsIE9()) ? document : window,
		_checkFFnIE8 = function(e) {
		if (typeof(e||window.event).key == 'undefined')
			_support = 'ie8';
		BX.unbind(_target, 'storage', _checkFFnIE8);
		BX.localStorage.instance();
	};
	BX.bind(_target, 'storage', _checkFFnIE8);

	try
	{
		localStorage.setItem(_key, null);
	}
	catch(e)
	{
		_support = false;
		BX.localStorage.instance();
	}
}
else if (BX.browser.IsIE7())
{
	_support = 'ie7';
	BX.localStorage.instance();
}

})(window);


/* End */
;
; /* Start:"a:4:{s:4:"full";s:47:"/bitrix/js/main/core/core_fx.js?150487723816888";s:6:"source";s:31:"/bitrix/js/main/core/core_fx.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
;(function(window){

var defaultOptions = {
	time: 1.0,
	step: 0.05,
	type: 'linear',

	allowFloat: false
}

/*
options: {
	start: start value or {param: value, param: value}
	finish: finish value or {param: value, param: value}
	time: time to transform in seconds
	type: linear|accelerated|decelerated|custom func name
	callback,
	callback_start,
	callback_complete,

	step: time between steps in seconds
	allowFloat: false|true
}
*/
BX.fx = function(options)
{
	this.options = options;

	if (null != this.options.time)
		this.options.originalTime = this.options.time;
	if (null != this.options.step)
		this.options.originalStep = this.options.step;

	if (!this.__checkOptions())
		return false;

	this.__go = BX.delegate(this.go, this);

	this.PARAMS = {};
}

BX.fx.prototype.__checkOptions = function()
{
	if (typeof this.options.start != typeof this.options.finish)
		return false;

	if (null == this.options.time) this.options.time = defaultOptions.time;
	if (null == this.options.step) this.options.step = defaultOptions.step;
	if (null == this.options.type) this.options.type = defaultOptions.type;
	if (null == this.options.allowFloat) this.options.allowFloat = defaultOptions.allowFloat;

	this.options.time *= 1000;
	this.options.step *= 1000;

	if (typeof this.options.start != 'object')
	{
		this.options.start = {_param: this.options.start};
		this.options.finish = {_param: this.options.finish};
	}

	var i;
	for (i in this.options.start)
	{
		if (null == this.options.finish[i])
		{
			this.options.start[i] = null;
			delete this.options.start[i];
		}
	}

	if (!BX.type.isFunction(this.options.type))
	{
		if (BX.type.isFunction(window[this.options.type]))
			this.options.type = window[this.options.type];
		else if (BX.type.isFunction(BX.fx.RULES[this.options.type]))
			this.options.type = BX.fx.RULES[this.options.type];
		else
			this.options.type = BX.fx.RULES[defaultOptions.type];
	}

	return true;
}

BX.fx.prototype.go = function()
{
	var timeCurrent = new Date().valueOf();
	if (timeCurrent < this.PARAMS.timeFinish)
	{
		for (var i in this.PARAMS.current)
		{
			this.PARAMS.current[i][0] = this.options.type.apply(this, [{
				start_value: this.PARAMS.start[i][0],
				finish_value: this.PARAMS.finish[i][0],
				current_value: this.PARAMS.current[i][0],
				current_time: timeCurrent - this.PARAMS.timeStart,
				total_time: this.options.time
			}]);
		}

		this._callback(this.options.callback);

		if (!this.paused)
			this.PARAMS.timer = setTimeout(this.__go, this.options.step);
	}
	else
	{
		this.stop();
	}
}

BX.fx.prototype._callback = function(cb)
{
	var tmp = {};

	cb = cb || this.options.callback;

	for (var i in this.PARAMS.current)
	{
		tmp[i] = (this.options.allowFloat ? this.PARAMS.current[i][0] : Math.round(this.PARAMS.current[i][0])) + this.PARAMS.current[i][1];
	}

	return cb.apply(this, [null != tmp['_param'] ? tmp._param : tmp]);
}

BX.fx.prototype.start = function()
{
	var i,value, unit;

	this.PARAMS.start = {};
	this.PARAMS.current = {};
	this.PARAMS.finish = {};

	for (i in this.options.start)
	{
		value = +this.options.start[i];
		unit = (this.options.start[i]+'').substring((value+'').length);
		this.PARAMS.start[i] = [value, unit];
		this.PARAMS.current[i] = [value, unit];
		this.PARAMS.finish[i] = [+this.options.finish[i], unit];
	}

	this._callback(this.options.callback_start);
	this._callback(this.options.callback);

	this.PARAMS.timeStart = new Date().valueOf();
	this.PARAMS.timeFinish = this.PARAMS.timeStart + this.options.time;
	this.PARAMS.timer = setTimeout(BX.delegate(this.go, this), this.options.step);

	return this;
}

BX.fx.prototype.pause = function()
{
	if (this.paused)
	{
		this.PARAMS.timer = setTimeout(this.__go, this.options.step);
		this.paused = false;
	}
	else
	{
		clearTimeout(this.PARAMS.timer);
		this.paused = true;
	}
}

BX.fx.prototype.stop = function(silent)
{
	silent = !!silent;
	if (this.PARAMS.timer)
		clearTimeout(this.PARAMS.timer);

	if (null != this.options.originalTime)
		this.options.time = this.options.originalTime;
	if (null != this.options.originalStep)
		this.options.step = this.options.originalStep;

	this.PARAMS.current = this.PARAMS.finish;
	if (!silent) {
		this._callback(this.options.callback);
		this._callback(this.options.callback_complete);
	}
}

/*
type rules of animation
 - linear - simple linear animation
 - accelerated
 - decelerated
*/

/*
	params: {
		start_value, finish_value, current_time, total_time
	}
*/
BX.fx.RULES =
{
	linear: function(params)
	{
		return params.start_value + (params.current_time/params.total_time) * (params.finish_value - params.start_value);
	},

	decelerated: function(params)
	{
		return params.start_value + Math.sqrt(params.current_time/params.total_time) * (params.finish_value - params.start_value);
	},

	accelerated: function(params)
	{
		var q = params.current_time/params.total_time;
		return params.start_value + q * q * (params.finish_value - params.start_value);
	}
}

/****************** effects realizaion ************************/

/*
	type = 'fade' || 'scroll' || 'scale' || 'fold'
*/

BX.fx.hide = function(el, type, opts)
{
	el = BX(el);

	if (typeof type == 'object' && null == opts)
	{
		opts = type;
		type = opts.type
	}

	if (!opts) opts = {};

	if (!BX.type.isNotEmptyString(type))
	{
		el.style.display = 'none';
		return;
	}

	var fxOptions = BX.fx.EFFECTS[type](el, opts, 0);
	fxOptions.callback_complete = function () {
		if (opts.hide !== false)
			el.style.display = 'none';

		if (opts.callback_complete)
			opts.callback_complete.apply(this, arguments);
	}

	return (new BX.fx(fxOptions)).start();
}

BX.fx.show = function(el, type, opts)
{
	el = BX(el);

	if (typeof type == 'object' && null == opts)
	{
		opts = type;
		type = opts.type
	}

	if (!opts) opts = {};

	if (!BX.type.isNotEmptyString(type))
	{
		el.style.display = 'block';
		return;
	}

	var fxOptions = BX.fx.EFFECTS[type](el, opts, 1);

	fxOptions.callback_complete = function () {
		if (opts.show !== false)
			el.style.display = 'block';

		if (opts.callback_complete)
			opts.callback_complete.apply(this, arguments);
	}

	return (new BX.fx(fxOptions)).start();
}

BX.fx.EFFECTS = {
	scroll: function(el, opts, action)
	{
		if (!opts.direction) opts.direction = 'vertical';

		var param = opts.direction == 'horizontal' ? 'width' : 'height';

		var val = parseInt(BX.style(el, param));
		if (isNaN(val))
		{
			val = BX.pos(el)[param];
		}

		if (action == 0)
			var start = val, finish = opts.min_height ? parseInt(opts.min_height) : 0;
		else
			var finish = val, start = opts.min_height ? parseInt(opts.min_height) : 0;

		return {
			'start': start,
			'finish': finish,
			'time': opts.time || defaultOptions.time,
			'type': 'linear',
			callback_start: function () {
				if (BX.style(el, 'position') == 'static')
					el.style.position = 'relative';

				el.style.overflow = 'hidden';
				el.style[param] = start + 'px';
				el.style.display = 'block';
			},
			callback: function (val) {el.style[param] = val + 'px';}
		}
	},

	fade: function(el, opts, action)
	{
		var fadeOpts = {
			'time': opts.time || defaultOptions.time,
			'type': action == 0 ? 'decelerated' : 'linear',
			'start': action == 0 ? 1 : 0,
			'finish': action == 0 ? 0 : 1,
			'allowFloat': true
		};

		if (BX.browser.IsIE() && !BX.browser.IsIE9())
		{
			fadeOpts.start *= 100; fadeOpts.finish *= 100; fadeOpts.allowFloat = false;

			fadeOpts.callback_start = function() {
				el.style.display = 'block';
				el.style.filter += "progid:DXImageTransform.Microsoft.Alpha(opacity=" + fadeOpts.start + ")";
			};

			fadeOpts.callback = function (val) {
				(el.filters['DXImageTransform.Microsoft.alpha']||el.filters.alpha).opacity = val;
			}
		}
		else
		{
			fadeOpts.callback_start = function () {
				el.style.display = 'block';
			}

			fadeOpts.callback = function (val) {
				el.style.opacity = el.style.KhtmlOpacity = el.style.MozOpacity = val;
			};
		}

		return fadeOpts;
	},

	fold: function (el, opts, action) // 'fold' is a combination of two consequential 'scroll' hidings.
	{
		if (action != 0) return;

		var pos = BX.pos(el);
		var coef = pos.height / (pos.width + pos.height);
		var old_opts = {time: opts.time || defaultOptions.time, callback_complete: opts.callback_complete, hide: opts.hide};

		opts.type = 'scroll';
		opts.direction = 'vertical';
		opts.min_height = opts.min_height || 10;
		opts.hide = false;
		opts.time = coef * old_opts.time;
		opts.callback_complete = function()
		{
			el.style.whiteSpace = 'nowrap';

			opts.direction = 'horizontal';
			opts.min_height = null;

			opts.time = old_opts.time - opts.time;
			opts.hide = old_opts.hide;
			opts.callback_complete = old_opts.callback_complete;

			BX.fx.hide(el, opts);
		}

		return BX.fx.EFFECTS.scroll(el, opts, action);
	},

	scale: function (el, opts, action)
	{
		var val = {width: parseInt(BX.style(el, 'width')), height: parseInt(BX.style(el, 'height'))};
		if (isNaN(val.width) || isNaN(val.height))
		{
			var pos = BX.pos(el)
			val = {width: pos.width, height: pos.height};
		}

		if (action == 0)
			var start = val, finish = {width: 0, height: 0};
		else
			var finish = val, start = {width: 0, height: 0};

		return {
			'start': start,
			'finish': finish,
			'time': opts.time || defaultOptions.time,
			'type': 'linear',
			callback_start: function () {
				el.style.position = 'relative';
				el.style.overflow = 'hidden';
				el.style.display = 'block';
				el.style.height = start.height + 'px';
				el.style.width = start.width + 'px';
			},
			callback: function (val) {
				el.style.height = val.height + 'px';
				el.style.width = val.width + 'px';
			}
		}
	}
}

// Color animation
//
// Set animation rule
// BX.fx.colorAnimate.addRule('animationRule1',"#FFF","#faeeb4", "background-color", 100, 1, true);
// BX.fx.colorAnimate.addRule('animationRule2',"#fc8282","#ff0000", "color", 100, 1, true);
// Params: 1 - animation name, 2 - start color, 3 - end color, 4 - count step, 5 - delay each step, 6 - return color on end animation
//
// Animate color for element
// BX.fx.colorAnimate(BX('element'), 'animationRule1,animationRule2');

var defaultOptionsColorAnimation = {
	arStack: {},
	arRules: {},
	globalAnimationId: 0
}

BX.fx.colorAnimate = function(element, rule, back)
{
	if (element == null)
		return;

	animationId = element.getAttribute('data-animation-id');
	if (animationId == null)
	{
		animationId = defaultOptionsColorAnimation.globalAnimationId;
		element.setAttribute('data-animation-id', defaultOptionsColorAnimation.globalAnimationId++);
	}
	var aRuleList = rule.split(/\s*,\s*/);

	for (var j	= 0; j < aRuleList.length; j++)
	{
		rule = aRuleList[j];

		if (!defaultOptionsColorAnimation.arRules[rule]) continue;

		var i=0;

		if (!defaultOptionsColorAnimation.arStack[animationId])
		{
			defaultOptionsColorAnimation.arStack[animationId] = {};
		}
		else if (defaultOptionsColorAnimation.arStack[animationId][rule])
		{
			i = defaultOptionsColorAnimation.arStack[animationId][rule].i;
			clearInterval(defaultOptionsColorAnimation.arStack[animationId][rule].tId);
		}

		if ((i==0 && back) || (i==defaultOptionsColorAnimation.arRules[rule][3] && !back)) continue;

		defaultOptionsColorAnimation.arStack[animationId][rule] = {'i':i, 'element': element, 'tId':setInterval('BX.fx.colorAnimate.run("'+animationId+'","'+rule+'")', defaultOptionsColorAnimation.arRules[rule][4]),'back':Boolean(back)};
	}
}

BX.fx.colorAnimate.addRule = function (rule, startColor, finishColor, cssProp, step, delay, back)
{
	defaultOptionsColorAnimation.arRules[rule] = [
		BX.util.hex2rgb(startColor),
		BX.util.hex2rgb(finishColor),
		cssProp.replace(/\-(.)/g,function(){return arguments[1].toUpperCase();}),
		step,
		delay || 1,
		back || false
	];
};

BX.fx.colorAnimate.run = function(animationId, rule)
{
	element = defaultOptionsColorAnimation.arStack[animationId][rule].element;

    defaultOptionsColorAnimation.arStack[animationId][rule].i += defaultOptionsColorAnimation.arStack[animationId][rule].back?-1:1;
 	var finishPercent = defaultOptionsColorAnimation.arStack[animationId][rule].i/defaultOptionsColorAnimation.arRules[rule][3];
	var startPercent = 1 - finishPercent;

	var aRGBStart = defaultOptionsColorAnimation.arRules[rule][0];
	var aRGBFinish = defaultOptionsColorAnimation.arRules[rule][1];

	element.style[defaultOptionsColorAnimation.arRules[rule][2]] = 'rgb('+
	Math.floor( aRGBStart['r'] * startPercent + aRGBFinish['r'] * finishPercent ) + ','+
	Math.floor( aRGBStart['g'] * startPercent + aRGBFinish['g'] * finishPercent ) + ','+
	Math.floor( aRGBStart['b'] * startPercent + aRGBFinish['b'] * finishPercent ) +')';

	if ( defaultOptionsColorAnimation.arStack[animationId][rule].i == defaultOptionsColorAnimation.arRules[rule][3] || defaultOptionsColorAnimation.arStack[animationId][rule].i ==0)
	{
		clearInterval(defaultOptionsColorAnimation.arStack[animationId][rule].tId);
		if (defaultOptionsColorAnimation.arRules[rule][5])
			BX.fx.colorAnimate(defaultOptionsColorAnimation.arStack[animationId][rule].element, rule, true);
	}
}


/*
options = {
	delay: 100,
	duration : 3000,
	start : { scroll : document.body.scrollTop, left : 0, opacity :  100 },
	finish : { scroll : document.body.scrollHeight, left : 500, opacity : 10 },
	transition : BitrixAnimation.makeEaseOut(BitrixAnimation.transitions.quart),

	step : function(state)
	{
		document.body.scrollTop = state.scroll;
		button.style.left =  state.left + "px";
		button.style.opacity =  state.opacity / 100;
	},
	complete : function()
	{
		button.style.background = "green";
	}
}

options =
{
	delay : 20,
	duration : 4000,
	transition : BXAnimation.makeEaseOut(BXAnimation.transitions.quart),
	progress : function(progress)
	{
		document.body.scrollTop = Math.round(topMax * progress);
		button.style.left =  Math.round(leftMax * progress) + "px";
		button.style.opacity =  (100 + Math.round((opacityMin - 100) * progress)) / 100;

	},
	complete : function()
	{
		button.style.background = "green";
	}
}
*/

BX.easing = function(options)
{
	this.options = options;
	this.timer = null;
};

BX.easing.prototype.animate = function()
{
	if (!this.options || !this.options.start || !this.options.finish ||
		typeof(this.options.start) != "object" || typeof(this.options.finish) != "object"
		)
		return null;

	for (var propName in this.options.start)
	{
		if (typeof(this.options.finish[propName]) == "undefined")
		{
			delete this.options.start[propName];
		}
	}

	this.options.progress = function(progress) {
		var state = {};
		for (var propName in this.start)
			state[propName] = Math.round(this.start[propName] + (this.finish[propName] - this.start[propName]) * progress);

		if (this.step)
		{
			this.step(state);
		}
	};

	this.animateProgress();
};

BX.easing.prototype.stop = function(completed)
{
	if (this.timer)
	{
		cancelAnimationFrame(this.timer);
		this.timer = null;
		if (completed)
		{
			this.options.complete && this.options.complete();
		}
	}
};

BX.easing.prototype.animateProgress = function()
{
	if (!window.requestAnimationFrame)
	{
		//For old browsers we skip animation
		this.options.progress(1);
		this.options.complete && this.options.complete();
		return;
	}

	var start = null;
	var delta = this.options.transition || BX.easing.transitions.linear;
	var duration = this.options.duration || 1000;
	var animation = BX.proxy(function(time) {

		if (start === null)
		{
			start = time;
		}

		var progress = (time - start) / duration;
		if (progress > 1)
		{
			progress = 1;
		}

		this.options.progress(delta(progress));

		if (progress == 1)
		{
			this.stop(true);
		}
		else
		{
			this.timer = requestAnimationFrame(animation);
		}

	}, this);

	this.timer = requestAnimationFrame(animation);
};

BX.easing.makeEaseInOut = function(delta)
{
	return function(progress) {
		if (progress < 0.5)
			return delta( 2 * progress ) / 2;
		else
			return (2 - delta( 2 * (1-progress) ) ) / 2;
	}
};

BX.easing.makeEaseOut = function(delta)
{
	return function(progress) {
		return 1 - delta(1 - progress);
	};
};

BX.easing.transitions = {

	linear : function(progress)
	{
		return progress;
	},

	quad : function(progress)
	{
		return Math.pow(progress, 2);
	},

	cubic : function(progress) {
		return Math.pow(progress, 3);
	},

	quart : function(progress)
	{
		return Math.pow(progress, 4);
	},

	quint : function(progress)
	{
		return Math.pow(progress, 5);
	},

	circ : function(progress)
	{
		return 1 - Math.sin(Math.acos(progress));
	},

	back : function(progress)
	{
		return Math.pow(progress, 2) * ((1.5 + 1) * progress - 1.5);
	},

	elastic: function(progress)
	{
		return Math.pow(2, 10 * (progress-1)) * Math.cos(20 * Math.PI * 1.5/3 * progress);
	},

	bounce : function(progress)
	{
		for(var a = 0, b = 1; 1; a += b, b /= 2) {
			if (progress >= (7 - 4 * a) / 11) {
				return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
			}
		}
	}};


})(window);


/* End */
;
; /* Start:"a:4:{s:4:"full";s:41:"/bitrix/js/main/session.js?15048772383642";s:6:"source";s:26:"/bitrix/js/main/session.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
function CBXSession()
{
	var _this = this;
	this.mess = {};
	this.timeout = null;
	this.sessid = null;
	this.bShowMess = true;
	this.dateStart = new Date();
	this.dateInput = new Date();
	this.dateCheck = new Date();
	this.activityInterval = 0;
	this.notifier = null;
	
	this.Expand = function(timeout, sessid, bShowMess, key)
	{
		this.timeout = timeout;
		this.sessid = sessid;
		this.bShowMess = bShowMess;
		this.key = key;
		
		BX.ready(function(){
			BX.bind(document, "keypress", _this.OnUserInput);
			BX.bind(document.body, "mousemove", _this.OnUserInput);
			BX.bind(document.body, "click", _this.OnUserInput);
			
			setTimeout(_this.CheckSession, (_this.timeout-60)*1000);
		})
	};
		
	this.OnUserInput = function()
	{
		var curr = new Date();
		_this.dateInput.setTime(curr.valueOf());
	};
	
	this.CheckSession = function()
	{
		var curr = new Date();
		if(curr.valueOf() - _this.dateCheck.valueOf() < 30000)
			return;

		_this.activityInterval = Math.round((_this.dateInput.valueOf() - _this.dateStart.valueOf())/1000);
		_this.dateStart.setTime(_this.dateInput.valueOf());
		var interval = (_this.activityInterval > _this.timeout? (_this.timeout-60) : _this.activityInterval);

		var config = {
			'method': 'GET',
			'dataType': 'html',
			'url': '/bitrix/tools/public_session.php?sessid='+_this.sessid+'&interval='+interval+'&k='+_this.key,
			'data':  '',
			'onsuccess': function(data){_this.CheckResult(data)},
			'lsId': 'sess_expand', //caching the result in the local storage for multiple tabs
			'lsTimeout': 60
		};
		if(interval > 0)
		{
			//forced request
			config.lsForce = true;
		}
		BX.ajax(config);
	};
	
	this.CheckResult = function(data)
	{
		if(data == 'SESSION_EXPIRED')
		{
			if(_this.bShowMess)
			{
				if(!_this.notifier)
				{
					_this.notifier = document.body.appendChild(BX.create('DIV', {
						props: {className: 'bx-session-message'},
						style: {
							top: '0px',
							backgroundColor: '#FFEB41',
							border: '1px solid #EDDA3C',
							width: '630px',
							fontFamily: 'Arial,Helvetica,sans-serif',
							fontSize: '13px',
							fontWeight: 'bold',
							textAlign: 'center',
							color: 'black',
							position: 'absolute',
							zIndex: '10000',
							padding: '10px'
						},
						html: '<a class="bx-session-message-close" style="display:block; width:12px; height:12px; background:url(/bitrix/js/main/core/images/close.gif) center no-repeat; float:right;" href="javascript:bxSession.Close()"></a>'+_this.mess.messSessExpired
					}));

					var windowScroll = BX.GetWindowScrollPos();
					var windowSize = BX.GetWindowInnerSize();

					_this.notifier.style.left = parseInt(windowScroll.scrollLeft + windowSize.innerWidth / 2 - parseInt(_this.notifier.clientWidth) / 2) + 'px';

					if(BX.browser.IsIE())
					{
						_this.notifier.style.top = windowScroll.scrollTop + 'px';

						BX.bind(window, 'scroll', function()
						{
							var windowScroll = BX.GetWindowScrollPos();
							_this.notifier.style.top = windowScroll.scrollTop + 'px';
						});
					}
					else
					{
						_this.notifier.style.position='fixed';
					}
				}

				_this.notifier.style.display = '';
			}
		}
		else
		{
			var timeout;
			if(data == 'SESSION_CHANGED')
				timeout = (_this.timeout-60);
			else
				timeout = (_this.activityInterval < 60? 60 : (_this.activityInterval > _this.timeout? (_this.timeout-60) : _this.activityInterval));

			var curr = new Date();
			_this.dateCheck.setTime(curr.valueOf());
			setTimeout(_this.CheckSession, timeout*1000);
		}
	};
	
	this.Close = function()
	{
		this.notifier.style.display = 'none';
	}
}

var bxSession = new CBXSession();

/* End */
;
; /* Start:"a:4:{s:4:"full";s:41:"/bitrix/js/main/session.js?15048772383642";s:6:"source";s:26:"/bitrix/js/main/session.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
function CBXSession()
{
	var _this = this;
	this.mess = {};
	this.timeout = null;
	this.sessid = null;
	this.bShowMess = true;
	this.dateStart = new Date();
	this.dateInput = new Date();
	this.dateCheck = new Date();
	this.activityInterval = 0;
	this.notifier = null;
	
	this.Expand = function(timeout, sessid, bShowMess, key)
	{
		this.timeout = timeout;
		this.sessid = sessid;
		this.bShowMess = bShowMess;
		this.key = key;
		
		BX.ready(function(){
			BX.bind(document, "keypress", _this.OnUserInput);
			BX.bind(document.body, "mousemove", _this.OnUserInput);
			BX.bind(document.body, "click", _this.OnUserInput);
			
			setTimeout(_this.CheckSession, (_this.timeout-60)*1000);
		})
	};
		
	this.OnUserInput = function()
	{
		var curr = new Date();
		_this.dateInput.setTime(curr.valueOf());
	};
	
	this.CheckSession = function()
	{
		var curr = new Date();
		if(curr.valueOf() - _this.dateCheck.valueOf() < 30000)
			return;

		_this.activityInterval = Math.round((_this.dateInput.valueOf() - _this.dateStart.valueOf())/1000);
		_this.dateStart.setTime(_this.dateInput.valueOf());
		var interval = (_this.activityInterval > _this.timeout? (_this.timeout-60) : _this.activityInterval);

		var config = {
			'method': 'GET',
			'dataType': 'html',
			'url': '/bitrix/tools/public_session.php?sessid='+_this.sessid+'&interval='+interval+'&k='+_this.key,
			'data':  '',
			'onsuccess': function(data){_this.CheckResult(data)},
			'lsId': 'sess_expand', //caching the result in the local storage for multiple tabs
			'lsTimeout': 60
		};
		if(interval > 0)
		{
			//forced request
			config.lsForce = true;
		}
		BX.ajax(config);
	};
	
	this.CheckResult = function(data)
	{
		if(data == 'SESSION_EXPIRED')
		{
			if(_this.bShowMess)
			{
				if(!_this.notifier)
				{
					_this.notifier = document.body.appendChild(BX.create('DIV', {
						props: {className: 'bx-session-message'},
						style: {
							top: '0px',
							backgroundColor: '#FFEB41',
							border: '1px solid #EDDA3C',
							width: '630px',
							fontFamily: 'Arial,Helvetica,sans-serif',
							fontSize: '13px',
							fontWeight: 'bold',
							textAlign: 'center',
							color: 'black',
							position: 'absolute',
							zIndex: '10000',
							padding: '10px'
						},
						html: '<a class="bx-session-message-close" style="display:block; width:12px; height:12px; background:url(/bitrix/js/main/core/images/close.gif) center no-repeat; float:right;" href="javascript:bxSession.Close()"></a>'+_this.mess.messSessExpired
					}));

					var windowScroll = BX.GetWindowScrollPos();
					var windowSize = BX.GetWindowInnerSize();

					_this.notifier.style.left = parseInt(windowScroll.scrollLeft + windowSize.innerWidth / 2 - parseInt(_this.notifier.clientWidth) / 2) + 'px';

					if(BX.browser.IsIE())
					{
						_this.notifier.style.top = windowScroll.scrollTop + 'px';

						BX.bind(window, 'scroll', function()
						{
							var windowScroll = BX.GetWindowScrollPos();
							_this.notifier.style.top = windowScroll.scrollTop + 'px';
						});
					}
					else
					{
						_this.notifier.style.position='fixed';
					}
				}

				_this.notifier.style.display = '';
			}
		}
		else
		{
			var timeout;
			if(data == 'SESSION_CHANGED')
				timeout = (_this.timeout-60);
			else
				timeout = (_this.activityInterval < 60? 60 : (_this.activityInterval > _this.timeout? (_this.timeout-60) : _this.activityInterval));

			var curr = new Date();
			_this.dateCheck.setTime(curr.valueOf());
			setTimeout(_this.CheckSession, timeout*1000);
		}
	};
	
	this.Close = function()
	{
		this.notifier.style.display = 'none';
	}
}

var bxSession = new CBXSession();

/* End */
;
; /* Start:"a:4:{s:4:"full";s:41:"/bitrix/js/main/session.js?15048772383642";s:6:"source";s:26:"/bitrix/js/main/session.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
function CBXSession()
{
	var _this = this;
	this.mess = {};
	this.timeout = null;
	this.sessid = null;
	this.bShowMess = true;
	this.dateStart = new Date();
	this.dateInput = new Date();
	this.dateCheck = new Date();
	this.activityInterval = 0;
	this.notifier = null;
	
	this.Expand = function(timeout, sessid, bShowMess, key)
	{
		this.timeout = timeout;
		this.sessid = sessid;
		this.bShowMess = bShowMess;
		this.key = key;
		
		BX.ready(function(){
			BX.bind(document, "keypress", _this.OnUserInput);
			BX.bind(document.body, "mousemove", _this.OnUserInput);
			BX.bind(document.body, "click", _this.OnUserInput);
			
			setTimeout(_this.CheckSession, (_this.timeout-60)*1000);
		})
	};
		
	this.OnUserInput = function()
	{
		var curr = new Date();
		_this.dateInput.setTime(curr.valueOf());
	};
	
	this.CheckSession = function()
	{
		var curr = new Date();
		if(curr.valueOf() - _this.dateCheck.valueOf() < 30000)
			return;

		_this.activityInterval = Math.round((_this.dateInput.valueOf() - _this.dateStart.valueOf())/1000);
		_this.dateStart.setTime(_this.dateInput.valueOf());
		var interval = (_this.activityInterval > _this.timeout? (_this.timeout-60) : _this.activityInterval);

		var config = {
			'method': 'GET',
			'dataType': 'html',
			'url': '/bitrix/tools/public_session.php?sessid='+_this.sessid+'&interval='+interval+'&k='+_this.key,
			'data':  '',
			'onsuccess': function(data){_this.CheckResult(data)},
			'lsId': 'sess_expand', //caching the result in the local storage for multiple tabs
			'lsTimeout': 60
		};
		if(interval > 0)
		{
			//forced request
			config.lsForce = true;
		}
		BX.ajax(config);
	};
	
	this.CheckResult = function(data)
	{
		if(data == 'SESSION_EXPIRED')
		{
			if(_this.bShowMess)
			{
				if(!_this.notifier)
				{
					_this.notifier = document.body.appendChild(BX.create('DIV', {
						props: {className: 'bx-session-message'},
						style: {
							top: '0px',
							backgroundColor: '#FFEB41',
							border: '1px solid #EDDA3C',
							width: '630px',
							fontFamily: 'Arial,Helvetica,sans-serif',
							fontSize: '13px',
							fontWeight: 'bold',
							textAlign: 'center',
							color: 'black',
							position: 'absolute',
							zIndex: '10000',
							padding: '10px'
						},
						html: '<a class="bx-session-message-close" style="display:block; width:12px; height:12px; background:url(/bitrix/js/main/core/images/close.gif) center no-repeat; float:right;" href="javascript:bxSession.Close()"></a>'+_this.mess.messSessExpired
					}));

					var windowScroll = BX.GetWindowScrollPos();
					var windowSize = BX.GetWindowInnerSize();

					_this.notifier.style.left = parseInt(windowScroll.scrollLeft + windowSize.innerWidth / 2 - parseInt(_this.notifier.clientWidth) / 2) + 'px';

					if(BX.browser.IsIE())
					{
						_this.notifier.style.top = windowScroll.scrollTop + 'px';

						BX.bind(window, 'scroll', function()
						{
							var windowScroll = BX.GetWindowScrollPos();
							_this.notifier.style.top = windowScroll.scrollTop + 'px';
						});
					}
					else
					{
						_this.notifier.style.position='fixed';
					}
				}

				_this.notifier.style.display = '';
			}
		}
		else
		{
			var timeout;
			if(data == 'SESSION_CHANGED')
				timeout = (_this.timeout-60);
			else
				timeout = (_this.activityInterval < 60? 60 : (_this.activityInterval > _this.timeout? (_this.timeout-60) : _this.activityInterval));

			var curr = new Date();
			_this.dateCheck.setTime(curr.valueOf());
			setTimeout(_this.CheckSession, timeout*1000);
		}
	};
	
	this.Close = function()
	{
		this.notifier.style.display = 'none';
	}
}

var bxSession = new CBXSession();

/* End */
;
; /* Start:"a:4:{s:4:"full";s:41:"/bitrix/js/main/session.js?15048772383642";s:6:"source";s:26:"/bitrix/js/main/session.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
function CBXSession()
{
	var _this = this;
	this.mess = {};
	this.timeout = null;
	this.sessid = null;
	this.bShowMess = true;
	this.dateStart = new Date();
	this.dateInput = new Date();
	this.dateCheck = new Date();
	this.activityInterval = 0;
	this.notifier = null;
	
	this.Expand = function(timeout, sessid, bShowMess, key)
	{
		this.timeout = timeout;
		this.sessid = sessid;
		this.bShowMess = bShowMess;
		this.key = key;
		
		BX.ready(function(){
			BX.bind(document, "keypress", _this.OnUserInput);
			BX.bind(document.body, "mousemove", _this.OnUserInput);
			BX.bind(document.body, "click", _this.OnUserInput);
			
			setTimeout(_this.CheckSession, (_this.timeout-60)*1000);
		})
	};
		
	this.OnUserInput = function()
	{
		var curr = new Date();
		_this.dateInput.setTime(curr.valueOf());
	};
	
	this.CheckSession = function()
	{
		var curr = new Date();
		if(curr.valueOf() - _this.dateCheck.valueOf() < 30000)
			return;

		_this.activityInterval = Math.round((_this.dateInput.valueOf() - _this.dateStart.valueOf())/1000);
		_this.dateStart.setTime(_this.dateInput.valueOf());
		var interval = (_this.activityInterval > _this.timeout? (_this.timeout-60) : _this.activityInterval);

		var config = {
			'method': 'GET',
			'dataType': 'html',
			'url': '/bitrix/tools/public_session.php?sessid='+_this.sessid+'&interval='+interval+'&k='+_this.key,
			'data':  '',
			'onsuccess': function(data){_this.CheckResult(data)},
			'lsId': 'sess_expand', //caching the result in the local storage for multiple tabs
			'lsTimeout': 60
		};
		if(interval > 0)
		{
			//forced request
			config.lsForce = true;
		}
		BX.ajax(config);
	};
	
	this.CheckResult = function(data)
	{
		if(data == 'SESSION_EXPIRED')
		{
			if(_this.bShowMess)
			{
				if(!_this.notifier)
				{
					_this.notifier = document.body.appendChild(BX.create('DIV', {
						props: {className: 'bx-session-message'},
						style: {
							top: '0px',
							backgroundColor: '#FFEB41',
							border: '1px solid #EDDA3C',
							width: '630px',
							fontFamily: 'Arial,Helvetica,sans-serif',
							fontSize: '13px',
							fontWeight: 'bold',
							textAlign: 'center',
							color: 'black',
							position: 'absolute',
							zIndex: '10000',
							padding: '10px'
						},
						html: '<a class="bx-session-message-close" style="display:block; width:12px; height:12px; background:url(/bitrix/js/main/core/images/close.gif) center no-repeat; float:right;" href="javascript:bxSession.Close()"></a>'+_this.mess.messSessExpired
					}));

					var windowScroll = BX.GetWindowScrollPos();
					var windowSize = BX.GetWindowInnerSize();

					_this.notifier.style.left = parseInt(windowScroll.scrollLeft + windowSize.innerWidth / 2 - parseInt(_this.notifier.clientWidth) / 2) + 'px';

					if(BX.browser.IsIE())
					{
						_this.notifier.style.top = windowScroll.scrollTop + 'px';

						BX.bind(window, 'scroll', function()
						{
							var windowScroll = BX.GetWindowScrollPos();
							_this.notifier.style.top = windowScroll.scrollTop + 'px';
						});
					}
					else
					{
						_this.notifier.style.position='fixed';
					}
				}

				_this.notifier.style.display = '';
			}
		}
		else
		{
			var timeout;
			if(data == 'SESSION_CHANGED')
				timeout = (_this.timeout-60);
			else
				timeout = (_this.activityInterval < 60? 60 : (_this.activityInterval > _this.timeout? (_this.timeout-60) : _this.activityInterval));

			var curr = new Date();
			_this.dateCheck.setTime(curr.valueOf());
			setTimeout(_this.CheckSession, timeout*1000);
		}
	};
	
	this.Close = function()
	{
		this.notifier.style.display = 'none';
	}
}

var bxSession = new CBXSession();

/* End */
;
; /* Start:"a:4:{s:4:"full";s:41:"/bitrix/js/main/session.js?15048772383642";s:6:"source";s:26:"/bitrix/js/main/session.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
function CBXSession()
{
	var _this = this;
	this.mess = {};
	this.timeout = null;
	this.sessid = null;
	this.bShowMess = true;
	this.dateStart = new Date();
	this.dateInput = new Date();
	this.dateCheck = new Date();
	this.activityInterval = 0;
	this.notifier = null;
	
	this.Expand = function(timeout, sessid, bShowMess, key)
	{
		this.timeout = timeout;
		this.sessid = sessid;
		this.bShowMess = bShowMess;
		this.key = key;
		
		BX.ready(function(){
			BX.bind(document, "keypress", _this.OnUserInput);
			BX.bind(document.body, "mousemove", _this.OnUserInput);
			BX.bind(document.body, "click", _this.OnUserInput);
			
			setTimeout(_this.CheckSession, (_this.timeout-60)*1000);
		})
	};
		
	this.OnUserInput = function()
	{
		var curr = new Date();
		_this.dateInput.setTime(curr.valueOf());
	};
	
	this.CheckSession = function()
	{
		var curr = new Date();
		if(curr.valueOf() - _this.dateCheck.valueOf() < 30000)
			return;

		_this.activityInterval = Math.round((_this.dateInput.valueOf() - _this.dateStart.valueOf())/1000);
		_this.dateStart.setTime(_this.dateInput.valueOf());
		var interval = (_this.activityInterval > _this.timeout? (_this.timeout-60) : _this.activityInterval);

		var config = {
			'method': 'GET',
			'dataType': 'html',
			'url': '/bitrix/tools/public_session.php?sessid='+_this.sessid+'&interval='+interval+'&k='+_this.key,
			'data':  '',
			'onsuccess': function(data){_this.CheckResult(data)},
			'lsId': 'sess_expand', //caching the result in the local storage for multiple tabs
			'lsTimeout': 60
		};
		if(interval > 0)
		{
			//forced request
			config.lsForce = true;
		}
		BX.ajax(config);
	};
	
	this.CheckResult = function(data)
	{
		if(data == 'SESSION_EXPIRED')
		{
			if(_this.bShowMess)
			{
				if(!_this.notifier)
				{
					_this.notifier = document.body.appendChild(BX.create('DIV', {
						props: {className: 'bx-session-message'},
						style: {
							top: '0px',
							backgroundColor: '#FFEB41',
							border: '1px solid #EDDA3C',
							width: '630px',
							fontFamily: 'Arial,Helvetica,sans-serif',
							fontSize: '13px',
							fontWeight: 'bold',
							textAlign: 'center',
							color: 'black',
							position: 'absolute',
							zIndex: '10000',
							padding: '10px'
						},
						html: '<a class="bx-session-message-close" style="display:block; width:12px; height:12px; background:url(/bitrix/js/main/core/images/close.gif) center no-repeat; float:right;" href="javascript:bxSession.Close()"></a>'+_this.mess.messSessExpired
					}));

					var windowScroll = BX.GetWindowScrollPos();
					var windowSize = BX.GetWindowInnerSize();

					_this.notifier.style.left = parseInt(windowScroll.scrollLeft + windowSize.innerWidth / 2 - parseInt(_this.notifier.clientWidth) / 2) + 'px';

					if(BX.browser.IsIE())
					{
						_this.notifier.style.top = windowScroll.scrollTop + 'px';

						BX.bind(window, 'scroll', function()
						{
							var windowScroll = BX.GetWindowScrollPos();
							_this.notifier.style.top = windowScroll.scrollTop + 'px';
						});
					}
					else
					{
						_this.notifier.style.position='fixed';
					}
				}

				_this.notifier.style.display = '';
			}
		}
		else
		{
			var timeout;
			if(data == 'SESSION_CHANGED')
				timeout = (_this.timeout-60);
			else
				timeout = (_this.activityInterval < 60? 60 : (_this.activityInterval > _this.timeout? (_this.timeout-60) : _this.activityInterval));

			var curr = new Date();
			_this.dateCheck.setTime(curr.valueOf());
			setTimeout(_this.CheckSession, timeout*1000);
		}
	};
	
	this.Close = function()
	{
		this.notifier.style.display = 'none';
	}
}

var bxSession = new CBXSession();

/* End */
;
; /* Start:"a:4:{s:4:"full";s:41:"/bitrix/js/main/session.js?15048772383642";s:6:"source";s:26:"/bitrix/js/main/session.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
function CBXSession()
{
	var _this = this;
	this.mess = {};
	this.timeout = null;
	this.sessid = null;
	this.bShowMess = true;
	this.dateStart = new Date();
	this.dateInput = new Date();
	this.dateCheck = new Date();
	this.activityInterval = 0;
	this.notifier = null;
	
	this.Expand = function(timeout, sessid, bShowMess, key)
	{
		this.timeout = timeout;
		this.sessid = sessid;
		this.bShowMess = bShowMess;
		this.key = key;
		
		BX.ready(function(){
			BX.bind(document, "keypress", _this.OnUserInput);
			BX.bind(document.body, "mousemove", _this.OnUserInput);
			BX.bind(document.body, "click", _this.OnUserInput);
			
			setTimeout(_this.CheckSession, (_this.timeout-60)*1000);
		})
	};
		
	this.OnUserInput = function()
	{
		var curr = new Date();
		_this.dateInput.setTime(curr.valueOf());
	};
	
	this.CheckSession = function()
	{
		var curr = new Date();
		if(curr.valueOf() - _this.dateCheck.valueOf() < 30000)
			return;

		_this.activityInterval = Math.round((_this.dateInput.valueOf() - _this.dateStart.valueOf())/1000);
		_this.dateStart.setTime(_this.dateInput.valueOf());
		var interval = (_this.activityInterval > _this.timeout? (_this.timeout-60) : _this.activityInterval);

		var config = {
			'method': 'GET',
			'dataType': 'html',
			'url': '/bitrix/tools/public_session.php?sessid='+_this.sessid+'&interval='+interval+'&k='+_this.key,
			'data':  '',
			'onsuccess': function(data){_this.CheckResult(data)},
			'lsId': 'sess_expand', //caching the result in the local storage for multiple tabs
			'lsTimeout': 60
		};
		if(interval > 0)
		{
			//forced request
			config.lsForce = true;
		}
		BX.ajax(config);
	};
	
	this.CheckResult = function(data)
	{
		if(data == 'SESSION_EXPIRED')
		{
			if(_this.bShowMess)
			{
				if(!_this.notifier)
				{
					_this.notifier = document.body.appendChild(BX.create('DIV', {
						props: {className: 'bx-session-message'},
						style: {
							top: '0px',
							backgroundColor: '#FFEB41',
							border: '1px solid #EDDA3C',
							width: '630px',
							fontFamily: 'Arial,Helvetica,sans-serif',
							fontSize: '13px',
							fontWeight: 'bold',
							textAlign: 'center',
							color: 'black',
							position: 'absolute',
							zIndex: '10000',
							padding: '10px'
						},
						html: '<a class="bx-session-message-close" style="display:block; width:12px; height:12px; background:url(/bitrix/js/main/core/images/close.gif) center no-repeat; float:right;" href="javascript:bxSession.Close()"></a>'+_this.mess.messSessExpired
					}));

					var windowScroll = BX.GetWindowScrollPos();
					var windowSize = BX.GetWindowInnerSize();

					_this.notifier.style.left = parseInt(windowScroll.scrollLeft + windowSize.innerWidth / 2 - parseInt(_this.notifier.clientWidth) / 2) + 'px';

					if(BX.browser.IsIE())
					{
						_this.notifier.style.top = windowScroll.scrollTop + 'px';

						BX.bind(window, 'scroll', function()
						{
							var windowScroll = BX.GetWindowScrollPos();
							_this.notifier.style.top = windowScroll.scrollTop + 'px';
						});
					}
					else
					{
						_this.notifier.style.position='fixed';
					}
				}

				_this.notifier.style.display = '';
			}
		}
		else
		{
			var timeout;
			if(data == 'SESSION_CHANGED')
				timeout = (_this.timeout-60);
			else
				timeout = (_this.activityInterval < 60? 60 : (_this.activityInterval > _this.timeout? (_this.timeout-60) : _this.activityInterval));

			var curr = new Date();
			_this.dateCheck.setTime(curr.valueOf());
			setTimeout(_this.CheckSession, timeout*1000);
		}
	};
	
	this.Close = function()
	{
		this.notifier.style.display = 'none';
	}
}

var bxSession = new CBXSession();

/* End */
;
; /* Start:"a:4:{s:4:"full";s:41:"/bitrix/js/main/session.js?15048772383642";s:6:"source";s:26:"/bitrix/js/main/session.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
function CBXSession()
{
	var _this = this;
	this.mess = {};
	this.timeout = null;
	this.sessid = null;
	this.bShowMess = true;
	this.dateStart = new Date();
	this.dateInput = new Date();
	this.dateCheck = new Date();
	this.activityInterval = 0;
	this.notifier = null;
	
	this.Expand = function(timeout, sessid, bShowMess, key)
	{
		this.timeout = timeout;
		this.sessid = sessid;
		this.bShowMess = bShowMess;
		this.key = key;
		
		BX.ready(function(){
			BX.bind(document, "keypress", _this.OnUserInput);
			BX.bind(document.body, "mousemove", _this.OnUserInput);
			BX.bind(document.body, "click", _this.OnUserInput);
			
			setTimeout(_this.CheckSession, (_this.timeout-60)*1000);
		})
	};
		
	this.OnUserInput = function()
	{
		var curr = new Date();
		_this.dateInput.setTime(curr.valueOf());
	};
	
	this.CheckSession = function()
	{
		var curr = new Date();
		if(curr.valueOf() - _this.dateCheck.valueOf() < 30000)
			return;

		_this.activityInterval = Math.round((_this.dateInput.valueOf() - _this.dateStart.valueOf())/1000);
		_this.dateStart.setTime(_this.dateInput.valueOf());
		var interval = (_this.activityInterval > _this.timeout? (_this.timeout-60) : _this.activityInterval);

		var config = {
			'method': 'GET',
			'dataType': 'html',
			'url': '/bitrix/tools/public_session.php?sessid='+_this.sessid+'&interval='+interval+'&k='+_this.key,
			'data':  '',
			'onsuccess': function(data){_this.CheckResult(data)},
			'lsId': 'sess_expand', //caching the result in the local storage for multiple tabs
			'lsTimeout': 60
		};
		if(interval > 0)
		{
			//forced request
			config.lsForce = true;
		}
		BX.ajax(config);
	};
	
	this.CheckResult = function(data)
	{
		if(data == 'SESSION_EXPIRED')
		{
			if(_this.bShowMess)
			{
				if(!_this.notifier)
				{
					_this.notifier = document.body.appendChild(BX.create('DIV', {
						props: {className: 'bx-session-message'},
						style: {
							top: '0px',
							backgroundColor: '#FFEB41',
							border: '1px solid #EDDA3C',
							width: '630px',
							fontFamily: 'Arial,Helvetica,sans-serif',
							fontSize: '13px',
							fontWeight: 'bold',
							textAlign: 'center',
							color: 'black',
							position: 'absolute',
							zIndex: '10000',
							padding: '10px'
						},
						html: '<a class="bx-session-message-close" style="display:block; width:12px; height:12px; background:url(/bitrix/js/main/core/images/close.gif) center no-repeat; float:right;" href="javascript:bxSession.Close()"></a>'+_this.mess.messSessExpired
					}));

					var windowScroll = BX.GetWindowScrollPos();
					var windowSize = BX.GetWindowInnerSize();

					_this.notifier.style.left = parseInt(windowScroll.scrollLeft + windowSize.innerWidth / 2 - parseInt(_this.notifier.clientWidth) / 2) + 'px';

					if(BX.browser.IsIE())
					{
						_this.notifier.style.top = windowScroll.scrollTop + 'px';

						BX.bind(window, 'scroll', function()
						{
							var windowScroll = BX.GetWindowScrollPos();
							_this.notifier.style.top = windowScroll.scrollTop + 'px';
						});
					}
					else
					{
						_this.notifier.style.position='fixed';
					}
				}

				_this.notifier.style.display = '';
			}
		}
		else
		{
			var timeout;
			if(data == 'SESSION_CHANGED')
				timeout = (_this.timeout-60);
			else
				timeout = (_this.activityInterval < 60? 60 : (_this.activityInterval > _this.timeout? (_this.timeout-60) : _this.activityInterval));

			var curr = new Date();
			_this.dateCheck.setTime(curr.valueOf());
			setTimeout(_this.CheckSession, timeout*1000);
		}
	};
	
	this.Close = function()
	{
		this.notifier.style.display = 'none';
	}
}

var bxSession = new CBXSession();

/* End */
;
; /* Start:"a:4:{s:4:"full";s:41:"/bitrix/js/main/session.js?15048772383642";s:6:"source";s:26:"/bitrix/js/main/session.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
function CBXSession()
{
	var _this = this;
	this.mess = {};
	this.timeout = null;
	this.sessid = null;
	this.bShowMess = true;
	this.dateStart = new Date();
	this.dateInput = new Date();
	this.dateCheck = new Date();
	this.activityInterval = 0;
	this.notifier = null;
	
	this.Expand = function(timeout, sessid, bShowMess, key)
	{
		this.timeout = timeout;
		this.sessid = sessid;
		this.bShowMess = bShowMess;
		this.key = key;
		
		BX.ready(function(){
			BX.bind(document, "keypress", _this.OnUserInput);
			BX.bind(document.body, "mousemove", _this.OnUserInput);
			BX.bind(document.body, "click", _this.OnUserInput);
			
			setTimeout(_this.CheckSession, (_this.timeout-60)*1000);
		})
	};
		
	this.OnUserInput = function()
	{
		var curr = new Date();
		_this.dateInput.setTime(curr.valueOf());
	};
	
	this.CheckSession = function()
	{
		var curr = new Date();
		if(curr.valueOf() - _this.dateCheck.valueOf() < 30000)
			return;

		_this.activityInterval = Math.round((_this.dateInput.valueOf() - _this.dateStart.valueOf())/1000);
		_this.dateStart.setTime(_this.dateInput.valueOf());
		var interval = (_this.activityInterval > _this.timeout? (_this.timeout-60) : _this.activityInterval);

		var config = {
			'method': 'GET',
			'dataType': 'html',
			'url': '/bitrix/tools/public_session.php?sessid='+_this.sessid+'&interval='+interval+'&k='+_this.key,
			'data':  '',
			'onsuccess': function(data){_this.CheckResult(data)},
			'lsId': 'sess_expand', //caching the result in the local storage for multiple tabs
			'lsTimeout': 60
		};
		if(interval > 0)
		{
			//forced request
			config.lsForce = true;
		}
		BX.ajax(config);
	};
	
	this.CheckResult = function(data)
	{
		if(data == 'SESSION_EXPIRED')
		{
			if(_this.bShowMess)
			{
				if(!_this.notifier)
				{
					_this.notifier = document.body.appendChild(BX.create('DIV', {
						props: {className: 'bx-session-message'},
						style: {
							top: '0px',
							backgroundColor: '#FFEB41',
							border: '1px solid #EDDA3C',
							width: '630px',
							fontFamily: 'Arial,Helvetica,sans-serif',
							fontSize: '13px',
							fontWeight: 'bold',
							textAlign: 'center',
							color: 'black',
							position: 'absolute',
							zIndex: '10000',
							padding: '10px'
						},
						html: '<a class="bx-session-message-close" style="display:block; width:12px; height:12px; background:url(/bitrix/js/main/core/images/close.gif) center no-repeat; float:right;" href="javascript:bxSession.Close()"></a>'+_this.mess.messSessExpired
					}));

					var windowScroll = BX.GetWindowScrollPos();
					var windowSize = BX.GetWindowInnerSize();

					_this.notifier.style.left = parseInt(windowScroll.scrollLeft + windowSize.innerWidth / 2 - parseInt(_this.notifier.clientWidth) / 2) + 'px';

					if(BX.browser.IsIE())
					{
						_this.notifier.style.top = windowScroll.scrollTop + 'px';

						BX.bind(window, 'scroll', function()
						{
							var windowScroll = BX.GetWindowScrollPos();
							_this.notifier.style.top = windowScroll.scrollTop + 'px';
						});
					}
					else
					{
						_this.notifier.style.position='fixed';
					}
				}

				_this.notifier.style.display = '';
			}
		}
		else
		{
			var timeout;
			if(data == 'SESSION_CHANGED')
				timeout = (_this.timeout-60);
			else
				timeout = (_this.activityInterval < 60? 60 : (_this.activityInterval > _this.timeout? (_this.timeout-60) : _this.activityInterval));

			var curr = new Date();
			_this.dateCheck.setTime(curr.valueOf());
			setTimeout(_this.CheckSession, timeout*1000);
		}
	};
	
	this.Close = function()
	{
		this.notifier.style.display = 'none';
	}
}

var bxSession = new CBXSession();

/* End */
;