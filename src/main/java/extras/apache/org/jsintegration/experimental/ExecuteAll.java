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

package extras.apache.org.jsintegration.experimental;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;
import java.util.logging.Logger;

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */

@ManagedBean
@RequestScoped
public class ExecuteAll
{
    String val1 = "val1";
    String val2 = "val2";

    public String doNav1() {
        return null;
    }
    
    public String doNav2() {
        Logger log = Logger.getLogger(ExecuteAll.class.getName());
        log.info(val1);
        log.info(val2);
        return null;
    }
    
    public String getVal1()
    {
        return val1;
    }

    public void setVal1(String val1)
    {
        this.val1 = val1;
    }

    public String getVal2()
    {
        return val2;
    }

    public void setVal2(String val2)
    {
        this.val2 = val2;
    }
}
