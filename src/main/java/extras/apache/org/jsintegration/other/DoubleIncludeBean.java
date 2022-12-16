package extras.apache.org.jsintegration.other;

import javax.enterprise.context.RequestScoped;
import javax.inject.Named;

@Named
@RequestScoped
public class DoubleIncludeBean {
    private String include = "doubleInclude.xhtml";

    public void addDoubleInclude() {
        include = "doubleInclude.xhtml";
    }

    public String getInclude() {
        return include;
    }

    public void setInclude(String include) {
        this.include = include;
    }
}
