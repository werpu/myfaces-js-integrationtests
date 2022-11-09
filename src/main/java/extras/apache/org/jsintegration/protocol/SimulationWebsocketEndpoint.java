package extras.apache.org.jsintegration.protocol;

import jakarta.websocket.*;
import jakarta.websocket.server.ServerEndpoint;

import java.io.IOException;
import java.util.Timer;
import java.util.TimerTask;

@ServerEndpoint("/simulatedendpoint")
public class SimulationWebsocketEndpoint {
    @OnOpen
    public void onOpen(final Session session) {
        System.out.println("OnOpen");
        TimerTask timerTask = new TimerTask() {
            public void run() {
                try {
                    session.getBasicRemote().sendText("\"hello from push notification\"");
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        };
        Timer timer = new Timer(true);
        timer.schedule(timerTask, 500); //we run after 500ms delay
    }
    @OnClose
    public void onClose(final Session session) {
        System.out.println("closed");
    }
    @OnMessage
    public void onMessage(final String message, final Session session) {
        System.out.println("onMessage");
        //not used in push
    }
    @OnError
    public void onError(Throwable e) {
        e.printStackTrace();
    }
}
