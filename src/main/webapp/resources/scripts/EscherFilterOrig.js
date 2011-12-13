
var ajaxRequests = [];

/**
 * changes sorting of content (up/down) of a specific sort option
 *
 * @param fieldName
 *            sort option, which should be changed
 * @param contentDivName
 *            name of div where content is loaded
 */
function changeSortOfFilter(fieldName, contentDivName){
	var linkElement = $("a[name=\""+fieldName+"\"]");
	if (linkElement.hasClass("up")){
		linkElement.removeClass("up").addClass("down");
		linkElement.attr("title", "Aufsteigend sortieren");
	} else {
		linkElement.removeClass("down").addClass("up");
		linkElement.attr("title", "Absteigend sortieren");
	}
	requestSortedFilteredLetters(contentDivName, null)
}

/**
 * shows sorted and filtered letters in content div using jQuery
 *
 * @param contentDivName
 * @param keywordNumber index of the latest selected keyword selector
 */
function requestSortedFilteredLetters(contentDivName, keywordNumber){
	var i = 0;
    for(i = 0; ajaxRequests.length >= i; i++){
		if(ajaxRequests[i]){
			ajaxRequests[i].abort();
		}
	}
	//Fix ajax requests was never cleared after abort, would make sense
	//to avoid long term client side speed issues
	ajaxRequests = [];



	//existingAjaxRequest.abort();

	var parameter = [];
	var validation = true;
	// hide keyword selectors:
	// first keyword selector = index 0; second = index 1; ...
	// hide all keywords  with an higher index than the latest selected
	if(keywordNumber == null){
 		keywordNumber = 0;
 	}


	//var flagFirst = 0;
	// get parameter of Sorts
	var arrFilter = new Array("sortcrit1", "sortcrit2", "sortcrit3");
 	var parameterValue = null;
    for(i = 0; i < arrFilter.length; i++ ) {
 		parameterValue = $("#"+arrFilter[i]).val();
 		if (parameterValue != "default" && parameterValue != ""){
	    	//parameter += "&";
 			var parameterSort =  arrFilter[i] + "=" + parameterValue;

 			// add up or down to sort
 			var linkElement = $("a[name=\""+arrFilter[i]+"\"]");
 			var parameterSortValue = (linkElement.hasClass("up")) ? "&sortvalue" + (i+1) + "=asc" : "&sortvalue" + (i+1) + "=desc";

 			parameter.push( parameterSort + parameterSortValue);
 		}
 	}

	// get parameter of Filters
	arrFilter = new Array("correspondent", "keyword1", "keyword2", "keyword3");
 	for(i = 0; i < arrFilter.length; i++ ) {
 		parameterValue = $("#"+arrFilter[i]).val();
 		if (parameterValue != "default" && parameterValue != ""){
 		    //parameter += "&";
 		    if(arrFilter[i] != "correspondent"){
 		    	if($("#rolle").val() == "a"){
 		    		parameter.push( "author=" + $("#correspondent").val());
 		    		//parameter += "&";
 		    	}
 		    	if($("#rolle").val() == "e"){
 		    		parameter.push( "addressee=" + $("#correspondent").val());
 		    		//parameter += "&";
 		    	}
 		    	console.log(parameterValue);
 		    	if(arrFilter[i] == "keyword1" || arrFilter[i] == "keyword2" || arrFilter[i] == "keyword3"){
 		    		if(parameterValue != null){
 		    			parameter.push( arrFilter[i] + "=" + parameterValue);
 		    			//parameter += "&";
 		    		}
 		    	}
 		    }else{

 		    	if(parameterValue != null){
 		    		parameter.push( arrFilter[i] + "=" + parameterValue);
 		    	}
 		    }
 		}
 	}

	// get parameter of datepicker
 	var arrFilterDates = new Array("datemin", "datemax");
	//var month = new Array("01", "02", "03", "04", "05", "06", "08", "09", "10", "11", "12");
 	for(i = 0; i < arrFilterDates.length; i++ ) {
 		var dateValue = $( "#" + arrFilterDates[i]).val();//.datepicker( "getDate" );
 		if (dateValue != null && dateValue.length != 0){
		    //parameter += "&";

		    $( "#" + arrFilterDates[i]).css("color","black");
		    var dateSplit = dateValue.split(".");
	    	if(dateSplit.length == 1){

				if(arrFilterDates[i] == "datemin"){
					dateValue = "01.01."+dateValue;
				    $("#datemin").val(dateValue);
					dateSplit = dateValue.split(".");
				}
				if(arrFilterDates[i] == "datemax"){
					dateValue = "31.12."+(dateValue);
					$("#datemax").val(dateValue);
					dateSplit = dateValue.split(".");
				}
			}else{
				if(arrFilterDates[i] == "datemin"){
				    $("#datemin").val(dateValue);
				}
				if(arrFilterDates[i] == "datemax"){
					$("#datemax").val(dateValue);
				}
			}

		    if(!isValidDate(dateValue)) {
		    	if($( "#" + arrFilterDates[i]).val() != "jjjj oder tt.mm.jjjj"){
			    	$( "#" + arrFilterDates[i]).val("jjjj oder tt.mm.jjjj");
			    	$( "#" + arrFilterDates[i]).css("color","red");
			    	validation = false;
		    	}
		    }else{
				if (dateSplit[0].length < 2) {
					dateSplit[0] = "0"+dateSplit[0];
				}
				if (dateSplit[1].length < 2) {
					dateSplit[1] = "0"+dateSplit[1];
				}
			    parameter.push(arrFilterDates[i] + "=" + dateSplit[2] +  "-" + dateSplit[1] + "-" + dateSplit[0]);
		    }
		}
	}

 	//delete & if its in the beginning
 	//parameter = parameter.replace(/^&/, "");

 	// load new page only with new request parameters
 	//if((window.location.hash != "#"+parameter) || window.location.hash == "" ){
 		// load letters
 		//ajaxRequest(contentDivName, "briefe-auswahl", parameter);

 	 	// set parameters in hash for deep linking
 		if(!validation){
 			return false;
 		}else{
 			window.location.hash = parameter.join("&");
 		}
 //	}
 	//ajaxRequest("filterBoxContent", "filterbox", parameter);
 	initializeFilterBox("filterContent");
}

/**
 * checks if date is valid
 *
 * @param dateValid
 */
function isValidDate(s) {
	  var bits = s.split('.');
	  if(bits[2].length != 4){return false;}
	  var d = new Date(bits[2] + '/' + bits[1] + '/' + bits[0]);
	  return !!(d && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[0]));
}

/**
 * get new keyword selection new via ajax request
 *
 * @param keywordNumber
 */

var updateTimer = null;

function addKeywordsViaAjax(keywordNumber) {
	var vars = getUrlVars();
	var param = [];
	var selected = "";
	var selectState = "";
	if(vars["correspondent"]){
		param.push("correspondent="+vars["correspondent"]);
	}
	if(vars["datemin"]){
		param.push("datemin="+vars["datemin"]);
	}
	if(vars["datemax"]){
		param.push("datemax="+vars["datemax"]);
	}
    if(vars["author"]){
		param.push("author="+vars["author"]);
	}
    if(vars["addressee"]){
        param.push("addressee="+vars["addressee"]);
    }

	if(vars["keyword1"] && keywordNumber > 1){
		param.push("keyword1="+vars["keyword1"]);
	}
	if(vars["keyword2"] && keywordNumber > 2){
		param.push("keyword2="+vars["keyword2"]);
	}
	if(vars["keyword1"] && keywordNumber == 1){
		selected = vars["keyword1"];
	}
	if(vars["keyword2"] && keywordNumber == 2){
		selected = vars["keyword2"];
	}
	if(vars["keyword3"] && keywordNumber == 3){
		selected = vars["keyword3"];
	}
	$("#keyword"+keywordNumber+" option").remove();

	var ajaxRequestKeywords = $.ajax( {
		url : "ajax.php?seite=keywords-genjson&" + param.join("&"),
		dataType: "json",
		cache : true,
		beforeSend : function(){
		$("#divkeyword"+(keywordNumber)).append("<"+"center id=\"loader"+keywordNumber+"\"><img src=\""+ BASE_FOLDER + "img/ajax-loader.gif\"/></center>");
		$("#keyword"+(keywordNumber)).hide();
		$("#divkeyword"+(keywordNumber)).show();
		},
		success : function(data) {
			var state;
			var alreadySelected = {};
			//for(var cnt = 0; cnt < 3; cnt++) {
			//	var keywordValue = $("#keyword"+cnt).val() || null;
			//	if(!!keywordValue) {
			//		alreadySelected[keywordValue] = true;
			//	}
			//}
			if(updateTimer) clearTimeout(updateTimer);
			$.each(data, function(i, val) {
	    		$("#loader"+(keywordNumber)).remove();
	    		if(val["available"] == "NO"/* || alreadySelected[val["content"]]*/){state = "disable-choice";}
	    		if(val["content"] == selected/* && !alreadySelected[val["content"]]*/){selectState = "selected=\"selected\"";}
	    		$("#keyword"+(keywordNumber)).append("<option class=\"keyword "+state+"\" value=\""+val["content"]+"\" "+selectState+">"+val["content"]+"</option>\n");
	    		state ="";
	    		selectState ="";
    		});
			setTimeout(function() {
				var disable = function(identifier) {
					if(selectedValue) {
						$("#"+identifier+" option").each(function(elem) {
							if($(this).val() == selectedValue) $(this).addClass("disable-choice");
						});
					}
				};

				var selectedValue = $("#keyword1").val();
				disable("keyword2");
				disable("keyword3");
				selectedValue = $("#keyword2").val();
				disable("keyword1");
				disable("keyword3");
				selectedValue = $("#keyword3").val();
				disable("keyword2");
				disable("keyword1");

			}, 300);
	    	$("#keyword"+(keywordNumber)).show();
		}
	});
	ajaxRequests.push(ajaxRequestKeywords);
}


/**
 * get new korrespondent selection new via ajax request
 *
 * @param keywordNumber
 */



/**
 * load initial letters from URI hash
 */
function initializeFilterBox(contentDivName){

	var vars = getUrlVars();

	if(vars["sortvalue1"] == "asc"){
		$("a[name=\"sortcrit1\"]").removeClass("down").addClass("up");
		$("a[name=\"sortcrit1\"]").attr("title", "Absteigend sortieren");
	}else if (vars["sortvalue1"] == "desc") {
		$("a[name=\"sortcrit1\"]").removeClass("up").addClass("down");
		$("a[name=\"sortcrit1\"]").attr("title", "Aufsteigend sortieren");
	}

	if(vars["sortvalue2"] == "asc"){
		$("a[name=\"sortcrit2\"]").removeClass("down").addClass("up");
		$("a[name=\"sortcrit2\"]").attr("title", "Absteigend sortieren");
	}else if (vars["sortvalue2"] == "desc") {
		$("a[name=\"sortcrit2\"]").removeClass("up").addClass("down");
		$("a[name=\"sortcrit2\"]").attr("title", "Aufsteigend sortieren");
	}

	if(vars["sortvalue3"] == "asc"){
		$("a[name=\"sortcrit3\"]").removeClass("down").addClass("up");
		$("a[name=\"sortcrit3\"]").attr("title", "Absteigend sortieren");
	}else if (vars["sortvalue3"] == "desc") {
		$("a[name=\"sortcrit3\"]").removeClass("up").addClass("down");
		$("a[name=\"sortcrit3\"]").attr("title", "Aufsteigend sortieren");
	}

    var parameter = null;
	if(window.location.hash.substring(1) == ""){
		//calling a new request with default parameters causes problems in IE8.0 (but NOT in IE 6.0 ...)
		//REMOVED: requestSortedFilteredLetters(contentDivName, null);
		//FIX: because of IE 8.0 bug, static parameter string
		parameter = "sortcrit1=period&sortvalue1=asc&sortcrit2=author&sortvalue2=asc&sortcrit3=addressee&sortvalue3=asc";
	}else{
		parameter = window.location.hash.substring(1);
	}


	var ajaxRequestLetterlist = $.ajax( {
		url : BASE_FOLDER + "ajax.php?seite=briefe-auswahl&" + parameter,
		cache : true,
		beforeSend: function() {
			$("#filterContent").fadeTo(500, 0.5);
			$("#filterContent").prepend("<center><img src=\""+ BASE_FOLDER + "img/ajax-loader.gif\"/></center>");
	    },
		success : function(html) {
			 $("#filterContent").empty();
			 $("#filterContent").append(html);
			 $("#filterContent").fadeTo(500, 1);
		}
	});
	ajaxRequests.push(ajaxRequestLetterlist);





		//var vars = getUrlVars();
		var paramCorr = "";
		if(vars["correspondent"]){
			paramCorr += "correspondent="+vars["correspondent"]+"&";
		}
		if(vars["datemin"]){
			paramCorr += "datemin="+vars["datemin"]+"&";
		}
		if(vars["datemax"]){
			paramCorr += "datemax="+vars["datemax"]+"&";
		}
		if(vars["keyword1"]){
			paramCorr += "keyword1="+vars["keyword1"]+"&";
		}
		if(vars["keyword2"]){
			paramCorr += "keyword2="+vars["keyword2"]+"&";
		}
		if(vars["keyword3"]){
			paramCorr += "keyword3="+vars["keyword3"]+"&";
		}
		//$("#keyword"+keywordNumber+" option").remove();
		var ajaxRequestCorrespondents = $.ajax( {
			url : "ajax.php?seite=correspondents-genjson&" + paramCorr,
			dataType: "json",
			cache : true,
			beforeSend : function(){
				$("#correspondent").hide();
				$(".autocompleteBody").append("<center><img src=\""+ BASE_FOLDER + "img/ajax-loader.gif\"/></center>");
			},
			success : function(data) {
				$(".autocompleteBody center").remove();
				$( "#correspondent" ).catcomplete({
					delay: 400,
					minLength: 0,
					source: data,
					close: function(event, ui) { requestSortedFilteredLetters('filterContent'); }
				})
				.focus(function() { $(this).catcomplete("search", ""); });
				//.hasClass("flickEscher")
					setStyleWithDivAroundClass("ui-autocomplete");
				$("#correspondent").show();
			}
		});
		ajaxRequests.push(ajaxRequestCorrespondents);

	$("#divkeyword2").hide();
	$("#divkeyword3").hide();
	addKeywordsViaAjax(1);
	if(vars["keyword1"]){
		addKeywordsViaAjax(2);
		//$("#divkeyword2").show();
	}
	if(vars["keyword2"]){
		addKeywordsViaAjax(3);
		//$("#divkeyword3").show();
	}

}
/**
 * gets array of parameters out of URL
 */
function getUrlVars(){
	var vars = [], hash;
    var hashes = window.location.hash.substring(1).slice(window.location.hash.substring(1).indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);

        vars[hash[0]] = hash[1];
    }
    return vars;

}
/**
 * parses the URI after the Hash
 *
 * @return array of key/values pairs
 */
function parseHashURI() {
    // get the URI and remove the hash
    var uri = window.location.hash.substring(1);
    // parse the data
    var elements = uri.split('&');
    // the Object that will have the data
    var data = new Object();
    // do a for loop
    for(var i = 0; i < elements.length; i++) {
        // split the element to item -> value format
        var cur = elements[i].split('=');
        // append the element to the list
        data[cur[0]] = cur[1];
    }
    // return the result
    return data;
}
/**
 * reset datefields on click
 *
 * parameter: id
 */
function resetDateField(id){
	$(id).click(
			function(){
				$(this).val('');
			}
		).focusout(function(){
			if($(this).val() == ""){
				$(this).val('jjjj oder tt.mm.jjjj');
				requestSortedFilteredLetters("filterContent", null)
			}
		});
}

/**
 * wrap div around element to initialize "flick"-style
 */
function setStyleWithDivAroundDiv(element){
	$("#"+element).wrap("<div class=\"flickEscher\"></div>");
	$("#"+element).css("display", "none");
}

/**
 * wrap div around element to initialize "flick"-style
 */
function setStyleWithDivAroundClass(element){
	$("."+element).wrapAll("<div class=\"flickEscher\"></div>");
	$("."+element).css("display", "none");
}


/**
 * initialize and set default values for the datepicker fields
 *
 * @param divIdFrom
 *            range from
 * @param divIdTo
 *            range to
 */
/*function initializeDatepickerRange(divIdFrom, divIdTo, searchView){
	$(function() {
		var dates = $( "#" + divIdFrom + ", #" + divIdTo ).datepicker({
			// TODO "retrieve min/max date"!
			minDate: new Date(1830, 1 - 1, 1),
			maxDate: new Date(1883, 1 - 1, 1),
			defaultDate: new Date(1850, 3 - 1, 9),
			changeMonth: true,
			changeYear: true,
			yearRange: '1800:1950',
			onSelect: function( selectedDate ) {
				var option = this.id == divIdFrom ? "minDate" : "maxDate",
					instance = $( this ).data( "datepicker" ),
					date = $.datepicker.parseDate(
						instance.settings.dateFormat ||
						$.datepicker._defaults.dateFormat,
						selectedDate, instance.settings );
				dates.not( this ).datepicker( "option", option, date );
				if(searchView != null && searchView == true){
					refreshSearchView();
				} else{
					requestSortedFilteredLetters("filterContent");
				}
			}
		});
	});

	// set language to german
	$.datepicker.regional[ "de" ];

	setTimeout('setStyleWithDivAroundDiv("ui-datepicker-div")',100);
}*/

/**
 * initialize and set default values for the datepicker fields
 *
 * @param divId
 */
/*function initializeDatepickerSingle(divId, searchView){
	$(function() {
		$( "#"+divId ).datepicker({
			// TODO "retrieve min/max date"!
			minDate: new Date(1830, 1 - 1, 1),
			maxDate: new Date(1883, 1 - 1, 1),
			defaultDate: new Date(1850, 3 - 1, 9),
			changeMonth: true,
			changeYear: true,
			yearRange: '1800:1950',
			onSelect: function( selectedDate ) {
				if(searchView != null && searchView == true){
					refreshSearchView();
				} else{
					requestSortedFilteredLetters("filterContent");
				}
			}
		});
	});

	// set language to german
	$.datepicker.regional[ "de" ];

	setTimeout('setStyleWithDivAroundDiv("ui-datepicker-div")',100);
}
*/



































/*----------------------------------------------------------------------------------------*/
/*--------------------------------!! SEARCH PAGE !! --------------------------------------*/
/*----------------------------------------------------------------------------------------*/
/**
 * load initial letters from URI hash
 */
function initializeSearchFilterBox(){
	$("#searchField").keyup(function(event){
		  if(event.keyCode == 13){
		    $("#searchFieldButton").click();
		  }
		});

	if(window.location.hash.substring(1) == ""){
		refreshSearchView();
	}else{
		loadContentSearchView(window.location.hash.substring(1), true)
	}
	$("#divkeyword2").hide();
	$("#divkeyword3").hide();

	setTimeout('setStyleWithDivAroundClass("ui-autocomplete")',100);
}

/**
 * goes through every constraining field and does an ajax request for loading the content
 * (if not checked = toggled)
 *
 */
function loadContentSearchView(parameter, force){
	//check first if something is in the "searchField"
	var searchFieldValue = jQuery.trim($("#searchField").val());
	if(searchFieldValue != "" || force) {
		arrDivIds = new Array("searchContentLetter","searchContentComment","searchContentBiography","searchContentChronology","searchContentPlace","searchContentBibliography");
	 	arrViews = new Array("letter","comment","biography","chronology","place","bibliography");

		//get parameter of Constraints
		arrCons = new Array("cletters", "ccomments", "cbiographies", "cchronology", "cplaces", "cbibliography");
	 	for(var i = 0; i < arrCons.length; i++ ) {
	 		if($("#"+arrCons[i]+":checked").val() == "on"){
	 			ajaxRequest(arrDivIds[i], "suche-auswahl", parameter + "&view="+arrViews[i]);
	 		} else {
	 			ajaxRequest(arrDivIds[i], "suche-auswahl", parameter + "&view="+arrViews[i]+"&toggle=on");
	 		}
	 	}
	}
}

/**
 * requests every field of the form and puts it into the parameter string
 * then calls the loading of filtered results in the content divs
 *
 * @param force if true -> force reload of results
 * @param keywordNumber index of highest keyword div to show
 */
function refreshSearchView(force, keywordNumber){
	var parameter = [];
    var i = 0;
	// hide keyword selectors:
	// first keyword selector = index 0; second = index 1; ...
	// hide all keywords with an higher index than the latest selected
	if(keywordNumber == null){
 		keywordNumber = 0;
 	}
	$("#divkeyword"+(keywordNumber+1)).hide();
	$("#divkeyword"+(keywordNumber+2)).hide();
	$("#divkeyword"+(keywordNumber+3)).hide();
	$("#keyword"+(keywordNumber+1)+"> option[class=keyword]").remove();
	$("#keyword"+(keywordNumber+2)+"> option[class=keyword]").remove();
	$("#keyword"+(keywordNumber+3)+"> option[class=keyword]").remove();

	//get parameter of search in checkboxes
	var arrSearchIn = new Array("stext", "sperson", "splace", "sdate","srailway");
 	for(i = 0; i < arrSearchIn.length; i++ ) {
 		if($("#"+arrSearchIn[i]+":checked").val() != undefined){
 			parameter.push( arrSearchIn[i] + "=on");
 		}
 	}

	// get parameter of Filters
	var arrFilter = new Array(	"searchField",
							"fperson", "fplace",
							"origin", "status", "letternumber", "correspondent",
							"keyword1", "keyword2", "keyword3");
 	for(i = 0; i < arrFilter.length; i++ ) {
 		var parameterValue = $("#"+arrFilter[i]).val();
 		if (parameterValue != "default" && parameterValue != ""){
 			parameter.push(arrFilter[i] + "=" + parameterValue);
 		}
 	}

	// get parameter of datepicker
 	var arrFilterDates = new Array("fdate", "datemin", "datemax");
	var month = new Array("01", "02", "03", "04", "05", "06", "08", "09", "10", "11", "12");

 	for(i = 0; i < arrFilterDates.length; i++ ) {
 		var dateValue = $( "#" + arrFilterDates[i]).datepicker( "getDate" );
 		if (dateValue != null && dateValue.length != 0){
		    //parameter += "&";

		    // database wants date format = "YYYY-MM-DD"
			var day = dateValue.getDate();

			if (day < 10) {
				day = "0"+day;
			}
			parameter.push(arrFilterDates[i] + "=" + dateValue.getFullYear() +  "-" + month[dateValue.getMonth()] + "-" + day);
		}
	}

 	//delete & if its in the beginning
 	//parameter = parameter.replace(/^&/, "");

 	// load new page only with new request parameters
 	parameter = parameter.join("&");
 	if((window.location.hash != "#"+parameter) || window.location.hash == "" || force){
	 	loadContentSearchView(parameter, force);
 	 	// set parameters in hash for deep linking
 		window.location.hash = parameter;
 	}

 	if($("#keyword"+keywordNumber).val() != "default"){
 		addKeywordsViaAjax(keywordNumber+1);
		if(keywordNumber == 0){
			$("#divkeyword"+(keywordNumber+1)).show();
		} else {
			$("#divkeyword"+(keywordNumber+1)).show("blind");
		}
	}
}





