package tomcatrun;

import java.io.File;

import org.apache.catalina.WebResourceRoot;
import org.apache.catalina.core.StandardContext;
import org.apache.catalina.startup.Tomcat;
import org.apache.catalina.webresources.DirResourceSet;
import org.apache.catalina.webresources.StandardRoot;

public class Main {

	private static final String CLASSES_DIR = "target/classes";
	private static final String WEBAPP = "src/main/webapp/";
    private static final String webxmlDirLocation = "src/main/webapp/WEB-INF/web.xml";
    private static final String DEFAULT_PORT = "8080";

	public static void main(String[] args) throws Exception {

        String webappDirLocation = WEBAPP;
        Tomcat tomcat = new Tomcat();

        //The port that we should run on can be set into an environment variable
        //Look for that variable and default to 8080 if it isn't there.
        String webPort = System.getenv("PORT");
        if(webPort == null || webPort.isEmpty()) {
            webPort = DEFAULT_PORT;
        }

        tomcat.setPort(Integer.valueOf(webPort));

        StandardContext ctx = (StandardContext) tomcat.addWebapp("/IntegrationJSTest", new File(webappDirLocation).getAbsolutePath());

        File additionWebInfClasses = new File(CLASSES_DIR);
        WebResourceRoot resources = new StandardRoot(ctx);
        resources.addPreResources(new DirResourceSet(resources, "/WEB-INF/classes",
                additionWebInfClasses.getAbsolutePath(), "/"));
        ctx.setResources(resources);
        ctx.setDefaultWebXml(new File(webxmlDirLocation).getAbsolutePath());
        tomcat.getServer().setParentClassLoader(Thread.currentThread().getContextClassLoader());
        tomcat.getConnector(); // to init the connector
        tomcat.start();
        tomcat.getServer().await();
    }
}