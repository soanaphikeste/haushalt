package de.cronosx.haushalt;

import java.io.IOException;
import java.net.Socket;
import java.net.UnknownHostException;
import java.util.Properties;

import de.cronosx.haushalt.Websocket.OpenListener;
import de.cronosx.haushalt.contents.DisplayFragment;
import de.cronosx.haushalt.contents.LoginFragment;
import android.os.Bundle;
import android.app.Activity;
import android.app.Fragment;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.support.v4.app.ActionBarDrawerToggle;
import android.support.v4.widget.DrawerLayout;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.FrameLayout;
import android.widget.ListAdapter;
import android.widget.ListView;

public class MainActivity extends Activity {

	public static final String SAVE_NAME = "user_name";
	public static final String SAVE_PASSWD = "user_passwd";
	
	public static Websocket websocket;

	static{
		try {
			Properties prop = new Properties();
			prop.load(StaticContextApplication.context.getResources().openRawResource(R.raw.server));
			websocket = new Websocket(new Socket(prop.getProperty("host"), Integer.parseInt(prop.getProperty("port"))));
		}
		catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	String[] actions = {"Einloggen", "Beenden"};
	DrawerLayout layoutDrawer;
	//FrameLayout layoutFrag;
	ListView viewList;
	DisplayFragment fragCurrent;
	ActionBarDrawerToggle drawerToggle;
	
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		setContentView(R.layout.activity_main);
		
		//layoutFrag = (FrameLayout) findViewById(R.id.main_content_frame);
		layoutDrawer = (DrawerLayout) findViewById(R.id.main_drawer_layout);
        viewList = (ListView) findViewById(R.id.main_menu_drawer);

        // Set the adapter for the list view
        ListAdapter adapter = new ArrayAdapter<String>(this, R.layout.drawer_list_item, actions);
        viewList.setAdapter(adapter);
        
        // Set the list's click listener
        viewList.setOnItemClickListener(new ListView.OnItemClickListener() {
    	    @Override
    	    public void onItemClick(AdapterView parent, View view, int position, long id) {
    	    	selectItem(position);
    	    }
    	});

        drawerToggle = new ActionBarDrawerToggle(this, layoutDrawer, R.drawable.ic_drawer, R.string.drawer_open, R.string.drawer_close) {

            /** Called when a drawer has settled in a completely closed state. */
            public void onDrawerClosed(View view) {
                super.onDrawerClosed(view);
                setTitle(fragCurrent.getTitle(MainActivity.this));
                invalidateOptionsMenu(); // creates call to onPrepareOptionsMenu()
            }

            /** Called when a drawer has settled in a completely open state. */
            public void onDrawerOpened(View drawerView) {
                super.onDrawerOpened(drawerView);
                setTitle(getResources().getText(R.string.drawer_title));
                invalidateOptionsMenu(); // creates call to onPrepareOptionsMenu()
            }
        };

        // Set the drawer toggle as the DrawerListener
        layoutDrawer.setDrawerListener(drawerToggle);

        getActionBar().setDisplayHomeAsUpEnabled(true);
        getActionBar().setHomeButtonEnabled(true);

        DisplayFragment frag = new LoginFragment();
        setTitle(frag.getTitle(this));
        getFragmentManager().beginTransaction().add(R.id.main_content_frame, frag).commit();
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
	    getActionBar().setTitle(title);
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
//		if(!layoutDrawer.isDrawerOpen(viewList)){
//			fragCurrent.getOptionsMenu(this, menu);
//		}
//		else{
//			onCreateOptionsMenu(menu);
//		}
		
		return super.onPrepareOptionsMenu(menu);
	}
	
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

}
