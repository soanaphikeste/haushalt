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
import android.view.inputmethod.EditorInfo;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.TextView;

/**
 * Activity which displays a login screen to the user, offering registration as
 * well.
 */
public class HouseholdLoginActivity extends Activity {

	/**
	 * A dummy authentication store containing known user names and passwords.
	 * TODO: remove after connecting to a real authentication system.
	 */
	private static final String[] DUMMY_CREDENTIALS = new String[] { "foo@example.com:hello",
			"bar@example.com:world" };

	/**
	 * The default email to populate the email field with.
	 */
	public static final String EXTRA_EMAIL = "com.example.android.authenticatordemo.extra.EMAIL";
	public static final int PASSWD_LENGTH = 1;
	public static final String SAVE_NAME = "name";
	public static final String SAVE_PASSWD = "passwd";
	
	/**
	 * Keep track of the login task to ensure we can cancel it if requested.
	 */
	private UserLoginTask authTask = null;

	// Values for email and password at the time of the login attempt.
	private String email;
	private String password;

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
		email = getIntent().getStringExtra(EXTRA_EMAIL);
		txtName = (EditText) findViewById(R.id.household_login_name);
		txtName.setText(email);

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

		findViewById(R.id.household_login_login).setOnClickListener(new View.OnClickListener() {

			@Override
			public void onClick(View view) {
				attemptLogin();
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
		
		SharedPreferences.Editor prefs = getPreferences(MODE_PRIVATE).edit();
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
	 * Attempts to sign in or register the account specified by the login form.
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
		email = txtName.getText().toString();
		password = txtPasswd.getText().toString();

		boolean cancel = false;
		View focusView = null;

		// Check for a valid password.
		if (TextUtils.isEmpty(password)) {
			txtPasswd.setError(getString(R.string.error_field_required));
			focusView = txtPasswd;
			cancel = true;
		}
		else if (password.length() < PASSWD_LENGTH) {
			txtPasswd.setError(getString(R.string.error_invalid_password));
			focusView = txtPasswd;
			cancel = true;
		}

		// Check for a valid householdname.
		if (TextUtils.isEmpty(email)) {
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

	/**
	 * Represents an asynchronous login/registration task used to authenticate
	 * the user.
	 */
	public class UserLoginTask extends AsyncTask<Void, Void, Void> {
		private Integer okay = -1;
		
		@Override
		protected Void doInBackground(Void... params) {
			// TODO: attempt authentication against a network service.

			SharedPreferences pref = getSharedPreferences("server", MODE_PRIVATE);
			try {
				final Websocket socket = new Websocket(new Socket("cronosx.de", 5560));
				socket.addOpenListener(new OpenListener(){

					@Override
					public void onOpen() {
						System.out.println("-------------------------------------------------------------------");
						JSONObject jObj = new JSONObject();
						try {
							jObj.put("name", txtName.getText().toString());
							jObj.put("password", txtPasswd.getText().toString());
						}
						catch (JSONException e) {
							e.printStackTrace();
						}
//						JSONObject jObj = new JSONObject();
//						
//						try {
//							jObj.put("name", "Test");
//							jObj.put("password", "123");
//						}
//						catch (JSONException e1) {
//							// TODO Auto-generated catch block
//							e1.printStackTrace();
//						}
//						socket.send("Login", jObj, new ResponseListener() {
//							@Override
//							public void onResponse(JSONObject jObj) {
//								Log.d("Answer", "Received answer: " + jObj.toString());
//							}
//							
//						});
						socket.send("Login", jObj, new ResponseListener(){
							@Override
							public void onResponse(JSONObject jObj) {
								Log.i("Login", "[Login] recieved: " + jObj.toString());
								try {
									authTask = null;
									HouseholdLoginActivity.this.runOnUiThread(new Runnable(){
									    public void run(){
									    	showProgress(false);
									    }
									});
									if (jObj.getBoolean("okay")) {
										HouseholdLoginActivity.this.runOnUiThread(new Runnable(){
										    public void run(){
										    	Intent result = new Intent();
												result.putExtra("household", txtName.getText().toString());
												setResult(RESULT_OK, result);
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
								}
								catch (JSONException e) {
									e.printStackTrace();
								}
							}
							
						});
					}
					
				});
			}
			catch (UnknownHostException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			return null;
			
			// TODO: register the new account here.
			
		}
		
		@Override
		protected void onCancelled() {
			authTask = null;
			showProgress(false);
		}
	}
}
