/**
 *
 * Class: CWN2.Util
 *
 * Namespace contenente metodi di utilità
 *
 *
 */

Ext.define("CWN2.Util", {

    singleton: true,

    /**
     *  Function: getUrlParam
     *
     *  Ritorna il valore di un parametro nella queryString
     *
     *  Parameters:
     *  paramName - {String} Nome del parametro
     *
     *  Retur     *
     */
    getUrlParam: function(paramName) {
        var results = new RegExp("[\\?&]" + paramName + "=([^&#]*)").exec(window.location.href);
        return results ? decodeURIComponent(results[1]) : null;
    },

    /**
     *  Function: assert
     *
     *  Assert per i controlli.
     *
     *  Controlla che l'espressione passata sia vera, altrimenti effettua la throw dell'errore
     *
     *  Parameters:
     *  test - {Expression} Condizione da verificare
     *  error - {Object} Oggetto errore
     *
     */
    assert: function(condition, error) {
        if (!condition) {
            throw error;
        }
    },

    /**
     * Function: handleException
     *
     * Gestione exception
     *
     * Parameters:
     * exception - {Object} Oggetto exception
     * exception level:
     * - 0 = warning (non viene mandato messaggio all'utente
     * - 1 = errore
     * - 2 = errore bloccante
     *
     */
    handleException: function(exception) {
        CWN2.Util.log(exception.message, exception.level);
        (exception.level > 0) ? CWN2.Util.msgBox(exception.message, "ERROR") : null;
    },

    /**
     *  Function: log
     *
     *  Scrive un messaggio sulla console
     *
     *  Parameters:
     *  msg - {String} Messaggio da scrivere
     *  level:
     * - undefined = info
     * - 0 = warn
     * - 1/2 = error
     *
     */
    log: function(message, level) {
        if (!CWN2.Globals.debug) {
            return;
        }

        var action;
        switch (level) {
            case 0:
                action = "warn";
                break;
            case 1:
            case 2:
                action = "error";
                break;
            default:
                action = "info";
        }

        try {
            console[action](message);
        } catch (e) {
        }
    },

    /**
     *  Function: msgBox
     *
     *  Manda un alert di avviso all'utente
     *
     *  Parameters:
     *  msg - {string} Messaggio da scrivere sull'alert
     *
     */
    msgBox: function(msg, type, title) {
        var icon = (type) ? Ext.Msg[type] : Ext.Msg.INFO;
        var titolo = (title) || "Info";
        Ext.Msg.show({
            title: titolo,
            msg: msg,
            icon: icon,
            buttons: Ext.Msg.OK
        });
    },

    /**
     * Function: ajaxRequest
     *
     * Funzione per effettuare una richiesta XmlHTTP.
     *
     * Ritorna un oggetto javascript contentente la deserializzazione del json
     * oppure un documento xml
     *
     * Parameters:
     * options - {Object} oggetto di configurazione
     *  - type - {String}
     *  - url - {String} Url del file o del servizio
     *  - urlParams - {Object} Oggetto contenente i parametri da passare.
     *  - callBack {Function} Funzione da richiamare dopo il caricamento
     *  - args - {Array} Array di argomenti da passare alla funzione di callback
     *
     * Returns:
     * {object/xmlDoc} L'oggetto contenente la deserializzazione del JSON o il document XML
     *
     */
    ajaxRequest: function(options) {
        var type = options.type,
            url = options.url,
            urlParams = options.urlParams,
            callBack = options.callBack,
            args = options.args,
            jsonData = options.jsonData,
            exception = {};

        function success(response, opts) {
            var data;
            CWN2.app.removeLoadingScreen(100);
            switch (type) {
                case "JSONP":
                    data = response;
                    break;
                case "JSON":
                    data = Ext.JSON.decode(response.responseText, true);
                    break;
                case "XML":
                    // Utilizzo metodo seguente invece di utilizzare response.responseXml perchè
                    // IE10 non riconosce il documento creato come documento XML e non applica la
                    // xslTransform
                    if (window.ActiveXObject) {
                        data = new ActiveXObject("Microsoft.XMLDOM");
                        data.async = "false";
                        data.loadXML(response.responseText);
                    } else {
                        data = new DOMParser().parseFromString(response.responseText, "text/xml");
                    }
                    //data = response.responseXML;
                    break;
            }
            if (!data) {
                if (type === "XML") {
                    exception.message = "CWN2.Util.ajaxRequest - la risposta del server non sembra un documento xml. \nControllare contentType della risposta \n(deve essere text/xml o application/xml ";
                } else {
                    exception.message = "CWN2.Util.ajaxRequest - " + response.responseText;
                }
                exception.level = 2;
                CWN2.Util.handleException(exception);
                return;
            }
            if (!options.disableException && data.success === false) {
                exception.message = data.message;
                exception.level = 2;
                CWN2.Util.handleException(exception);
                return;
            }
            callBack(data, response, args);
        }

        function failure(response, opts) {
            CWN2.app.removeLoadingScreen(100);
            var exception = {};
            exception.message = response.responseText;
            exception.level = 2;
            CWN2.Util.handleException(exception);
        }

        var requestOptions = {
            url: url,
            params: urlParams,
            success: success,
            failure: failure,
            jsonData: jsonData
        };

        if (type === "JSONP") {
            Ext.data.JsonP.request(requestOptions);
        } else {
            requestOptions.headers = {'Content-Type': 'application/json; charset=UTF-8'};
//            if (CWN2.Globals.RUOLO && CWN2.Globals.RUOLO !== 'PUBBLICO') {
//                requestOptions.headers['x-codutente'] = CWN2.Globals.RUOLO;
//            }
            Ext.Ajax.request(requestOptions);
        }
    },

    /**
     * Function: parseXML
     *
     * Funzione per fare il parsing di una stringa xml
     *
     * Ritorna un oggetto doc xml
     *
     * Parameters:
     * xmlString - {String} Stringa xml
     *
     * Returns:
     * {object} Oggetto xmlDoc
     *
     */
    parseXML: function(xmlString) {

        CWN2.Util.log("CWN2.Util.parseXML");
        try {
            var xmlDoc = null;
            if (window.DOMParser && window.XSLTProcessor) {
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(xmlString, "text/xml");
            } else {
                xmlDoc = new ActiveXObject("Msxml2.DOMDocument.3.0");
                xmlDoc.async = false;
                xmlDoc.loadXML(xmlString);

            }
            return xmlDoc;
        } catch (exception) {
            throw {
                name: "xmlTransformation",
                message: "CWN2.Util.parseXml: errore parsing xml - " + exception.message,
                level: 1
            };
        }
    },

    /**
     * Function: transformStrBounds
     *
     * Trasforma un bound in forma string da un sistema di coordinate ad un altro
     *
     * Parameters:
     * fromProjStr - {string} Codice EPSG del sistema di coordinate di partenza (es: "EPSG:3003")
     * toProjStr - {string} Codice EPSG del sistema di coordinate di arrivo
     *
     * Returns:
     * {string} Stringa del bound con coordinate separate da virgole
     *
     */
    transformStrBounds: function(fromProjStr, toProjStr, boundsStr) {

        CWN2.Util.log("CWN2.Util.transformStrBounds");

        if (fromProjStr === toProjStr) {
            return boundsStr;
        }

        var fromProj = new OpenLayers.Projection(fromProjStr),
            toProj = new OpenLayers.Projection(toProjStr);

        var boundStrIn = boundsStr;
        // Hack per shift lungo asse x e y
        if (fromProjStr === "EPSG:3003") {
            var boundArray = boundStrIn.split(",");
            boundArray[0] = parseInt(boundArray[0]) - parseInt(40);
            boundArray[2] = parseInt(boundArray[2]) - parseInt(40);
            boundArray[1] = parseInt(boundArray[1]) + parseInt(120);
            boundArray[3] = parseInt(boundArray[3]) + parseInt(120);
            boundStrIn = boundArray.join(",");
        }
        var bounds = new OpenLayers.Bounds.fromString(boundStrIn);
        return bounds.transform(fromProj, toProj).toString();

    },

    /**
     * Function: getArrayElementByAttribute
     *
     * Ritorna un elemento di un array contenente un attributo con un determinato valore
     *
     * Parameters:
     * array - {Array} array su cui cercare l'elemento
     * attributo - {string} Nome dell'attributo dell'elemento
     * value - {string} Valore dell'attributo
     *
     * Returns:
     * {Object} Oggetto
     *
     */
    getArrayElementByAttribute: function(array, attribute, value) {
        if (!array) {
            return null;
        }

        var len = array.length;

        for (var i = 0; i < len; i++) {
            if (array[i][attribute] === value) {
                return array[i];
            }
        }
        return null;
    },

    capitalizeString: function (str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    },

    endsWith: function (str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    },

    /**
     * Function: geoCode
     *
     * Effettua il geocode di un indirizzo utilizzando i servizi google
     *
     * Parameters:
     * address - {string} Indirizzo
     * properties - {Object} oggetto contenente le proprietà da aggiungere all'oggetto properties della feature
     * callback - {function} funzione di callback
     *
     * Returns:
     * {GeoJSON Object}
     *
     */
    geoCode: function(address, properties, callback) {
        new google.maps.Geocoder().geocode({ "address": address }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                var x = results[0].geometry.location.lng();
                var y = results[0].geometry.location.lat();
                var feature = {
                    "type": "FeatureCollection",
                    "features": [
                        { "type": "Feature",
                            "geometry": {"type": "Point", "coordinates": [x, y]},
                            "properties": {
                                "address": address
                            }
                        }
                    ]
                };
                if (properties) {
                    for (var p in properties) {
                        if (properties.hasOwnProperty(p)) {
                            feature.features[0].properties[p] = properties[p];
                        }
                    }
                }
                callback(feature);
            } else {
                if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
                    CWN2.Util.msgBox("Indirizzo '" + address + "' non trovato");
                } else {
                    CWN2.Util.handleException({
                        name: "BadGeocoding",
                        message: "Errore di geocoding: " + status,
                        level: 1
                    });
                }
            }
        });
    },


    /**
     * Function: getXmlDoc
     *
     * Effettua il parsing di una stringa xml e ritorna un doc xml
     *
     * Parameters:
     * xmlString - {string} Stringa xml
     *
     * Returns:
     * {xml doc}
     *
     */
    getXmlDoc: function(xmlString) {
        var doc;
        if(window.ActiveXObject){
            doc = new ActiveXObject("Microsoft.XMLDOM");
            doc.async = "false";
            doc.loadXML(xmlString);
        }else{
            doc = new DOMParser().parseFromString(xmlString,"text/xml");
        }
        return doc;
    },


    /**
     * Function: transformFilterCQL2json
     *
     * Trasforma una stringa cql un oggetto filtro json
     *
     * Parameters:
     * cqlFilterStr - {string} Stringa cql
     *
     * Returns:
     * {oggetto filtro}
     *
     */
    transformFilterCQL2json: function(cqlFilterStr) {
        var cqlFilter = new OpenLayers.Format.CQL().read(cqlFilterStr);
        var xmlFilter = new OpenLayers.Format.Filter.v1_0_0().write(cqlFilter);
        var xmlString = xmlFilter.innerHTML.replace(/ogc:/g, "");
        return new X2JS().xml_str2json(xmlString);
    },

    /**
     * Function: transformFilterJson2CQL
     *
     * Trasforma un oggetto filtro json in una stringa cql
     *
     * Parameters:
     * jsonFilter - filtro
     *
     * Returns:
     * {stringa cql}
     *
     */
    transformFilterJson2CQL: function(jsonFilter) {
        function traverse(o ) {
            for (i in o) {
                if (typeof(o[i])=="object") {
                    console.log(i, o[i])
                    traverse(o[i] );
                }
            }
        }

        var xmlFilter = new X2JS().json2xml(jsonFilter);
        var ogcFilter = new OpenLayers.Format.Filter.v1_1_0().read(xmlFilter);
        // hack per risolvere baco OpenLayers: valori numerici letterali vengono convertiti in numero (es: "08" --> 8)
        //ogcFilter.value = jsonFilter.Literal;
        var cqlFilter = new OpenLayers.Format.CQL().write(ogcFilter);
        return cqlFilter;
    },


/**
     * Function: unescapeHtmlEntities
     *
     * Decodifica caratteri html da una stringa contenente caratteri speciali codificati :
     * &amp; (&)
     * &quot; (")
     * &lt; (<)
     * &gt; (>)
     *
     * Parameters:
     * encodedString - {String} Stringa da decodificare
     *
     * Returns:
     * {String} - Stringa decodificata
     *
     * */
    unescapeHtmlEntities: function(encodedString) {
        encodedString = encodedString.replace(/\&amp;/g, '&');
        encodedString = encodedString.replace(/\&quot;/g, '\"');
        encodedString = encodedString.replace(/\&lt;/g, '<');
        encodedString = encodedString.replace(/\&gt;/g, '>');
        return encodedString;
    },

    // Funzione per il decode di html
    htmlDecode: function(string, quote_style) {

        function get_html_translation_table(table, quote_style) {
            var entities = {},
                hash_map = {},
                decimal;
            var constMappingTable = {},
                constMappingQuoteStyle = {};
            var useTable = {},
                useQuoteStyle = {};

            // Translate arguments
            constMappingTable[0] = 'HTML_SPECIALCHARS';
            constMappingTable[1] = 'HTML_ENTITIES';
            constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
            constMappingQuoteStyle[2] = 'ENT_COMPAT';
            constMappingQuoteStyle[3] = 'ENT_QUOTES';

            useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
            useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';

            if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
                throw new Error("Table: " + useTable + ' not supported');
                // return false;
            }

            entities['38'] = '&amp;';
            if (useTable === 'HTML_ENTITIES') {
                entities['160'] = '&nbsp;';
                entities['161'] = '&iexcl;';
                entities['162'] = '&cent;';
                entities['163'] = '&pound;';
                entities['164'] = '&curren;';
                entities['165'] = '&yen;';
                entities['166'] = '&brvbar;';
                entities['167'] = '&sect;';
                entities['168'] = '&uml;';
                entities['169'] = '&copy;';
                entities['170'] = '&ordf;';
                entities['171'] = '&laquo;';
                entities['172'] = '&not;';
                entities['173'] = '&shy;';
                entities['174'] = '&reg;';
                entities['175'] = '&macr;';
                entities['176'] = '&deg;';
                entities['177'] = '&plusmn;';
                entities['178'] = '&sup2;';
                entities['179'] = '&sup3;';
                entities['180'] = '&acute;';
                entities['181'] = '&micro;';
                entities['182'] = '&para;';
                entities['183'] = '&middot;';
                entities['184'] = '&cedil;';
                entities['185'] = '&sup1;';
                entities['186'] = '&ordm;';
                entities['187'] = '&raquo;';
                entities['188'] = '&frac14;';
                entities['189'] = '&frac12;';
                entities['190'] = '&frac34;';
                entities['191'] = '&iquest;';
                entities['192'] = '&Agrave;';
                entities['193'] = '&Aacute;';
                entities['194'] = '&Acirc;';
                entities['195'] = '&Atilde;';
                entities['196'] = '&Auml;';
                entities['197'] = '&Aring;';
                entities['198'] = '&AElig;';
                entities['199'] = '&Ccedil;';
                entities['200'] = '&Egrave;';
                entities['201'] = '&Eacute;';
                entities['202'] = '&Ecirc;';
                entities['203'] = '&Euml;';
                entities['204'] = '&Igrave;';
                entities['205'] = '&Iacute;';
                entities['206'] = '&Icirc;';
                entities['207'] = '&Iuml;';
                entities['208'] = '&ETH;';
                entities['209'] = '&Ntilde;';
                entities['210'] = '&Ograve;';
                entities['211'] = '&Oacute;';
                entities['212'] = '&Ocirc;';
                entities['213'] = '&Otilde;';
                entities['214'] = '&Ouml;';
                entities['215'] = '&times;';
                entities['216'] = '&Oslash;';
                entities['217'] = '&Ugrave;';
                entities['218'] = '&Uacute;';
                entities['219'] = '&Ucirc;';
                entities['220'] = '&Uuml;';
                entities['221'] = '&Yacute;';
                entities['222'] = '&THORN;';
                entities['223'] = '&szlig;';
                entities['224'] = '&agrave;';
                entities['225'] = '&aacute;';
                entities['226'] = '&acirc;';
                entities['227'] = '&atilde;';
                entities['228'] = '&auml;';
                entities['229'] = '&aring;';
                entities['230'] = '&aelig;';
                entities['231'] = '&ccedil;';
                entities['232'] = '&egrave;';
                entities['233'] = '&eacute;';
                entities['234'] = '&ecirc;';
                entities['235'] = '&euml;';
                entities['236'] = '&igrave;';
                entities['237'] = '&iacute;';
                entities['238'] = '&icirc;';
                entities['239'] = '&iuml;';
                entities['240'] = '&eth;';
                entities['241'] = '&ntilde;';
                entities['242'] = '&ograve;';
                entities['243'] = '&oacute;';
                entities['244'] = '&ocirc;';
                entities['245'] = '&otilde;';
                entities['246'] = '&ouml;';
                entities['247'] = '&divide;';
                entities['248'] = '&oslash;';
                entities['249'] = '&ugrave;';
                entities['250'] = '&uacute;';
                entities['251'] = '&ucirc;';
                entities['252'] = '&uuml;';
                entities['253'] = '&yacute;';
                entities['254'] = '&thorn;';
                entities['255'] = '&yuml;';
            }

            if (useQuoteStyle !== 'ENT_NOQUOTES') {
                entities['34'] = '&quot;';
            }
            if (useQuoteStyle === 'ENT_QUOTES') {
                entities['39'] = '&#39;';
            }
            entities['60'] = '&lt;';
            entities['62'] = '&gt;';

            // ascii decimals to real symbols
            for (decimal in entities) {
                if (entities.hasOwnProperty(decimal)) {
                    hash_map[String.fromCharCode(decimal)] = entities[decimal];
                }
            }

            return hash_map;
        }

        var hash_map = {},
            symbol = '',
            tmp_str = '',
            entity = '';
        tmp_str = string.toString();

        if (false === (hash_map = get_html_translation_table('HTML_ENTITIES', quote_style))) {
            return false;
        }

        // fix &amp; problem
        // http://phpjs.org/functions/get_html_translation_table:416#comment_97660
        delete(hash_map['&']);
        hash_map['&'] = '&amp;';

        for (symbol in hash_map) {
            entity = hash_map[symbol];
            tmp_str = tmp_str.split(entity).join(symbol);
        }
        tmp_str = tmp_str.split('&#039;').join("'");
        tmp_str = t_str.split('&#39;').join("'");

        return tmp_str;
    }


});
