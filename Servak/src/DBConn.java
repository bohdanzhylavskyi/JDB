

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.sql.*;
/**
 * Created by bod on 10/1/16.
 */
public class DBConn {
    public static String DBname = "users";
    private java.sql.Connection conn;
    public void connect() {
        try {
            Class.forName("com.mysql.jdbc.Driver").newInstance();
            String url = "jdbc:mysql://localhost:3306/" + DBname;
            conn = DriverManager.getConnection(url, "root", "19971809");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public void createRow(String TableName) {
        connect();
        Statement stm = null;
        try {
            stm = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            stm.executeUpdate ("INSERT INTO " + TableName + " VALUES()");
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public JSONObject getRows(String TableName, String filterQuery) {
        JSONObject jsn = new JSONObject();
        JSONArray jsnArr = new JSONArray();
        try {
            connect();
            Statement stm = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);

            ResultSet res = null;
            if(filterQuery == null) {
                res = stm.executeQuery("SELECT * FROM " + TableName);
            } else {
                res = stm.executeQuery(filterQuery);
            }

            int count = res.getMetaData().getColumnCount();
            while(res.next()) {
                JSONObject jsnO = new JSONObject();
                for(int i = 1; i<=count; i++) {
                    jsnO.put(res.getMetaData().getColumnLabel(i), res.getString(i));
                }
                jsnArr.put(jsnO);
            }

            jsn.put("rows", jsnArr);
            stm.close();
            conn.close();
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsn;
    }
    public void updateRow(String TableName, JSONObject jsn) {
        connect();
        try {
            Statement stm = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            try {
                String query = "UPDATE " + TableName + " set " + jsn.get("column") + "=\"" + jsn.get("value") + "\" where id=" + jsn.get("id") + "";
                stm.executeUpdate (query);
                stm.close();
                conn.close();
            } catch (JSONException e) {
                e.printStackTrace();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    public void removeRows(String TableName, JSONObject jsn) {
        try {
            JSONArray jsnArr = (JSONArray) jsn.get("rowsToDelete");
            String query = "DELETE FROM " + TableName + " where ";

            for(int i=0; i<jsnArr.length(); i++) {
                query = query + "id=" + jsnArr.get(i);
                if(i<jsnArr.length()-1) {
                    query+=" OR ";
                }
            }

            connect();

            try {
                Statement stm = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
                stm.executeUpdate (query);
                stm.close();
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
    public JSONObject getTables() {
        JSONObject jsn = new JSONObject();
        JSONArray jsnArr = new JSONArray();

        connect();
        try {
            DatabaseMetaData md = conn.getMetaData();
            ResultSet rs = md.getTables(null, null, "%", null);
            while (rs.next()) {
                jsnArr.put(rs.getString(3));
            }
            jsn.put("tables", jsnArr);
        } catch (SQLException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsn;
    }
    public JSONObject getFilteredRows(String TableName, JSONObject obj) {
        String query = "SELECT * FROM " + TableName + " where ";
        try {
            JSONArray jsnArr = (JSONArray) obj.get("filters");
            for(int i=0; i<jsnArr.length(); i++) {
                JSONObject temp = (JSONObject) jsnArr.get(i);
                query = query + temp.get("column") + " "+ temp.get("mark") + " " + "\"" + temp.get("value") + "\"";
                if(i<jsnArr.length()-1) {
                    query+=" OR ";
                }
            }
            return getRows(TableName, query);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return new JSONObject();
    }
}
