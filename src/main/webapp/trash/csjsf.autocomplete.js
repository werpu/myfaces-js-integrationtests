/*
 * Copyright (C) 2012 CREDIT SUISSE IT - <developmentsupport.jsf@credit-suisse.com>
 *
 * All Rights reserved.
 *
 * This software is the proprietary information of CREDIT SUISSE Technology and
 * Operations. Use is subject to license and non-disclosure terms.
 */
(function(jQuery) {

    jQuery.widget("ui.csJsfAutoComplete", {

        options : {
            preventRequest : false,
            minQueryLength : 0,
            keyupDelay : 250,
            arrowImageWidth : 18,
            autoCompleteHoverClassName : "hoverRowClass",
            inProgressClass : "inProgress",
            autoCompleteArrow : true,
            reRender : "",
            ignoreChars: "",
            fireFilterActionOnKeyEnter: false
        },

        init : function() {
            this.bindEvents();
            
            jsf.ajax.addOnError(this.errorHandler);

            var widget = this;
            //register afterResponse event handler
            var afterResponse = function(data) {
                if (data.status == "success") {
                    //only call afterResponse when reRendering is finished
                    //and dom is ready to use
                    widget.afterResponse(data);
                }
            };
            jsf.ajax.addOnEvent(afterResponse);
        },

        bindEvents: function() {
            var widget = this;
            this.element.keypress(function(event) {
                //prevent submit on enter hit
                var keyCode = csGetKC(event);
                if(keyCode == 13) {
                	if (widget.options.fireFilterActionOnKeyEnter) {
                		jQuery('[id$="_filterOn"]').click();
                	}
            		return false;                	
                }
            });

            this.element.blur(function(event) {
            	// do not close when clicking on scroll bar (IE6 hack)
            	if (jQuery.browser.msie) {
	            	var clickedElement = document.activeElement;
                    // check autocompleteResults for web style 2.0 and  autocompleteResultsContainer for 1.2
                    if (jQuery(clickedElement).hasClass('autocompleteResults') || jQuery(clickedElement).hasClass('autocompleteResultsContainer')) {
                       return true;
	            	}
            	}
            	
                //whenever the focus of the input is lost, remove the popup
                //without some delay this remove section will be called before and so a
                //possible onclick event on the popup cant be fired
                var delay = function() {
                    widget.element.next().hide();
                    jQuery("table",widget.element.next()).first().remove();
                };
                window.setTimeout(delay, 300);
            });

            this.element.keyup(function(event) {
                var keyCode = event.keyCode;
                var charCodesToIgnore = [ 27, 37, 39 ]; // 27-esc, 37-left arrow, 39-right arrow
                if(keyCode == 40) {
                    if (this.value.length >= widget.options.minQueryLength &&
                            jQuery(widget.element.next()).css("display") === "none") {
                        //if length is correct and the autoComplete list is not displayed
                        //do an update on key down hit
                        widget.updateItems(event);
                    } else {
                        //if autoComplete list is displayed handle the row highlighting on down key
                        widget.downArrow();
                    }
                } else if(keyCode == 38) {
                    //handle the row highlighting on up key
                    widget.upArrow();
                } else if(keyCode == 13) {
                   //previous prevented submit on enter hit, now do an update of the model
                   widget.ajaxRequestExecuteInput();
                   event.stopPropagation();
                } else if(jQuery.inArray(keyCode, charCodesToIgnore) >=0) {
                   //esc, left arrow and right arrow do nothing
                } else if(this.value.length >= widget.options.minQueryLength) {

                    //check for chars which should not do an ajax roundtrip
                    var lastTyped = this.value.substring(this.value.length-1);
                    if (widget.options.ignoreChars.test(lastTyped)) {
                        return;
                    }

                    //for any other character, requestInternal the autoComplete list after some keyup delay
                    if (widget.options.keyupTimeout != undefined) {
                        clearTimeout(widget.options.keyupTimeout);
                    }
                    var keyPressDelay = function () {
                        widget.updateItems(event);
                    };
                    widget.options.keyupTimeout = window.setTimeout(keyPressDelay, widget.options.keyupDelay);

                }
            });

            if (this.options.autoCompleteArrow) {
                //if the autoComplete arrow should be displayed, register the events to fire it
                var offset = jQuery(this.element).offset();
                var widthToArrowImage = offset.left + this.element.width() - widget.options.arrowImageWidth;

                // new skin arrow
                var arrowSpan = this.element.prev().find("span");
                if (arrowSpan.length) {
                	arrowSpan.click(function(e) {
                		widget.updateItems(e);
                	});
                } else {
	                // old skin
	                this.element.click(function(e) {
	                    if (e.pageX > widthToArrowImage) {
	                        //if the mouse click occurs over the arrow image, requestInternal the autoComplete list
	                        widget.updateItems(e);
	                    }
	                });
                }

                this.element.mousemove(function(e) {
                    //if the mouse moves over the arrow image, change the pointer
                    if (e.pageX > widthToArrowImage) {
                        this.style.cursor = "pointer";
                    } else {
                        this.style.cursor = "auto";
                    }
                });
            }
        },

        downArrow : function() {
            //highlight the next row, if last is reached start from first
            var nextRow;
            var widget = this;
            jQuery('tr',this.element.next()).each(function(i, currentRow) {
                currentRow = jQuery(currentRow);
                if (currentRow.hasClass(widget.options.autoCompleteHoverClassName)) {
                    nextRow = currentRow.next();
                    currentRow.removeClass(widget.options.autoCompleteHoverClassName);
                    return false;
                }
            });
            if (!nextRow || nextRow.size() == 0) {
                nextRow = jQuery('tr',this.element.next()).first();
                
                // scroll to beginning
                jQuery(".autocompleteResults").scrollTop(0);
            } else {
            	
            }
            nextRow.addClass(widget.options.autoCompleteHoverClassName);
            this.applyRowChange(nextRow);
        },

        upArrow : function() {
            //highlight the previous row, if first is reached start from last
            var nextRow;
            var widget = this;
            jQuery(jQuery('tr',this.element.next()).get().reverse()).each(function(i, currentRow) {
                currentRow = jQuery(currentRow);
                if (currentRow.hasClass(widget.options.autoCompleteHoverClassName)) {
                    nextRow = currentRow.prev();
                    currentRow.removeClass(widget.options.autoCompleteHoverClassName);
                    return false;
                }
            });
            if (!nextRow || nextRow.size() == 0) {
                nextRow = jQuery('tr',this.element.next()).last();
                
                // scroll to bottom of table
                jQuery(".autocompleteResults").scrollTop(jQuery("table",widget.element.next()).first().height());
            }
            nextRow.addClass(widget.options.autoCompleteHoverClassName);
            this.applyRowChange(nextRow);
        },

        applyRowChange : function(nextRow) {
            // set the choosen autoComplete item value to the input field
        	var tdElem = jQuery('td',nextRow).first();
            this.element.val(tdElem.text());
            
            // scroll list
            this._scrollResultListContainer(jQuery(nextRow));
        },
        
        _scrollResultListContainer: function(nextRow) {
            //var resultsDiv = this.element.next();
        	var resultsDiv = jQuery(".autocompleteResults");
            var rowHeight = nextRow.height();
            
            var resultsDivHeight = resultsDiv.height();
            var positionNext = (nextRow.position().top + rowHeight);
            var resultsDivOffsetTop = resultsDiv.offset().top;
            
            // scroll down
            if (resultsDiv.height() < (nextRow.position().top + rowHeight) ) {
            	var scrollTopDown = resultsDiv.scrollTop() + rowHeight;
            	resultsDiv.scrollTop(scrollTopDown);
            } 
            // scroll up
            else if (resultsDiv.offset().top > nextRow.offset().top) {
            	var scrollTopUp = resultsDiv.scrollTop() - rowHeight;
            	resultsDiv.scrollTop(scrollTopUp);
            } 
        },

        isValueEmpty : function(value){
         return !Boolean(value);
        },

        ajaxRequestExecuteInput : function() {
            if(!this.isValueEmpty(this.options.reRender)){
                // If  reRender is present then only trigger the ajax update requestInternal.

                //do an ajax update just for the input field and probably any given reRender area
                //this is getting fired whenever choosing the autoComplete item is finished
                this.showInProgress();

                this.element.next().hide();
                jQuery("table",this.element.next()).first().remove();

                jsf.ajax.request(this.element[0], null,{render: this.options.reRender})
            }

        },

        errorHandler : function(data) {
            log("Error occurred during Ajax AutoComplete call: " + data.description);
        },

        afterResponse : function(data) {
            // afterResponse has been added by jsf.ajax.addOnEvent and hence is kind 
            // of static instead of instance method. So do not use "this.element", but check data.source (returns DOM element)
        	if (jQuery(data.source).attr('id') != this.element.attr('id')) {
        		return true;
        	}
        	
            var widget = this;
            var acDiv = this.element.next();
            
            // do only something if there is data to display
            if (acDiv.has('table').length) {
	
	            //move the new popup below the input field
	            widget.positionAutoComplete(acDiv);
	            
	            // oneSytling extension: Limit list height and adapt width to input field
	            var autoCompleteDiv = this.element.parent();
	            resizeAutocompleteResultlist(autoCompleteDiv);
	            
	
	            //apply onblur and onclick events of the popup, when fired they need to set the new value
	            //to the input field and update the server side model
	            var autoCompleteChange = function(event){
                    // check acDiv.attr('id') for web style 1.2 and  autoCompleteBodyDiv$ for 2.0
	            	if (event.target.id == acDiv.attr('id') || event.target.id.match(/autoCompleteBodyDiv$/) != null) {
	            		acDiv.hide();
	            		return true;
	            	}
	            	
	                //prevent further calls of this event handler
	                event.stopImmediatePropagation();
	                widget.applyRowChange(event.target.parentNode);
	                widget.ajaxRequestExecuteInput();
	            };
	            jQuery(acDiv).focusout(autoCompleteChange);
	            jQuery(acDiv).find('td').click(autoCompleteChange);
	
	            //register mouseover/-out css classes on the popup items
	            jQuery('tr',acDiv).each(function(i, currentRow) {
	                jQuery(currentRow).mousemove(function(e){
	                    jQuery(currentRow).addClass(widget.options.autoCompleteHoverClassName);
	                });
	                jQuery(currentRow).mouseout(function(e){
	                    jQuery(currentRow).removeClass(widget.options.autoCompleteHoverClassName);
	                });
	            });
            }
            widget.options.preventRequest = false;

            //remove inProgress status image
            widget.hideInProgress();
            

        },

        updateItems : function(event) {
          if (!this.options.preventRequest) {
              this.options.preventRequest = true;
              var widget = this;

              //show inProgress status image
              this.showInProgress();

              //now do the ajax requestInternal for the input field and its current value
              //reRender just the autoComplete area
              jsf.ajax.request(this.element[0], null, {render: this.element.next().attr("id")});
          }
        },

        showInProgress : function() {
        	// keep it for backward compatibility
            this.element.addClass(this.options.inProgressClass);
            
            //.. and it to the actionIcon span
            this.element.prev().find("span").addClass(this.options.inProgressClass);
        },

        hideInProgress : function() {
            this.element.removeClass(this.options.inProgressClass);
            
            this.element.prev().find("span").removeClass(this.options.inProgressClass);
        },

        positionAutoComplete : function(autoComplete) {
        	try {
	            var position = this.element.position();
	            var x = position.left;
	            var y = position.top;
	            if (!jQuery.browser.msie) {
	                var offsetParent = this.element.offsetParent();
	                if (offsetParent.attr("id") == "content") {
	                    x = this.element.offset().left;
	                }
	            }
	
	            autoComplete.css({left: x, top: y + this.element.outerHeight()}).show();
	            //add an iFrame to prevent ie bleed through - if IE is used only
	            if (jQuery.fn.bgiframe) {
	                autoComplete.bgiframe();
	            }
        	} catch (ex) {
        		// catch unspecified error 
        	}
        }
    });

})(jQuery);

/**
 * Enabled display of a label text inside an input field
 * 
 * @param fieldId input field's client ID
 * @param labelText text to display for empty field value
 * @param labelStyleClass CSS style class name for labeled field
 */
function initEmptyFieldValueLabel(fieldId, labelText, labelStyleClass) {
	var fieldElement = jQuery(document.getElementById(fieldId));
	
	if (!fieldElement || !labelText) {
		return;
	}
	
	// init label text
	if (fieldElement.val() == '') {
		fieldElement.val(labelText);
		fieldElement.addClass(labelStyleClass);
	}
	
	// remove text on focus
	fieldElement.focus(function() {
		if (fieldElement.val() == labelText) {
			fieldElement.val('');
			fieldElement.removeClass(labelStyleClass);
		}
	}).blur(function() {
		// add again when user has not entered anything
		if (fieldElement.val() == '') {
			fieldElement.val(labelText);
			fieldElement.addClass(labelStyleClass);
		}
	});
	
	// remove before form submit in order to not submit the label text
	fieldElement.closest('form').submit(function() {
		if (fieldElement.val() == labelText) {
			fieldElement.val('');
		}
	});
}