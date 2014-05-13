package de.cronosx.contents.fragmentInteraction;

import org.json.JSONException;
import org.json.JSONObject;

import de.cronosx.haushalt.MainActivity;
import de.cronosx.haushalt.Websocket;
import de.cronosx.haushalt.Websocket.ResponseListener;
import android.os.AsyncTask;

/**
 * Represents an asynchronous login task used to authenticate
 * the user.
 */
public class LoginTask extends AsyncTask<String, Void, Void> {
	
	private OnLoginListener caller;
	
	public LoginTask(OnLoginListener caller){
		this.caller = caller;
	}
	
	/**
	 * Parameters must be: "household" or "user", the name and the password, with which to log in
	 */
	@Override
	protected Void doInBackground(final String... params) {
		if(params.length != 3){
			throw new IllegalArgumentException("Must have exactly 3 Arguments: mode, name and password");
		}
		
		JSONObject jObj = new JSONObject();
		try {
			jObj.put("name", params[1]);
			jObj.put("password", params[2]);
		}
		catch (JSONException e) {
			e.printStackTrace();
		}
		String command = null;
		if(params[0].toLowerCase().startsWith("u")){
			command = "LoginUser";
		}
		else if(params[0].toLowerCase().startsWith("h")){
			command = "Login";
		}
		else{
			throw new IllegalArgumentException(params[0] + " is not a valid login mode");
		}
		
		MainActivity.websocket.send(command, jObj, new ResponseListener(){
			@Override
			public void onResponse(JSONObject jObj) {
				try {
					if (jObj.getBoolean("okay")) {
						caller.onSuccessfulLogin(params[1]);
						
					}
					else {
						caller.onFailedLogin();
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
		caller.onCanceledLogin();
	}
}
