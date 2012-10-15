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

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */
@WebFilter(filterName = "fileUploadFilter", urlPatterns = {"*"})
public class FileUploadFilter implements Filter
{

    @Override
    public void init(FilterConfig filterConfig) throws ServletException
    {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException
    {
        //we have to check for parameters first because richfaces and other libraries
        //use their own request filters
        //TODO Portlet request handling

        if (
                servletRequest instanceof HttpServletRequest &&
                        isMultipartRequest((HttpServletRequest) servletRequest))
        {
            FileUploadServletRequest request = new FileUploadServletRequest((HttpServletRequest) servletRequest);

            if (request.getParameter("javax.faces.request") != null || ((HttpServletRequest) request)
                    .getHeader("Faces-Request") != null)
            {
                servletRequest = request;
            }
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }

    private final boolean isMultipartRequest(HttpServletRequest servletRequest) throws IOException
    {
        return servletRequest.getHeader("Content-Type") != null && servletRequest.getHeader("Content-Type").contains
            ("multipart/form-data");
    }

    @Override
    public void destroy()
    {

    }
}
