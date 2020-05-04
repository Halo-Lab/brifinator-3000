<?php

namespace App;

use App\User;
use jazmy\FormBuilder\Models\Submission;
use jazmy\FormBuilder\Models\Form;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class MyForm extends Form
{
    /**
     * Get an array containing the name of the fields in the form and their label
     *
     * @return Illuminate\Support\Collection
     */
    public function getEntriesHeader() : Collection
    {

        return collect($this->form_builder_array['fields'])
        ->filter(function ($entry) {
            if($entry['meta']['group'] === 'common'){
                return ! empty($entry['config']['label']);
            }
        })
        ->map(function ($entry) {
            // dd($entry);
            return [
                'name' => $entry['attrs']['name'],
                'label' => $entry['config']['label'] ?? null,
                'type' => $entry['attrs']['type'] ?? null,
            ];
        });
    }
}
