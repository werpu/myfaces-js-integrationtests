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

import javax.annotation.PostConstruct;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;
import javax.faces.context.FacesContext;
import javax.servlet.http.HttpServletRequest;
import java.util.*;

import extras.apache.org.jsintegration.core.model.Group;

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */

@ManagedBean
@RequestScoped
public class StatisticsVisualizer
{
    List<Group> groupList;

    @PostConstruct
    public void postCreate()
    {
        groupList = getGroupsContainer();
    }

    List<Group> getGroupsContainer()
    {
        Map<String, Object> sessionMap = FacesContext.getCurrentInstance().getExternalContext().getSessionMap();
        java.util.List<Group> finalGroups = (java.util.List<Group>) sessionMap.get(StatisticsCollector.TEST_RESULTS);
        if (finalGroups == null)
        {
            finalGroups = Collections.synchronizedList(new LinkedList<extras.apache.org.jsintegration.core.model.Group>());
            sessionMap.put(StatisticsCollector
                    .TEST_RESULTS, finalGroups);
        }
        return finalGroups;
    }

    public List<Group> getGroupList()
    {
        return groupList;
    }

    public void setGroupList(List<Group> groupList)
    {
        this.groupList = groupList;
    }
}
