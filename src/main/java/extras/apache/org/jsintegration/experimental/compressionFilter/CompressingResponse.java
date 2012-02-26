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

package extras.apache.org.jsintegration.experimental.compressionFilter;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */

public class CompressingResponse extends HttpServletResponseWrapper
{
    static final String REQ_KEY = "CPR_WRITER";
    PrintWriter mappedWriter = null;
    
    public CompressingResponse(HttpServletResponse httpServletResponse)
    {
        super(httpServletResponse);
    }

    @Override
    public PrintWriter getWriter() throws IOException
    {
        //the response object lives exactly one request
        if(mappedWriter == null) {
            mappedWriter = new CompressingResponseWriter(super.getWriter(), new StringWriter());
        }
        return mappedWriter;
    }
}
