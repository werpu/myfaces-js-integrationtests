package tomcatrun;

import jakarta.faces.application.Resource;
import jakarta.faces.application.ResourceHandler;
import jakarta.faces.application.ResourceHandlerWrapper;

public class DecoratingResourceWrapper extends ResourceHandlerWrapper {
    public DecoratingResourceWrapper(ResourceHandler delegate) {
        super(delegate);
    }

    @Override
    public Resource createResource(String resourceName) {
        if (resourceName.contains("jsf.js") || resourceName.contains("faces-development.js")) {
            return new DecoratedFacesJS(super.createResource(resourceName));
        }
        return super.createResource(resourceName);
    }

    @Override
    public Resource createResource(String resourceName, String libraryName) {
        if (resourceName.contains("jsf.js") || resourceName.contains("faces-development.js")) {
            return new DecoratedFacesJS(super.createResource(resourceName, libraryName));
        }
        return super.createResource(resourceName, libraryName);
    }

    @Override
    public Resource createResource(String resourceName, String libraryName, String contentType) {
        return super.createResource(resourceName, libraryName, contentType);
    }
}
