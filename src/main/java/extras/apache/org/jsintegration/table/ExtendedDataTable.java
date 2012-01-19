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

package extras.apache.org.jsintegration.table;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import java.util.LinkedList;
import java.util.List;

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */
@ManagedBean(name = "dataBean")
@SessionScoped
public class ExtendedDataTable
{
    class Item
    {
        Item(String a, String b, String c)
        {
            this.a = a;
            this.b = b;
            this.c = c;
        }

        String a = "";
        String b = "";
        String c = "";

        public String getA()
        {
            return a;
        }

        public void setA(String a)
        {
            this.a = a;
        }

        public String getB()
        {
            return b;
        }

        public void setB(String b)
        {
            this.b = b;
        }

        public String getC()
        {
            return c;
        }

        public void setC(String c)
        {
            this.c = c;
        }
    }

    List<Item> testListA = new LinkedList<Item>();
    String sortOrderColumnA = "";


    public ExtendedDataTable()
    {
        for (int cnt = 0; cnt < 100; cnt++)
        {
            Item elem = new Item("col1_"+cnt, "col2_"+cnt, "col3_"+cnt);
            testListA.add(elem);
        }
    }

    public List<Item> getTestListA()
    {
        return testListA;
    }

    public void setTestListA(List<Item> testListA)
    {
        this.testListA = testListA;
    }

    public String getSortOrderColumnA()
    {
        return sortOrderColumnA;
    }

    public void setSortOrderColumnA(String sortOrderColumnA)
    {
        this.sortOrderColumnA = sortOrderColumnA;
    }
}