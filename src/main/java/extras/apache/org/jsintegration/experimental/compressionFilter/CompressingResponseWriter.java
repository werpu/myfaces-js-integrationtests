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

import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */

public class CompressingResponseWriter extends PrintWriter
{
    PrintWriter originalWriter = null;
    StringWriter targetWriter = new StringWriter();

    
    public CompressingResponseWriter(Writer writer, StringWriter targetWriter)
    {
        super(targetWriter);
        originalWriter = (PrintWriter) writer;
        this.targetWriter = targetWriter;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException
    {
        return super.clone();
    }

    @Override
    public void flush()
    {
        fixBuffer();
        super.flush();
    }

    @Override
    public void close()
    {
        fixBuffer();
        super.close();
    }

    private void fixBuffer()
    {
        targetWriter.flush();
        String finalStr = targetWriter.toString();
        
        int headStart = finalStr.indexOf("<head>");
        if(headStart == -1) {
            originalWriter.write(finalStr);
            originalWriter.flush();
            originalWriter.close();
            return;
        }
        int headEnd = finalStr.indexOf("</head>");
        String prefix = finalStr.substring(0,headStart);
        String head = finalStr.substring(headStart, headEnd);
        String body = finalStr.substring(headEnd);
        head = head.replaceAll(">[\\s\\n]+<","><");
        head = head.replaceAll("<!\\-\\-[\\s\\n]+(\\/\\/)?\\-\\->","");
        body = body.replaceAll(">[\\s]+<","> <");
        originalWriter.write(prefix);
        originalWriter.write(head);
        originalWriter.write(body);
        originalWriter.flush();
        originalWriter.close();
    }
}
