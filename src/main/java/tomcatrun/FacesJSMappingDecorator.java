/* Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to you under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package tomcatrun;

import jakarta.faces.application.Resource;
import jakarta.faces.context.ExternalContext;
import jakarta.faces.context.FacesContext;
import jakarta.servlet.ServletContext;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.catalina.util.ParameterMap;

import java.io.*;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

public class FacesJSMappingDecorator extends Resource {

    public static final String URL_ENCODING = "UTF-8";
    Resource delegate;

    public FacesJSMappingDecorator(Resource delegate) {
        this.delegate = delegate;
    }

    @Override
    public InputStream getInputStream() throws IOException {
        try (
                InputStream inputStream = delegate.getInputStream();
                ByteArrayOutputStream writer = new ByteArrayOutputStream();
        ) {
            new BufferedReader(new InputStreamReader(inputStream))
                    .lines()
                    .forEach(line -> {
                        if(line.contains("//# sourceMappingURL=")) {
                            return;
                        }
                        try {
                            writer.write(line.getBytes());
                            writer.write("\n".getBytes());
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    });
            //lets add the decoration

            ExternalContext ctx = FacesContext.getCurrentInstance().getExternalContext();
            String requestUri = ((HttpServletRequest) ctx.getRequest()).getRequestURI();
            Map<String, String[]> parameterMap = ((HttpServletRequest) ctx.getRequest()).getParameterMap();

            String parameterString = parameterMap.entrySet().stream().flatMap(item -> {
                if (item.getValue().length <= 1) {
                    try {
                        StringBuilder ret = new StringBuilder();
                        ret.append(URLEncoder.encode(item.getKey(), URL_ENCODING));
                        ret.append("=");
                        if (item.getValue().length == 1) {
                            ret.append(URLEncoder.encode(item.getValue()[0], URL_ENCODING));
                        }
                        return Arrays.stream(new String[]{ret.toString()});
                    } catch (UnsupportedEncodingException e) {
                        throw new RuntimeException(e);
                    }
                } else {
                    return Arrays.stream(item.getValue()).map(value -> {
                        StringBuilder ret = new StringBuilder();
                        try {
                            ret.append(URLEncoder.encode(item.getKey(), URL_ENCODING) + "[]");
                            ret.append("=");
                            ret.append(URLEncoder.encode(value, URL_ENCODING));
                            return ret.toString();
                        } catch (UnsupportedEncodingException e) {
                            throw new RuntimeException(e);
                        }
                    });

                }

            }).collect(Collectors.joining("&"));
            requestUri = requestUri.replace("faces.js", "faces.js.map");
            requestUri = requestUri.replace("faces-development.js", "faces-development.js.map");

            writer.write("\n//# sourceMappingURL=".getBytes());
            writer.write(requestUri.getBytes());
            writer.write("?".getBytes());
            writer.write(parameterString.getBytes());
            return new ByteArrayInputStream(writer.toByteArray());
        }
    }

    @Override
    public String getRequestPath() {
        return delegate.getRequestPath();
    }

    @Override
    public Map<String, String> getResponseHeaders() {
        return delegate.getResponseHeaders();
    }

    @Override
    public URL getURL() {
        return delegate.getURL();
    }

    @Override
    public boolean userAgentNeedsUpdate(FacesContext context) {
        return delegate.userAgentNeedsUpdate(context);
    }
}
