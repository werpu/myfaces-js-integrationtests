package tomcatrun;

import jakarta.faces.application.Resource;
import jakarta.faces.application.ResourceHandler;
import jakarta.faces.application.ResourceHandlerWrapper;

public class DecoratingResourceHandlerWrapper extends ResourceHandlerWrapper {
    public DecoratingResourceHandlerWrapper(ResourceHandler delegate) {
        super(delegate);
    }

    @Override
    public Resource createResource(String resourceName) {
        if (resourceName.contains("faces.js") || resourceName.contains("faces-development.js")) {
            return new DecoratedFacesJS(super.createResource(resourceName));
        }
        return super.createResource(resourceName);
    }

    @Override
    public Resource createResource(String resourceName, String libraryName) {
        if (resourceName.contains("faces.js") || resourceName.contains("faces-development.js")) {
            return new DecoratedFacesJS(super.createResource(resourceName, libraryName));
        }
        return super.createResource(resourceName, libraryName);
    }

    @Override
    public Resource createResource(String resourceName, String libraryName, String contentType) {
        return super.createResource(resourceName, libraryName, contentType);
    }
}
