package de.cronosx.haushalt.contents;

import android.support.v4.app.Fragment;
import android.view.Menu;


public abstract class DisplayFragment extends Fragment {

	public abstract String getTitle();
	public abstract Menu getOptionsMenu(Menu m);
	
	public void onCreateView() {
		// TODO things for all DisplayFragments
		
	}
}
