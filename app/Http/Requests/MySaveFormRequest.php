<?php

namespace App\Http\Requests;

use App\MyForm;
use jazmy\FormBuilder\Models\Form;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use jazmy\FormBuilder\Requests\SaveFormRequest;

class MySaveFormRequest extends SaveFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|max:100',
            'visibility' => ['required', Rule::in([Form::FORM_PUBLIC, Form::FORM_PRIVATE])],
            'allows_edit' => 'required|boolean',
            'form_builder_json' => 'required|json',
            'is_template' => 'boolean',
            'template_name' => 'max:100',
            'hubspot_guid' => 'max:100',
            'portal_id' => 'max:100'
        ];
    }
}
