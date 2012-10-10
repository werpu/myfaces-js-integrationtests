/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package extras.apache.org.jsintegration.fileUpload;

import javax.faces.component.UIComponent;
import javax.faces.component.UIInput;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;
import javax.faces.render.FacesRenderer;
import javax.faces.render.Renderer;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;
import java.io.IOException;

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */
@FacesRenderer(componentFamily = "javax.faces.Input", rendererType = "at.irian.FileUploadRenderer")
public class FileUploadRenderer extends Renderer
{

    private static final String INPUT = "input";
    private static final String TYPE = "type";
    private static final String NAME = "name";
    private static final String ID = "id";
    private static final String CLASS = "class";
    private static final String STYLE = "style";
    private static final String FILE = "file";
    private static final String ACCESSKEY = "accesskey";
    private static final String ALT = "alt";
    private static final String AUTOCOMPLETE = "autocomplete";
    private static final String DIR = "dir";
    private static final String DISABLED = "disabled";
    private static final String LABEL = "label";
    private static final String LANG = "lang";
    private static final String ONBLUR = "onblur";
    private static final String ONCHANGE = "onchange";
    private static final String ONCLICK = "onclick";
    private static final String ONDBLCLICK = "ondblclick";
    private static final String ONFOCUS = "onfocus";
    private static final String ONKEYDOWN = "onkeydown";
    private static final String ONKEYPRESS = "onkeypress";
    private static final String ONKEYUP = "onkeyup";
    private static final String ONMOUSEDOWN = "onmousedown";
    private static final String ONMOUSEMOVE = "onmousemove";
    private static final String ONMOUSEOUT = "onmouseout";
    private static final String ONMOUSEOVER = "onmouseover";
    private static final String ONMOUSEUP = "onmouseup";
    private static final String ONSELECT = "onselect";
    private static final String READONLY = "readonly";
    private static final String ROLE = "role";
    private static final String TABINDEX = "tabindex";
    private static final String TITLE = "title";
    private static final String MAXLENGTH = "maxlength";
    private static final String SIZE = "size";

    @Override
    public void decode(FacesContext facesContext, UIComponent uiComponent)
    {
        //super.decode(facesContext, uiComponent);
        try
        {
            Part part = ((HttpServletRequest) facesContext.getExternalContext().getRequest()).getPart(uiComponent.getClientId());
            if(part == null) return;
            ((UIInput) uiComponent).setSubmittedValue(part);
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
        catch (ServletException e)
        {
            e.printStackTrace();
        }
    }

    @Override
    public void encodeEnd(FacesContext facesContext, UIComponent uiComponent) throws IOException
    {
        super.encodeEnd(facesContext, uiComponent);
        ResponseWriter writer = facesContext.getResponseWriter();
        FileUploadComponent component = (FileUploadComponent) uiComponent;
        writer.startElement(INPUT, uiComponent);
        writer.writeAttribute(TYPE, FILE, null);
        writer.writeAttribute(NAME, component.getClientId(), null);
        writer.writeAttribute(ID, component.getClientId(), null);

        renderHTMLAttribute(writer, ACCESSKEY, component.getAccesskey());
        renderHTMLAttribute(writer, ALT, component.getAlt());
        renderHTMLAttribute(writer, AUTOCOMPLETE, component.getAutoComplete());
        renderHTMLAttribute(writer, DIR, component.getDir());
        if(component.isDisabled()) {
            writer.writeAttribute(DISABLED, String.valueOf(component.isDisabled()),null);
        }
        renderHTMLAttribute(writer, LABEL, component.getLabel());
        renderHTMLAttribute(writer, LANG, component.getLang());
        if(component.getMaxLength() > 0) {
                    writer.writeAttribute(MAXLENGTH, String.valueOf(component.getMaxLength()), null);
                }
        renderHTMLAttribute(writer, ONBLUR, component.getOnblur());
        renderHTMLAttribute(writer, ONCHANGE, component.getOnchange());
        renderHTMLAttribute(writer, ONCLICK, component.getOnclick());
        renderHTMLAttribute(writer, ONDBLCLICK, component.getOndblclick());

        renderHTMLAttribute(writer, ONFOCUS, component.getOnfocus());
        renderHTMLAttribute(writer, ONKEYDOWN, component.getOnkeydown());
        renderHTMLAttribute(writer, ONKEYPRESS, component.getOnkeypress());
        renderHTMLAttribute(writer, ONKEYUP, component.getOnkeyup());

        renderHTMLAttribute(writer, ONMOUSEDOWN, component.getOnmousedown());
        renderHTMLAttribute(writer, ONMOUSEMOVE, component.getOnmousemove());
        renderHTMLAttribute(writer, ONMOUSEOUT, component.getOnmouseout());
        renderHTMLAttribute(writer, ONMOUSEOVER, component.getOnmouseover());
        renderHTMLAttribute(writer, ONMOUSEUP, component.getOnmouseup());

        renderHTMLAttribute(writer, ONSELECT, component.getOnselect());

        if(component.isReadonly()) {
            writer.writeAttribute(READONLY, String.valueOf(component.isReadonly()),null);
        }

        renderHTMLAttribute(writer, ROLE, component.getRole());
        if(component.getSize() > 0) {
            writer.writeAttribute(SIZE, String.valueOf(component.getSize()), null);
        }

        renderHTMLAttribute(writer, STYLE, component.getStyle());
        renderHTMLAttribute(writer, CLASS, component.getStyleClass());

        renderHTMLAttribute(writer, TABINDEX, component.getTabIndex());
        renderHTMLAttribute(writer, TITLE, component.getTitle());

        writer.endElement(INPUT);
    }

    private final void renderHTMLAttribute(ResponseWriter writer, String name, String in) throws IOException {
        if(!StringUtils.isBlank(in)) {
            writer.writeAttribute(name, in, null);
        }
    }
}
