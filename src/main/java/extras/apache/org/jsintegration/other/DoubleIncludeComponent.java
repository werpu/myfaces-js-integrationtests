package extras.apache.org.jsintegration.other;

import javax.faces.application.ResourceDependencies;
import javax.faces.application.ResourceDependency;
import javax.faces.component.FacesComponent;
import javax.faces.component.UIOutput;

@FacesComponent(createTag=true)
@ResourceDependencies({
        @ResourceDependency(library="fixtures", name="include.js"),
        @ResourceDependency(library="fixtures", name="includestyles.css")
})
public class DoubleIncludeComponent extends UIOutput {
}
