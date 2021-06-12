
; /* Start:"a:4:{s:4:"full";s:79:"/local/templates/dweb/components/bitrix/main.share/flat/script.js?1504877236990";s:6:"source";s:65:"/local/templates/dweb/components/bitrix/main.share/flat/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
(function (window)
{
	if (!!window.JCShareButtons)
	{
		return;
	}

	window.JCShareButtons = function (containerId)
	{
		if (containerId)
		{
			var container = BX(containerId);
			if (container)
			{
				this.shareButtons = BX.findChildren(container, {tagName: 'LI'}, true);
				if (this.shareButtons && this.shareButtons.length >= 1)
				{
					BX.bind(this.shareButtons[this.shareButtons.length-1], 'click', BX.delegate(this.alterVisibility, this));
				}
			}
		}
	};

	window.JCShareButtons.prototype.alterVisibility = function()
	{
		if (this.shareButtons && this.shareButtons.length >= 1)
		{
			for (var i = 0; i < this.shareButtons.length-1; i++)
			{
				var li = this.shareButtons[i];
				li.style.display = li.style.display == "none"? "": "none";
			}
		}
	};
}
)(window);

function __function_exists(function_name)
{
	if (typeof function_name == 'string')
	{
		return (typeof window[function_name] == 'function');
	}
	else
	{
		return (function_name instanceof Function);
	}
}

/* End */
;; /* /local/templates/dweb/components/bitrix/main.share/flat/script.js?1504877236990*/
