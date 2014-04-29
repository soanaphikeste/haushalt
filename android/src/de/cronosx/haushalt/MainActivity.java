package de.cronosx.haushalt;

import java.io.IOException;
import java.net.Socket;
import java.net.UnknownHostException;

import org.json.JSONException;
import org.json.JSONObject;

import de.cronosx.haushalt.Websocket.OpenListener;
import de.cronosx.haushalt.Websocket.ResponseListener;
import android.os.AsyncTask;
import android.os.Bundle;
import android.app.Activity;
import android.content.res.Configuration;
import android.support.v4.app.ActionBarDrawerToggle;
import android.support.v4.app.Fragment;
import android.support.v4.widget.DrawerLayout;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
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

	String[] actions = {"Einloggen", "Beenden"};
	DrawerLayout layoutDrawer;
	ListView viewList;
	Fragment fragCurrent;
	ActionBarDrawerToggle drawerToggle;

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

        drawerToggle = new ActionBarDrawerToggle(this, layoutDrawer,
                R.drawable.ic_launcher, R.string.drawer_open, R.string.drawer_close) {

            /** Called when a drawer has settled in a completely closed state. */
            public void onDrawerClosed(View view) {
                super.onDrawerClosed(view);
                getActionBar().setTitle("No Menu");//fragCurrent.getTag());
                invalidateOptionsMenu(); // creates call to onPrepareOptionsMenu()
            }

            /** Called when a drawer has settled in a completely open state. */
            public void onDrawerOpened(View drawerView) {
                super.onDrawerOpened(drawerView);
                getActionBar().setTitle(getResources().getText(R.string.drawer_title));
                invalidateOptionsMenu(); // creates call to onPrepareOptionsMenu()
            }
        };

        // Set the drawer toggle as the DrawerListener
        layoutDrawer.setDrawerListener(drawerToggle);

        

//		connect();
	}
	
	private void connect() {

		final String host = "localhost";
		final int port = 5560;
		(new AsyncTask<Void, Void, Void>(){

			@Override
			protected Void doInBackground(Void... params) {
				try {
					Socket s = new Socket(host, port);
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
				return null;
			}
			
		}).execute();
		
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
	
	 @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
        // Sync the toggle state after onRestoreInstanceState has occurred.
        drawerToggle.syncState();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        drawerToggle.onConfigurationChanged(newConfig);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Pass the event to ActionBarDrawerToggle, if it returns
        // true, then it has handled the app icon touch event
        if (drawerToggle.onOptionsItemSelected(item)) {
          return true;
        }
        // Handle your other action bar items...

        return super.onOptionsItemSelected(item);
    }

	    
	@Override
	public boolean onPrepareOptionsMenu (Menu menu){
		//TODO Menue besetzen
		return super.onPrepareOptionsMenu(menu);
	}
	
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

}
