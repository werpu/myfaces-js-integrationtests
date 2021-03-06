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

package extras.apache.org.jsintegration.core.model;

import java.io.Serializable;

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */

public class FinalResult  implements Serializable
{
    int numberOfTestsPerformed;
    int numberOfTestsSucceeded;
    int numberOfTestsFailed;
    int performanceTime;

    public FinalResult()
    {
    }

    public FinalResult(int numberOfTestsPerformed, int numberOfTestsSucceeded, int numberOfTestsFailed)
    {
        this.numberOfTestsPerformed = numberOfTestsPerformed;
        this.numberOfTestsSucceeded = numberOfTestsSucceeded;
        this.numberOfTestsFailed = numberOfTestsFailed;
    }

    public int getNumberOfTestsPerformed()
    {
        return numberOfTestsPerformed;
    }

    public void setNumberOfTestsPerformed(int numberOfTestsPerformed)
    {
        this.numberOfTestsPerformed = numberOfTestsPerformed;
    }

    public int getNumberOfTestsSucceeded()
    {
        return numberOfTestsSucceeded;
    }

    public void setNumberOfTestsSucceeded(int numberOfTestsSucceeded)
    {
        this.numberOfTestsSucceeded = numberOfTestsSucceeded;
    }

    public int getNumberOfTestsFailed()
    {
        return numberOfTestsFailed;
    }

    public void setNumberOfTestsFailed(int numberOfTestsFailed)
    {
        this.numberOfTestsFailed = numberOfTestsFailed;
    }

    public int getPerformanceTime()
    {
        return performanceTime;
    }

    public void setPerformanceTime(int performanceTime)
    {
        this.performanceTime = performanceTime;
    }
}
