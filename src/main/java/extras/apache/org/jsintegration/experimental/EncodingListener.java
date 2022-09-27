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

import jakarta.faces.component.EditableValueHolder;
import jakarta.faces.component.UIComponent;
import jakarta.faces.context.FacesContext;
import jakarta.faces.event.PhaseEvent;
import jakarta.faces.event.PhaseId;
import jakarta.faces.event.PhaseListener;
import java.util.*;

/**
 * @author Werner Punz Irian GmbH www.irian.at (latest modification by $Author$)
 * @version $Revision$ $Date$
 *          <p/>
 *          we apply the request values now post restore state
 *          (which always will happen since we are basically
 *          in an ajax request)
 */

public class EncodingListener implements PhaseListener
{

    void findComponent(Set<String> clientIdx, Set<UIComponent> componentsFound, UIComponent root)
    {
        if (componentsFound.size() == clientIdx.size()) return;

        if (clientIdx.contains(root.getClientId())) componentsFound.add(root);
        Iterator<UIComponent> facetsAndChilds = root.getFacetsAndChildren();
        while (facetsAndChilds.hasNext())
        {
            findComponent(clientIdx, componentsFound, facetsAndChilds.next());
            if (componentsFound.size() == clientIdx.size()) return;
        }
    }

    public void afterPhase(PhaseEvent event)
    {
        Set<String> idIdx = getIdIdx();
        if (idIdx == null) return;
        UIComponent component = FacesContext.getCurrentInstance().getViewRoot();

        FacesContext facesContext = FacesContext.getCurrentInstance();
        Set<UIComponent> resultComponents = new HashSet<UIComponent>();
        findComponent(idIdx, resultComponents, FacesContext.getCurrentInstance().getViewRoot());
        for (UIComponent resultComponent : resultComponents)
        {
            if (resultComponent instanceof EditableValueHolder)
            {
                ((EditableValueHolder) resultComponent).setSubmittedValue(facesContext.getExternalContext()
                        .getRequestParameterMap().get(resultComponent.getClientId(facesContext)));
            }
        }
    }

    public void beforePhase(PhaseEvent event)
    {

    }

    public PhaseId getPhaseId()
    {
        return PhaseId.APPLY_REQUEST_VALUES;
    }

    private static final String MANUALAPPLY_KEY = "org.apache.myfaces.manualApplyValues";

    private final Set<String> getIdIdx()
    {
        FacesContext facesContext = FacesContext.getCurrentInstance();
        Map<String, String> reqMap = facesContext.getExternalContext().getRequestParameterMap();
        if (!reqMap.containsKey(MANUALAPPLY_KEY)) return null;
        Set<String> idIdx = (Set<String>) facesContext.getAttributes().get(MANUALAPPLY_KEY);
        if (idIdx == null)
        {
            String allowedIds = reqMap.get(MANUALAPPLY_KEY);
            String[] splitAllowedIds = allowedIds.split("\\s+");
            idIdx = new HashSet<String>(Arrays.asList(splitAllowedIds));
            FacesContext.getCurrentInstance().getAttributes().put(MANUALAPPLY_KEY, idIdx);
        }
        return idIdx;
    }

}
