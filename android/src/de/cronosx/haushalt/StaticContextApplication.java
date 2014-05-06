package de.cronosx.haushalt;

import android.app.Application;
import android.content.Context;

/**
 * Used to provide a context in static methods
 * 
 * @author Soana (Andra Ruebsteck)
 *
 */
public class StaticContextApplication extends Application {

	public static Context context;
	
	public void onCreate(){
		context=getApplicationContext();
	}

}
