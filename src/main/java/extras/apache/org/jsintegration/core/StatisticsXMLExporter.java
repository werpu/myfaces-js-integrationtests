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

package extras.apache.org.jsintegration.core;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import java.io.IOException;

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */

public class StatisticsXMLExporter extends HttpServlet
{
    public static final String TEST_RESULTS = "testResults";

    @Override
    protected void doPost(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws ServletException, IOException
    {
        this.service(httpServletRequest, httpServletResponse);
    }

    @Override
    protected void doGet(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws ServletException, IOException
    {
        this.service(httpServletRequest, httpServletResponse);
    }

    @Override
    protected void service(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws ServletException, IOException
    {
        TestResults res = getGroupsContainer(httpServletRequest);

        JAXBContext context = null;
        try
        {
            context = JAXBContext.newInstance(TestResults.class);
            Marshaller m = context.createMarshaller();
            m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
            httpServletResponse.setContentType("text/xml");

            m.marshal(res, httpServletResponse.getWriter());
            httpServletResponse.flushBuffer();
        }
        catch (JAXBException e)
        {
            e.printStackTrace();
        }
    }

    private TestResults getGroupsContainer(HttpServletRequest request)
    {
        TestResults ret = (TestResults) request.getSession().getAttribute(TEST_RESULTS);
        if (ret == null)
        {
            ret = new TestResults();
            request.getSession().setAttribute("testResults", ret);
        }
        return ret;
    }
}
