package de.cronosx.haushalt;

import java.io.IOException;
import java.net.Socket;
import java.net.UnknownHostException;

import org.json.JSONException;
import org.json.JSONObject;

import de.cronosx.haushalt.Websocket.OpenListener;
import de.cronosx.haushalt.Websocket.ResponseListener;
import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.TextView;

/**
 * Activity which displays a login screen to the user, offering registration as
 * well.
 */
public class HouseholdRegisterActivity extends Activity {
	
	public static final int PASSWD_LENGTH = 1;
	public static final String SAVE_NAME = "household_name";
	public static final String SAVE_PASSWD = "household_passwd";
	
	/**
	 * Keep track of the login task to ensure we can cancel it if requested.
	 */
	private AsyncTask<Void,Void,Void> authTask = null;

	// UI references.
	private EditText txtName;
	private EditText txtPasswd;
	private EditText txtPasswdRepeat;
	
	private View registerFormView;
	private View registerStatusView;
	
	private TextView registerStatusMessageView;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.activity_household_register);
		
		// Set up the login form.
		txtName = (EditText) findViewById(R.id.household_register_name);

		txtPasswd = (EditText) findViewById(R.id.household_register_passwd);
		
		txtPasswdRepeat = (EditText) findViewById(R.id.household_register_passwdRepeat);
		txtPasswdRepeat.setOnEditorActionListener(new TextView.OnEditorActionListener() {

			@Override
			public boolean onEditorAction(TextView textView, int id, KeyEvent keyEvent) {
				if (id == R.id.login || id == EditorInfo.IME_NULL) {
					attemptRegister();
					return true;
				}
				return false;
			}
		});
		
		registerFormView = findViewById(R.id.register_form);
		registerStatusView = findViewById(R.id.register_status);
		registerStatusMessageView = (TextView) findViewById(R.id.register_status_message);

		findViewById(R.id.household_register_register).setOnClickListener(new View.OnClickListener() {

			@Override
			public void onClick(View view) {
				attemptRegister();
			}
		});
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		super.onCreateOptionsMenu(menu);
		getMenuInflater().inflate(R.menu.household_register, menu);
		return true;
	}
	
	/**
	 * Attempts to sign in or register the account specified by the login form.
	 * If there are form errors (invalid email, missing fields, etc.), the
	 * errors are presented and no actual login attempt is made.
	 */
	public void attemptRegister() {
		if (authTask != null) {
			return;
		}

		// Reset errors.
		txtName.setError(null);
		txtPasswd.setError(null);
		txtPasswdRepeat.setError(null);

		// Store values at the time of the login attempt.
		String name = txtName.getText().toString();
		String password = txtPasswd.getText().toString();
		String password2 = txtPasswdRepeat.getText().toString();

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
		else{
			if (password2 == null || password2.length() == 0) {
				txtPasswdRepeat.setError(getString(R.string.error_field_required));
				focusView = txtPasswdRepeat;
				cancel = true;
			}
			else if (! password2.equals(password)) {
				txtPasswdRepeat.setError(getString(R.string.error_password_not_match));
				focusView = txtPasswdRepeat;
				cancel = true;
			}
		}

		// Check for a valid householdname.
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
			registerStatusMessageView.setText(R.string.register_status_message);
			showProgress(true);
			authTask = new UserRegisterTask();
			authTask.execute((Void) null);
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

			registerStatusView.setVisibility(View.VISIBLE);
			registerStatusView.animate().setDuration(shortAnimTime).alpha(show ? 1 : 0).setListener(new AnimatorListenerAdapter() {
						@Override
						public void onAnimationEnd(Animator animation) {
							registerStatusView.setVisibility(show ? View.VISIBLE : View.GONE);
						}
					});

			registerFormView.setVisibility(View.VISIBLE);
			registerFormView.animate().setDuration(shortAnimTime).alpha(show ? 0 : 1).setListener(new AnimatorListenerAdapter() {
						@Override
						public void onAnimationEnd(Animator animation) {
							registerFormView.setVisibility(show ? View.GONE : View.VISIBLE);
						}
					});
		}
		else {
			// The ViewPropertyAnimator APIs are not available, so simply show
			// and hide the relevant UI components.
			registerStatusView.setVisibility(show ? View.VISIBLE : View.GONE);
			registerFormView.setVisibility(show ? View.GONE : View.VISIBLE);
		}
	}

	/**
	 * Represents an asynchronous login/registration task used to authenticate
	 * the user.
	 */
	public class UserRegisterTask extends AsyncTask<Void, Void, Void> {
		
		@Override
		protected Void doInBackground(Void... params) {

			final Websocket socket = MainActivity.websocket;
			
			JSONObject jObj = new JSONObject();
			try {
				jObj.put("name", txtName.getText().toString());
				jObj.put("password", txtPasswd.getText().toString());
			}
			catch (JSONException e) {
				e.printStackTrace();
			}
			
			socket.send("Register", jObj, new ResponseListener(){
				@Override
				public void onResponse(JSONObject jObj) {
					try {
						authTask = null;
						HouseholdRegisterActivity.this.runOnUiThread(new Runnable(){
						    public void run(){
						    	showProgress(false);
						    }
						});  
						if (jObj.getBoolean("okay")) {
							HouseholdRegisterActivity.this.runOnUiThread(new Runnable(){
							    public void run(){
							    	Intent params = new Intent();
							    	params.putExtra("name", txtName.getText().toString());
							    	
							    	setResult(RESULT_OK, params);
									finish();
							    }
							});
							
						}
						else {
							HouseholdRegisterActivity.this.runOnUiThread(new Runnable(){
							    public void run(){
							    	txtName.setError(getString(R.string.error_name_exists));
									txtName.requestFocus();
							    }
							});
							
						}
					}
					catch (JSONException e) {
						e.printStackTrace();
					}
				}
			});
		
			return null;
		}
		
		@Override
		protected void onCancelled() {
			authTask = null;
			showProgress(false);
		}
	}
	
}