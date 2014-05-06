package de.cronosx.haushalt.contents;

import android.app.Fragment;
import android.content.Context;
import android.view.Menu;


public abstract class DisplayFragment extends Fragment {

	public abstract String getTitle(Context context);
	public abstract Menu getOptionsMenu(Context context, Menu m);
	
	public void onCreateView() {
		// TODO things for all DisplayFragments
		
	}
}
