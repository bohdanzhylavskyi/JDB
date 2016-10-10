
import com.sun.net.httpserver.*;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.URI;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Created by bod on 9/26/16.
 */
public class Server {
    public static void main(String[] args) {
        LinkedHashMap hm = new LinkedHashMap();
        hm.put("rows", new LinkedHashMap());
        try {
            HttpServer server = HttpServer.create();
            server.bind(new InetSocketAddress(8888), 0);
            server.createContext("/", new MyHandler());
            server.start();
            System.out.println("Server is listening....");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    private static class RootHandler implements HttpHandler {

        @Override
        public void handle(HttpExchange t) throws IOException {
            String resp = "Drago is cool";
            t.sendResponseHeaders(200, resp.length());
            OutputStream os = t.getResponseBody();
            os.write(resp.getBytes());
            os.close();

        }
    }
    static class MyHandler implements HttpHandler {
        public void handle(HttpExchange t) throws IOException {
            String root = "/home/bod/projects/jdb";
            URI uri = t.getRequestURI();
            String path = uri.getPath();
            File file = new File(root + path).getCanonicalFile();


            DBConn mydb = new DBConn();
            mydb.DBname = "users";

            if("POST".equals(t.getRequestMethod())) {
                switch (t.getRequestURI().getPath()) {
                    case "/updaterow": {
                        System.out.println(t.getRequestURI().getPath());
                        System.out.println("Was update Row");
                        InputStreamReader isr = new InputStreamReader(t.getRequestBody(), "utf-8");
                        String params = new BufferedReader(isr).readLine();
                        try {
                            JSONObject obj = new JSONObject(params);
                            System.out.println(obj.toString());
                            mydb.updateRow((String) obj.get("tableName"), obj);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        break;
                    }
                    case "/getrows": {
                        System.out.println("WAs get rows");
                        InputStreamReader isr = new InputStreamReader(t.getRequestBody(), "utf-8");
                        String params = new BufferedReader(isr).readLine();
                        System.out.println(params);
                        JSONObject obj = null;
                        try {
                            obj = new JSONObject(params);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        System.out.println(obj);

                        try {
                            t.sendResponseHeaders(200, mydb.getRows((String) obj.get("tableName"), null).toString().length());
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        OutputStream os = t.getResponseBody();
                        try {
                            os.write(mydb.getRows((String) obj.get("tableName"), null).toString().getBytes());
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        os.close();
                        return;
                    }
                    case "/addrow": {
                        System.out.println("WAs get rows");
                        InputStreamReader isr = new InputStreamReader(t.getRequestBody(), "utf-8");
                        String params = new BufferedReader(isr).readLine();
                        JSONObject obj = null;
                        try {
                            obj = new JSONObject(params);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        try {
                            mydb.createRow((String) obj.get("tableName"));
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        try {
                            t.sendResponseHeaders(200, mydb.getRows((String) obj.get("tableName"), null).toString().length());
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        OutputStream os = t.getResponseBody();
                        try {
                            os.write(mydb.getRows((String) obj.get("tableName"), null).toString().getBytes());
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        os.close();
                        return;
                    }
                    case "/removerows": {
                        InputStreamReader isr = new InputStreamReader(t.getRequestBody(), "utf-8");
                        String params = new BufferedReader(isr).readLine();
                        JSONObject obj = null;
                        try {
                            obj = new JSONObject(params);
                            System.out.println(obj.toString());
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        try {
                            mydb.removeRows((String) obj.get("tableName"), obj);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        try {
                            t.sendResponseHeaders(200, mydb.getRows((String) obj.get("tableName"), null).toString().length());
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        OutputStream os = t.getResponseBody();
                        try {
                            os.write(mydb.getRows((String) obj.get("tableName"), null).toString().getBytes());
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                        os.close();
                        return;
                    }
                    case "/gettables": {
                        t.sendResponseHeaders(200, mydb.getTables().toString().length());
                        OutputStream os = t.getResponseBody();
                        os.write(mydb.getTables().toString().getBytes());
                        os.close();
                    }
                    case "/gfrows": {
                        InputStreamReader isr = new InputStreamReader(t.getRequestBody(), "utf-8");
                        String params = new BufferedReader(isr).readLine();
                        JSONObject obj = null;
                        try {
                            obj = new JSONObject(params);
//                            t.sendResponseHeaders(200, mydb.getFilteredRows((String) obj.get("tableName"), obj).toString().length());
                            JSONObject jsnResp = mydb.getFilteredRows(obj.getString("tableName"), obj);
                            t.sendResponseHeaders(200, jsnResp.toString().length());
                            OutputStream os = t.getResponseBody();

//                            os.write(mydb.getRows((String) obj.get("tableName")).toString().getBytes());
                            os.write(jsnResp.toString().getBytes());
                            os.close();
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }
            }

            if (!file.isFile()) {
                // Object does not exist or is not a file: reject with 404 error.
                String response = "404 (Not Found)\n";
                t.sendResponseHeaders(404, response.length());
                OutputStream os = t.getResponseBody();
                os.write(response.getBytes());
                os.close();
            } else {
                // Object exists and is a file: accept with response code 200.
                String mime = "text/html";
                if(path.substring(path.length()-3).equals(".js")) mime = "application/javascript";
                if(path.substring(path.length()-3).equals("css")) mime = "text/css";

                Headers h = t.getResponseHeaders();
                h.set("Content-Type", mime);
                t.sendResponseHeaders(200, 0);

                OutputStream os = t.getResponseBody();
                FileInputStream fs = new FileInputStream(file);
                final byte[] buffer = new byte[0x10000];
                int count = 0;
                while ((count = fs.read(buffer)) >= 0) {
                    os.write(buffer,0,count);
                }
                fs.close();
                os.close();
            }
        }
    }
}
