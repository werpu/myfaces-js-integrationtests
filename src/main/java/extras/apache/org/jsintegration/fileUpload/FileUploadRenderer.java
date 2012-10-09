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

    @Override
    public void decode(FacesContext facesContext, UIComponent uiComponent)
    {
        //super.decode(facesContext, uiComponent);
        try
        {
            Part part = ((HttpServletRequest)facesContext.getExternalContext().getRequest()).getPart(uiComponent.getClientId());
            ((UIInput)uiComponent).setSubmittedValue(part);
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
        writer.startElement(INPUT,uiComponent);
        writer.writeAttribute(TYPE, FILE, null);
        writer.writeAttribute(NAME, component.getClientId(), null);
        writer.writeAttribute(ID, component.getClientId(), null);
        writer.writeAttribute(CLASS, component.getStyleClass(), null);
        writer.writeAttribute(STYLE, component.getStyle(), null);
        writer.writeAttribute("value","booga",null);
        writer.endElement(INPUT);
    }
}
