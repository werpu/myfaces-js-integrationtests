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

import com.google.gson.Gson;
import extras.apache.org.jsintegration.core.model2.Results;
import extras.apache.org.jsintegration.core.model2.TestResults2;
import org.apache.commons.lang.StringEscapeUtils;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */

public class StatisticsCollector2 extends HttpServlet
{
    private static final String PARAM_SENDSTATS_MARKER  = "sendstats";
    private static final String PARAM_TEST_GROUP        = "testGroup";
    private static final String PARAM_RESET_ALL         = "resetAll";
    public static final String TEST_RESULTS             = "testResults2";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws
                                                                                    ServletException, IOException
    {
        //super.doPost(request, response);
        String reqParam = request.getParameter(PARAM_SENDSTATS_MARKER);
        String resetAll = request.getParameter(PARAM_RESET_ALL);
        if (resetAll != null)
        {
            getGroupsContainer(request).getResults().clear();
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

        Gson gson = new Gson();
        Results results = gson.fromJson(group, Results.class);
        TestResults2 testResultsContainer = getGroupsContainer(request);
        //testResultsContainer.getResults().add(results);
        int pos = -1;
        int finalPos = -1;
        System.out.println("TestURL:"+results.getOrigin());
        for(Results iteratedResults: testResultsContainer.getResults()) {
            pos++;
            if(iteratedResults.hashCode() == results.hashCode()) {
                finalPos = pos;
                break;
            }
        }
        if(finalPos > -1) {
            testResultsContainer.getResults().remove(finalPos);
            testResultsContainer.getResults().add(finalPos, results);
        } else {
            testResultsContainer.getResults().add(results);
        }
    }

    private TestResults2 getGroupsContainer(HttpServletRequest request)
    {
        TestResults2 ret = (TestResults2) request.getSession().getAttribute(TEST_RESULTS);
        if (ret == null)
        {
            ret = new TestResults2();
            request.getSession().setAttribute(TEST_RESULTS, ret);
        }
        return ret;
    }

}
