<?php

namespace App\Http\Controllers\Forms;

use Illuminate\Http\Request;
use Rossjcooper\LaravelHubSpot\HubSpot;
use App\Http\Controllers\Controller;

class HubspotSubmissionController extends Controller
{
	public function submission(Request $form_data){
		$form = $form_data->all();

		unset($form['form'][0]); //remove token

		$hubspot = app(HubSpot::class);

			
		$hb_form = array(
			'skipValidation' => true,
			"fields" => array()
		);

		foreach ($form['form'] as $field) {
			array_push($hb_form['fields'], array('name' => $field['name'], 'value' => $field['value']) );
		}

		$hubspot_status = $hubspot->forms()->submit($form['portal_id'], $form['hubspot_guid'], $hb_form);

		// return response()->json(['success' => true, 'details' => 'Form created in Hubspot']);
	}
}
