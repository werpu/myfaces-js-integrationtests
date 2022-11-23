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

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import java.time.Duration;

public class WebdriverTesting {
    public static void main(String ... argv) {
        // if chrome is not in your path you have to take care that the build system loads it and then set the driver
        // to its path (aka containers for instance do not have it preinstalled)
        // System.setProperty("webdriver.chrome.driver", <path to chrome in your testing environment>);
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        // this disables any gpu output so that the driver runs chrome in a headless environment
        options.addArguments("--headless");
        options.addArguments("--disable-gpu");
        WebDriver driver = new ChromeDriver(options);
        try {
            // to kiss, we just fetch the page from a running server and then check for errors by hitting one of the test buttons
            // which triggers the ajax cycle
            driver.manage().timeouts().implicitlyWait(Duration.ofMillis(500));
            driver.get("http://localhost:8080/IntegrationJSTest/experimental/htmlunit.jsf");
            WebElement cmdEvl = driver.findElement(By.id("cmd_eval"));
            WebElement evalArea = driver.findElement(By.id("evalarea1"));

            cmdEvl.click();
            Thread.sleep(1000);
            System.out.println(evalArea.getText().equals("eval test succeeded"));
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } finally {
            driver.close();
        }
    }
}
