package de.cronosx.haushalt;

import android.os.Bundle;
import android.app.Activity;
import android.support.v4.widget.DrawerLayout;
import android.view.Menu;
import android.widget.ArrayAdapter;
import android.widget.ListView;

public class MainActivity extends Activity {

	String[] actions = {"Einloggen", "Beenden"};
	DrawerLayout layDrawer;
	ListView vieList;
	
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

	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

}
