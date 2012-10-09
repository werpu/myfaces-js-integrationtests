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
 *
 * We map all small entries into request parameters to keep
 * the compatibility to existing frameworks
 * the big files must be fetched over the servlet parts api as expected
 */

public class FileUploadServletRequest extends FileUploadServletRequestBase
{
    private static final String CONTENT_DISPOSITION = "content-disposition";
    private static final String FORM_DATA = "form-data";
    private static final String FILENAME = "filename";
    private static final int BUFFER_SIZE = 4096;
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
                    //only parts which are not files will become new parameter values, we can identify
                    //TODO refine this a little bit more to check for filename =
                    if (part.getHeader(CONTENT_DISPOSITION).contains(FORM_DATA) && !part.getHeader
                            (CONTENT_DISPOSITION).contains(FILENAME))
                    {
                        InputStream istr = part.getInputStream();
                        String res = readString(istr);
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
                e.printStackTrace();
            }
            catch (ServletException e)
            {
                e.printStackTrace();
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

    public String readString(InputStream is)
            throws IOException
    {
        if(is == null) {
            return "";
        }

        Writer writer = new StringWriter();

        char[] buffer = new char[BUFFER_SIZE];
        try
        {
            String encoding = this.getCharacterEncoding();
            encoding = (encoding == null) ? "UTF-8" : encoding;
            Reader reader = new BufferedReader(new InputStreamReader(is, encoding));
            int noBytes;
            while ((noBytes = reader.read(buffer)) != -1)
            {
                writer.write(buffer, 0, noBytes);
            }
        }
        finally
        {
            is.close();
        }
        return writer.toString();

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
