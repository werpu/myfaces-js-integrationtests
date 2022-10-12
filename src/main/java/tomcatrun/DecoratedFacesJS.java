package tomcatrun;

import jakarta.faces.application.Resource;
import jakarta.faces.context.FacesContext;

import java.io.*;
import java.net.URL;
import java.util.Map;

public class DecoratedFacesJS extends Resource {

    Resource delegate;

    public DecoratedFacesJS(Resource delegate) {
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
                    .map(line -> {
                        //we theoretically could replace this with an el resolver
                        //but for now checking for the exact pattern suffices
                        String PATTERN = "#{facesContext.externalContext.requestContextPath}";
                        return line != null && line.contains(PATTERN) ? line.replace(PATTERN, FacesContext.getCurrentInstance().getExternalContext().getRequestContextPath()) : line;
                    }).forEach(line -> {
                        try {
                            writer.write(line.getBytes());
                            writer.write("\n".getBytes());
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    });
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
