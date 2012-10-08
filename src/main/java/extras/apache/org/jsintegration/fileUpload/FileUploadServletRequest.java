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

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringWriter;
import java.io.Writer;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */

public class FileUploadServletRequest extends FileUploadServletRequestBase
{
    Map<String, String[]> parameterMap = new HashMap<String, String[]>();

    public FileUploadServletRequest(HttpServletRequest delegate)
    {
        super(delegate);
        if (isMultipartRequest())
        {
            try
            {
                for (Part part : getParts())
                {
                    //only parts which are small will become new parameter values
                    if (part.getHeader("content-disposition").contains("form-data") && !part.getHeader
                            ("content-disposition").contains("filename"))
                    {
                        InputStream istr = part.getInputStream();
                        String res = convertStreamToString(istr);
                        String[] values = parameterMap.get(part.getName());
                        if (values == null)
                        {
                            values = new String[1];
                            values[0] = res;
                        } else
                        {

                            String[] newValues = Arrays.copyOf(values, values.length + 1);
                            newValues[newValues.length - 1] = res;
                            values = newValues;
                        }
                        parameterMap.put(part.getName(), values);
                    }
                }
            }
            catch (IOException e)
            {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }
            catch (ServletException e)
            {
                e.printStackTrace();  //To change body of catch statement use File | Settings | File Templates.
            }
        }
    }

    @Override
    public Map<String, String[]> getParameterMap()
    {
        return isMultipartRequest() ? Collections.unmodifiableMap(parameterMap) : super.getParameterMap();
    }

    @Override
    public String[] getParameterValues(String s)
    {
        if (isMultipartRequest())
        {
            return getParameterMap().get(s);
        } else
        {
            return super.getParameterValues(s);
        }
    }

    public String convertStreamToString(InputStream is)
            throws IOException
    {
        //
        // To convert the InputStream to String we use the
        // Reader.read(char[] buffer) method. We iterate until the
        // Reader return -1 which means there's no more data to
        // read. We use the StringWriter class to produce the string.
        //
        if (is != null)
        {
            Writer writer = new StringWriter();

            char[] buffer = new char[1024];
            try
            {
                Reader reader = new BufferedReader(
                        new InputStreamReader(is, "UTF-8"));
                int n;
                while ((n = reader.read(buffer)) != -1)
                {
                    writer.write(buffer, 0, n);
                }
            }
            finally
            {
                is.close();
            }
            return writer.toString();
        } else
        {
            return "";
        }
    }

    public String getRequestParameter(String name)
    {
        if (isMultipartRequest())
        {
            String[] ret = getParameterMap().get(name);
            if (ret.length > 0) return ret[0];
            return null;
        } else
        {
            return super.getParameter(name);
        }
    }

    private boolean isMultipartRequest()
    {
        try
        {
            return super.getParts() != null && super.getParts().size() > 0;
        }
        catch (IOException e)
        {
            return false;
        }
        catch (ServletException e)
        {
            return false;
        }

    }
}
