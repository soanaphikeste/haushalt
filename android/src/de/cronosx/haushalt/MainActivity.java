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
import android.support.v4.app.Fragment;
import android.support.v4.widget.DrawerLayout;
import android.util.Log;
import android.view.Menu;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;

public class MainActivity extends Activity {

	private class DrawerItemClickListener implements ListView.OnItemClickListener {
	    @Override
	    public void onItemClick(AdapterView parent, View view, int position, long id) {
	        selectItem(position);
	    }
	}

	/** Swaps fragments in the main content view */
	private void selectItem(int position) {
	    // Create a new fragment and specify the planet to show based on position
//	    Fragment fragment = new PlanetFragment();
//	    Bundle args = new Bundle();
//	    args.putInt(PlanetFragment.ARG_PLANET_NUMBER, position);
//	    fragment.setArguments(args);
//
//	    // Insert the fragment by replacing any existing fragment
//	    FragmentManager fragmentManager = getFragmentManager();
//	    fragmentManager.beginTransaction()
//	                   .replace(R.id.content_frame, fragment)
//	                   .commit();
//
//	    // Highlight the selected item, update the title, and close the drawer
//	    mDrawerList.setItemChecked(position, true);
//	    setTitle(mPlanetTitles[position]);
//	    mDrawerLayout.closeDrawer(mDrawerList);
	}

	@Override
	public void setTitle(CharSequence title) {
//	    mTitle = title;
//	    getActionBar().setTitle(mTitle);
	}


	String[] actions = {"Einloggen", "Beenden"};
	DrawerLayout layoutDrawer;
	ListView viewList;

	public static Websocket websocket;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);

//		Websocket.connect();
		
		layoutDrawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        viewList = (ListView) findViewById(R.id.menu_drawer);

        // Set the adapter for the list view
        viewList.setAdapter(new ArrayAdapter<String>(this,
                R.layout.drawer_list_item, actions));
        // Set the list's click listener
        viewList.setOnItemClickListener(new DrawerItemClickListener());


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
