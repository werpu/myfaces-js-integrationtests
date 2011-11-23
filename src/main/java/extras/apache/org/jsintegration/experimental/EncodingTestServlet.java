package extras.apache.org.jsintegration.experimental;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.logging.Logger;

/**
 * @author Werner Punz (latest modification by $Author$)
 * @version $Revision$ $Date$
 */

public class EncodingTestServlet extends HttpServlet
{

    @Override
    protected void service(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws ServletException, IOException
    {
        httpServletRequest.setCharacterEncoding("utf-8");
        httpServletResponse.setCharacterEncoding("ISO-8859-1");

        String value = httpServletRequest.getParameter("inputtext");
        String saveState = httpServletRequest.getParameter("javax.faces.ViewState");

        Logger logger = Logger.getLogger(EncodingTestServlet.class.getName());
        logger.info("called");


        httpServletResponse.setStatus(200);

    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        service(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
    {
        service(request, response);
    }
}
