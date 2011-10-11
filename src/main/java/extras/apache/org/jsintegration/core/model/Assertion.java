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

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */

public class Assertion
{
    static final String ASSERT_TRUE = "AssertTrue";
    static final String ASSERT_FALSE = "AssertFalse";
    static final String ASSERT_FAIL = "Fail";

    String _type;
    boolean _outcome;
    String _message;
    boolean _failure;

    public Assertion()
    {
    }

    public Assertion(String type, String message, boolean outcome, boolean failure)
    {
        _type = type;
        _outcome = outcome;
        _message = message;
        _failure = failure;
    }

    public String getType()
    {
        return _type;
    }

    public void setType(String type)
    {
        _type = type;
    }

    public boolean isOutcome()
    {
        return _outcome;
    }

    public void setOutcome(boolean outcome)
    {
        _outcome = outcome;
    }

    public String getMessage()
    {
        return _message;
    }

    public void setMessage(String message)
    {
        _message = message;
    }

    public boolean isFailure()
    {
        return _failure;
    }

    public void setFailure(boolean failure)
    {
        _failure = failure;
    }
}
