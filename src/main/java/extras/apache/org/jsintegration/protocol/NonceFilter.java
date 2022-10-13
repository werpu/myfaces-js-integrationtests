/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package extras.apache.org.jsintegration.protocol;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Special security policy for our nonce tests, should
 * only be active on those pages
 */
public class NonceFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        Filter.super.init(filterConfig);
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        if(((HttpServletRequest) servletRequest).getRequestURI().contains("-nonce.jsf")) {
            ((HttpServletResponse)servletResponse).setHeader("Content-Security-Policy", "script-src 'self' 'nonce-test123' ");
        }
        filterChain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {
        Filter.super.destroy();
    }
}
