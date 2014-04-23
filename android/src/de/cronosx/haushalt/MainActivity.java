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
import android.util.Log;
import android.view.Menu;

public class MainActivity extends Activity {

	public static Websocket websocket;
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
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
		
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

}
