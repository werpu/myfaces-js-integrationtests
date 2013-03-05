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

import extras.apache.org.jsintegration.core.model2.Results;
import extras.apache.org.jsintegration.core.model2.Suite;
import extras.apache.org.jsintegration.core.model2.TestResults2;
import org.richfaces.component.ListType;

import javax.annotation.PostConstruct;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;
import javax.faces.context.FacesContext;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */

@ManagedBean(name = "statisticsVisualizer2")
@RequestScoped
public class HTMLStatisticsExporter2
{
    List<Results> testResults = null;
    List<Results> failedResults = Collections.EMPTY_LIST;

    @PostConstruct
    public void postCreate()
    {
        testResults = getResultsContainer();
        failedResults = new LinkedList<Results>();
        for (Results results : testResults)
        {
            for (Map.Entry<String, Suite> entry : results.getSuites().entrySet())
            {
                if (entry.getValue().isFailed())
                {
                    failedResults.add(results);
                }
            }
        }
    }

    public List<Results> getResults()
    {
        //List<Results> retVal = new ArrayList<Results>(testResults.size());
        //retVal.addAll(testResults);
        //return retVal;
        return testResults;
    }

    public List<Results> getFailedResults()
    {
        return failedResults;
    }

    private List<Results> getResultsContainer()
    {
        Map<String, Object> sessionMap = FacesContext.getCurrentInstance().getExternalContext().getSessionMap();
        TestResults2 results = (TestResults2) sessionMap.get(StatisticsCollector2.TEST_RESULTS);
        if (results == null)
        {
            results = new TestResults2();
            results.setResults(Collections.EMPTY_LIST);
        }
        return results.getResults();
    }

}
