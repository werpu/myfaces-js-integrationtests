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

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */

public class Statistics
{
    int numberOfTests;
    int numberOfFails;
    int numberOfPassed;
    int executionTime;

    public int getNumberOfTests()
    {
        return numberOfTests;
    }

    public void setNumberOfTests(int numberOfTests)
    {
        this.numberOfTests = numberOfTests;
    }

    public int getNumberOfFails()
    {
        return numberOfFails;
    }

    public void setNumberOfFails(int numberOfFails)
    {
        this.numberOfFails = numberOfFails;
    }

    public int getNumberOfPassed()
    {
        return numberOfPassed;
    }

    public void setNumberOfPassed(int numberOfPassed)
    {
        this.numberOfPassed = numberOfPassed;
    }

    public int getExecutionTime()
    {
        return executionTime;
    }

    public void setExecutionTime(int executionTime)
    {
        this.executionTime = executionTime;
    }
}
