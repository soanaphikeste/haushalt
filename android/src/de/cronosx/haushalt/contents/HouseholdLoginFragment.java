package de.cronosx.haushalt.contents;

import de.cronosx.haushalt.R;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.View;
import android.view.ViewGroup;


public class HouseholdLoginFragment extends DisplayFragment {

	 public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
		        // Inflate the layout for this fragment
		 
		 
	    return inflater.inflate(R.layout.household_login_fragment, container, false);
	}


	@Override
	public String getTitle() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Menu getOptionsMenu(Menu m) {
		// TODO Auto-generated method stub
		return null;
	}

}
