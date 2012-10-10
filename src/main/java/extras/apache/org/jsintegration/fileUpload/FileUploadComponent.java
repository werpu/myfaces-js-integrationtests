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

import javax.faces.component.FacesComponent;
import javax.faces.component.UIInput;
import javax.faces.component.behavior.ClientBehaviorHolder;

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */
@FacesComponent("at.irian.FileUpload")
public class FileUploadComponent extends UIInput implements ClientBehaviorHolder
{
    public static final String COMPONENT_TYPE = "at.irian.FileUpload";
    public static final String RENDERER_TYPE = "at.irian.FileUploadRenderer";

    protected static enum PropertyKeys
    {
        accesskey, alt, autocomplete, dir, disabled, label, lang, maxlength, onblur, onchange, onclick, ondblclick, onfocus, onkeydown, onkeypress, onkeyup, onmousedown, onmousemove, onmouseout, onmouseover,
        onmouseup, onselect, readonly, role, size, style, styleClass, tabindex, title
    }

    public FileUploadComponent()
    {
        super();
        setRendererType(RENDERER_TYPE);
    }

    public String getAccesskey()
    {
        return (String) getStateHelper().eval(PropertyKeys.accesskey, "");
    }

    public void setAccesskey(String accesskey)
    {
        getStateHelper().put(PropertyKeys.accesskey, accesskey);
    }

    public String getAlt()
    {
        return (String) getStateHelper().eval(PropertyKeys.alt, "");
    }

    public void setAlt(String param)
    {
        getStateHelper().put(PropertyKeys.alt, param);
    }

    public String getAutoComplete()
    {
        return (String) getStateHelper().eval(PropertyKeys.autocomplete, "");
    }

    public void setAutoComplete(String param)
    {
        getStateHelper().put(PropertyKeys.autocomplete, param);
    }

    public String getDir()
    {
        return (String) getStateHelper().eval(PropertyKeys.dir, "");
    }

    public void setDir(String param)
    {
        getStateHelper().put(PropertyKeys.dir, param);
    }

    public boolean isDisabled()
    {
        return (Boolean) getStateHelper().eval(PropertyKeys.disabled, Boolean.FALSE);
    }

    public void setDisabled(boolean param)
    {
        getStateHelper().put(PropertyKeys.disabled, (Boolean) param);
    }

    public void setLabel(String param)
    {
        getStateHelper().put(PropertyKeys.label, param);
    }

    public String getLabel()
    {
        return (String) getStateHelper().eval(PropertyKeys.label, "");
    }

    public void setLang(String param)
    {
        getStateHelper().put(PropertyKeys.lang, param);
    }

    public String getLang()
    {
        return (String) getStateHelper().eval(PropertyKeys.lang, "");
    }

    public void setMaxLength(int param)
    {
        getStateHelper().put(PropertyKeys.maxlength, (Integer) param);
    }

    public int getMaxLength()
    {
        return (Integer) getStateHelper().eval(PropertyKeys.maxlength, (Integer) 0);
    }

    public void setOnblur(String param)
    {
        getStateHelper().put(PropertyKeys.onblur, param);
    }

    public String getOnblur()
    {
        return (String) getStateHelper().eval(PropertyKeys.onblur, "");
    }

    public void setOnchange(String param)
    {
        getStateHelper().put(PropertyKeys.onchange, param);
    }

    public String getOnchange()
    {
        return (String) getStateHelper().eval(PropertyKeys.onchange, "");
    }

    public void setOnclick(String param)
    {
        getStateHelper().put(PropertyKeys.onclick, param);
    }

    public String getOnclick()
    {
        return (String) getStateHelper().eval(PropertyKeys.onclick, "");
    }

    public void setOndblclick(String param)
    {
        getStateHelper().put(PropertyKeys.ondblclick, param);
    }

    public String getOndblclick()
    {
        return (String) getStateHelper().eval(PropertyKeys.ondblclick, "");
    }

    public void setOnfocus(String param)
    {
        getStateHelper().put(PropertyKeys.onfocus, param);
    }

    public String getOnfocus()
    {
        return (String) getStateHelper().eval(PropertyKeys.onfocus, "");
    }

    public void setOnkeydown(String param)
    {
        getStateHelper().put(PropertyKeys.onkeydown, param);
    }

    public String getOnkeydown()
    {
        return (String) getStateHelper().eval(PropertyKeys.onkeydown, "");
    }

    public void setOnkeypress(String param)
    {
        getStateHelper().put(PropertyKeys.onkeypress, param);
    }

    public String getOnkeypress()
    {
        return (String) getStateHelper().eval(PropertyKeys.onkeypress, "");
    }

    public void setOnkeyup(String param)
    {
        getStateHelper().put(PropertyKeys.onkeyup, param);
    }

    public String getOnkeyup()
    {
        return (String) getStateHelper().eval(PropertyKeys.onkeyup, "");
    }

    public void setOnmousedown(String param)
    {
        getStateHelper().put(PropertyKeys.onmousedown, param);
    }

    public String getOnmousedown()
    {
        return (String) getStateHelper().eval(PropertyKeys.onmousedown, "");
    }

    public void setOnmousemove(String param)
    {
        getStateHelper().put(PropertyKeys.onmousemove, param);
    }

    public String getOnmousemove()
    {
        return (String) getStateHelper().eval(PropertyKeys.onmousemove, "");
    }

    public void setOnmouseout(String param)
    {
        getStateHelper().put(PropertyKeys.onmouseout, param);
    }

    public String getOnmouseout()
    {
        return (String) getStateHelper().eval(PropertyKeys.onmouseout, "");
    }

    public void setOnmouseover(String param)
    {
        getStateHelper().put(PropertyKeys.onmouseover, param);
    }

    public String getOnmouseover()
    {
        return (String) getStateHelper().eval(PropertyKeys.onmouseover, "");
    }

    public void setOnmouseup(String param)
    {
        getStateHelper().put(PropertyKeys.onmouseup, param);
    }

    public String getOnmouseup()
    {
        return (String) getStateHelper().eval(PropertyKeys.onmouseup, "");
    }

    public void setOnselect(String param)
    {
        getStateHelper().put(PropertyKeys.onselect, param);
    }

    public String getOnselect()
    {
        return (String) getStateHelper().eval(PropertyKeys.onselect, "");
    }

    public boolean isReadonly()
    {
        return (Boolean) getStateHelper().eval(PropertyKeys.readonly, Boolean.FALSE);
    }

    public void setReadonly(boolean param)
    {
        getStateHelper().put(PropertyKeys.readonly, (Boolean) param);
    }

    public void setRole(String param)
    {
        getStateHelper().put(PropertyKeys.role, param);
    }

    public String getRole()
    {
        return (String) getStateHelper().eval(PropertyKeys.role, "");
    }

    public void setSize(int param)
    {
        getStateHelper().put(PropertyKeys.size, (Integer) param);
    }

    public int getSize()
    {
        return (Integer) getStateHelper().eval(PropertyKeys.size, 0);
    }

    public void setStyle(String param)
    {
        getStateHelper().put(PropertyKeys.style, param);
    }

    public String getStyle()
    {
        return (String) getStateHelper().eval(PropertyKeys.style, "");
    }

    public void setStyleClass(String param)
    {
        getStateHelper().put(PropertyKeys.styleClass, param);
    }

    public String getStyleClass()
    {
        return (String) getStateHelper().eval(PropertyKeys.styleClass, "");
    }

    public void setTabIndex(String param)
    {
        getStateHelper().put(PropertyKeys.tabindex, param);
    }

    public String getTabIndex()
    {
        return (String) getStateHelper().eval(PropertyKeys.tabindex, "");
    }

    public void setTitle(String param)
    {
        getStateHelper().put(PropertyKeys.title, param);
    }

    public String getTitle()
    {
        return (String) getStateHelper().eval(PropertyKeys.title, "");
    }

}


