<?php

namespace App\Http\Controllers\Forms;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Rossjcooper\LaravelHubSpot\HubSpot;

class HubspotController extends Controller
{
	public function createForm(Request $form_data){
		$form = $form_data->all();
		$form_builder = json_decode($form['form_builder_json']);
		$hubspot = app(HubSpot::class);
		
		$hubspot_fields['formFieldGroups'] = array();
		$hubspot_form = array(
			'name' => $form['name'], 
			'submitText' => 'Submit',
			'formFieldGroups' => array()
		);
		
		$renderFormHubspot = $this->renderFormHubspot($form_builder);
		array_push($hubspot_form['formFieldGroups'], $renderFormHubspot);
		
		$hubspot_status = $hubspot->forms()->create($hubspot_form);
		return response()->json(['success' => true, 'details' => 'Form created in Hubspot', 'hubsput_guid' => $hubspot_status->data->guid, 'portal_id' => $hubspot_status->data->portalId]);
	}

	public function updateForm(Request $form_data){
		$form = $form_data->all();
		$form_builder = json_decode($form['form_builder_json']);
		$hubspot = app(HubSpot::class);
		$hubspot_fields['formFieldGroups'] = array();
		$hubspot_form = array(
			'name' => $form['name'], 
			'submitText' => 'Submit',
			'formFieldGroups' => array()
		);
		$renderFormHubspot = $this->renderFormHubspot($form_builder);
		array_push($hubspot_form['formFieldGroups'], $renderFormHubspot);
		
		$hubspot_status = $hubspot->forms()->update($form['hubspot_guid'], $hubspot_form);
		return response()->json(['success' => true, 'details' => 'Form updated in Hubspot', 'hubsput_guid' => $hubspot_status->data->guid]);
	}

	public function deleteForm(Request $form_data){
		$form = $form_data->all();
		$hubspot = app(HubSpot::class);
		$hubspot_status = $hubspot->forms()->delete($form['hubspot_guid']);
		return response()->json(['success' => true, 'details' => 'Form deleted in Hubspot']);
	}

	public function renderFormHubspot($form_builder){

		foreach ($form_builder->rows as $rows_key => $form_row) {
			$fields = array();
			foreach ($form_row->children as $row_children_key => $row_children) {

				foreach ($form_builder->columns->$row_children->children as $col_key => $col_children) {
					// Field
					$field_info = $form_builder->fields->$col_children;
					// If field has option
					if($field_info->meta->group === 'html') continue;
					if(isset($field_info->options) && !empty($field_info->options)){
						$option = $field_info->options;
					}else{
						$option = array();
					}

					// Field type
					if($field_info->tag === 'textarea' || $field_info->tag === 'select'){
						$field_type = $field_info->tag;
					}elseif($field_info->attrs->type === 'email'){
						$field_type = 'text';
					}else{
						$field_type = $field_info->attrs->type;
					}

					$fields[] = array(
						"name" => isset($field_info->attrs->name) && !empty($field_info->attrs->name) ? $field_info->attrs->name : $field_info->id,
						"label" => $field_info->config->label,
						// "type" =>"string",
						"fieldType" => $field_type,
						"groupName" => $field_info->meta->group,
						"required" => isset($field_info->attrs->required) && !empty($field_info->attrs->required) ? $field_info->attrs->required : false,
						"selectedOptions" => [],
						"options" => $option,
					);
				}
			}
			if (empty($fields)) continue; 
			$hubspot_fields['formFieldGroups'][] = array('fields' => $fields);
		}

		return $hubspot_fields['formFieldGroups'];
	}
}
