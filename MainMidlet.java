import javax.microedition.midlet.*;
import javax.microedition.lcdui.*;

public class MainMidlet extends MIDlet {

    private Display display;
    private Form form;

    public void startApp() {
        display = Display.getDisplay(this);
        form = new Form("Mizan Pro");
        form.append("J2ME Build System Active");
        display.setCurrent(form);
    }

    public void pauseApp() {}
    public void destroyApp(boolean unconditional) {}
}