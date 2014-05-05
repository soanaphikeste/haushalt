package de.cronosx.haushalt;

import java.io.*;
import java.net.*;
import java.util.*;

import org.json.JSONException;
import org.json.JSONObject;

import de.cronosx.websocket.ClientWebsocket;
import de.cronosx.websocket.CloseHandler;
import de.cronosx.websocket.MessageHandler;
import de.cronosx.websocket.OpenHandler;

import android.util.Log;
import android.util.SparseArray;


public class Websocket {

	private Map<String, RequestListener> requestListeners;
	private SparseArray<ResponseListener> responseListeners;
	private int currentID;
	private ClientWebsocket websocket;

	private List<OpenListener> openListeners;
	private List<CloseListener> closeListeners;
	
	public Websocket(final Socket socket) throws IOException {
		websocket = new ClientWebsocket(socket);
		websocket.addOpenHandler(new OpenHandler() {
			@Override
			public void onOpen() {
				Websocket.this.onOpen();
			}
		});
		websocket.addCloseHandler(new CloseHandler() {
			@Override
			public void onClose() {
				Websocket.this.onClose();
				
			}
		});
		websocket.addMessageHandler(new MessageHandler() {
			@Override
			public void onMessage(String msg) {
				Websocket.this.onMessage(msg);
			}
		});
		websocket.listen();
		this.currentID = 0;
		this.requestListeners = new HashMap<String, RequestListener>();
		this.responseListeners = new SparseArray<ResponseListener>();
		this.openListeners = new LinkedList<OpenListener>();
	}


	
	private void onOpen() {
		for(OpenListener l : openListeners) {
			l.onOpen();
		}
	}
	
	private void onMessage(String msg) {
		Log.d("Websocket" ,"Received: " + msg);
		try {
			JSONObject jObj = new JSONObject(msg);
			if(jObj.has("_type"))
			{
				String type = jObj.getString("_type");
				if(type.equals("Request")) {
					if(jObj.has("_requestID") && jObj.has("_responseID")) {
						String requestID = jObj.getString("_requestID");
						String responseID = jObj.getString("_responseID");
						if(this.requestListeners.containsKey(requestID)) {
							JSONObject answer = this.requestListeners.get(requestID).onRequest(jObj);
							if(answer == null) answer = new JSONObject();
							answer.put("_responseID", responseID);
							answer.put("_type", "Response");
							String string = answer.toString();
							websocket.send(string);
						}
					}
				}
				else if(type.equals("Response")) {
					if(jObj.has("_responseID")) {
						int responseID = jObj.getInt("_responseID");
						ResponseListener l;
						if((l =this.responseListeners.get(responseID)) != null) {
							l.onResponse(jObj);
						}
					}
				}
					
			}
		}
		catch (JSONException e) {
			e.printStackTrace();
		}
	}
	
	private void onClose() {
		for(CloseListener l : closeListeners) {
			l.onClose();
		}
	}
	
	public void addListener(String request, RequestListener l) {
		this.requestListeners.put(request, l);
	}
	
	public void send(String requestID, JSONObject jObj, ResponseListener listener) {
		try {
			jObj.put("_type", "Request");
			jObj.put("_requestID", requestID);
			jObj.put("_responseID", this.currentID++);
			String string = jObj.toString();
			websocket.send(string);
		} 
		catch (JSONException e) {
			e.printStackTrace();
		}
	}

	public void addOpenListener(OpenListener listener) {
		this.openListeners.add(listener);
	}
	
	public void addCloseListener(CloseListener listener) {
		this.closeListeners.add(listener);
	}
	
	public void send(String request, JSONObject jObj) {
		this.send(request, jObj, null);
	}
	
	public static interface RequestListener {
		public JSONObject onRequest(JSONObject jObj);
	}
	
	public static interface ResponseListener {
		public void onResponse(JSONObject jObj);
	}

	public static interface OpenListener {
		public void onOpen();
	}
	public static interface CloseListener {
		public void onClose();
	}
}

