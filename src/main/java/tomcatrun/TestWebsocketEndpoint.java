package tomcatrun;

import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.server.ServerEndpoint;

@ServerEndpoint("/testws")
public class TestWebsocketEndpoint {
    @OnOpen
    public void onOpen() {
        System.out.println("OnOpen");
    }
    @OnClose
    public void onClose() {
        System.out.println("OnOpen");
    }
    @OnMessage
    public String onMessage(String message) {
        System.out.println("Message from the client: " + message);
        String echoMsg = "Echo from the server : " + message;
        return echoMsg;
    }
    @OnError
    public void onError(Throwable e) {
        e.printStackTrace();
    }
}
