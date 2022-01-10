//
// tablesorter
//


(function($){$.extend({tablesorter:new
function(){var parsers=[],widgets=[];this.defaults={cssHeader:"header",cssAsc:"headerSortUp",cssDesc:"headerSortDown",cssChildRow:"expand-child",sortInitialOrder:"asc",sortMultiSortKey:"shiftKey",sortForce:null,sortAppend:null,sortLocaleCompare:true,textExtraction:"simple",parsers:{},widgets:[],widgetZebra:{css:["even","odd"]},headers:{},widthFixed:false,cancelSelection:true,sortList:[],headerList:[],dateFormat:"us",decimal:'/\.|\,/g',onRenderHeader:null,selectorHeaders:'thead th',debug:false};function benchmark(s,d){log(s+","+(new Date().getTime()-d.getTime())+"ms");}this.benchmark=benchmark;function log(s){if(typeof console!="undefined"&&typeof console.debug!="undefined"){console.log(s);}else{alert(s);}}function buildParserCache(table,$headers){if(table.config.debug){var parsersDebug="";}if(table.tBodies.length==0)return;var rows=table.tBodies[0].rows;if(rows[0]){var list=[],cells=rows[0].cells,l=cells.length;for(var i=0;i<l;i++){var p=false;if($.metadata&&($($headers[i]).metadata()&&$($headers[i]).metadata().sorter)){p=getParserById($($headers[i]).metadata().sorter);}else if((table.config.headers[i]&&table.config.headers[i].sorter)){p=getParserById(table.config.headers[i].sorter);}if(!p){p=detectParserForColumn(table,rows,-1,i);}if(table.config.debug){parsersDebug+="column:"+i+" parser:"+p.id+"\n";}list.push(p);}}if(table.config.debug){log(parsersDebug);}return list;};function detectParserForColumn(table,rows,rowIndex,cellIndex){var l=parsers.length,node=false,nodeValue=false,keepLooking=true;while(nodeValue==''&&keepLooking){rowIndex++;if(rows[rowIndex]){node=getNodeFromRowAndCellIndex(rows,rowIndex,cellIndex);nodeValue=trimAndGetNodeText(table.config,node);if(table.config.debug){log('Checking if value was empty on row:'+rowIndex);}}else{keepLooking=false;}}for(var i=1;i<l;i++){if(parsers[i].is(nodeValue,table,node)){return parsers[i];}}return parsers[0];}function getNodeFromRowAndCellIndex(rows,rowIndex,cellIndex){return rows[rowIndex].cells[cellIndex];}function trimAndGetNodeText(config,node){return $.trim(getElementText(config,node));}function getParserById(name){var l=parsers.length;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==name.toLowerCase()){return parsers[i];}}return false;}function buildCache(table){if(table.config.debug){var cacheTime=new Date();}var totalRows=(table.tBodies[0]&&table.tBodies[0].rows.length)||0,totalCells=(table.tBodies[0].rows[0]&&table.tBodies[0].rows[0].cells.length)||0,parsers=table.config.parsers,cache={row:[],normalized:[]};for(var i=0;i<totalRows;++i){var c=$(table.tBodies[0].rows[i]),cols=[];if(c.hasClass(table.config.cssChildRow)){cache.row[cache.row.length-1]=cache.row[cache.row.length-1].add(c);continue;}cache.row.push(c);for(var j=0;j<totalCells;++j){cols.push(parsers[j].format(getElementText(table.config,c[0].cells[j]),table,c[0].cells[j]));}cols.push(cache.normalized.length);cache.normalized.push(cols);cols=null;};if(table.config.debug){benchmark("Building cache for "+totalRows+" rows:",cacheTime);}return cache;};function getElementText(config,node){var text="";if(!node)return"";if(!config.supportsTextContent)config.supportsTextContent=node.textContent||false;if(config.textExtraction=="simple"){if(config.supportsTextContent){text=node.textContent;}else{if(node.childNodes[0]&&node.childNodes[0].hasChildNodes()){text=node.childNodes[0].innerHTML;}else{text=node.innerHTML;}}}else{if(typeof(config.textExtraction)=="function"){text=config.textExtraction(node);}else{text=$(node).text();}}return text;}function appendToTable(table,cache){if(table.config.debug){var appendTime=new Date()}var c=cache,r=c.row,n=c.normalized,totalRows=n.length,checkCell=(n[0].length-1),tableBody=$(table.tBodies[0]),rows=[];for(var i=0;i<totalRows;i++){var pos=n[i][checkCell];rows.push(r[pos]);if(!table.config.appender){var l=r[pos].length;for(var j=0;j<l;j++){tableBody[0].appendChild(r[pos][j]);}}}if(table.config.appender){table.config.appender(table,rows);}rows=null;if(table.config.debug){benchmark("Rebuilt table:",appendTime);}applyWidget(table);setTimeout(function(){$(table).trigger("sortEnd");},0);};function buildHeaders(table){if(table.config.debug){var time=new Date();}var meta=($.metadata)?true:false;var header_index=computeTableHeaderCellIndexes(table);$tableHeaders=$(table.config.selectorHeaders,table).each(function(index){this.column=header_index[this.parentNode.rowIndex+"-"+this.cellIndex];this.order=formatSortingOrder(table.config.sortInitialOrder);this.count=this.order;if(checkHeaderMetadata(this)||checkHeaderOptions(table,index))this.sortDisabled=true;if(checkHeaderOptionsSortingLocked(table,index))this.order=this.lockedOrder=checkHeaderOptionsSortingLocked(table,index);if(!this.sortDisabled){var $th=$(this).addClass(table.config.cssHeader);if(table.config.onRenderHeader)table.config.onRenderHeader.apply($th);}table.config.headerList[index]=this;});if(table.config.debug){benchmark("Built headers:",time);log($tableHeaders);}return $tableHeaders;};function computeTableHeaderCellIndexes(t){var matrix=[];var lookup={};var thead=t.getElementsByTagName('THEAD')[0];var trs=thead.getElementsByTagName('TR');for(var i=0;i<trs.length;i++){var cells=trs[i].cells;for(var j=0;j<cells.length;j++){var c=cells[j];var rowIndex=c.parentNode.rowIndex;var cellId=rowIndex+"-"+c.cellIndex;var rowSpan=c.rowSpan||1;var colSpan=c.colSpan||1
var firstAvailCol;if(typeof(matrix[rowIndex])=="undefined"){matrix[rowIndex]=[];}for(var k=0;k<matrix[rowIndex].length+1;k++){if(typeof(matrix[rowIndex][k])=="undefined"){firstAvailCol=k;break;}}lookup[cellId]=firstAvailCol;for(var k=rowIndex;k<rowIndex+rowSpan;k++){if(typeof(matrix[k])=="undefined"){matrix[k]=[];}var matrixrow=matrix[k];for(var l=firstAvailCol;l<firstAvailCol+colSpan;l++){matrixrow[l]="x";}}}}return lookup;}function checkCellColSpan(table,rows,row){var arr=[],r=table.tHead.rows,c=r[row].cells;for(var i=0;i<c.length;i++){var cell=c[i];if(cell.colSpan>1){arr=arr.concat(checkCellColSpan(table,headerArr,row++));}else{if(table.tHead.length==1||(cell.rowSpan>1||!r[row+1])){arr.push(cell);}}}return arr;};function checkHeaderMetadata(cell){if(($.metadata)&&($(cell).metadata().sorter===false)){return true;};return false;}function checkHeaderOptions(table,i){if((table.config.headers[i])&&(table.config.headers[i].sorter===false)){return true;};return false;}function checkHeaderOptionsSortingLocked(table,i){if((table.config.headers[i])&&(table.config.headers[i].lockedOrder))return table.config.headers[i].lockedOrder;return false;}function applyWidget(table){var c=table.config.widgets;var l=c.length;for(var i=0;i<l;i++){getWidgetById(c[i]).format(table);}}function getWidgetById(name){var l=widgets.length;for(var i=0;i<l;i++){if(widgets[i].id.toLowerCase()==name.toLowerCase()){return widgets[i];}}};function formatSortingOrder(v){if(typeof(v)!="Number"){return(v.toLowerCase()=="desc")?1:0;}else{return(v==1)?1:0;}}function isValueInArray(v,a){var l=a.length;for(var i=0;i<l;i++){if(a[i][0]==v){return true;}}return false;}function setHeadersCss(table,$headers,list,css){$headers.removeClass(css[0]).removeClass(css[1]);var h=[];$headers.each(function(offset){if(!this.sortDisabled){h[this.column]=$(this);}});var l=list.length;for(var i=0;i<l;i++){h[list[i][0]].addClass(css[list[i][1]]);}}function fixColumnWidth(table,$headers){var c=table.config;if(c.widthFixed){var colgroup=$('<colgroup>');$("tr:first td",table.tBodies[0]).each(function(){colgroup.append($('<col>').css('width',$(this).width()));});$(table).prepend(colgroup);};}function updateHeaderSortCount(table,sortList){var c=table.config,l=sortList.length;for(var i=0;i<l;i++){var s=sortList[i],o=c.headerList[s[0]];o.count=s[1];o.count++;}}function multisort(table,sortList,cache){if(table.config.debug){var sortTime=new Date();}var dynamicExp="var sortWrapper = function(a,b) {",l=sortList.length;for(var i=0;i<l;i++){var c=sortList[i][0];var order=sortList[i][1];var s=(table.config.parsers[c].type=="text")?((order==0)?makeSortFunction("text","asc",c):makeSortFunction("text","desc",c)):((order==0)?makeSortFunction("numeric","asc",c):makeSortFunction("numeric","desc",c));var e="e"+i;dynamicExp+="var "+e+" = "+s;dynamicExp+="if("+e+") { return "+e+"; } ";dynamicExp+="else { ";}var orgOrderCol=cache.normalized[0].length-1;dynamicExp+="return a["+orgOrderCol+"]-b["+orgOrderCol+"];";for(var i=0;i<l;i++){dynamicExp+="}; ";}dynamicExp+="return 0; ";dynamicExp+="}; ";if(table.config.debug){benchmark("Evaling expression:"+dynamicExp,new Date());}eval(dynamicExp);cache.normalized.sort(sortWrapper);if(table.config.debug){benchmark("Sorting on "+sortList.toString()+" and dir "+order+" time:",sortTime);}return cache;};function makeSortFunction(type,direction,index){var a="a["+index+"]",b="b["+index+"]";if(type=='text'&&direction=='asc'){return"("+a+" == "+b+" ? 0 : ("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : ("+a+" < "+b+") ? -1 : 1 )));";}else if(type=='text'&&direction=='desc'){return"("+a+" == "+b+" ? 0 : ("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : ("+b+" < "+a+") ? -1 : 1 )));";}else if(type=='numeric'&&direction=='asc'){return"("+a+" === null && "+b+" === null) ? 0 :("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : "+a+" - "+b+"));";}else if(type=='numeric'&&direction=='desc'){return"("+a+" === null && "+b+" === null) ? 0 :("+a+" === null ? Number.POSITIVE_INFINITY : ("+b+" === null ? Number.NEGATIVE_INFINITY : "+b+" - "+a+"));";}};function makeSortText(i){return"((a["+i+"] < b["+i+"]) ? -1 : ((a["+i+"] > b["+i+"]) ? 1 : 0));";};function makeSortTextDesc(i){return"((b["+i+"] < a["+i+"]) ? -1 : ((b["+i+"] > a["+i+"]) ? 1 : 0));";};function makeSortNumeric(i){return"a["+i+"]-b["+i+"];";};function makeSortNumericDesc(i){return"b["+i+"]-a["+i+"];";};function sortText(a,b){if(table.config.sortLocaleCompare)return a.localeCompare(b);return((a<b)?-1:((a>b)?1:0));};function sortTextDesc(a,b){if(table.config.sortLocaleCompare)return b.localeCompare(a);return((b<a)?-1:((b>a)?1:0));};function sortNumeric(a,b){return a-b;};function sortNumericDesc(a,b){return b-a;};function getCachedSortType(parsers,i){return parsers[i].type;};this.construct=function(settings){return this.each(function(){if(!this.tHead||!this.tBodies)return;var $this,$document,$headers,cache,config,shiftDown=0,sortOrder;this.config={};config=$.extend(this.config,$.tablesorter.defaults,settings);$this=$(this);$.data(this,"tablesorter",config);$headers=buildHeaders(this);this.config.parsers=buildParserCache(this,$headers);cache=buildCache(this);var sortCSS=[config.cssDesc,config.cssAsc];fixColumnWidth(this);$headers.click(function(e){var totalRows=($this[0].tBodies[0]&&$this[0].tBodies[0].rows.length)||0;if(!this.sortDisabled&&totalRows>0){$this.trigger("sortStart");var $cell=$(this);var i=this.column;this.order=this.count++%2;if(this.lockedOrder)this.order=this.lockedOrder;if(!e[config.sortMultiSortKey]){config.sortList=[];if(config.sortForce!=null){var a=config.sortForce;for(var j=0;j<a.length;j++){if(a[j][0]!=i){config.sortList.push(a[j]);}}}config.sortList.push([i,this.order]);}else{if(isValueInArray(i,config.sortList)){for(var j=0;j<config.sortList.length;j++){var s=config.sortList[j],o=config.headerList[s[0]];if(s[0]==i){o.count=s[1];o.count++;s[1]=o.count%2;}}}else{config.sortList.push([i,this.order]);}};setTimeout(function(){setHeadersCss($this[0],$headers,config.sortList,sortCSS);appendToTable($this[0],multisort($this[0],config.sortList,cache));},1);return false;}}).mousedown(function(){if(config.cancelSelection){this.onselectstart=function(){return false};return false;}});$this.bind("update",function(){var me=this;setTimeout(function(){me.config.parsers=buildParserCache(me,$headers);cache=buildCache(me);},1);}).bind("updateCell",function(e,cell){var config=this.config;var pos=[(cell.parentNode.rowIndex-1),cell.cellIndex];cache.normalized[pos[0]][pos[1]]=config.parsers[pos[1]].format(getElementText(config,cell),cell);}).bind("sorton",function(e,list){$(this).trigger("sortStart");config.sortList=list;var sortList=config.sortList;updateHeaderSortCount(this,sortList);setHeadersCss(this,$headers,sortList,sortCSS);appendToTable(this,multisort(this,sortList,cache));}).bind("appendCache",function(){appendToTable(this,cache);}).bind("applyWidgetId",function(e,id){getWidgetById(id).format(this);}).bind("applyWidgets",function(){applyWidget(this);});if($.metadata&&($(this).metadata()&&$(this).metadata().sortlist)){config.sortList=$(this).metadata().sortlist;}if(config.sortList.length>0){$this.trigger("sorton",[config.sortList]);}applyWidget(this);});};this.addParser=function(parser){var l=parsers.length,a=true;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==parser.id.toLowerCase()){a=false;}}if(a){parsers.push(parser);};};this.addWidget=function(widget){widgets.push(widget);};this.formatFloat=function(s){var i=parseFloat(s);return(isNaN(i))?0:i;};this.formatInt=function(s){var i=parseInt(s);return(isNaN(i))?0:i;};this.isDigit=function(s,config){return/^[-+]?\d*$/.test($.trim(s.replace(/[,.']/g,'')));};this.clearTableBody=function(table){if($.browser.msie){function empty(){while(this.firstChild)this.removeChild(this.firstChild);}empty.apply(table.tBodies[0]);}else{table.tBodies[0].innerHTML="";}};}});$.fn.extend({tablesorter:$.tablesorter.construct});var ts=$.tablesorter;ts.addParser({id:"text",is:function(s){return true;},format:function(s){return $.trim(s.toLocaleLowerCase());},type:"text"});ts.addParser({id:"digit",is:function(s,table){var c=table.config;return $.tablesorter.isDigit(s,c);},format:function(s){return $.tablesorter.formatFloat(s);},type:"numeric"});ts.addParser({id:"currency",is:function(s){return/^[£$€?.]/.test(s);},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/[£$€]/g),""));},type:"numeric"});ts.addParser({id:"ipAddress",is:function(s){return/^\d{2,3}[\.]\d{2,3}[\.]\d{2,3}[\.]\d{2,3}$/.test(s);},format:function(s){var a=s.split("."),r="",l=a.length;for(var i=0;i<l;i++){var item=a[i];if(item.length==2){r+="0"+item;}else{r+=item;}}return $.tablesorter.formatFloat(r);},type:"numeric"});ts.addParser({id:"url",is:function(s){return/^(https?|ftp|file):\/\/$/.test(s);},format:function(s){return jQuery.trim(s.replace(new RegExp(/(https?|ftp|file):\/\//),''));},type:"text"});ts.addParser({id:"isoDate",is:function(s){return/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(s);},format:function(s){return $.tablesorter.formatFloat((s!="")?new Date(s.replace(new RegExp(/-/g),"/")).getTime():"0");},type:"numeric"});ts.addParser({id:"percent",is:function(s){return/\%$/.test($.trim(s));},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/%/g),""));},type:"numeric"});ts.addParser({id:"usLongDate",is:function(s){return s.match(new RegExp(/^[A-Za-z]{3,10}\.? [0-9]{1,2}, ([0-9]{4}|'?[0-9]{2}) (([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(AM|PM)))$/));},format:function(s){return $.tablesorter.formatFloat(new Date(s).getTime());},type:"numeric"});ts.addParser({id:"shortDate",is:function(s){return/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(s);},format:function(s,table){var c=table.config;s=s.replace(/\-/g,"/");if(c.dateFormat=="us"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$1/$2");}else if (c.dateFormat == "pt") {s = s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, "$3/$2/$1");} else if(c.dateFormat=="uk"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$2/$1");}else if(c.dateFormat=="dd/mm/yy"||c.dateFormat=="dd-mm-yy"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/,"$1/$2/$3");}return $.tablesorter.formatFloat(new Date(s).getTime());},type:"numeric"});ts.addParser({id:"time",is:function(s){return/^(([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(am|pm)))$/.test(s);},format:function(s){return $.tablesorter.formatFloat(new Date("2000/01/01 "+s).getTime());},type:"numeric"});ts.addParser({id:"metadata",is:function(s){return false;},format:function(s,table,cell){var c=table.config,p=(!c.parserMetadataName)?'sortValue':c.parserMetadataName;return $(cell).metadata()[p];},type:"numeric"});ts.addWidget({id:"zebra",format:function(table){if(table.config.debug){var time=new Date();}var $tr,row=-1,odd;$("tr:visible",table.tBodies[0]).each(function(i){$tr=$(this);if(!$tr.hasClass(table.config.cssChildRow))row++;odd=(row%2==0);$tr.removeClass(table.config.widgetZebra.css[odd?0:1]).addClass(table.config.widgetZebra.css[odd?1:0])});if(table.config.debug){$.tablesorter.benchmark("Applying Zebra widget",time);}}});})(jQuery);


/*! jQuery Migrate v1.2.1 | (c) 2005, 2013 jQuery Foundation, Inc. and other contributors | jquery.org/license */
jQuery.migrateMute===void 0&&(jQuery.migrateMute=!0),function(e,t,n){function r(n){var r=t.console;i[n]||(i[n]=!0,e.migrateWarnings.push(n),r&&r.warn&&!e.migrateMute&&(r.warn("JQMIGRATE: "+n),e.migrateTrace&&r.trace&&r.trace()))}function a(t,a,i,o){if(Object.defineProperty)try{return Object.defineProperty(t,a,{configurable:!0,enumerable:!0,get:function(){return r(o),i},set:function(e){r(o),i=e}}),n}catch(s){}e._definePropertyBroken=!0,t[a]=i}var i={};e.migrateWarnings=[],!e.migrateMute&&t.console&&t.console.log&&t.console.log("JQMIGRATE: Logging is active"),e.migrateTrace===n&&(e.migrateTrace=!0),e.migrateReset=function(){i={},e.migrateWarnings.length=0},"BackCompat"===document.compatMode&&r("jQuery is not compatible with Quirks Mode");var o=e("<input/>",{size:1}).attr("size")&&e.attrFn,s=e.attr,u=e.attrHooks.value&&e.attrHooks.value.get||function(){return null},c=e.attrHooks.value&&e.attrHooks.value.set||function(){return n},l=/^(?:input|button)$/i,d=/^[238]$/,p=/^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,f=/^(?:checked|selected)$/i;a(e,"attrFn",o||{},"jQuery.attrFn is deprecated"),e.attr=function(t,a,i,u){var c=a.toLowerCase(),g=t&&t.nodeType;return u&&(4>s.length&&r("jQuery.fn.attr( props, pass ) is deprecated"),t&&!d.test(g)&&(o?a in o:e.isFunction(e.fn[a])))?e(t)[a](i):("type"===a&&i!==n&&l.test(t.nodeName)&&t.parentNode&&r("Can't change the 'type' of an input or button in IE 6/7/8"),!e.attrHooks[c]&&p.test(c)&&(e.attrHooks[c]={get:function(t,r){var a,i=e.prop(t,r);return i===!0||"boolean"!=typeof i&&(a=t.getAttributeNode(r))&&a.nodeValue!==!1?r.toLowerCase():n},set:function(t,n,r){var a;return n===!1?e.removeAttr(t,r):(a=e.propFix[r]||r,a in t&&(t[a]=!0),t.setAttribute(r,r.toLowerCase())),r}},f.test(c)&&r("jQuery.fn.attr('"+c+"') may use property instead of attribute")),s.call(e,t,a,i))},e.attrHooks.value={get:function(e,t){var n=(e.nodeName||"").toLowerCase();return"button"===n?u.apply(this,arguments):("input"!==n&&"option"!==n&&r("jQuery.fn.attr('value') no longer gets properties"),t in e?e.value:null)},set:function(e,t){var a=(e.nodeName||"").toLowerCase();return"button"===a?c.apply(this,arguments):("input"!==a&&"option"!==a&&r("jQuery.fn.attr('value', val) no longer sets properties"),e.value=t,n)}};var g,h,v=e.fn.init,m=e.parseJSON,y=/^([^<]*)(<[\w\W]+>)([^>]*)$/;e.fn.init=function(t,n,a){var i;return t&&"string"==typeof t&&!e.isPlainObject(n)&&(i=y.exec(e.trim(t)))&&i[0]&&("<"!==t.charAt(0)&&r("$(html) HTML strings must start with '<' character"),i[3]&&r("$(html) HTML text after last tag is ignored"),"#"===i[0].charAt(0)&&(r("HTML string cannot start with a '#' character"),e.error("JQMIGRATE: Invalid selector string (XSS)")),n&&n.context&&(n=n.context),e.parseHTML)?v.call(this,e.parseHTML(i[2],n,!0),n,a):v.apply(this,arguments)},e.fn.init.prototype=e.fn,e.parseJSON=function(e){return e||null===e?m.apply(this,arguments):(r("jQuery.parseJSON requires a valid JSON string"),null)},e.uaMatch=function(e){e=e.toLowerCase();var t=/(chrome)[ \/]([\w.]+)/.exec(e)||/(webkit)[ \/]([\w.]+)/.exec(e)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e)||/(msie) ([\w.]+)/.exec(e)||0>e.indexOf("compatible")&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e)||[];return{browser:t[1]||"",version:t[2]||"0"}},e.browser||(g=e.uaMatch(navigator.userAgent),h={},g.browser&&(h[g.browser]=!0,h.version=g.version),h.chrome?h.webkit=!0:h.webkit&&(h.safari=!0),e.browser=h),a(e,"browser",e.browser,"jQuery.browser is deprecated"),e.sub=function(){function t(e,n){return new t.fn.init(e,n)}e.extend(!0,t,this),t.superclass=this,t.fn=t.prototype=this(),t.fn.constructor=t,t.sub=this.sub,t.fn.init=function(r,a){return a&&a instanceof e&&!(a instanceof t)&&(a=t(a)),e.fn.init.call(this,r,a,n)},t.fn.init.prototype=t.fn;var n=t(document);return r("jQuery.sub() is deprecated"),t},e.ajaxSetup({converters:{"text json":e.parseJSON}});var b=e.fn.data;e.fn.data=function(t){var a,i,o=this[0];return!o||"events"!==t||1!==arguments.length||(a=e.data(o,t),i=e._data(o,t),a!==n&&a!==i||i===n)?b.apply(this,arguments):(r("Use of jQuery.fn.data('events') is deprecated"),i)};var j=/\/(java|ecma)script/i,w=e.fn.andSelf||e.fn.addBack;e.fn.andSelf=function(){return r("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()"),w.apply(this,arguments)},e.clean||(e.clean=function(t,a,i,o){a=a||document,a=!a.nodeType&&a[0]||a,a=a.ownerDocument||a,r("jQuery.clean() is deprecated");var s,u,c,l,d=[];if(e.merge(d,e.buildFragment(t,a).childNodes),i)for(c=function(e){return!e.type||j.test(e.type)?o?o.push(e.parentNode?e.parentNode.removeChild(e):e):i.appendChild(e):n},s=0;null!=(u=d[s]);s++)e.nodeName(u,"script")&&c(u)||(i.appendChild(u),u.getElementsByTagName!==n&&(l=e.grep(e.merge([],u.getElementsByTagName("script")),c),d.splice.apply(d,[s+1,0].concat(l)),s+=l.length));return d});var Q=e.event.add,x=e.event.remove,k=e.event.trigger,N=e.fn.toggle,T=e.fn.live,M=e.fn.die,S="ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",C=RegExp("\\b(?:"+S+")\\b"),H=/(?:^|\s)hover(\.\S+|)\b/,A=function(t){return"string"!=typeof t||e.event.special.hover?t:(H.test(t)&&r("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'"),t&&t.replace(H,"mouseenter$1 mouseleave$1"))};e.event.props&&"attrChange"!==e.event.props[0]&&e.event.props.unshift("attrChange","attrName","relatedNode","srcElement"),e.event.dispatch&&a(e.event,"handle",e.event.dispatch,"jQuery.event.handle is undocumented and deprecated"),e.event.add=function(e,t,n,a,i){e!==document&&C.test(t)&&r("AJAX events should be attached to document: "+t),Q.call(this,e,A(t||""),n,a,i)},e.event.remove=function(e,t,n,r,a){x.call(this,e,A(t)||"",n,r,a)},e.fn.error=function(){var e=Array.prototype.slice.call(arguments,0);return r("jQuery.fn.error() is deprecated"),e.splice(0,0,"error"),arguments.length?this.bind.apply(this,e):(this.triggerHandler.apply(this,e),this)},e.fn.toggle=function(t,n){if(!e.isFunction(t)||!e.isFunction(n))return N.apply(this,arguments);r("jQuery.fn.toggle(handler, handler...) is deprecated");var a=arguments,i=t.guid||e.guid++,o=0,s=function(n){var r=(e._data(this,"lastToggle"+t.guid)||0)%o;return e._data(this,"lastToggle"+t.guid,r+1),n.preventDefault(),a[r].apply(this,arguments)||!1};for(s.guid=i;a.length>o;)a[o++].guid=i;return this.click(s)},e.fn.live=function(t,n,a){return r("jQuery.fn.live() is deprecated"),T?T.apply(this,arguments):(e(this.context).on(t,this.selector,n,a),this)},e.fn.die=function(t,n){return r("jQuery.fn.die() is deprecated"),M?M.apply(this,arguments):(e(this.context).off(t,this.selector||"**",n),this)},e.event.trigger=function(e,t,n,a){return n||C.test(e)||r("Global events are undocumented and deprecated"),k.call(this,e,t,n||document,a)},e.each(S.split("|"),function(t,n){e.event.special[n]={setup:function(){var t=this;return t!==document&&(e.event.add(document,n+"."+e.guid,function(){e.event.trigger(n,null,t,!0)}),e._data(this,n,e.guid++)),!1},teardown:function(){return this!==document&&e.event.remove(document,n+"."+e._data(this,n)),!1}}})}(jQuery,window);
var stacks = {};
stacks.jQuery = jQuery.noConflict(true);
stacks.com_bigwhiteduck_stacks_magicgellan_s3 = {};
stacks.com_bigwhiteduck_stacks_magicgellan_s3 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery; if('addEventListener'in document){document.addEventListener('DOMContentLoaded',function(){FastClick.attach(document.body);},false);}

return stack;})(stacks.com_bigwhiteduck_stacks_magicgellan_s3);
stacks.com_elixir_stacks_foundryTableCSV = {};
stacks.com_elixir_stacks_foundryTableCSV = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;/**
 * CSV to Table plugin
 * http://code.google.com/p/jquerycsvtotable/
 *
 * Copyright (c) 2010 Steve Sobel
 * http://honestbleeps.com/
 *
 * v0.9 - 2010-06-22 - First release.
 *
 * Example implementation:
 * $('#divID').CSVToTable('test.csv');
 *
 * The above line would load 'test.csv' via AJAX and render a table.  If
 * headers are not specified, the plugin assumes the first line of the CSV
 * file contains the header names.
 *
 * Configurable options:
 * separator    - separator to use when parsing CSV/TSV data
 *              - value will almost always be "," or "\t" (comma or tab)
 *              - if not specified, default value is ","
 * headers      - an array of headers for the CSV data
 *              - if not specified, plugin assumes that the first line of the CSV
 *                file contains the header names.
 *              - Example: headers: ['Album Title', 'Artist Name', 'Price ($USD)']
 * tableClass   - class name to apply to the <table> tag rendered by the plugin.
 * theadClass   - class name to apply to the <thead> tag rendered by the plugin.
 * thClass      - class name to apply to the <th> tag rendered by the plugin.
 * tbodyClass   - class name to apply to the <tbody> tag rendered by the plugin.
 * trClass      - class name to apply to the <tr> tag rendered by the plugin.
 * tdClass      - class name to apply to the <td> tag rendered by the plugin.
 * loadingImage - path to an image to display while CSV/TSV data is loading
 * loadingText  - text to display while CSV/TSV is loading
 *              - if not specified, default value is "Loading CSV data..."
 *
 *
 * Upon completion, the plugin triggers a "loadComplete" event so that you
 * may perform other manipulation on the table after it has loaded. A
 * common use of this would be to use the jQuery tablesorter plugin, found
 * at http://tablesorter.com/
 *
 * An example of such a call would be as follows, assuming you have loaded
 * the tablesorter plugin.
 *
 * $('#CSVTable').CSVToTable('test.csv',
 *     {
 *        loadingImage: 'images/loading.gif',
 *        startLine: 1,
 *        headers: ['Album Title', 'Artist Name', 'Price ($USD)']
 *     }
 * ).bind("loadComplete",function() {
 *     $('#CSVTable').find('TABLE').tablesorter();
 * });;

 *
 */


 (function($){

	/**
	*
	* CSV Parser credit goes to Brian Huisman, from his blog entry entitled "CSV String to Array in JavaScript":
	* http://www.greywyvern.com/?post=258
	*
	*/
  String.prototype.splitCSV = function(sep) {
    for (var thisCSV = this.split(sep = sep || ","), x = thisCSV.length - 1, tl; x >= 0; x--) {
      if (thisCSV[x].replace(/"\s+$/, '"').slice(-1) == '"') {
        if ((tl = thisCSV[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
          thisCSV[x] = thisCSV[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
        } else if (x) {
          thisCSV.splice(x - 1, 2, [thisCSV[x - 1], thisCSV[x]].join(sep));
        } else thisCSV = thisCSV.shift().split(sep).concat(thisCSV);
      } else thisCSV[x].replace(/""/g, '"');
    } return thisCSV;
  };

	$.fn.CSVToTable = function(csvFile, options) {
		var defaults = {
			tableClass: "CSVTable",
			theadClass: "",
			thClass: "",
			tbodyClass: "",
			trClass: "",
			tdClass: "",
			loadingImage: "",
			loadingText: "Loading CSV data...",
			separator: ",",
			startLine: 0
		};
		var options = $.extend(defaults, options);
		return this.each(function() {
			var obj = $(this);
			var error = '';
			(options.loadingImage) ? loading = '<div style="text-align: center"><img alt="' + options.loadingText + '" src="' + options.loadingImage + '" /><br>' + options.loadingText + '</div>' : loading = options.loadingText;
			obj.html(loading);
			$.get(csvFile, function(data) {
				var tableHTML = '<table class="' + options.tableClass + '">';
				var lines = data.replace('\r','').split('\n');
				var printedLines = 0;
				var headerCount = 0;
				var headers = new Array();
				$.each(lines, function(lineCount, line) {
					if ((lineCount == 0) && (typeof(options.headers) != 'undefined')) {
						headers = options.headers;
						headerCount = headers.length;
						tableHTML += '<thead class="' + options.theadClass + '"><tr class="' + options.trClass + '">';
						$.each(headers, function(headerCount, header) {
							tableHTML += '<th class="' + options.thClass + '">' + header + '</th>';
						});
						tableHTML += '</tr></thead><tbody class="' + options.tbodyClass + '">';
					}
					if ((lineCount == options.startLine) && (typeof(options.headers) == 'undefined')) {
						headers = line.splitCSV(options.separator);
						headerCount = headers.length;
						tableHTML += '<thead class="' + options.theadClass + '"><tr class="' + options.trClass + '">';
						$.each(headers, function(headerCount, header) {
							tableHTML += '<th class="' + options.thClass + '">' + header + '</th>';
						});
						tableHTML += '</tr></thead><tbody class="' + options.tbodyClass + '">';
					} else if (lineCount >= options.startLine) {
						var items = line.splitCSV(options.separator);
						if (items.length > 1) {
							printedLines++;
							if (items.length != headerCount) {
								error += 'error on line ' + lineCount + ': Item count (' + items.length + ') does not match header count (' + headerCount + ') \n';
							}
							(printedLines % 2) ? oddOrEven = 'odd' : oddOrEven = 'even';
							tableHTML += '<tr class="' + options.trClass + ' ' + oddOrEven + '">';
							$.each(items, function(itemCount, item) {
								tableHTML += '<td class="' + options.tdClass + '">' + item + '</td>';
							});
							tableHTML += '</tr>';
						}
					}
				});
				tableHTML += '</tbody></table>';
				if (error) {
					obj.html(error);
				} else {
					obj.fadeOut(500, function() {
						obj.html(tableHTML)
					}).fadeIn(function() {
						// trigger loadComplete
						setTimeout(function() {
							obj.trigger("loadComplete");
						},0);
					});
				}
			});
		});
	};

})(jQuery);

return stack;})(stacks.com_elixir_stacks_foundryTableCSV);
stacks.stacks_in_74345_page2 = {};
stacks.stacks_in_74345_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	
		$('#stacks_in_74345_page2 > .container').parentsUntil('.stacks_top').css('overflow', 'visible');
		$('.stacks_top').css({'overflow' : 'visible'});
	
});

return stack;})(stacks.stacks_in_74345_page2);
stacks.stacks_in_74347_page2 = {};
stacks.stacks_in_74347_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	$('body').on('click','#stacks_in_74347_page2 .content_switcher_setter_1',function(e){
		stacks.ContentSwitcher.cont_switch("IQPartners_logo", "1",false, 500);
		
	});
	if(true){
        $('body').on('mouseenter','#stacks_in_74347_page2 .content_switcher_setter_1',function(e){
			stacks.ContentSwitcher.cont_switch("IQPartners_logo", "1",false, 500);
		});
		if(true){
			$('body').on('mouseleave','#stacks_in_74347_page2 .content_switcher_setter_1',function(e){
				stacks.ContentSwitcher.cont_switch("IQPartners_logo", "0",false, 500);
			});
		}
    }
});


return stack;})(stacks.stacks_in_74347_page2);
stacks.stacks_in_74349_page2 = {};
stacks.stacks_in_74349_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	

var ContentSwitcher_stacks_in_74349_page2 = (function(){

// LOCAL GLOBAL OBJECT
var ContentSwitcher = {};

// GLOBAL FUNCTIONS
ContentSwitcher.globals = (function(){
	//if (typeof stacks.ContentSwitcher == 'undefined') {
		stacks.ContentSwitcher = {};

		stacks.ContentSwitcher.cont_switch = function(target,i,fade, fadeDuration){
			var show_blocks = i.split('_');
			if(fade){
				$('.'+target+' > .content_switcher').hide();
				for ( var b = 0; b < show_blocks.length; b++){
					$('.'+target+' > .content_switcher_'+show_blocks[b]).stop(true, false).fadeIn({duration:fadeDuration});
				}
		
			}
			else{
				$('.'+target+' > .content_switcher').hide();
				for ( var b = 0; b < show_blocks.length; b++){
					$('.'+target+' > .content_switcher_'+show_blocks[b]).show();
				}
			}
			var cs = $('.'+target+' > .content_switcher_'+i+' .content_scroller').data('jsp');
			if(cs){
				cs.reinitialise();
			}
			if( $('#stacks_in_74349_page2').find('.masonry').length > 0 && typeof(stacks.Bricks.reload) == 'function' ){
				stacks.Bricks.reload();
			}
		};
	//}
})();

// LOCAL GLOBAL VARIABLES
var thisID = 'stacks_in_74349_page2';

// FUNCTIONS CALLS


})();

if(!false){
	$('#stacks_in_74349_page2 .content_switcher_0').show();	
}

var hash = window.location.hash;
if (hash.length > 0){
	var hashArray = hash.substr(1).split('&');
	for( elem in hashArray ){
		var kvStr = hashArray[elem];
		if(kvStr != undefined){
			var kv = kvStr.split('-');
			if ( kv[0] == 'cs'){
				stacks.ContentSwitcher.cont_switch(kv[1]+"", kv[2]+"",false);
			}
		}
		
	}
}
	
})
return stack;})(stacks.stacks_in_74349_page2);
stacks.stacks_in_74530_page2 = {};
stacks.stacks_in_74530_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;




return stack;})(stacks.stacks_in_74530_page2);
stacks.stacks_in_74534_page2 = {};
stacks.stacks_in_74534_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	$('body').on('click','#stacks_in_74534_page2 .content_switcher_setter_1',function(e){
		stacks.ContentSwitcher.cont_switch("IQPartners_logo", "1",false, 500);
		
	});
	if(true){
        $('body').on('mouseenter','#stacks_in_74534_page2 .content_switcher_setter_1',function(e){
			stacks.ContentSwitcher.cont_switch("IQPartners_logo", "1",false, 500);
		});
		if(true){
			$('body').on('mouseleave','#stacks_in_74534_page2 .content_switcher_setter_1',function(e){
				stacks.ContentSwitcher.cont_switch("IQPartners_logo", "0",false, 500);
			});
		}
    }
});


return stack;})(stacks.stacks_in_74534_page2);
stacks.stacks_in_74536_page2 = {};
stacks.stacks_in_74536_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	

var ContentSwitcher_stacks_in_74536_page2 = (function(){

// LOCAL GLOBAL OBJECT
var ContentSwitcher = {};

// GLOBAL FUNCTIONS
ContentSwitcher.globals = (function(){
	//if (typeof stacks.ContentSwitcher == 'undefined') {
		stacks.ContentSwitcher = {};

		stacks.ContentSwitcher.cont_switch = function(target,i,fade, fadeDuration){
			var show_blocks = i.split('_');
			if(fade){
				$('.'+target+' > .content_switcher').hide();
				for ( var b = 0; b < show_blocks.length; b++){
					$('.'+target+' > .content_switcher_'+show_blocks[b]).stop(true, false).fadeIn({duration:fadeDuration});
				}
		
			}
			else{
				$('.'+target+' > .content_switcher').hide();
				for ( var b = 0; b < show_blocks.length; b++){
					$('.'+target+' > .content_switcher_'+show_blocks[b]).show();
				}
			}
			var cs = $('.'+target+' > .content_switcher_'+i+' .content_scroller').data('jsp');
			if(cs){
				cs.reinitialise();
			}
			if( $('#stacks_in_74536_page2').find('.masonry').length > 0 && typeof(stacks.Bricks.reload) == 'function' ){
				stacks.Bricks.reload();
			}
		};
	//}
})();

// LOCAL GLOBAL VARIABLES
var thisID = 'stacks_in_74536_page2';

// FUNCTIONS CALLS


})();

if(!false){
	$('#stacks_in_74536_page2 .content_switcher_0').show();	
}

var hash = window.location.hash;
if (hash.length > 0){
	var hashArray = hash.substr(1).split('&');
	for( elem in hashArray ){
		var kvStr = hashArray[elem];
		if(kvStr != undefined){
			var kv = kvStr.split('-');
			if ( kv[0] == 'cs'){
				stacks.ContentSwitcher.cont_switch(kv[1]+"", kv[2]+"",false);
			}
		}
		
	}
}
	
})
return stack;})(stacks.stacks_in_74536_page2);
stacks.stacks_in_74611_page2 = {};
stacks.stacks_in_74611_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_74611_page2);
stacks.stacks_in_74615_page2 = {};
stacks.stacks_in_74615_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_74615_page2);
stacks.stacks_in_74619_page2 = {};
stacks.stacks_in_74619_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_74619_page2);
stacks.stacks_in_71752_page2 = {};
stacks.stacks_in_71752_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;
var autoscroll=false,automarker='';if(window.location.hash){automarker=location.hash.replace('#','');window.location.hash="";autoscroll=true;}$(document).ready(function(){var includeInMenu=function(selector){switch(selector){case'all':useMarkers=true;useZones=true;break;case'markers':useMarkers=true;useZones=false;break;case'zones':useMarkers=false;useZones=true;break;}}
function firstMarkerOffset(){return firstMarker.offset().top;}
function generateMenu(){var i=0;$('[data-magellan-destination]').each(function(){var
that=$(this),isZone=false,destination=that.data('magellan-destination'),magicName=that.data('magic-name'),magicHide=typeof that.data('magic-hide')==='undefined'?' ':that.data('magic-hide'),magicIcon=that.data('magic-icon'),iconSet=that.data('magic-icon-set'),magicZType=that.data('magic-zone-type'),magicClass=that.data('magic-class'),magicZLink=that.data('magic-zone-link'),magicLinkTarget=that.data('magic-link-target'),magicZOrigin=that.data('magic-zone-origin'),magicZFont=that.data('magic-font'),magicPopDrop=that.data('magic-popdrop'),magicLL=that.data('magic-ll'),magicRevealID=that.data('magic-reveal-id'),magicDropdown=that.data('magic-dropdown'),tipPopDrop=that.data('pop-drop-tip'),magicDDOptions=that.data('magic-options'),doNotMenu=that.data('magic-inmenu'),zonelink='<li class="mag-item zone-item mag-zone-'+magicZOrigin+' '+magicZFont+'">',item='<li class="mag-item mag-scroll '+magicHide+' '+magicZFont+'" data-pop-drop="'+tipPopDrop+'">';if(typeof magicZOrigin!="undefined"){destination=magicZOrigin;isZone=true;if(magicName==""&&magicIcon.length!=0){magicName=' ';}}
if(typeof magicName==="undefined"){magicName=destination;}
if(typeof magicIcon==="undefined"){magicIcon='';}
if(magicName.length==0&&magicIcon.length==0){magicName=destination;}
if(magicIcon.length>0){magicName='<i class="magic-icon '+iconSet+' '+magicIcon+' mgicon-'+destination+'"></i>'+magicName;}
if(doNotMenu==='not-in-menu')return true;if(isZone&&useZones){if(magicZType==='link'){$(magicNav).append($(zonelink).attr('data-magic-zone-link',magicZType).attr('data-pop-drop',tipPopDrop).append($('<a class ="mag-link mag-zone '+magicClass+'">').attr({'href':magicZLink,'target':magicLinkTarget}).append($('<span class="dot-tip ">').append(magicName))));}else if(magicZType==='reveal'){$(magicNav).append($(zonelink).attr('data-magic-zone-link',magicZType).append($('<a class ="mag-link mag-zone '+magicClass+'">').attr('data-reveal-id',magicRevealID).append($('<span class="dot-tip ">').append(magicName))));}else if(magicZType==='dropdown'){$(magicNav).append($(zonelink).attr('data-magic-zone-link',magicZType).append($('<a class ="mag-link mag-zone '+magicClass+'">').attr({'data-dropdown':magicDropdown,'data-options':magicDDOptions,'aria-expanded':false}).append($('<span class="dot-tip ">').append(magicName))));var dropdownID='#'+magicDropdown;dme.append($(dropdownID).parent());}else if(magicZType==='popdrop'){$(magicNav).append($(zonelink).attr('data-magic-zone-link',magicZType).append($('<a class ="mag-link mag-zone '+magicClass+'">').attr({'data-pop-drop':magicPopDrop}).append($('<span class="dot-tip ">').append(magicName))));}else if(magicZType==='limelight'){$(magicNav).append($(zonelink).attr('data-magic-zone-link',magicZType).append($('<a class ="mag-link mag-zone '+magicLL+' '+magicClass+'">').append($('<span class="dot-tip ">').append(magicName))));}}
else{if(useMarkers&&!isZone){$(magicNav).append($(item).attr('data-magellan-arrival',destination).append($('<a class ="mag-link">').attr('href',('#'+destination)).append($('<span class="dot-tip ">').append(magicName))));}}
i++;});return(i);}
function checkLanding(){if($(window).scrollTop()<landingRefPt){$('#stacks_in_71752_page2 [data-magellan-expedition]').addClass('mag-landing');}else{$('#stacks_in_71752_page2 [data-magellan-expedition]').removeClass('mag-landing');}}
function hasScrolled(){if($('#stacks_in_71752_page2 .magic-nav>.mag-item.active').length>0){if($('#stacks_in_71752_page2 .magic-nav>.mag-item.active').hasClass('hide-when-active')){$('#stacks_in_71752_page2 [data-magellan-expedition]').addClass('mag-hidden');}else{$('#stacks_in_71752_page2 [data-magellan-expedition]').removeClass('mag-hidden');}}}var mobileToggle=function(action){switch(action){case'toggle':if(dme.hasClass('toggle-open')){dme.removeClass('toggle-open');menuItems.slideUp(toggleSpeed,function(){});}else{dme.addClass('toggle-open');menuItems.slideDown(toggleSpeed,function(){});}
break;case'desktop':menuItems.css('display','');dme.removeClass('toggle-open');break;}}
var isToggleActive=function(){var win=$(window).width();if(win<mobBreakpoint){return true;}else{return false;}}
var toggleRespond=function(){if(isToggleActive()){dme.addClass('mag-toggle');if(dropdowns)dropdowns.removeClass('open');}else{dme.removeClass('mag-toggle');mobileToggle('desktop');}}
var stack=$('#stacks_in_71752_page2'),dme=$('[data-magellan-expedition]',stack),toggleTarget=$('.toggle-target',stack),toggleSpeed=200,burgerWrap=$('.burgWrapper',stack),burger=$('.burg',burgerWrap),menuItems=$('.side-nav.magic-nav',stack),mobBreakpoint=320,orientation='mag-horizontal',itemInclude='all',useMarkers,useZones,magicNav=$('.magic-nav',stack),magicDot=$('.magic-dots',stack),landingAction='preMarker',firstMarker=$('body').find('[data-magellan-destination]').eq(0),firstMarker=firstMarker.length?firstMarker:$('body'),landingRefPt,didScroll=false,padBody=false,dropdowns,i=0;if($('#foundation-loader').length){$('#foundation-loader').after('<div class="f-magicgellan-fixed"></div');}else{$('body').prepend('<div class="f-magicgellan-fixed"></div');}
$('li',stack).each(function(){var id=$(this).data('magellan-arrival')
$('a',this).attr('href','#'+id);});includeInMenu(itemInclude);var numMarkers=generateMenu();$('#stacks_in_71752_page2 .magic-nav').find('.mag-scroll').eq(0).addClass('active');$('#stacks_in_71752_page2 .magic-dots').find('.mag-scroll').eq(0).addClass('active');hasScrolled();toggleTarget.on('click',function(e){mobileToggle('toggle');});$('.mag-item:not(.zone-item)',menuItems).on('click',function(){if(isToggleActive()){mobileToggle('toggle');}});var resizeTimer;$(window).on('resize',function(e){clearTimeout(resizeTimer);resizeTimer=setTimeout(function(){toggleRespond();},20);});$(window).scroll(function(event){didScroll=true});setInterval(function(){if(didScroll){hasScrolled();didScroll=false;}},100);$(window).load(function(){setTimeout(function(){try{foundation&&foundation.jQuery
var f=foundation.jQuery;f(document).foundation('dropdown','reflow');f(document).foundation('magellan','reflow');dropdowns=stack.find('.f-dropdown');}
catch(e){console.log('Foundation not found');}
$('#stacks_in_71752_page2 [data-magellan-expedition]').removeClass('mag-preload');},100);if(autoscroll){$('.mag-item[data-magellan-arrival="'+automarker+'"]>a').trigger('click');}});});
;(function(){'use strict';function FastClick(layer,options){var oldOnClick;options=options||{};this.trackingClick=false;this.trackingClickStart=0;this.targetElement=null;this.touchStartX=0;this.touchStartY=0;this.lastTouchIdentifier=0;this.touchBoundary=options.touchBoundary||10;this.layer=layer;this.tapDelay=options.tapDelay||200;this.tapTimeout=options.tapTimeout||700;if(FastClick.notNeeded(layer)){return;}
function bind(method,context){return function(){return method.apply(context,arguments);};}
var methods=['onMouse','onClick','onTouchStart','onTouchMove','onTouchEnd','onTouchCancel'];var context=this;for(var i=0,l=methods.length;i<l;i++){context[methods[i]]=bind(context[methods[i]],context);}
if(deviceIsAndroid){layer.addEventListener('mouseover',this.onMouse,true);layer.addEventListener('mousedown',this.onMouse,true);layer.addEventListener('mouseup',this.onMouse,true);}
layer.addEventListener('click',this.onClick,true);layer.addEventListener('touchstart',this.onTouchStart,false);layer.addEventListener('touchmove',this.onTouchMove,false);layer.addEventListener('touchend',this.onTouchEnd,false);layer.addEventListener('touchcancel',this.onTouchCancel,false);if(!Event.prototype.stopImmediatePropagation){layer.removeEventListener=function(type,callback,capture){var rmv=Node.prototype.removeEventListener;if(type==='click'){rmv.call(layer,type,callback.hijacked||callback,capture);}else{rmv.call(layer,type,callback,capture);}};layer.addEventListener=function(type,callback,capture){var adv=Node.prototype.addEventListener;if(type==='click'){adv.call(layer,type,callback.hijacked||(callback.hijacked=function(event){if(!event.propagationStopped){callback(event);}}),capture);}else{adv.call(layer,type,callback,capture);}};}
if(typeof layer.onclick==='function'){oldOnClick=layer.onclick;layer.addEventListener('click',function(event){oldOnClick(event);},false);layer.onclick=null;}}
var deviceIsWindowsPhone=navigator.userAgent.indexOf("Windows Phone")>=0;var deviceIsAndroid=navigator.userAgent.indexOf('Android')>0&&!deviceIsWindowsPhone;var deviceIsIOS=/iP(ad|hone|od)/.test(navigator.userAgent)&&!deviceIsWindowsPhone;var deviceIsIOS4=deviceIsIOS&&(/OS 4_\d(_\d)?/).test(navigator.userAgent);var deviceIsIOSWithBadTarget=deviceIsIOS&&(/OS [6-7]_\d/).test(navigator.userAgent);var deviceIsBlackBerry10=navigator.userAgent.indexOf('BB10')>0;FastClick.prototype.needsClick=function(target){switch(target.nodeName.toLowerCase()){case'button':case'select':case'textarea':if(target.disabled){return true;}
break;case'input':if((deviceIsIOS&&target.type==='file')||target.disabled){return true;}
break;case'label':case'iframe':case'video':return true;}
return(/\bneedsclick\b/).test(target.className);};FastClick.prototype.needsFocus=function(target){switch(target.nodeName.toLowerCase()){case'textarea':return true;case'select':return!deviceIsAndroid;case'input':switch(target.type){case'button':case'checkbox':case'file':case'image':case'radio':case'submit':return false;}
return!target.disabled&&!target.readOnly;default:return(/\bneedsfocus\b/).test(target.className);}};FastClick.prototype.sendClick=function(targetElement,event){var clickEvent,touch;if(document.activeElement&&document.activeElement!==targetElement){document.activeElement.blur();}
touch=event.changedTouches[0];clickEvent=document.createEvent('MouseEvents');clickEvent.initMouseEvent(this.determineEventType(targetElement),true,true,window,1,touch.screenX,touch.screenY,touch.clientX,touch.clientY,false,false,false,false,0,null);clickEvent.forwardedTouchEvent=true;targetElement.dispatchEvent(clickEvent);};FastClick.prototype.determineEventType=function(targetElement){if(deviceIsAndroid&&targetElement.tagName.toLowerCase()==='select'){return'mousedown';}
return'click';};FastClick.prototype.focus=function(targetElement){var length;if(deviceIsIOS&&targetElement.setSelectionRange&&targetElement.type.indexOf('date')!==0&&targetElement.type!=='time'&&targetElement.type!=='month'){length=targetElement.value.length;targetElement.setSelectionRange(length,length);}else{targetElement.focus();}};FastClick.prototype.updateScrollParent=function(targetElement){var scrollParent,parentElement;scrollParent=targetElement.fastClickScrollParent;if(!scrollParent||!scrollParent.contains(targetElement)){parentElement=targetElement;do{if(parentElement.scrollHeight>parentElement.offsetHeight){scrollParent=parentElement;targetElement.fastClickScrollParent=parentElement;break;}
parentElement=parentElement.parentElement;}while(parentElement);}
if(scrollParent){scrollParent.fastClickLastScrollTop=scrollParent.scrollTop;}};FastClick.prototype.getTargetElementFromEventTarget=function(eventTarget){if(eventTarget.nodeType===Node.TEXT_NODE){return eventTarget.parentNode;}
return eventTarget;};FastClick.prototype.onTouchStart=function(event){var targetElement,touch,selection;if(event.targetTouches.length>1){return true;}
targetElement=this.getTargetElementFromEventTarget(event.target);touch=event.targetTouches[0];if(deviceIsIOS){selection=window.getSelection();if(selection.rangeCount&&!selection.isCollapsed){return true;}
if(!deviceIsIOS4){if(touch.identifier&&touch.identifier===this.lastTouchIdentifier){event.preventDefault();return false;}
this.lastTouchIdentifier=touch.identifier;this.updateScrollParent(targetElement);}}
this.trackingClick=true;this.trackingClickStart=event.timeStamp;this.targetElement=targetElement;this.touchStartX=touch.pageX;this.touchStartY=touch.pageY;if((event.timeStamp-this.lastClickTime)<this.tapDelay){event.preventDefault();}
return true;};FastClick.prototype.touchHasMoved=function(event){var touch=event.changedTouches[0],boundary=this.touchBoundary;if(Math.abs(touch.pageX-this.touchStartX)>boundary||Math.abs(touch.pageY-this.touchStartY)>boundary){return true;}
return false;};FastClick.prototype.onTouchMove=function(event){if(!this.trackingClick){return true;}
if(this.targetElement!==this.getTargetElementFromEventTarget(event.target)||this.touchHasMoved(event)){this.trackingClick=false;this.targetElement=null;}
return true;};FastClick.prototype.findControl=function(labelElement){if(labelElement.control!==undefined){return labelElement.control;}
if(labelElement.htmlFor){return document.getElementById(labelElement.htmlFor);}
return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');};FastClick.prototype.onTouchEnd=function(event){var forElement,trackingClickStart,targetTagName,scrollParent,touch,targetElement=this.targetElement;if(!this.trackingClick){return true;}
if((event.timeStamp-this.lastClickTime)<this.tapDelay){this.cancelNextClick=true;return true;}
if((event.timeStamp-this.trackingClickStart)>this.tapTimeout){return true;}
this.cancelNextClick=false;this.lastClickTime=event.timeStamp;trackingClickStart=this.trackingClickStart;this.trackingClick=false;this.trackingClickStart=0;if(deviceIsIOSWithBadTarget){touch=event.changedTouches[0];targetElement=document.elementFromPoint(touch.pageX-window.pageXOffset,touch.pageY-window.pageYOffset)||targetElement;targetElement.fastClickScrollParent=this.targetElement.fastClickScrollParent;}
targetTagName=targetElement.tagName.toLowerCase();if(targetTagName==='label'){forElement=this.findControl(targetElement);if(forElement){this.focus(targetElement);if(deviceIsAndroid){return false;}
targetElement=forElement;}}else if(this.needsFocus(targetElement)){if((event.timeStamp-trackingClickStart)>100||(deviceIsIOS&&window.top!==window&&targetTagName==='input')){this.targetElement=null;return false;}
this.focus(targetElement);this.sendClick(targetElement,event);if(!deviceIsIOS||targetTagName!=='select'){this.targetElement=null;event.preventDefault();}
return false;}
if(deviceIsIOS&&!deviceIsIOS4){scrollParent=targetElement.fastClickScrollParent;if(scrollParent&&scrollParent.fastClickLastScrollTop!==scrollParent.scrollTop){return true;}}
if(!this.needsClick(targetElement)){event.preventDefault();this.sendClick(targetElement,event);}
return false;};FastClick.prototype.onTouchCancel=function(){this.trackingClick=false;this.targetElement=null;};FastClick.prototype.onMouse=function(event){if(!this.targetElement){return true;}
if(event.forwardedTouchEvent){return true;}
if(!event.cancelable){return true;}
if(!this.needsClick(this.targetElement)||this.cancelNextClick){if(event.stopImmediatePropagation){event.stopImmediatePropagation();}else{event.propagationStopped=true;}
event.stopPropagation();event.preventDefault();return false;}
return true;};FastClick.prototype.onClick=function(event){var permitted;if(this.trackingClick){this.targetElement=null;this.trackingClick=false;return true;}
if(event.target.type==='submit'&&event.detail===0){return true;}
permitted=this.onMouse(event);if(!permitted){this.targetElement=null;}
return permitted;};FastClick.prototype.destroy=function(){var layer=this.layer;if(deviceIsAndroid){layer.removeEventListener('mouseover',this.onMouse,true);layer.removeEventListener('mousedown',this.onMouse,true);layer.removeEventListener('mouseup',this.onMouse,true);}
layer.removeEventListener('click',this.onClick,true);layer.removeEventListener('touchstart',this.onTouchStart,false);layer.removeEventListener('touchmove',this.onTouchMove,false);layer.removeEventListener('touchend',this.onTouchEnd,false);layer.removeEventListener('touchcancel',this.onTouchCancel,false);};FastClick.notNeeded=function(layer){var metaViewport;var chromeVersion;var blackberryVersion;var firefoxVersion;if(typeof window.ontouchstart==='undefined'){return true;}
chromeVersion=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1];if(chromeVersion){if(deviceIsAndroid){metaViewport=document.querySelector('meta[name=viewport]');if(metaViewport){if(metaViewport.content.indexOf('user-scalable=no')!==-1){return true;}
if(chromeVersion>31&&document.documentElement.scrollWidth<=window.outerWidth){return true;}}}else{return true;}}
if(deviceIsBlackBerry10){blackberryVersion=navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);if(blackberryVersion[1]>=10&&blackberryVersion[2]>=3){metaViewport=document.querySelector('meta[name=viewport]');if(metaViewport){if(metaViewport.content.indexOf('user-scalable=no')!==-1){return true;}
if(document.documentElement.scrollWidth<=window.outerWidth){return true;}}}}
if(layer.style.msTouchAction==='none'||layer.style.touchAction==='manipulation'){return true;}
firefoxVersion=+(/Firefox\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1];if(firefoxVersion>=27){metaViewport=document.querySelector('meta[name=viewport]');if(metaViewport&&(metaViewport.content.indexOf('user-scalable=no')!==-1||document.documentElement.scrollWidth<=window.outerWidth)){return true;}}
if(layer.style.touchAction==='none'||layer.style.touchAction==='manipulation'){return true;}
return false;};FastClick.attach=function(layer,options){return new FastClick(layer,options);};if(typeof define==='function'&&typeof define.amd==='object'&&define.amd){define(function(){return FastClick;});}else if(typeof module!=='undefined'&&module.exports){module.exports=FastClick.attach;module.exports.FastClick=FastClick;}else{window.FastClick=FastClick;}}());

return stack;})(stacks.stacks_in_71752_page2);
stacks.stacks_in_72396_page2 = {};
stacks.stacks_in_72396_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;
var autoscroll=false,automarker='';if(window.location.hash){automarker=location.hash.replace('#','');window.location.hash="";autoscroll=true;}$(document).ready(function(){var includeInMenu=function(selector){switch(selector){case'all':useMarkers=true;useZones=true;break;case'markers':useMarkers=true;useZones=false;break;case'zones':useMarkers=false;useZones=true;break;}}
function firstMarkerOffset(){return firstMarker.offset().top;}
function generateMenu(){var i=0;$('[data-magellan-destination]').each(function(){var
that=$(this),isZone=false,destination=that.data('magellan-destination'),magicName=that.data('magic-name'),magicHide=typeof that.data('magic-hide')==='undefined'?' ':that.data('magic-hide'),magicIcon=that.data('magic-icon'),iconSet=that.data('magic-icon-set'),magicZType=that.data('magic-zone-type'),magicClass=that.data('magic-class'),magicZLink=that.data('magic-zone-link'),magicLinkTarget=that.data('magic-link-target'),magicZOrigin=that.data('magic-zone-origin'),magicZFont=that.data('magic-font'),magicPopDrop=that.data('magic-popdrop'),magicLL=that.data('magic-ll'),magicRevealID=that.data('magic-reveal-id'),magicDropdown=that.data('magic-dropdown'),tipPopDrop=that.data('pop-drop-tip'),magicDDOptions=that.data('magic-options'),doNotMenu=that.data('magic-inmenu'),zonelink='<li class="mag-item zone-item mag-zone-'+magicZOrigin+' '+magicZFont+'">',item='<li class="mag-item mag-scroll '+magicHide+' '+magicZFont+'" data-pop-drop="'+tipPopDrop+'">';if(typeof magicZOrigin!="undefined"){destination=magicZOrigin;isZone=true;if(magicName==""&&magicIcon.length!=0){magicName=' ';}}
if(typeof magicName==="undefined"){magicName=destination;}
if(typeof magicIcon==="undefined"){magicIcon='';}
if(magicName.length==0&&magicIcon.length==0){magicName=destination;}
if(magicIcon.length>0){magicName='<i class="magic-icon '+iconSet+' '+magicIcon+' mgicon-'+destination+'"></i>'+magicName;}
if(doNotMenu==='not-in-menu')return true;if(isZone&&useZones){if(magicZType==='link'){$(magicNav).append($(zonelink).attr('data-magic-zone-link',magicZType).attr('data-pop-drop',tipPopDrop).append($('<a class ="mag-link mag-zone '+magicClass+'">').attr({'href':magicZLink,'target':magicLinkTarget}).append($('<span class="dot-tip ">').append(magicName))));}else if(magicZType==='reveal'){$(magicNav).append($(zonelink).attr('data-magic-zone-link',magicZType).append($('<a class ="mag-link mag-zone '+magicClass+'">').attr('data-reveal-id',magicRevealID).append($('<span class="dot-tip ">').append(magicName))));}else if(magicZType==='dropdown'){$(magicNav).append($(zonelink).attr('data-magic-zone-link',magicZType).append($('<a class ="mag-link mag-zone '+magicClass+'">').attr({'data-dropdown':magicDropdown,'data-options':magicDDOptions,'aria-expanded':false}).append($('<span class="dot-tip ">').append(magicName))));var dropdownID='#'+magicDropdown;dme.append($(dropdownID).parent());}else if(magicZType==='popdrop'){$(magicNav).append($(zonelink).attr('data-magic-zone-link',magicZType).append($('<a class ="mag-link mag-zone '+magicClass+'">').attr({'data-pop-drop':magicPopDrop}).append($('<span class="dot-tip ">').append(magicName))));}else if(magicZType==='limelight'){$(magicNav).append($(zonelink).attr('data-magic-zone-link',magicZType).append($('<a class ="mag-link mag-zone '+magicLL+' '+magicClass+'">').append($('<span class="dot-tip ">').append(magicName))));}}
else{if(useMarkers&&!isZone){$(magicNav).append($(item).attr('data-magellan-arrival',destination).append($('<a class ="mag-link">').attr('href',('#'+destination)).append($('<span class="dot-tip ">').append(magicName))));}}
i++;});return(i);}
function checkLanding(){if($(window).scrollTop()<landingRefPt){$('#stacks_in_72396_page2 [data-magellan-expedition]').addClass('mag-landing');}else{$('#stacks_in_72396_page2 [data-magellan-expedition]').removeClass('mag-landing');}}
function hasScrolled(){if($('#stacks_in_72396_page2 .magic-nav>.mag-item.active').length>0){if($('#stacks_in_72396_page2 .magic-nav>.mag-item.active').hasClass('hide-when-active')){$('#stacks_in_72396_page2 [data-magellan-expedition]').addClass('mag-hidden');}else{$('#stacks_in_72396_page2 [data-magellan-expedition]').removeClass('mag-hidden');}}}var mobileToggle=function(action){switch(action){case'toggle':if(dme.hasClass('toggle-open')){dme.removeClass('toggle-open');menuItems.slideUp(toggleSpeed,function(){});}else{dme.addClass('toggle-open');menuItems.slideDown(toggleSpeed,function(){});}
break;case'desktop':menuItems.css('display','');dme.removeClass('toggle-open');break;}}
var isToggleActive=function(){var win=$(window).width();if(win<mobBreakpoint){return true;}else{return false;}}
var toggleRespond=function(){if(isToggleActive()){dme.addClass('mag-toggle');if(dropdowns)dropdowns.removeClass('open');}else{dme.removeClass('mag-toggle');mobileToggle('desktop');}}
var stack=$('#stacks_in_72396_page2'),dme=$('[data-magellan-expedition]',stack),toggleTarget=$('.toggle-target',stack),toggleSpeed=200,burgerWrap=$('.burgWrapper',stack),burger=$('.burg',burgerWrap),menuItems=$('.side-nav.magic-nav',stack),mobBreakpoint=1200,orientation='mag-horizontal',itemInclude='all',useMarkers,useZones,magicNav=$('.magic-nav',stack),magicDot=$('.magic-dots',stack),landingAction='preMarker',firstMarker=$('body').find('[data-magellan-destination]').eq(0),firstMarker=firstMarker.length?firstMarker:$('body'),landingRefPt,didScroll=false,padBody=false,dropdowns,i=0;if($('#foundation-loader').length){$('#foundation-loader').after('<div class="f-magicgellan-fixed"></div');}else{$('body').prepend('<div class="f-magicgellan-fixed"></div');}
$('li',stack).each(function(){var id=$(this).data('magellan-arrival')
$('a',this).attr('href','#'+id);});includeInMenu(itemInclude);var numMarkers=generateMenu();$('#stacks_in_72396_page2 .magic-nav').find('.mag-scroll').eq(0).addClass('active');$('#stacks_in_72396_page2 .magic-dots').find('.mag-scroll').eq(0).addClass('active');hasScrolled();toggleTarget.on('click',function(e){mobileToggle('toggle');});$('.mag-item:not(.zone-item)',menuItems).on('click',function(){if(isToggleActive()){mobileToggle('toggle');}});var resizeTimer;$(window).on('resize',function(e){clearTimeout(resizeTimer);resizeTimer=setTimeout(function(){toggleRespond();},20);});$(window).scroll(function(event){didScroll=true});setInterval(function(){if(didScroll){hasScrolled();didScroll=false;}},100);$(window).load(function(){setTimeout(function(){try{foundation&&foundation.jQuery
var f=foundation.jQuery;f(document).foundation('dropdown','reflow');f(document).foundation('magellan','reflow');dropdowns=stack.find('.f-dropdown');}
catch(e){console.log('Foundation not found');}
$('#stacks_in_72396_page2 [data-magellan-expedition]').removeClass('mag-preload');},100);if(autoscroll){$('.mag-item[data-magellan-arrival="'+automarker+'"]>a').trigger('click');}});});
;(function(){'use strict';function FastClick(layer,options){var oldOnClick;options=options||{};this.trackingClick=false;this.trackingClickStart=0;this.targetElement=null;this.touchStartX=0;this.touchStartY=0;this.lastTouchIdentifier=0;this.touchBoundary=options.touchBoundary||10;this.layer=layer;this.tapDelay=options.tapDelay||200;this.tapTimeout=options.tapTimeout||700;if(FastClick.notNeeded(layer)){return;}
function bind(method,context){return function(){return method.apply(context,arguments);};}
var methods=['onMouse','onClick','onTouchStart','onTouchMove','onTouchEnd','onTouchCancel'];var context=this;for(var i=0,l=methods.length;i<l;i++){context[methods[i]]=bind(context[methods[i]],context);}
if(deviceIsAndroid){layer.addEventListener('mouseover',this.onMouse,true);layer.addEventListener('mousedown',this.onMouse,true);layer.addEventListener('mouseup',this.onMouse,true);}
layer.addEventListener('click',this.onClick,true);layer.addEventListener('touchstart',this.onTouchStart,false);layer.addEventListener('touchmove',this.onTouchMove,false);layer.addEventListener('touchend',this.onTouchEnd,false);layer.addEventListener('touchcancel',this.onTouchCancel,false);if(!Event.prototype.stopImmediatePropagation){layer.removeEventListener=function(type,callback,capture){var rmv=Node.prototype.removeEventListener;if(type==='click'){rmv.call(layer,type,callback.hijacked||callback,capture);}else{rmv.call(layer,type,callback,capture);}};layer.addEventListener=function(type,callback,capture){var adv=Node.prototype.addEventListener;if(type==='click'){adv.call(layer,type,callback.hijacked||(callback.hijacked=function(event){if(!event.propagationStopped){callback(event);}}),capture);}else{adv.call(layer,type,callback,capture);}};}
if(typeof layer.onclick==='function'){oldOnClick=layer.onclick;layer.addEventListener('click',function(event){oldOnClick(event);},false);layer.onclick=null;}}
var deviceIsWindowsPhone=navigator.userAgent.indexOf("Windows Phone")>=0;var deviceIsAndroid=navigator.userAgent.indexOf('Android')>0&&!deviceIsWindowsPhone;var deviceIsIOS=/iP(ad|hone|od)/.test(navigator.userAgent)&&!deviceIsWindowsPhone;var deviceIsIOS4=deviceIsIOS&&(/OS 4_\d(_\d)?/).test(navigator.userAgent);var deviceIsIOSWithBadTarget=deviceIsIOS&&(/OS [6-7]_\d/).test(navigator.userAgent);var deviceIsBlackBerry10=navigator.userAgent.indexOf('BB10')>0;FastClick.prototype.needsClick=function(target){switch(target.nodeName.toLowerCase()){case'button':case'select':case'textarea':if(target.disabled){return true;}
break;case'input':if((deviceIsIOS&&target.type==='file')||target.disabled){return true;}
break;case'label':case'iframe':case'video':return true;}
return(/\bneedsclick\b/).test(target.className);};FastClick.prototype.needsFocus=function(target){switch(target.nodeName.toLowerCase()){case'textarea':return true;case'select':return!deviceIsAndroid;case'input':switch(target.type){case'button':case'checkbox':case'file':case'image':case'radio':case'submit':return false;}
return!target.disabled&&!target.readOnly;default:return(/\bneedsfocus\b/).test(target.className);}};FastClick.prototype.sendClick=function(targetElement,event){var clickEvent,touch;if(document.activeElement&&document.activeElement!==targetElement){document.activeElement.blur();}
touch=event.changedTouches[0];clickEvent=document.createEvent('MouseEvents');clickEvent.initMouseEvent(this.determineEventType(targetElement),true,true,window,1,touch.screenX,touch.screenY,touch.clientX,touch.clientY,false,false,false,false,0,null);clickEvent.forwardedTouchEvent=true;targetElement.dispatchEvent(clickEvent);};FastClick.prototype.determineEventType=function(targetElement){if(deviceIsAndroid&&targetElement.tagName.toLowerCase()==='select'){return'mousedown';}
return'click';};FastClick.prototype.focus=function(targetElement){var length;if(deviceIsIOS&&targetElement.setSelectionRange&&targetElement.type.indexOf('date')!==0&&targetElement.type!=='time'&&targetElement.type!=='month'){length=targetElement.value.length;targetElement.setSelectionRange(length,length);}else{targetElement.focus();}};FastClick.prototype.updateScrollParent=function(targetElement){var scrollParent,parentElement;scrollParent=targetElement.fastClickScrollParent;if(!scrollParent||!scrollParent.contains(targetElement)){parentElement=targetElement;do{if(parentElement.scrollHeight>parentElement.offsetHeight){scrollParent=parentElement;targetElement.fastClickScrollParent=parentElement;break;}
parentElement=parentElement.parentElement;}while(parentElement);}
if(scrollParent){scrollParent.fastClickLastScrollTop=scrollParent.scrollTop;}};FastClick.prototype.getTargetElementFromEventTarget=function(eventTarget){if(eventTarget.nodeType===Node.TEXT_NODE){return eventTarget.parentNode;}
return eventTarget;};FastClick.prototype.onTouchStart=function(event){var targetElement,touch,selection;if(event.targetTouches.length>1){return true;}
targetElement=this.getTargetElementFromEventTarget(event.target);touch=event.targetTouches[0];if(deviceIsIOS){selection=window.getSelection();if(selection.rangeCount&&!selection.isCollapsed){return true;}
if(!deviceIsIOS4){if(touch.identifier&&touch.identifier===this.lastTouchIdentifier){event.preventDefault();return false;}
this.lastTouchIdentifier=touch.identifier;this.updateScrollParent(targetElement);}}
this.trackingClick=true;this.trackingClickStart=event.timeStamp;this.targetElement=targetElement;this.touchStartX=touch.pageX;this.touchStartY=touch.pageY;if((event.timeStamp-this.lastClickTime)<this.tapDelay){event.preventDefault();}
return true;};FastClick.prototype.touchHasMoved=function(event){var touch=event.changedTouches[0],boundary=this.touchBoundary;if(Math.abs(touch.pageX-this.touchStartX)>boundary||Math.abs(touch.pageY-this.touchStartY)>boundary){return true;}
return false;};FastClick.prototype.onTouchMove=function(event){if(!this.trackingClick){return true;}
if(this.targetElement!==this.getTargetElementFromEventTarget(event.target)||this.touchHasMoved(event)){this.trackingClick=false;this.targetElement=null;}
return true;};FastClick.prototype.findControl=function(labelElement){if(labelElement.control!==undefined){return labelElement.control;}
if(labelElement.htmlFor){return document.getElementById(labelElement.htmlFor);}
return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');};FastClick.prototype.onTouchEnd=function(event){var forElement,trackingClickStart,targetTagName,scrollParent,touch,targetElement=this.targetElement;if(!this.trackingClick){return true;}
if((event.timeStamp-this.lastClickTime)<this.tapDelay){this.cancelNextClick=true;return true;}
if((event.timeStamp-this.trackingClickStart)>this.tapTimeout){return true;}
this.cancelNextClick=false;this.lastClickTime=event.timeStamp;trackingClickStart=this.trackingClickStart;this.trackingClick=false;this.trackingClickStart=0;if(deviceIsIOSWithBadTarget){touch=event.changedTouches[0];targetElement=document.elementFromPoint(touch.pageX-window.pageXOffset,touch.pageY-window.pageYOffset)||targetElement;targetElement.fastClickScrollParent=this.targetElement.fastClickScrollParent;}
targetTagName=targetElement.tagName.toLowerCase();if(targetTagName==='label'){forElement=this.findControl(targetElement);if(forElement){this.focus(targetElement);if(deviceIsAndroid){return false;}
targetElement=forElement;}}else if(this.needsFocus(targetElement)){if((event.timeStamp-trackingClickStart)>100||(deviceIsIOS&&window.top!==window&&targetTagName==='input')){this.targetElement=null;return false;}
this.focus(targetElement);this.sendClick(targetElement,event);if(!deviceIsIOS||targetTagName!=='select'){this.targetElement=null;event.preventDefault();}
return false;}
if(deviceIsIOS&&!deviceIsIOS4){scrollParent=targetElement.fastClickScrollParent;if(scrollParent&&scrollParent.fastClickLastScrollTop!==scrollParent.scrollTop){return true;}}
if(!this.needsClick(targetElement)){event.preventDefault();this.sendClick(targetElement,event);}
return false;};FastClick.prototype.onTouchCancel=function(){this.trackingClick=false;this.targetElement=null;};FastClick.prototype.onMouse=function(event){if(!this.targetElement){return true;}
if(event.forwardedTouchEvent){return true;}
if(!event.cancelable){return true;}
if(!this.needsClick(this.targetElement)||this.cancelNextClick){if(event.stopImmediatePropagation){event.stopImmediatePropagation();}else{event.propagationStopped=true;}
event.stopPropagation();event.preventDefault();return false;}
return true;};FastClick.prototype.onClick=function(event){var permitted;if(this.trackingClick){this.targetElement=null;this.trackingClick=false;return true;}
if(event.target.type==='submit'&&event.detail===0){return true;}
permitted=this.onMouse(event);if(!permitted){this.targetElement=null;}
return permitted;};FastClick.prototype.destroy=function(){var layer=this.layer;if(deviceIsAndroid){layer.removeEventListener('mouseover',this.onMouse,true);layer.removeEventListener('mousedown',this.onMouse,true);layer.removeEventListener('mouseup',this.onMouse,true);}
layer.removeEventListener('click',this.onClick,true);layer.removeEventListener('touchstart',this.onTouchStart,false);layer.removeEventListener('touchmove',this.onTouchMove,false);layer.removeEventListener('touchend',this.onTouchEnd,false);layer.removeEventListener('touchcancel',this.onTouchCancel,false);};FastClick.notNeeded=function(layer){var metaViewport;var chromeVersion;var blackberryVersion;var firefoxVersion;if(typeof window.ontouchstart==='undefined'){return true;}
chromeVersion=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1];if(chromeVersion){if(deviceIsAndroid){metaViewport=document.querySelector('meta[name=viewport]');if(metaViewport){if(metaViewport.content.indexOf('user-scalable=no')!==-1){return true;}
if(chromeVersion>31&&document.documentElement.scrollWidth<=window.outerWidth){return true;}}}else{return true;}}
if(deviceIsBlackBerry10){blackberryVersion=navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);if(blackberryVersion[1]>=10&&blackberryVersion[2]>=3){metaViewport=document.querySelector('meta[name=viewport]');if(metaViewport){if(metaViewport.content.indexOf('user-scalable=no')!==-1){return true;}
if(document.documentElement.scrollWidth<=window.outerWidth){return true;}}}}
if(layer.style.msTouchAction==='none'||layer.style.touchAction==='manipulation'){return true;}
firefoxVersion=+(/Firefox\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1];if(firefoxVersion>=27){metaViewport=document.querySelector('meta[name=viewport]');if(metaViewport&&(metaViewport.content.indexOf('user-scalable=no')!==-1||document.documentElement.scrollWidth<=window.outerWidth)){return true;}}
if(layer.style.touchAction==='none'||layer.style.touchAction==='manipulation'){return true;}
return false;};FastClick.attach=function(layer,options){return new FastClick(layer,options);};if(typeof define==='function'&&typeof define.amd==='object'&&define.amd){define(function(){return FastClick;});}else if(typeof module!=='undefined'&&module.exports){module.exports=FastClick.attach;module.exports.FastClick=FastClick;}else{window.FastClick=FastClick;}}());

return stack;})(stacks.stacks_in_72396_page2);
stacks.stacks_in_71188_page2 = {};
stacks.stacks_in_71188_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_71188_page2);
stacks.stacks_in_71971_page2 = {};
stacks.stacks_in_71971_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;




return stack;})(stacks.stacks_in_71971_page2);
stacks.stacks_in_74640_page2 = {};
stacks.stacks_in_74640_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;




return stack;})(stacks.stacks_in_74640_page2);
stacks.stacks_in_71976_page2 = {};
stacks.stacks_in_71976_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_71976_page2);
stacks.stacks_in_71981_page2 = {};
stacks.stacks_in_71981_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_71981_page2);
stacks.stacks_in_73547_page2 = {};
stacks.stacks_in_73547_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;// jQuery Extra Selectors - (c) Keith Clark freely distributable under the terms of the MIT license.
// twitter.com/keithclarkcouk
// www.keithclark.co.uk

(function($) {
  function getNthIndex(cur, dir) {
    var t = cur, idx = 0;
    while (cur = cur[dir] ) {
      if (t.tagName == cur.tagName) {
        idx++;
      }
    }
    return idx;
  }
  function isNthOf(elm, pattern, dir) {
    var position = getNthIndex(elm, dir), loop;
    if (pattern == "odd" || pattern == "even") {
      loop = 2;
      position -= !(pattern == "odd");
    } else {
      var nth = pattern.indexOf("n");
      if (nth > -1) {
        loop = parseInt(pattern, 10) || parseInt(pattern.substring(0, nth) + "1", 10);
        position -= (parseInt(pattern.substring(nth + 1), 10) || 0) - 1;
      } else {
        loop = position + 1;
        position -= parseInt(pattern, 10) - 1;
      }
    }
    return (loop<0 ? position<=0 : position >= 0) && position % loop == 0
  }
  var pseudos = {
    "first-of-type": function(elm) {
      return getNthIndex(elm, "previousSibling") == 0;
    },
    "last-of-type": function(elm) {
      return getNthIndex(elm, "nextSibling") == 0;
    },
    "only-of-type": function(elm) {
      return pseudos["first-of-type"](elm) && pseudos["last-of-type"](elm);
    },
    "nth-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "previousSibling");
    },
    "nth-last-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "nextSibling");
    }
  }
  $.extend($.expr[':'], pseudos);
}(jQuery));

$(document).ready(function($) {

  var $animSpeed = 500;

  $('#accordion_stacks_in_73547_page2 > .accordion > div:last-of-type > div > dt').addClass('accordionLastDt');
  $('#accordion_stacks_in_73547_page2 > .accordion > div:last-of-type > div > dd').addClass('accordionLastDd');
  $('#accordion_stacks_in_73547_page2 > .accordion > div:first-of-type > div > dt').addClass('accordionFirstDt');
  $('#accordion_stacks_in_73547_page2 > .accordion > div > div > dt').addClass('accordionIconOff').addClass('animateOn');

  $('#accordion_stacks_in_73547_page2 > .accordion div div dd').hide();
  $('#accordion_stacks_in_73547_page2 > .dropDown1 > div:first-of-type > div dd').slideDown($animSpeed).addClass("accordionOpen");;
  $('#accordion_stacks_in_73547_page2 > .dropDown1 > div:first-of-type > div dt:first-child > a').addClass('selected').parent().addClass('selected');
  $('#accordion_stacks_in_73547_page2 > .accordion div div dt a.accordionSlide').click(function(){
    if ($(this).hasClass('selected')) {
      $(this).removeClass('selected').parent().removeClass('selected');
      $(this).parent().next().slideUp($animSpeed).removeClass("accordionOpen");
    } else {
      $('#accordion_stacks_in_73547_page2 > .accordion div div dt a.accordionSlide').removeClass('selected').parent().removeClass('selected');
      $(this).addClass('selected').parent().addClass('selected');
      $('#accordion_stacks_in_73547_page2 > .accordion div div dd').slideUp($animSpeed).removeClass("accordionOpen");
      $(this).parent().next().slideDown($animSpeed).addClass("accordionOpen");
    }
    return false; // Prevents default - stops anchor tag from firing
  });

  $('#accordion_stacks_in_73547_page2 dd').addClass('clearfix');
  $('#accordion_stacks_in_73547_page2').parent().css ({
    'padding':'1px'
  });

  //URL ?article=3 open
  var article = location.search.split('article=')[1];
  if (article >= 0 ) {
    $("#accordion_stacks_in_73547_page2 dl div:nth-child("+article+") a").trigger("click");
  }

});
//#accordion_stacks_in_73547_page2 remove .nonTouch if touch device
$(window).on("touchstart", function(ev) {
  $("#accordion_stacks_in_73547_page2").removeClass("nonTouch");
});


return stack;})(stacks.stacks_in_73547_page2);
stacks.stacks_in_72055_page2 = {};
stacks.stacks_in_72055_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_72055_page2);
stacks.stacks_in_74663_page2 = {};
stacks.stacks_in_74663_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;




return stack;})(stacks.stacks_in_74663_page2);
stacks.stacks_in_71991_page2 = {};
stacks.stacks_in_71991_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_71991_page2);
stacks.stacks_in_71996_page2 = {};
stacks.stacks_in_71996_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_71996_page2);
stacks.stacks_in_73557_page2 = {};
stacks.stacks_in_73557_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;// jQuery Extra Selectors - (c) Keith Clark freely distributable under the terms of the MIT license.
// twitter.com/keithclarkcouk
// www.keithclark.co.uk

(function($) {
  function getNthIndex(cur, dir) {
    var t = cur, idx = 0;
    while (cur = cur[dir] ) {
      if (t.tagName == cur.tagName) {
        idx++;
      }
    }
    return idx;
  }
  function isNthOf(elm, pattern, dir) {
    var position = getNthIndex(elm, dir), loop;
    if (pattern == "odd" || pattern == "even") {
      loop = 2;
      position -= !(pattern == "odd");
    } else {
      var nth = pattern.indexOf("n");
      if (nth > -1) {
        loop = parseInt(pattern, 10) || parseInt(pattern.substring(0, nth) + "1", 10);
        position -= (parseInt(pattern.substring(nth + 1), 10) || 0) - 1;
      } else {
        loop = position + 1;
        position -= parseInt(pattern, 10) - 1;
      }
    }
    return (loop<0 ? position<=0 : position >= 0) && position % loop == 0
  }
  var pseudos = {
    "first-of-type": function(elm) {
      return getNthIndex(elm, "previousSibling") == 0;
    },
    "last-of-type": function(elm) {
      return getNthIndex(elm, "nextSibling") == 0;
    },
    "only-of-type": function(elm) {
      return pseudos["first-of-type"](elm) && pseudos["last-of-type"](elm);
    },
    "nth-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "previousSibling");
    },
    "nth-last-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "nextSibling");
    }
  }
  $.extend($.expr[':'], pseudos);
}(jQuery));

$(document).ready(function($) {

  var $animSpeed = 500;

  $('#accordion_stacks_in_73557_page2 > .accordion > div:last-of-type > div > dt').addClass('accordionLastDt');
  $('#accordion_stacks_in_73557_page2 > .accordion > div:last-of-type > div > dd').addClass('accordionLastDd');
  $('#accordion_stacks_in_73557_page2 > .accordion > div:first-of-type > div > dt').addClass('accordionFirstDt');
  $('#accordion_stacks_in_73557_page2 > .accordion > div > div > dt').addClass('accordionIconOff').addClass('animateOn');

  $('#accordion_stacks_in_73557_page2 > .accordion div div dd').hide();
  $('#accordion_stacks_in_73557_page2 > .dropDown1 > div:first-of-type > div dd').slideDown($animSpeed).addClass("accordionOpen");;
  $('#accordion_stacks_in_73557_page2 > .dropDown1 > div:first-of-type > div dt:first-child > a').addClass('selected').parent().addClass('selected');
  $('#accordion_stacks_in_73557_page2 > .accordion div div dt a.accordionSlide').click(function(){
    if ($(this).hasClass('selected')) {
      $(this).removeClass('selected').parent().removeClass('selected');
      $(this).parent().next().slideUp($animSpeed).removeClass("accordionOpen");
    } else {
      $('#accordion_stacks_in_73557_page2 > .accordion div div dt a.accordionSlide').removeClass('selected').parent().removeClass('selected');
      $(this).addClass('selected').parent().addClass('selected');
      $('#accordion_stacks_in_73557_page2 > .accordion div div dd').slideUp($animSpeed).removeClass("accordionOpen");
      $(this).parent().next().slideDown($animSpeed).addClass("accordionOpen");
    }
    return false; // Prevents default - stops anchor tag from firing
  });

  $('#accordion_stacks_in_73557_page2 dd').addClass('clearfix');
  $('#accordion_stacks_in_73557_page2').parent().css ({
    'padding':'1px'
  });

  //URL ?article=3 open
  var article = location.search.split('article=')[1];
  if (article >= 0 ) {
    $("#accordion_stacks_in_73557_page2 dl div:nth-child("+article+") a").trigger("click");
  }

});
//#accordion_stacks_in_73557_page2 remove .nonTouch if touch device
$(window).on("touchstart", function(ev) {
  $("#accordion_stacks_in_73557_page2").removeClass("nonTouch");
});


return stack;})(stacks.stacks_in_73557_page2);
stacks.stacks_in_72064_page2 = {};
stacks.stacks_in_72064_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_72064_page2);
stacks.stacks_in_73333_page2 = {};
stacks.stacks_in_73333_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;




return stack;})(stacks.stacks_in_73333_page2);
stacks.stacks_in_74681_page2 = {};
stacks.stacks_in_74681_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;




return stack;})(stacks.stacks_in_74681_page2);
stacks.stacks_in_73338_page2 = {};
stacks.stacks_in_73338_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_73338_page2);
stacks.stacks_in_74370_page2 = {};
stacks.stacks_in_74370_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_74370_page2);
stacks.stacks_in_73459_page2 = {};
stacks.stacks_in_73459_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;// jQuery Extra Selectors - (c) Keith Clark freely distributable under the terms of the MIT license.
// twitter.com/keithclarkcouk
// www.keithclark.co.uk

(function($) {
  function getNthIndex(cur, dir) {
    var t = cur, idx = 0;
    while (cur = cur[dir] ) {
      if (t.tagName == cur.tagName) {
        idx++;
      }
    }
    return idx;
  }
  function isNthOf(elm, pattern, dir) {
    var position = getNthIndex(elm, dir), loop;
    if (pattern == "odd" || pattern == "even") {
      loop = 2;
      position -= !(pattern == "odd");
    } else {
      var nth = pattern.indexOf("n");
      if (nth > -1) {
        loop = parseInt(pattern, 10) || parseInt(pattern.substring(0, nth) + "1", 10);
        position -= (parseInt(pattern.substring(nth + 1), 10) || 0) - 1;
      } else {
        loop = position + 1;
        position -= parseInt(pattern, 10) - 1;
      }
    }
    return (loop<0 ? position<=0 : position >= 0) && position % loop == 0
  }
  var pseudos = {
    "first-of-type": function(elm) {
      return getNthIndex(elm, "previousSibling") == 0;
    },
    "last-of-type": function(elm) {
      return getNthIndex(elm, "nextSibling") == 0;
    },
    "only-of-type": function(elm) {
      return pseudos["first-of-type"](elm) && pseudos["last-of-type"](elm);
    },
    "nth-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "previousSibling");
    },
    "nth-last-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "nextSibling");
    }
  }
  $.extend($.expr[':'], pseudos);
}(jQuery));

$(document).ready(function($) {

  var $animSpeed = 500;

  $('#accordion_stacks_in_73459_page2 > .accordion > div:last-of-type > div > dt').addClass('accordionLastDt');
  $('#accordion_stacks_in_73459_page2 > .accordion > div:last-of-type > div > dd').addClass('accordionLastDd');
  $('#accordion_stacks_in_73459_page2 > .accordion > div:first-of-type > div > dt').addClass('accordionFirstDt');
  $('#accordion_stacks_in_73459_page2 > .accordion > div > div > dt').addClass('accordionIconOff').addClass('animateOn');

  $('#accordion_stacks_in_73459_page2 > .accordion div div dd').hide();
  $('#accordion_stacks_in_73459_page2 > .dropDown1 > div:first-of-type > div dd').slideDown($animSpeed).addClass("accordionOpen");;
  $('#accordion_stacks_in_73459_page2 > .dropDown1 > div:first-of-type > div dt:first-child > a').addClass('selected').parent().addClass('selected');
  $('#accordion_stacks_in_73459_page2 > .accordion div div dt a.accordionSlide').click(function(){
    if ($(this).hasClass('selected')) {
      $(this).removeClass('selected').parent().removeClass('selected');
      $(this).parent().next().slideUp($animSpeed).removeClass("accordionOpen");
    } else {
      $('#accordion_stacks_in_73459_page2 > .accordion div div dt a.accordionSlide').removeClass('selected').parent().removeClass('selected');
      $(this).addClass('selected').parent().addClass('selected');
      $('#accordion_stacks_in_73459_page2 > .accordion div div dd').slideUp($animSpeed).removeClass("accordionOpen");
      $(this).parent().next().slideDown($animSpeed).addClass("accordionOpen");
    }
    return false; // Prevents default - stops anchor tag from firing
  });

  $('#accordion_stacks_in_73459_page2 dd').addClass('clearfix');
  $('#accordion_stacks_in_73459_page2').parent().css ({
    'padding':'1px'
  });

  //URL ?article=3 open
  var article = location.search.split('article=')[1];
  if (article >= 0 ) {
    $("#accordion_stacks_in_73459_page2 dl div:nth-child("+article+") a").trigger("click");
  }

});
//#accordion_stacks_in_73459_page2 remove .nonTouch if touch device
$(window).on("touchstart", function(ev) {
  $("#accordion_stacks_in_73459_page2").removeClass("nonTouch");
});


return stack;})(stacks.stacks_in_73459_page2);
stacks.stacks_in_73348_page2 = {};
stacks.stacks_in_73348_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_73348_page2);
stacks.stacks_in_74686_page2 = {};
stacks.stacks_in_74686_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;




return stack;})(stacks.stacks_in_74686_page2);
stacks.stacks_in_74775_page2 = {};
stacks.stacks_in_74775_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_74775_page2);
stacks.stacks_in_74374_page2 = {};
stacks.stacks_in_74374_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_74374_page2);
stacks.stacks_in_74779_page2 = {};
stacks.stacks_in_74779_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;// jQuery Extra Selectors - (c) Keith Clark freely distributable under the terms of the MIT license.
// twitter.com/keithclarkcouk
// www.keithclark.co.uk

(function($) {
  function getNthIndex(cur, dir) {
    var t = cur, idx = 0;
    while (cur = cur[dir] ) {
      if (t.tagName == cur.tagName) {
        idx++;
      }
    }
    return idx;
  }
  function isNthOf(elm, pattern, dir) {
    var position = getNthIndex(elm, dir), loop;
    if (pattern == "odd" || pattern == "even") {
      loop = 2;
      position -= !(pattern == "odd");
    } else {
      var nth = pattern.indexOf("n");
      if (nth > -1) {
        loop = parseInt(pattern, 10) || parseInt(pattern.substring(0, nth) + "1", 10);
        position -= (parseInt(pattern.substring(nth + 1), 10) || 0) - 1;
      } else {
        loop = position + 1;
        position -= parseInt(pattern, 10) - 1;
      }
    }
    return (loop<0 ? position<=0 : position >= 0) && position % loop == 0
  }
  var pseudos = {
    "first-of-type": function(elm) {
      return getNthIndex(elm, "previousSibling") == 0;
    },
    "last-of-type": function(elm) {
      return getNthIndex(elm, "nextSibling") == 0;
    },
    "only-of-type": function(elm) {
      return pseudos["first-of-type"](elm) && pseudos["last-of-type"](elm);
    },
    "nth-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "previousSibling");
    },
    "nth-last-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "nextSibling");
    }
  }
  $.extend($.expr[':'], pseudos);
}(jQuery));

$(document).ready(function($) {

  var $animSpeed = 500;

  $('#accordion_stacks_in_74779_page2 > .accordion > div:last-of-type > div > dt').addClass('accordionLastDt');
  $('#accordion_stacks_in_74779_page2 > .accordion > div:last-of-type > div > dd').addClass('accordionLastDd');
  $('#accordion_stacks_in_74779_page2 > .accordion > div:first-of-type > div > dt').addClass('accordionFirstDt');
  $('#accordion_stacks_in_74779_page2 > .accordion > div > div > dt').addClass('accordionIconOff').addClass('animateOn');

  $('#accordion_stacks_in_74779_page2 > .accordion div div dd').hide();
  $('#accordion_stacks_in_74779_page2 > .dropDown1 > div:first-of-type > div dd').slideDown($animSpeed).addClass("accordionOpen");;
  $('#accordion_stacks_in_74779_page2 > .dropDown1 > div:first-of-type > div dt:first-child > a').addClass('selected').parent().addClass('selected');
  $('#accordion_stacks_in_74779_page2 > .accordion div div dt a.accordionSlide').click(function(){
    if ($(this).hasClass('selected')) {
      $(this).removeClass('selected').parent().removeClass('selected');
      $(this).parent().next().slideUp($animSpeed).removeClass("accordionOpen");
    } else {
      $('#accordion_stacks_in_74779_page2 > .accordion div div dt a.accordionSlide').removeClass('selected').parent().removeClass('selected');
      $(this).addClass('selected').parent().addClass('selected');
      $('#accordion_stacks_in_74779_page2 > .accordion div div dd').slideUp($animSpeed).removeClass("accordionOpen");
      $(this).parent().next().slideDown($animSpeed).addClass("accordionOpen");
    }
    return false; // Prevents default - stops anchor tag from firing
  });

  $('#accordion_stacks_in_74779_page2 dd').addClass('clearfix');
  $('#accordion_stacks_in_74779_page2').parent().css ({
    'padding':'1px'
  });

  //URL ?article=3 open
  var article = location.search.split('article=')[1];
  if (article >= 0 ) {
    $("#accordion_stacks_in_74779_page2 dl div:nth-child("+article+") a").trigger("click");
  }

});
//#accordion_stacks_in_74779_page2 remove .nonTouch if touch device
$(window).on("touchstart", function(ev) {
  $("#accordion_stacks_in_74779_page2").removeClass("nonTouch");
});


return stack;})(stacks.stacks_in_74779_page2);
stacks.stacks_in_74782_page2 = {};
stacks.stacks_in_74782_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_74782_page2);
stacks.stacks_in_74691_page2 = {};
stacks.stacks_in_74691_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;




return stack;})(stacks.stacks_in_74691_page2);
stacks.stacks_in_73387_page2 = {};
stacks.stacks_in_73387_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_73387_page2);
stacks.stacks_in_74378_page2 = {};
stacks.stacks_in_74378_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_74378_page2);
stacks.stacks_in_73505_page2 = {};
stacks.stacks_in_73505_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;// jQuery Extra Selectors - (c) Keith Clark freely distributable under the terms of the MIT license.
// twitter.com/keithclarkcouk
// www.keithclark.co.uk

(function($) {
  function getNthIndex(cur, dir) {
    var t = cur, idx = 0;
    while (cur = cur[dir] ) {
      if (t.tagName == cur.tagName) {
        idx++;
      }
    }
    return idx;
  }
  function isNthOf(elm, pattern, dir) {
    var position = getNthIndex(elm, dir), loop;
    if (pattern == "odd" || pattern == "even") {
      loop = 2;
      position -= !(pattern == "odd");
    } else {
      var nth = pattern.indexOf("n");
      if (nth > -1) {
        loop = parseInt(pattern, 10) || parseInt(pattern.substring(0, nth) + "1", 10);
        position -= (parseInt(pattern.substring(nth + 1), 10) || 0) - 1;
      } else {
        loop = position + 1;
        position -= parseInt(pattern, 10) - 1;
      }
    }
    return (loop<0 ? position<=0 : position >= 0) && position % loop == 0
  }
  var pseudos = {
    "first-of-type": function(elm) {
      return getNthIndex(elm, "previousSibling") == 0;
    },
    "last-of-type": function(elm) {
      return getNthIndex(elm, "nextSibling") == 0;
    },
    "only-of-type": function(elm) {
      return pseudos["first-of-type"](elm) && pseudos["last-of-type"](elm);
    },
    "nth-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "previousSibling");
    },
    "nth-last-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "nextSibling");
    }
  }
  $.extend($.expr[':'], pseudos);
}(jQuery));

$(document).ready(function($) {

  var $animSpeed = 500;

  $('#accordion_stacks_in_73505_page2 > .accordion > div:last-of-type > div > dt').addClass('accordionLastDt');
  $('#accordion_stacks_in_73505_page2 > .accordion > div:last-of-type > div > dd').addClass('accordionLastDd');
  $('#accordion_stacks_in_73505_page2 > .accordion > div:first-of-type > div > dt').addClass('accordionFirstDt');
  $('#accordion_stacks_in_73505_page2 > .accordion > div > div > dt').addClass('accordionIconOff').addClass('animateOn');

  $('#accordion_stacks_in_73505_page2 > .accordion div div dd').hide();
  $('#accordion_stacks_in_73505_page2 > .dropDown1 > div:first-of-type > div dd').slideDown($animSpeed).addClass("accordionOpen");;
  $('#accordion_stacks_in_73505_page2 > .dropDown1 > div:first-of-type > div dt:first-child > a').addClass('selected').parent().addClass('selected');
  $('#accordion_stacks_in_73505_page2 > .accordion div div dt a.accordionSlide').click(function(){
    if ($(this).hasClass('selected')) {
      $(this).removeClass('selected').parent().removeClass('selected');
      $(this).parent().next().slideUp($animSpeed).removeClass("accordionOpen");
    } else {
      $('#accordion_stacks_in_73505_page2 > .accordion div div dt a.accordionSlide').removeClass('selected').parent().removeClass('selected');
      $(this).addClass('selected').parent().addClass('selected');
      $('#accordion_stacks_in_73505_page2 > .accordion div div dd').slideUp($animSpeed).removeClass("accordionOpen");
      $(this).parent().next().slideDown($animSpeed).addClass("accordionOpen");
    }
    return false; // Prevents default - stops anchor tag from firing
  });

  $('#accordion_stacks_in_73505_page2 dd').addClass('clearfix');
  $('#accordion_stacks_in_73505_page2').parent().css ({
    'padding':'1px'
  });

  //URL ?article=3 open
  var article = location.search.split('article=')[1];
  if (article >= 0 ) {
    $("#accordion_stacks_in_73505_page2 dl div:nth-child("+article+") a").trigger("click");
  }

});
//#accordion_stacks_in_73505_page2 remove .nonTouch if touch device
$(window).on("touchstart", function(ev) {
  $("#accordion_stacks_in_73505_page2").removeClass("nonTouch");
});


return stack;})(stacks.stacks_in_73505_page2);
stacks.stacks_in_73392_page2 = {};
stacks.stacks_in_73392_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_73392_page2);
stacks.stacks_in_74668_page2 = {};
stacks.stacks_in_74668_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;




return stack;})(stacks.stacks_in_74668_page2);
stacks.stacks_in_73403_page2 = {};
stacks.stacks_in_73403_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_73403_page2);
stacks.stacks_in_74382_page2 = {};
stacks.stacks_in_74382_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_74382_page2);
stacks.stacks_in_73515_page2 = {};
stacks.stacks_in_73515_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;// jQuery Extra Selectors - (c) Keith Clark freely distributable under the terms of the MIT license.
// twitter.com/keithclarkcouk
// www.keithclark.co.uk

(function($) {
  function getNthIndex(cur, dir) {
    var t = cur, idx = 0;
    while (cur = cur[dir] ) {
      if (t.tagName == cur.tagName) {
        idx++;
      }
    }
    return idx;
  }
  function isNthOf(elm, pattern, dir) {
    var position = getNthIndex(elm, dir), loop;
    if (pattern == "odd" || pattern == "even") {
      loop = 2;
      position -= !(pattern == "odd");
    } else {
      var nth = pattern.indexOf("n");
      if (nth > -1) {
        loop = parseInt(pattern, 10) || parseInt(pattern.substring(0, nth) + "1", 10);
        position -= (parseInt(pattern.substring(nth + 1), 10) || 0) - 1;
      } else {
        loop = position + 1;
        position -= parseInt(pattern, 10) - 1;
      }
    }
    return (loop<0 ? position<=0 : position >= 0) && position % loop == 0
  }
  var pseudos = {
    "first-of-type": function(elm) {
      return getNthIndex(elm, "previousSibling") == 0;
    },
    "last-of-type": function(elm) {
      return getNthIndex(elm, "nextSibling") == 0;
    },
    "only-of-type": function(elm) {
      return pseudos["first-of-type"](elm) && pseudos["last-of-type"](elm);
    },
    "nth-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "previousSibling");
    },
    "nth-last-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "nextSibling");
    }
  }
  $.extend($.expr[':'], pseudos);
}(jQuery));

$(document).ready(function($) {

  var $animSpeed = 500;

  $('#accordion_stacks_in_73515_page2 > .accordion > div:last-of-type > div > dt').addClass('accordionLastDt');
  $('#accordion_stacks_in_73515_page2 > .accordion > div:last-of-type > div > dd').addClass('accordionLastDd');
  $('#accordion_stacks_in_73515_page2 > .accordion > div:first-of-type > div > dt').addClass('accordionFirstDt');
  $('#accordion_stacks_in_73515_page2 > .accordion > div > div > dt').addClass('accordionIconOff').addClass('animateOn');

  $('#accordion_stacks_in_73515_page2 > .accordion div div dd').hide();
  $('#accordion_stacks_in_73515_page2 > .dropDown1 > div:first-of-type > div dd').slideDown($animSpeed).addClass("accordionOpen");;
  $('#accordion_stacks_in_73515_page2 > .dropDown1 > div:first-of-type > div dt:first-child > a').addClass('selected').parent().addClass('selected');
  $('#accordion_stacks_in_73515_page2 > .accordion div div dt a.accordionSlide').click(function(){
    if ($(this).hasClass('selected')) {
      $(this).removeClass('selected').parent().removeClass('selected');
      $(this).parent().next().slideUp($animSpeed).removeClass("accordionOpen");
    } else {
      $('#accordion_stacks_in_73515_page2 > .accordion div div dt a.accordionSlide').removeClass('selected').parent().removeClass('selected');
      $(this).addClass('selected').parent().addClass('selected');
      $('#accordion_stacks_in_73515_page2 > .accordion div div dd').slideUp($animSpeed).removeClass("accordionOpen");
      $(this).parent().next().slideDown($animSpeed).addClass("accordionOpen");
    }
    return false; // Prevents default - stops anchor tag from firing
  });

  $('#accordion_stacks_in_73515_page2 dd').addClass('clearfix');
  $('#accordion_stacks_in_73515_page2').parent().css ({
    'padding':'1px'
  });

  //URL ?article=3 open
  var article = location.search.split('article=')[1];
  if (article >= 0 ) {
    $("#accordion_stacks_in_73515_page2 dl div:nth-child("+article+") a").trigger("click");
  }

});
//#accordion_stacks_in_73515_page2 remove .nonTouch if touch device
$(window).on("touchstart", function(ev) {
  $("#accordion_stacks_in_73515_page2").removeClass("nonTouch");
});


return stack;})(stacks.stacks_in_73515_page2);
stacks.stacks_in_73408_page2 = {};
stacks.stacks_in_73408_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_73408_page2);
stacks.stacks_in_74701_page2 = {};
stacks.stacks_in_74701_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;




return stack;})(stacks.stacks_in_74701_page2);
stacks.stacks_in_73419_page2 = {};
stacks.stacks_in_73419_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_73419_page2);
stacks.stacks_in_74386_page2 = {};
stacks.stacks_in_74386_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_74386_page2);
stacks.stacks_in_73525_page2 = {};
stacks.stacks_in_73525_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;// jQuery Extra Selectors - (c) Keith Clark freely distributable under the terms of the MIT license.
// twitter.com/keithclarkcouk
// www.keithclark.co.uk

(function($) {
  function getNthIndex(cur, dir) {
    var t = cur, idx = 0;
    while (cur = cur[dir] ) {
      if (t.tagName == cur.tagName) {
        idx++;
      }
    }
    return idx;
  }
  function isNthOf(elm, pattern, dir) {
    var position = getNthIndex(elm, dir), loop;
    if (pattern == "odd" || pattern == "even") {
      loop = 2;
      position -= !(pattern == "odd");
    } else {
      var nth = pattern.indexOf("n");
      if (nth > -1) {
        loop = parseInt(pattern, 10) || parseInt(pattern.substring(0, nth) + "1", 10);
        position -= (parseInt(pattern.substring(nth + 1), 10) || 0) - 1;
      } else {
        loop = position + 1;
        position -= parseInt(pattern, 10) - 1;
      }
    }
    return (loop<0 ? position<=0 : position >= 0) && position % loop == 0
  }
  var pseudos = {
    "first-of-type": function(elm) {
      return getNthIndex(elm, "previousSibling") == 0;
    },
    "last-of-type": function(elm) {
      return getNthIndex(elm, "nextSibling") == 0;
    },
    "only-of-type": function(elm) {
      return pseudos["first-of-type"](elm) && pseudos["last-of-type"](elm);
    },
    "nth-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "previousSibling");
    },
    "nth-last-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "nextSibling");
    }
  }
  $.extend($.expr[':'], pseudos);
}(jQuery));

$(document).ready(function($) {

  var $animSpeed = 500;

  $('#accordion_stacks_in_73525_page2 > .accordion > div:last-of-type > div > dt').addClass('accordionLastDt');
  $('#accordion_stacks_in_73525_page2 > .accordion > div:last-of-type > div > dd').addClass('accordionLastDd');
  $('#accordion_stacks_in_73525_page2 > .accordion > div:first-of-type > div > dt').addClass('accordionFirstDt');
  $('#accordion_stacks_in_73525_page2 > .accordion > div > div > dt').addClass('accordionIconOff').addClass('animateOn');

  $('#accordion_stacks_in_73525_page2 > .accordion div div dd').hide();
  $('#accordion_stacks_in_73525_page2 > .dropDown1 > div:first-of-type > div dd').slideDown($animSpeed).addClass("accordionOpen");;
  $('#accordion_stacks_in_73525_page2 > .dropDown1 > div:first-of-type > div dt:first-child > a').addClass('selected').parent().addClass('selected');
  $('#accordion_stacks_in_73525_page2 > .accordion div div dt a.accordionSlide').click(function(){
    if ($(this).hasClass('selected')) {
      $(this).removeClass('selected').parent().removeClass('selected');
      $(this).parent().next().slideUp($animSpeed).removeClass("accordionOpen");
    } else {
      $('#accordion_stacks_in_73525_page2 > .accordion div div dt a.accordionSlide').removeClass('selected').parent().removeClass('selected');
      $(this).addClass('selected').parent().addClass('selected');
      $('#accordion_stacks_in_73525_page2 > .accordion div div dd').slideUp($animSpeed).removeClass("accordionOpen");
      $(this).parent().next().slideDown($animSpeed).addClass("accordionOpen");
    }
    return false; // Prevents default - stops anchor tag from firing
  });

  $('#accordion_stacks_in_73525_page2 dd').addClass('clearfix');
  $('#accordion_stacks_in_73525_page2').parent().css ({
    'padding':'1px'
  });

  //URL ?article=3 open
  var article = location.search.split('article=')[1];
  if (article >= 0 ) {
    $("#accordion_stacks_in_73525_page2 dl div:nth-child("+article+") a").trigger("click");
  }

});
//#accordion_stacks_in_73525_page2 remove .nonTouch if touch device
$(window).on("touchstart", function(ev) {
  $("#accordion_stacks_in_73525_page2").removeClass("nonTouch");
});


return stack;})(stacks.stacks_in_73525_page2);
stacks.stacks_in_73424_page2 = {};
stacks.stacks_in_73424_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_73424_page2);
stacks.stacks_in_74696_page2 = {};
stacks.stacks_in_74696_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;




return stack;})(stacks.stacks_in_74696_page2);
stacks.stacks_in_73436_page2 = {};
stacks.stacks_in_73436_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_73436_page2);
stacks.stacks_in_74390_page2 = {};
stacks.stacks_in_74390_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_74390_page2);
stacks.stacks_in_73535_page2 = {};
stacks.stacks_in_73535_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;// jQuery Extra Selectors - (c) Keith Clark freely distributable under the terms of the MIT license.
// twitter.com/keithclarkcouk
// www.keithclark.co.uk

(function($) {
  function getNthIndex(cur, dir) {
    var t = cur, idx = 0;
    while (cur = cur[dir] ) {
      if (t.tagName == cur.tagName) {
        idx++;
      }
    }
    return idx;
  }
  function isNthOf(elm, pattern, dir) {
    var position = getNthIndex(elm, dir), loop;
    if (pattern == "odd" || pattern == "even") {
      loop = 2;
      position -= !(pattern == "odd");
    } else {
      var nth = pattern.indexOf("n");
      if (nth > -1) {
        loop = parseInt(pattern, 10) || parseInt(pattern.substring(0, nth) + "1", 10);
        position -= (parseInt(pattern.substring(nth + 1), 10) || 0) - 1;
      } else {
        loop = position + 1;
        position -= parseInt(pattern, 10) - 1;
      }
    }
    return (loop<0 ? position<=0 : position >= 0) && position % loop == 0
  }
  var pseudos = {
    "first-of-type": function(elm) {
      return getNthIndex(elm, "previousSibling") == 0;
    },
    "last-of-type": function(elm) {
      return getNthIndex(elm, "nextSibling") == 0;
    },
    "only-of-type": function(elm) {
      return pseudos["first-of-type"](elm) && pseudos["last-of-type"](elm);
    },
    "nth-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "previousSibling");
    },
    "nth-last-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "nextSibling");
    }
  }
  $.extend($.expr[':'], pseudos);
}(jQuery));

$(document).ready(function($) {

  var $animSpeed = 500;

  $('#accordion_stacks_in_73535_page2 > .accordion > div:last-of-type > div > dt').addClass('accordionLastDt');
  $('#accordion_stacks_in_73535_page2 > .accordion > div:last-of-type > div > dd').addClass('accordionLastDd');
  $('#accordion_stacks_in_73535_page2 > .accordion > div:first-of-type > div > dt').addClass('accordionFirstDt');
  $('#accordion_stacks_in_73535_page2 > .accordion > div > div > dt').addClass('accordionIconOff').addClass('animateOn');

  $('#accordion_stacks_in_73535_page2 > .accordion div div dd').hide();
  $('#accordion_stacks_in_73535_page2 > .dropDown1 > div:first-of-type > div dd').slideDown($animSpeed).addClass("accordionOpen");;
  $('#accordion_stacks_in_73535_page2 > .dropDown1 > div:first-of-type > div dt:first-child > a').addClass('selected').parent().addClass('selected');
  $('#accordion_stacks_in_73535_page2 > .accordion div div dt a.accordionSlide').click(function(){
    if ($(this).hasClass('selected')) {
      $(this).removeClass('selected').parent().removeClass('selected');
      $(this).parent().next().slideUp($animSpeed).removeClass("accordionOpen");
    } else {
      $('#accordion_stacks_in_73535_page2 > .accordion div div dt a.accordionSlide').removeClass('selected').parent().removeClass('selected');
      $(this).addClass('selected').parent().addClass('selected');
      $('#accordion_stacks_in_73535_page2 > .accordion div div dd').slideUp($animSpeed).removeClass("accordionOpen");
      $(this).parent().next().slideDown($animSpeed).addClass("accordionOpen");
    }
    return false; // Prevents default - stops anchor tag from firing
  });

  $('#accordion_stacks_in_73535_page2 dd').addClass('clearfix');
  $('#accordion_stacks_in_73535_page2').parent().css ({
    'padding':'1px'
  });

  //URL ?article=3 open
  var article = location.search.split('article=')[1];
  if (article >= 0 ) {
    $("#accordion_stacks_in_73535_page2 dl div:nth-child("+article+") a").trigger("click");
  }

});
//#accordion_stacks_in_73535_page2 remove .nonTouch if touch device
$(window).on("touchstart", function(ev) {
  $("#accordion_stacks_in_73535_page2").removeClass("nonTouch");
});


return stack;})(stacks.stacks_in_73535_page2);
stacks.stacks_in_73441_page2 = {};
stacks.stacks_in_73441_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_73441_page2);
stacks.stacks_in_74068_page2 = {};
stacks.stacks_in_74068_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/Akcjonariat.csv', function(data) {
		$('#stacks_in_74068_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74068_page2_CSVTable').CSVToTable('resources/Akcjonariat.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74068_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74068_page2);
stacks.stacks_in_73631_page2 = {};
stacks.stacks_in_73631_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_73631_page2);
stacks.stacks_in_72471_page2 = {};
stacks.stacks_in_72471_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_72471_page2);
stacks.stacks_in_73038_page2 = {};
stacks.stacks_in_73038_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;// jQuery Extra Selectors - (c) Keith Clark freely distributable under the terms of the MIT license.
// twitter.com/keithclarkcouk
// www.keithclark.co.uk

(function($) {
  function getNthIndex(cur, dir) {
    var t = cur, idx = 0;
    while (cur = cur[dir] ) {
      if (t.tagName == cur.tagName) {
        idx++;
      }
    }
    return idx;
  }
  function isNthOf(elm, pattern, dir) {
    var position = getNthIndex(elm, dir), loop;
    if (pattern == "odd" || pattern == "even") {
      loop = 2;
      position -= !(pattern == "odd");
    } else {
      var nth = pattern.indexOf("n");
      if (nth > -1) {
        loop = parseInt(pattern, 10) || parseInt(pattern.substring(0, nth) + "1", 10);
        position -= (parseInt(pattern.substring(nth + 1), 10) || 0) - 1;
      } else {
        loop = position + 1;
        position -= parseInt(pattern, 10) - 1;
      }
    }
    return (loop<0 ? position<=0 : position >= 0) && position % loop == 0
  }
  var pseudos = {
    "first-of-type": function(elm) {
      return getNthIndex(elm, "previousSibling") == 0;
    },
    "last-of-type": function(elm) {
      return getNthIndex(elm, "nextSibling") == 0;
    },
    "only-of-type": function(elm) {
      return pseudos["first-of-type"](elm) && pseudos["last-of-type"](elm);
    },
    "nth-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "previousSibling");
    },
    "nth-last-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "nextSibling");
    }
  }
  $.extend($.expr[':'], pseudos);
}(jQuery));

$(document).ready(function($) {

  var $animSpeed = 500;

  $('#accordion_stacks_in_73038_page2 > .accordion > div:last-of-type > div > dt').addClass('accordionLastDt');
  $('#accordion_stacks_in_73038_page2 > .accordion > div:last-of-type > div > dd').addClass('accordionLastDd');
  $('#accordion_stacks_in_73038_page2 > .accordion > div:first-of-type > div > dt').addClass('accordionFirstDt');
  $('#accordion_stacks_in_73038_page2 > .accordion > div > div > dt').addClass('accordionIconOff').addClass('animateOn');

  $('#accordion_stacks_in_73038_page2 > .accordion div div dd').hide();
  $('#accordion_stacks_in_73038_page2 > .dropDown1 > div:first-of-type > div dd').slideDown($animSpeed).addClass("accordionOpen");;
  $('#accordion_stacks_in_73038_page2 > .dropDown1 > div:first-of-type > div dt:first-child > a').addClass('selected').parent().addClass('selected');
  $('#accordion_stacks_in_73038_page2 > .accordion div div dt a.accordionSlide').click(function(){
    if ($(this).hasClass('selected')) {
      $(this).removeClass('selected').parent().removeClass('selected');
      $(this).parent().next().slideUp($animSpeed).removeClass("accordionOpen");
    } else {
      $('#accordion_stacks_in_73038_page2 > .accordion div div dt a.accordionSlide').removeClass('selected').parent().removeClass('selected');
      $(this).addClass('selected').parent().addClass('selected');
      $('#accordion_stacks_in_73038_page2 > .accordion div div dd').slideUp($animSpeed).removeClass("accordionOpen");
      $(this).parent().next().slideDown($animSpeed).addClass("accordionOpen");
    }
    return false; // Prevents default - stops anchor tag from firing
  });

  $('#accordion_stacks_in_73038_page2 dd').addClass('clearfix');
  $('#accordion_stacks_in_73038_page2').parent().css ({
    'padding':'1px'
  });

  //URL ?article=3 open
  var article = location.search.split('article=')[1];
  if (article >= 0 ) {
    $("#accordion_stacks_in_73038_page2 dl div:nth-child("+article+") a").trigger("click");
  }

});
//#accordion_stacks_in_73038_page2 remove .nonTouch if touch device
$(window).on("touchstart", function(ev) {
  $("#accordion_stacks_in_73038_page2").removeClass("nonTouch");
});


return stack;})(stacks.stacks_in_73038_page2);
stacks.stacks_in_74854_page2 = {};
stacks.stacks_in_74854_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	
		$('#stacks_in_74854_page2 > .container').parentsUntil('.stacks_top').css('overflow', 'visible');
		$('.stacks_top').css({'overflow' : 'visible'});
	
});

return stack;})(stacks.stacks_in_74854_page2);
stacks.stacks_in_74858_page2 = {};
stacks.stacks_in_74858_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	
		$('#stacks_in_74858_page2 > .container').parentsUntil('.stacks_top').css('overflow', 'visible');
		$('.stacks_top').css({'overflow' : 'visible'});
	
});

return stack;})(stacks.stacks_in_74858_page2);
stacks.stacks_in_74859_page2 = {};
stacks.stacks_in_74859_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2018j---1.csv', function(data) {
		$('#stacks_in_74859_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74859_page2_CSVTable').CSVToTable('resources/2018j---1.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74859_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74859_page2);
stacks.stacks_in_74860_page2 = {};
stacks.stacks_in_74860_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2018j---2.csv', function(data) {
		$('#stacks_in_74860_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74860_page2_CSVTable').CSVToTable('resources/2018j---2.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74860_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74860_page2);
stacks.stacks_in_74861_page2 = {};
stacks.stacks_in_74861_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2018j---3.csv', function(data) {
		$('#stacks_in_74861_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74861_page2_CSVTable').CSVToTable('resources/2018j---3.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74861_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74861_page2);
stacks.stacks_in_74862_page2 = {};
stacks.stacks_in_74862_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2018j---4.csv', function(data) {
		$('#stacks_in_74862_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74862_page2_CSVTable').CSVToTable('resources/2018j---4.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74862_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74862_page2);
stacks.stacks_in_74863_page2 = {};
stacks.stacks_in_74863_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2018j---5.csv', function(data) {
		$('#stacks_in_74863_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74863_page2_CSVTable').CSVToTable('resources/2018j---5.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74863_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74863_page2);
stacks.stacks_in_74864_page2 = {};
stacks.stacks_in_74864_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2018j---6.csv', function(data) {
		$('#stacks_in_74864_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74864_page2_CSVTable').CSVToTable('resources/2018j---6.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74864_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74864_page2);
stacks.stacks_in_74886_page2 = {};
stacks.stacks_in_74886_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2018j---7.csv', function(data) {
		$('#stacks_in_74886_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74886_page2_CSVTable').CSVToTable('resources/2018j---7.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74886_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74886_page2);
stacks.stacks_in_74865_page2 = {};
stacks.stacks_in_74865_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2018j---8.csv', function(data) {
		$('#stacks_in_74865_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74865_page2_CSVTable').CSVToTable('resources/2018j---8.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74865_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74865_page2);
stacks.stacks_in_74870_page2 = {};
stacks.stacks_in_74870_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	
		$('#stacks_in_74870_page2 > .container').parentsUntil('.stacks_top').css('overflow', 'visible');
		$('.stacks_top').css({'overflow' : 'visible'});
	
});

return stack;})(stacks.stacks_in_74870_page2);
stacks.stacks_in_74871_page2 = {};
stacks.stacks_in_74871_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2018s---1.csv', function(data) {
		$('#stacks_in_74871_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74871_page2_CSVTable').CSVToTable('resources/2018s---1.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74871_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74871_page2);
stacks.stacks_in_74872_page2 = {};
stacks.stacks_in_74872_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2018s---2.csv', function(data) {
		$('#stacks_in_74872_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74872_page2_CSVTable').CSVToTable('resources/2018s---2.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74872_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74872_page2);
stacks.stacks_in_74873_page2 = {};
stacks.stacks_in_74873_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2018s---3.csv', function(data) {
		$('#stacks_in_74873_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74873_page2_CSVTable').CSVToTable('resources/2018s---3.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74873_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74873_page2);
stacks.stacks_in_74874_page2 = {};
stacks.stacks_in_74874_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2018s---4.csv', function(data) {
		$('#stacks_in_74874_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74874_page2_CSVTable').CSVToTable('resources/2018s---4.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74874_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74874_page2);
stacks.stacks_in_74875_page2 = {};
stacks.stacks_in_74875_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2018s---5.csv', function(data) {
		$('#stacks_in_74875_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74875_page2_CSVTable').CSVToTable('resources/2018s---5.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74875_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74875_page2);
stacks.stacks_in_74876_page2 = {};
stacks.stacks_in_74876_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2018s---6.csv', function(data) {
		$('#stacks_in_74876_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74876_page2_CSVTable').CSVToTable('resources/2018s---6.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74876_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74876_page2);
stacks.stacks_in_74896_page2 = {};
stacks.stacks_in_74896_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2018s---7.csv', function(data) {
		$('#stacks_in_74896_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74896_page2_CSVTable').CSVToTable('resources/2018s---7.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74896_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74896_page2);
stacks.stacks_in_74895_page2 = {};
stacks.stacks_in_74895_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2018s---8.csv', function(data) {
		$('#stacks_in_74895_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74895_page2_CSVTable').CSVToTable('resources/2018s---8.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74895_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74895_page2);
stacks.stacks_in_74877_page2 = {};
stacks.stacks_in_74877_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2018s---9.csv', function(data) {
		$('#stacks_in_74877_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74877_page2_CSVTable').CSVToTable('resources/2018s---9.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74877_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74877_page2);
stacks.stacks_in_74111_page2 = {};
stacks.stacks_in_74111_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	
		$('#stacks_in_74111_page2 > .container').parentsUntil('.stacks_top').css('overflow', 'visible');
		$('.stacks_top').css({'overflow' : 'visible'});
	
});

return stack;})(stacks.stacks_in_74111_page2);
stacks.stacks_in_74090_page2 = {};
stacks.stacks_in_74090_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	
		$('#stacks_in_74090_page2 > .container').parentsUntil('.stacks_top').css('overflow', 'visible');
		$('.stacks_top').css({'overflow' : 'visible'});
	
});

return stack;})(stacks.stacks_in_74090_page2);
stacks.stacks_in_74071_page2 = {};
stacks.stacks_in_74071_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2017j---1.csv', function(data) {
		$('#stacks_in_74071_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74071_page2_CSVTable').CSVToTable('resources/2017j---1.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74071_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74071_page2);
stacks.stacks_in_74089_page2 = {};
stacks.stacks_in_74089_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2017j---2.csv', function(data) {
		$('#stacks_in_74089_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74089_page2_CSVTable').CSVToTable('resources/2017j---2.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74089_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74089_page2);
stacks.stacks_in_74070_page2 = {};
stacks.stacks_in_74070_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2017j---3.csv', function(data) {
		$('#stacks_in_74070_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74070_page2_CSVTable').CSVToTable('resources/2017j---3.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74070_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74070_page2);
stacks.stacks_in_74095_page2 = {};
stacks.stacks_in_74095_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2017j---4.csv', function(data) {
		$('#stacks_in_74095_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74095_page2_CSVTable').CSVToTable('resources/2017j---4.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74095_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74095_page2);
stacks.stacks_in_74094_page2 = {};
stacks.stacks_in_74094_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2017j---5.csv', function(data) {
		$('#stacks_in_74094_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74094_page2_CSVTable').CSVToTable('resources/2017j---5.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74094_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74094_page2);
stacks.stacks_in_74093_page2 = {};
stacks.stacks_in_74093_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2017j---6.csv', function(data) {
		$('#stacks_in_74093_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74093_page2_CSVTable').CSVToTable('resources/2017j---6.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74093_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74093_page2);
stacks.stacks_in_74092_page2 = {};
stacks.stacks_in_74092_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2017j---7.csv', function(data) {
		$('#stacks_in_74092_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74092_page2_CSVTable').CSVToTable('resources/2017j---7.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74092_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74092_page2);
stacks.stacks_in_74096_page2 = {};
stacks.stacks_in_74096_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	
		$('#stacks_in_74096_page2 > .container').parentsUntil('.stacks_top').css('overflow', 'visible');
		$('.stacks_top').css({'overflow' : 'visible'});
	
});

return stack;})(stacks.stacks_in_74096_page2);
stacks.stacks_in_74097_page2 = {};
stacks.stacks_in_74097_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2017s---1.csv', function(data) {
		$('#stacks_in_74097_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74097_page2_CSVTable').CSVToTable('resources/2017s---1.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74097_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74097_page2);
stacks.stacks_in_74098_page2 = {};
stacks.stacks_in_74098_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2017s---2.csv', function(data) {
		$('#stacks_in_74098_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74098_page2_CSVTable').CSVToTable('resources/2017s---2.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74098_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74098_page2);
stacks.stacks_in_74099_page2 = {};
stacks.stacks_in_74099_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2017s---3.csv', function(data) {
		$('#stacks_in_74099_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74099_page2_CSVTable').CSVToTable('resources/2017s---3.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74099_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74099_page2);
stacks.stacks_in_74100_page2 = {};
stacks.stacks_in_74100_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2017s---4.csv', function(data) {
		$('#stacks_in_74100_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74100_page2_CSVTable').CSVToTable('resources/2017s---4.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74100_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74100_page2);
stacks.stacks_in_74101_page2 = {};
stacks.stacks_in_74101_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2017s---5.csv', function(data) {
		$('#stacks_in_74101_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74101_page2_CSVTable').CSVToTable('resources/2017s---5.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74101_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74101_page2);
stacks.stacks_in_74102_page2 = {};
stacks.stacks_in_74102_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2017s---6.csv', function(data) {
		$('#stacks_in_74102_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74102_page2_CSVTable').CSVToTable('resources/2017s---6.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74102_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74102_page2);
stacks.stacks_in_74103_page2 = {};
stacks.stacks_in_74103_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2017s---7.csv', function(data) {
		$('#stacks_in_74103_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74103_page2_CSVTable').CSVToTable('resources/2017s---7.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74103_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74103_page2);
stacks.stacks_in_74113_page2 = {};
stacks.stacks_in_74113_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	
		$('#stacks_in_74113_page2 > .container').parentsUntil('.stacks_top').css('overflow', 'visible');
		$('.stacks_top').css({'overflow' : 'visible'});
	
});

return stack;})(stacks.stacks_in_74113_page2);
stacks.stacks_in_74117_page2 = {};
stacks.stacks_in_74117_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	
		$('#stacks_in_74117_page2 > .container').parentsUntil('.stacks_top').css('overflow', 'visible');
		$('.stacks_top').css({'overflow' : 'visible'});
	
});

return stack;})(stacks.stacks_in_74117_page2);
stacks.stacks_in_74118_page2 = {};
stacks.stacks_in_74118_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2016j---1.csv', function(data) {
		$('#stacks_in_74118_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74118_page2_CSVTable').CSVToTable('resources/2016j---1.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74118_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74118_page2);
stacks.stacks_in_74119_page2 = {};
stacks.stacks_in_74119_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2016j---2.csv', function(data) {
		$('#stacks_in_74119_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74119_page2_CSVTable').CSVToTable('resources/2016j---2.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74119_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74119_page2);
stacks.stacks_in_74120_page2 = {};
stacks.stacks_in_74120_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2016j---3.csv', function(data) {
		$('#stacks_in_74120_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74120_page2_CSVTable').CSVToTable('resources/2016j---3.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74120_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74120_page2);
stacks.stacks_in_74121_page2 = {};
stacks.stacks_in_74121_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2016j---4.csv', function(data) {
		$('#stacks_in_74121_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74121_page2_CSVTable').CSVToTable('resources/2016j---4.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74121_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74121_page2);
stacks.stacks_in_74122_page2 = {};
stacks.stacks_in_74122_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2016j---5.csv', function(data) {
		$('#stacks_in_74122_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74122_page2_CSVTable').CSVToTable('resources/2016j---5.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74122_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74122_page2);
stacks.stacks_in_74123_page2 = {};
stacks.stacks_in_74123_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2016j---6.csv', function(data) {
		$('#stacks_in_74123_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74123_page2_CSVTable').CSVToTable('resources/2016j---6.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74123_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74123_page2);
stacks.stacks_in_74124_page2 = {};
stacks.stacks_in_74124_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2016j---7.csv', function(data) {
		$('#stacks_in_74124_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74124_page2_CSVTable').CSVToTable('resources/2016j---7.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74124_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74124_page2);
stacks.stacks_in_74129_page2 = {};
stacks.stacks_in_74129_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	
		$('#stacks_in_74129_page2 > .container').parentsUntil('.stacks_top').css('overflow', 'visible');
		$('.stacks_top').css({'overflow' : 'visible'});
	
});

return stack;})(stacks.stacks_in_74129_page2);
stacks.stacks_in_74130_page2 = {};
stacks.stacks_in_74130_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2016s---1.csv', function(data) {
		$('#stacks_in_74130_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74130_page2_CSVTable').CSVToTable('resources/2016s---1.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74130_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74130_page2);
stacks.stacks_in_74131_page2 = {};
stacks.stacks_in_74131_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2016s---2.csv', function(data) {
		$('#stacks_in_74131_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74131_page2_CSVTable').CSVToTable('resources/2016s---2.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74131_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74131_page2);
stacks.stacks_in_74132_page2 = {};
stacks.stacks_in_74132_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2016s---3.csv', function(data) {
		$('#stacks_in_74132_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74132_page2_CSVTable').CSVToTable('resources/2016s---3.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74132_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74132_page2);
stacks.stacks_in_74133_page2 = {};
stacks.stacks_in_74133_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2016s---4.csv', function(data) {
		$('#stacks_in_74133_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74133_page2_CSVTable').CSVToTable('resources/2016s---4.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74133_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74133_page2);
stacks.stacks_in_74134_page2 = {};
stacks.stacks_in_74134_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2016s---5.csv', function(data) {
		$('#stacks_in_74134_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74134_page2_CSVTable').CSVToTable('resources/2016s---5.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74134_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74134_page2);
stacks.stacks_in_74135_page2 = {};
stacks.stacks_in_74135_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2016s---6.csv', function(data) {
		$('#stacks_in_74135_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74135_page2_CSVTable').CSVToTable('resources/2016s---6.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74135_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74135_page2);
stacks.stacks_in_74136_page2 = {};
stacks.stacks_in_74136_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2016s---7.csv', function(data) {
		$('#stacks_in_74136_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74136_page2_CSVTable').CSVToTable('resources/2016s---7.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74136_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74136_page2);
stacks.stacks_in_74139_page2 = {};
stacks.stacks_in_74139_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	
		$('#stacks_in_74139_page2 > .container').parentsUntil('.stacks_top').css('overflow', 'visible');
		$('.stacks_top').css({'overflow' : 'visible'});
	
});

return stack;})(stacks.stacks_in_74139_page2);
stacks.stacks_in_74143_page2 = {};
stacks.stacks_in_74143_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	
		$('#stacks_in_74143_page2 > .container').parentsUntil('.stacks_top').css('overflow', 'visible');
		$('.stacks_top').css({'overflow' : 'visible'});
	
});

return stack;})(stacks.stacks_in_74143_page2);
stacks.stacks_in_74144_page2 = {};
stacks.stacks_in_74144_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2015j---1.csv', function(data) {
		$('#stacks_in_74144_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74144_page2_CSVTable').CSVToTable('resources/2015j---1.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74144_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74144_page2);
stacks.stacks_in_74145_page2 = {};
stacks.stacks_in_74145_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2015j---2.csv', function(data) {
		$('#stacks_in_74145_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74145_page2_CSVTable').CSVToTable('resources/2015j---2.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74145_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74145_page2);
stacks.stacks_in_74146_page2 = {};
stacks.stacks_in_74146_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2015j---3.csv', function(data) {
		$('#stacks_in_74146_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74146_page2_CSVTable').CSVToTable('resources/2015j---3.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74146_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74146_page2);
stacks.stacks_in_74147_page2 = {};
stacks.stacks_in_74147_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2015j---4.csv', function(data) {
		$('#stacks_in_74147_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74147_page2_CSVTable').CSVToTable('resources/2015j---4.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74147_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74147_page2);
stacks.stacks_in_74148_page2 = {};
stacks.stacks_in_74148_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2015j---5.csv', function(data) {
		$('#stacks_in_74148_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74148_page2_CSVTable').CSVToTable('resources/2015j---5.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74148_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74148_page2);
stacks.stacks_in_74149_page2 = {};
stacks.stacks_in_74149_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2015j---6.csv', function(data) {
		$('#stacks_in_74149_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74149_page2_CSVTable').CSVToTable('resources/2015j---6.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74149_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74149_page2);
stacks.stacks_in_74150_page2 = {};
stacks.stacks_in_74150_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2015j---7.csv', function(data) {
		$('#stacks_in_74150_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74150_page2_CSVTable').CSVToTable('resources/2015j---7.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74150_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74150_page2);
stacks.stacks_in_74155_page2 = {};
stacks.stacks_in_74155_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	
		$('#stacks_in_74155_page2 > .container').parentsUntil('.stacks_top').css('overflow', 'visible');
		$('.stacks_top').css({'overflow' : 'visible'});
	
});

return stack;})(stacks.stacks_in_74155_page2);
stacks.stacks_in_74156_page2 = {};
stacks.stacks_in_74156_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2015s---1.csv', function(data) {
		$('#stacks_in_74156_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74156_page2_CSVTable').CSVToTable('resources/2015s---1.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74156_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74156_page2);
stacks.stacks_in_74157_page2 = {};
stacks.stacks_in_74157_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2015s---2.csv', function(data) {
		$('#stacks_in_74157_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74157_page2_CSVTable').CSVToTable('resources/2015s---2.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74157_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74157_page2);
stacks.stacks_in_74158_page2 = {};
stacks.stacks_in_74158_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2015s---3.csv', function(data) {
		$('#stacks_in_74158_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74158_page2_CSVTable').CSVToTable('resources/2015s---3.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74158_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74158_page2);
stacks.stacks_in_74159_page2 = {};
stacks.stacks_in_74159_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2015s---4.csv', function(data) {
		$('#stacks_in_74159_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74159_page2_CSVTable').CSVToTable('resources/2015s---4.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74159_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74159_page2);
stacks.stacks_in_74160_page2 = {};
stacks.stacks_in_74160_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2015s---5.csv', function(data) {
		$('#stacks_in_74160_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74160_page2_CSVTable').CSVToTable('resources/2015s---5.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74160_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74160_page2);
stacks.stacks_in_74161_page2 = {};
stacks.stacks_in_74161_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2015s---6.csv', function(data) {
		$('#stacks_in_74161_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74161_page2_CSVTable').CSVToTable('resources/2015s---6.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74161_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74161_page2);
stacks.stacks_in_74162_page2 = {};
stacks.stacks_in_74162_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2015s---7.csv', function(data) {
		$('#stacks_in_74162_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74162_page2_CSVTable').CSVToTable('resources/2015s---7.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74162_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74162_page2);
stacks.stacks_in_74165_page2 = {};
stacks.stacks_in_74165_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	
		$('#stacks_in_74165_page2 > .container').parentsUntil('.stacks_top').css('overflow', 'visible');
		$('.stacks_top').css({'overflow' : 'visible'});
	
});

return stack;})(stacks.stacks_in_74165_page2);
stacks.stacks_in_74169_page2 = {};
stacks.stacks_in_74169_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	
		$('#stacks_in_74169_page2 > .container').parentsUntil('.stacks_top').css('overflow', 'visible');
		$('.stacks_top').css({'overflow' : 'visible'});
	
});

return stack;})(stacks.stacks_in_74169_page2);
stacks.stacks_in_74170_page2 = {};
stacks.stacks_in_74170_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2014j---1.csv', function(data) {
		$('#stacks_in_74170_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74170_page2_CSVTable').CSVToTable('resources/2014j---1.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74170_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74170_page2);
stacks.stacks_in_74171_page2 = {};
stacks.stacks_in_74171_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2014j---2.csv', function(data) {
		$('#stacks_in_74171_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74171_page2_CSVTable').CSVToTable('resources/2014j---2.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74171_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74171_page2);
stacks.stacks_in_74172_page2 = {};
stacks.stacks_in_74172_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2014j---3.csv', function(data) {
		$('#stacks_in_74172_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74172_page2_CSVTable').CSVToTable('resources/2014j---3.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74172_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74172_page2);
stacks.stacks_in_74173_page2 = {};
stacks.stacks_in_74173_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2014j---4.csv', function(data) {
		$('#stacks_in_74173_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74173_page2_CSVTable').CSVToTable('resources/2014j---4.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74173_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74173_page2);
stacks.stacks_in_74174_page2 = {};
stacks.stacks_in_74174_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2014j---5.csv', function(data) {
		$('#stacks_in_74174_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74174_page2_CSVTable').CSVToTable('resources/2014j---5.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74174_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74174_page2);
stacks.stacks_in_74175_page2 = {};
stacks.stacks_in_74175_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2014j---6.csv', function(data) {
		$('#stacks_in_74175_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74175_page2_CSVTable').CSVToTable('resources/2014j---6.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74175_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74175_page2);
stacks.stacks_in_74176_page2 = {};
stacks.stacks_in_74176_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2014j---7.csv', function(data) {
		$('#stacks_in_74176_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74176_page2_CSVTable').CSVToTable('resources/2014j---7.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74176_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74176_page2);
stacks.stacks_in_74181_page2 = {};
stacks.stacks_in_74181_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	
		$('#stacks_in_74181_page2 > .container').parentsUntil('.stacks_top').css('overflow', 'visible');
		$('.stacks_top').css({'overflow' : 'visible'});
	
});

return stack;})(stacks.stacks_in_74181_page2);
stacks.stacks_in_74182_page2 = {};
stacks.stacks_in_74182_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2014s---1.csv', function(data) {
		$('#stacks_in_74182_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74182_page2_CSVTable').CSVToTable('resources/2014s---1.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74182_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74182_page2);
stacks.stacks_in_74183_page2 = {};
stacks.stacks_in_74183_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2014s---2.csv', function(data) {
		$('#stacks_in_74183_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74183_page2_CSVTable').CSVToTable('resources/2014s---2.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74183_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74183_page2);
stacks.stacks_in_74184_page2 = {};
stacks.stacks_in_74184_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2014s---3.csv', function(data) {
		$('#stacks_in_74184_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74184_page2_CSVTable').CSVToTable('resources/2014s---3.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74184_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74184_page2);
stacks.stacks_in_74185_page2 = {};
stacks.stacks_in_74185_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2014s---4.csv', function(data) {
		$('#stacks_in_74185_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74185_page2_CSVTable').CSVToTable('resources/2014s---4.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74185_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74185_page2);
stacks.stacks_in_74186_page2 = {};
stacks.stacks_in_74186_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2014s---5.csv', function(data) {
		$('#stacks_in_74186_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74186_page2_CSVTable').CSVToTable('resources/2014s---5.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74186_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74186_page2);
stacks.stacks_in_74187_page2 = {};
stacks.stacks_in_74187_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2014s---6.csv', function(data) {
		$('#stacks_in_74187_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74187_page2_CSVTable').CSVToTable('resources/2014s---6.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74187_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74187_page2);
stacks.stacks_in_74188_page2 = {};
stacks.stacks_in_74188_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2014s---7.csv', function(data) {
		$('#stacks_in_74188_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74188_page2_CSVTable').CSVToTable('resources/2014s---7.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74188_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74188_page2);
stacks.stacks_in_74191_page2 = {};
stacks.stacks_in_74191_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	
		$('#stacks_in_74191_page2 > .container').parentsUntil('.stacks_top').css('overflow', 'visible');
		$('.stacks_top').css({'overflow' : 'visible'});
	
});

return stack;})(stacks.stacks_in_74191_page2);
stacks.stacks_in_74195_page2 = {};
stacks.stacks_in_74195_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	
		$('#stacks_in_74195_page2 > .container').parentsUntil('.stacks_top').css('overflow', 'visible');
		$('.stacks_top').css({'overflow' : 'visible'});
	
});

return stack;})(stacks.stacks_in_74195_page2);
stacks.stacks_in_74196_page2 = {};
stacks.stacks_in_74196_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2013j---1.csv', function(data) {
		$('#stacks_in_74196_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74196_page2_CSVTable').CSVToTable('resources/2013j---1.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74196_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74196_page2);
stacks.stacks_in_74197_page2 = {};
stacks.stacks_in_74197_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2013j---2.csv', function(data) {
		$('#stacks_in_74197_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74197_page2_CSVTable').CSVToTable('resources/2013j---2.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74197_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74197_page2);
stacks.stacks_in_74198_page2 = {};
stacks.stacks_in_74198_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2013j---3.csv', function(data) {
		$('#stacks_in_74198_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74198_page2_CSVTable').CSVToTable('resources/2013j---3.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74198_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74198_page2);
stacks.stacks_in_74199_page2 = {};
stacks.stacks_in_74199_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2013j---4.csv', function(data) {
		$('#stacks_in_74199_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74199_page2_CSVTable').CSVToTable('resources/2013j---4.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74199_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74199_page2);
stacks.stacks_in_74200_page2 = {};
stacks.stacks_in_74200_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2013j---5.csv', function(data) {
		$('#stacks_in_74200_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74200_page2_CSVTable').CSVToTable('resources/2013j---5.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74200_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74200_page2);
stacks.stacks_in_74207_page2 = {};
stacks.stacks_in_74207_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	
		$('#stacks_in_74207_page2 > .container').parentsUntil('.stacks_top').css('overflow', 'visible');
		$('.stacks_top').css({'overflow' : 'visible'});
	
});

return stack;})(stacks.stacks_in_74207_page2);
stacks.stacks_in_74208_page2 = {};
stacks.stacks_in_74208_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2013s---1.csv', function(data) {
		$('#stacks_in_74208_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74208_page2_CSVTable').CSVToTable('resources/2013s---1.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74208_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74208_page2);
stacks.stacks_in_74209_page2 = {};
stacks.stacks_in_74209_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2013s---2.csv', function(data) {
		$('#stacks_in_74209_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74209_page2_CSVTable').CSVToTable('resources/2013s---2.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74209_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74209_page2);
stacks.stacks_in_74210_page2 = {};
stacks.stacks_in_74210_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2013s---3.csv', function(data) {
		$('#stacks_in_74210_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74210_page2_CSVTable').CSVToTable('resources/2013s---3.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74210_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74210_page2);
stacks.stacks_in_74211_page2 = {};
stacks.stacks_in_74211_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2013s---4.csv', function(data) {
		$('#stacks_in_74211_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74211_page2_CSVTable').CSVToTable('resources/2013s---4.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74211_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74211_page2);
stacks.stacks_in_74212_page2 = {};
stacks.stacks_in_74212_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(function() {

	$.get('resources/2013s---5.csv', function(data) {
		$('#stacks_in_74212_page2_CSVSource').html('<pre>' + data + '</pre>');
	});

	$('#stacks_in_74212_page2_CSVTable').CSVToTable('resources/2013s---5.csv', {
		loadingText: '<i class="fa fa-refresh fa-spin"></i> Loading Data...',
		tableClass: 'table table-bordered  table-hover table-striped',
		theadClass: '',
		tbodyClass: 'text-xs-left ',
		thClass: 'header',
		startLine: 0
	}).bind("loadComplete",function() {
		$('#stacks_in_74212_page2_CSVTable').find('TABLE').tablesorter();
	});;
});

return stack;})(stacks.stacks_in_74212_page2);
stacks.stacks_in_73577_page2 = {};
stacks.stacks_in_73577_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;// jQuery Extra Selectors - (c) Keith Clark freely distributable under the terms of the MIT license.
// twitter.com/keithclarkcouk
// www.keithclark.co.uk

(function($) {
  function getNthIndex(cur, dir) {
    var t = cur, idx = 0;
    while (cur = cur[dir] ) {
      if (t.tagName == cur.tagName) {
        idx++;
      }
    }
    return idx;
  }
  function isNthOf(elm, pattern, dir) {
    var position = getNthIndex(elm, dir), loop;
    if (pattern == "odd" || pattern == "even") {
      loop = 2;
      position -= !(pattern == "odd");
    } else {
      var nth = pattern.indexOf("n");
      if (nth > -1) {
        loop = parseInt(pattern, 10) || parseInt(pattern.substring(0, nth) + "1", 10);
        position -= (parseInt(pattern.substring(nth + 1), 10) || 0) - 1;
      } else {
        loop = position + 1;
        position -= parseInt(pattern, 10) - 1;
      }
    }
    return (loop<0 ? position<=0 : position >= 0) && position % loop == 0
  }
  var pseudos = {
    "first-of-type": function(elm) {
      return getNthIndex(elm, "previousSibling") == 0;
    },
    "last-of-type": function(elm) {
      return getNthIndex(elm, "nextSibling") == 0;
    },
    "only-of-type": function(elm) {
      return pseudos["first-of-type"](elm) && pseudos["last-of-type"](elm);
    },
    "nth-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "previousSibling");
    },
    "nth-last-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "nextSibling");
    }
  }
  $.extend($.expr[':'], pseudos);
}(jQuery));

$(document).ready(function($) {

  var $animSpeed = 500;

  $('#accordion_stacks_in_73577_page2 > .accordion > div:last-of-type > div > dt').addClass('accordionLastDt');
  $('#accordion_stacks_in_73577_page2 > .accordion > div:last-of-type > div > dd').addClass('accordionLastDd');
  $('#accordion_stacks_in_73577_page2 > .accordion > div:first-of-type > div > dt').addClass('accordionFirstDt');
  $('#accordion_stacks_in_73577_page2 > .accordion > div > div > dt').addClass('accordionIconOff').addClass('animateOn');

  $('#accordion_stacks_in_73577_page2 > .accordion div div dd').hide();
  $('#accordion_stacks_in_73577_page2 > .dropDown1 > div:first-of-type > div dd').slideDown($animSpeed).addClass("accordionOpen");;
  $('#accordion_stacks_in_73577_page2 > .dropDown1 > div:first-of-type > div dt:first-child > a').addClass('selected').parent().addClass('selected');
  $('#accordion_stacks_in_73577_page2 > .accordion div div dt a.accordionSlide').click(function(){
    if ($(this).hasClass('selected')) {
      $(this).removeClass('selected').parent().removeClass('selected');
      $(this).parent().next().slideUp($animSpeed).removeClass("accordionOpen");
    } else {
      $('#accordion_stacks_in_73577_page2 > .accordion div div dt a.accordionSlide').removeClass('selected').parent().removeClass('selected');
      $(this).addClass('selected').parent().addClass('selected');
      $('#accordion_stacks_in_73577_page2 > .accordion div div dd').slideUp($animSpeed).removeClass("accordionOpen");
      $(this).parent().next().slideDown($animSpeed).addClass("accordionOpen");
    }
    return false; // Prevents default - stops anchor tag from firing
  });

  $('#accordion_stacks_in_73577_page2 dd').addClass('clearfix');
  $('#accordion_stacks_in_73577_page2').parent().css ({
    'padding':'1px'
  });

  //URL ?article=3 open
  var article = location.search.split('article=')[1];
  if (article >= 0 ) {
    $("#accordion_stacks_in_73577_page2 dl div:nth-child("+article+") a").trigger("click");
  }

});
//#accordion_stacks_in_73577_page2 remove .nonTouch if touch device
$(window).on("touchstart", function(ev) {
  $("#accordion_stacks_in_73577_page2").removeClass("nonTouch");
});


return stack;})(stacks.stacks_in_73577_page2);
stacks.stacks_in_72630_page2 = {};
stacks.stacks_in_72630_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_72630_page2);
stacks.stacks_in_73286_page2 = {};
stacks.stacks_in_73286_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_73286_page2);
stacks.stacks_in_73782_page2 = {};
stacks.stacks_in_73782_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_73782_page2);
stacks.stacks_in_73775_page2 = {};
stacks.stacks_in_73775_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;

return stack;})(stacks.stacks_in_73775_page2);
stacks.stacks_in_73642_page2 = {};
stacks.stacks_in_73642_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;// jQuery Extra Selectors - (c) Keith Clark freely distributable under the terms of the MIT license.
// twitter.com/keithclarkcouk
// www.keithclark.co.uk

(function($) {
  function getNthIndex(cur, dir) {
    var t = cur, idx = 0;
    while (cur = cur[dir] ) {
      if (t.tagName == cur.tagName) {
        idx++;
      }
    }
    return idx;
  }
  function isNthOf(elm, pattern, dir) {
    var position = getNthIndex(elm, dir), loop;
    if (pattern == "odd" || pattern == "even") {
      loop = 2;
      position -= !(pattern == "odd");
    } else {
      var nth = pattern.indexOf("n");
      if (nth > -1) {
        loop = parseInt(pattern, 10) || parseInt(pattern.substring(0, nth) + "1", 10);
        position -= (parseInt(pattern.substring(nth + 1), 10) || 0) - 1;
      } else {
        loop = position + 1;
        position -= parseInt(pattern, 10) - 1;
      }
    }
    return (loop<0 ? position<=0 : position >= 0) && position % loop == 0
  }
  var pseudos = {
    "first-of-type": function(elm) {
      return getNthIndex(elm, "previousSibling") == 0;
    },
    "last-of-type": function(elm) {
      return getNthIndex(elm, "nextSibling") == 0;
    },
    "only-of-type": function(elm) {
      return pseudos["first-of-type"](elm) && pseudos["last-of-type"](elm);
    },
    "nth-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "previousSibling");
    },
    "nth-last-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "nextSibling");
    }
  }
  $.extend($.expr[':'], pseudos);
}(jQuery));

$(document).ready(function($) {

  var $animSpeed = 500;

  $('#accordion_stacks_in_73642_page2 > .accordion > div:last-of-type > div > dt').addClass('accordionLastDt');
  $('#accordion_stacks_in_73642_page2 > .accordion > div:last-of-type > div > dd').addClass('accordionLastDd');
  $('#accordion_stacks_in_73642_page2 > .accordion > div:first-of-type > div > dt').addClass('accordionFirstDt');
  $('#accordion_stacks_in_73642_page2 > .accordion > div > div > dt').addClass('accordionIconOff').addClass('animateOn');

  $('#accordion_stacks_in_73642_page2 > .accordion div div dd').hide();
  $('#accordion_stacks_in_73642_page2 > .dropDown1 > div:first-of-type > div dd').slideDown($animSpeed).addClass("accordionOpen");;
  $('#accordion_stacks_in_73642_page2 > .dropDown1 > div:first-of-type > div dt:first-child > a').addClass('selected').parent().addClass('selected');
  $('#accordion_stacks_in_73642_page2 > .accordion div div dt a.accordionSlide').click(function(){
    if ($(this).hasClass('selected')) {
      $(this).removeClass('selected').parent().removeClass('selected');
      $(this).parent().next().slideUp($animSpeed).removeClass("accordionOpen");
    } else {
      $('#accordion_stacks_in_73642_page2 > .accordion div div dt a.accordionSlide').removeClass('selected').parent().removeClass('selected');
      $(this).addClass('selected').parent().addClass('selected');
      $('#accordion_stacks_in_73642_page2 > .accordion div div dd').slideUp($animSpeed).removeClass("accordionOpen");
      $(this).parent().next().slideDown($animSpeed).addClass("accordionOpen");
    }
    return false; // Prevents default - stops anchor tag from firing
  });

  $('#accordion_stacks_in_73642_page2 dd').addClass('clearfix');
  $('#accordion_stacks_in_73642_page2').parent().css ({
    'padding':'1px'
  });

  //URL ?article=3 open
  var article = location.search.split('article=')[1];
  if (article >= 0 ) {
    $("#accordion_stacks_in_73642_page2 dl div:nth-child("+article+") a").trigger("click");
  }

});
//#accordion_stacks_in_73642_page2 remove .nonTouch if touch device
$(window).on("touchstart", function(ev) {
  $("#accordion_stacks_in_73642_page2").removeClass("nonTouch");
});


return stack;})(stacks.stacks_in_73642_page2);
stacks.stacks_in_72782_page2 = {};
stacks.stacks_in_72782_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;// jQuery Extra Selectors - (c) Keith Clark freely distributable under the terms of the MIT license.
// twitter.com/keithclarkcouk
// www.keithclark.co.uk

(function($) {
  function getNthIndex(cur, dir) {
    var t = cur, idx = 0;
    while (cur = cur[dir] ) {
      if (t.tagName == cur.tagName) {
        idx++;
      }
    }
    return idx;
  }
  function isNthOf(elm, pattern, dir) {
    var position = getNthIndex(elm, dir), loop;
    if (pattern == "odd" || pattern == "even") {
      loop = 2;
      position -= !(pattern == "odd");
    } else {
      var nth = pattern.indexOf("n");
      if (nth > -1) {
        loop = parseInt(pattern, 10) || parseInt(pattern.substring(0, nth) + "1", 10);
        position -= (parseInt(pattern.substring(nth + 1), 10) || 0) - 1;
      } else {
        loop = position + 1;
        position -= parseInt(pattern, 10) - 1;
      }
    }
    return (loop<0 ? position<=0 : position >= 0) && position % loop == 0
  }
  var pseudos = {
    "first-of-type": function(elm) {
      return getNthIndex(elm, "previousSibling") == 0;
    },
    "last-of-type": function(elm) {
      return getNthIndex(elm, "nextSibling") == 0;
    },
    "only-of-type": function(elm) {
      return pseudos["first-of-type"](elm) && pseudos["last-of-type"](elm);
    },
    "nth-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "previousSibling");
    },
    "nth-last-of-type": function(elm, i, match) {
      return isNthOf(elm, match[3], "nextSibling");
    }
  }
  $.extend($.expr[':'], pseudos);
}(jQuery));

$(document).ready(function($) {

  var $animSpeed = 500;

  $('#accordion_stacks_in_72782_page2 > .accordion > div:last-of-type > div > dt').addClass('accordionLastDt');
  $('#accordion_stacks_in_72782_page2 > .accordion > div:last-of-type > div > dd').addClass('accordionLastDd');
  $('#accordion_stacks_in_72782_page2 > .accordion > div:first-of-type > div > dt').addClass('accordionFirstDt');
  $('#accordion_stacks_in_72782_page2 > .accordion > div > div > dt').addClass('accordionIconOff').addClass('animateOn');

  $('#accordion_stacks_in_72782_page2 > .accordion div div dd').hide();
  $('#accordion_stacks_in_72782_page2 > .dropDown1 > div:first-of-type > div dd').slideDown($animSpeed).addClass("accordionOpen");;
  $('#accordion_stacks_in_72782_page2 > .dropDown1 > div:first-of-type > div dt:first-child > a').addClass('selected').parent().addClass('selected');
  $('#accordion_stacks_in_72782_page2 > .accordion div div dt a.accordionSlide').click(function(){
    if ($(this).hasClass('selected')) {
      $(this).removeClass('selected').parent().removeClass('selected');
      $(this).parent().next().slideUp($animSpeed).removeClass("accordionOpen");
    } else {
      $('#accordion_stacks_in_72782_page2 > .accordion div div dt a.accordionSlide').removeClass('selected').parent().removeClass('selected');
      $(this).addClass('selected').parent().addClass('selected');
      $('#accordion_stacks_in_72782_page2 > .accordion div div dd').slideUp($animSpeed).removeClass("accordionOpen");
      $(this).parent().next().slideDown($animSpeed).addClass("accordionOpen");
    }
    return false; // Prevents default - stops anchor tag from firing
  });

  $('#accordion_stacks_in_72782_page2 dd').addClass('clearfix');
  $('#accordion_stacks_in_72782_page2').parent().css ({
    'padding':'1px'
  });

  //URL ?article=3 open
  var article = location.search.split('article=')[1];
  if (article >= 0 ) {
    $("#accordion_stacks_in_72782_page2 dl div:nth-child("+article+") a").trigger("click");
  }

});
//#accordion_stacks_in_72782_page2 remove .nonTouch if touch device
$(window).on("touchstart", function(ev) {
  $("#accordion_stacks_in_72782_page2").removeClass("nonTouch");
});


return stack;})(stacks.stacks_in_72782_page2);
stacks.stacks_in_74800_page2 = {};
stacks.stacks_in_74800_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;




return stack;})(stacks.stacks_in_74800_page2);
stacks.stacks_in_74801_page2 = {};
stacks.stacks_in_74801_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
  
});

return stack;})(stacks.stacks_in_74801_page2);
stacks.stacks_in_74803_page2 = {};
stacks.stacks_in_74803_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
  
});

return stack;})(stacks.stacks_in_74803_page2);
stacks.stacks_in_74805_page2 = {};
stacks.stacks_in_74805_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
  
});

return stack;})(stacks.stacks_in_74805_page2);
stacks.stacks_in_74807_page2 = {};
stacks.stacks_in_74807_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
  
});

return stack;})(stacks.stacks_in_74807_page2);
stacks.stacks_in_74809_page2 = {};
stacks.stacks_in_74809_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	$('body').on('click','#stacks_in_74809_page2 .content_switcher_setter_1',function(e){
		stacks.ContentSwitcher.cont_switch("spolka1", "1",false, 500);
		
	});
	if(false){
        $('body').on('mouseenter','#stacks_in_74809_page2 .content_switcher_setter_1',function(e){
			stacks.ContentSwitcher.cont_switch("spolka1", "1",false, 500);
		});
		if(true){
			$('body').on('mouseleave','#stacks_in_74809_page2 .content_switcher_setter_1',function(e){
				stacks.ContentSwitcher.cont_switch("spolka1", "0",false, 500);
			});
		}
    }
});


return stack;})(stacks.stacks_in_74809_page2);
stacks.stacks_in_74810_page2 = {};
stacks.stacks_in_74810_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	

var ContentSwitcher_stacks_in_74810_page2 = (function(){

// LOCAL GLOBAL OBJECT
var ContentSwitcher = {};

// GLOBAL FUNCTIONS
ContentSwitcher.globals = (function(){
	//if (typeof stacks.ContentSwitcher == 'undefined') {
		stacks.ContentSwitcher = {};

		stacks.ContentSwitcher.cont_switch = function(target,i,fade, fadeDuration){
			var show_blocks = i.split('_');
			if(fade){
				$('.'+target+' > .content_switcher').hide();
				for ( var b = 0; b < show_blocks.length; b++){
					$('.'+target+' > .content_switcher_'+show_blocks[b]).stop(true, false).fadeIn({duration:fadeDuration});
				}
		
			}
			else{
				$('.'+target+' > .content_switcher').hide();
				for ( var b = 0; b < show_blocks.length; b++){
					$('.'+target+' > .content_switcher_'+show_blocks[b]).show();
				}
			}
			var cs = $('.'+target+' > .content_switcher_'+i+' .content_scroller').data('jsp');
			if(cs){
				cs.reinitialise();
			}
			if( $('#stacks_in_74810_page2').find('.masonry').length > 0 && typeof(stacks.Bricks.reload) == 'function' ){
				stacks.Bricks.reload();
			}
		};
	//}
})();

// LOCAL GLOBAL VARIABLES
var thisID = 'stacks_in_74810_page2';

// FUNCTIONS CALLS


})();

if(!false){
	$('#stacks_in_74810_page2 .content_switcher_0').show();	
}

var hash = window.location.hash;
if (hash.length > 0){
	var hashArray = hash.substr(1).split('&');
	for( elem in hashArray ){
		var kvStr = hashArray[elem];
		if(kvStr != undefined){
			var kv = kvStr.split('-');
			if ( kv[0] == 'cs'){
				stacks.ContentSwitcher.cont_switch(kv[1]+"", kv[2]+"",false);
			}
		}
		
	}
}
	
})
return stack;})(stacks.stacks_in_74810_page2);
stacks.stacks_in_74811_page2 = {};
stacks.stacks_in_74811_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
  
});

return stack;})(stacks.stacks_in_74811_page2);
stacks.stacks_in_74813_page2 = {};
stacks.stacks_in_74813_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
  
});

return stack;})(stacks.stacks_in_74813_page2);
stacks.stacks_in_74814_page2 = {};
stacks.stacks_in_74814_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
  
});

return stack;})(stacks.stacks_in_74814_page2);
stacks.stacks_in_74818_page2 = {};
stacks.stacks_in_74818_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	$('body').on('click','#stacks_in_74818_page2 .content_switcher_setter_1',function(e){
		stacks.ContentSwitcher.cont_switch("spolka2", "1",false, 500);
		
	});
	if(false){
        $('body').on('mouseenter','#stacks_in_74818_page2 .content_switcher_setter_1',function(e){
			stacks.ContentSwitcher.cont_switch("spolka2", "1",false, 500);
		});
		if(true){
			$('body').on('mouseleave','#stacks_in_74818_page2 .content_switcher_setter_1',function(e){
				stacks.ContentSwitcher.cont_switch("spolka2", "0",false, 500);
			});
		}
    }
});


return stack;})(stacks.stacks_in_74818_page2);
stacks.stacks_in_74819_page2 = {};
stacks.stacks_in_74819_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	

var ContentSwitcher_stacks_in_74819_page2 = (function(){

// LOCAL GLOBAL OBJECT
var ContentSwitcher = {};

// GLOBAL FUNCTIONS
ContentSwitcher.globals = (function(){
	//if (typeof stacks.ContentSwitcher == 'undefined') {
		stacks.ContentSwitcher = {};

		stacks.ContentSwitcher.cont_switch = function(target,i,fade, fadeDuration){
			var show_blocks = i.split('_');
			if(fade){
				$('.'+target+' > .content_switcher').hide();
				for ( var b = 0; b < show_blocks.length; b++){
					$('.'+target+' > .content_switcher_'+show_blocks[b]).stop(true, false).fadeIn({duration:fadeDuration});
				}
		
			}
			else{
				$('.'+target+' > .content_switcher').hide();
				for ( var b = 0; b < show_blocks.length; b++){
					$('.'+target+' > .content_switcher_'+show_blocks[b]).show();
				}
			}
			var cs = $('.'+target+' > .content_switcher_'+i+' .content_scroller').data('jsp');
			if(cs){
				cs.reinitialise();
			}
			if( $('#stacks_in_74819_page2').find('.masonry').length > 0 && typeof(stacks.Bricks.reload) == 'function' ){
				stacks.Bricks.reload();
			}
		};
	//}
})();

// LOCAL GLOBAL VARIABLES
var thisID = 'stacks_in_74819_page2';

// FUNCTIONS CALLS


})();

if(!false){
	$('#stacks_in_74819_page2 .content_switcher_0').show();	
}

var hash = window.location.hash;
if (hash.length > 0){
	var hashArray = hash.substr(1).split('&');
	for( elem in hashArray ){
		var kvStr = hashArray[elem];
		if(kvStr != undefined){
			var kv = kvStr.split('-');
			if ( kv[0] == 'cs'){
				stacks.ContentSwitcher.cont_switch(kv[1]+"", kv[2]+"",false);
			}
		}
		
	}
}
	
})
return stack;})(stacks.stacks_in_74819_page2);
stacks.stacks_in_74820_page2 = {};
stacks.stacks_in_74820_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
  
});

return stack;})(stacks.stacks_in_74820_page2);
stacks.stacks_in_74822_page2 = {};
stacks.stacks_in_74822_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
  
});

return stack;})(stacks.stacks_in_74822_page2);
stacks.stacks_in_74823_page2 = {};
stacks.stacks_in_74823_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
  
});

return stack;})(stacks.stacks_in_74823_page2);
stacks.stacks_in_74828_page2 = {};
stacks.stacks_in_74828_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	$('body').on('click','#stacks_in_74828_page2 .content_switcher_setter_1',function(e){
		stacks.ContentSwitcher.cont_switch("spolka3", "1",false, 500);
		
	});
	if(false){
        $('body').on('mouseenter','#stacks_in_74828_page2 .content_switcher_setter_1',function(e){
			stacks.ContentSwitcher.cont_switch("spolka3", "1",false, 500);
		});
		if(true){
			$('body').on('mouseleave','#stacks_in_74828_page2 .content_switcher_setter_1',function(e){
				stacks.ContentSwitcher.cont_switch("spolka3", "0",false, 500);
			});
		}
    }
});


return stack;})(stacks.stacks_in_74828_page2);
stacks.stacks_in_74829_page2 = {};
stacks.stacks_in_74829_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
	

var ContentSwitcher_stacks_in_74829_page2 = (function(){

// LOCAL GLOBAL OBJECT
var ContentSwitcher = {};

// GLOBAL FUNCTIONS
ContentSwitcher.globals = (function(){
	//if (typeof stacks.ContentSwitcher == 'undefined') {
		stacks.ContentSwitcher = {};

		stacks.ContentSwitcher.cont_switch = function(target,i,fade, fadeDuration){
			var show_blocks = i.split('_');
			if(fade){
				$('.'+target+' > .content_switcher').hide();
				for ( var b = 0; b < show_blocks.length; b++){
					$('.'+target+' > .content_switcher_'+show_blocks[b]).stop(true, false).fadeIn({duration:fadeDuration});
				}
		
			}
			else{
				$('.'+target+' > .content_switcher').hide();
				for ( var b = 0; b < show_blocks.length; b++){
					$('.'+target+' > .content_switcher_'+show_blocks[b]).show();
				}
			}
			var cs = $('.'+target+' > .content_switcher_'+i+' .content_scroller').data('jsp');
			if(cs){
				cs.reinitialise();
			}
			if( $('#stacks_in_74829_page2').find('.masonry').length > 0 && typeof(stacks.Bricks.reload) == 'function' ){
				stacks.Bricks.reload();
			}
		};
	//}
})();

// LOCAL GLOBAL VARIABLES
var thisID = 'stacks_in_74829_page2';

// FUNCTIONS CALLS


})();

if(!false){
	$('#stacks_in_74829_page2 .content_switcher_0').show();	
}

var hash = window.location.hash;
if (hash.length > 0){
	var hashArray = hash.substr(1).split('&');
	for( elem in hashArray ){
		var kvStr = hashArray[elem];
		if(kvStr != undefined){
			var kv = kvStr.split('-');
			if ( kv[0] == 'cs'){
				stacks.ContentSwitcher.cont_switch(kv[1]+"", kv[2]+"",false);
			}
		}
		
	}
}
	
})
return stack;})(stacks.stacks_in_74829_page2);
stacks.stacks_in_74830_page2 = {};
stacks.stacks_in_74830_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
  
});

return stack;})(stacks.stacks_in_74830_page2);
stacks.stacks_in_74832_page2 = {};
stacks.stacks_in_74832_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
  
});

return stack;})(stacks.stacks_in_74832_page2);
stacks.stacks_in_74833_page2 = {};
stacks.stacks_in_74833_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
  
});

return stack;})(stacks.stacks_in_74833_page2);
stacks.stacks_in_74839_page2 = {};
stacks.stacks_in_74839_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
  
});

return stack;})(stacks.stacks_in_74839_page2);
stacks.stacks_in_74069_page2 = {};
stacks.stacks_in_74069_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;// Set Language for Document
document.documentElement.lang = "pl";

$(document).ready(function(){
  
    $('body').addClass('foundry-typeface-two');
  

  
    $('body').addClass('foundry-typeface-one-page-wide-headers');
  
});

$.fn.elementRealHeight = function () {
   $clone = this.clone()
       .css("visibility","hidden")
       .appendTo($('body'));
   var $height = $clone.outerHeight();
   $clone.remove();
   return $height;
 };

 $.fn.elementRealWidth = function () {
    $clone = this.clone()
        .css("visibility","hidden")
        .appendTo($('body'));
    var $width = $clone.outerWidth();
    $clone.remove();
    return $width;
  };


  // Handles offsets for anchor tags
  // (function(document, history, location) {
  //   var HISTORY_SUPPORT = !!(history && history.pushState);
  //
  //   var anchorScrolls = {
  //     ANCHOR_REGEX: /^#[^ ]+$/,
  //     OFFSET_HEIGHT_PX: 0,
  //
  //     /**
  //      * Establish events, and fix initial scroll position if a hash is provided.
  //      */
  //     init: function() {
  //       this.scrollToCurrent();
  //       window.addEventListener('hashchange', this.scrollToCurrent.bind(this));
  //       document.body.addEventListener('click', this.delegateAnchors.bind(this));
  //     },
  //
  //     /**
  //      * Return the offset amount to deduct from the normal scroll position.
  //      * Modify as appropriate to allow for dynamic calculations
  //      */
  //     getFixedOffset: function() {
  //       return this.OFFSET_HEIGHT_PX;
  //     },
  //
  //     /**
  //      * If the provided href is an anchor which resolves to an element on the
  //      * page, scroll to it.
  //      * @param  {String} href
  //      * @return {Boolean} - Was the href an anchor.
  //      */
  //     scrollIfAnchor: function(href, pushToHistory) {
  //       var match, rect, anchorOffset;
  //
  //       if(!this.ANCHOR_REGEX.test(href)) {
  //         return false;
  //       }
  //
  //       match = document.getElementById(href.slice(1));
  //
  //       if(match) {
  //         rect = match.getBoundingClientRect();
  //         anchorOffset = window.pageYOffset + rect.top - this.getFixedOffset();
  //         window.scrollTo(window.pageXOffset, anchorOffset);
  //
  //         // Add the state to history as-per normal anchor links
  //         if(HISTORY_SUPPORT && pushToHistory) {
  //           history.pushState({}, document.title, location.pathname + href);
  //         }
  //       }
  //
  //       return !!match;
  //     },
  //
  //     /**
  //      * Attempt to scroll to the current location's hash.
  //      */
  //     scrollToCurrent: function() {
  //       this.scrollIfAnchor(window.location.hash);
  //     },
  //
  //     /**
  //      * If the click event's target was an anchor, fix the scroll position.
  //      */
  //     delegateAnchors: function(e) {
  //       var elem = e.target;
  //
  //       if(
  //         elem.nodeName === 'A' &&
  //         this.scrollIfAnchor(elem.getAttribute('href'), true)
  //       ) {
  //         e.preventDefault();
  //       }
  //     }
  //   };
  //
  //   window.addEventListener(
  //     'DOMContentLoaded', anchorScrolls.init.bind(anchorScrolls)
  //   );
  // })(window.document, window.history, window.location);

return stack;})(stacks.stacks_in_74069_page2);
stacks.stacks_in_74285_page2 = {};
stacks.stacks_in_74285_page2 = (function(stack) {
var jQuery = stacks.jQuery;var $ = jQuery;$(document).ready(function(){
});

return stack;})(stacks.stacks_in_74285_page2);