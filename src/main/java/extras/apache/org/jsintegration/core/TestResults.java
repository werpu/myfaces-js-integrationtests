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

import extras.apache.org.jsintegration.core.model.Group;

import java.util.*;
import java.util.zip.CRC32;

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 *          <p/>
 *          Testresults with an idx so that a double entry cannot occur
 *          note this class is not thread save!!! Should not be a problem
 *          under normal conditions
 */

public class TestResults
{
    ArrayList<Group> testGroups = new ArrayList<Group>(100);
    Map<Long, Integer> _groupIdx = new HashMap<Long, Integer>();
    CRC32 crcCalc = new CRC32();

    public void addGroup(Group group)
    {
        crcCalc.reset();
        crcCalc.update(group.getName().getBytes());
        Long crc32 = crcCalc.getValue();
        if (_groupIdx.containsKey(crc32))
        {
            testGroups.set(_groupIdx.get(crc32), group);
        } else
        {
            testGroups.add(group);
            _groupIdx.put(crc32, testGroups.indexOf(group));
        }
    }

    public void addAll(Collection<Group> groups)
    {
        for (Group group : groups)
        {
            addGroup(group);
        }
    }

    public void clear()
    {
        this.testGroups.clear();
        this._groupIdx.clear();
    }

    public List<Group> getTestGroups()
    {
        return testGroups;
    }
}
