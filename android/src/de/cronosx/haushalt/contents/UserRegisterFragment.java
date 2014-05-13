package de.cronosx.haushalt.contents;

import de.cronosx.contents.fragmentInteraction.OnUserRegistrationListener;
import de.cronosx.haushalt.R;
import de.cronosx.haushalt.R.layout;
import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

/**
 * A simple {@link android.support.v4.app.Fragment} subclass. Activities that
 * contain this fragment must implement the
 * {@link UserRegisterFragment.OnFragmentInteractionListener} interface to
 * handle interaction events. Use the {@link UserRegisterFragment#newInstance}
 * factory method to create an instance of this fragment.
 * 
 */
public class UserRegisterFragment extends Fragment {

	private OnUserRegistrationListener listener;

	/**
	 * Use this factory method to create a new instance of this fragment using
	 * the provided parameters.
	 * 
	 * @return A new instance of fragment UserRegisterFragment.
	 */
	public static UserRegisterFragment newInstance() {
		UserRegisterFragment fragment = new UserRegisterFragment();
		return fragment;
	}

	public UserRegisterFragment() {
		// Required empty public constructor
	}

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		//TODO: get GUI
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {
		// Inflate the layout for this fragment
		return inflater.inflate(R.layout.fragment_user_register, container,
				false);
	}

	@Override
	public void onAttach(Activity activity) {
		super.onAttach(activity);
		try {
			listener = (OnUserRegistrationListener) activity;
		} catch (ClassCastException e) {
			throw new ClassCastException(activity.toString()
					+ " must implement " + listener.getClass().getName());
		}
	}

	@Override
	public void onDetach() {
		super.onDetach();
		listener = null;
	}



}
