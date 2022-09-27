package extras.apache.org.jsintegration.other;



import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Named;
import jakarta.servlet.http.Part;

@Named
@RequestScoped
public class Fileupload {

    private Part uploaded;
    private Part uploaded2;


    private String msg = "";


    public Part getUploaded2() {
        return uploaded2;
    }

    public void setUploaded2(Part uploaded2) {
        this.uploaded2 = uploaded2;
    }

    public void setUploaded(Part uploadedFile) {
        this.uploaded = uploadedFile;
    }

    public Part getUploaded() {
        return uploaded;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public void doUpload() {
        if(uploaded != null && uploaded2 != null) {
            msg = "success";
        }
    }
}
