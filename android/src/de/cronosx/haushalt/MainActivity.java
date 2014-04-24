package de.cronosx.haushalt;

import java.io.IOException;
import java.net.Socket;
import java.net.UnknownHostException;

import org.json.JSONException;
import org.json.JSONObject;

import de.cronosx.haushalt.Websocket.OpenListener;
import de.cronosx.haushalt.Websocket.ResponseListener;

import android.os.Bundle;
import android.app.Activity;
<<<<<<< HEAD
import android.support.v4.widget.DrawerLayout;
=======
import android.util.Log;
>>>>>>> refs/remotes/origin/master
import android.view.Menu;
import android.widget.ArrayAdapter;
import android.widget.ListView;

public class MainActivity extends Activity {


	String[] actions = {"Einloggen", "Beenden"};
	DrawerLayout layDrawer;
	ListView vieList;

	public static Websocket websocket;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

		Websocket.connect();
		
		layDrawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        vieList = (ListView) findViewById(R.id.menu_drawer);

        // Set the adapter for the list view
        vieList.setAdapter(new ArrayAdapter<String>(this,
                R.layout.drawer_list_item, actions));
        // Set the list's click listener
        mDrawerList.setOnItemClickListener(new DrawerItemClickListener());


		connect();
	}
	
	private void connect() {
		try {
			Socket s = new Socket("localhost", 5560);
			websocket = new Websocket(s);
		} 
		catch (UnknownHostException e) {
			e.printStackTrace();
		} 
		catch (IOException e) {
			e.printStackTrace();
		}
		websocket.addOpenListener(new OpenListener() {
			@Override
			public void onOpen() {
				System.out.println("Connected!");
				try {
					JSONObject jObj = new JSONObject();
					jObj.put("name", "Test");
					jObj.put("password", "123");
					websocket.send("Login", jObj, new ResponseListener() {
						@Override
						public void onResponse(JSONObject jObj) {
							Log.d("Answer", "Received answer: " + jObj.toString());
						}
						
					});
				} 
				catch (JSONException e) {
					e.printStackTrace();
				}
			}
		});
		
>>>>>>> refs/remotes/origin/master
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

}
