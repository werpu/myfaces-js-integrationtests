/**
 * Copyright (C) 2012 CREDIT SUISSE IT - <developmentsupport.jsf@credit-suisse.com>
 *
 * All Rights reserved.
 *
 * This software is the proprietary information of CREDIT SUISSE Technology and
 * Operations. Use is subject to license and non-disclosure terms.
 */
package com.csg.jsf.component.field;

import java.io.Serializable;
import java.util.List;

import javax.el.ELContext;
import javax.el.ExpressionFactory;
import javax.el.MethodExpression;
import javax.el.ValueExpression;
import javax.faces.component.FacesComponent;
import javax.faces.component.UINamingContainer;
import javax.faces.context.FacesContext;
import javax.faces.event.AbortProcessingException;
import javax.faces.event.ComponentSystemEvent;

/**
 * @author Gerald Muellan
 */
@FacesComponent(value = AutoComplete.COMPONENT_TYPE)
public class AutoComplete extends UINamingContainer implements Serializable {

	private static final long serialVersionUID = 1L;

	enum PropertyKeys {
		limit
	}

	public static final String COMPONENT_TYPE = "com.csg.jsf.component.field.AutoComplete";

	private transient List<Object> autoCompleteItems;

	public void preRenderAutoCompletePopup(ComponentSystemEvent event)
			throws AbortProcessingException {
		FacesContext context = getFacesContext();
		if (context.getPartialViewContext().isAjaxRequest()) {
			Object value = getAttributes().get("value");
			autoCompleteItems = getNewItems(context, (String)value);
		}
	}

	public List<Object> getAutoCompleteItems() {
		return autoCompleteItems;
	}

	@SuppressWarnings("unchecked")
	private List<Object> getNewItems(FacesContext context, String inputValue) {
		ValueExpression ve = getValueExpression("items");
		ExpressionFactory factory = context.getApplication().getExpressionFactory();
		ELContext elContext = context.getELContext();

		MethodExpression suggestionMethod =
				factory.createMethodExpression(elContext, ve.getExpressionString(), List.class,
						new Class[] {AutoCompleteContext.class});

		Integer limit = getLimit();
		AutoCompleteContext autoCompleteContext = new AutoCompleteContext(inputValue, limit);

		return (List<Object>)suggestionMethod.invoke(elContext, new Object[] {autoCompleteContext});
	}

	/**
	 * The maximum amount of suggested entries
	 * 
	 * @return the <code>limit<code> property.
	 */
	public Integer getLimit() {
		return (Integer)getStateHelper().eval(PropertyKeys.limit);
	}

	public void setLimit(Integer limit) {
		getStateHelper().put(PropertyKeys.limit, limit);
	}
}