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

import javax.servlet.AsyncContext;
import javax.servlet.DispatcherType;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.http.Part;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;
import java.security.Principal;
import java.util.Collection;
import java.util.Enumeration;
import java.util.Locale;
import java.util.Map;

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */

public class FileUploadServletRequestBase implements HttpServletRequest
{
    HttpServletRequest _delegate;

    public FileUploadServletRequestBase(HttpServletRequest delegate)
    {
        _delegate = delegate;
    }

    public HttpServletRequest getDelegate()
    {
        return _delegate;
    }

    @Override
    public String getAuthType()
    {
        return _delegate.getAuthType();
    }

    @Override
    public Cookie[] getCookies()
    {
        return _delegate.getCookies();
    }

    @Override
    public long getDateHeader(String s)
    {
        return _delegate.getDateHeader(s);
    }

    @Override
    public String getHeader(String s)
    {
        return _delegate.getHeader(s);
    }

    @Override
    public Enumeration<String> getHeaders(String s)
    {
        return _delegate.getHeaders(s);
    }

    @Override
    public Enumeration<String> getHeaderNames()
    {
        return _delegate.getHeaderNames();
    }

    @Override
    public int getIntHeader(String s)
    {
        return _delegate.getIntHeader(s);
    }

    @Override
    public String getMethod()
    {
        return _delegate.getMethod();
    }

    @Override
    public String getPathInfo()
    {
        return _delegate.getPathInfo();
    }

    @Override
    public String getPathTranslated()
    {
        return _delegate.getPathTranslated();
    }

    @Override
    public String getContextPath()
    {
        return _delegate.getContextPath();
    }

    @Override
    public String getQueryString()
    {
        return _delegate.getQueryString();
    }

    @Override
    public String getRemoteUser()
    {
        return _delegate.getRemoteUser();
    }

    @Override
    public boolean isUserInRole(String s)
    {
        return _delegate.isUserInRole(s);
    }

    @Override
    public Principal getUserPrincipal()
    {
        return _delegate.getUserPrincipal();
    }

    @Override
    public String getRequestedSessionId()
    {
        return _delegate.getRequestedSessionId();
    }

    @Override
    public String getRequestURI()
    {
        return _delegate.getRequestURI();
    }

    @Override
    public StringBuffer getRequestURL()
    {
        return _delegate.getRequestURL();
    }

    @Override
    public String getServletPath()
    {
        return _delegate.getServletPath();
    }

    @Override
    public HttpSession getSession(boolean b)
    {
        return _delegate.getSession(b);
    }

    @Override
    public HttpSession getSession()
    {
        return _delegate.getSession();
    }

    @Override
    public boolean isRequestedSessionIdValid()
    {
        return _delegate.isRequestedSessionIdValid();
    }

    @Override
    public boolean isRequestedSessionIdFromCookie()
    {
        return _delegate.isRequestedSessionIdFromCookie();
    }

    @Override
    public boolean isRequestedSessionIdFromURL()
    {
        return _delegate.isRequestedSessionIdFromURL();
    }

    @Override
    public boolean isRequestedSessionIdFromUrl()
    {
        return _delegate.isRequestedSessionIdFromUrl();
    }

    @Override
    public boolean authenticate(HttpServletResponse httpServletResponse) throws IOException, ServletException
    {
        return _delegate.authenticate(httpServletResponse);
    }

    @Override
    public void login(String s, String s1) throws ServletException
    {
        _delegate.login(s, s1);
    }

    @Override
    public void logout() throws ServletException
    {
        _delegate.logout();
    }

    @Override
    public Collection<Part> getParts() throws IOException, ServletException
    {
        return _delegate.getParts();
    }

    @Override
    public Part getPart(String s) throws IOException, ServletException
    {
        return _delegate.getPart(s);
    }

    @Override
    public Object getAttribute(String s)
    {
        return _delegate.getAttribute(s);
    }

    @Override
    public Enumeration<String> getAttributeNames()
    {
        return _delegate.getAttributeNames();
    }

    @Override
    public String getCharacterEncoding()
    {
        return _delegate.getCharacterEncoding();
    }

    @Override
    public void setCharacterEncoding(String s) throws UnsupportedEncodingException
    {
        _delegate.setCharacterEncoding(s);
    }

    @Override
    public int getContentLength()
    {
        return _delegate.getContentLength();
    }

    @Override
    public String getContentType()
    {
        return _delegate.getContentType();
    }

    @Override
    public ServletInputStream getInputStream() throws IOException
    {
        return _delegate.getInputStream();
    }

    @Override
    public String getParameter(String s)
    {
        return _delegate.getParameter(s);
    }

    @Override
    public Enumeration<String> getParameterNames()
    {
        return _delegate.getParameterNames();
    }

    @Override
    public String[] getParameterValues(String s)
    {
        return _delegate.getParameterValues(s);
    }

    @Override
    public Map<String, String[]> getParameterMap()
    {
        return _delegate.getParameterMap();
    }

    @Override
    public String getProtocol()
    {
        return _delegate.getProtocol();
    }

    @Override
    public String getScheme()
    {
        return _delegate.getScheme();
    }

    @Override
    public String getServerName()
    {
        return _delegate.getServerName();
    }

    @Override
    public int getServerPort()
    {
        return _delegate.getServerPort();
    }

    @Override
    public BufferedReader getReader() throws IOException
    {
        return _delegate.getReader();
    }

    @Override
    public String getRemoteAddr()
    {
        return _delegate.getRemoteAddr();
    }

    @Override
    public String getRemoteHost()
    {
        return _delegate.getRemoteHost();
    }

    @Override
    public void setAttribute(String s, Object o)
    {
        _delegate.setAttribute(s, o);
    }

    @Override
    public void removeAttribute(String s)
    {
        _delegate.removeAttribute(s);
    }

    @Override
    public Locale getLocale()
    {
        return _delegate.getLocale();
    }

    @Override
    public Enumeration<Locale> getLocales()
    {
        return _delegate.getLocales();
    }

    @Override
    public boolean isSecure()
    {
        return _delegate.isSecure();
    }

    @Override
    public RequestDispatcher getRequestDispatcher(String s)
    {
        return _delegate.getRequestDispatcher(s);
    }

    @Override
    public String getRealPath(String s)
    {
        return _delegate.getRealPath(s);
    }

    @Override
    public int getRemotePort()
    {
        return _delegate.getRemotePort();
    }

    @Override
    public String getLocalName()
    {
        return _delegate.getLocalName();
    }

    @Override
    public String getLocalAddr()
    {
        return _delegate.getLocalAddr();
    }

    @Override
    public int getLocalPort()
    {
        return _delegate.getLocalPort();
    }

    @Override
    public ServletContext getServletContext()
    {
        return _delegate.getServletContext();
    }

    @Override
    public AsyncContext startAsync() throws IllegalStateException
    {
        return _delegate.startAsync();
    }

    @Override
    public AsyncContext startAsync(ServletRequest servletRequest, ServletResponse servletResponse) throws IllegalStateException
    {
        return _delegate.startAsync(servletRequest, servletResponse);
    }

    @Override
    public boolean isAsyncStarted()
    {
        return _delegate.isAsyncStarted();
    }

    @Override
    public boolean isAsyncSupported()
    {
        return _delegate.isAsyncSupported();
    }

    @Override
    public AsyncContext getAsyncContext()
    {
        return _delegate.getAsyncContext();
    }

    @Override
    public DispatcherType getDispatcherType()
    {
        return _delegate.getDispatcherType();
    }
}
