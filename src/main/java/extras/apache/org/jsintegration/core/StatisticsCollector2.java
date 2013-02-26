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

import org.apache.commons.lang.StringEscapeUtils;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */

public class StatisticsCollector2 extends HttpServlet
{
    private static final String PARAM_SENDSTATS_MARKER = "sendstats";
    private static final String PARAM_TEST_GROUP = "testGroup";
    private static final String PARAM_RESET_ALL = "resetAll";
    public static final String TEST_RESULTS = "testResults";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws
                                                                                    ServletException, IOException
    {
        //super.doPost(request, response);
        String reqParam = request.getParameter(PARAM_SENDSTATS_MARKER);
        String resetAll = request.getParameter(PARAM_RESET_ALL);
        if (resetAll != null)
        {
            getGroupsContainer(request).clear();
        }
        if (reqParam != null)
        {
            this.doCollectTestGroup(request, response);
        }
    }

    private void doCollectTestGroup(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
        String group = request.getParameter(PARAM_TEST_GROUP);
        group = StringEscapeUtils.unescapeJavaScript(group);
        PrintWriter out = response.getWriter();
        out.write(group);
        out.flush();
        out.close();
    }

    private TestResults getGroupsContainer(HttpServletRequest request)
    {
        TestResults ret = (TestResults) request.getSession().getAttribute(TEST_RESULTS);
        if (ret == null)
        {
            ret = new TestResults();
            request.getSession().setAttribute(TEST_RESULTS, ret);
        }
        return ret;
    }

}
