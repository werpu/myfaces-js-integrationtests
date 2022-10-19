/*!
 * Licensed to the Apache Software Foundation (ASF) under one or more
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
/**
 * this is a small script
 * which handles the recursive copy, it atm uses the fs-extra module which is under mit license
 * for build purposes.
 *
 * This module can be replaced with custom code if needed.
 *
 */
import * as fse from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
const cwd = process.cwd();


/**
 * a small shim over the fsextra call
 * to recursively copy a directory
 * @param source
 * @param target
 */
function copyFilesRecursively(source: string, target: string)
{
    fse.copySync(path.resolve(cwd, source), path.resolve(cwd, target), {overwrite: true});
    console.log(`${source} sucessfully copied to ${target}`);
}

export const MYFACES_DIR = `${os.homedir()}/IdeaProjects/myfaces_github`;

/**
 * this copies the integration test files to the myfaces installation
 */
copyFilesRecursively('./src/main/javascript', `${MYFACES_DIR}/integration-tests/client/src/main/javascript`);
copyFilesRecursively('./src/main/webapp/integrationtestsjasmine', `${MYFACES_DIR}/integration-tests/client/src/main/webapp/integrationtestsjasmine`);
copyFilesRecursively('./src/main/webapp/resources/myfaces.testscripts/jsf-jasmine', `${MYFACES_DIR}/integration-tests/client/src/main/webapp/resources/myfaces.testscripts/jsf-jasmine`);
copyFilesRecursively('./src/main/webapp/resources/package.json', `${MYFACES_DIR}/integration-tests/client/src/main/webapp/resources/package.json`);
copyFilesRecursively('./src/main/webapp/resources/package-lock.json', `${MYFACES_DIR}/integration-tests/client/src/main/webapp/resources/package-lock.json`);


