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
public class HouseholdLoginActivity extends Activity {
	public static final int REGISTER_CODE = 1;
	
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
	
	private CheckBox cbxRememberMe;
	
	private View loginFormView;
	private View loginStatusView;
	
	private TextView loginStatusMessageView;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.activity_household_login);
		
		// Set up the login form.
		txtName = (EditText) findViewById(R.id.household_login_name);

		txtPasswd = (EditText) findViewById(R.id.household_login_passwd);
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
		
		cbxRememberMe = (CheckBox) findViewById(R.id.household_login_remember);
		
		loginFormView = findViewById(R.id.login_form);
		loginStatusView = findViewById(R.id.login_status);
		loginStatusMessageView = (TextView) findViewById(R.id.login_status_message);

		Button btnLogin = (Button) findViewById(R.id.household_login_login);
		btnLogin.setOnClickListener(new View.OnClickListener() {

			@Override
			public void onClick(View view) {
				attemptLogin();
			}
		});
		
		SharedPreferences prefs = getSharedPreferences(Constants.loggInPrefs, MODE_PRIVATE);
		String name = prefs.getString(SAVE_NAME, null);
		String passwd = prefs.getString(SAVE_PASSWD, null);
		if(name != null && passwd != null){
			txtName.setText(name);
			txtPasswd.setText(passwd);
			cbxRememberMe.setChecked(true);
			btnLogin.performClick();
		}
		
		findViewById(R.id.household_login_register).setOnClickListener(new OnClickListener(){
			@Override
			public void onClick(View v) {
				Intent intent = new Intent(HouseholdLoginActivity.this, HouseholdRegisterActivity.class);
				HouseholdLoginActivity.this.startActivityForResult(intent, REGISTER_CODE);
			}
			
		});
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		super.onCreateOptionsMenu(menu);
		getMenuInflater().inflate(R.menu.household_login, menu);
		return true;
	}

	protected void onStop(){
		super.onStop();
		
		SharedPreferences.Editor prefs = getSharedPreferences("user", MODE_PRIVATE).edit();
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
			authTask = new UserLoginTask();
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
	protected void onActivityResult(int requestCode, int resultCode, Intent data){
		switch(requestCode){
			case REGISTER_CODE: 
				if(resultCode == RESULT_OK){
					txtName.setText(data.getStringExtra("name"));
				}
				break;
			default:
				//Where did this come from?!
		}
	}
	
	
	/**
	 * Represents an asynchronous login task used to authenticate
	 * the user.
	 */
	public class UserLoginTask extends AsyncTask<Void, Void, Void> {
		
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
			
			socket.send("Login", jObj, new ResponseListener(){
				@Override
				public void onResponse(JSONObject jObj) {
					try {
						authTask = null;
						
						if (jObj.getBoolean("okay")) {
							HouseholdLoginActivity.this.runOnUiThread(new Runnable(){
							    public void run(){
							    	Intent intent = new Intent(HouseholdLoginActivity.this, MainActivity.class);
									intent.putExtra("household", txtName.getText().toString());
									startActivity(intent);
									finish();
							    }
							});
							
						}
						else {
							HouseholdLoginActivity.this.runOnUiThread(new Runnable(){
							    public void run(){
							    	txtPasswd.setError(getString(R.string.error_incorrect_password));
									txtPasswd.requestFocus();
							    }
							});
							
						}
						HouseholdLoginActivity.this.runOnUiThread(new Runnable(){
						    public void run(){
						    	showProgress(false);
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
		
		@Override
		protected void onCancelled() {
			authTask = null;
			showProgress(false);
		}
	}
	
}