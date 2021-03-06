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

package extras.apache.org.jsintegration.core.model2;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */

public class Results
{

    Map<String, Suite> suites;
    Statistics statistics;

    public Results()
    {
    }

    public Results(Map<String, Suite> suites, Statistics statistics)
    {
        this.suites = suites;
        this.statistics = statistics;
    }

    public Map<String, Suite> getSuites()
    {
        return suites;
    }

    public void setSuites(Map<String, Suite> suites)
    {
        this.suites = suites;
    }

    public Statistics getStatistics()
    {
        return statistics;
    }

    public void setStatistics(Statistics statistics)
    {
        this.statistics = statistics;
    }

    public String getOrigin() {
        return this.statistics.getOrigin();
    }

    public List<Suite> getSuitesAsList() {
        List<Suite> retVal = new ArrayList<Suite>(suites.size());
        for(Map.Entry<String, Suite> entry: suites.entrySet()) {
            retVal.add(entry.getValue());
        }
        return retVal;
    }

    @Override
    public int hashCode()
    {
        return statistics.origin.hashCode();
    }


}
