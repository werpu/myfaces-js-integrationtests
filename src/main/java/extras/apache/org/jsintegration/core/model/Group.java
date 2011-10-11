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
import java.util.*;

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */

public class Group implements Serializable
{
    String _name;
    List<TestCase> _testCases;
    List<Assertion> _assertions;

    public Group()
    {
    }

    public Group(String name, List<TestCase> testCases, List<Assertion> assertions)
    {
        _name = name;
        _testCases = testCases;
        _assertions = assertions;
    }

    public String getName()
    {
        return _name;
    }

    public void setName(String name)
    {
        _name = name;
    }

    public List<TestCase> getTestCases()
    {
        return _testCases;
    }

    public void setTestCases(List<TestCase> testCases)
    {
        _testCases = testCases;
    }

    public List<Assertion> getAssertions()
    {
        return _assertions;
    }

    public void setAssertions(List<Assertion> assertions)
    {
        _assertions = assertions;
    }
}
