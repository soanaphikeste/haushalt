package de.cronosx.haushalt.contents;

import de.cronosx.contents.fragmentInteraction.LoginTask;
import de.cronosx.contents.fragmentInteraction.OnLoginListener;
import de.cronosx.contents.fragmentInteraction.OnUserLoginFragmentListener;
import de.cronosx.haushalt.Constants;
import de.cronosx.haushalt.R;
import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.View;
import android.view.ViewGroup;
import android.view.View.OnClickListener;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.TextView;

/**
 * A simple {@link android.support.v4.app.Fragment} subclass. Activities that
 * contain this fragment must implement the
 * {@link UserRegisterFragment.OnFragmentInteractionListener} interface to
 * handle interaction events. Use the {@link UserRegisterFragment#newInstance}
 * factory method to create an instance of this fragment.
 * 
 */
public class UserLoginFragment extends DisplayFragment implements OnLoginListener{
	
	public static final int REGISTER_CODE = 1;
	
	public static final int PASSWD_LENGTH = 1;
	public static final String SAVE_NAME = "user_name";
	public static final String SAVE_PASSWD = "user_passwd";
	
	/**
	 * Keep track of the login task to ensure we can cancel it if requested.
	 */
	private LoginTask authTask = null;

	// UI references.
	private EditText txtName;
	private EditText txtPasswd;
	
	private CheckBox cbxRememberMe;
	
	private View loginFormView;
	private View loginStatusView;
	
	private TextView loginStatusMessageView;
	
	private Activity activity;
	private OnUserLoginFragmentListener listener;

	/**
	 * Use this factory method to create a new instance of this fragment using
	 * the provided parameters.
	 * 
	 * @return A new instance of fragment UserLoginFragment.
	 */
	public static UserLoginFragment newInstance() {
		UserLoginFragment fragment = new UserLoginFragment();
		return fragment;
	}

	public UserLoginFragment() {
		// Required empty public constructor
	}

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
		activity = getActivity();
		
		// Set up the login form.
		txtName = (EditText) activity.findViewById(R.id.user_login_name);
		System.out.println(txtName == null);
		txtPasswd = (EditText) activity.findViewById(R.id.user_login_passwd);
		txtPasswd.setOnEditorActionListener(new TextView.OnEditorActionListener() {

			@Override
			public boolean onEditorAction(TextView textView, int id, KeyEvent keyEvent) {
				if (id == R.id.login || id == EditorInfo.IME_NULL) {
					attemptLogin();
					return true;
				}
				return false;
			}
		});
		
		cbxRememberMe = (CheckBox) activity.findViewById(R.id.user_login_remember);
		
		loginFormView = activity.findViewById(R.id.user_login_form);
		loginStatusView = activity.findViewById(R.id.user_login_status);
		loginStatusMessageView = (TextView) activity.findViewById(R.id.user_login_status_message);

		Button btnLogin = (Button) activity.findViewById(R.id.user_login_login);
		btnLogin.setOnClickListener(new View.OnClickListener() {

			@Override
			public void onClick(View view) {
				attemptLogin();
			}
		});
		
		SharedPreferences prefs = activity.getSharedPreferences(Constants.loggInPrefs, Activity.MODE_PRIVATE);
		String name = prefs.getString(SAVE_NAME, null);
		String passwd = prefs.getString(SAVE_PASSWD, null);
		if(name != null && passwd != null){
			txtName.setText(name);
			txtPasswd.setText(passwd);
			cbxRememberMe.setChecked(true);
			btnLogin.performClick();
		}
		
		activity.findViewById(R.id.user_login_register).setOnClickListener(new OnClickListener(){
			@Override
			public void onClick(View v) {
				listener.onUserRegisterWish();
			}
			
		});
		
		// Inflate the layout for this fragment
		Log.d("UserLoginInflate", "" + (container == null));
		return inflater.inflate(R.layout.fragment_user_login, container,
				false);
	}

	@Override
	public void onAttach(Activity activity) {
		super.onAttach(activity);
		try {
			listener = (OnUserLoginFragmentListener) activity;
		} catch (ClassCastException e) {
			throw new ClassCastException(activity.toString()
					+ " must implement OnUserLoginListener");
		}
	}

	@Override
	public void onDetach() {
		super.onDetach();
		listener = null;
	}
	
	@Override
	public void onStop(){
		super.onStop();
		
		SharedPreferences.Editor prefs = activity.getSharedPreferences("user", Activity.MODE_PRIVATE).edit();
		if(cbxRememberMe.isChecked()){
			prefs.putString(SAVE_NAME, txtName.getText().toString());
			prefs.putString(SAVE_PASSWD, txtPasswd.getText().toString());
		}
		else{
			prefs.remove(SAVE_NAME);
			prefs.remove(SAVE_PASSWD);
		}
		prefs.commit();
	}
	
	/**
	 * Attempts to sign in the account specified by the login form.
	 * If there are form errors (invalid email, missing fields, etc.), the
	 * errors are presented and no actual login attempt is made.
	 */
	public void attemptLogin() {
		if (authTask != null) {
			return;
		}

		// Reset errors.
		txtName.setError(null);
		txtPasswd.setError(null);

		// Store values at the time of the login attempt.
		String name = txtName.getText().toString();
		String password = txtPasswd.getText().toString();

		boolean cancel = false;
		View focusView = null;

		// Check for a valid password.
		if (password == null || password.length() == 0) {
			txtPasswd.setError(getString(R.string.error_field_required));
			focusView = txtPasswd;
			cancel = true;
		}
		else if (password.length() < PASSWD_LENGTH) {
			txtPasswd.setError(getString(R.string.error_invalid_password));
			focusView = txtPasswd;
			cancel = true;
		}

		// Check for a valid household name.
		if (name == null || name.length() == 0) {
			txtName.setError(getString(R.string.error_field_required));
			focusView = txtName;
			cancel = true;
		}
		//TODO perform check for valid household name?
//		else if (!email.contains("@")) {
//			txtName.setError(getString(R.string.error_invalid_email));
//			focusView = txtName;
//			cancel = true;
//		}

		if (cancel) {
			// There was an error; don't attempt login and focus the first
			// form field with an error.
			focusView.requestFocus();
		}
		else {
			// Show a progress spinner, and kick off a background task to
			// perform the user login attempt.
			loginStatusMessageView.setText(R.string.login_progress_signing_in);
			showProgress(true);
			authTask = new LoginTask(this);
			authTask.execute("household", txtName.getText().toString(), txtPasswd.getText().toString());
		}
	}
	
	/**
	 * Shows the progress UI and hides the login form.
	 */
	@TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
	private void showProgress(final boolean show) {
		// On Honeycomb MR2 we have the ViewPropertyAnimator APIs, which allow
		// for very easy animations. If available, use these APIs to fade-in
		// the progress spinner.
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR2) {
			int shortAnimTime = getResources().getInteger(android.R.integer.config_shortAnimTime);

			loginStatusView.setVisibility(View.VISIBLE);
			loginStatusView.animate().setDuration(shortAnimTime).alpha(show ? 1 : 0).setListener(new AnimatorListenerAdapter() {
						@Override
						public void onAnimationEnd(Animator animation) {
							loginStatusView.setVisibility(show ? View.VISIBLE : View.GONE);
						}
					});

			loginFormView.setVisibility(View.VISIBLE);
			loginFormView.animate().setDuration(shortAnimTime).alpha(show ? 0 : 1).setListener(new AnimatorListenerAdapter() {
						@Override
						public void onAnimationEnd(Animator animation) {
							loginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
						}
					});
		}
		else {
			// The ViewPropertyAnimator APIs are not available, so simply show
			// and hide the relevant UI components.
			loginStatusView.setVisibility(show ? View.VISIBLE : View.GONE);
			loginFormView.setVisibility(show ? View.GONE : View.VISIBLE);
		}
	}
	@Override
	public String getTitle(Context context) {
		return context.getResources().getString(R.string.user_login_title);
	}

	@Override
	public Menu getOptionsMenu(Context context, Menu m) {
		//TODO: OptionsMenu for UserLogin
		return m;
	}

	@Override
	public void onSuccessfulLogin(String name) {
		authTask = null;
		listener.onLogin(name);
		showProgress(false);
	}

	@Override
	public void onFailedLogin() {
		authTask = null;
		activity.runOnUiThread(new Runnable(){
		    public void run(){
		    	txtPasswd.setError(getString(R.string.error_incorrect_password));
				txtPasswd.requestFocus();
				showProgress(false);
		    }
		});
	}

	@Override
	public void onCanceledLogin() {
		authTask = null;
		showProgress(false);
	}

}
