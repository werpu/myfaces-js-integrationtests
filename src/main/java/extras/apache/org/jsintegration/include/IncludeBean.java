package extras.apache.org.jsintegration.include;

import jakarta.faces.view.ViewScoped;
import jakarta.inject.Named;

import java.io.Serializable;

@Named("includeBean")
@ViewScoped
public class IncludeBean implements Serializable {

    public static final String PAGE_1 = "./fixtures/page1.xhtml";
    public static final String PAGE_2 = "./fixtures/page2.xhtml";

    private String currentPage = PAGE_1;


    public String doSwitchPage() {
        if(currentPage.equals(PAGE_1)) {
            this.currentPage = PAGE_2;
        } else {
            this.currentPage = PAGE_1;
        }
        return "success";
    }

    public String getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(String currentPage) {
        this.currentPage = currentPage;
    }
}
