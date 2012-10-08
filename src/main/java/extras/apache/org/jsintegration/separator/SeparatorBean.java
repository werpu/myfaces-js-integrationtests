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

package extras.apache.org.jsintegration.separator;

import javax.faces.bean.ApplicationScoped;
import javax.faces.bean.ManagedBean;
import javax.faces.context.FacesContext;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 *          <p/>
 *          separator bean which produces different separators depending on the
 *          viewid
 */
@ManagedBean
@ApplicationScoped
public class SeparatorBean
{
    public String getSeparator()
    {
        String viewId = FacesContext.getCurrentInstance().getViewRoot().getViewId();
        if (viewId.contains("test22-separator"))
        {
            return encode("|");
        } else
        {
            return "";
        }
    }

    private String encode(String toEncode)
    {
        try
        {
            return "separator=" + URLEncoder.encode(toEncode, "UTF-8");
        }
        catch (UnsupportedEncodingException e)
        {
            e.printStackTrace();
            //cannot happen
        }
        return null;
    }
}
