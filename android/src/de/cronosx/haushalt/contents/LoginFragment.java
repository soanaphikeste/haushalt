package de.cronosx.haushalt.contents;

import de.cronosx.haushalt.R;
import android.content.Context;
import android.view.Menu;


public class LoginFragment extends DisplayFragment {

	public LoginFragment() {
		// TODO Auto-generated constructor stub
	}

	@Override
	public String getTitle(Context context) {
		// TODO Auto-generated method stub
		return context.getResources().getString(R.string.user_login_title);
	}

	@Override
	public Menu getOptionsMenu(Context context, Menu m) {
		// TODO Auto-generated method stub
		m.add("Test");
		return m;
	}

}
