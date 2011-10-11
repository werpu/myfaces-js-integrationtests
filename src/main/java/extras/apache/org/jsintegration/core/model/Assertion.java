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

public class Assertion implements Serializable
{
    static final String ASSERT_TRUE = "AssertTrue";
    static final String ASSERT_FALSE = "AssertFalse";
    static final String ASSERT_FAIL = "Fail";

    String type;
    boolean outcome;
    String message;
    boolean failure;

    public Assertion()
    {
    }

    public Assertion(String type, String message, boolean outcome, boolean failure)
    {
        this.type = type;
        this.outcome = outcome;
        this.message = message;
        this.failure = failure;
    }

    public String getType()
    {
        return type;
    }

    public void setType(String type)
    {
        this.type = type;
    }

    public boolean isOutcome()
    {
        return outcome;
    }

    public void setOutcome(boolean outcome)
    {
        this.outcome = outcome;
    }

    public String getMessage()
    {
        return message;
    }

    public void setMessage(String message)
    {
        this.message = message;
    }

    public boolean isFailure()
    {
        return failure;
    }

    public void setFailure(boolean failure)
    {
        this.failure = failure;
    }
}
