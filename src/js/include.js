/*
var Helper = {
	langsDir: '/langs',
	
	init: function(aOptions = {}) {
		this.nodes = Array.from(document.getElementsByTagName('*'));
		this.langsDir = aOptions.langsDir || '/langs';
		
		/!* find all data-lang*!/
		this.domNodes().filter(function(item) {
			return item.getAttribute('data-lang') !== null;
		}).forEach(function(item) {
			//console.info(`"${item.getAttribute('data-lang').trim()}" : "${item.innerText.trim()}",`);
		});
		
		return this;
	},
	
	domNodes: function(aForceReload = false) {
		if (!Boolean(this.nodes) || aForceReload) {
			this.nodes = Array.from(document.getElementsByTagName('*'));
			console.info(this.nodes.length());
		}
		
		return this.nodes;
	},
	
	includeCSS: function(aAttr = 'data-css') {
		var self = this;
		
		self.domNodes()
			.filter(function(elem) {
				return elem.getAttribute(aAttr) !== null;
			})
			.forEach(function(Elem) {
				var elem = Elem, url = elem.getAttribute(aAttr);
				
				self.requestGET(url, function(content) {
					elem.innerHTML = '\n\t' + content;
					elem.removeAttribute(aAttr);
				});
			});
		return self;
	},
	
	includeHtml: function(aAttr = 'data-include') {
		var self = this;
		
		self.domNodes()
			.filter(function(elem) {
				return elem.getAttribute(aAttr) !== null;
			})
			.forEach(function(Elem) {
				var elem = Elem, url = elem.getAttribute(aAttr);
				
				self.requestGET(url, function(content) {
					elem.innerHTML = '\n\t' + content;
					elem.removeAttribute(aAttr);
				});
			});
		
		return self;
	},
	
	includeJS: function(aAttr = 'data-js') {
		var self = this;
		
		self.domNodes()
			.filter(function(elem) {
				return elem.getAttribute(aAttr) !== null;
			})
			.forEach(function(Elem) {
				var elem = Elem, url = elem.getAttribute(aAttr);
				
				self.requestGET(url, function(content) {
					elem.innerHTML = '\n\t' + content;
					elem.removeAttribute(aAttr);
				});
			});
		return self;
	},
	
	localize: function(aLang) {
		const self      = this,
			translate = function(aLangArr, aAttr = 'data-lang') {
				self.domNodes().filter(function(item) {
					return item.getAttribute(aAttr) !== null;
				}).forEach(function(item) {
					const key = item.getAttribute(aAttr);
					if (Boolean(aLangArr[key])) {
						item.innerText = aLangArr[key];
					}
				});
			};
		
		self.requestGET(`${self.langsDir}/${aLang}.json`, function(content) {
			translate(JSON.parse(content));
		}, function(e) {
			console.error(e);
		});
		
		return self;
	},
	
	requestGET: function(aURL, aOnSuccess, aOnError) {
		if (!aURL) {
			throw new Error(`Resource ${aURL} - not found!`);
		}
		
		var onSuccess = aOnSuccess || function(data) {
			console.info('Successful "GET"! >>> ' + data.length + ' Bytes!');
		};
		var onError = aOnError || function(status) {
			console.warn(`Error "GET" request with code "${status}"!`);
		};
		var xhttp = new XMLHttpRequest();
		
		xhttp.onreadystatechange = function() {
			if (this.readyState === 4) {
				switch (this.status) {
					case 200:
						onSuccess(this.responseText, this);
						break;
					case 404:
						onError(this.status);
						break;
					default:
						onError(this.status);
				}
			}
		};
		xhttp.open('GET', aURL, true);
		xhttp.send();
	},
	
	load: function(uri, callback) {
		const self = this;
		self.requestGET(uri, function(content) {
			var js = document.createElement('script');
			js.type = 'text/javascript';
			js.innerHTML = content;
			document.body.appendChild(js);
			
			if (typeof callback !== 'undefined') {
				callback(document);
			}
		});
	},
	
};
*/
