/*
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
 */
package htmlunit;

import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.DomElement;
import com.gargoylesoftware.htmlunit.html.HtmlPage;

import java.io.IOException;

/**
 * Same as our webdriver test
 * but now in html unit to determine the deficiencies of html unit
 * compared to the headless chromium engine webdriver uses
 */
public class HtmlUnitTesting {
    public static void main(String ... argv) {
        try (final WebClient webClient = new WebClient()) {
            final HtmlPage page = webClient.getPage("http://localhost:8080/IntegrationJSTest/experimental/htmlunit.jsf");
            DomElement evlCmd = page.getElementById("cmd_eval");
            DomElement evalArea = page.getElementById("evalarea1");
            evlCmd.click();
            Thread.sleep(1000);
            System.out.println(evalArea.getTextContent().equals("eval test succeeded"));
        } catch (InterruptedException | IOException e) {
            throw new RuntimeException(e);
        }
    }
}
